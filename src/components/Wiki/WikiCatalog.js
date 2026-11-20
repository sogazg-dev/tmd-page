import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logow from '../../assets/images/logo/wiki1.png';
import fireVideo from '../../assets/videos/Fire.mp4';
import FondoVideo from '../FondoVideo';
// Reutiliza los estilos de Personajes (encabezado, buscador y filtros)
// sin modificarlos; las tarjetas y la ventana tienen estilos propios.
import './Personajes.scss';
import './WikiCatalog.scss';
import Icono from '../Iconos';

const MOBILE_QUERY = '(max-width: 1205px)';
const isMobile = () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;

/**
 * Catálogo de la Wiki con la misma estructura que Personajes, pero con
 * tarjetas horizontales (miniatura + título) que abren una ventana con la
 * información. Se usa para Lugares y Objetos.
 *
 * props:
 *  - items:       [{ nombre, imagen, serie, descripcion }]
 *  - seriesLogos: [{ id, logo }]
 *  - textos:      { titulo, subtitulo, buscar, vacio }
 *  - filtros:     false para ocultar los filtros por serie (ej. Series)
 *  - logos:       true si las imágenes son logos (se muestran completos)
 *  - antes:       contenido extra entre el encabezado y el listado (ej. el mapa de Lugares)
 *
 * Campos opcionales de cada item (los usa el Museo):
 *  - galeria: [{ src, pie }]  varias imágenes con su pie de foto
 *  - medios:  [{ tipo: 'video' | 'audio' | 'archivo', src, titulo }]
 *  - enlaces: [{ texto, url }]
 */
// Ícono para las tarjetas sin imagen (ej. un audio)
const iconoMedio = (it) => {
  const tipo = it.medios && it.medios[0] && it.medios[0].tipo;
  if (tipo === 'audio') return <Icono nombre="nota" />;
  if (tipo === 'video') return <Icono nombre="play" />;
  return '?';
};

