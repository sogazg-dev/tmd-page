// ============================================================================
//  PERSONAJES de la Wiki (/wiki/personajes)
// ============================================================================
//  Se edita más fácil con el administrador:  npm run wiki-admin
//  Cada personaje: nombre, imagen (la tarjeta, 590 × 1004 px, en
//  src/assets/images/wiki/), serie (DMB, LB, CW, Creepy, PD o JA) y
//  descripcion (se ve al voltear la tarjeta).
// ============================================================================
import Mario from '../assets/images/wiki/2.png';
import Colin from '../assets/images/wiki/1.png';
import LegoBob from '../assets/images/wiki/3.png';
import Santa from '../assets/images/wiki/4.png';
import Luigi from '../assets/images/wiki/5.png';
import Yoshi from '../assets/images/wiki/6.png';
import Toad from '../assets/images/wiki/7.png';
import LegoBobDMB from '../assets/images/wiki/8.png';
import Koopa from '../assets/images/wiki/9.png';
import Bowser from '../assets/images/wiki/10.png';
import Burro from '../assets/images/wiki/12.png';
import Dustin from '../assets/images/wiki/13.png';
import Pikachu from '../assets/images/wiki/14.png';
import MarioLB from '../assets/images/wiki/15.png';
import Link from '../assets/images/wiki/16.png';
import Ezlo from '../assets/images/wiki/17.png';
import Johnny from '../assets/images/wiki/18.png';
import Soul from '../assets/images/wiki/19.png';
import ShyGuy from '../assets/images/wiki/20.png';
import Sabio from '../assets/images/wiki/21.png';
import Tienda from '../assets/images/wiki/22.png';
import Petey from '../assets/images/wiki/23.png';
import Bellota from '../assets/images/wiki/25.png';
import Malio from '../assets/images/wiki/26.png';
import Clyde from '../assets/images/wiki/27.png';
import Justin from '../assets/images/wiki/29.png';
import Skelto from '../assets/images/wiki/28.png';
import BBYoshi from '../assets/images/wiki/30.png';
import MamaY from '../assets/images/wiki/31.png';
import LegoBuck from '../assets/images/wiki/32.png';
import Weirdo from '../assets/images/wiki/34.png';
import Anio from '../assets/images/wiki/35.png';
import LBCreepy from '../assets/images/wiki/36.png';
import CHIN from '../assets/images/wiki/37.png';
import Nugget from '../assets/images/wiki/38.png';
import Rodri from '../assets/images/wiki/39.png';
import Daniel from '../assets/images/wiki/42.png';
import MRAAA from '../assets/images/wiki/40.png';
import MamaYDMB from '../assets/images/wiki/41.png';

