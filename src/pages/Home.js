import React from 'react';
import Navbar from '../components/NavBar.js'; // Import your Navbar component
import Welcome from '../components/Home/Welcome.js';
import HomeFeed from '../components/Home/HomeFeed.js';
import useMediaQuery from '../hooks/useMediaQuery';
import Footer from '../components/Footer.js';
import InstalarApp from '../components/Home/InstalarApp';
import ActivarAvisos from '../components/Home/ActivarAvisos';
import './Scroll.css'

const App = () => {
    // Celular y tableta (≤1205px): portada nueva. Computadora: botones + portada en 2 columnas.
    const isMobile = useMediaQuery();
    return (
        <html>
            <head>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3081463517624663"
     crossOrigin="anonymous"></script>
            </head>
        <div className="app">
            <Navbar />
            {/* Aviso para agregar la página como app (se puede ocultar) */}
            <InstalarApp />
            {/* Activar notificaciones de videos y publicaciones nuevas */}
            <ActivarAvisos />
            {isMobile ? (
                <HomeFeed layout="mobile" />
            ) : (
                <>
                    <Welcome />
                    {/* Último episodio, próximo episodio y última publicación */}
                    <HomeFeed layout="desktop" />
                </>
            )}
            <Footer />
        </div>
        </html>
    );
};

export default App;
