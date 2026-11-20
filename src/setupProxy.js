// Solo para desarrollo (`npm start`): sirve las mismas rutas que las funciones
// de Netlify para que la página funcione en local.
const { fetchPosts } = require('../netlify/lib/youtubePosts');

module.exports = function (app) {
  app.get('/.netlify/functions/youtube-posts', async (req, res) => {
    try {
      res.json(await fetchPosts());
    } catch (err) {
      console.error('[youtube-posts]', err.message);
      res.status(502).json({ error: err.message });
    }
  });

  // Avisos (notificaciones): en local solo se entrega la clave; las
  // suscripciones no se guardan (eso lo hace Netlify al publicar).
  app.get('/.netlify/functions/avisos', (req, res) => {
    res.json({
      publicKey: process.env.VAPID_PUBLIC_KEY || '',
      ultima: { titulo: 'Aviso de prueba', texto: 'Así se verá un aviso de TMD.', url: '/' },
    });
  });
  app.post('/.netlify/functions/avisos', (req, res) => res.json({ ok: true, local: true }));
  app.delete('/.netlify/functions/avisos', (req, res) => res.json({ ok: true, local: true }));
};
