// src/components/Navbar.js
import React from 'react';
import Navbar from '../components/NavBar';
import Personajes from '../components/Wiki/Personajes';
import Footer from '../components/Footer';
import personajes from '../data/personajes';
import DMBLogo from '../assets/images/logo/LogoDMB.png'
import LBLogo from '../assets/images/logo/LogoLB.png'
import CreepyLogo from '../assets/images/logo/LogoCreepy.png'
import PDLogo from '../assets/images/logo/LogoPD.png'
import CWLogo from '../assets/images/logo/LogoCW.png'
import JALogo from '../assets/images/logo/LogoJA.png'


const Wiki = () => {
    return(
        <div>
        <head><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3081463517624663"
     crossOrigin="anonymous"></script></head>
            <Navbar />
            <Personajes
  images={[ 'slider1.png', 'slider2.png' ]}
  seriesLogos={[
    { id: 'DMB', logo: DMBLogo },
    { id: 'LB', logo: LBLogo },
    { id: 'CW', logo: CWLogo },
    { id: 'Creepy', logo: CreepyLogo },
    { id: 'PD', logo: PDLogo },
    { id: 'JA', logo: JALogo }
  ]}
  personajesData={personajes}
/>
            <Footer />
        </div>
    )
};

export default Wiki;
