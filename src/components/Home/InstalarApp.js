import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Icono from '../Iconos';
import './InstalarApp.scss';

// ============================================================================
//  Aviso "Agrega TMD como app" (pantalla de Inicio)
// ============================================================================
//  - Se oculta si la página ya está abierta como app o si el usuario lo cierra
//    (se recuerda en el navegador: localStorage "tmd-aviso-app").
//  - Con `permanente` (en Contacto) siempre se ve y no se puede cerrar.
//  - Al tocarlo abre los pasos según el dispositivo (se pueden ver los demás).
//  - En Chrome/Edge/Android, si el navegador lo permite, muestra "Instalar ahora".
// ============================================================================

const CLAVE = 'tmd-aviso-app';

const leer = () => { try { return window.localStorage.getItem(CLAVE); } catch (e) { return null; } };
const guardar = (v) => { try { window.localStorage.setItem(CLAVE, v); } catch (e) { /* sin almacenamiento */ } };

const yaEsApp = () => {
  try {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  } catch (e) { return false; }
};

const detectar = () => {
  const ua = navigator.userAgent || '';
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (iOS) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  if (/Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg|Firefox/.test(ua)) return 'mac';
  return 'pc';
};

const GUIAS = {
  ios: {
    tab: 'iPhone / iPad',
    pasos: [
      <>Abre esta página en <b>Safari</b>.</>,
      <>Toca el botón <b>Compartir</b> <Icono nombre="compartir" className="app-guia__ico" /> (abajo en iPhone, arriba en iPad).</>,
      <>Desliza y elige <b>Agregar a pantalla de inicio</b>.</>,
      <>Toca <b>Agregar</b>. El ícono de TMD aparecerá junto a tus apps.</>,
    ],
  },
  android: {
    tab: 'Android',
    pasos: [
      <>Abre esta página en <b>Chrome</b>.</>,
      <>Toca el menú <Icono nombre="puntos" className="app-guia__ico" /> arriba a la derecha.</>,
      <>Elige <b>Instalar app</b> o <b>Agregar a pantalla principal</b>.</>,
      <>Confirma con <b>Instalar</b>. TMD quedará en tu pantalla de inicio.</>,
    ],
  },
  pc: {
    tab: 'Computadora',
    pasos: [
      <>Abre esta página en <b>Chrome</b> o <b>Edge</b>.</>,
      <>Haz clic en el ícono de instalar <Icono nombre="instalar" className="app-guia__ico" /> a la derecha de la barra de direcciones.</>,
      <>Si no aparece: en Chrome, menú <Icono nombre="puntos" className="app-guia__ico" /> → <b>Transmitir, guardar y compartir</b> → <b>Instalar página como app</b>. En Edge, menú → <b>Aplicaciones</b> → <b>Instalar este sitio como una aplicación</b>.</>,
      <>Confirma con <b>Instalar</b>. TMD se abrirá en su propia ventana.</>,
    ],
  },
  mac: {
    tab: 'Mac (Safari)',
    pasos: [
      <>Abre esta página en <b>Safari</b> (macOS Sonoma o más nuevo).</>,
      <>En la barra de menú, elige <b>Archivo</b> → <b>Agregar al Dock</b>.</>,
      <>Toca <b>Agregar</b>. TMD aparecerá en tu Dock como una app.</>,
    ],
  },
};
const ORDEN = ['ios', 'android', 'pc', 'mac'];

// permanente: siempre visible y sin ✕ (página de Contacto)
const InstalarApp = ({ permanente = false }) => {
  const [visible, setVisible] = useState(() => !yaEsApp() && (permanente || leer() !== 'cerrado'));
  const [abierto, setAbierto] = useState(false);
  const [guia, setGuia] = useState(detectar);
  const [prompt, setPrompt] = useState(null); // evento de instalación de Chrome/Edge/Android

  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setPrompt(e); };
    const onInstalada = () => { setVisible(false); setAbierto(false); if (!permanente) guardar('cerrado'); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalada);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalada);
    };
  }, [permanente]);

  const cerrarGuia = useCallback(() => setAbierto(false), []);

  useEffect(() => {
    if (!abierto) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') cerrarGuia(); };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [abierto, cerrarGuia]);

  const instalarAhora = async () => {
    if (!prompt) return;
    prompt.prompt();
    try { await prompt.userChoice; } catch (e) { /* sin respuesta */ }
    setPrompt(null);
  };

  if (!visible) return null;
  const esCompu = detectar() === 'pc' || detectar() === 'mac';

  const descartar = (e) => {
    e.stopPropagation();
    guardar('cerrado');
    setVisible(false);
  };

  return (
    <>
      <div className={`app-aviso${permanente ? ' app-aviso--fijo' : ''}`}>
        <button type="button" className="app-aviso__abrir" onClick={() => setAbierto(true)}>
          <img className="app-aviso__ico" src={`${process.env.PUBLIC_URL}/app-icon-192.png`} alt="" width="38" height="38" />
          <span className="app-aviso__texto">
            <strong>Lleva TMD como app</strong>
            <span>Agrega la página a tu teléfono o computadora. {esCompu ? 'Haz clic' : 'Toca'} para ver cómo.</span>
          </span>
          <Icono nombre="derecha" className="app-aviso__flecha" />
        </button>
        {!permanente && (
          <button type="button" className="app-aviso__cerrar" onClick={descartar} aria-label="Ocultar aviso">
            <Icono nombre="cerrar" />
          </button>
        )}
      </div>

      {abierto && createPortal(
        <div className="app-guia" role="dialog" aria-modal="true" aria-labelledby="app-guia-titulo" onClick={cerrarGuia}>
          <div className="app-guia__caja" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="app-guia__x" onClick={cerrarGuia} aria-label="Cerrar">
              <Icono nombre="cerrar" />
            </button>
            <h2 id="app-guia-titulo">Agrega TMD como app</h2>
            <p className="app-guia__intro">Ábrela desde tu pantalla de inicio, sin la barra del navegador, y activa los avisos para enterarte cuando salga un video o una publicación nueva.</p>

            <div className="app-guia__tabs" role="tablist" aria-label="Dispositivo">
              {ORDEN.map((id) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={guia === id}
                  className={`app-guia__tab${guia === id ? ' is-activo' : ''}`}
                  onClick={() => setGuia(id)}
                >
                  {GUIAS[id].tab}
                </button>
              ))}
            </div>

            {prompt && (guia === 'android' || guia === 'pc') && (
              <button type="button" className="app-guia__instalar" onClick={instalarAhora}>
                <Icono nombre="descargar" /> Instalar ahora
              </button>
            )}

            <ol className="app-guia__pasos">
              {GUIAS[guia].pasos.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default InstalarApp;
