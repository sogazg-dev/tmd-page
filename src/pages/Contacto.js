import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import contacto from '../config/contacto';
import InstalarApp from '../components/Home/InstalarApp';
import ActivarAvisos from '../components/Home/ActivarAvisos';
import './Scroll.css';
import './Contacto.scss';

const ExternalIcon = () => (
  <svg className="contacto-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

// Página de Contacto (/contacto): redes sociales, canales y correo.
const Contacto = () => {
  const { hash } = useLocation();
  const [copiado, setCopiado] = useState(false);

  // Permite llegar directo a una sección: /contacto#canales, #redes, #app o #correo
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }, [hash]);

  const copiarCorreo = async () => {
    try {
      await navigator.clipboard.writeText(contacto.correo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (e) {
      window.location.href = `mailto:${contacto.correo}`;
    }
  };

  return (
    <div>
      <Navbar />
      <main className="contacto">
        <header className="contacto__header">
          <h1>Contacto</h1>
          <p>Síguenos en redes, suscríbete a los canales o escríbenos.</p>
        </header>

        {/* ---------- Redes sociales ---------- */}
        <section className="contacto__section" id="redes" aria-labelledby="contacto-redes">
          <h2 id="contacto-redes">Redes sociales</h2>
          <div className="contacto-redes">
            {contacto.redes.map((r) => (
              <a
                key={r.nombre}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contacto-red"
                style={{ '--brand': r.color }}
              >
                <span className="contacto-red__icon"><img src={r.icono} alt="" /></span>
                <span className="contacto-red__text">
                  <strong>{r.nombre}</strong>
                  <span>{r.detalle}</span>
                </span>
                <ExternalIcon />
              </a>
            ))}
          </div>
        </section>

        {/* ---------- Canales de YouTube ---------- */}
        <section className="contacto__section" id="canales" aria-labelledby="contacto-canales">
          <h2 id="contacto-canales">Canales de YouTube</h2>
          <div className="contacto-canales">
            {contacto.canales.map((c) => (
              <a key={c.nombre} href={c.url} target="_blank" rel="noopener noreferrer" className="contacto-canal">
                <img className="contacto-canal__logo" src={c.logo} alt="" />
                <span className="contacto-canal__text">
                  <strong>{c.nombre}</strong>
                  <span>{c.detalle}</span>
                </span>
                <span className="contacto-canal__btn">Ver canal</span>
              </a>
            ))}
          </div>
        </section>

        {/* ---------- App y avisos (siempre visible, aunque se cierre en Inicio) ---------- */}
        <section className="contacto__section" id="app" aria-labelledby="contacto-app">
          <h2 id="contacto-app">App y avisos</h2>
          <InstalarApp permanente />
          <ActivarAvisos permanente />
        </section>

        {/* ---------- Correo ---------- */}
        <section className="contacto__section" id="correo" aria-labelledby="contacto-correo">
          <h2 id="contacto-correo">Correo electrónico</h2>
          <div className="contacto-correo">
            <svg className="contacto-correo__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                 strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
              <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
            </svg>
            <a className="contacto-correo__mail" href={`mailto:${contacto.correo}`}>{contacto.correo}</a>
            <div className="contacto-correo__actions">
              <a className="contacto-btn" href={`mailto:${contacto.correo}`}>Enviar correo</a>
              <button type="button" className="contacto-btn contacto-btn--ghost" onClick={copiarCorreo}>
                {copiado ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contacto;
