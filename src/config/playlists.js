// ============================================================================
//  CONFIGURACIÓN DE LAS LISTAS DE VIDEOS
// ============================================================================
//  Cada objeto es una fila de la página /videos, en el mismo orden en que
//  aparece aquí.
//
//  Para llenar una lista solo pega el link de la playlist de YouTube en
//  `playlistUrl` (sirve el link completo o solo el ID que empieza con "PL").
//  Títulos, descripciones, miniaturas y el orden de los videos se leen
//  automáticamente de YouTube: si agregas, quitas o reordenas videos en la
//  playlist, la página lo refleja sola.
//
//  - key:         identificador corto que se usa en la URL (/videos/<key>/...).
//                 No lo cambies en las listas que ya existen o se romperán los
//                 links compartidos.
//  - title:       nombre de la fila que se muestra en la página.
//  - logo:        logo que aparece en la portada y en el reproductor.
//  - playlistUrl: link de la playlist. Déjalo vacío ('') si aún no existe.
//  - grupo:       pestaña donde aparece: 'tmd' (TMD/TMD2, si no se pone) o
//                 'comunidad' (Comunidad).
//  - subgrupo:    (opcional) filas seguidas con el mismo subgrupo se muestran
//                 juntas bajo un mismo título (ej. "Otras Continuaciones").
//  - vista:       (opcional) 'cuadricula' muestra todos los videos en
//                 cuadrícula en lugar de la fila con desplazamiento.
// ============================================================================

import TMDLogo from '../assets/images/logo/logotmd.jpg';
import LBLogo from '../assets/images/logo/LogoLB.png';
import DMBLogo from '../assets/images/logo/LogoDMB.png';
import CWLogo from '../assets/images/logo/LogoCW.png';
import PDLogo from '../assets/images/logo/LogoPD.png';
import CreepyLogo from '../assets/images/logo/LogoCreepy.png';
import JALogo from '../assets/images/logo/LogoJA.png';

const playlists = [
  {
    key: 'New',
    title: 'Destacado',
    logo: TMDLogo,
    playlistUrl: 'https://www.youtube.com/playlist?list=PLFUBj9-m7GDM',
  },
  {
    key: 'LB',
    title: 'LegoBob',
    logo: LBLogo,
    playlistUrl: 'https://www.youtube.com/playlist?list=PL1qD4QPr2P9me_pV03eIB1KbUDGtF9l0J',
  },
  {
    key: 'DMB',
    title: 'Dúper Mario Bros',
    logo: DMBLogo,
    playlistUrl: 'https://www.youtube.com/playlist?list=PL1qD4QPr2P9k-hahyd_i_v2dK-6q2l25q',
  },
  {
    key: 'CW',
    title: 'El Chow del Weirdo',
    logo: CWLogo,
    playlistUrl: 'https://www.youtube.com/playlist?list=PL1qD4QPr2P9miqDvtTbRoSUFS9BOvSGuI',
  },
  {
    key: 'PD',
    title: 'Preguntas Dimensionales',
    logo: PDLogo,
    playlistUrl: 'https://www.youtube.com/playlist?list=PL1qD4QPr2P9meb8KBZtKo-HPXMwIhFfVM',
  },
  {
    key: 'Creepy',
    title: 'Creepypastas',
    logo: CreepyLogo,
    playlistUrl: 'https://www.youtube.com/playlist?list=PL1qD4QPr2P9mjrNIQ0d57Z0-6_9KaEqxK',
  },
  {
    key: 'Jueguemos',
    title: 'TMD Jueguemos A...',
    logo: JALogo,
    playlistUrl: 'https://www.youtube.com/playlist?list=PL1qD4QPr2P9mn9CfqxNWOiH-uoQaqhStc',
  },
  {
    key: 'Jueguemos2',
    title: 'TMD2 Jueguemos A...',
    logo: JALogo,
    playlistUrl: 'https://www.youtube.com/playlist?list=PLbrpY3U3V4do',
  },
  {
    key: 'Extra',
    title: 'Extras',
    logo: TMDLogo,
    playlistUrl: 'https://www.youtube.com/playlist?list=PL1qD4QPr2P9nL1WovA0LYVW2p59z67uBD',
  },
  {
    key: 'Trailers',
    title: 'Trailers',
    logo: DMBLogo,
    playlistUrl: 'https://www.youtube.com/playlist?list=PL1qD4QPr2P9nSSHlK5Ti1GWJ1tOhv1yM4',
  },
  {
    key: 'Lost',
    title: 'Lost Media',
    logo: TMDLogo,
    playlistUrl: 'https://www.youtube.com/playlist?list=PL1qD4QPr2P9l5_P34DTEHt2aIFADyaUn7',
  },
  {
    key: 'Shorts',
    title: 'Shorts',
    logo: TMDLogo,
    playlistUrl: 'https://www.youtube.com/playlist?list=PL1qD4QPr2P9mTl2y9euHwBQru2NNoqBx6',
  },
  {
    key: 'Live',
    title: 'TMDLive',
    logo: TMDLogo,
    playlistUrl: 'https://www.youtube.com/playlist?list=PL1qD4QPr2P9n7TuwHinnRpO9ZHAqcLguS',
  },
  {
    key: 'Miembros',
    title: 'Miembros',
    logo: TMDLogo,
    playlistUrl: 'https://www.youtube.com/playlist?list=PL1qD4QPr2P9kQP35UzCSwXLlD9nq8p5d0',
  },

  // ---------------------------------------------------------- Comunidad
  {
    key: 'Icebergs',
    title: 'Icebergs',
    logo: TMDLogo,
    grupo: 'comunidad',
    playlistUrl: 'https://youtube.com/playlist?list=PLKfS6FJ-Yk4E&si=l7J8Az1KvvmALrDl',
  },
  {
    key: 'Comic',
    title: 'Comic',
    logo: TMDLogo,
    grupo: 'comunidad',
    subgrupo: 'Otras Continuaciones',
    playlistUrl: 'https://youtube.com/playlist?list=PLCXg5H6rmiiU&si=1Y4qlgqoQbK9g5na',
  },
  {
    key: 'Rojizo54',
    title: 'EL ROJIZO 54',
    logo: TMDLogo,
    grupo: 'comunidad',
    subgrupo: 'Otras Continuaciones',
    playlistUrl: 'https://youtube.com/playlist?list=PLatWCkUk_BBY&si=meBunHlxhxG1_It2',
  },
  {
    key: 'Soniclocures',
    title: 'Soniclocures',
    logo: TMDLogo,
    grupo: 'comunidad',
    subgrupo: 'Otras Continuaciones',
    playlistUrl: 'https://youtube.com/playlist?list=PLDcrH5i-2nzk&si=e2IUfNgu6IWviRlF',
  },
  {
    key: 'ComunidadProximamente',
    title: 'Próximamente',
    logo: TMDLogo,
    grupo: 'comunidad',
    playlistUrl: 'https://youtube.com/playlist?list=PLHt_b8TIjwnw&si=zgMC09T8npBXaKGX',
  },
  {
    key: 'ComunidadDestacado',
    title: 'Destacado de la Comunidad',
    logo: TMDLogo,
    grupo: 'comunidad',
    vista: 'cuadricula',
    playlistUrl: 'https://youtube.com/playlist?list=PLa6bdIGV9vZU&si=5nJLRemm8Y5gMZpF',
  },
];

export default playlists;
