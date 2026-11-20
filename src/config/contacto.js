// ============================================================================
//  CONTACTO: redes sociales, canales de YouTube y correo
// ============================================================================
//  Edita aquí los links; la página /contacto se arma sola con esta lista.
// ============================================================================
import xIcon from '../assets/images/sm/x.webp';
import fbIcon from '../assets/images/sm/fb.png';
import ytIcon from '../assets/images/sm/yt.png';
import discordIcon from '../assets/images/sm/disc.webp';
import tzdLogo from '../assets/images/logo/tzdlogo.png';
import tmd2Logo from '../assets/images/logo/TMDHDND3.png';

const contacto = {
  correo: 'tmd.revival@gmail.com',

  redes: [
    { nombre: 'X (Twitter)', detalle: '@_TMD_2', url: 'https://x.com/_TMD_2', icono: xIcon, color: '#1DA1F2' },
    { nombre: 'Facebook', detalle: 'TheMarioDimension', url: 'https://www.facebook.com/profile.php?id=61551168365082', icono: fbIcon, color: '#4267B2' },
    { nombre: 'YouTube', detalle: '@TMD2.0', url: 'https://www.youtube.com/@TMD2.0', icono: ytIcon, color: '#fc0032' },
    { nombre: 'Discord', detalle: 'Únete al servidor', url: 'https://discord.com/invite/BHzGzExyq5', icono: discordIcon, color: '#4751CC' },
  ],

  canales: [
    { nombre: 'TheZeldaDimension', detalle: '@TheZeldaDimension', url: 'https://www.youtube.com/@TheZeldaDimension', logo: tzdLogo },
    { nombre: 'TMD2', detalle: '@TMD2.0', url: 'https://www.youtube.com/@TMD2.0', logo: tmd2Logo },
  ],
};

export default contacto;
