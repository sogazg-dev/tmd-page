import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { usePlaylists } from '../context/PlaylistsContext';
import './Scroll.css';
import './SeriesVideos.scss';

// "Ver todo": todos los videos de una serie en cuadrícula (/videos/:section).
const SeriesVideos = () => {
  const { section } = useParams();
  const { sections, bySection } = usePlaylists();
  const config = sections.find((s) => s.key === section);

  // Claves que no existen (o links viejos tipo /videos/3) regresan a Videos.
  if (!config) return <Navigate to="/videos" replace />;

  const { status, videos } = bySection[section];

  return (
    <div>
      <Navbar />
      <div className="series-page">
        <div className="series-page__header">
          <Link to={config.grupo === 'comunidad' ? '/videos#comunidad' : '/videos'} className="series-page__back">‹ Videos</Link>
          {config.logo && <img className="series-page__logo" src={config.logo} alt="" />}
          <div className="series-page__titles">
            <h1>{config.title}</h1>
            {status === 'ready' && (
              <span>{videos.length} {videos.length === 1 ? 'video' : 'videos'}</span>
            )}
          </div>
        </div>

        {status === 'loading' && <p className="series-page__status">Cargando videos...</p>}
        {status === 'error' && <p className="series-page__status">No se pudieron cargar los videos. Intenta de nuevo más tarde.</p>}
        {status === 'empty' && <p className="series-page__status">Próximamente</p>}

        <div className="series-page__grid">
          {videos.map((v, i) => (
            <Link key={v.videoId} to={`/videos/${section}/${v.videoId}`} className="series-card">
              <div className="series-card__thumb">
                <img src={v.thumbnailUrl} alt="" loading="lazy" />
                <span className="series-card__num">{i + 1}</span>
              </div>
              <p className="series-card__title">{v.title}</p>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SeriesVideos;
