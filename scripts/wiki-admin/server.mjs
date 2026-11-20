// ============================================================================
//  Administrador de la Wiki (solo local)
// ============================================================================
//  Uso:   npm run wiki-admin      ->  http://localhost:4321
//  Lee y escribe los archivos de src/data/ (series, personajes, lugares,
//  objetos y museo). Con `npm start` corriendo, la página se actualiza sola
//  al guardar.
// ============================================================================
import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import {
  SECCIONES, LOGOS, seccion, leerArchivo, escribirArchivo, guardarImagen, rutaSegura,
} from './datos.mjs';

const PUERTO = Number(process.env.PUERTO) || 4321;
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const TIPOS = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg' };

const responder = (res, codigo, datos) => {
  res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(datos));
};

const leerCuerpo = (req) => new Promise((ok, mal) => {
  const partes = [];
  let total = 0;
  req.on('data', (c) => {
    total += c.length;
    if (total > 80 * 1024 * 1024) { mal(new Error('Archivo demasiado grande (máx. 80 MB).')); req.destroy(); }
    partes.push(c);
  });
  req.on('end', () => {
    try { ok(JSON.parse(Buffer.concat(partes).toString('utf8') || '{}')); } catch (e) { mal(new Error('Datos inválidos')); }
  });
});

const lista = (sec) => leerArchivo(sec.archivo).items;

// Busca la tarjeta por posición y nombre (por si el archivo cambió mientras tanto)
function ubicar(items, indice, original) {
  if (items[indice] && items[indice].nombre === original) return indice;
  const i = items.findIndex((x) => x.nombre === original);
  if (i === -1) throw Object.assign(new Error(`La tarjeta "${original}" ya no existe en el archivo. Recarga la sección.`), { codigo: 409 });
  return i;
}

// Reemplaza "nuevo:<clave>" por la ruta de la imagen guardada
function guardarNuevas(sec, item, imagenes) {
  let n = 0;
  const resolver = (v, sufijo) => {
    if (typeof v === 'string' && v.startsWith('nuevo:')) {
      const data = imagenes[v.slice(6)];
      if (!data) throw new Error('Falta una imagen nueva.');
      n += 1;
      return guardarImagen(sec, item.nombre, data, sufijo);
    }
    return v;
  };
  item.imagen = resolver(item.imagen, '');
  if (Array.isArray(item.galeria)) {
    item.galeria = item.galeria.map((g, i) => ({ ...g, src: resolver(g.src, String(i + 1)) }));
  }
  return n;
}

function validar(sec, item, items, indice) {
  const nombre = String(item.nombre || '').trim();
  if (!nombre) throw new Error('La tarjeta necesita un nombre.');
  if (items.some((x, i) => i !== indice && x.nombre.trim().toLowerCase() === nombre.toLowerCase())) {
    throw new Error(`Ya existe una tarjeta llamada "${nombre}" en ${sec.titulo}.`);
  }
  if (!item.imagen) throw new Error('La tarjeta necesita una imagen.');
  if (!sec.series.includes(item.serie)) throw new Error('Elige una serie.');
  item.nombre = nombre;
  item.descripcion = String(item.descripcion || '').replace(/\r/g, '').trim();
}

async function api(req, res, url) {
  const partes = url.pathname.split('/').filter(Boolean); // api, seccion, id, accion
  if (partes[1] === 'secciones') {
    return responder(res, 200, {
      logos: LOGOS,
      secciones: SECCIONES.map((s) => {
        let total = null; let error = null;
        try { total = lista(s).length; } catch (e) { error = e.message; }
        return { ...s, total, error };
      }),
    });
  }
  const sec = seccion(partes[2]);
  if (partes[1] !== 'seccion' || !sec) return responder(res, 404, { error: 'Sección no encontrada' });

  if (req.method === 'GET') return responder(res, 200, { items: lista(sec) });

  const datos = await leerCuerpo(req);
  const items = lista(sec);

  if (partes[3] === 'guardar') {
    const nuevo = datos.indice === null || datos.indice === undefined;
    const indice = nuevo ? null : ubicar(items, datos.indice, datos.original);
    const item = { ...(nuevo ? {} : items[indice]), ...datos.item };
    validar(sec, item, items, indice);
    guardarNuevas(sec, item, datos.imagenes || {});
    if (nuevo) items.push(item); else items[indice] = item;
    escribirArchivo(sec, items);
    return responder(res, 200, { ok: true, items: lista(sec), mensaje: `${nuevo ? 'Agregada' : 'Guardada'}: "${item.nombre}" en ${sec.archivo}` });
  }

  if (partes[3] === 'eliminar') {
    const indice = ubicar(items, datos.indice, datos.original);
    const [quitado] = items.splice(indice, 1);
    escribirArchivo(sec, items);
    return responder(res, 200, { ok: true, items: lista(sec), mensaje: `Eliminada: "${quitado.nombre}" de ${sec.archivo}` });
  }

  return responder(res, 404, { error: 'Acción no encontrada' });
}

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (url.pathname === '/archivo') {
      const p = rutaSegura(url.searchParams.get('ruta'));
      if (!p) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': TIPOS[path.extname(p).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      return fs.createReadStream(p).pipe(res);
    }
    if (url.pathname === '/' || url.pathname === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end(fs.readFileSync(path.join(AQUI, 'index.html')));
    }
    res.writeHead(404); return res.end();
  } catch (e) {
    console.error(e);
    return responder(res, e.codigo || 400, { error: e.message });
  }
});

// Solo se puede abrir desde esta computadora
servidor.listen(PUERTO, '127.0.0.1', () => {
  const dir = `http://localhost:${PUERTO}`;
  console.log(`\n  Administrador de la Wiki: ${dir}\n  (Ctrl + C para cerrarlo)\n`);
  if (!process.env.NO_ABRIR) {
    const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'explorer' : 'xdg-open';
    try { spawn(cmd, [dir], { stdio: 'ignore', detached: true }).on('error', () => {}).unref(); } catch (e) { /* sin navegador */ }
  }
});
