// ============================================================================
//  VERSIONES EN MEJOR CALIDAD (botón "HD" junto al video)
// ============================================================================
//  Los episodios de `seccion` que tengan una versión en la playlist de abajo
//  muestran un botón circular junto al video para verla en mejor calidad.
//
//  Cada episodio se relaciona solo, por el número de episodio (y la parte, si
//  tiene) que aparece en el título de los videos de las dos playlists.
//  - desde / hasta: solo los episodios en este rango tienen versión HD.
//  - ignorar:       episodios de la playlist HD que no se usan.
//  - manual:        si algún episodio no se relaciona bien, agrégalo aquí a
//                   mano: 'ID del video en la página': 'ID del video HD'.
//                   (El ID es lo que va después de watch?v= en YouTube.)
//                   Con un ID HD vacío ('') ese episodio no muestra botón.
// ============================================================================

const calidadAlta = {
  seccion: 'DMB',
  playlistUrl: 'https://youtube.com/playlist?list=PLQ4eU3s1zxJYFgGeBYrIT75x86J121fMO&si=Pl-6peHhku2nK_4Q',
  desde: 1,
  hasta: 12,
  ignorar: ['8.5', '13'],
  manual: {
    // 'abc123XYZ00': 'def456UVW11',
  },
};

export default calidadAlta;
