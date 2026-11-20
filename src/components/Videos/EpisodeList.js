import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './EpisodeList.scss';
import arrowImage from '../../assets/images/arrow.png';

const STATUS_MESSAGES = {
  loading: 'Cargando videos...',
  empty: 'Próximamente',
  error: 'No se pudieron cargar los videos. Intenta de nuevo más tarde.',
};

// Fila de videos de una playlist.
// Computadora: flechas a los lados (centradas con las miniaturas) y también se
// puede deslizar de lado con el trackpad, Shift + rueda o arrastrando con el
// mouse. La barra de desplazamiento no se muestra.
const EpisodeList = ({ episodes = [], status = 'ready' }) => {
  const listRef = useRef(null);
  const drag = useRef(null);
  const [limites, setLimites] = useState({ inicio: true, fin: false });

  const revisar = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setLimites({
      inicio: el.scrollLeft <= 2,
      fin: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  }, []);

  useEffect(() => {
    revisar();
    window.addEventListener('resize', revisar);
    return () => window.removeEventListener('resize', revisar);
  }, [revisar, episodes.length]);

  const mover = (dir) => {
    const el = listRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  // Arrastrar con el mouse para deslizar (sin abrir el video al soltar)
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag.current = { x: e.clientX, left: listRef.current.scrollLeft, movido: false };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.movido && Math.abs(dx) > 6) {
      d.movido = true;
      listRef.current.classList.add('is-arrastrando');
    }
    if (d.movido) listRef.current.scrollLeft = d.left - dx;
  };
  const terminar = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.movido) return;
    listRef.current.classList.remove('is-arrastrando');
    // evita que el clic al soltar abra el video
    const bloquear = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
    window.addEventListener('click', bloquear, { capture: true, once: true });
    setTimeout(() => window.removeEventListener('click', bloquear, { capture: true }), 0);
  };

  if (!episodes.length) {
    return (
      <div className="episode-list episode-list--empty">
        <p className="episode-list-status">{STATUS_MESSAGES[status] || STATUS_MESSAGES.empty}</p>
      </div>
    );
  }

  return (
    <div className="episode-list">
      <div
        className="episode-thumbnails"
        ref={listRef}
        onScroll={revisar}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={terminar}
        onPointerLeave={terminar}
        onDragStart={(e) => e.preventDefault()}
      >
        {episodes.map((episode) => (
          <div key={episode.videoId} className="episode-thumbnail">
            <Link to={`/videos/${episode.section}/${episode.videoId}`} draggable="false">
              <img src={episode.thumbnailUrl} alt={episode.title} loading="lazy" draggable="false" />
            </Link>
            <p className="episode-title">{episode.title}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        className={`scroll-button left${limites.inicio ? ' is-oculto' : ''}`}
        onClick={() => mover(-1)}
        aria-label="Videos anteriores"
        tabIndex={limites.inicio ? -1 : 0}
      >
        <img src={arrowImage} alt="" style={{ transform: 'rotate(180deg)' }} />
      </button>
      <button
        type="button"
        className={`scroll-button right${limites.fin ? ' is-oculto' : ''}`}
        onClick={() => mover(1)}
        aria-label="Más videos"
        tabIndex={limites.fin ? -1 : 0}
      >
        <img src={arrowImage} alt="" />
      </button>
    </div>
  );
};

export default EpisodeList;
