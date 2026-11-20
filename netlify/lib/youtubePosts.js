// Lee las publicaciones (pestaña "Publicaciones"/"Comunidad") de un canal de YouTube.
//
// YouTube no ofrece API oficial para las publicaciones, así que se lee la página
// pública del canal y se extrae el JSON que YouTube incluye en ella
// (ytInitialData). Se busca el bloque "backstagePostRenderer" en cualquier
// parte del JSON para tolerar cambios en la estructura de la página.
//
// Se usa desde:
//   - netlify/functions/youtube-posts.js  (producción, en Netlify)
//   - src/setupProxy.js                   (desarrollo local con `npm start`)

const DEFAULT_HANDLE = '@TMD2.0';
const DEFAULT_LIMIT = 5;

const absolute = (url) => (url && url.startsWith('//') ? `https:${url}` : url || '');

const biggest = (thumbnails = []) =>
  absolute((thumbnails.slice().sort((a, b) => (b.width || 0) - (a.width || 0))[0] || {}).url);

const text = (node) => {
  if (!node) return '';
  if (node.simpleText) return node.simpleText;
  if (node.runs) return node.runs.map((r) => r.text).join('');
  if (node.content) return node.content;
  return '';
};

// Convierte el texto de YouTube en segmentos { text, url } (url opcional).
function segments(contentText) {
  if (!contentText) return [];
  if (!contentText.runs) return [{ text: text(contentText) }];
  return contentText.runs.map((run) => {
    const ep = run.navigationEndpoint || {};
    let url =
      (ep.urlEndpoint && ep.urlEndpoint.url) ||
      (ep.commandMetadata && ep.commandMetadata.webCommandMetadata && ep.commandMetadata.webCommandMetadata.url) ||
      '';
    if (url.startsWith('/')) url = `https://www.youtube.com${url}`;
    // Los links externos vienen envueltos en youtube.com/redirect?q=<link real>
    try {
      const u = new URL(url);
      if (u.pathname === '/redirect' && u.searchParams.get('q')) url = u.searchParams.get('q');
    } catch (e) {
      url = '';
    }
    return url ? { text: run.text, url } : { text: run.text };
  });
}

function attachment(att) {
  if (!att) return null;
  if (att.backstageImageRenderer) {
    return { type: 'images', images: [biggest(att.backstageImageRenderer.image.thumbnails)] };
  }
  if (att.postMultiImageRenderer) {
    const images = (att.postMultiImageRenderer.images || [])
      .map((i) => i.backstageImageRenderer && biggest(i.backstageImageRenderer.image.thumbnails))
      .filter(Boolean);
    return { type: 'images', images };
  }
  if (att.videoRenderer && att.videoRenderer.videoId) {
    const v = att.videoRenderer;
    return {
      type: 'video',
      videoId: v.videoId,
      title: text(v.title),
      thumbnail: biggest(v.thumbnail && v.thumbnail.thumbnails) || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${v.videoId}`,
    };
  }
  if (att.pollRenderer) {
    return {
      type: 'poll',
      choices: (att.pollRenderer.choices || []).map((c) => text(c.text)),
      totalVotes: text(att.pollRenderer.totalVotes),
    };
  }
  if (att.quizRenderer) {
    return { type: 'poll', choices: (att.quizRenderer.choices || []).map((c) => text(c.text)), totalVotes: '' };
  }
  return null;
}

function findPostRenderers(node, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    node.forEach((n) => findPostRenderers(n, out));
    return out;
  }
  for (const [key, value] of Object.entries(node)) {
    if (key === 'backstagePostRenderer' && value && value.postId) {
      out.push(value);
    } else if (key === 'sharedPostRenderer') {
      // Publicación compartida: se usa la publicación original.
      findPostRenderers(value.originalPost, out);
    } else {
      findPostRenderers(value, out);
    }
  }
  return out;
}

function extractInitialData(html) {
  const marker = html.match(/(?:var\s+ytInitialData|window\["ytInitialData"\])\s*=\s*/);
  if (!marker) throw new Error('No se encontró ytInitialData en la página del canal');
  const start = marker.index + marker[0].length;
  // Recorre el JSON contando llaves (respetando strings) para encontrar su final.
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return JSON.parse(html.slice(start, i + 1));
    }
  }
  throw new Error('ytInitialData incompleto');
}

function parsePosts(html, limit = DEFAULT_LIMIT) {
  const data = extractInitialData(html);
  const seen = new Set();
  return findPostRenderers(data)
    .filter((p) => !seen.has(p.postId) && seen.add(p.postId))
    .slice(0, limit)
    .map((p) => ({
      id: p.postId,
      url: `https://www.youtube.com/post/${p.postId}`,
      author: text(p.authorText),
      authorAvatar: biggest(p.authorThumbnail && p.authorThumbnail.thumbnails),
      published: text(p.publishedTimeText),
      likes: text(p.voteCount),
      content: segments(p.contentText),
      attachment: attachment(p.backstageAttachment),
    }));
}

async function fetchPosts({ handle = DEFAULT_HANDLE, limit = DEFAULT_LIMIT } = {}) {
  const url = `https://www.youtube.com/${handle}/posts?hl=es-419&gl=MX`;
  const res = await fetch(url, {
    headers: {
      'Accept-Language': 'es-419,es;q=0.9',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      // Evita la pantalla de consentimiento de cookies de YouTube.
      Cookie: 'CONSENT=YES+1; SOCS=CAI',
    },
  });
  if (!res.ok) throw new Error(`YouTube respondió ${res.status}`);
  const html = await res.text();
  return {
    channelUrl: `https://www.youtube.com/${handle}/posts`,
    posts: parsePosts(html, limit),
  };
}

module.exports = { fetchPosts, parsePosts, DEFAULT_HANDLE, DEFAULT_LIMIT };
