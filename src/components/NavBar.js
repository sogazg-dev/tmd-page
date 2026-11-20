// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo/watermark1.png';
import './NavBar.scss'; // Import the CSS file
import BottomNav from './BottomNav';

const Navbar = () => {
    return (
        
        <div className="navbarhole">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
           <div class="header">  
            
            <nav class="navbar">
                <ul class="navbar__menu">
                <li class="navbar__item">
                    <Link to="/"></Link><a href="/" class="navbar__link"><i data-feather="home"></i><span>Inicio</span> </a><Link />
                </li>
                <li class="navbar__item">
                    <Link to="/news"></Link><a href="/news" class="navbar__link"><i data-feather="news"></i><span>Noticias</span> </a><Link />
                </li>
                {/* Canales: oculta por ahora (los canales están en Contacto)
                <li class="navbar__item">
                    <Link to="/channels"></Link><a href="/channels" class="navbar__link"><i data-feather="news"></i><span>Canales</span> </a><Link />       
                </li>
                */}
                <li class="navbar__item">
                    <Link to="/videos"></Link><a href="/videos" class="navbar__link"><i data-feather="news"></i><span>Videos</span> </a><Link />       
                </li>
                <li class="navbar__item">
                    <Link to="/wiki"></Link><a href="/wiki" class="navbar__link"><i data-feather="news"></i><span>Wiki</span> </a><Link />        
                </li>
                <li class="navbar__item">
                    <Link to="/juegos"></Link><a href="/juegos" class="navbar__link"><i data-feather="news"></i><span>Juegos</span> </a><Link />        
                </li>
                <li class="navbar__item">
                    <Link to="/contacto"></Link><a href="/contacto" class="navbar__link"><i data-feather="news"></i><span>Contacto</span> </a><Link />        
                </li>
                </ul>
            </nav>
            <div class="header__logo">
                <a href="/"><img class="logo_image" src={logo} alt=''></img></a>
            </div>
            </div>
            {/* Menú inferior para celulares y tabletas (reemplaza al menú de hamburguesa) */}
            <BottomNav />
       </div>
        
    );
};

export default Navbar;
