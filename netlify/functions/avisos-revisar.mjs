// Función programada de Netlify: cada 15 minutos revisa si hay un video nuevo
// en el canal (feed de YouTube, no gasta la cuota de la API) o una publicación
// nueva, y manda un aviso a todos los suscritos.
// La primera vez solo anota lo que ya existe (no avisa de lo viejo).
import { getStore } from '@netlify/blobs';
import avisos from '../lib/avisos.js';

export const config = { schedule: '*/15 * * * *' };

export default async () => {
  const store = getStore({ name: 'avisos', consistency: 'strong' });
  const estado = (await store.get('estado', { type: 'json' })) || { canales: {}, iniciados: [], videos: [], post: null };
  const novedades = [];

  // --- videos nuevos
  for (const handle of avisos.CANALES) {
    try {
      const id = estado.canales[handle] || (await avisos.idCanal(handle));
      estado.canales[handle] = id;
      const videos = await avisos.videosRecientes(id);
      const nuevos = videos.filter((v) => !estado.videos.includes(v.id));
      // la primera vez de cada canal solo se anotan sus videos
      if ((estado.iniciados || []).includes(handle)) {
        nuevos.slice(0, 3).forEach((v) => novedades.push({
          titulo: `Nuevo video: ${v.titulo}`,
          texto: `Ya está disponible en ${v.canal || 'el canal'}. ¡Míralo en la página de TMD!`,
          imagen: v.imagen,
          url: '/videos',
          tag: `video-${v.id}`,
        }));
      }
      estado.videos = [...nuevos.map((v) => v.id), ...estado.videos].slice(0, 300);
      estado.iniciados = [...new Set([...(estado.iniciados || []), handle])];
    } catch (err) {
      console.error('[avisos-revisar] videos', handle, err.message);
    }
  }

  // --- publicación nueva
  try {
    const p = await avisos.ultimaPublicacion();
    if (p && p.id !== estado.post) {
      if (estado.post) {
        novedades.push({
          titulo: `Nueva publicación de ${p.autor || 'TMD2'}`,
          texto: p.texto || 'Hay una nueva publicación en Noticias.',
          imagen: p.imagen,
          url: '/news',
          tag: `post-${p.id}`,
        });
      }
      estado.post = p.id;
    }
  } catch (err) {
    console.error('[avisos-revisar] publicaciones', err.message);
  }

  await store.setJSON('estado', estado);
  if (!novedades.length) return new Response('Sin novedades');

  // Un solo aviso por revisión (si hay varias cosas, se dice cuántas más)
  const aviso = { ...novedades[0], fecha: Date.now() };
  if (novedades.length > 1) aviso.texto = `${aviso.texto} (+${novedades.length - 1} más)`;
  await store.setJSON('ultima', aviso);

  const k = avisos.claves();
  const { blobs } = await store.list({ prefix: 'sub/' });
  let enviados = 0;
  await Promise.all(blobs.map(async ({ key }) => {
    const sub = await store.get(key, { type: 'json' });
    if (!sub) return;
    try {
      const status = await avisos.enviar(sub, k);
      if (status === 404 || status === 410) await store.delete(key); // ya no existe
      else if (status < 300) enviados += 1;
    } catch (err) {
      console.error('[avisos-revisar] envío', err.message);
    }
  }));
  return new Response(`Aviso enviado a ${enviados} de ${blobs.length}`);
};
