import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNav.scss';
import tmdIconMask from '../assets/images/logo/tmd-icon-mask.png';
import dmbico from '../assets/images/logo/dmbico.png';

// Menú inferior para celulares y tabletas (se oculta en pantallas >1205px,
// donde se usa la barra de navegación superior).

const Icon = ({ children, className = '' }) => (
  <svg className={`bottom-nav__icon ${className}`.trim()} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const icons = {
  // Conejo de peluche en estilo caricatura, en versión rellena: la silueta
  // (cabeza y orejas largas dobladas hacia atrás) toma el color del menú y los
  // detalles (ojos, nariz, hocico, mejillas, pliegues) quedan transparentes.
  wiki: (
    <Icon className="bottom-nav__icon--lg">
      <defs>
        <mask id="bnRabbit" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" stroke="none">
          {/* Orejas */}
          <g fill="white" stroke="white" strokeWidth="1.6">
            <path d="M11.3 6.6c-.3-2.8-1.9-4.3-3.5-3.8-1.7.6-2.5 3-2.3 5.6.1 1.3.8 1.9 1.4 1.3z" />
            <path d="M12.7 6.6c.3-2.8 1.9-4.3 3.5-3.8 1.7.6 2.5 3 2.3 5.6-.1 1.3-.8 1.9-1.4 1.3z" />
          </g>
          {/* Pliegue de las orejas */}
          <path d="M10 5.6c-.9-.9-2.2-.8-2.9.6-.4.9-.5 1.9-.4 2.6M14 5.6c.9-.9 2.2-.8 2.9.6.4.9.5 1.9.4 2.6" fill="none" stroke="black" strokeWidth="1" />
          <g transform="translate(12 15) scale(.88) translate(-12 -15)">
            {/* Separación entre orejas y cabeza */}
            <path d="M12 5.4c3 0 4.8 1.2 5.6 2.5 2.3 1.4 4 3.9 4 7.3 0 4.1-4 6.2-9.6 6.2s-9.6-2.1-9.6-6.2c0-3.4 1.7-5.9 4-7.3.8-1.3 2.6-2.5 5.6-2.5z" fill="black" stroke="black" strokeWidth="3.4" />
            {/* Cabeza */}
            <path d="M12 5.4c3 0 4.8 1.2 5.6 2.5 2.3 1.4 4 3.9 4 7.3 0 4.1-4 6.2-9.6 6.2s-9.6-2.1-9.6-6.2c0-3.4 1.7-5.9 4-7.3.8-1.3 2.6-2.5 5.6-2.5z" fill="white" stroke="white" strokeWidth="2.05" />
            {/* Ojos con brillo */}
            <ellipse cx="9" cy="11.7" rx="1.35" ry="1.65" fill="black" />
            <ellipse cx="15" cy="11.7" rx="1.35" ry="1.65" fill="black" />
            <circle cx="9.4" cy="11.2" r=".48" fill="white" />
            <circle cx="15.4" cy="11.2" r=".48" fill="white" />
            {/* Nariz, hocico y mejillas */}
            <path d="M10.8 14.4c0-.7 2.4-.7 2.4 0 0 .8-.7 1.3-1.2 1.3s-1.2-.5-1.2-1.3z" fill="black" />
            <path d="M12 15.6v1.3m0 0c-.5.9-1.5 1.5-2.6 1.7m2.6-1.7c.5.9 1.5 1.5 2.6 1.7" fill="none" stroke="black" strokeWidth="1.3" />
            <path d="M4.4 16.9c.6 1 1.5 1.8 2.6 2.2M19.6 16.9c-.6 1-1.5 1.8-2.6 2.2" fill="none" stroke="black" strokeWidth="1.2" />
          </g>
        </mask>
      </defs>
      <rect width="24" height="24" fill="currentColor" stroke="none" mask="url(#bnRabbit)" />
    </Icon>
  ),
  // Periódico relleno; las líneas, el recuadro y la orilla quedan transparentes
  news: (
    <Icon>
      <defs>
        <mask id="bnNews" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" stroke="none">
          <rect x="6" y="2" width="16" height="20" rx="2.4" fill="white" />
          <rect x="1.8" y="8.4" width="4.2" height="13.6" rx="2" fill="white" />
          <path d="M6.6 8.4v11.6" stroke="black" strokeWidth="1.3" />
          <rect x="9.3" y="5.3" width="9.4" height="5" rx=".6" fill="black" />
          <path d="M9.6 14h8.8M9.6 17.8h5.6" stroke="black" strokeWidth="1.7" strokeLinecap="round" />
        </mask>
      </defs>
      <rect width="24" height="24" fill="currentColor" stroke="none" mask="url(#bnNews)" />
    </Icon>
  ),
  // Logo TMD del canal. Se usa como máscara para que tome el color del menú
  // (gris normal, rojo cuando está seleccionado).
  home: (
    <span
      className="bottom-nav__icon bottom-nav__icon--tmd"
      style={{ WebkitMaskImage: `url(${tmdIconMask})`, maskImage: `url(${tmdIconMask})` }}
      aria-hidden="true"
    />
  ),
  videos: (
    <span
      className="bottom-nav__icon bottom-nav__icon--tmd"
      style={{ WebkitMaskImage: `url(${dmbico})`, maskImage: `url(${dmbico})` }}
      aria-hidden="true"
    />
  ),
  more: (
    <Icon>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </Icon>
  ),
  channels: (
    <Icon>
      <rect x="2" y="7" width="20" height="15" rx="2" />
      <path d="M17 2l-5 5-5-5" />
    </Icon>
  ),
  social: (
    <Icon>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </Icon>
  ),
  mystery: (
    <Icon>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </Icon>
  ),
  // Control relleno (más alto); la cruceta y los botones quedan transparentes
  games: (
    <Icon>
      <defs>
        <mask id="bnGames" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" stroke="none">
          <path d="M6.8 3.6h10.4a5 5 0 0 1 5 5v6.6a4.6 4.6 0 0 1-8.2 2.9l-1.2-1.7h-2.6l-1.2 1.7a4.6 4.6 0 0 1-8.2-2.9V8.6a5 5 0 0 1 5-5z" fill="white" />
          <path d="M7.4 8v4.8M5 10.4h4.8" stroke="black" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16.1" cy="8.9" r="1.35" fill="black" />
          <circle cx="18.7" cy="11.6" r="1.35" fill="black" />
        </mask>
      </defs>
      <rect width="24" height="24" fill="currentColor" stroke="none" mask="url(#bnGames)" />
    </Icon>
  ),
  contact: (
    <Icon>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </Icon>
  ),
};

// Menú inferior: 5 páginas.
const mainItems = [
  { to: '/wiki', label: 'Wiki', icon: icons.wiki },
  { to: '/news', label: 'Noticias', icon: icons.news },
  { to: '/', label: 'Inicio', icon: icons.home },
  { to: '/videos', label: 'Videos', icon: icons.videos },
  { to: '/juegos', label: 'Juegos', icon: icons.games },
];

// ---------------------------------------------------------------------------
// Menú "Más" (ventana con páginas extra). Está apagado por ahora: con una sola
// página extra se mostró directo en el menú (???). Para volver a usarlo, pon
// SHOW_MORE_MENU en true, quita '/juegos' de mainItems y agrega aquí las páginas.
// ---------------------------------------------------------------------------
const SHOW_MORE_MENU = false;
const moreItems = [
  // { to: '/channels', label: 'Canales', icon: icons.channels },
  { to: '/juegos', label: 'Juegos', icon: icons.games },
];

const isActive = (pathname, to) =>
  to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);

