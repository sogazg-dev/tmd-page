// Función de Netlify: /.netlify/functions/avisos
//   GET     → { publicKey, ultima }  (la página pide la clave; el service
//             worker pide `ultima` para escribir la notificación)
//   POST    { subscription }  → guarda la suscripción del navegador
//   DELETE  { endpoint }      → la borra
// Las suscripciones se guardan en Netlify Blobs (Project → Blobs → avisos).
import { getStore } from '@netlify/blobs';
import avisos from '../lib/avisos.js';

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export default async (req) => {
  try {
    const store = getStore({ name: 'avisos', consistency: 'strong' });
    if (req.method === 'GET') {
      const ultima = await store.get('ultima', { type: 'json' });
      return json({ publicKey: process.env.VAPID_PUBLIC_KEY || '', ultima: ultima || null });
    }
    let cuerpo = null;
    try { cuerpo = await req.json(); } catch (e) { /* sin cuerpo */ }
    if (req.method === 'POST') {
      const s = cuerpo && cuerpo.subscription;
      if (!avisos.suscripcionValida(s)) return json({ error: 'Suscripción inválida' }, 400);
      await store.setJSON(`sub/${avisos.idDe(s.endpoint)}`, { endpoint: s.endpoint, keys: s.keys, desde: Date.now() });
      return json({ ok: true });
    }
    if (req.method === 'DELETE') {
      if (!cuerpo || typeof cuerpo.endpoint !== 'string') return json({ error: 'Falta endpoint' }, 400);
      await store.delete(`sub/${avisos.idDe(cuerpo.endpoint)}`);
      return json({ ok: true });
    }
    return json({ error: 'Método no permitido' }, 405);
  } catch (err) {
    console.error('[avisos]', err);
    return json({ error: 'Los avisos no están disponibles por ahora.' }, 500);
  }
};
