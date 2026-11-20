import React from "react";
import { Link } from "react-router-dom";
import "./Welcome.scss";
import video from "../../assets/videos/Fire.mp4";
import FondoVideo from '../FondoVideo';

const Welcome = () => {
  return (
    <div className="home-page">
      {/* Video Background */}
      <FondoVideo src={video} className="video-background" />

      {/* Menu Grid */}
      <div className="menu-grid">
      <Link to="/videos" className="menu-item videos img-videos">Videos</Link>

<div className="left-column">
  {/* Los canales ahora están en Contacto (la página de Canales está oculta) */}
  <Link to="/contacto#canales" className="menu-item small img-canales">Canales</Link>
  <Link to="/news" className="menu-item small img-noticias">Noticias</Link>
</div>

<div className="right-column">
  <Link to="/wiki" className="menu-item wiki img-wiki">Wiki</Link>
</div>

<Link to="/juegos" className="menu-item bottom left img-construccion">Juegos</Link>
<Link to="/contacto" className="menu-item bottom right img-redes">Contacto</Link>

      </div>
    </div>
  );
};

export default Welcome;
