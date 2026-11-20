// ============================================================================
//  Lectura y escritura de los archivos de datos de la Wiki (src/data/*.js)
// ============================================================================
//  Lee cada archivo tal como lo usa la página (imports de imágenes, rutas de
//  public/, etc.) y lo vuelve a escribir con el mismo formato.
// ============================================================================
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const RESPALDOS = path.join(RAIZ, '.respaldos-wiki');

export const SERIES = ['DMB', 'LB', 'CW', 'Creepy', 'PD', 'JA'];
export const LOGOS = {
  DMB: 'src/assets/images/logo/LogoDMB.png',
  LB: 'src/assets/images/logo/LogoLB.png',
  CW: 'src/assets/images/logo/LogoCW.png',
  Creepy: 'src/assets/images/logo/LogoCreepy.png',
  PD: 'src/assets/images/logo/LogoPD.png',
  JA: 'src/assets/images/logo/LogoJA.png',
  TMD: 'src/assets/images/logo/logotmd.jpg',
};

// carpeta: dónde se guardan las imágenes nuevas ({slug} = nombre de la tarjeta)
export const SECCIONES = [
  { id: 'series', titulo: 'Series', archivo: 'src/data/series.js', variable: 'series', carpeta: 'src/assets/images/logo', ruta: '/wiki/series', series: SERIES, ayudaImagen: 'Logo de la serie' },
  { id: 'personajes', titulo: 'Personajes', archivo: 'src/data/personajes.js', variable: 'personajes', carpeta: 'src/assets/images/wiki', ruta: '/wiki/personajes', series: SERIES, ayudaImagen: 'Imagen de la tarjeta (vertical, como las demás: 590 × 1004 px)' },
  { id: 'lugares', titulo: 'Lugares', archivo: 'src/data/lugares.js', variable: 'lugares', carpeta: 'src/assets/images/wiki/lugares', ruta: '/wiki/lugares', series: SERIES, ayudaImagen: 'Imagen del lugar (horizontal, recomendado 800 × 500 px)' },
  { id: 'objetos', titulo: 'Objetos', archivo: 'src/data/objetos.js', variable: 'objetos', carpeta: 'src/assets/images/wiki/objetos', ruta: '/wiki/objetos', series: SERIES, ayudaImagen: 'Imagen del objeto (horizontal, recomendado 800 × 500 px)' },
  { id: 'museo', titulo: 'Museo', archivo: 'src/data/museo.js', variable: 'museo', carpeta: 'public/wiki/museo/{slug}', ruta: '/wiki/museo', series: [...SERIES, 'TMD'], extras: true, ayudaImagen: 'Imagen de la tarjeta' },
];

export const seccion = (id) => SECCIONES.find((s) => s.id === id);
const abs = (rel) => path.join(RAIZ, ...rel.split('/'));
const rel = (p) => path.relative(RAIZ, p).split(path.sep).join('/');

// --------------------------------------------------------------------------
//  LEER
// --------------------------------------------------------------------------
const SRC = '@src:';
const PUB = '@public:';

function normalizar(v, clave) {
  if (Array.isArray(v)) return v.map((x) => normalizar(x));
  if (v && typeof v === 'object') {
    const o = {};
    for (const [k, x] of Object.entries(v)) o[k] = normalizar(x, k);
    return o;
  }
  if (typeof v === 'string' && (clave === 'imagen' || clave === 'src')) {
    if (v.startsWith(SRC)) return v.slice(SRC.length);
    if (v.startsWith(PUB)) return 'public/' + v.slice(PUB.length).replace(/^\/+/, '');
  }
  return v;
}

/** Lee un archivo de datos y devuelve { encabezado, nombresImport, items }. */
export function leerArchivo(archivoRel) {
  const ruta = abs(archivoRel);
  const txt = fs.readFileSync(ruta, 'utf8');
  return leerTexto(txt, ruta);
}

