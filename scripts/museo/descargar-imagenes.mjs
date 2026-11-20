// ============================================================================
//  Descarga las imágenes del Museo a partir de museo-discord.json
//  (el archivo que genera scripts/museo/recolectar-discord.js en el navegador)
// ============================================================================
//  Uso (Node 18+, sin instalar nada), dentro de la carpeta tmd-page:
//    node scripts/museo/descargar-imagenes.mjs ~/Downloads/museo-discord.json
//
//  Resultado en export/museo-discord/ (no se sube a GitHub):
//    - mensajes.json  los mensajes con el nombre de su imagen local
//    - archivos/      las imágenes descargadas
//  Hazlo el mismo día: los links de imágenes de Discord caducan en ~24 horas.
// ============================================================================
import fs from 'fs';
import path from 'path';

const entrada = process.argv[2];
if (!entrada) {
  console.error('Uso: node scripts/museo/descargar-imagenes.mjs <ruta de museo-discord.json>');
  process.exit(1);
}
const datos = JSON.parse(fs.readFileSync(entrada.replace(/^~/, process.env.HOME), 'utf8'));
const OUT = path.join(process.cwd(), 'export', 'museo-discord');
const FILES = path.join(OUT, 'archivos');
fs.mkdirSync(FILES, { recursive: true });

// Prefiere el archivo original (cdn) en lugar de la miniatura (media) si hay ambos
const original = (u) => u.replace('media.discordapp.net', 'cdn.discordapp.com').replace(/([?&])(width|height|format|quality)=[^&]*/g, '$1').replace(/[?&]+$/, '');
const extension = (u) => (u.split('?')[0].match(/\.(png|jpe?g|gif|webp|mp4|mov)$/i) || ['.png'])[0].toLowerCase();

let ok = 0;
let fallos = 0;
for (const m of datos.mensajes) {
  const vistos = new Set();
  m.archivos = [];
  for (const [i, url] of m.imagenes.entries()) {
    const clave = original(url).split('?')[0];
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    const nombre = `${m.id}_${i}${extension(url)}`;
    const destino = path.join(FILES, nombre);
    if (!fs.existsSync(destino)) {
      let res = await fetch(original(url)).catch(() => null);
      if (!res || !res.ok) res = await fetch(url).catch(() => null);
      if (!res || !res.ok) {
        fallos += 1;
        console.warn(`⚠ No se pudo bajar la imagen del mensaje ${m.id}`);
        continue;
      }
      fs.writeFileSync(destino, Buffer.from(await res.arrayBuffer()));
    }
    m.archivos.push(nombre);
    ok += 1;
    process.stdout.write(`  ${ok} imágenes…\r`);
  }
}
fs.writeFileSync(path.join(OUT, 'mensajes.json'), JSON.stringify(datos, null, 2));
console.log(`\nListo: ${ok} imágenes en ${FILES}${fallos ? ` (${fallos} fallaron)` : ''}`);
