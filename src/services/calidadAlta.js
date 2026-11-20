// Relaciona cada episodio con su versión en mejor calidad (ver
// src/config/calidadAlta.js). La playlist HD se lee de YouTube igual que las
// demás (con la misma caché del navegador).
import { useEffect, useState } from 'react';
import config from '../config/calidadAlta';
import { loadSection } from './youtube';

const NUMEROS = { uno: 1, dos: 2, tres: 3, cuatro: 4, i: 1, ii: 2, iii: 3, iv: 4 };

/** Número de episodio ("3", "8.5") y parte (1, 2… o null) a partir del título. */
export function parseEpisodio(title = '') {
  const t = title.toLowerCase();
  let m = t.match(/(?:episodio|episode|cap[ií]tulo|cap\.?|ep\.?|#)\s*(\d{1,2}(?:[.,]5)?)(?!\d)/);
  if (!m) m = t.match(/(?:^|[^\d.,])(\d{1,2}(?:[.,]5)?)(?![\d])/);
  const num = m ? m[1].replace(',', '.') : null;
  const p = t.match(/(?:parte|part|pt)\.?\s*(\d+|uno|dos|tres|cuatro|iv|i{1,3})\b/);
  let parte = null;
  if (p) parte = /^\d+$/.test(p[1]) ? Number(p[1]) : NUMEROS[p[1]] || null;
  return { num, parte };
}

const enRango = (num) => {
  if (!num || config.ignorar.includes(num)) return false;
  const n = Number(num);
  return n >= config.desde && n <= config.hasta;
};

/** { idDelVideoEnLaPagina: videoHD } para todos los episodios de la sección. */
export function relacionar(episodios, videosHD) {
  const hd = videosHD
    .map((v) => ({ v, ...parseEpisodio(v.title) }))
    .filter((x) => enRango(x.num));
  const porId = Object.fromEntries(videosHD.map((v) => [v.videoId, v]));
  const out = {};
  episodios.forEach((ep) => {
    if (Object.prototype.hasOwnProperty.call(config.manual, ep.videoId)) {
      const id = config.manual[ep.videoId];
      if (id) out[ep.videoId] = porId[id] || { videoId: id, webUrl: `https://www.youtube.com/embed/${id}` };
      return;
    }
    const { num, parte } = parseEpisodio(ep.title);
    if (!enRango(num)) return;
    const mismoNum = hd.filter((x) => x.num === num);
    // misma parte; si la versión HD es el episodio completo, sirve para todas sus partes
    const match = mismoNum.find((x) => x.parte === parte) || (parte != null && mismoNum.find((x) => x.parte == null));
    if (match) out[ep.videoId] = match.v;
  });
  return out;
}

let cache = null;
const cargarHD = () => {
  if (!cache) {
    cache = loadSection({ key: 'TMD_ARCHIVE', title: 'TMD ARCHIVE', logo: null, playlistUrl: config.playlistUrl })
      .catch((e) => {
        cache = null;
        throw e;
      });
  }
  return cache;
};

/** Video HD del episodio (o null). Solo carga la playlist HD en la sección configurada. */
export function useVersionHD(section, episodios, episodio) {
  const aplica = section === config.seccion;
  const [videosHD, setVideosHD] = useState([]);
  useEffect(() => {
    if (!aplica) return undefined;
    let vivo = true;
    cargarHD().then((v) => vivo && setVideosHD(v)).catch(() => {});
    return () => { vivo = false; };
  }, [aplica]);
  if (!aplica || !episodio || !videosHD.length) return null;
  const mapa = relacionar(episodios, videosHD);
  if (process.env.NODE_ENV === 'development' && !useVersionHD.logged) {
    useVersionHD.logged = true;
    // Para revisar en la consola del navegador qué episodio quedó con cuál video HD
    // eslint-disable-next-line no-console
    console.table(episodios.map((e) => ({ episodio: e.title, hd: mapa[e.videoId] ? mapa[e.videoId].title : '—' })));
  }
  return mapa[episodio.videoId] || null;
}
