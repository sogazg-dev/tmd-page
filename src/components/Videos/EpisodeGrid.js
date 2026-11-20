import React from 'react';
import { Link } from 'react-router-dom';
import './EpisodeGrid.scss';

const STATUS_MESSAGES = {
  loading: 'Cargando videos...',
  empty: 'Próximamente',
  error: 'No se pudieron cargar los videos. Intenta de nuevo más tarde.',
};

// Todos los videos de una playlist en cuadrícula (ej. "Destacado de la Comunidad").
const EpisodeGrid = ({ episodes = [], status = 'ready' }) => {
  if (!episodes.length) {
    return (
      <div className="episode-list episode-list--empty">
        <p className="episode-list-status">{STATUS_MESSAGES[status] || STATUS_MESSAGES.empty}</p>
      </div>
    );
  }
  return (
    <div className="episode-grid">
      {episodes.map((v) => (
        <Link key={v.videoId} to={`/videos/${v.section}/${v.videoId}`} className="episode-grid__card">
          <img src={v.thumbnailUrl} alt="" loading="lazy" />
          <p className="episode-grid__title">{v.title}</p>
        </Link>
      ))}
    </div>
  );
};

export default EpisodeGrid;
