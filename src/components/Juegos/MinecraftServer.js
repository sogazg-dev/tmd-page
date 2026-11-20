import React, { useEffect } from 'react';
import mundo from '../../assets/images/juegos/minecraft/mundo-templo.webp';
import coopTMD2 from '../../assets/images/juegos/minecraft/tmd2-coop.webp';
import coopOswaldo from '../../assets/images/juegos/minecraft/oswaldogd-coop.webp';
import './MinecraftServer.scss';

// Link para hacerse miembro del canal TMD2
const MIEMBROS_URL = 'https://www.youtube.com/@TMD2.0/join';

// Letras pixeladas al estilo del juego (solo se cargan en esta página)
const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap';
const useMinecraftFont = () => {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
};

// Íconos en pixel art (12 × 12), al estilo de los objetos de Minecraft, en vez de
// emojis (cada sistema los dibuja distinto). Cada letra es un color; '.' = vacío.
const COLORES = {
  k: '#1b1b1b', w: '#f2efe6', p: '#d9c9a3', b: '#4a8fd6', g: '#5aa84a', r: '#c8432f',
  m: '#7a5230', s: '#9aa3ad', d: '#5d656e', y: '#e0b33a',
};
const PIXEL = {
  mapa: [
    '.kkkkkkkkkk.',
    'kpppbbppgppk',
    'kppbbbbpgppk',
    'kpbbgbbbpppk',
    'kpbgggbbprpk',
    'kppbbgbbrrrk',
    'kpppbbbpprpk',
    'kgppppbbpppk',
    'kgggpppbbppk',
    'kpggppppbbpk',
    'kppppppppbpk',
    '.kkkkkkkkkk.',
  ],
  espada: [
    '..........kk',
    '.........kwk',
    '........kwsk',
    '.......kwsk.',
    '..k...kwsk..',
    '.kyk.kwsk...',
    '..kykwsk....',
    '...kydk.....',
    '..kmkyk.....',
    '.kmk.kyk....',
    'kdk...k.....',
    '.k..........',
  ],
  micro: [
    '....kkkk....',
    '...kssssk...',
    '...ksdsdk...',
    '...kdsdsk...',
    '...ksdsdk...',
    '.k.kssssk.k.',
    '.k..kkkk..k.',
    '..k......k..',
    '...kkkkkk...',
    '.....kk.....',
    '...kkkkkk...',
    '............',
  ],
  escudo: [
    'kkkkkkkkkkkk',
    'kbbbbyybbbbk',
    'kbbbbyybbbbk',
    'kbbbyyyybbbk',
    'kyyyyyyyyyyk',
    'kyyyyyyyyyyk',
    'kbbbyyyybbbk',
    '.kbbbyybbbk.',
    '.kbbbyybbbk.',
    '..kbbyybbk..',
    '...kbyybk...',
    '....kkkk....',
  ],
};
const PixelIcono = ({ nombre }) => {
  const filas = PIXEL[nombre];
  return (
    <svg viewBox="0 0 12 12" width="1em" height="1em" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {filas.flatMap((fila, y) => [...fila.replace(/ /g, '')].map((c, x) => (COLORES[c]
        ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={COLORES[c]} />
        : null)))}
    </svg>
  );
};

const CARACTERISTICAS = [
  { icono: 'mapa', titulo: 'El mundo de la serie', texto: 'La misma seed del let\'s play co-op de Rodrigo con NuggetMaster y La Chingada. Una copia intacta, con las mismas estructuras.' },
  { icono: 'espada', titulo: 'Supervivencia', texto: 'Explora, construye y sobrevive en ese mismo mundo, a tu ritmo y con la comunidad.' },
  { icono: 'micro', titulo: 'Chat de proximidad', texto: 'Opcional: escucha y habla con quien tengas cerca, como si estuvieras ahí.' },
  { icono: 'escudo', titulo: 'Espacio seguro', texto: 'Jugadores conocidos de la comunidad de TMD y nuevos miembros que quieren ser parte de ella.' },
];

const PASOS = [
  { n: 1, titulo: 'Hazte miembro de TMD2', texto: 'Únete como miembro del canal de YouTube TMD2.' },
  { n: 2, titulo: 'Solicita tu invitación', texto: 'Ya como miembro, pide tu invitación al server.' },
  { n: 3, titulo: '¡A explorar!', texto: 'Te compartiremos la invitación para que entres al mundo.' },
];

// Sección "Server Dimensional" (server de Minecraft) (abajo de la página de Juegos)
const MinecraftServer = () => {
  useMinecraftFont();
  return (
    <section className="mc" id="server-minecraft" aria-labelledby="mc-titulo">
      <div className="mc__pasto" aria-hidden="true" />
      <div className="mc__inner">
        <header className="mc__head">
          <h2 id="mc-titulo" className="mc__titulo">Server Dimensional</h2>
          <span className="mc__splash" aria-hidden="true">Con amor para la mamá de Carlos &lt;3</span>
          <p className="mc__intro">
            Este servidor de Minecraft está hecho para los fans más grandes de TMD. Está construido sobre la seed donde
            Rodrigo (TMD) hizo su let&apos;s play co-op junto con NuggetMaster y La Chingada:
            el mismo mundo, con las mismas estructuras que viste en la serie.
          </p>
        </header>

        <figure className="mc__mundo mc-panel">
          <img src={mundo} alt="El mundo del server: un templo del desierto como en la serie" loading="lazy" />
          <figcaption>Las mismas estructuras que en la serie… ¿las reconoces?</figcaption>
        </figure>

        <ul className="mc__features">
          {CARACTERISTICAS.map((c) => (
            <li key={c.titulo} className="mc-slot">
              <span className="mc-slot__icono" aria-hidden="true"><PixelIcono nombre={c.icono} /></span>
              <strong>{c.titulo}</strong>
              <span>{c.texto}</span>
            </li>
          ))}
        </ul>

        <div className="mc__creadores">
          <h3 className="mc__subtitulo">Creado por TMD2 y OswaldoGD</h3>
          <div className="mc__creadores-grid">
            <img className="mc-panel" src={coopTMD2} alt="Jueguemos A: Minecraft Co-op — TMD2" loading="lazy" />
            <img className="mc-panel" src={coopOswaldo} alt="Jueguemos A: Minecraft Co-op — OswaldoGD" loading="lazy" />
          </div>
        </div>

        <p className="mc__misterio">
          Y esto no es todo lo que ofrece, no se sabe qué esconden los alrededores de este mundo.
        </p>

        <div className="mc__unirse mc-panel">
          <h3 className="mc__subtitulo">¿Cómo entrar?</h3>
          <ol className="mc__pasos">
            {PASOS.map((p) => (
              <li key={p.n}>
                <span className="mc__num">{p.n}</span>
                <span>
                  <strong>{p.titulo}</strong>
                  {p.texto}
                </span>
              </li>
            ))}
          </ol>
          <a className="mc-boton" href={MIEMBROS_URL} target="_blank" rel="noopener noreferrer">
            Hazte miembro de TMD2
          </a>
          <p className="mc__nota">
            El server no es abierto para cuidar el límite de jugadores y mantener un buen ambiente.
            Los invitados son miembros reconocidos de la comunidad, y cualquiera puede unirse siendo
            miembro de TMD2.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MinecraftServer;
