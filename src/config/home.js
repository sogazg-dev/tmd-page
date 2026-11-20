// ============================================================================
//  PORTADA DE INICIO
//  (en computadora va debajo de los botones; en celular reemplaza los botones)
// ============================================================================
//  featured → "Último episodio":
//   - section: la serie (usa el `key` de src/config/playlists.js).
//   - videoId: déjalo vacío ('') para mostrar automáticamente el ÚLTIMO video
//     de esa playlist (al subir un episodio nuevo, se actualiza solo).
//     Si quieres fijar un video en particular, pon su ID de YouTube,
//     por ejemplo 'q8H8WdX04tM' (lo que va después de watch?v= en el link).
//
//  upcoming → "Próximo episodio":
//   - show:  true para mostrarlo, false para ocultarlo.
//   - title: texto principal (ej. 'Episodio 14').
//   - thumb: texto grande de la miniatura (ej. 'EP 14').
//   - note:  texto secundario (ej. 'Próximamente' o una fecha).
//   Cuando salga el episodio, cambia los números al siguiente.
// ============================================================================

const homeConfig = {
  featured: {
    section: 'DMB',
    videoId: '',
  },
  upcoming: {
    show: true,
    section: 'DMB',
    title: 'Episodio 14',
    thumb: 'EP 14',
    note: 'Próximamente',
  },
};

export default homeConfig;
