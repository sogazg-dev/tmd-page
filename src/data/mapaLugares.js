// ============================================================================
//  MAPA INTERACTIVO de Lugares (/wiki/lugares)
// ============================================================================
//  Cada punto se liga a un lugar de src/data/lugares.js por su `lugar` (el
//  nombre exacto); de ahí salen la imagen y la descripción.
//  x, y = posición en el mapa en porcentaje (0 a 100, desde arriba a la izq.)
//  color = color de la gema del punto.
//
//  Las zonas secretas (`secretos`) ya vienen borrosas DENTRO de la imagen del
//  mapa (scripts/wiki-mapa/zonas_secretas.py), así no se pueden descubrir
//  aunque alguien descargue la imagen. Para revelar un lugar: genera la imagen
//  sin esa zona, quita la zona de `secretos` y agrega su punto en `puntos`.
// ============================================================================
import reino960 from '../assets/images/wiki/mapa/mapa-reino-960.webp';
import reino1600 from '../assets/images/wiki/mapa/mapa-reino-1600.webp';
import reino2400 from '../assets/images/wiki/mapa/mapa-reino-2400.webp';
import real960 from '../assets/images/wiki/mapa/mapa-mundo-real-960.webp';
import real1600 from '../assets/images/wiki/mapa/mapa-mundo-real-1600.webp';
import real2400 from '../assets/images/wiki/mapa/mapa-mundo-real-2400.webp';

const mapas = {
  reino: {
    titulo: 'Reino Champiñon', // sin acento: la letra del mapa no tiene acentos
    // completa: solo se carga al abrir el mapa en pantalla completa (para el zoom)
    imagen: { chica: reino960, grande: reino1600, completa: reino2400 },
    puntos: [
      { lugar: 'Castillo de Peach', x: 12.8, y: 36.2, color: '#f2a6d8' },
      { lugar: 'Banco del Reino Champiñón', x: 21.4, y: 52.6, color: '#e3c36b' },
      { lugar: 'Casa del Sabio Washatumorra', x: 9.9, y: 92.1, color: '#3f8fa8' },
      { lugar: 'Túnel del Miedo', x: 38.9, y: 44.1, color: '#2a211c' },
      { lugar: 'Castillo de Bowser', x: 61.7, y: 12.3, color: '#e0352b' },
      { lugar: 'Basilisco del Terror', x: 62.7, y: 36.8, color: '#4dbb47' },
      { lugar: 'Torre Sagrada', x: 66.5, y: 51.4, color: '#f2bf1a' },
      { lugar: 'Templo Sagrado', x: 66.5, y: 77.1, color: '#8a2a8a' },
    ],
    secretos: [
      { x: 11, y: 12.3 },
      { x: 50, y: 82.4 },
      { x: 81, y: 81.2 },
    ],
    // tubería: viaja al otro mapa
    portal: { a: 'real', x: 29, y: 38.3, texto: 'Tubería' },
    // Rutas que se dibujan al elegir un lugar (puntos en % del mapa: x, y).
    // El primer tramo es el camino principal; los demás se desprenden de él
    // (empiezan sobre un punto del principal para que la unión no se note).
    rutas: [
      {
        lugar: 'Túnel del Miedo',
        tramos: [
          // del túnel hacia la derecha y luego hacia el Castillo de Bowser
          [[40.4, 43.6], [44.5, 41.8], [48.5, 39], [51.4, 35.4], [53.2, 29.6], [54.8, 23.8], [57.2, 18.8], [59.8, 15.2], [61.3, 13.4]],
          // se separa hacia el Basilisco del Terror (va por debajo del río)
          [[44.5, 41.8], [48.5, 39], [52.4, 37.4], [56.4, 36.4], [59.6, 35.9], [62.2, 36]],
        ],
      },
    ],
  },
  real: {
    titulo: 'El mundo real',
    imagen: { chica: real960, grande: real1600, completa: real2400 },
    puntos: [
      { lugar: 'Club de Comedia Bickolt', x: 12.8, y: 56, color: '#e04a3a' },
      { lugar: 'Hotel Denson', x: 75.9, y: 82, color: '#e3c36b' },
    ],
    secretos: [],
    portal: { a: 'reino', x: 89.5, y: 87.2, texto: 'Tubería' },
  },
};

export default mapas;
