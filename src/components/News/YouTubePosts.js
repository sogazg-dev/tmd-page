import React, { useEffect, useState } from 'react';
import './YouTubePosts.scss';
import Icono from '../Iconos';

// Las publicaciones las entrega netlify/functions/youtube-posts.js
// (en local, src/setupProxy.js). El canal y la cantidad se configuran ahí.
const ENDPOINT = '/.netlify/functions/youtube-posts';
const CHANNEL_POSTS_URL = 'https://www.youtube.com/@TMD2.0/posts';
const CACHE_KEY = 'tmd-youtube-posts:v1';
const CACHE_MS = 10 * 60 * 1000;

const readCache = () => {
  try {
    const c = JSON.parse(window.localStorage.getItem(CACHE_KEY));
    return c && Date.now() - c.savedAt < CACHE_MS ? c.data : null;
  } catch (e) {
    return null;
  }
};

const writeCache = (data) => {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
  } catch (e) { /* sin almacenamiento */ }
};

const PostText = ({ content }) => (
  <p className="yt-post__text">
    {content.map((seg, i) =>
      seg.url ? (
        <a key={i} href={seg.url} target="_blank" rel="noopener noreferrer">{seg.text}</a>
      ) : (
        <React.Fragment key={i}>{seg.text}</React.Fragment>
      )
    )}
  </p>
);

const Attachment = ({ attachment, postUrl }) => {
  if (!attachment) return null;
  if (attachment.type === 'images' && attachment.images.length) {
    return (
      <div className={`yt-post__images yt-post__images--${Math.min(attachment.images.length, 2)}`}>
        {attachment.images.map((src) => (
          <a key={src} href={postUrl} target="_blank" rel="noopener noreferrer">
            <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" />
          </a>
        ))}
      </div>
    );
  }
  if (attachment.type === 'video') {
    return (
      <a className="yt-post__video" href={attachment.url} target="_blank" rel="noopener noreferrer">
        <img src={attachment.thumbnail} alt={attachment.title} loading="lazy" referrerPolicy="no-referrer" />
        <span className="yt-post__video-title"><span className="play-icon"><Icono nombre="play" /></span> {attachment.title}</span>
      </a>
    );
  }
  if (attachment.type === 'poll') {
    return (
      <a className="yt-post__poll" href={postUrl} target="_blank" rel="noopener noreferrer">
        {attachment.choices.map((choice) => (
          <span key={choice} className="yt-post__poll-choice">{choice}</span>
        ))}
        <span className="yt-post__poll-cta">
          {attachment.totalVotes ? `${attachment.totalVotes} · ` : ''}Vota en YouTube
        </span>
      </a>
    );
  }
  return null;
};

// Obtiene las publicaciones (con caché de 10 min en el navegador).
// También la usa la portada de Inicio en celular.
export const useYouTubePosts = () => {
  const [state, setState] = useState(() => {
    const cached = readCache();
    return cached ? { status: 'ready', data: cached } : { status: 'loading', data: null };
  });

  useEffect(() => {
    if (state.status === 'ready') return;
    let cancelled = false;
    fetch(ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        writeCache(data);
        setState({ status: 'ready', data });
      })
      .catch((err) => {
        console.error('No se pudieron cargar las publicaciones:', err);
        if (!cancelled) setState({ status: 'error', data: null });
      });
    return () => {
      cancelled = true;
    };
  }, [state.status]);

  return { status: state.status, posts: (state.data && state.data.posts) || [] };
};

export { CHANNEL_POSTS_URL };

// Tarjeta de una publicación.
export const PostCard = ({ post }) => (
  <article className="yt-post">
    <header className="yt-post__header">
      {post.authorAvatar && <img className="yt-post__avatar" src={post.authorAvatar} alt="" referrerPolicy="no-referrer" />}
      <div>
        <span className="yt-post__author">{post.author || 'TMD2.0'}</span>
        {post.published && <span className="yt-post__date">{post.published}</span>}
      </div>
    </header>
    <PostText content={post.content} />
    <Attachment attachment={post.attachment} postUrl={post.url} />
    <footer className="yt-post__footer">
      {post.likes && <span className="yt-post__likes"><Icono nombre="like" /> {post.likes}</span>}
      <a href={post.url} target="_blank" rel="noopener noreferrer">Ver en YouTube</a>
    </footer>
  </article>
);

const YouTubePosts = () => {
  const { status, posts } = useYouTubePosts();

  return (
    <section className="yt-posts">
      <h2 className="yt-posts__title">Publicaciones de TMD2</h2>

      {status === 'loading' && <p className="yt-posts__status">Cargando publicaciones...</p>}

      {(status === 'error' || (status === 'ready' && !posts.length)) && (
        <p className="yt-posts__status">
          No pudimos cargar las publicaciones ahora.{' '}
          <a href={CHANNEL_POSTS_URL} target="_blank" rel="noopener noreferrer">Velas directamente en YouTube</a>.
        </p>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {posts.length > 0 && (
        <a className="yt-posts__more" href={CHANNEL_POSTS_URL} target="_blank" rel="noopener noreferrer">
          Ver todas las publicaciones
        </a>
      )}
    </section>
  );
};

export default YouTubePosts;
