import React from 'react';
import { Link } from 'react-router-dom';
import fireVideo from '../../assets/videos/Fire.mp4';
import FondoVideo from '../FondoVideo';
import homeConfig from '../../config/home';
import { usePlaylists } from '../../context/PlaylistsContext';
import { useYouTubePosts, PostCard, CHANNEL_POSTS_URL } from '../News/YouTubePosts';
import '../News/YouTubePosts.scss';
import './HomeFeed.scss';
import Icono from '../Iconos';
import flipslopeThumb from '../../assets/images/juegos/flipslope.png';

// Primer párrafo de la descripción, recortado.
const shortText = (text = '', max = 160) => {
  const first = text.split(/\n\s*\n/)[0].trim();
  return first.length > max ? `${first.slice(0, max).trim()}…` : first;
};

// ---------- Último episodio ----------
const LatestEpisode = () => {
  const { sections, bySection } = usePlaylists();
  const { section, videoId } = homeConfig.featured;
  const sectionConfig = sections.find((s) => s.key === section);
  const state = bySection[section] || { status: 'empty', videos: [] };
  const episode = (videoId && state.videos.find((v) => v.videoId === videoId)) || state.videos[state.videos.length - 1];

  return (
    <section className="home-feed__block">
      <h2 className="home-feed__kicker">Último episodio</h2>
      {episode ? (
        <>
          <Link to={`/videos/${episode.section}/${episode.videoId}`} className="home-feed__thumb">
            <img src={episode.thumbnailUrl} alt={episode.title} />
            <span className="home-feed__play" aria-hidden="true"><Icono nombre="play" /></span>
          </Link>
          <div className="home-feed__info">
            {sectionConfig && sectionConfig.logo && (
              <img className="home-feed__logo" src={sectionConfig.logo} alt={sectionConfig.title} />
            )}
            <h3 className="home-feed__title">{episode.title}</h3>
            {episode.description && <p className="home-feed__desc">{shortText(episode.description)}</p>}
            <div className="home-feed__actions">
              <Link to={`/videos/${episode.section}/${episode.videoId}`} className="home-feed__btn">
                <Icono nombre="play" /> Ver episodio
              </Link>
              <Link to={`/videos/${episode.section}`} className="home-feed__btn home-feed__btn--ghost">
                Todos los episodios
              </Link>
            </div>
          </div>
        </>
      ) : (
        <p className="home-feed__status">
          {state.status === 'loading' ? 'Cargando episodio...' : 'No se pudo cargar el episodio.'}
        </p>
      )}
    </section>
  );
};

// ---------- Próximo episodio ----------
const UpcomingEpisode = () => {
  const { sections } = usePlaylists();
  const { show, section, title, thumb, note } = homeConfig.upcoming || {};
  if (!show) return null;
  const sectionConfig = sections.find((s) => s.key === section);

  return (
    <section className="home-feed__block">
      <h2 className="home-feed__kicker">Próximo episodio</h2>
      <div className="home-feed__upcoming">
        <div className="home-feed__upcoming-thumb" aria-hidden="true">
          <span>{thumb}</span>
        </div>
        <div className="home-feed__upcoming-text">
          {sectionConfig && sectionConfig.logo && (
            <img className="home-feed__logo home-feed__logo--small" src={sectionConfig.logo} alt={sectionConfig.title} />
          )}
          <h3>{title}</h3>
          <span className="home-feed__badge">{note}</span>
        </div>
      </div>
    </section>
  );
};

// ---------- Última publicación ----------
const LatestPost = () => {
  const { status, posts } = useYouTubePosts();
  const post = posts[0];

  return (
    <section className="home-feed__block">
      <div className="home-feed__head">
        <h2 className="home-feed__kicker">Última publicación</h2>
        <Link to="/news">Ver noticias ›</Link>
      </div>
      {status === 'loading' && <p className="home-feed__status">Cargando publicación...</p>}
      {post && <PostCard post={post} />}
      {(status === 'error' || (status === 'ready' && !post)) && (
        <p className="home-feed__status">
          No pudimos cargar la publicación.{' '}
          <a href={CHANNEL_POSTS_URL} target="_blank" rel="noopener noreferrer">Verla en YouTube</a>
        </p>
      )}
    </section>
  );
};

// Anuncio del próximo juego (debajo de la última publicación).
// Para quitarlo cuando salga el juego, borra <AnuncioJuego /> de abajo.
const AnuncioJuego = () => (
  <section className="home-feed__block">
    <h2 className="home-feed__kicker">Próximamente</h2>
    <Link to="/juegos" className="home-feed__juego">
      <span className="home-feed__juego-img">
        <img src={flipslopeThumb} alt="" loading="lazy" />
        <span className="home-feed__juego-sello">Diciembre</span>
      </span>
      <span className="home-feed__juego-info">
        <strong>FlipSlope llega en diciembre</strong>
        <span>Rueda con Johnny cuesta abajo, esquiva a los ninjas y no toques La Substancia XXX.</span>
        <span className="home-feed__juego-link">Ver en Juegos ›</span>
      </span>
    </Link>
  </section>
);

// layout="desktop": debajo de los botones de Inicio, cuadrícula de 2 × 2.
// layout="mobile":  portada de Inicio en celular y tableta (≤1205px), 1 columna.
const HomeFeed = ({ layout = 'mobile' }) => {
  if (layout === 'desktop') {
    return (
      // Cuadrícula de 2 × 2: arriba último episodio y última publicación;
      // abajo próximo episodio y el anuncio del juego (mismo tamaño).
      <div className="home-feed home-feed--desktop">
        <LatestEpisode />
        <LatestPost />
        <div className="home-feed__abajo"><UpcomingEpisode /></div>
        <div className="home-feed__abajo"><AnuncioJuego /></div>
      </div>
    );
  }

  return (
    <div className="home-feed home-feed--mobile">
      <div className="home-feed__hero">
        <FondoVideo src={fireVideo} className="home-feed__fire" />
        <LatestEpisode />
      </div>
      <UpcomingEpisode />
      <LatestPost />
      <AnuncioJuego />
    </div>
  );
};

export default HomeFeed;
