# TMD – Página web

Página en React (Create React App) que reúne el contenido de los canales de TMD.

## Videos automáticos desde YouTube

La sección **/videos** ya no usa diccionarios escritos a mano. Cada fila lee una
playlist de YouTube al abrir la página, así que:

- si agregas, quitas o reordenas videos en la playlist, la página lo refleja sola;
- el **título**, la **descripción** y la **miniatura** de cada video salen de YouTube;
- no hay base de datos: cada navegador consulta YouTube y guarda el resultado
  15 minutos para no gastar cuota.

### Agregar o cambiar una playlist

Todo está en [`src/config/playlists.js`](src/config/playlists.js). Cada fila tiene
un campo `playlistUrl`; pega ahí el link de la playlist:

```js
{
  key: 'CW',
  title: 'El Chow del Weirdo',
  logo: CWLogo,
  playlistUrl: 'https://www.youtube.com/playlist?list=PL....',
},
```

Las filas sin link muestran "Próximamente". Después de editar este archivo hay
que volver a publicar la página (solo esa vez; los cambios dentro de la playlist
ya no necesitan publicar nada).

Notas:
- El orden de las filas en la página es el orden del archivo.
- No cambies el `key` de una fila existente: forma parte de la URL de los videos.
- La playlist debe ser **pública** o **no listada**. Los videos privados o borrados
  se ocultan solos.
- La portada de /videos y la imagen de fondo usan la miniatura de YouTube del video.

### Pestañas: TMD/TMD2 y Comunidad

Debajo de la portada de /videos hay dos pestañas. Cada fila de
`src/config/playlists.js` va en la pestaña de su campo `grupo`:

- sin `grupo` (o `grupo: 'tmd'`): **TMD/TMD2**;
- `grupo: 'comunidad'`: **Comunidad** (Icebergs, Otras Continuaciones, Próximamente
  y Destacado de la Comunidad).

Otros campos opcionales:
- `subgrupo`: filas seguidas con el mismo subgrupo aparecen juntas bajo un mismo
  título (así están Comic, EL ROJIZO 54 y Soniclocures dentro de "Otras Continuaciones").
- `vista: 'cuadricula'`: muestra todos los videos en cuadrícula en vez de la fila
  con desplazamiento (así está "Destacado de la Comunidad").

La portada de arriba siempre muestra videos de TMD/TMD2, en cualquier pestaña. Para
abrir directo la pestaña de Comunidad usa `/videos#comunidad`.

### Versión en mejor calidad (botón "HD")

En la página de los episodios de Dúper Mario Bros que tienen versión en mejor
calidad (del 1 a una parte del 12, de la playlist TMD ARCHIVE) aparece un botón
circular "HD" junto al video; al tocarlo se reproduce esa versión y al tocarlo otra
vez se regresa a la original. Los demás videos no cambian.

Todo se configura en [`src/config/calidadAlta.js`](src/config/calidadAlta.js). Cada
episodio se relaciona solo por el número de episodio (y la parte) del título; se
ignoran el 8.5 y el 13. Si alguno no se relaciona bien, agrégalo en `manual`
(`'ID del video en la página': 'ID del video HD'`). Con `npm start`, la consola del
navegador muestra una tabla con qué episodio quedó con cuál video HD.

### URLs de los videos

Ahora cada video tiene la forma `/videos/<key>/<id de YouTube>`, por ejemplo
`/videos/DMB/TZijjc32tkw`, y así no cambia si reordenas la playlist. Los links
viejos (`/videos/DMB/0`, `/videos/DMB/1`, …) siguen funcionando usando la posición
en la playlist.

### Navegación en Videos

- **Accesos rápidos** (celular/tableta): barra fija arriba con Dúper Mario Bros, LegoBob,
  El Chow del Weirdo, Creepypastas, Preguntas Dimensionales, Jueguemos A y Extras
  (lleva a las filas de extras, debajo de "TMD2 Jueguemos A..."). Se edita en
  `QUICK_LINKS` dentro de `src/pages/Videos.js`.
- **Ver todo**: cada fila tiene un enlace a `/videos/<key>` con todos los videos en cuadrícula.
- **Continuar viendo**: los últimos 12 videos que abrió el usuario. Se guarda solo en su
  navegador (no hay base de datos) y se puede borrar desde la misma fila.

## Portada de Inicio