const personajes = [
  {
    nombre: 'Mario',
    imagen: Mario,
    serie: 'DMB',
    descripcion: 'Mario es un héroe que salva constantemente el mundo de las manos de Bowser. Tiende a ser aventurero, valiente, torpe e inteligente en ocasiones. Tiene una adicción extraña a la pasta italiana y a su bigote. Siempre está acompañado con su hermano Luigi y van en búsqueda de aventuras.',
  },
  {
    nombre: 'Colin',
    imagen: Colin,
    serie: 'PD',
    descripcion: 'El sirviente, ejem, digo, ayudante del primer y séptimo Preguntas Dimensionales. Se creyó muerto por comentarios negativos hacia TheMarioDimension, pero está de regreso.',
  },
  {
    nombre: 'LegoBob',
    imagen: LegoBob,
    serie: 'LB',
    descripcion: 'Es el que empezó todo esto. LegoBob es el mismo de nuestra caricatura favorita. BOB ES PON JA. Pero en Lego. LegoBob empieza su aventura en el Hotel Denson, donde será destruido incontables veces y conocerá a muchos amigos y enemigos. Este personaje vive en el departamento #2 del minihotel Denson.',
  },
  {
    nombre: 'Santa',
    imagen: Santa,
    serie: 'CW',
    descripcion: 'Spoiler: No es Santa, es un ladrón. Es conocido por su famoso Escape 007.',
  },
  {
    nombre: 'Luigi',
    imagen: Luigi,
    serie: 'DMB',
    descripcion: 'Luigi es el hermano menor de Mario aunque de mayor estatura. Es un poco miedoso a diferencia de Mario, le asusta todo y tiene una extraña adicción a la pasta italiana. Odia su cuerpo "Aumentado" y es alérgico al ketchup.',
  },
  {
    nombre: 'Yoshi',
    imagen: Yoshi,
    serie: 'DMB',
    descripcion: 'Yoshi es el fiel amigo de Mario que lo acompaña a sus aventuras. Tiende a ser tierno y adorable, pero es igual de valiente que Mario. Tiene una fascinación por sus galletas favoritas y le gusta visualizar productos de tiendas.',
  },
  {
    nombre: 'Toad',
    imagen: Toad,
    serie: 'DMB',
    descripcion: 'Amigo de Mario y Luigi, es algo miedoso y un poco tonto pero es muy gracioso.',
  },
  {
    nombre: 'LegoBobDMB',
    imagen: LegoBobDMB,
    serie: 'DMB',
    descripcion: 'LegoBob siempre apoya a sus amigos. Con la ayuda del Sabio Washatumorra para entrar al Reino Champiñón, acompaña a Mario y los demás en la búsqueda de las esferas sagradas.',
  },
  {
    nombre: 'Koopa',
    imagen: Koopa,
    serie: 'DMB',
    descripcion: 'El rival principal de Mario en DMB, después de Bowser claro, se volverá un dolor de cabeza para nuestros héroes en la serie.',
  },
  {
    nombre: 'Bowser',
    imagen: Bowser,
    serie: 'DMB',
    descripcion: 'Bowser Mada Faca. El enemigo principal de Mario, con el poder de la varita sagrada por fin será una mayor amenaza para Mario y los demás.',
  },
  {
    nombre: 'Burro',
    imagen: Burro,
    serie: 'LB',
    descripcion: 'También conocido como “Asno”. Pero no le digas así porque se enoja. El mejor amigo de LegoBob y su primer compañero a lo largo de su aventura. Vive en el departamento #3 del Hotel Denson; se mudó ahí cuando el exdueño, el Sr. Kowalsky, se fue.',
  },
  {
    nombre: 'Dustin',
    imagen: Dustin,
    serie: 'LB',
    descripcion: 'Dustin es un personaje creado por TheMarioDimension con un acento raro pero gracioso. Dustin es un personaje dispuesto a ayudar. Este personaje tiene más dinero que todos los otros, así que él vive en el departamento #1, también conocido como la Suite Presidencial del Hotel Denson.',
  },
  {
    nombre: 'Pikachu',
    imagen: Pikachu,
    serie: 'LB',
    descripcion: 'Pikachu es un Pokémon eléctrico de la famosísima caricatura Pokémon. Este personaje es fiel y tiene una voz algo aguda que a la vez es tierna. Pikachu es pobre, así que vive con LegoBob en el departamento #2 del hotel.',
  },
  {
    nombre: 'MarioLB',
    imagen: MarioLB,
    serie: 'LB',
    descripcion: 'Un personaje muy valiente y fuerte, viene del Reino Champiñón. Mario viene de la mundialmente famosa serie de videojuegos "Super Mario" creada por Nintendo. Mario vive en el Reino Champiñón, pero gracias a una tubería puede visitar a LegoBob cuando le dé la regalada gana.',
  },
  {
    nombre: 'Link',
    imagen: Link,
    serie: 'PD',
    descripcion: 'El presentador oficial del Preguntas Dimensionales. A veces aparece de color verde (Rodrigo) o cambia su look al azul (Daniel).',
  },
  {
    nombre: 'Ezlo',
    imagen: Ezlo,
    serie: 'PD',
    descripcion: 'Tu Madre',
  },
  {
    nombre: 'Johnny',
    imagen: Johnny,
    serie: 'DMB',
    descripcion: 'Es el hijo del Sabio Washatumorra. Vive en la Suite Presidencial del Hotel Denson y le encanta contar historias usando Flipnote Studio.',
  },
  {
    nombre: 'Soul',
    imagen: Soul,
    serie: 'DMB',
    descripcion: 'Es un ente misterioso en forma de humo que se adhiere a personas u objetos. Se desconoce su propósito real.',
  },
  {
    nombre: 'ShyGuy',
    imagen: ShyGuy,
    serie: 'DMB',
    descripcion: 'El guardián de la Torre Sagrada. Es famoso por nunca callarse y hablar como NPC. Espera algún día reencontrarse con su hijo.',
  },
  {
    nombre: 'Sabio Washatumorra',
    imagen: Sabio,
    serie: 'DMB',
    descripcion: 'Lo sabe casi todo, ¿qué pregunta le vas a hacer?',
  },
  {
    nombre: 'El Señor de la Tienda',
    imagen: Tienda,
    serie: 'DMB',
    descripcion: 'Era el encargado de la Tienda del Club de Comedia Bickolt, y era cocinero del restaurante El Italiano. Sus encuentros con Mario y los demás han hecho su vida más difícil de lo que pudo imaginar.',
  },
  {
    nombre: 'Petey Piranha',
    imagen: Petey,
    serie: 'DMB',
    descripcion: 'El Monstruo del Túnel del Miedo/Basilisco del Terror. No tiene ojos pero tiene un increíble sentido del olfato y del oído con los que logra saber la ubicación exacta de su presa en todo el Túnel del Miedo y el Basilisco del Terror. Odia escuchar canciones de Luis Miguel.',
  },
  {
    nombre: 'Bellota',
    imagen: Bellota,
    serie: 'LB',
    descripcion: 'Viene de la conocida caricatura Las Chicas Superpoderosas. En LegoBob no está tan poderosa; trabaja con sus hermanas en una tienda de abarrotes en el minihotel Denson.',
  },
  {
    nombre: 'Malio',
    imagen: Malio,
    serie: 'LB',
    descripcion: 'El primo de Mario y de Luigi, no, no tiene síndrome de Down, simplemente es algo tonto.',
  },
  {
    nombre: 'Clyde',
    imagen: Clyde,
    serie: 'LB',
    descripcion: 'Era sirviente de Skelto pero se amotinó para defender a Bob (LegoBob).',
  },
  {
    nombre: 'Justin',
    imagen: Justin,
    serie: 'LB',
    descripcion: 'El hermano menor de Dustin, vive en otro lado y por eso solo ha salido una vez.',
  },
  {
    nombre: 'Skelto',
    imagen: Skelto,
    serie: 'LB',
    descripcion: 'También llamado como “El Rey del Lego”, es el antagonista principal de la serie “LegoBob”, con una apariencia de robot de tintes plateados y rojos, su objetivo es recuperar la pieza sagrada de lego que antes poseía, para así asesinar a LegoBob junto con sus amigos y dominar el mundo.',
  },
  {
    nombre: 'Bebé Yoshi',
    imagen: BBYoshi,
    serie: 'LB',
    descripcion: 'Un Yoshi bebé del que Mario dependió para que naciera, ama los perros y le encanta jugar.',
  },
  {
    nombre: 'Mamá Yoshi',
    imagen: MamaY,
    serie: 'LB',
    descripcion: 'Mamá de Bebé Yoshi y amiga de Mario. Se preocupa mucho por su hijo y le está eternamente agradecida a Mario por salvar a su bebé.',
  },
  {
    nombre: 'Lego Buck',
    imagen: LegoBuck,
    serie: 'LB',
    descripcion: 'Él es el tatara-tatara-tatarabuelo de LegoBob. Era un vaquero del Viejo Oeste y es algo incrédulo con las creencias.',
  },
  {
    nombre: 'Weirdo',
    imagen: Weirdo,
    serie: 'CW',
    descripcion: 'Sus mayores logros son que le hayan robado su casa y matar el año a balazos. Se piensa que murió a principios del 2013 porque nadie lo ha visto desde entonces.',
  },
  {
    nombre: '2012',
    imagen: Anio,
    serie: 'CW',
    descripcion: '¡Hola! Soy el 2012 AAAAAAAGH XO',
  },
  {
    nombre: 'LegoBob Te Parece Divertido',
    imagen: LBCreepy,
    serie: 'Creepy',
    descripcion: '¿Qué pasaría si LegoBob fuera el villano?',
  },
  {
    nombre: 'La Chingada',
    imagen: CHIN,
    serie: 'JA',
    descripcion: 'AAWGEJWE   /$W%(W""&R ¨*¨*[qqfgaFSF TESHDDR....',
  },
  {
    nombre: 'NuggetMaster',
    imagen: Nugget,
    serie: 'JA',
    descripcion: 'Odia su vida y a la Mamá de Carlos',
  },
  {
    nombre: 'Rodrigo',
    imagen: Rodri,
    serie: 'JA',
    descripcion: 'El Creador',
  },
  {
    nombre: 'Daniel',
    imagen: Daniel,
    serie: 'JA',
    descripcion: 'El Continuador',
  },
  {
    nombre: 'MR. AAAAAAAA',
    imagen: MRAAA,
    serie: 'DMB',
    descripcion: 'AAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAA',
  },
  {
    nombre: 'Mamá Yoshi DMB',
    imagen: MamaYDMB,
    serie: 'DMB',
    descripcion: 'Ella ayudó a Mario y a Luigi en la travesía al Túnel del Miedo, salió en la escena más icónica de la serie y se fue para siempre. No se sabe su paradero actual.',
  },
];

export default personajes;