const BottomNav = () => {
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  // Cierra la ventana de "Más" al cambiar de página o con la tecla Escape.
  useEffect(() => setMoreOpen(false), [pathname]);
  useEffect(() => {
    if (!moreOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMoreOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [moreOpen]);

  const moreActive = moreItems.some((item) => isActive(pathname, item.to));
  const contactActive = isActive(pathname, '/contacto');

  return (
    <>
      {/* Contacto: botón flotante arriba a la derecha (solo celular/tableta) */}
      <Link
        to="/contacto"
        className={`contact-fab${contactActive ? ' is-active' : ''}`}
        aria-label="Contacto"
        aria-current={contactActive ? 'page' : undefined}
      >
        {icons.contact}
      </Link>

      {SHOW_MORE_MENU && moreOpen && <div className="bottom-nav__backdrop" onClick={() => setMoreOpen(false)} />}

      {SHOW_MORE_MENU && moreOpen && (
        <div className="bottom-nav__sheet" id="bottom-nav-more" role="menu">
          {moreItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              role="menuitem"
              className={`bottom-nav__sheet-item${isActive(pathname, item.to) ? ' is-active' : ''}`}
              onClick={() => setMoreOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}

      <nav className="bottom-nav" aria-label="Menú principal">
        {mainItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`bottom-nav__item${isActive(pathname, item.to) ? ' is-active' : ''}`}
            aria-current={isActive(pathname, item.to) ? 'page' : undefined}
          >
            {item.icon}
            <span className="bottom-nav__label">{item.label}</span>
          </Link>
        ))}
        {SHOW_MORE_MENU && (
          <button
            type="button"
            className={`bottom-nav__item${moreOpen || moreActive ? ' is-active' : ''}`}
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            aria-controls="bottom-nav-more"
          >
            {icons.more}
            <span className="bottom-nav__label">Más</span>
          </button>
        )}
      </nav>
    </>
  );
};

export default BottomNav;
