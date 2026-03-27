'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface GalleryImage {
  id: number;
  titulo?: string;
  imagen_url: string;
  categoria?: string;
}

function proxyImageUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') return url;
    return `/api/media${parsed.pathname}`;
  } catch {
    if (url.startsWith('/media/')) return `/api/media${url.slice(6)}`;
  }
  return url;
}

export default function GaleriaSection() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [verTodas, setVerTodas] = useState(false);
  const [paused, setPaused] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(d => setImages(Array.isArray(d) ? d : []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const VISIBLE = 4;

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % Math.max(1, images.length));
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent(c => (c - 1 + images.length) % Math.max(1, images.length));
  }, [images.length]);

  // Autoplay
  useEffect(() => {
    if (paused || images.length <= VISIBLE) return;
    timerRef.current = setTimeout(next, 3800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, paused, next, images.length]);

  // Teclado en lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLightbox(i => i !== null ? (i + 1) % images.length : null);
      if (e.key === 'ArrowLeft') setLightbox(i => i !== null ? (i - 1 + images.length) % images.length : null);
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, images.length]);

  // Block body scroll when modals open
  useEffect(() => {
    if (lightbox !== null || verTodas) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightbox, verTodas]);

  // Touch handlers for carousel
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Touch handlers for lightbox
  const lbTouchStartX = useRef<number | null>(null);
  const onLbTouchStart = (e: React.TouchEvent) => { lbTouchStartX.current = e.touches[0].clientX; };
  const onLbTouchEnd = (e: React.TouchEvent) => {
    if (lbTouchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - lbTouchStartX.current;
    if (Math.abs(dx) > 50) {
      dx < 0
        ? setLightbox(i => i !== null ? (i + 1) % images.length : null)
        : setLightbox(i => i !== null ? (i - 1 + images.length) % images.length : null);
    }
    lbTouchStartX.current = null;
  };

  // Slides visibles (circular)
  const visibleImages = images.length === 0 ? [] : Array.from({ length: Math.min(VISIBLE, images.length) }, (_, i) =>
    images[(current + i) % images.length]
  );

  // Aspect ratios for varied grid feel
  const aspectRatios = ['3/4', '1/1', '1/1', '4/5'];

  return (
    <section id="galeria" style={{ background: '#FAF6EE', width: '100%', display: 'block' }}>
      <div className="w-full max-w-6xl mx-auto px-6 py-28">

        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col items-center text-center mb-16"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#B8860B', fontFamily: 'Jost, sans-serif' }}>
            Galería
          </p>
          <h2 className="text-5xl md:text-6xl font-light mb-6" style={{ color: '#1A1208', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
            Nuestra <em>inspiración</em>
          </h2>
          <div className="w-12 h-px mb-6" style={{ background: '#B8860B' }} />
          <p className="text-base max-w-xl" style={{ color: '#8A7560', fontFamily: 'Jost, sans-serif' }}>
            Cada imagen cuenta una historia de belleza natural.
          </p>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="grid grid-cols-12 gap-3" style={{ height: '520px' }}>
            <div className="col-span-12 md:col-span-7 skeleton-shimmer" />
            <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-3">
              <div className="skeleton-shimmer" />
              <div className="skeleton-shimmer" />
            </div>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-12 h-px" style={{ background: 'rgba(184,134,11,0.3)' }} />
            <p className="text-sm tracking-widest uppercase" style={{ color: '#8A7560', fontFamily: 'Jost, sans-serif' }}>
              Próximamente nuestra galería
            </p>
          </div>
        ) : (
          <>
            {/* Bento grid — touch/swipe on mobile */}
            <div
              ref={carouselRef}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              className="flex flex-col gap-3"
            >
              {/* Row 1: featured large + 2 stacked */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Featured — 7 cols */}
                {images[current] && (
                  <div
                    className="md:col-span-7 overflow-hidden cursor-pointer group relative"
                    style={{ height: '420px', background: '#EDE0C4' }}
                    onClick={() => setLightbox(current)}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                  >
                    <img
                      src={proxyImageUrl(images[current].imagen_url)}
                      alt={images[current].titulo || 'Natura'}
                      className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6"
                      style={{ background: 'linear-gradient(to top, rgba(26,18,8,0.75), transparent)' }}
                    >
                      <div className="flex items-center justify-between w-full">
                        {images[current].titulo && (
                          <p className="text-sm font-light" style={{ color: '#FAF6EE', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.1rem' }}>
                            {images[current].titulo}
                          </p>
                        )}
                        <span className="flex items-center gap-1.5 text-xs tracking-widest uppercase ml-auto" style={{ color: 'rgba(212,160,23,0.8)', fontFamily: 'Jost, sans-serif' }}>
                          Ver
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 9L9 1M9 1H3M9 1v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                      </div>
                    </div>
                    {/* Numero de imagen */}
                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 text-xs tracking-widest" style={{ background: 'rgba(26,18,8,0.6)', color: 'rgba(245,230,192,0.7)', fontFamily: 'Jost, sans-serif' }}>
                        {current + 1} / {images.length}
                      </span>
                    </div>
                  </div>
                )}

                {/* 2 stacked — 5 cols */}
                <div className="md:col-span-5 grid grid-rows-2 gap-3">
                  {[1, 2].map(offset => {
                    const img = images[(current + offset) % images.length];
                    if (!img) return <div key={offset} style={{ background: '#EDE0C4' }} />;
                    return (
                      <div
                        key={`${img.id}-${offset}`}
                        className="overflow-hidden cursor-pointer group relative"
                        style={{ height: '203px', background: '#EDE0C4' }}
                        onClick={() => setLightbox(images.indexOf(img))}
                      >
                        <img
                          src={proxyImageUrl(img.imagen_url)}
                          alt={img.titulo || 'Natura'}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                          style={{ background: 'linear-gradient(to top, rgba(26,18,8,0.65), transparent)' }}
                        >
                          {img.titulo && (
                            <p className="text-xs" style={{ color: '#F5E6C0', fontFamily: 'Jost, sans-serif' }}>{img.titulo}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: 3 equal-width images (if ≥4 images) */}
              {images.length >= 4 && (
                <div className="grid grid-cols-3 gap-3">
                  {[3, 4, 5].map(offset => {
                    const img = images[(current + offset) % images.length];
                    if (!img) return <div key={offset} style={{ background: '#EDE0C4', height: '180px' }} />;
                    return (
                      <div
                        key={`${img.id}-row2-${offset}`}
                        className="overflow-hidden cursor-pointer group relative"
                        style={{ height: '180px', background: '#EDE0C4' }}
                        onClick={() => setLightbox(images.indexOf(img))}
                      >
                        <img
                          src={proxyImageUrl(img.imagen_url)}
                          alt={img.titulo || 'Natura'}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: 'rgba(26,18,8,0.35)' }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Controles de navegación + dots + botón */}
              <div className="flex items-center justify-between pt-4">
                {/* Prev/Next */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    aria-label="Anterior"
                    className="w-10 h-10 flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                    style={{ border: '1px solid rgba(184,134,11,0.25)', color: '#B8860B' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button
                    onClick={next}
                    aria-label="Siguiente"
                    className="w-10 h-10 flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                    style={{ border: '1px solid rgba(184,134,11,0.25)', color: '#B8860B' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>

                {/* Dots */}
                <div className="flex gap-1.5 items-center">
                  {images.slice(0, Math.min(images.length, 10)).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      aria-label={`Imagen ${i + 1}`}
                      className="transition-all duration-300"
                      style={{
                        width: current === i ? '20px' : '5px',
                        height: '5px',
                        background: current === i ? '#B8860B' : 'rgba(184,134,11,0.2)',
                        borderRadius: '3px',
                      }}
                    />
                  ))}
                  {images.length > 10 && (
                    <span className="text-xs" style={{ color: 'rgba(184,134,11,0.4)', fontFamily: 'Jost, sans-serif' }}>+{images.length - 10}</span>
                  )}
                </div>

                {/* Ver todas */}
                <button
                  onClick={() => setVerTodas(true)}
                  className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase pb-0.5 transition-opacity hover:opacity-60"
                  style={{ color: '#B8860B', borderBottom: '1px solid rgba(184,134,11,0.4)', fontFamily: 'Jost, sans-serif' }}
                >
                  Ver todas
                  <span style={{ color: 'rgba(184,134,11,0.45)' }}>({images.length})</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Ver todas */}
      {verTodas && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ background: 'rgba(10,8,2,0.97)' }}
        >
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: 'rgba(184,134,11,0.6)', fontFamily: 'Jost, sans-serif' }}>Galería completa</p>
                <h3 className="text-3xl font-light" style={{ color: '#FAF6EE', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                  {images.length} imágenes
                </h3>
              </div>
              <button
                onClick={() => setVerTodas(false)}
                aria-label="Cerrar galería"
                className="w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-60"
                style={{ color: '#F5E6C0', border: '1px solid rgba(245,230,192,0.15)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="break-inside-avoid overflow-hidden cursor-pointer group relative"
                  onClick={() => { setLightbox(idx); setVerTodas(false); }}
                >
                  <img
                    src={proxyImageUrl(img.imagen_url)}
                    alt={img.titulo || 'Natura'}
                    className="w-full object-cover transition-all duration-500 group-hover:scale-[1.03] group-hover:brightness-90"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to top, rgba(26,18,8,0.65), transparent)' }}
                  >
                    {img.titulo && (
                      <p className="text-xs tracking-wide" style={{ color: '#F5E6C0', fontFamily: 'Jost, sans-serif' }}>{img.titulo}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: 'rgba(10,8,2,0.98)' }}
          onClick={() => setLightbox(null)}
          onTouchStart={onLbTouchStart}
          onTouchEnd={onLbTouchEnd}
        >
          {/* Cerrar */}
          <button
            className="absolute top-5 right-6 w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-60"
            style={{ color: '#F5E6C0', border: '1px solid rgba(245,230,192,0.15)' }}
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>

          {/* Prev */}
          <button
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all hover:opacity-70 active:scale-95"
            style={{ color: '#F5E6C0', border: '1px solid rgba(245,230,192,0.18)' }}
            onClick={e => { e.stopPropagation(); setLightbox(i => i !== null ? (i - 1 + images.length) % images.length : null); }}
            aria-label="Anterior"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          {/* Imagen */}
          <img
            src={proxyImageUrl(images[lightbox].imagen_url)}
            alt={images[lightbox].titulo || 'Natura'}
            className="max-w-full max-h-[85vh] object-contain"
            style={{ boxShadow: '0 0 80px rgba(184,134,11,0.08)' }}
            onClick={e => e.stopPropagation()}
          />

          {/* Next */}
          <button
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all hover:opacity-70 active:scale-95"
            style={{ color: '#F5E6C0', border: '1px solid rgba(245,230,192,0.18)' }}
            onClick={e => { e.stopPropagation(); setLightbox(i => i !== null ? (i + 1) % images.length : null); }}
            aria-label="Siguiente"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          {/* Contador + título */}
          <div className="absolute bottom-5 flex flex-col items-center gap-1.5">
            {images[lightbox].titulo && (
              <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(245,230,192,0.45)', fontFamily: 'Jost, sans-serif' }}>
                {images[lightbox].titulo}
              </p>
            )}
            <p className="text-xs" style={{ color: 'rgba(245,230,192,0.25)', fontFamily: 'Jost, sans-serif' }}>
              {lightbox + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
