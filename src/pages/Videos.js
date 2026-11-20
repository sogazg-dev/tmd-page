import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import VideoPreview from '../components/Videos/VideoPreview';
import Footer from '../components/Footer';
import EpisodeList from '../components/Videos/EpisodeList';
import EpisodeGrid from '../components/Videos/EpisodeGrid';
import { usePlaylists } from '../context/PlaylistsContext';
import { getHistory, clearHistory, onHistoryChange } from '../services/watchHistory';
import './Scroll.css'
import './Videos.scss'

// Pestañas debajo de la portada. Cada fila de src/config/playlists.js va en la
// pestaña de su `grupo` ('tmd' si no tiene).
const TABS = [
    { id: 'tmd', label: 'TMD/TMD2' },
    { id: 'comunidad', label: 'Comunidad' },
];
const grupoDe = (section) => section.grupo || 'tmd';
const tabFromHash = () => (typeof window !== 'undefined' && window.location.hash === '#comunidad' ? 'comunidad' : 'tmd');

// Accesos rápidos (barra fija en celular), por pestaña. `key` es la fila a la
// que salta; "Extras" lleva a la primera fila de extras y se queda marcado en
// todas las filas que siguen. Un subgrupo se marca con su nombre.
const QUICK_LINKS = {
    tmd: [
        { key: 'DMB', label: 'Dúper Mario Bros' },
        { key: 'LB', label: 'LegoBob' },
        { key: 'CW', label: 'El Chow del Weirdo' },
        { key: 'Creepy', label: 'Creepypastas' },
        { key: 'PD', label: 'Preguntas Dimensionales' },
        { key: 'Jueguemos', label: 'Jueguemos A...' },
        { key: 'Extra', label: 'Extras', andAfter: true },
    ],
    comunidad: [
        { key: 'Icebergs', label: 'Icebergs' },
        { key: 'grupo-Otras Continuaciones', label: 'Otras Continuaciones' },
        { key: 'ComunidadProximamente', label: 'Próximamente' },
        { key: 'ComunidadDestacado', label: 'Destacado' },
    ],
};

const rowId = (key) => `fila-${key.replace(/\s+/g, '-')}`;

