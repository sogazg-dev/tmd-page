import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import mapas from '../../data/mapaLugares';
import Icono from '../Iconos';
import { CapaPuntos, TarjetaLugar } from './MapaPiezas';
import MapaCompleto from './MapaCompleto';
import './MapaLugares.scss';

// ============================================================================
//  Mapa interactivo de Lugares (arriba del listado en /wiki/lugares)
// ============================================================================
//  - Toca un punto para ver la información del lugar.
//  - Los puntos con "?" son lugares que aún no se revelan.
//  - La tubería lleva al otro mapa con una transición de "cambio de dimensión".
//  - "Pantalla completa" abre el mapa con zoom (MapaCompleto.js).
//  Datos y posiciones: src/data/mapaLugares.js
// ============================================================================

const DURACION_SALIDA = 650;  // ms: la cámara se mete a la tubería
const DURACION_ENTRADA = 700; // ms: aparece el otro mapa
const precargadas = {};
const precargar = (src) => {
  if (precargadas[src]) return;
  const im = new Image();
  im.src = src;
  precargadas[src] = im;
};

const MapaLugares = ({ lugares }) => {
  const [mapaId, setMapaId] = useState('reino');
  const [sel, setSel] = useState(null);       // nombre del lugar elegido, o 'secreto-<n>'
  const [viaje, setViaje] = useState(null);   // { fase: 'sale' | 'entra', x, y }
  const [completo, setCompleto] = useState(false);
  const tarjetaRef = useRef(null);
  const marcoRef = useRef(null);
  const timers = useRef([]);
  const mapa = mapas[mapaId];
  const reducido = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const porNombre = useMemo(() => {
    const m = {};
    lugares.forEach((l) => { m[l.nombre] = l; });
    return m;
  }, [lugares]);
  const puntos = mapa.puntos.filter((p) => porNombre[p.lugar]);
  const esSecreto = Boolean(sel) && sel.startsWith('secreto-');
  const lugar = sel && !esSecreto ? porNombre[sel] : null;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Esc cierra la tarjeta (en pantalla completa, Esc cierra el mapa completo)
  useEffect(() => {
    if (!sel || completo) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setSel(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sel, completo]);

  // Pantalla completa: el botón "atrás" del celular la cierra en vez de salir de la página
  const abrirCompleto = () => {
    precargar(mapa.imagen.completa);
    try { window.history.pushState({ ...(window.history.state || {}), mapaCompleto: true }, ''); } catch (e) { /* sin historial */ }
    setCompleto(true);
  };
  const cerrarCompleto = useCallback(() => {
    if (window.history.state && window.history.state.mapaCompleto) window.history.back();
    else setCompleto(false);
  }, []);
  useEffect(() => {
    if (!completo) return undefined;
    const onPop = () => setCompleto(false);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [completo]);

  // En celular, al elegir un lugar se baja a su tarjeta (va debajo del mapa)
  useEffect(() => {
    if (completo || !sel || !tarjetaRef.current || !window.matchMedia('(max-width: 899px)').matches) return;
    const r = tarjetaRef.current.getBoundingClientRect();
    if (r.bottom > window.innerHeight - 90) {
      window.scrollBy({ top: Math.min(r.top - 80, r.bottom - window.innerHeight + 110), behavior: reducido ? 'auto' : 'smooth' });
    }
  }, [sel, reducido, completo]);

  const elegir = (nombre) => setSel((s) => (s === nombre ? null : nombre));

  // Viaje por la tubería: se mete la cámara, cambia el mapa y aparece el nuevo
  const viajar = useCallback(() => {
    if (viaje) return;
    const destino = mapas[mapa.portal.a];
    precargar(completo ? destino.imagen.completa : window.innerWidth > 900 ? destino.imagen.grande : destino.imagen.chica);
    setSel(null);
    if (reducido) { setMapaId(mapa.portal.a); return; }
    setViaje({ fase: 'sale', x: mapa.portal.x, y: mapa.portal.y });
    timers.current.push(setTimeout(() => {
      setMapaId(mapa.portal.a);
      setViaje({ fase: 'entra', x: destino.portal.x, y: destino.portal.y });
      timers.current.push(setTimeout(() => setViaje(null), DURACION_ENTRADA));
    }, DURACION_SALIDA));
  }, [viaje, mapa, reducido, completo]);

  // precarga el otro mapa cuando el usuario se acerca a la tubería
  const precargarDestino = () => {
    const destino = mapas[mapa.portal.a];
    precargar(completo ? destino.imagen.completa : window.innerWidth > 900 ? destino.imagen.grande : destino.imagen.chica);
  };

  const origen = viaje ? `${viaje.x}% ${viaje.y}%` : undefined;

  return (
    <section className="mapa-lugares" aria-label="Mapa de lugares">
      <div className="mapa-lugares__cabeza">
        <h2 className="mapa-lugares__titulo">{mapa.titulo}</h2>
        <p className="mapa-lugares__ayuda">Toca un lugar del mapa para ver su información.</p>
        <button type="button" className="mapa-lugares__completo" onClick={abrirCompleto}>
          <Icono nombre="expandir" /> Pantalla completa
        </button>
      </div>

      <div className={`mapa-lugares__cuerpo${lugar || esSecreto ? ' con-tarjeta' : ''}`}>
        <div
          ref={marcoRef}
          className={`mapa-lugares__marco${viaje ? ` viaje-${viaje.fase}` : ''}`}
          style={origen ? { '--origen': origen } : undefined}
        >
          <div className="mapa-lugares__lienzo" style={origen ? { transformOrigin: origen } : undefined}>
            <img
              className="mapa-lugares__img"
              src={mapa.imagen.chica}
              srcSet={`${mapa.imagen.chica} 960w, ${mapa.imagen.grande} 1600w`}
              sizes="(max-width: 899px) 100vw, 1100px"
              width="1600"
              height="1200"
              alt={`Mapa: ${mapa.titulo}`}
              draggable="false"
            />

            <CapaPuntos mapa={mapa} puntos={puntos} sel={sel} elegir={elegir} viajar={viajar} precargarDestino={precargarDestino} />
          </div>
          {viaje && <div className="mapa-lugares__remolino" aria-hidden="true" />}
          <button type="button" className="mapa-lugares__lupa" onClick={abrirCompleto} aria-label="Ver mapa en pantalla completa">
            <Icono nombre="expandir" />
          </button>
        </div>

        {/* Tarjeta del lugar elegido (a un lado en computadora, abajo en celular) */}
        {!lugar && !esSecreto && (
          <aside className="mapa-tarjeta mapa-tarjeta--vacia" aria-hidden="true">
            <div className="mapa-tarjeta__texto mapa-tarjeta__texto--secreto">
              <span className="mapa-tarjeta__candado mapa-tarjeta__candado--brujula" />
              <h3>{mapa.titulo}</h3>
              <p>Elige un lugar en el mapa para ver su información.</p>
              <p className="mapa-tarjeta__nota">Busca la tubería…</p>
            </div>
          </aside>
        )}
        {(lugar || esSecreto) && (
          <TarjetaLugar ref={tarjetaRef} lugar={lugar} secreto={esSecreto} onCerrar={() => setSel(null)} />
        )}
      </div>

      {/* Lista rápida de lugares del mapa (fácil de tocar en celular) */}
      <div className="mapa-lugares__lista">
        {puntos.map((p) => (
          <button
            type="button"
            key={p.lugar}
            className={`mapa-chip${sel === p.lugar ? ' is-activo' : ''}`}
            style={{ '--gema': p.color }}
            onClick={() => elegir(p.lugar)}
            aria-pressed={sel === p.lugar}
          >
            <span className="mapa-chip__gema" aria-hidden="true" />
            {p.lugar}
          </button>
        ))}
        <button type="button" className="mapa-chip mapa-chip--viaje" onClick={viajar} onPointerEnter={precargarDestino}>
          <span className="mapa-chip__tubo" aria-hidden="true" />
          Ir a: {mapas[mapa.portal.a].titulo}
        </button>
      </div>

      {completo && (
        <MapaCompleto
          mapaId={mapaId}
          puntos={puntos}
          sel={sel}
          elegir={elegir}
          lugar={lugar}
          esSecreto={esSecreto}
          onCerrarTarjeta={() => setSel(null)}
          viajar={viajar}
          viaje={viaje}
          precargarDestino={precargarDestino}
          onCerrar={cerrarCompleto}
        />
      )}
    </section>
  );
};

export default MapaLugares;
