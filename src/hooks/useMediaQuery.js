import { useEffect, useState } from 'react';

// Devuelve true mientras la pantalla cumpla la media query (y se actualiza al
// girar el teléfono o cambiar el tamaño de la ventana).
export const MOBILE_QUERY = '(max-width: 1205px)';

const useMediaQuery = (query = MOBILE_QUERY) => {
  const get = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(get);

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange); // Safari antiguo
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
