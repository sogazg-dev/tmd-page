// Historial de "Continuar viendo".
// Se guarda solo en el navegador de cada usuario (localStorage), sin base de datos.

const KEY = 'tmd-continuar-viendo:v1';
const MAX = 12;
const EVENT = 'tmd-history-change';

export function getHistory() {
  try {
    const list = JSON.parse(window.localStorage.getItem(KEY));
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function save(list) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch (e) {
    // Sin almacenamiento disponible (modo privado, etc.)
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Registra el video abierto al inicio del historial (sin duplicados). */
export function addToHistory(video) {
  if (!video || !video.videoId) return;
  const entry = {
    videoId: video.videoId,
    section: video.section,
    title: video.title,
    thumbnailUrl: video.thumbnailUrl,
    watchedAt: Date.now(),
  };
  const list = getHistory().filter((v) => v.videoId !== video.videoId);
  save([entry, ...list].slice(0, MAX));
}

export function clearHistory() {
  save([]);
}

/** Avisa cuando cambia el historial (para refrescar la fila). */
export function onHistoryChange(callback) {
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
