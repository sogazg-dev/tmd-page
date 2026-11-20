import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logow from '../../assets/images/logo/wiki1.png'
import fireVideo from '../../assets/videos/Fire.mp4';
import FondoVideo from '../FondoVideo';
import './Personajes.scss';
// botón "‹ Wiki" (mismo estilo que Lugares, Objetos, Series y Museo)
import './WikiCatalog.scss';
import Icono from '../Iconos';

// En celulares y tabletas (≤1205px) la Wiki usa un diseño tipo app:
// buscador y filtros fijos abajo, tarjetas compactas y detalle en una ventana.
const MOBILE_QUERY = '(max-width: 1205px)';
const isMobile = () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;

const Personajes = ({ personajesData, seriesLogos }) => {
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [query, setQuery] = useState("");
  const [flippedCard, setFlippedCard] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const gridRef = useRef(null);
  const firstRender = useRef(true);

  // Filtrado por serie
  let personajesFiltrados = selectedSerie
    ? personajesData.filter((p) => p.serie === selectedSerie)
    : personajesData.sort((a, b) => a.nombre.localeCompare(b.nombre));

  // Filtrado por buscador
  personajesFiltrados = personajesFiltrados.filter((p) =>
    p.nombre.toLowerCase().includes(query.toLowerCase())
  );

  const logoDeSerie = (id) => (seriesLogos.find((s) => s.id === id) || {}).logo;

  // En celular, al buscar o filtrar regresa al inicio de las tarjetas si el
  // usuario ya había bajado (para que vea los resultados).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!isMobile() || !gridRef.current) return;
    const top = gridRef.current.getBoundingClientRect().top + window.scrollY - 110;
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
  }, [selectedSerie, query]);

  // Ventana de detalle: bloquea el scroll de fondo y se cierra con Escape.
  useEffect(() => {
    if (!detalle) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setDetalle(null);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [detalle]);

  const onCardClick = (p) => {
    if (isMobile()) setDetalle(p);
    else setFlippedCard(flippedCard === p.nombre ? null : p.nombre);
  };

  const toggleSerie = (id) => setSelectedSerie(selectedSerie === id ? null : id);

  return (
    <div className="personajes-page-wrapper">

      {/* ------------------- ENCABEZADO ------------------- */}
      <div className="full-screen-element wiki-hero">
        {/* Fuego de fondo del encabezado (tamaño fijo en celular y computadora) */}
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
          aria-controls="wiki-info"
        >
          {infoOpen ? 'Menos información' : 'Más información'} <Icono nombre={infoOpen ? 'arriba' : 'abajo'} />
        </button>
        <div id="wiki-info" className={`text-part${infoOpen ? ' is-open' : ''}`}>
          <h1>¡¡Todo sobre los personajes de TheMarioDimension!!</h1>
          <h2>Haz clic en la tarjeta del personaje para ver más información.</h2>
        </div>
      </div>

      {/* ------------- BUSCADOR Y FILTROS (fijos abajo en celular) ------------- */}
      <div className="wiki-dock">
        <div className="search-wrapper">
          <input
            className="search-bar"
            type="search"
            enterKeyHint="search"
            placeholder="Buscar personaje..."
            aria-label="Buscar personaje"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="Borrar búsqueda">
              ×
            </button>
          )}
        </div>

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
      </div>

      {/* ------------------- PERSONAJES ------------------- */}
      {personajesFiltrados.length === 0 && (
        <p className="wiki-empty">No hay personajes que coincidan con tu búsqueda.</p>
      )}
      <div className="personajes-grid" ref={gridRef}>
  {personajesFiltrados.map((p, index) => (
    <div
      key={p.nombre}
      className="personaje-card flip-container slide-in"
      style={{ animationDelay: `${index * 0.06}s` }}
      onClick={() => onCardClick(p)}
    >
      <div className={`flip-card-inner ${flippedCard === p.nombre ? 'flipped' : ''}`}>
        
        {/* LADO FRONTAL */}
        <div className="flip-card-front">
          <img src={p.imagen} alt={p.nombre} />
        </div>

        {/* LADO TRASERO */}
        <div className="flip-card-back">
          <p>{p.descripcion}</p>
        </div>

      </div>
    </div>
  ))}
</div>
<p className="wiki-fuentes">
  Fuentes:&nbsp;
  <a href="https://www.youtube.com/@TheZeldaDimension" target="_blank" rel="noopener noreferrer">
    TheMarioDimension
  </a>
  &nbsp;--&nbsp;
  <a href="https://x.com/DMB_RR" target="_blank" rel="noopener noreferrer">
    Server DMBRR: Museo
  </a>
  &nbsp;--&nbsp;
  <a href="https://youtube.fandom.com/es/wiki/TheMarioDimension" target="_blank" rel="noopener noreferrer">
    TMD Wiki
  </a>
</p>

      {/* ------------- DETALLE DEL PERSONAJE (celular) ------------- */}
      {detalle && (
        <div className="wiki-sheet-backdrop" onClick={() => setDetalle(null)}>
          <div
            className="wiki-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={detalle.nombre}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="wiki-sheet-close" onClick={() => setDetalle(null)} aria-label="Cerrar">
              ×
            </button>
            <img className="wiki-sheet-img" src={detalle.imagen} alt={detalle.nombre} />
            <div className="wiki-sheet-body">
              {logoDeSerie(detalle.serie) && (
                <img className="wiki-sheet-serie" src={logoDeSerie(detalle.serie)} alt={detalle.serie} />
              )}
              <h3>{detalle.nombre}</h3>
              <p>{detalle.descripcion}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Personajes;
