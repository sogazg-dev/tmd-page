// Función de Netlify: GET /.netlify/functions/youtube-posts
// Regresa las últimas publicaciones del canal en JSON.
//
// Configurable con variables de entorno en Netlify (opcionales):
//   YOUTUBE_POSTS_HANDLE  canal a leer (por defecto @TMD2.0)
//   YOUTUBE_POSTS_LIMIT   cuántas publicaciones regresar (por defecto 5)

const { fetchPosts, DEFAULT_HANDLE, DEFAULT_LIMIT } = require('../lib/youtubePosts');

const handle = process.env.YOUTUBE_POSTS_HANDLE || DEFAULT_HANDLE;
const limit = Number(process.env.YOUTUBE_POSTS_LIMIT || DEFAULT_LIMIT);

// Copia en memoria mientras la función siga "caliente".
let memo = null;
const MEMO_MS = 10 * 60 * 1000;

exports.handler = async () => {
  try {
    if (!memo || Date.now() - memo.at > MEMO_MS) {
      memo = { at: Date.now(), body: await fetchPosts({ handle, limit }) };
    }
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // El CDN de Netlify guarda la respuesta 30 min, así casi nunca se consulta YouTube.
        'Cache-Control': 'public, max-age=600',
        'Netlify-CDN-Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
      },
      body: JSON.stringify(memo.body),
    };
  } catch (err) {
    console.error(err);
    if (memo) {
      return { statusCode: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(memo.body) };
    }
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ error: 'No se pudieron leer las publicaciones de YouTube' }),
    };
  }
};
