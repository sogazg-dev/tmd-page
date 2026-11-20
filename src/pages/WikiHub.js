import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import logow from '../assets/images/logo/wiki1.png';
import fireVideo from '../assets/videos/Fire.mp4';
import FondoVideo from '../components/FondoVideo';
import '../components/Wiki/Personajes.scss';
import './WikiHub.scss';
import './Scroll.css';

const Icon = ({ children }) => (
  <svg className="wiki-hub__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

// Trifuerza (adorno de los botones, estilo Ocarina of Time)
const Trifuerza = ({ className }) => (
  <svg className={className} viewBox="0 0 24 21" aria-hidden="true">
    <path d="M12 0l6 10.5H6zM6 10.5L12 21H0zM18 10.5L24 21H12z" fill="currentColor" />
  </svg>
);

// Secciones del menú de la Wiki (en este orden). El color es el de la gema
// del medallón (como los medallones de los sabios en Ocarina of Time).
const SECCIONES = [
  {
    to: '/wiki/series', titulo: 'Series', texto: 'Las series de TMD', color: 'red',
    icon: <Icon><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M7 2l5 3 5-3M10 10l5 2-5 2z" /></Icon>,
  },
  {
    to: '/wiki/personajes', titulo: 'Personajes', texto: 'Conoce a todos los personajes', color: 'blue',
    icon: <Icon><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5" /><circle cx="17" cy="9" r="2.6" /><path d="M16 14.6c2.8-.3 5 1.3 5.5 4.4" /></Icon>,
  },
  {
    to: '/wiki/lugares', titulo: 'Lugares', texto: 'Mundos y escenarios', color: 'green',
    icon: <Icon><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></Icon>,
  },
  {
    to: '/wiki/objetos', titulo: 'Objetos', texto: 'Artefactos y más', color: 'yellow',
    icon: <Icon><path d="M12 2l3 7h7l-5.6 4.3L18.5 21 12 16.6 5.5 21l2.1-7.7L2 9h7z" /></Icon>,
  },
  {
    to: '/wiki/museo', titulo: 'Museo', texto: 'Curiosidades y rarezas', color: 'purple',
    icon: <Icon><path d="M3 21h18M4 10h16M12 3l9 5H3zM6 10v8M10 10v8M14 10v8M18 10v8" /></Icon>,
  },
];

// Menú principal de la Wiki (/wiki).
const WikiHub = () => (
  <div>
    <Navbar />
    <div className="personajes-page-wrapper wiki-hub-page">
      <div className="full-screen-element wiki-hero wiki-hub__hero">
        <FondoVideo src={fireVideo} className="wiki-hero-fire" />
        <div className="image-container wiki-logo">
          <img src={logow} alt="TMD Wiki" />
        </div>
      </div>

      <nav className="wiki-hub" aria-label="Secciones de la Wiki">
        {SECCIONES.map((s) => (
          <Link key={s.to} to={s.to} className={`wiki-hub__item wiki-hub__item--${s.color}`}>
            <span className="wiki-hub__medallon">{s.icon}</span>
            <span className="wiki-hub__info">
              <span className="wiki-hub__title">{s.titulo}</span>
              <span className="wiki-hub__adorno" aria-hidden="true">
                <Trifuerza className="wiki-hub__trifuerza" />
              </span>
              <span className="wiki-hub__text">{s.texto}</span>
            </span>
            <Trifuerza className="wiki-hub__cursor" />
          </Link>
        ))}
      </nav>
    </div>
    <Footer />
  </div>
);

export default WikiHub;
