// ============================================================================
//  SERIES de la Wiki (/wiki/series)
// ============================================================================
//  Cada serie aparece como tarjeta con su logo. Para agregar una, copia un
//  bloque: nombre, imagen (logo), descripcion.
//  (Descripciones mayormente extraídas de https://dupermariobros.blogspot.com/)
// ============================================================================
import DMBLogo from '../assets/images/logo/LogoDMB.png';
import CWLogo from '../assets/images/logo/LogoCW.png';
import LBLogo from '../assets/images/logo/LogoLB.png';

const series = [
  {
    nombre: 'Dúper Mario Bros',
    imagen: DMBLogo,
    serie: 'DMB',
    descripcion: '¿Qué obtienes al mezclar Super Mario Bros con Humor, Parodias, Acción, Drama, Epicidad y la extraña imaginación de TMD? ¡Pues Dúper Mario Bros!\nEs una plush-serie que cuenta la historia de los hermanos Mario (Mario & Luigi) que luego del secuestro de la princesa Peach a manos de Bowser, tienen que ir a rescatarla en una épica odisea junto a sus amigos y nuevos adversarios que encontrarán en su aventura.',
  },
  {
    nombre: 'El Chow del Weirdo',
    imagen: CWLogo,
    serie: 'CW',
    descripcion: 'Descripción: Es una serie web animada hecha en 2012 por TMD, muy criticada en su tiempo y actualmente aclamada por sus fanáticos.\nHistoria: Weirdo es un borracho cualquiera en la Ciudad de México que pasa un montón de situaciones aleatorias y cotidianas. Todo en el mundo irrealista de Weirdo.',
  },
  {
    nombre: 'LegoBob',
    imagen: LBLogo,
    serie: 'LB',
    descripcion: 'Es una plush-serie que cuenta las desventuras (y aventuras) de LegoBob, una esponja de Lego amarilla que vive en el Hotel Denson, donde conocerá y convivirá con nuevos amigos y confrontará a nuevos enemigos en toda su travesía.',
  },
];

export default series;
