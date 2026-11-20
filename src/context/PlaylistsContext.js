import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import playlists from '../config/playlists';
import { loadSection } from '../services/youtube';

// Estado por sección: { status: 'loading' | 'ready' | 'error' | 'empty', videos: [], error }
const PlaylistsContext = createContext(null);

const initialState = () =>
  playlists.reduce((acc, section) => {
    acc[section.key] = { status: section.playlistUrl ? 'loading' : 'empty', videos: [], error: null };
    return acc;
  }, {});

export const PlaylistsProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    let cancelled = false;
    playlists.forEach((section) => {
      if (!section.playlistUrl) return;
      loadSection(section)
        .then((videos) => {
          if (cancelled) return;
          setState((prev) => ({
            ...prev,
            [section.key]: { status: videos.length ? 'ready' : 'empty', videos, error: null },
          }));
        })
        .catch((error) => {
          if (cancelled) return;
          console.error(error);
          setState((prev) => ({
            ...prev,
            [section.key]: { status: 'error', videos: [], error: error.message },
          }));
        });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => {
    const allVideos = playlists.flatMap((s) => state[s.key].videos);
    const loading = playlists.some((s) => state[s.key].status === 'loading');
    return { sections: playlists, bySection: state, allVideos, loading };
  }, [state]);

  return <PlaylistsContext.Provider value={value}>{children}</PlaylistsContext.Provider>;
};

export const usePlaylists = () => {
  const ctx = useContext(PlaylistsContext);
  if (!ctx) throw new Error('usePlaylists debe usarse dentro de <PlaylistsProvider>');
  return ctx;
};
