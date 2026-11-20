// ============================================================================
//  OBJETOS de la Wiki
// ============================================================================
//  Para agregar un objeto, copia un bloque y cambia:
//   - nombre:      título de la tarjeta.
//   - imagen:      importa la imagen arriba. Guárdala en src/assets/images/wiki/objetos/.
//   - serie:       DMB, LB, CW, Creepy, PD o JA (para los filtros).
//   - descripcion: texto que aparece al abrir la tarjeta.
// ============================================================================
import PiezaLego from '../assets/images/wiki/objetos/pieza-de-lego-sagrada.png';
import BalonPedestal from '../assets/images/wiki/objetos/balon-y-pedestal-sagrado.png';
import Varita from '../assets/images/wiki/objetos/varita-sagrada.png';
import Esferas from '../assets/images/wiki/objetos/esferas-sagradas.png';
import Rubi from '../assets/images/wiki/objetos/rubi-sagrado.png';
import Espada from '../assets/images/wiki/objetos/espada-sagrada.png';
import Calcetin from '../assets/images/wiki/objetos/calcetin-sagrado.png';
import Shadowken from '../assets/images/wiki/objetos/shadowken.png';

const objetos = [
  {
    nombre: 'Pieza de Lego Sagrada',
    imagen: PiezaLego,
    serie: 'LB',
    descripcion: 'Una pieza de lego que le otorga cualquier deseo que venga del corazón. Originalmente forjada por los dioses y depositada en su templo. Un ser maligno llamado Skelto la robó y sometió a naciones enteras con ella, hasta que un día fue traicionado y eventualmente llegaría a manos de Bob Pantalones Cuadrados.',
  },
  {
    nombre: 'Balón y Pedestal Sagrado',
    imagen: BalonPedestal,
    serie: 'DMB',
    descripcion: 'Estos objetos al juntarse logran abrir una puerta. Sí, es todo.',
  },
  {
    nombre: 'La Varita Sagrada De Magia',
    imagen: Varita,
    serie: 'DMB',
    descripcion: 'La varita sagrada es otro objeto sagrado con mucho poder. Quien la porte tiene el poder de hacer ataques de energía, hacer flotar al objetivo, permitir a personas viajar entre dimensiones y hasta matar. Su dueño fue el Sabio Washatumorra hasta que le fue robada por Bowser Mada Faca.',
  },
  {
    nombre: 'Las 5 Esferas Sagradas',
    imagen: Esferas,
    serie: 'DMB',
    descripcion: 'Las esferas sagradas de los dioses cuyo poder puede igualar a la varita sagrada (ESDLDCPPSALVS) son un conjunto de esferas esparcidas por todo el Reino Champiñón. Una vez que un individuo las reúne en un solo lugar, estas le darán un gran poder a su portador, igualando a la anteriormente mencionada varita sagrada.',
  },
  {
    nombre: 'Rubí Sagrado',
    imagen: Rubi,
    serie: 'DMB',
    descripcion: 'Es un rubí mágico el cual teletransporta al portador a cualquier lugar que ya haya visitado con anterioridad, el usuario debe decirle al Rubí a qué lugar quiere trasladarse.',
  },
  {
    nombre: 'Espada Sagrada',
    imagen: Espada,
    serie: 'DMB',
    descripcion: 'Es una espada legendaria que le fue obsequiada a Mario por el Sabio Washatumorra. Por el momento se desconoce su origen o para qué sirve.',
  },
  {
    nombre: 'Calcetín Sagrado',
    imagen: Calcetin,
    serie: 'DMB',
    descripcion: 'Es una calceta.',
  },
  {
    nombre: 'Shadowken',
    imagen: Shadowken,
    serie: 'DMB',
    descripcion: 'Una gran bola de energía con potencial destructivo masivo, un portador de gran poder tiene que hacer un largo ritual con él para que llegue a su tamaño máximo, y cuando llegue a su tamaño máximo…',
  },
];

export default objetos;