Inicio muestra el **último episodio**, el **próximo episodio** y la **última publicación**
de @TMD2.0:

- **Computadora:** debajo de los botones, en 2 columnas (episodios a la izquierda,
  publicación a la derecha).
- **Celular/tableta (≤1205px):** reemplaza los botones, en 1 columna.

Todo se configura en [`src/config/home.js`](src/config/home.js):

- `featured`: por defecto es el último video de la playlist de Dúper Mario Bros (al subir
  uno nuevo se actualiza solo); también puedes fijar uno con su ID de YouTube.
- `upcoming`: el recuadro "Próximo episodio" (`title: 'Episodio 14'`, `thumb: 'EP 14'`,
  `note: 'Próximamente'`). Cuando salga el episodio, cambia los números o pon
  `show: false` para ocultarlo.

## Noticias: publicaciones de YouTube

La sección **/news** muestra las últimas 5 publicaciones de la pestaña
"Publicaciones" de [@TMD2.0](https://www.youtube.com/@TMD2.0/posts), con el
diseño de la página (texto, imágenes, video adjunto, encuestas y likes).

- YouTube **no tiene API oficial** para publicaciones, así que una función de
  Netlify (`netlify/functions/youtube-posts.js`) lee la página pública del canal y
  regresa solo las últimas 5 en JSON. No necesita API key ni gasta cuota.
- El CDN de Netlify guarda la respuesta 30 minutos, así que una publicación nueva
  puede tardar hasta ~30 minutos en aparecer.
- En local funciona igual con `npm start` (lo sirve `src/setupProxy.js`).
- Para cambiar de canal o de cantidad, en Netlify agrega las variables
  `YOUTUBE_POSTS_HANDLE` (ej. `@TMD2.0`) o `YOUTUBE_POSTS_LIMIT` (ej. `5`).
- Si YouTube cambia su página y la lectura falla, la sección muestra un link a las
  publicaciones del canal en vez de quedarse vacía. El código a ajustar estaría en
  `netlify/lib/youtubePosts.js`.

## Wiki

`/wiki` es un menú con 5 secciones:

| Sección | Ruta | Contenido |
| --- | --- | --- |
| Series | `/wiki/series` | Tarjetas desde `src/data/series.js` |
| Personajes | `/wiki/personajes` | La página de personajes de siempre; los datos están en `src/data/personajes.js` |
| Lugares | `/wiki/lugares` | Mapa interactivo + tarjetas desde `src/data/lugares.js` |
| Objetos | `/wiki/objetos` | Tarjetas desde `src/data/objetos.js` |
| Museo | `/wiki/museo` | Curiosidades del canal #museo de Discord (`src/data/museo.js`) |

**Agregar un lugar u objeto:** copia el bloque de ejemplo en `src/data/lugares.js` o
`src/data/objetos.js` y cambia `nombre`, `imagen`, `serie` (DMB, LB, CW, Creepy, PD o JA)
y `descripcion`. Las imágenes van en `src/assets/images/wiki/lugares/` y
`src/assets/images/wiki/objetos/` (recomendado 800 x 500 px, horizontal). Los filtros por serie se configuran en `src/config/wikiSeries.js`.


### Administrador de la Wiki (local)

Para agregar, editar o eliminar tarjetas sin tocar código:

```bash
npm run wiki-admin
```

Se abre `http://localhost:4321` en el navegador (solo funciona en tu computadora).
Tiene una pestaña por sección (Series, Personajes, Lugares, Objetos y Museo) y lee las
tarjetas directamente de `src/data/*.js`.

- **Agregar:** botón "+ Agregar tarjeta": nombre, serie, imagen (arrastrar o elegir)
  y descripción. En Personajes la imagen es la tarjeta completa (590 × 1004 px).
- **Editar / eliminar:** click en una tarjeta. En el Museo también se edita la galería
  (pies de foto, orden, agregar o quitar imágenes) y los enlaces.
- Cada cambio pide confirmación y muestra qué se va a cambiar. Al confirmar se reescribe
  el archivo `.js` de esa sección; si `npm start` está corriendo, la página se actualiza sola.
- Las imágenes nuevas se copian sin modificarlas a la carpeta de la sección
  (`src/assets/images/wiki/…`, logos en `src/assets/images/logo/`, Museo en
  `public/wiki/museo/<entrada>/`). Al eliminar una tarjeta su imagen no se borra.
- Antes de cada cambio se guarda una copia del archivo en `.respaldos-wiki/`
  (no se sube a git).
- El código está en `scripts/wiki-admin/` (Node, sin dependencias extra).

### Series, Lugares, Objetos y Museo

Cada sección lee su lista de un archivo en `src/data/`:

| Página | Archivo | Imágenes |
| --- | --- | --- |
| /wiki/series | `series.js` (tarjetas con el logo de la serie, sin filtros) | logos de `src/assets/images/logo/` |
| /wiki/lugares | `lugares.js` | `src/assets/images/wiki/lugares/` |
| /wiki/objetos | `objetos.js` | `src/assets/images/wiki/objetos/` |
| /wiki/museo | `museo.js` (filtros de series + uno general con el logo de TMD: `serie: 'TMD'`) | `public/wiki/museo/<entrada>/` |

Cada entrada tiene `nombre`, `imagen`, `serie` (para los filtros) y `descripcion`.

**Mapa interactivo de Lugares** (`src/components/Wiki/MapaLugares.js`): arriba del
listado. Los puntos, colores y la tubería se configuran en `src/data/mapaLugares.js`
(cada punto se liga a un lugar de `lugares.js` por su nombre, así la foto y la
descripción salen de ahí). La tubería lleva al mapa del *Mundo real*.
El botón **Pantalla completa** abre `MapaCompleto.js`: zoom con la rueda del mouse,
doble click o pellizcando en celular, arrastrar para moverse, y botones + / − /
Ajustar. Ahí se carga la versión `-2400.webp` del mapa (solo al abrirla).

- Las zonas secretas ya vienen borrosas dentro de la imagen del mapa, para que no se
  descubran aunque alguien descargue la imagen. Se generan con
  `python3 scripts/wiki-mapa/zonas_secretas.py <mapa original.png> src/assets/images/wiki/mapa/mapa-reino`.
  **No guardes el mapa original dentro del proyecto** (se sube a GitHub).
  Para revelar un lugar: quita su zona del script, vuelve a generar la imagen y agrega
  su punto en `mapaLugares.js`.
- El mapa del Mundo real se dibuja con `python3 scripts/wiki-mapa/mundo_real.py src/assets/images/wiki/mapa`.

**Museo:** además de esos campos, cada entrada puede tener `galeria` (varias imágenes
con pie de foto; en la ventana se cambian con las flechas o las miniaturas), `medios`
(video, audio o archivo para descargar) y `enlaces`. El contenido viene del canal
#museo de Discord:

1. `scripts/museo/recolectar-discord.js` (en la consola del navegador) y
   `scripts/museo/descargar-imagenes.mjs` dejan el canal en `export/museo-discord/`
   (esa carpeta no se sube a git).
2. `scripts/museo/museo_spec.py` agrupa los mensajes en entradas (nombre, serie,
   descripción, qué imágenes y pies de foto). Ahí se editan los textos.
3. `python3 scripts/museo/generar_museo.py` (solo para volver a importar todo desde Discord;
   reemplaza los cambios hechos con el administrador) copia las imágenes reducidas y comprimidas
   para web (sin cambiar su contenido) a `public/wiki/museo/` y reescribe
   `src/data/museo.js`.

Las descripciones de personajes del canal no se agregan porque ya están en Personajes.

## Contacto y navegación

- **Contacto** (`/contacto`) reúne redes sociales, canales de YouTube y correo. Los
  links, nombres e íconos se editan en [`src/config/contacto.js`](src/config/contacto.js).
  Se puede enlazar directo a una sección: `/contacto#redes`, `/contacto#canales`,
  `/contacto#correo`. El link viejo `/socialmedia` lleva a Contacto.
- **Canales** (`/channels`) está oculta: no tiene enlaces, pero la página sigue existiendo.
  Para volver a mostrarla, descomenta su enlace en `src/components/NavBar.js`.
- **Celular/tableta (≤1205px):**
  - Menú inferior de 5 páginas: Wiki, Noticias, Inicio, Videos y Juegos.
  - Contacto es un botón flotante semitransparente arriba a la derecha.
  - No se muestra el footer.
  - El menú "Más" sigue en `src/components/BottomNav.js`, apagado con
    `SHOW_MORE_MENU = false` (ahí mismo está cómo volver a activarlo).
- **Computadora:** la barra superior muestra Contacto en lugar de Redes Sociales.

## Juegos

- **/juegos** muestra 3 tarjetas: **FlipSlope** (anunciado, con la etiqueta
  "Próximamente · Llega en Diciembre"), Juego 2 y Juego 3 ("Próximamente").
  La lista está al inicio de [`src/pages/Juegos.js`](src/pages/Juegos.js).
  El link viejo `/store` lleva a Juegos y `/juegos/flipslope` también regresa a Juegos
  mientras el juego no se publique.

## Instalar como app (celular)

La página se puede agregar a la pantalla de inicio y se abre como app, sin la barra
del navegador. Hasta 1205px de ancho usa el diseño de celular (menú inferior).

- **iPhone (Safari):** botón Compartir → *Agregar a pantalla de inicio*.
- **Android (Chrome):** menú ⋮ → *Instalar app* / *Agregar a pantalla principal*.

Archivos relacionados: `public/manifest.json` (nombre, colores, íconos),
`public/app-icon-*.png` y `public/apple-touch-icon.png` (íconos), `public/sw.js`
(service worker mínimo: no guarda la página en caché, solo muestra
`public/offline.html` si no hay internet).

> La instalación solo funciona con **https** (en Netlify ya lo es) o en `localhost`.

## Avisos (notificaciones) de videos y publicaciones

Quien active los avisos (barra "Recibe avisos de TMD" en Inicio) recibe una
notificación en su teléfono o computadora cuando sale un video nuevo en el canal
o una publicación nueva. En iPhone/iPad solo funciona con la página instalada
como app (iOS 16.4 o más nuevo).

- **Cómo funciona:** `netlify/functions/avisos-revisar.mjs` corre cada 15 minutos
  en Netlify, revisa el feed de videos del canal (no gasta la cuota de la API) y
  las publicaciones, y manda el aviso. Las suscripciones se guardan en Netlify
  Blobs (*Project → Blobs → avisos*). La lógica está en `netlify/lib/avisos.js`
  y el service worker (`public/sw.js`) muestra la notificación.
- **Variables en Netlify:** `VAPID_PUBLIC_KEY` y `VAPID_PRIVATE_KEY` (están en tu
  `.env.local`; no se suben a GitHub). Opcional: `AVISOS_CANALES` con los canales
  a revisar separados por coma (por defecto `@TMD2.0`).
- La primera revisión solo anota lo que ya existe; avisa a partir de la siguiente
  novedad. Con `npm start` el botón funciona, pero los avisos solo se mandan en la
  página publicada.

## API key de YouTube (necesaria)

1. Entra a <https://console.cloud.google.com/> y crea un proyecto (o usa uno existente).
2. **APIs y servicios → Biblioteca** → busca **YouTube Data API v3** → **Habilitar**.
3. **APIs y servicios → Credenciales → Crear credenciales → Clave de API**.
4. Edita la clave y restríngela (importante, porque la clave viaja en el navegador):
   - *Restricciones de aplicación*: **Sitios web**, agrega
     `http://localhost:3000/*` y el dominio de la página (ej. `https://tudominio.com/*`).
   - *Restricciones de API*: solo **YouTube Data API v3**.

La cuota gratuita es de 10,000 unidades diarias; cada playlist cuesta 1 unidad por
cada 50 videos, y cada visitante consulta como máximo una vez cada 15 minutos.

## Probar en local

Requisitos: Node.js 18 o más nuevo (recomendado 20 LTS).

```bash
bash scripts/setup-local.sh   # instala dependencias y crea .env.local con tu API key
npm start                     # abre http://localhost:3000
```

O a mano:

```bash
npm ci
cp .env.example .env.local    # y pega tu key en REACT_APP_YOUTUBE_API_KEY
npm start
```

`.env.local` no se sube a GitHub.

## Publicar

La API key se toma al compilar (`npm run build`), así que el servicio donde se
publica la página necesita la variable de entorno `REACT_APP_YOUTUBE_API_KEY`
(por ejemplo, en Netlify: *Site configuration → Environment variables*). Después
de agregarla, vuelve a publicar una vez.

## Variables de entorno

| Variable | Para qué |
| --- | --- |
| `REACT_APP_YOUTUBE_API_KEY` | Clave de la YouTube Data API v3 (obligatoria). |
| `REACT_APP_PLAYLIST_CACHE_MINUTES` | Minutos que el navegador guarda cada playlist (por defecto 15). |
