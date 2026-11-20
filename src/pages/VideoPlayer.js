// VideoPlayer.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import './VideoPlayer.scss';
import './Scroll.css'
import AdComponent from '../components/Videos/AdComponent'
import EpisodeList from '../components/Videos/EpisodeList';
import { usePlaylists } from '../context/PlaylistsContext';
import { addToHistory } from '../services/watchHistory';
import { useVersionHD } from '../services/calidadAlta';
import Icono from '../components/Iconos';

// Convierte los links de la descripción de YouTube en links clicables.
const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
const Description = ({ text }) => (
  <p className="episode-description">
    {text.split(URL_PATTERN).map((part, i) =>
      i % 2 === 1 ? (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      )
    )}
  </p>
);

const VideoPlayer = () => {
  const { section, episodeId } = useParams();
  const { sections, bySection } = usePlaylists();
  // La descripción empieza oculta y se vuelve a ocultar al cambiar de video.
  const [showDescription, setShowDescription] = useState(false);
  // Versión en mejor calidad (solo algunos episodios; ver src/config/calidadAlta.js)
  const [verHD, setVerHD] = useState(false);
  useEffect(() => {
    setShowDescription(false);
    setVerHD(false);
  }, [section, episodeId]);

  const sectionConfig = sections.find((s) => s.key === section);
  const { status, videos: list } = bySection[section] || { status: 'empty', videos: [] };

  // El episodio se busca por ID de YouTube; los links viejos usaban la
  // posición en la lista (/videos/DMB/0, /videos/DMB/1, ...), también funcionan.
  let index = list.findIndex((v) => v.videoId === episodeId);
  if (index === -1 && /^\d+$/.test(episodeId) && Number(episodeId) < list.length) {
    index = Number(episodeId);
  }
  const selectedEpisode = list[index];
  const versionHD = useVersionHD(section, list, selectedEpisode);

  // Guarda el video en "Continuar viendo"
  const watchedId = selectedEpisode && selectedEpisode.videoId;
  useEffect(() => {
    if (selectedEpisode) addToHistory(selectedEpisode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedId]);

  if (!sectionConfig) return <Navigate to="/videos" replace />;

  if (!selectedEpisode) {
    if (status === 'loading') {
      return (
        <div>
          <Navbar />
          <p className="player-status">Cargando video...</p>
        </div>
      );
    }
    return <Navigate to="/videos" replace />;
  }

  const prevEpisode = list[index - 1];
  const nextEpisode = list[index + 1];

  return (
    <div>
    <head><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3081463517624663"
     crossOrigin="anonymous"></script></head>
      <Navbar />
      <div className="series-info">
        <img className='seriesLogo' src={selectedEpisode.seriesLogo} alt="Series Logo" />
        <div className="episode-details">
          <h2>{selectedEpisode.title}</h2>
        </div>
      </div>
      <div className="video-section">
      <AdComponent />
      {versionHD ? (
        <div className={`player-frame${verHD ? ' is-hd' : ''}`}>
          <iframe title="VideoP" width="1000" height="600"
            key={verHD ? 'hd' : 'normal'}
            src={ verHD ? versionHD.webUrl : selectedEpisode.webUrl }
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen >
          </iframe>
          <div className="hd-switch">
            <button
              type="button"
              className="hd-button"
              onClick={() => setVerHD((v) => !v)}
              aria-pressed={verHD}
              aria-label={verHD ? 'Ver la versión original' : 'Ver en mejor calidad'}
              title={verHD ? 'Ver la versión original' : 'Ver en mejor calidad'}
            >
              HD
            </button>
            <span className="hd-label">{verHD ? 'Viendo en mejor calidad' : 'Mejor calidad'}</span>
          </div>
        </div>
      ) : (
        <iframe title="VideoP" width="1000" height="600"
          src= { selectedEpisode.webUrl }
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen >
        </iframe>
      )} 
      {selectedEpisode.description && (
        <div className="description-toggle">
          <button
            className="description-button"
            onClick={() => setShowDescription((v) => !v)}
            aria-expanded={showDescription}
            aria-controls="episode-description"
          >
            {showDescription ? 'Ocultar descripción' : 'Ver descripción'} <Icono nombre={showDescription ? 'arriba' : 'abajo'} />
          </button>
          {showDescription && (
            <div id="episode-description" className="description-panel">
              <Description text={selectedEpisode.description} />
            </div>
          )}
        </div>
      )}
      <AdComponent />
      </div>
      <div className="button-container">
        
        {!prevEpisode ? (
          <button className="invisible-button"></button>
        ) : (
          <Link to={`/videos/${section}/${prevEpisode.videoId}`}>
            <button className="prev-button">Previous Episode</button>
          </Link>
        )}
        {!nextEpisode ? (
          <button className="invisible-button"></button>
        ) : (
          <Link to={`/videos/${section}/${nextEpisode.videoId}`}>
            <button className="next-button">Next Episode</button>
          </Link>
        )}
      </div>
      <EpisodeList episodes={ list } status={ status } />
      <Footer />
    </div>
  );
};

export default VideoPlayer;
