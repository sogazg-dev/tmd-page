import React, { useEffect, useState } from 'react';
import Icono from '../Iconos';
import './ActivarAvisos.scss';

// ============================================================================
//  "Activar avisos": notificaciones cuando sale un video o una publicación
// ============================================================================
//  - Solo aparece si el navegador permite notificaciones (en iPhone/iPad, solo
//    con la página instalada como app) y la persona no las ha activado.
//  - La suscripción se guarda con /.netlify/functions/avisos y la función
//    programada avisos-revisar manda el aviso (ver netlify/lib/avisos.js).
//  - La ✕ lo oculta (se recuerda en el navegador: "tmd-aviso-notificaciones").
//  - Con `permanente` (en Contacto) siempre se ve: activar, desactivar o por
//    qué no se puede (iPhone sin instalar la app, avisos bloqueados).
// ============================================================================

const ENDPOINT = '/.netlify/functions/avisos';
const CLAVE = 'tmd-aviso-notificaciones';

const leer = () => { try { return window.localStorage.getItem(CLAVE); } catch (e) { return null; } };
const guardar = (v) => { try { window.localStorage.setItem(CLAVE, v); } catch (e) { /* sin almacenamiento */ } };

const soportado = () =>
  typeof window !== 'undefined' && 'serviceWorker' in navigator && Boolean(window.PushManager) && Boolean(window.Notification);

const aBytes = (b64) => {
  const s = (b64 + '='.repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(s);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};

const esIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// permanente: siempre visible, sin ✕ y con "Desactivar" (página de Contacto)
const ActivarAvisos = ({ permanente = false }) => {
  // 'oculto' | 'listo' | 'activando' | 'activo' | 'error' | 'bloqueado' | 'sinSoporte'
  const [estado, setEstado] = useState('oculto');

  useEffect(() => {
    if (!soportado()) { if (permanente) setEstado('sinSoporte'); return undefined; }
    if (Notification.permission === 'denied') { if (permanente) setEstado('bloqueado'); return undefined; }
    if (!permanente && leer() === 'cerrado') return undefined;
    let vivo = true;
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        if (!vivo) return;
        const activo = sub && Notification.permission === 'granted';
        setEstado(activo ? (permanente ? 'activo' : 'oculto') : 'listo');
      })
      .catch(() => { if (vivo) setEstado('listo'); });
    return () => { vivo = false; };
  }, [permanente]);

  const activar = async () => {
    setEstado('activando');
    try {
      const permiso = await Notification.requestPermission();
      if (permiso !== 'granted') { setEstado(permanente ? 'bloqueado' : 'oculto'); return; }
      const { publicKey } = await (await fetch(ENDPOINT)).json();
      if (!publicKey) throw new Error('sin clave');
      const reg = await navigator.serviceWorker.ready;
      const sub = (await reg.pushManager.getSubscription())
        || (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: aBytes(publicKey) }));
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setEstado('activo');
      if (!permanente) setTimeout(() => setEstado('oculto'), 4000);
    } catch (e) {
      console.warn('No se pudieron activar los avisos', e);
      setEstado('error');
    }
  };

  const desactivar = async () => {
    setEstado('activando');
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch(ENDPOINT, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => {});
        await sub.unsubscribe();
      }
    } catch (e) { /* ya no estaba suscrito */ }
    setEstado('listo');
  };

  const cerrar = () => { guardar('cerrado'); setEstado('oculto'); };

  if (estado === 'oculto') return null;

  let titulo = 'Recibe avisos de TMD';
  let detalle = 'Te mandamos una notificación cuando salga un video o una publicación nueva.';
  if (estado === 'activo') {
    titulo = permanente ? 'Avisos activados' : '¡Listo! Te avisaremos de lo nuevo.';
    detalle = permanente ? 'Te avisaremos cuando salga un video o una publicación nueva.' : '';
  } else if (estado === 'error') {
    titulo = 'No se pudieron activar los avisos';
    detalle = 'Intenta de nuevo más tarde.';
  } else if (estado === 'bloqueado') {
    titulo = 'Los avisos están bloqueados';
    detalle = 'Permite las notificaciones de esta página en la configuración de tu navegador y vuelve a intentarlo.';
  } else if (estado === 'sinSoporte') {
    titulo = 'Avisos de videos y publicaciones';
    const comoApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (!window.isSecureContext) {
      // p. ej. al probar con http://<ip>:3000; en la página publicada (https) sí funciona
      detalle = 'Los avisos solo funcionan en la página publicada (con https).';
    } else if (esIOS() && comoApp) {
      detalle = 'Tu versión de iOS no permite avisos. Actualiza a iOS 16.4 o más nuevo.';
    } else if (esIOS()) {
      detalle = 'En iPhone y iPad primero agrega TMD como app (arriba) y ábrela desde tu pantalla de inicio. Ahí podrás activar los avisos.';
    } else {
      detalle = 'Este navegador no permite notificaciones. Prueba con Chrome, Edge, Firefox o Safari.';
    }
  }

  const puedeActivar = estado === 'listo' || estado === 'activando' || estado === 'error';

  return (
    <div
      className={`avisos-tmd${estado === 'activo' ? ' is-activo' : ''}${permanente ? ' avisos-tmd--fijo' : ''}`}
      role="region"
      aria-label="Avisos de la página"
    >
      <span className="avisos-tmd__ico" aria-hidden="true"><Icono nombre={estado === 'activo' ? 'check' : 'campana'} /></span>
      <span className="avisos-tmd__texto">
        <strong>{titulo}</strong>
        {detalle && <span>{detalle}</span>}
      </span>
      {puedeActivar && (
        <button type="button" className="avisos-tmd__btn" onClick={activar} disabled={estado === 'activando'}>
          {estado === 'activando' ? 'Un momento…' : 'Activar'}
        </button>
      )}
      {permanente && estado === 'activo' && (
        <button type="button" className="avisos-tmd__btn avisos-tmd__btn--ghost" onClick={desactivar}>
          Desactivar
        </button>
      )}
      {!permanente && estado !== 'activo' && (
        <button type="button" className="avisos-tmd__cerrar" onClick={cerrar} aria-label="Ocultar">
          <Icono nombre="cerrar" />
        </button>
      )}
    </div>
  );
};

export default ActivarAvisos;