export function leerTexto(txt, ruta) {
  const nombresImport = {};
  let cuerpo = txt.replace(/^import\s+(\w+)\s+from\s+['"]([^'"]+)['"];?[ \t]*$/gm, (m, nombre, r) => {
    const p = rel(path.resolve(path.dirname(ruta), r));
    nombresImport[p] = nombre;
    return `const ${nombre} = ${JSON.stringify(SRC + p)};`;
  });
  cuerpo = cuerpo.replace(/export\s+default\s+(\w+)\s*;?/, 'return $1;');
  // eslint-disable-next-line no-new-func
  const items = new Function('process', cuerpo)({ env: { PUBLIC_URL: PUB } });
  if (!Array.isArray(items)) throw new Error(`${rel(ruta)} no exporta una lista`);

  // Comentario del inicio del archivo (se conserva tal cual)
  const lineas = txt.split('\n');
  const enc = [];
  for (const l of lineas) {
    if (/^\s*(import|const|export)\b/.test(l)) break;
    enc.push(l);
  }
  while (enc.length && !enc[enc.length - 1].trim()) enc.pop();
  return { encabezado: enc.join('\n'), nombresImport, items: normalizar(items) };
}

// --------------------------------------------------------------------------
//  ESCRIBIR
// --------------------------------------------------------------------------
const str = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r/g, '').replace(/\n/g, '\\n')}'`;

function identificador(ruta, usados) {
  const base = path.basename(ruta).replace(/\.[^.]+$/, '');
  let id = base
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .split(/[^A-Za-z0-9]+/).filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');
  if (!id || /^\d/.test(id)) id = 'Img' + id;
  let final = id;
  for (let n = 2; usados.has(final); n++) final = id + n;
  usados.add(final);
  return final;
}

/** Escribe la lista como archivo .js (con respaldo y verificación). */
export function escribirArchivo(sec, items) {
  const ruta = abs(sec.archivo);
  const anterior = fs.existsSync(ruta) ? leerArchivo(sec.archivo) : { encabezado: '', nombresImport: {} };
  const dirArchivo = path.dirname(ruta);

  // Imports: se conservan los nombres que ya existían
  const imports = new Map();
  const usados = new Set();
  for (const nombre of Object.values(anterior.nombresImport)) usados.add(nombre);
  let usaPublico = false;
  const refImagen = (p) => {
    if (typeof p !== 'string' || !p) return "''";
    if (p.startsWith('public/')) {
      usaPublico = true;
      return '`${PUBLICO}/' + p.slice('public/'.length).replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
    }
    if (p.startsWith('src/')) {
      if (!imports.has(p)) {
        const previo = anterior.nombresImport[p];
        imports.set(p, previo || identificador(p, usados));
      }
      return imports.get(p);
    }
    return str(p);
  };

  const valor = (v, sangria, clave) => {
    if (clave === 'imagen' || clave === 'src') return refImagen(v);
    if (Array.isArray(v)) {
      if (!v.length) return '[]';
      const pad = ' '.repeat(sangria + 2);
      return '[\n' + v.map((x) => pad + valor(x, sangria + 2) + ',').join('\n') + '\n' + ' '.repeat(sangria) + ']';
    }
    if (v && typeof v === 'object') {
      const entradas = Object.entries(v).filter(([, x]) => x !== undefined);
      const simple = entradas.every(([, x]) => typeof x !== 'object' || x === null);
      if (simple && sangria > 4) return '{ ' + entradas.map(([k, x]) => `${k}: ${valor(x, sangria, k)}`).join(', ') + ' }';
      const pad = ' '.repeat(sangria + 2);
      return '{\n' + entradas.map(([k, x]) => `${pad}${k}: ${valor(x, sangria + 2, k)},`).join('\n') + '\n' + ' '.repeat(sangria) + '}';
    }
    if (typeof v === 'number' || typeof v === 'boolean' || v === null) return String(v);
    return str(v);
  };

  const ORDEN = ['nombre', 'imagen', 'serie', 'descripcion'];
  const cuerpo = items.map((it) => {
    const o = {};
    for (const k of ORDEN) if (it[k] !== undefined) o[k] = it[k];
    for (const [k, x] of Object.entries(it)) {
      if (ORDEN.includes(k)) continue;
      if (Array.isArray(x) && !x.length) continue; // sin galería/enlaces vacíos
      o[k] = x;
    }
    return '  ' + valor(o, 2) + ',';
  }).join('\n');

  const lineas = [];
  if (anterior.encabezado) lineas.push(anterior.encabezado);
  for (const [p, nombre] of imports) {
    let r = path.relative(dirArchivo, abs(p)).split(path.sep).join('/');
    if (!r.startsWith('.')) r = './' + r;
    lineas.push(`import ${nombre} from '${r}';`);
  }
  lineas.push('');
  if (usaPublico) lineas.push('const PUBLICO = process.env.PUBLIC_URL;', '');
  lineas.push(`const ${sec.variable} = [`, cuerpo, '];', '', `export default ${sec.variable};`, '');
  const texto = lineas.join('\n');

  // Verifica que el archivo nuevo se lea igual antes de guardarlo
  const relee = leerTexto(texto, ruta).items;
  if (canon(relee) !== canon(limpiar(items))) {
    throw new Error('El archivo generado no coincide con los datos; no se guardó nada.');
  }

  if (fs.existsSync(ruta)) {
    fs.mkdirSync(RESPALDOS, { recursive: true });
    const marca = new Date().toISOString().replace(/[:.]/g, '-');
    fs.copyFileSync(ruta, path.join(RESPALDOS, `${path.basename(ruta, '.js')}-${marca}.js`));
  }
  const tmp = ruta + '.tmp';
  fs.writeFileSync(tmp, texto, 'utf8');
  fs.renameSync(tmp, ruta);
  return texto;
}

