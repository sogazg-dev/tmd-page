import React from 'react';
import mapas from '../../data/mapaLugares';

// Piezas compartidas por el mapa de Lugares y su vista de pantalla completa.

// La ruta se dibuja en un SVG de 100 × 75 (el mapa es 4:3), así no se deforma.
const ALTO = 75;
// Curva suave que pasa por todos los puntos (Catmull-Rom → Bézier)
const curva = (pts) => {
  const p = pts.map(([x, y]) => [x, (y * ALTO) / 100]);
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i += 1) {
    const a = p[i - 1] || p[i];
    const b = p[i];
    const c = p[i + 1];
    const e = p[i + 2] || c;
    const c1 = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6];
    const c2 = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6];
    d += ` C${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${c[0]} ${c[1]}`;
  }
  return d;
};

/** Ruta amarilla del lugar elegido (si tiene una en mapaLugares.js). */
export const CapaRuta = ({ mapa, sel }) => {
  const ruta = (mapa.rutas || []).find((r) => r.lugar === sel);
  if (!ruta) return null;
  const tramos = ruta.tramos.map((t, i) => ({
    d: curva(t),
    fin: t[t.length - 1],
    // el principal se dibuja primero; los demás salen cuando llega a la unión
    estilo: { '--retraso': i === 0 ? '0s' : '0.35s', '--duracion': i === 0 ? '1.1s' : '0.8s' },
  }));
  // Primero todos los bordes y luego todas las líneas: así en la unión no se
  // ve el borde de un tramo encima del otro.
  return (
    <svg key={ruta.lugar} className="mapa-ruta" viewBox={`0 0 100 ${ALTO}`} aria-hidden="true">
      {tramos.map((t, i) => (
        <path key={`b${i}`} className="mapa-ruta__borde" d={t.d} pathLength="100" style={t.estilo} />
      ))}
      {tramos.map((t, i) => (
        <path key={`l${i}`} className="mapa-ruta__linea" d={t.d} pathLength="100" style={t.estilo} />
      ))}
      {tramos.map((t, i) => (
        <circle key={`f${i}`} className="mapa-ruta__fin" cx={t.fin[0]} cy={(t.fin[1] * ALTO) / 100} r="0.9" style={t.estilo} />
      ))}
    </svg>
  );
};

/** Puntos de los lugares, lugares secretos y la tubería (van encima de la imagen). */
export const CapaPuntos = ({ mapa, puntos, sel, elegir, viajar, precargarDestino, bloqueado }) => {
  // bloqueado(): true justo después de arrastrar el mapa (para no abrir un lugar sin querer)
  const click = (fn) => () => { if (!bloqueado || !bloqueado()) fn(); };
  return (
    <>
      <CapaRuta mapa={mapa} sel={sel} />
      {puntos.map((p) => (
        <button
          type="button"
          key={p.lugar}
          className={`mapa-punto${sel === p.lugar ? ' is-activo' : ''}`}
          style={{ left: `${p.x}%`, top: `${p.y}%`, '--gema': p.color }}
          onClick={click(() => elegir(p.lugar))}
          aria-pressed={sel === p.lugar}
          aria-label={p.lugar}
        >
          <span className="mapa-punto__gema" aria-hidden="true" />
          <span className="mapa-punto__nombre" aria-hidden="true">{p.lugar}</span>
        </button>
      ))}

      {mapa.secretos.map((s, i) => (
        <button
          type="button"
          key={`${s.x}-${s.y}`}
          className={`mapa-punto mapa-punto--secreto${sel === `secreto-${i}` ? ' is-activo' : ''}`}
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          onClick={click(() => elegir(`secreto-${i}`))}
          aria-label="Lugar sin descubrir"
        >
          <span className="mapa-punto__gema" aria-hidden="true">?</span>
          <span className="mapa-punto__nombre" aria-hidden="true">¿¿¿???</span>
        </button>
      ))}

      <button
        type="button"
        className="mapa-portal"
        style={{ left: `${mapa.portal.x}%`, top: `${mapa.portal.y}%` }}
        onClick={click(viajar)}
        onPointerEnter={precargarDestino}
        onFocus={precargarDestino}
        aria-label={`${mapa.portal.texto}: viajar a ${mapas[mapa.portal.a].titulo}`}
      >
        <span className="mapa-portal__anillo" aria-hidden="true" />
        <span className="mapa-punto__nombre" aria-hidden="true">{mapa.portal.texto}</span>
      </button>
    </>
  );
};

/** Tarjeta con la foto y la descripción del lugar elegido. */
export const TarjetaLugar = React.forwardRef(({ lugar, secreto, onCerrar, className = '' }, ref) => (
  <article ref={ref} className={`mapa-tarjeta ${className}`} aria-live="polite">
    <button type="button" className="mapa-tarjeta__cerrar" onClick={onCerrar} aria-label="Cerrar">×</button>
    {lugar && !secreto ? (
      <>
        {lugar.imagen && <img className="mapa-tarjeta__img" src={lugar.imagen} alt="" />}
        <div className="mapa-tarjeta__texto">
          <h3>{lugar.nombre}</h3>
          <p>{lugar.descripcion}</p>
        </div>
      </>
    ) : (
      <div className="mapa-tarjeta__texto mapa-tarjeta__texto--secreto">
        <span className="mapa-tarjeta__candado" aria-hidden="true">?</span>
        <h3>Lugar sin descubrir</h3>
        <p>Este lugar todavía no se ha revelado. Sigue las series para descubrir qué se esconde aquí.</p>
      </div>
    )}
  </article>
));