const WikiCatalog = ({ items, seriesLogos, textos, filtros = true, logos = false, antes = null }) => {
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [query, setQuery] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [foto, setFoto] = useState(0);
  const gridRef = useRef(null);
  const firstRender = useRef(true);

  const filtrados = [...items]
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .filter((it) => !selectedSerie || it.serie === selectedSerie)
    .filter((it) => it.nombre.toLowerCase().includes(query.toLowerCase()));

  const logoDeSerie = (id) => (seriesLogos.find((s) => s.id === id) || {}).logo;
  const toggleSerie = (id) => setSelectedSerie(selectedSerie === id ? null : id);

  // Imágenes de la ventana: la galería, o solo la imagen principal.
  const fotos = detalle
    ? (detalle.galeria && detalle.galeria.length ? detalle.galeria : detalle.imagen ? [{ src: detalle.imagen, pie: '' }] : [])
    : [];
  const fotoActual = fotos[Math.min(foto, fotos.length - 1)];
  const abrir = (it) => {
    setFoto(0);
    setDetalle(it);
  };

  // En celular, al buscar o filtrar regresa al inicio de las tarjetas.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!isMobile() || !gridRef.current) return;
    const top = gridRef.current.getBoundingClientRect().top + window.scrollY - 110;
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
  }, [selectedSerie, query]);

  // Ventana de información: bloquea el scroll de fondo y se cierra con Escape.
  useEffect(() => {
    if (!detalle) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const total = detalle.galeria ? detalle.galeria.length : 1;
    const onKey = (e) => {
      if (e.key === 'Escape') setDetalle(null);
      if (total > 1 && e.key === 'ArrowRight') setFoto((f) => (f + 1) % total);
      if (total > 1 && e.key === 'ArrowLeft') setFoto((f) => (f - 1 + total) % total);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [detalle]);

  return (
    <div className={`personajes-page-wrapper catalog-page${logos ? ' catalog-page--logos' : ''}${filtros ? '' : ' catalog-page--sin-filtros'}`}>

      {/* ------------------- ENCABEZADO ------------------- */}
      <div className="full-screen-element wiki-hero">
        <FondoVideo src={fireVideo} className="wiki-hero-fire" />
        <Link to="/wiki" className="catalog-back">‹ Wiki</Link>
        <div className="image-container wiki-logo">
          <img src={logow} alt="TMD Wiki" />
        </div>
        <button
          type="button"
          className="wiki-info-toggle"
          onClick={() => setInfoOpen((v) => !v)}
          aria-expanded={infoOpen}
          aria-controls="catalog-info"
        >
          {infoOpen ? 'Menos información' : 'Más información'} <Icono nombre={infoOpen ? 'arriba' : 'abajo'} />
        </button>
        <div id="catalog-info" className={`text-part${infoOpen ? ' is-open' : ''}`}>
          <h1>{textos.titulo}</h1>
          <h2>{textos.subtitulo}</h2>
        </div>
      </div>

      {antes}

      {/* ------------- BUSCADOR Y FILTROS (fijos abajo en celular) ------------- */}
      <div className="wiki-dock">
        <div className="search-wrapper">
          <input
            className="search-bar"
            type="search"
            enterKeyHint="search"
            placeholder={textos.buscar}
            aria-label={textos.buscar}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="Borrar búsqueda">
              ×
            </button>
          )}
        </div>

        {filtros && (
        <div className="series-filter">
          <button
            type="button"
            className={`serie-chip-all${selectedSerie ? '' : ' active'}`}
            onClick={() => setSelectedSerie(null)}
          >
            Todos
          </button>
          {seriesLogos.map((serie) => (
            <div
              key={serie.id}
              role="button"
              tabIndex={0}
              aria-pressed={selectedSerie === serie.id}
              className={`serie-logo ${selectedSerie === serie.id ? 'active' : ''}`}
              onClick={() => toggleSerie(serie.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSerie(serie.id)}
            >
              <img src={serie.logo} alt={serie.id} />
            </div>
          ))}

          {selectedSerie && (
            <button className="clear-filter" onClick={() => setSelectedSerie(null)}>
              Ver todos
            </button>
          )}
        </div>
        )}
      </div>

      {/* ------------------- TARJETAS ------------------- */}
      {filtrados.length === 0 && <p className="wiki-empty">{textos.vacio}</p>}

      <div className="catalog-grid" ref={gridRef}>
        {filtrados.map((it, index) => (
          <button
            type="button"
            key={it.nombre}
            className="catalog-card"
            style={{ animationDelay: `${Math.min(index, 12) * 0.05}s` }}
            onClick={() => abrir(it)}
          >
            <span className="catalog-card__img">
              {it.imagen ? (
                <img src={it.imagen} alt="" loading="lazy" />
              ) : (
                <span className="catalog-card__icono" aria-hidden="true">{iconoMedio(it)}</span>
              )}
              {it.galeria && it.galeria.length > 1 && (
                <span className="catalog-card__cuenta">{it.galeria.length} fotos</span>
              )}
            </span>
            <span className="catalog-card__title">{it.nombre}</span>
          </button>
        ))}
      </div>

      {/* ------------- VENTANA DE INFORMACIÓN ------------- */}
      {detalle && (
        <div className="catalog-modal-backdrop" onClick={() => setDetalle(null)}>
          <div
            className="catalog-modal"
            role="dialog"
            aria-modal="true"
            aria-label={detalle.nombre}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="catalog-modal__close" onClick={() => setDetalle(null)} aria-label="Cerrar">
              ×
            </button>
            {fotoActual && (
              <figure className="catalog-modal__foto">
                <a href={fotoActual.src} target="_blank" rel="noreferrer" title="Ver imagen completa">
                  <img className="catalog-modal__img" src={fotoActual.src} alt={fotoActual.pie || detalle.nombre} />
                </a>
                {fotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="catalog-modal__nav catalog-modal__nav--prev"
                      onClick={() => setFoto((f) => (f - 1 + fotos.length) % fotos.length)}
                      aria-label="Imagen anterior"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="catalog-modal__nav catalog-modal__nav--next"
                      onClick={() => setFoto((f) => (f + 1) % fotos.length)}
                      aria-label="Imagen siguiente"
                    >
                      ›
                    </button>
                  </>
                )}
                {(fotoActual.pie || fotos.length > 1) && (
                  <figcaption>
                    {fotos.length > 1 && <span className="catalog-modal__num">{Math.min(foto, fotos.length - 1) + 1}/{fotos.length}</span>}
                    {fotoActual.pie}
                  </figcaption>
                )}
              </figure>
            )}
            {fotos.length > 1 && (
              <div className="catalog-modal__tiras">
                {fotos.map((f, i) => (
                  <button
                    type="button"
                    key={f.src}
                    className={`catalog-modal__mini${i === foto ? ' active' : ''}`}
                    onClick={() => setFoto(i)}
                    aria-label={`Imagen ${i + 1}`}
                  >
                    <img src={f.src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
            <div className="catalog-modal__body">
              {logoDeSerie(detalle.serie) && (
                <img className="catalog-modal__serie" src={logoDeSerie(detalle.serie)} alt={detalle.serie} />
              )}
              <h3>{detalle.nombre}</h3>
              <p>{detalle.descripcion}</p>
              {detalle.medios && detalle.medios.map((m) => (
                <div key={m.src} className="catalog-modal__medio">
                  {m.tipo === 'video' && (
                    <video src={m.src} controls playsInline preload="metadata" aria-label={m.titulo} />
                  )}
                  {m.tipo === 'audio' && (
                    <>
                      <span>{m.titulo}</span>
                      <audio src={m.src} controls preload="none" />
                    </>
                  )}
                  {m.tipo === 'archivo' && (
                    <a className="catalog-modal__descarga" href={m.src} download><Icono nombre="descargar" /> {m.titulo}</a>
                  )}
                </div>
              ))}
              {detalle.enlaces && detalle.enlaces.length > 0 && (
                <ul className="catalog-modal__enlaces">
                  {detalle.enlaces.map((l) => (
                    <li key={l.url}>
                      <a href={l.url} target="_blank" rel="noreferrer">{l.texto} <Icono nombre="externo" /></a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WikiCatalog;
