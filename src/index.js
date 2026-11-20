import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./ScrolltToTop.js";
import Home from "./pages/Home";
import News from "./pages/News";
import Channels from "./pages/Channels";
import Videos from "./pages/Videos";
import Wiki from "./pages/Wiki";
import WikiHub from "./pages/WikiHub";
import WikiCatalogPage from "./pages/WikiCatalogPage";
import Contacto from "./pages/Contacto";
import Juegos from "./pages/Juegos";
import VideoPlayer from "./pages/VideoPlayer";
import SeriesVideos from "./pages/SeriesVideos";
import { PlaylistsProvider } from "./context/PlaylistsContext";
import news from './data/news.js'


const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <PlaylistsProvider>
    <ScrollToTop />
    <Routes> {/* Use Routes instead of Switch */}
      
      <Route path="/" element={<Home />} />
      <Route path="/news" element={<News articles={news} />} />
      {/* Canales: página oculta por ahora (sus canales están en Contacto); se puede volver a enlazar */}
      <Route path="/channels" element={<Channels />} />
      <Route path="/videos" element={<Videos />} />
      {/* Wiki: menú de secciones; Personajes es la página de Wiki de siempre */}
      <Route path="/wiki" element={<WikiHub />} />
      <Route path="/wiki/personajes" element={<Wiki />} />
      <Route path="/wiki/lugares" element={<WikiCatalogPage tipo="lugares" />} />
      <Route path="/wiki/objetos" element={<WikiCatalogPage tipo="objetos" />} />
      <Route path="/wiki/series" element={<WikiCatalogPage tipo="series" />} />
      <Route path="/wiki/museo" element={<WikiCatalogPage tipo="museo" />} />
      {/* "???" ahora es Juegos (los links viejos a /store siguen funcionando) */}
      <Route path="/juegos" element={<Juegos />} />
      {/* FlipSlope sale en diciembre: por ahora el link regresa a Juegos */}
      <Route path="/juegos/flipslope" element={<Navigate to="/juegos" replace />} />
      <Route path="/store" element={<Navigate to="/juegos" replace />} />
      <Route path="/contacto" element={<Contacto />} />
      {/* Redes Sociales ahora es Contacto (los links viejos siguen funcionando) */}
      <Route path="/socialmedia" element={<Navigate to="/contacto" replace />} />
      {/* Las secciones y sus videos salen de src/config/playlists.js */}
      <Route path="/videos/:section/:episodeId" element={<VideoPlayer />} />
      {/* "Ver todo" de una serie; claves que no existen (o links viejos /videos/<número>) regresan a /videos */}
      <Route path="/videos/:section" element={<SeriesVideos />} />
      <Route path="/videos/-1" element={<Home />} />
    </Routes>
    </PlaylistsProvider>
  </BrowserRouter>,
  rootElement
);

// Registra el service worker para que la página se pueda instalar como app.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('No se pudo registrar el service worker', err));
  });
}
