import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icono from '../Iconos';
import mapas from '../../data/mapaLugares';
import { CapaPuntos, TarjetaLugar } from './MapaPiezas';

// ============================================================================
//  Mapa de Lugares en pantalla completa, con zoom
// ============================================================================
//  - Abre cubriendo toda la pantalla; se puede alejar para ver el mapa completo.
//  - Computadora: rueda del mouse para acercar/alejar, arrastrar para moverse,
//    doble click para acercar. Botones + / − / ajustar.
//  - Celular y tableta: pellizcar para hacer zoom, arrastrar con un dedo,
//    doble toque para acercar.
//  El movimiento se aplica directo al estilo (sin volver a dibujar React), así
//  va fluido aun en celulares sencillos.
// ============================================================================

const ZOOM_MAX = 5;
const PROPORCION = 4 / 3; // los mapas miden 4:3
const ARRASTRE = 6;       // pixeles antes de considerar que se está arrastrando

// mantiene el mapa dentro de la pantalla (centrado si es más chico que ella)
const limitar = (st) => {
  st.s = Math.min(ZOOM_MAX, Math.max(1, st.s));
  const w = st.bw * st.s;
  const h = st.bh * st.s;
  st.x = w <= st.w ? (st.w - w) / 2 : Math.min(0, Math.max(st.w - w, st.x));
  st.y = h <= st.h ? (st.h - h) / 2 : Math.min(0, Math.max(st.h - h, st.y));
};

