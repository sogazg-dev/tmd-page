// ============================================================================
//  LUGARES de la Wiki
// ============================================================================
//  Para agregar un lugar, copia un bloque y cambia:
//   - nombre:      título de la tarjeta.
//   - imagen:      importa la imagen arriba. Guárdala en src/assets/images/wiki/lugares/.
//                  (Mientras no haya imagen se usa la imagen genérica.)
//   - serie:       DMB, LB, CW, Creepy, PD o JA (para los filtros).
//   - descripcion: texto que aparece al abrir la tarjeta.
//  Todos los lugares son de Duper Mario (DMB). Su punto en el mapa
//  interactivo se configura en src/data/mapaLugares.js (por nombre).
// ============================================================================
import ClubDeComediaBickolt from '../assets/images/wiki/lugares/club-de-comedia-bickolt.png';
import HotelDenson from '../assets/images/wiki/lugares/hotel-denson.jpg';
import CastilloDePeach from '../assets/images/wiki/lugares/castillo-de-peach.jpg';
import CastilloDeBowser from '../assets/images/wiki/lugares/castillo-de-bowser.jpg';
import TemploSagrado from '../assets/images/wiki/lugares/templo-sagrado.jpg';
import TorreSagrada from '../assets/images/wiki/lugares/torre-sagrada.jpg';
import BasiliscoDelTerror from '../assets/images/wiki/lugares/basilisco-del-terror.jpg';
import CasaDelSabioWashatumorra from '../assets/images/wiki/lugares/casa-del-sabio-washatumorra.jpg';
import BancoDelReinoChampinon from '../assets/images/wiki/lugares/banco-del-reino-champinon.jpg';
import TunelDelMiedo from '../assets/images/wiki/lugares/tunel-del-miedo.jpg';

const lugares = [
  {
    nombre: 'Hotel Denson',
    imagen: HotelDenson,
    serie: 'DMB',
    descripcion: 'Este hotel es el hogar de LegoBob, Burro, Dustin, Pikachu y Johnny. Aquí eventualmente sucedió la masacre de Soul.',
  },
  {
    nombre: 'Club de Comedia Bickolt',
    imagen: ClubDeComediaBickolt,
    serie: 'DMB',
    descripcion: 'Es un club de comedia en el mundo real donde se presentan los mejores cómicos de la zona como Groovy el Gran Improvisador. Burro trabaja ahí como presentador.',
  },
  {
    nombre: 'Castillo de Peach',
    imagen: CastilloDePeach,
    serie: 'DMB',
    descripcion: 'El famoso castillo de Peach. Aquí fue donde capturaron a la princesa la última vez. El dueño es el rey del Reino Champiñón y es donde tenía escondida una de las esferas sagradas. El castillo terminó siendo capturado por Bowser gracias a la varita sagrada y eventualmente por Soul y es en donde se encuentra haciendo el ritual del Shadowken.',
  },
  {
    nombre: 'Castillo de Bowser',
    imagen: CastilloDeBowser,
    serie: 'DMB',
    descripcion: 'El gran Castillo Koopa. Aquí es donde Mario ha vencido una infinidad de veces a Bowser, menos la última vez. El castillo fue completamente abandonado después de que Bowser reclamó el castillo de Peach y fue saqueado completamente por Soul.',
  },
  {
    nombre: 'Templo Sagrado',
    imagen: TemploSagrado,
    serie: 'DMB',
    descripcion: 'Un templo construido por los dioses. Se dice que es el centro de todo. Es el hogar del asesino ciego y el cetro sagrado. Es el lugar donde se pueden usar las 5 esferas sagradas, se desconoce el resultado.',
  },
  {
    nombre: 'Torre Sagrada',
    imagen: TorreSagrada,
    serie: 'DMB',
    descripcion: 'Se encuentra al norte del Templo Sagrado y es el hogar de una de las esferas sagradas. Los guardianes de la esfera eran una familia de Shy Guys. Al final uno de ellos se quedó en la torre para que su familia pudiera tener una vida normal fuera de la torre.',
  },
  {
    nombre: 'Túnel del Miedo',
    imagen: TunelDelMiedo,
    serie: 'DMB',
    descripcion: 'Este es un pasadizo secreto que lleva al Castillo de Bowser. En él habita una bestia hambrienta que se alimenta de los valientes que se atreven a cruzar. Tiene diferentes entradas y salidas, una de ellas lleva indirectamente a la Torre Sagrada.',
  },
  {
    nombre: 'Basilisco del Terror',
    imagen: BasiliscoDelTerror,
    serie: 'DMB',
    descripcion: 'Un bosque escondido dentro de un abismo. Solo se puede acceder por el Túnel del Miedo y es el hogar natural de la bestia del túnel. Este lugar conecta directamente con la Torre Sagrada.',
  },
  {
    nombre: 'Casa del Sabio Washatumorra',
    imagen: CasaDelSabioWashatumorra,
    serie: 'DMB',
    descripcion: 'Ubicada muy muy lejano del Castillo de Bowser. Es el hogar del Sabio del Reino Champiñón.',
  },
  {
    nombre: 'Banco del Reino Champiñón',
    imagen: BancoDelReinoChampinon,
    serie: 'DMB',
    descripcion: 'Además de resguardar los mayores tesoros del reino, este lugar conserva una de las armas más letales del universo, el Shadowken.',
  },
];

export default lugares;
