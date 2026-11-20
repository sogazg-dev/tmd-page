// Lectura de playlists desde la API de datos de YouTube (v3).
//
// No hay base de datos: cada visitante consulta YouTube directamente y el
// resultado se guarda unos minutos en el navegador (localStorage) para no
// gastar cuota de la API en cada recarga.

const API_URL = 'https://www.googleapis.com/youtube/v3/playlistItems';
const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
// Permite apuntar a un servidor de pruebas (opcional, solo para desarrollo).
const API_BASE = process.env.REACT_APP_YOUTUBE_API_BASE || API_URL;
const CACHE_MINUTES = Number(process.env.REACT_APP_PLAYLIST_CACHE_MINUTES || 15);
const CACHE_PREFIX = 'tmd-playlist:v1:';

// Videos que YouTube devuelve en la playlist pero que no se pueden ver.
const HIDDEN_TITLES = new Set(['Private video', 'Deleted video', 'Video privado', 'Video eliminado']);

export const hasApiKey = () => Boolean(API_KEY);

/** Acepta un link de playlist completo o solo el ID y devuelve el ID. */
export function extractPlaylistId(urlOrId) {
  if (!urlOrId) return '';
  const value = String(urlOrId).trim();
  const match = value.match(/[?&]list=([A-Za-z0-9_-]+)/);
  if (match) return match[1];
  return /^[A-Za-z0-9_-]+$/.test(value) ? value : '';
}

function bestThumbnail(thumbnails = {}) {
  // maxres y medium son 16:9; high/standard traen franjas negras (4:3).
  const t = thumbnails.maxres || thumbnails.standard || thumbnails.high || thumbnails.medium || thumbnails.default;
  return t ? t.url : '';
}

function readCache(playlistId) {
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + playlistId);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function writeCache(playlistId, videos) {
  try {
    window.localStorage.setItem(CACHE_PREFIX + playlistId, JSON.stringify({ savedAt: Date.now(), videos }));
  } catch (e) {
    // Sin almacenamiento disponible (modo privado, etc.): simplemente no se guarda.
  }
}

async function fetchAllItems(playlistId) {
  const items = [];
  let pageToken = '';
  do {
    const params = new URLSearchParams({
      part: 'snippet,status',
      maxResults: '50',
      playlistId,
      key: API_KEY || '',
    });
    if (pageToken) params.set('pageToken', pageToken);

    const res = await fetch(`${API_BASE}?${params.toString()}`);
    if (!res.ok) {
      let reason = `HTTP ${res.status}`;
      try {
        const body = await res.json();
        reason = (body.error && body.error.message) || reason;
      } catch (e) { /* respuesta sin JSON */ }
      throw new Error(`YouTube respondió con error para la playlist ${playlistId}: ${reason}`);
    }
    const data = await res.json();
    items.push(...(data.items || []));
    pageToken = data.nextPageToken || '';
  } while (pageToken);
  return items;
}

/**
 * Convierte los elementos de la playlist al mismo formato de "episodio" que
 * ya usaban los componentes de la página.
 */
function toEpisodes(items, section) {
  return items
    .filter((item) => {
      const s = item.snippet || {};
      const privacy = item.status && item.status.privacyStatus;
      if (privacy === 'private' || privacy === 'privacyStatusUnspecified') return false;
      if (HIDDEN_TITLES.has(s.title)) return false;
      return Boolean(s.resourceId && s.resourceId.videoId);
    })
    .map((item, index) => {
      const s = item.snippet;
      const videoId = s.resourceId.videoId;
      const thumb = bestThumbnail(s.thumbnails);
      return {
        id: index + 1,
        videoId,
        section: section.key,
        title: s.title,
        description: s.description || '',
        thumbnailUrl: thumb,
        backgroundImage: thumb,
        seriesLogo: section.logo,
        webUrl: `https://www.youtube.com/embed/${videoId}`,
      };
    });
}

/**
 * Devuelve los episodios de una sección. Usa la caché del navegador si es
 * reciente; si YouTube falla y hay una copia vieja, usa esa copia.
 */
export async function loadSection(section) {
  const playlistId = extractPlaylistId(section.playlistUrl);
  if (!playlistId) return [];

  const cached = readCache(playlistId);
  const fresh = cached && Date.now() - cached.savedAt < CACHE_MINUTES * 60 * 1000;
  if (fresh) return relabel(cached.videos, section);

  if (!API_KEY) {
    throw new Error('Falta REACT_APP_YOUTUBE_API_KEY. Revisa el archivo .env.local (ver README).');
  }

  try {
    const items = await fetchAllItems(playlistId);
    const videos = toEpisodes(items, section);
    writeCache(playlistId, videos);
    return videos;
  } catch (err) {
    if (cached) {
      console.warn(err.message, '— se muestra la última copia guardada.');
      return relabel(cached.videos, section);
    }
    throw err;
  }
}

// Si la misma playlist se usa en dos secciones, ajusta sección y logo.
function relabel(videos, section) {
  return videos.map((v) => ({ ...v, section: section.key, seriesLogo: section.logo }));
}