// Las filas, su orden y sus playlists se configuran en src/config/playlists.js
const Videos = () => {
    const { sections, bySection, loading } = usePlaylists();
    const [tab, setTab] = useState(tabFromHash);
    const [history, setHistory] = useState(getHistory);
    const [activeQuick, setActiveQuick] = useState(null);
    const quickBarRef = useRef(null);

    useEffect(() => onHistoryChange(() => setHistory(getHistory())), []);

    // La pestaña queda en la URL (#comunidad) para volver a ella con "atrás".
    const changeTab = (id) => {
        setTab(id);
        setActiveQuick(null);
        try {
            const url = window.location.pathname + window.location.search + (id === 'comunidad' ? '#comunidad' : '');
            window.history.replaceState(window.history.state, '', url);
        } catch (e) { /* nada */ }
    };

    const tabSections = useMemo(() => sections.filter((s) => grupoDe(s) === tab), [sections, tab]);

    // La portada (VideoPreview) siempre muestra lo de TMD/TMD2, en cualquier pestaña.
    const previewVideos = useMemo(
        () => sections.filter((s) => grupoDe(s) === 'tmd').flatMap((s) => bySection[s.key].videos),
        [sections, bySection],
    );
    const previewLoading = loading && previewVideos.length === 0;

    // "Continuar viendo" de la pestaña actual; quita videos que ya no estén en su playlist.
    const continueWatching = useMemo(() => history.filter((h) => {
        const config = sections.find((s) => s.key === h.section);
        if (!config || grupoDe(config) !== tab) return false;
        const s = bySection[h.section];
        if (s.status !== 'ready') return true;
        return s.videos.some((v) => v.videoId === h.videoId);
    }), [history, bySection, sections, tab]);

    // Accesos rápidos de la pestaña (solo los que existen en la configuración).
    const quickLinks = useMemo(() => (QUICK_LINKS[tab] || []).filter((q) => (
        q.key.startsWith('grupo-')
            ? tabSections.some((s) => `grupo-${s.subgrupo}` === q.key)
            : tabSections.some((s) => s.key === q.key)
    )), [tab, tabSections]);

    // ¿Qué acceso rápido corresponde a una fila?
    const quickFor = (section, index) => {
        if (section.subgrupo && quickLinks.some((q) => q.key === `grupo-${section.subgrupo}`)) return `grupo-${section.subgrupo}`;
        if (quickLinks.some((q) => q.key === section.key)) return section.key;
        const after = quickLinks.find((q) => q.andAfter);
        if (after) {
            const i = tabSections.findIndex((s) => s.key === after.key);
            if (i !== -1 && index >= i) return after.key;
        }
        return null;
    };

    // Marca en la barra la serie que se está viendo al hacer scroll.
    useEffect(() => {
        let frame = 0;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                let current = null;
                tabSections.forEach((s, i) => {
                    const el = document.getElementById(rowId(s.key));
                    if (el && el.getBoundingClientRect().top < 140) {
                        const q = quickFor(s, i);
                        if (q) current = q;
                    }
                });
                setActiveQuick(current);
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabSections, quickLinks]);

    // Mantiene visible en la barra el acceso activo.
    useEffect(() => {
        if (!activeQuick || !quickBarRef.current) return;
        const bar = quickBarRef.current;
        const chip = bar.querySelector(`[data-key="${activeQuick}"]`);
        // Solo desplaza la barra (scrollIntoView movería también la página y
        // cancelaría el salto a la fila).
        if (chip) bar.scrollTo({ left: chip.offsetLeft - (bar.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' });
    }, [activeQuick]);

    const goTo = (key) => {
        const el = document.getElementById(rowId(key));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return(
        <div className="videos-page">
        <head><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3081463517624663"
     crossOrigin="anonymous"></script></head>
            <Navbar />

            {/* Accesos rápidos (solo celular y tableta) */}
            <nav className="videos-quick" aria-label="Ir a una serie" ref={quickBarRef}>
                {quickLinks.map((q) => (
                    <button
                        key={q.key}
                        type="button"
                        data-key={q.key}
                        className={`videos-quick__chip${activeQuick === q.key ? ' is-active' : ''}`}
                        onClick={() => goTo(q.key)}
                    >
                        {q.label}
                    </button>
                ))}
            </nav>

            <VideoPreview episodes={ previewVideos } loading={ previewLoading } />

            {/* Pestañas: TMD/TMD2 y Comunidad */}
            <div className="videos-tabs" role="tablist" aria-label="Secciones de videos">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        role="tab"
                        id={`tab-${t.id}`}
                        aria-selected={tab === t.id}
                        aria-controls="videos-panel"
                        className={`videos-tabs__tab${tab === t.id ? ' is-active' : ''}`}
                        onClick={() => changeTab(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div id="videos-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
                {continueWatching.length > 0 && (
                    <>
                        <div className="episode-list-header" id="fila-continuar">
                            <h2 className="episode-list-title">Continuar viendo</h2>
                            <button type="button" className="episode-list-action" onClick={clearHistory}>
                                Borrar
                            </button>
                        </div>
                        <EpisodeList episodes={ continueWatching } status="ready" />
                    </>
                )}

                {tabSections.map((section, i) => {
                    const { videos, status } = bySection[section.key];
                    const prev = tabSections[i - 1];
                    const startsGroup = section.subgrupo && (!prev || prev.subgrupo !== section.subgrupo);
                    const Title = section.subgrupo ? 'h3' : 'h2';
                    return (
                        <React.Fragment key={section.key}>
                            {startsGroup && (
                                <h2 className="videos-group-title" id={rowId(`grupo-${section.subgrupo}`)}>
                                    {section.subgrupo}
                                </h2>
                            )}
                            <div className="episode-list-header" id={rowId(section.key)}>
                                <Title className={`episode-list-title${section.subgrupo ? ' episode-list-title--sub' : ''}`}>
                                    {section.title}
                                </Title>
                                {videos.length > 0 && section.vista !== 'cuadricula' && (
                                    <Link className="episode-list-action" to={`/videos/${section.key}`}>
                                        Ver todo ›
                                    </Link>
                                )}
                            </div>
                            {section.vista === 'cuadricula'
                                ? <EpisodeGrid episodes={ videos } status={ status } />
                                : <EpisodeList episodes={ videos } status={ status } />}
                        </React.Fragment>
                    );
                })}
            </div>
            <Footer />
        </div>
    )
};

export default Videos;