// JSON con llaves ordenadas (para comparar sin importar el orden)
const canon = (v) => JSON.stringify(v, (k, x) => (x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map((c) => [c, x[c]]))
  : x));

// Quita listas vacías (igual que al escribir) para comparar
function limpiar(items) {
  return items.map((it) => {
    const o = {};
    for (const [k, x] of Object.entries(it)) {
      if (x === undefined) continue;
      if (Array.isArray(x) && !x.length && !['nombre', 'imagen', 'serie', 'descripcion'].includes(k)) continue;
      o[k] = x;
    }
    return o;
  });
}

// --------------------------------------------------------------------------
//  IMÁGENES NUEVAS
// --------------------------------------------------------------------------
export const slug = (s) => String(s || 'imagen')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  .slice(0, 60) || 'imagen';

const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg' };

/** Guarda una imagen (data URL) sin modificarla y devuelve su ruta relativa. */
export function guardarImagen(sec, nombreTarjeta, dataUrl, sufijo = '') {
  const m = /^data:([^;]+);base64,(.+)$/s.exec(dataUrl || '');
  if (!m || !EXT[m[1]]) throw new Error('Formato de imagen no permitido (usa PNG, JPG, WEBP, GIF o SVG).');
  const carpeta = abs(sec.carpeta.replace('{slug}', slug(nombreTarjeta)));
  fs.mkdirSync(carpeta, { recursive: true });
  const base = slug(nombreTarjeta) + (sufijo ? '-' + sufijo : '');
  let nombre = `${base}.${EXT[m[1]]}`;
  for (let n = 2; fs.existsSync(path.join(carpeta, nombre)); n++) nombre = `${base}-${n}.${EXT[m[1]]}`;
  fs.writeFileSync(path.join(carpeta, nombre), Buffer.from(m[2], 'base64'));
  return rel(path.join(carpeta, nombre));
}

/** Ruta absoluta segura para servir imágenes del proyecto (solo src/assets y public). */
export function rutaSegura(r) {
  const p = path.resolve(RAIZ, String(r || ''));
  const permitido = [path.join(RAIZ, 'src', 'assets'), path.join(RAIZ, 'public')];
  if (!permitido.some((d) => p.startsWith(d + path.sep))) return null;
  return fs.existsSync(p) && fs.statSync(p).isFile() ? p : null;
}
