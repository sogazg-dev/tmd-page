// Paso único: mueve la lista de personajes de src/pages/Wiki.js a
// src/data/personajes.js para que el administrador pueda editarla.
import fs from 'fs';
import path from 'path';
import { RAIZ, seccion, leerTexto, escribirArchivo } from './datos.mjs';

const wikiRuta = path.join(RAIZ, 'src/pages/Wiki.js');
const destino = path.join(RAIZ, 'src/data/personajes.js');
let wiki = fs.readFileSync(wikiRuta, 'utf8');
if (fs.existsSync(destino)) { console.log('personajes.js ya existe; nada que hacer.'); process.exit(0); }

const ini = wiki.indexOf('personajesData={[');
const fin = wiki.indexOf(']}', ini);
const arreglo = wiki.slice(ini + 'personajesData={'.length, fin + 1);
const imports = wiki.match(/^import\s+\w+\s+from\s+['"]\.\.\/assets\/images\/wiki\/[^'"]+['"];?[ \t]*$/gm);

const encabezado = `// ============================================================================
//  PERSONAJES de la Wiki (/wiki/personajes)
// ============================================================================
//  Se edita más fácil con el administrador:  npm run wiki-admin
//  Cada personaje: nombre, imagen (la tarjeta, 590 × 1004 px, en
//  src/assets/images/wiki/), serie (DMB, LB, CW, Creepy, PD o JA) y
//  descripcion (se ve al voltear la tarjeta).
// ============================================================================`;
const fuente = `${encabezado}\n${imports.join('\n')}\n\nconst personajes = ${arreglo};\n\nexport default personajes;\n`;
const { items } = leerTexto(fuente, destino);

// Archivo inicial con los mismos nombres de import, luego se reescribe con formato
fs.writeFileSync(destino, `${encabezado}\n${imports.join('\n')}\n\nconst personajes = [];\n\nexport default personajes;\n`);
escribirArchivo(seccion('personajes'), items);
fs.rmSync(path.join(RAIZ, '.respaldos-wiki'), { recursive: true, force: true });

// Wiki.js: usa el archivo nuevo
for (const l of imports) wiki = wiki.replace(l + '\n', '');
wiki = wiki.replace(wiki.slice(ini, fin + 2), 'personajesData={personajes}');
wiki = wiki.replace("import Footer from '../components/Footer';", "import Footer from '../components/Footer';\nimport personajes from '../data/personajes';");
fs.writeFileSync(wikiRuta, wiki);
console.log(`${items.length} personajes movidos a src/data/personajes.js`);
