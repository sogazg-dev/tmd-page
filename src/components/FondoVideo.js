import React, { useEffect, useRef } from 'react';

/**
 * Video de fondo decorativo (fuego, etc.).
 *
 * Safari en iPhone abre los <video> en su reproductor de pantalla completa si
 * no tienen `playsinline`, y además React no escribe el atributo `muted` en el
 * HTML (solo la propiedad), lo que a veces impide el autoplay. Aquí se fuerzan
 * ambos, se bloquea cualquier toque sobre el video y, si aun así Safari intenta
 * ponerlo en pantalla completa, se cierra de inmediato.
 */
const FondoVideo = ({ src, className, type = 'video/mp4' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return undefined;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('disablepictureinpicture', '');
    v.setAttribute('disableremoteplayback', '');
    v.controls = false;

    const tryPlay = () => {
      const p = v.play();
      if (p && p.catch) p.catch(() => { /* modo ahorro de energía: se queda quieto */ });
    };
    const noFullscreen = () => {
      try {
        if (v.webkitDisplayingFullscreen && v.webkitExitFullscreen) v.webkitExitFullscreen();
      } catch (e) { /* nada */ }
      if (document.fullscreenElement === v && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    };
    v.addEventListener('webkitbeginfullscreen', noFullscreen);
    v.addEventListener('fullscreenchange', noFullscreen);
    tryPlay();
    return () => {
      v.removeEventListener('webkitbeginfullscreen', noFullscreen);
      v.removeEventListener('fullscreenchange', noFullscreen);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      disablePictureInPicture
      controls={false}
      preload="auto"
      tabIndex={-1}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <source src={src} type={type} />
    </video>
  );
};

export default FondoVideo;
