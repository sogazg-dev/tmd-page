// ============================================================================
//  Avisos (notificaciones push) de videos y publicaciones nuevas
// ============================================================================
//  Lo usan netlify/functions/avisos.mjs (suscribirse) y
//  netlify/functions/avisos-revisar.mjs (revisa cada 15 min y avisa).
//
//  No usa librerías externas: las notificaciones se mandan "vacías" (solo el
//  aviso firmado con las claves VAPID) y el service worker (public/sw.js)
//  pide el texto a /.netlify/functions/avisos al recibirla.
//
//  Variables de entorno (Netlify):
//    VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY  claves de las notificaciones
//    AVISOS_CANALES  (opcional) canales a revisar, separados por coma
//                    (por defecto @TMD2.0)
// ============================================================================
const crypto = require('crypto');
const { fetchPosts } = require('./youtubePosts');

const CANALES = (process.env.AVISOS_CANALES || '@TMD2.0').split(',').map((c) => c.trim()).filter(Boolean);
const CONTACTO = 'mailto:tmd.revival@gmail.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const claves = () => {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) throw new Error('Faltan VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY');
  return { pub, priv };
};

// Firma VAPID (JWT ES256) para el servidor de notificaciones del navegador
function firmaVapid(endpoint, { pub, priv }) {
  const raw = Buffer.from(pub, 'base64url');
  const llave = crypto.createPrivateKey({
    format: 'jwk',
    key: { kty: 'EC', crv: 'P-256', d: priv, x: raw.subarray(1, 33).toString('base64url'), y: raw.subarray(33, 65).toString('base64url') },
  });
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const datos = `${b64({ typ: 'JWT', alg: 'ES256' })}.${b64({
    aud: new URL(endpoint).origin,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: CONTACTO,
  })}`;
  const firma = crypto.sign('sha256', Buffer.from(datos), { key: llave, dsaEncoding: 'ieee-p1363' }).toString('base64url');
  return `vapid t=${datos}.${firma}, k=${pub}`;
}

/** Manda un aviso (sin contenido) a una suscripción. Regresa el código HTTP. */
async function enviar(suscripcion, k = claves()) {
  const res = await fetch(suscripcion.endpoint, {
    method: 'POST',
    headers: { Authorization: firmaVapid(suscripcion.endpoint, k), TTL: String(24 * 3600), Urgency: 'normal', 'Content-Length': '0' },
  });
  return res.status;
}

const suscripcionValida = (s) =>
  s && typeof s.endpoint === 'string' && /^https:\/\//.test(s.endpoint) && s.endpoint.length < 1000 &&
  s.keys && typeof s.keys.p256dh === 'string' && typeof s.keys.auth === 'string';

const idDe = (endpoint) => crypto.createHash('sha256').update(endpoint).digest('hex').slice(0, 40);

// ---------- Fuentes: videos (feed del canal) y publicaciones ----------
async function idCanal(handle) {
  const res = await fetch(`https://www.youtube.com/${handle}`, { headers: { 'User-Agent': UA, Cookie: 'CONSENT=YES+1; SOCS=CAI' } });
  if (!res.ok) throw new Error(`YouTube respondió ${res.status} para ${handle}`);
  const html = await res.text();
  const m = html.match(/"externalId":"(UC[\w-]{22})"/) || html.match(/channel\/(UC[\w-]{22})/);
  if (!m) throw new Error(`No se encontró el canal ${handle}`);
  return m[1];
}

const entidades = (t) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

async function videosRecientes(canalId) {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${canalId}`, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Feed ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
    id: (e.match(/<yt:videoId>([^<]+)/) || [])[1],
    titulo: entidades((e.match(/<title>([^<]*)/) || [])[1] || ''),
    canal: entidades((e.match(/<author>\s*<name>([^<]*)/) || [])[1] || ''),
    imagen: (e.match(/<media:thumbnail url="([^"]+)"/) || [])[1] || '',
  })).filter((v) => v.id);
}

async function ultimaPublicacion() {
  const { posts } = await fetchPosts({ limit: 1 });
  const p = posts[0];
  if (!p) return null;
  const texto = (p.content || []).map((s) => s.text).join('').replace(/\s+/g, ' ').trim();
  return { id: p.id, autor: p.author, texto: texto.length > 120 ? `${texto.slice(0, 117)}…` : texto, imagen: p.attachment && p.attachment.images ? p.attachment.images[0] : '' };
}

module.exports = { CANALES, claves, enviar, suscripcionValida, idDe, idCanal, videosRecientes, ultimaPublicacion, firmaVapid };
