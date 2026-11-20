import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import WikiCatalog from '../components/Wiki/WikiCatalog';
import MapaLugares from '../components/Wiki/MapaLugares';
import wikiSeries from '../config/wikiSeries';
import lugares from '../data/lugares';
import objetos from '../data/objetos';
import series from '../data/series';
import museo from '../data/museo';
import TMDLogo from '../assets/images/logo/logotmd.jpg';
import './Scroll.css';

// Museo: los mismos filtros de series más uno general con el logo de TMD.
const museoSeries = [...wikiSeries, { id: 'TMD', logo: TMDLogo }];

// Series, Lugares, Objetos y Museo de la Wiki (/wiki/<tipo>).
const CATALOGOS = {
  series: {
    items: series,
    filtros: false,
    logos: true,
    textos: {
      titulo: '¡¡Todas las series de TheMarioDimension!!',
      subtitulo: 'Haz clic en la tarjeta de una serie para ver más información.',
      buscar: 'Buscar serie...',
      vacio: 'No hay series que coincidan con tu búsqueda.',
    },
  },
  museo: {
    items: museo,
    seriesLogos: museoSeries,
    textos: {
      titulo: '¡¡El museo de TheMarioDimension!!',
      subtitulo: 'Curiosidades y rarezas de las series. Haz clic en una tarjeta para ver más información.',
      buscar: 'Buscar en el museo...',
      vacio: 'No hay entradas que coincidan con tu búsqueda.',
    },
  },
  lugares: {
    items: lugares,
    // todos los lugares son de Duper Mario: sin filtros por serie
    filtros: false,
    // mapa interactivo arriba del listado
    antes: <MapaLugares lugares={lugares} />,
    textos: {
      titulo: '¡¡Todos los lugares de TheMarioDimension!!',
      subtitulo: 'Explora el mapa o haz clic en la tarjeta de un lugar para ver más información.',
      buscar: 'Buscar lugar...',
      vacio: 'No hay lugares que coincidan con tu búsqueda.',
    },
  },
  objetos: {
    items: objetos,
    textos: {
      titulo: '¡¡Todos los objetos de TheMarioDimension!!',
      subtitulo: 'Haz clic en la tarjeta de un objeto para ver más información.',
      buscar: 'Buscar objeto...',
      vacio: 'No hay objetos que coincidan con tu búsqueda.',
    },
  },
};

const WikiCatalogPage = ({ tipo }) => {
  const { items, textos, filtros = true, logos = false, seriesLogos = wikiSeries, antes = null } = CATALOGOS[tipo];
  return (
    <div>
      <Navbar />
      {/* key: reinicia búsqueda y filtros al cambiar de sección */}
      <WikiCatalog key={tipo} items={items} seriesLogos={seriesLogos} textos={textos} filtros={filtros} logos={logos} antes={antes} />
      <Footer />
    </div>
  );
};

export default WikiCatalogPage;
