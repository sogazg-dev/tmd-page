/* ============================================================================
   Recolector del canal del Museo (Discord en el navegador, sin bots)
   ============================================================================
   Solo LEE lo que ya se ve en pantalla mientras tú haces scroll: no envía nada
   a ningún lado ni usa tu cuenta para nada más.

   1. Abre discord.com/app en Chrome (no en la app de escritorio) y entra al
      canal del museo.
   2. Abre la consola: Cmd + Opción + J (Mac) o Ctrl + Shift + J (Windows).
      Si Chrome no deja pegar, escribe:  allow pasting  y Enter.
   3. Pega TODO este archivo y Enter.
   4. Haz scroll hasta el PRIMER mensaje del canal y luego baja despacio hasta
      el último. El contador de la consola va subiendo.
   5. Escribe  museoListo()  y Enter: se descarga "museo-discord.json".
   ========================================================================== */
(() => {
  const datos = new Map();
  let ultimoAutor = '';

  const leer = () => {
    document.querySelectorAll('li[id^="chat-messages-"]').forEach((li) => {
      const id = li.id.split('-').pop();
      const autorEl = li.querySelector('[id^="message-username-"]');
      if (autorEl) ultimoAutor = autorEl.textContent.trim();
      const prev = datos.get(id);
      const texto = (li.querySelector(`[id^="message-content-"]`) || {}).innerText || '';
      const fecha = (li.querySelector('time') || {}).dateTime || '';
      const imgs = new Set(prev ? prev.imagenes : []);
      // adjuntos (link al archivo original) e imágenes mostradas
      li.querySelectorAll('a[href*="cdn.discordapp.com/attachments"], a[href*="media.discordapp.net/attachments"]').forEach((a) => imgs.add(a.href));
      li.querySelectorAll('img[src*="media.discordapp.net/attachments"], img[src*="cdn.discordapp.com/attachments"], img[src*="images-ext"]').forEach((img) => imgs.add(img.src));
      const titulo = (li.querySelector('[class*="embedTitle"]') || {}).innerText || '';
      const desc = (li.querySelector('[class*="embedDescription"]') || {}).innerText || '';
      datos.set(id, {
        id,
        fecha: fecha || (prev && prev.fecha) || '',
        autor: (autorEl && autorEl.textContent.trim()) || (prev && prev.autor) || ultimoAutor,
        texto: texto || (prev && prev.texto) || '',
        embed: titulo || desc ? { titulo, descripcion: desc } : (prev && prev.embed) || null,
        imagenes: [...imgs],
      });
    });
    const n = [...datos.values()].reduce((s, m) => s + m.imagenes.length, 0);
    console.log(`Museo: ${datos.size} mensajes, ${n} imágenes recolectadas`);
  };

  let t = 0;
  const obs = new MutationObserver(() => {
    clearTimeout(t);
    t = setTimeout(leer, 300);
  });
  obs.observe(document.body, { childList: true, subtree: true });
  leer();

  window.museoListo = () => {
    leer();
    obs.disconnect();
    const mensajes = [...datos.values()].sort((a, b) => (BigInt(a.id) < BigInt(b.id) ? -1 : 1));
    const blob = new Blob([JSON.stringify({ canal: document.title, recolectado: new Date().toISOString(), mensajes }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'museo-discord.json';
    a.click();
    console.log(`Descargado museo-discord.json con ${mensajes.length} mensajes.`);
  };
  console.log('Recolector listo: haz scroll por todo el canal y luego escribe museoListo()');
})();
