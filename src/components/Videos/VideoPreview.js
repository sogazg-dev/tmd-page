import React, { useState, useEffect } from 'react';
import './VideoPreview.scss'; // You can create a CSS file for styling
import { Link } from 'react-router-dom';
import Icono from '../Iconos';

// Primer párrafo de la descripción de YouTube, recortado para la portada.
export const shortDescription = (text = '', max = 220) => {
  const firstParagraph = text.split(/\n\s*\n/)[0].trim();
  return firstParagraph.length > max ? `${firstParagraph.slice(0, max).trim()}…` : firstParagraph;
};

const VideoPreview = ({ episodes = [], loading = false }) => {
  const [episodeData, setEpisodeData] = useState(null);

  // Elige un episodio al azar una vez que hay videos (y no lo cambia mientras
  // terminan de cargar las demás playlists).
  useEffect(() => {
    if (episodeData || !episodes.length) return;
    const randomEpisode = episodes[Math.floor(Math.random() * episodes.length)];
    setEpisodeData(randomEpisode);
  }, [episodes, episodeData]);

  if (!episodeData) {
    return <div className="episode-preview-loading">{loading ? 'Loading...' : ''}</div>;
  }

  return (
    <div className="episode-preview-container">
      <div className="background-image" style={{ backgroundImage: `url(${episodeData.backgroundImage})` }}>
        <div className="gradient-overlay" />
        <div className="content">
          <img src={episodeData.seriesLogo} alt="Series Logo" className="series-logo" />
          <h2 className="title">{episodeData.title}</h2>
          <p className="description">{shortDescription(episodeData.description)}</p>
          <Link style={{textDecoration: "none"}} to={`/videos/${episodeData.section}/${episodeData.videoId}`}>
          <button className="play-button">
            <span className="play-icon"><Icono nombre="play" /></span> Ver Episodio
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