const MapaCompleto = ({ mapaId, puntos, sel, elegir, lugar, esSecreto, onCerrarTarjeta, viajar, viaje, precargarDestino, onCerrar }) => {
  const mapa = mapas[mapaId];
  const vpRef = useRef(null);
  const capaRef = useRef(null);
  const v = useRef({ s: 1, x: 0, y: 0, w: 0, h: 0, bw: 0, bh: 0 });
  const dedos = useRef(new Map());
  const gesto = useRef(null);
  const arrastro = useRef(false);
  const ultimoToque = useRef(0);
  const [hd, setHd] = useState(false);
  const [zoom, setZoom] = useState(1);

  // --- vista: tamaño base (cabe completo) + desplazamiento + escala
  const aplicar = useCallback((animar = false) => {
    const c = capaRef.current;
    if (!c) return;
    const st = v.current;
    c.classList.toggle('is-animando', animar);
    c.style.transform = `translate3d(${st.x}px, ${st.y}px, 0) scale(${st.s})`;
    c.style.setProperty('--s', st.s);
    // el % de zoom se actualiza solo cuando cambia (al arrastrar no se vuelve a dibujar nada)
    setZoom((z) => (Math.abs(z - st.s) > 0.02 || (st.s === 1 && z !== 1) ? st.s : z));
  }, []);

  const medir = useCallback(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const st = v.current;
    const r = vp.getBoundingClientRect();
    const centroX = st.w ? (st.w / 2 - st.x) / (st.bw * st.s) : 0.5;
    const centroY = st.h ? (st.h / 2 - st.y) / (st.bh * st.s) : 0.5;
    st.w = r.width;
    st.h = r.height;
    st.bw = Math.min(st.w, st.h * PROPORCION);
    st.bh = st.bw / PROPORCION;
    const c = capaRef.current;
    c.style.width = `${st.bw}px`;
    c.style.height = `${st.bh}px`;
    // conserva el punto que estaba al centro
    st.x = st.w / 2 - centroX * st.bw * st.s;
    st.y = st.h / 2 - centroY * st.bh * st.s;
    limitar(v.current);
    aplicar();
  }, [aplicar]);

  const zoomEn = useCallback((px, py, nueva, animar = false) => {
    const st = v.current;
    const s = Math.min(ZOOM_MAX, Math.max(1, nueva));
    st.x = px - ((px - st.x) * s) / st.s;
    st.y = py - ((py - st.y) * s) / st.s;
    st.s = s;
    limitar(v.current);
    aplicar(animar);
  }, [aplicar]);

  const ajustar = () => { v.current.s = 1; limitar(v.current); aplicar(true); };
  const botonZoom = (k) => { const st = v.current; zoomEn(st.w / 2, st.h / 2, st.s * k, true); };

  // ir a un lugar: lo centra y acerca
  const irA = useCallback((p) => {
    const st = v.current;
    st.s = Math.max(st.s, 2.4);
    st.x = st.w / 2 - (p.x / 100) * st.bw * st.s;
    st.y = st.h / 2 - (p.y / 100) * st.bh * st.s;
    limitar(v.current);
    aplicar(true);
  }, [aplicar]);

  useLayoutEffect(() => {
    v.current = { s: 1, x: 0, y: 0, w: 0, h: 0, bw: 0, bh: 0 };
    setHd(false);
    medir();
    // al abrir, el mapa cubre toda la pantalla (centrado); con − o pellizcando
    // se puede alejar hasta verlo completo
    const st = v.current;
    st.s = Math.max(st.w / st.bw, st.h / st.bh);
    st.x = (st.w - st.bw * st.s) / 2;
    st.y = (st.h - st.bh * st.s) / 2;
    limitar(st);
    aplicar();
  }, [mapaId, medir, aplicar]);

  useEffect(() => {
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [medir]);

  // bloquea el scroll de la página y Esc cierra
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onCerrar();
      if (e.key === '+' || e.key === '=') botonZoom(1.4);
      if (e.key === '-') botonZoom(1 / 1.4);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCerrar]);

  // rueda del mouse (necesita passive: false para no mover la página)
  useEffect(() => {
    const vp = vpRef.current;
    const rueda = (e) => {
      e.preventDefault();
      const r = vp.getBoundingClientRect();
      const k = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018));
      zoomEn(e.clientX - r.left, e.clientY - r.top, v.current.s * k);
    };
    vp.addEventListener('wheel', rueda, { passive: false });
    return () => vp.removeEventListener('wheel', rueda);
  }, [zoomEn]);

  // --- arrastrar y pellizcar
  const pos = (e) => {
    const r = vpRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const empezarGesto = () => {
    const st = v.current;
    const ps = [...dedos.current.values()];
    if (ps.length === 1) {
      gesto.current = { tipo: 'mover', x0: ps[0].x, y0: ps[0].y, sx: st.x, sy: st.y };
    } else if (ps.length >= 2) {
      const [a, b] = ps;
      gesto.current = {
        tipo: 'pellizco',
        d0: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        s0: st.s,
        mx: (a.x + b.x) / 2,
        my: (a.y + b.y) / 2,
        sx: st.x,
        sy: st.y,
      };
    }
  };

  const abajo = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dedos.current.set(e.pointerId, pos(e));
    if (dedos.current.size === 1) arrastro.current = false;
    empezarGesto();
  };

  const mueve = (e) => {
    if (!dedos.current.has(e.pointerId)) return;
    dedos.current.set(e.pointerId, pos(e));
    const g = gesto.current;
    if (!g) return;
    const st = v.current;
    const ps = [...dedos.current.values()];
    if (g.tipo === 'mover' && ps.length === 1) {
      const dx = ps[0].x - g.x0;
      const dy = ps[0].y - g.y0;
      if (!arrastro.current && Math.hypot(dx, dy) < ARRASTRE) return;
      if (!arrastro.current) {
        arrastro.current = true;
        try { vpRef.current.setPointerCapture(e.pointerId); } catch (err) { /* sin captura */ }
      }
      st.x = g.sx + dx;
      st.y = g.sy + dy;
      limitar(v.current);
      aplicar();
    } else if (g.tipo === 'pellizco' && ps.length >= 2) {
      arrastro.current = true;
      const [a, b] = ps;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const s = Math.min(ZOOM_MAX, Math.max(1, (g.s0 * d) / g.d0));
      // el punto bajo los dedos se queda bajo los dedos
      st.x = mx - ((g.mx - g.sx) * s) / g.s0;
      st.y = my - ((g.my - g.sy) * s) / g.s0;
      st.s = s;
      limitar(v.current);
      aplicar();
    }
  };

  const arriba = (e) => {
    if (!dedos.current.has(e.pointerId)) return;
    const p = dedos.current.get(e.pointerId);
    dedos.current.delete(e.pointerId);
    if (dedos.current.size > 0) { empezarGesto(); return; }
    gesto.current = null;
    // doble toque (celular) para acercar
    if (e.pointerType !== 'mouse' && !arrastro.current) {
      const ahora = Date.now();
      if (ahora - ultimoToque.current < 300 && !e.target.closest('button')) {
        zoomEn(p.x, p.y, v.current.s < ZOOM_MAX - 0.1 ? v.current.s * 2 : 1, true);
        ultimoToque.current = 0;
      } else ultimoToque.current = ahora;
    }
    // el click que sigue a un arrastre no debe abrir un lugar
    if (arrastro.current) setTimeout(() => { arrastro.current = false; }, 0);
  };

  const dobleClick = (e) => {
    if (e.target.closest('button')) return;
    const p = pos(e);
    zoomEn(p.x, p.y, v.current.s < ZOOM_MAX - 0.1 ? v.current.s * 2 : 1, true);
  };

  const elegirCentrando = (nombre) => {
    const p = puntos.find((q) => q.lugar === nombre);
    if (p && sel !== nombre) irA(p);
    elegir(nombre);
  };

  const tarjeta = lugar || esSecreto;

  // va directo en <body> para quedar encima de todo (menús fijos de la página)
  return createPortal(
    <div className="mapa-completo" role="dialog" aria-modal="true" aria-label={`Mapa completo: ${mapa.titulo}`}>
      <div className="mapa-completo__barra">
        <h2 className="mapa-completo__titulo">{mapa.titulo}</h2>
        <div className="mapa-completo__acciones">
          <button type="button" className="mapa-completo__btn" onClick={() => botonZoom(1 / 1.5)} disabled={zoom <= 1.01} aria-label="Alejar">
            <Icono nombre="menos" />
          </button>
          <span className="mapa-completo__nivel" aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button type="button" className="mapa-completo__btn" onClick={() => botonZoom(1.5)} disabled={zoom >= ZOOM_MAX - 0.01} aria-label="Acercar">
            <Icono nombre="mas" />
          </button>
          <button type="button" className="mapa-completo__btn mapa-completo__btn--texto" onClick={ajustar} disabled={zoom <= 1.01}>
            Ajustar
          </button>
          <button type="button" className="mapa-completo__btn mapa-completo__btn--cerrar" onClick={onCerrar} aria-label="Cerrar mapa completo">
            <Icono nombre="cerrar" />
          </button>
        </div>
      </div>

      <div
        ref={vpRef}
        className={`mapa-completo__vista${viaje ? ' is-viajando' : ''}`}
        onPointerDown={abajo}
        onPointerMove={mueve}
        onPointerUp={arriba}
        onPointerCancel={arriba}
        onDoubleClick={dobleClick}
      >
        <div ref={capaRef} className="mapa-completo__capa">
          <img className="mapa-completo__img" src={mapa.imagen.grande} alt={`Mapa: ${mapa.titulo}`} draggable="false" />
          {/* versión en alta resolución para el zoom (se carga solo aquí) */}
          <img
            className={`mapa-completo__img mapa-completo__img--hd${hd ? ' is-lista' : ''}`}
            src={mapa.imagen.completa}
            alt=""
            draggable="false"
            decoding="async"
            onLoad={() => setHd(true)}
          />
          <CapaPuntos
            mapa={mapa}
            puntos={puntos}
            sel={sel}
            elegir={elegirCentrando}
            viajar={viajar}
            precargarDestino={precargarDestino}
            bloqueado={() => arrastro.current}
          />
        </div>
        {viaje && <div className="mapa-completo__destello" aria-hidden="true" />}
        <p className="mapa-completo__pista" aria-hidden="true">
          <span className="solo-raton">Rueda para acercar · arrastra para moverte</span>
          <span className="solo-tactil">Pellizca para acercar · arrastra para moverte</span>
        </p>
      </div>

      {tarjeta && (
        <TarjetaLugar className="mapa-tarjeta--completo" lugar={lugar} secreto={esSecreto} onCerrar={onCerrarTarjeta} />
      )}

      {/* lugares de este mapa: tocar uno lo centra y lo acerca */}
      <div className="mapa-completo__lista">
        {puntos.map((p) => (
          <button
            type="button"
            key={p.lugar}
            className={`mapa-chip${sel === p.lugar ? ' is-activo' : ''}`}
            style={{ '--gema': p.color }}
            onClick={() => elegirCentrando(p.lugar)}
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
    </div>,
    document.body
  );
};

export default MapaCompleto;