import React from 'react';

// ============================================================================
//  Íconos propios (SVG) para toda la página y el juego.
// ============================================================================
//  Se usan en vez de emojis o símbolos (▶ ◀ 🔒 ...) porque cada sistema los
//  dibuja distinto; en iPhone, por ejemplo, ▶ sale como emoji de botón azul.
//  Toman el color del texto (currentColor) y miden 1em, como una letra.
//
//  Uso:  <Icono nombre="play" />   <Icono nombre="candado" className="x" />
// ============================================================================

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

const DIBUJOS = {
  // triángulos (play, flechas de dirección y desplegables)
  play: <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" fill="currentColor" />,
  izquierda: <path d="M17 4.5v15a1 1 0 0 1-1.5.86l-12.4-7.5a1 1 0 0 1 0-1.72l12.4-7.5A1 1 0 0 1 17 4.5z" fill="currentColor" />,
  derecha: <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" fill="currentColor" />,
  arriba: <path d="M4.5 17h15a1 1 0 0 0 .86-1.5l-7.5-12.4a1 1 0 0 0-1.72 0l-7.5 12.4A1 1 0 0 0 4.5 17z" fill="currentColor" />,
  abajo: <path d="M4.5 7h15a1 1 0 0 1 .86 1.5l-7.5 12.4a1 1 0 0 1-1.72 0l-7.5-12.4A1 1 0 0 1 4.5 7z" fill="currentColor" />,
  pausa: (
    <g fill="currentColor">
      <rect x="5" y="4" width="5" height="16" rx="1.2" />
      <rect x="14" y="4" width="5" height="16" rx="1.2" />
    </g>
  ),
  // flechas de teclado
  flechaIzq: <path d="M20 12H5M11 5l-7 7 7 7" {...S} />,
  flechaDer: <path d="M4 12h15M13 5l7 7-7 7" {...S} />,
  flechaAbajo: <path d="M12 4v15M5 13l7 7 7-7" {...S} />,
  externo: <path d="M8 6h10v10M18 6L6 18" {...S} />,
  descargar: <path d="M12 3v12M6 10l6 6 6-6M4 20h16" {...S} />,
  expandir: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" {...S} />,
  mas: <path d="M12 5v14M5 12h14" {...S} />,
  menos: <path d="M5 12h14" {...S} />,
  cerrar: <path d="M6 6l12 12M18 6L6 18" {...S} />,
  // juego y estados
  candado: (
    <g>
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2" fill="currentColor" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" {...S} />
    </g>
  ),
  candadoAbierto: (
    <g>
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2" fill="currentColor" />
      <path d="M8 10.5V7.5a4 4 0 0 1 7.7-1.5" {...S} />
    </g>
  ),
  casa: <path d="M3.5 11.5L12 4l8.5 7.5M6 10v10h4.5v-5.5h3V20H18V10" {...S} />,
  reintentar: <path d="M19 12a7 7 0 1 1-2.05-4.95M19 4v4.5h-4.5" {...S} />,
  infinito: <path d="M12 12c-2-2.6-3.6-4-5.5-4a4 4 0 0 0 0 8c1.9 0 3.5-1.4 5.5-4s3.6-4 5.5-4a4 4 0 0 1 0 8c-1.9 0-3.5-1.4-5.5-4z" {...S} />,
  check: <path d="M4.5 12.5l5 5L19.5 6.5" {...S} strokeWidth={3.2} />,
  escudo: <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6L12 3z" fill="currentColor" />,
  nota: <path d="M9 18.5a2.8 2.8 0 1 1-2.8-2.8H9V4.5l10-2v13a2.8 2.8 0 1 1-2.8-2.8H19" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />,
  like: <path d="M7 10.5V20H4V10.5h3zM7 10.5l4-7c1.6 0 2.4 1.2 2 2.8L12.4 9.5H18a2 2 0 0 1 2 2.3l-1.2 6.4A2 2 0 0 1 16.8 20H7" {...S} strokeWidth={2.2} />,
  explosion: <path d="M12 2l2 6 5-3-2 5.5 5 1.5-5 2 3 5-5.5-2L12 22l-2-5-5.5 2 3-5-5.5-2 5-1.5L5 5l5 3 2-6z" fill="currentColor" />,
  trofeo: (
    <g>
      <path d="M7 3.5h10v5.5a5 5 0 0 1-10 0V3.5z" fill="currentColor" />
      <path d="M7 5.5H4.5v1.5a3 3 0 0 0 3 3M17 5.5h2.5v1.5a3 3 0 0 1-3 3M12 14v3.5M8 20.5h8" {...S} strokeWidth={2.2} />
    </g>
  ),
  // instalar como app y avisos
  campana: <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2H4.5L6 16.5zM10 20.5a2 2 0 0 0 4 0" {...S} strokeWidth={2.2} />,
  celular: <path d="M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5zM10.5 18.5h3" {...S} strokeWidth={2.2} />,
  compartir: <path d="M12 3v12M7.5 7.5L12 3l4.5 4.5M8 11H6v9.5h12V11h-2" {...S} strokeWidth={2.2} />,
  puntos: <path d="M12 5.5v.01M12 12v.01M12 18.5v.01" {...S} strokeWidth={3.6} />,
  instalar: <path d="M3.5 4.5h17v11h-17zM8.5 19.5h7M12 7.5v5M9.5 10.5l2.5 2.5 2.5-2.5" {...S} strokeWidth={2} />,
  gafas: (
    <g>
      <path d="M2.5 9h19" {...S} />
      <path d="M3.5 9h7v3.5a3.5 3.5 0 0 1-7 0V9zM13.5 9h7v3.5a3.5 3.5 0 0 1-7 0V9z" fill="currentColor" />
    </g>
  ),
};

const Icono = ({ nombre, className = '', titulo }) => (
  <svg
    className={`icono icono--${nombre}${className ? ` ${className}` : ''}`}
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    role={titulo ? 'img' : undefined}
    aria-label={titulo}
    aria-hidden={titulo ? undefined : true}
    focusable="false"
    style={{ display: 'inline-block', verticalAlign: '-0.125em', flexShrink: 0 }}
  >
    {DIBUJOS[nombre] || null}
  </svg>
);

export default Icono;
