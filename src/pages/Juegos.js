import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import MinecraftServer from '../components/Juegos/MinecraftServer';
import flipslopeThumb from '../assets/images/juegos/flipslope.png';
import './Scroll.css';
import './Juegos.scss';

// Lista de juegos (/juegos).
// - "estreno": el juego ya se anunció, se muestra su imagen con la etiqueta "Próximamente".
// - Sin imagen: tarjeta "?" de Próximamente.
const JUEGOS = [
  {
    id: 'flipslope',
    titulo: 'FlipSlope',
    descripcion: 'Rueda con Johnny cuesta abajo, esquiva a los ninjas y no toques La Substancia XXX.',
    imagen: flipslopeThumb,
    estreno: 'Diciembre',
  },
  { id: 'juego-2', titulo: 'Juego 2', descripcion: 'Próximamente' },
  { id: 'juego-3', titulo: 'Juego 3', descripcion: 'Próximamente' },
];

const Juegos = () => (
  <div>
    <Navbar />
    <main className="juegos">
      <header className="juegos__header">
        <h1>Juegos</h1>
        <p>Minijuegos de TheMarioDimension. ¡Supera tu récord!</p>
      </header>
      <div className="juegos__grid">
        {JUEGOS.map((j) => (j.imagen ? (
          <div key={j.id} className="juego-card juego-card--estreno" aria-disabled="true">
            <span className="juego-card__img">
              <img src={j.imagen} alt="" />
              <span className="juego-card__sello">Próximamente</span>
            </span>
            <span className="juego-card__body">
              <strong>{j.titulo}</strong>
              <span>{j.descripcion}</span>
              <span className="juego-card__btn juego-card__btn--pronto">Llega en {j.estreno}</span>
            </span>
          </div>
        ) : (
          <div key={j.id} className="juego-card juego-card--soon" aria-disabled="true">
            <span className="juego-card__img juego-card__img--soon"><span>?</span></span>
            <span className="juego-card__body">
              <strong>{j.titulo}</strong>
              <span>{j.descripcion}</span>
            </span>
          </div>
        )))}
      </div>
    </main>
    <MinecraftServer />
    <Footer />
  </div>
);

export default Juegos;
