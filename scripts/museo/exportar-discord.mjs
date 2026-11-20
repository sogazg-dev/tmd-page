// ============================================================================
//  Exporta un canal de Discord (texto o foro) para el Museo de la Wiki.
// ============================================================================
//  Usa un BOT de Discord (permitido por Discord; no uses tu cuenta personal).
//  No necesita instalar nada: solo Node 18 o más nuevo.
//
//  Uso:
//    DISCORD_BOT_TOKEN="tu-token" node scripts/museo/exportar-discord.mjs <ID-del-canal>
//
//  Resultado (carpeta export/museo-discord/, no se sube a GitHub):
//    - mensajes.json   todos los mensajes en orden (texto, autor, fecha, hilo)
//    - archivos/       todas las imágenes y archivos adjuntos, descargados
// ============================================================================
import fs from 'fs';
import path from 'path';

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CHANNEL = process.argv[2];
if (!TOKEN || !CHANNEL) {
  console.error('Uso: DISCORD_BOT_TOKEN="..." node scripts/museo/exportar-discord.mjs <ID-del-canal>');
  process.exit(1);
}

const API = 'https://discord.com/api/v10';
const OUT = path.join(process.cwd(), 'export', 'museo-discord');
const FILES = path.join(OUT, 'archivos');
fs.mkdirSync(FILES, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Llamada a la API respetando los límites de velocidad de Discord
async function api(url) {
  for (;;) {
    const res = await fetch(API + url, { headers: { Authorization: `Bot ${TOKEN}` } });
    if (res.status === 429) {
      const body = await res.json().catch(() => ({}));
      await sleep(((body.retry_after || 1) * 1000) + 250);
      continue;
    }
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Discord respondió ${res.status} en ${url}: ${txt}`);
    }
    return res.json();
  }
}

// Todos los mensajes de un canal o hilo, del más viejo al más nuevo
async function todosLosMensajes(channelId) {
  const out = [];
  let before = '';
  for (;;) {
    const page = await api(`/channels/${channelId}/messages?limit=100${before ? `&before=${before}` : ''}`);
    out.push(...page);
    if (page.length < 100) break;
    before = page[page.length - 1].id;
    process.stdout.write(`  ${out.length} mensajes…\r`);
  }
  return out.reverse();
}

const limpio = (s) => s.replace(/[^\w.\-]+/g, '_').slice(0, 80);

async function descargar(url, nombre) {
  const destino = path.join(FILES, nombre);
  if (fs.existsSync(destino)) return nombre;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar ${url} (${res.status})`);
  fs.writeFileSync(destino, Buffer.from(await res.arrayBuffer()));
  return nombre;
}

async function procesar(mensajes, hilo) {
  const out = [];
  for (const m of mensajes) {
    const adjuntos = [];
    for (const a of m.attachments || []) {
      const nombre = `${m.id}_${limpio(a.filename)}`;
      try {
        adjuntos.push({ archivo: await descargar(a.url, nombre), tipo: a.content_type || '', ancho: a.width, alto: a.height });
      } catch (e) {
        console.warn('\n  ⚠', e.message);
      }
    }
    // imágenes de embeds (links a imágenes pegados en el chat)
    for (const [i, e] of (m.embeds || []).entries()) {
      const img = (e.image && e.image.url) || (e.thumbnail && e.thumbnail.url);
      if (!img) continue;
      const ext = (img.split('?')[0].match(/\.(png|jpe?g|gif|webp)$/i) || ['.png'])[0];
      try {
        adjuntos.push({ archivo: await descargar(img, `${m.id}_embed${i}${ext}`), tipo: 'embed', titulo: e.title || '', descripcion: e.description || '' });
      } catch (err) {
        console.warn('\n  ⚠', err.message);
      }
    }
    out.push({
      id: m.id,
      hilo: hilo || null,
      fecha: m.timestamp,
      autor: m.author ? (m.author.global_name || m.author.username) : '',
      texto: m.content || '',
      responde_a: m.message_reference ? m.message_reference.message_id : null,
      adjuntos,
    });
  }
  return out;
}

const canal = await api(`/channels/${CHANNEL}`);
console.log(`Canal: #${canal.name} (tipo ${canal.type})`);
let resultado = [];

if (canal.type === 15 || canal.type === 16) {
  // Canal de foro: cada publicación es un hilo
  const activos = await api(`/guilds/${canal.guild_id}/threads/active`);
  const hilos = activos.threads.filter((t) => t.parent_id === CHANNEL);
  let antes = '';
  for (;;) {
    const arch = await api(`/channels/${CHANNEL}/threads/archived/public?limit=100${antes ? `&before=${encodeURIComponent(antes)}` : ''}`);
    hilos.push(...arch.threads);
    if (!arch.has_more || !arch.threads.length) break;
    antes = arch.threads[arch.threads.length - 1].thread_metadata.archive_timestamp;
  }
  console.log(`${hilos.length} publicaciones en el foro`);
  for (const t of hilos) {
    console.log(`- ${t.name}`);
    resultado.push(...await procesar(await todosLosMensajes(t.id), t.name));
  }
} else {
  // Canal de texto normal (+ los hilos que salgan de él)
  resultado = await procesar(await todosLosMensajes(CHANNEL), null);
  const activos = await api(`/guilds/${canal.guild_id}/threads/active`).catch(() => ({ threads: [] }));
  for (const t of activos.threads.filter((x) => x.parent_id === CHANNEL)) {
    resultado.push(...await procesar(await todosLosMensajes(t.id), t.name));
  }
}

fs.writeFileSync(path.join(OUT, 'mensajes.json'), JSON.stringify({ canal: canal.name, exportado: new Date().toISOString(), mensajes: resultado }, null, 2));
const n = resultado.reduce((s, m) => s + m.adjuntos.length, 0);
console.log(`\nListo: ${resultado.length} mensajes y ${n} archivos en ${OUT}`);
