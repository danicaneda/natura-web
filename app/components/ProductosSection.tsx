'use client';

import { useState, useEffect, useRef } from 'react';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  descripcion?: string;
  precio?: number;
  precio_oferta?: number;
  disponible: boolean;
  destacado: boolean;
  imagen_url?: string;
  etiquetas: string[];
}

const CATEGORIAS = [
  { key: 'todos', label: 'Todos' },
  { key: 'flores', label: 'Flores' },
  { key: 'plantas', label: 'Plantas' },
  { key: 'ramos', label: 'Ramos' },
  { key: 'macetas', label: 'Macetas' },
  { key: 'accesorios', label: 'Accesorios' },
];

function proxyImageUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    // URLs externas (Cloudinary, etc.) — pasar directas
    if (parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') return url;
    return `/api/media${parsed.pathname}`;
  } catch {
    if (url.startsWith('/media/')) return `/api/media${url.slice(6)}`;
  }
  return url;
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const WA_NUMBER = '34606598156';

function ProductModal({ p, onClose }: { p: Producto; onClose: () => void }) {
  const imgUrl = proxyImageUrl(p.imagen_url);
  const tieneOferta = p.precio_oferta && p.precio_oferta > 0 && p.precio_oferta < (p.precio ?? Infinity);
  const precio = tieneOferta ? p.precio_oferta : p.precio;
  const waText = encodeURIComponent(`Hola, me interesa el producto: ${p.nombre}${precio ? ` (${precio?.toFixed(2)}€)` : ''}. ¿Podéis informarme?`);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waText}`;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
      style={{ background: 'rgba(26,18,8,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative flex flex-col md:flex-row overflow-hidden w-full max-w-2xl"
        style={{ background: '#FFFFFF', maxHeight: '90vh', boxShadow: '0 24px 64px rgba(26,18,8,0.3)' }}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-60"
          style={{ background: 'rgba(26,18,8,0.06)', borderRadius: '50%' }}
          aria-label="Cerrar"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#1A1208" strokeWidth="2" strokeLinecap="round">
            <path d="M1 1l10 10M11 1L1 11"/>
          </svg>
        </button>

        {/* Imagen */}
        <div className="md:w-1/2 shrink-0" style={{ background: '#F5EDD8', minHeight: '240px' }}>
          {imgUrl
            ? <img src={imgUrl} alt={p.nombre} className="w-full h-full object-cover" style={{ minHeight: '240px' }} />
            : <div className="w-full h-full flex items-center justify-center" style={{ minHeight: '240px', fontSize: '4rem', opacity: 0.15 }}>✿</div>
          }
        </div>

        {/* Info */}
        <div className="flex flex-col p-7 gap-4 overflow-y-auto">
          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            {p.destacado && (
              <span className="px-2.5 py-0.5 text-xs tracking-widest uppercase" style={{ background: '#B8860B', color: '#FAF6EE', fontFamily: 'Jost, sans-serif' }}>Destacado</span>
            )}
            {tieneOferta && (
              <span className="px-2.5 py-0.5 text-xs tracking-widest uppercase" style={{ background: '#FAF6EE', color: '#8B2A2A', border: '1px solid rgba(139,42,42,0.2)', fontFamily: 'Jost, sans-serif' }}>Oferta</span>
            )}
            <span className="px-2.5 py-0.5 text-xs tracking-widest uppercase" style={{ color: 'rgba(184,134,11,0.6)', border: '1px solid rgba(184,134,11,0.2)', fontFamily: 'Jost, sans-serif' }}>{p.categoria}</span>
          </div>

          <h3 className="text-2xl font-light leading-tight" style={{ color: '#1A1208', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
            {p.nombre}
          </h3>

          {/* Precio */}
          <div className="flex items-baseline gap-3">
            {tieneOferta && p.precio && (
              <span className="text-sm line-through" style={{ color: '#B8A88A', fontFamily: 'Jost, sans-serif' }}>{p.precio.toFixed(2)}€</span>
            )}
            {precio && (
              <span className="text-2xl font-light" style={{ color: tieneOferta ? '#8B2A2A' : '#B8860B', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>{precio.toFixed(2)}€</span>
            )}
          </div>

          {p.descripcion && (
            <p className="text-sm leading-relaxed" style={{ color: '#6B5A42', fontFamily: 'Jost, sans-serif' }}>{p.descripcion}</p>
          )}

          <div className="h-px mt-2" style={{ background: 'rgba(184,134,11,0.12)' }} />

          {/* CTAs */}
          <div className="flex flex-col gap-3 mt-auto">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 py-3 text-xs tracking-[0.18em] uppercase font-medium transition-opacity hover:opacity-85"
              style={{ background: '#25D366', color: '#FFFFFF', fontFamily: 'Jost, sans-serif' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.118 1.529 5.845L.057 23.885l6.23-1.635A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.031-1.38l-.36-.214-3.742.981 1-3.642-.235-.374A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z"/>
              </svg>
              Preguntar por WhatsApp
            </a>
            <button
              onClick={() => { onClose(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="py-3 text-xs tracking-[0.18em] uppercase transition-opacity hover:opacity-70"
              style={{ border: '1px solid rgba(184,134,11,0.3)', color: '#B8860B', fontFamily: 'Jost, sans-serif' }}
            >
              Ir al formulario de contacto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductoCard({ p, delay = 0, onOpen }: { p: Producto; delay?: number; onOpen: (p: Producto) => void }) {
  const imgUrl = proxyImageUrl(p.imagen_url);
  const tieneOferta = p.precio_oferta && p.precio_oferta > 0 && p.precio_oferta < (p.precio ?? Infinity);
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className="group cursor-pointer"
      style={{
        background: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(26,18,8,0.06)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s ease`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        /* Altura fija absoluta — nunca varía */
        height: '340px',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(184,134,11,0.14)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(26,18,8,0.06)'; }}
      onClick={() => onOpen(p)}
    >
      {/* ZONA 1: Imagen — top 0, height 200px */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '200px', background: '#F5EDD8', overflow: 'hidden' }}>
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={p.nombre}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: 'rgba(184,134,11,0.18)', fontSize: '3rem' }}>
            ✿
          </div>
        )}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'rgba(26,18,8,0.12)' }} />
        {/* Badges — solo oferta, sin destacado (ya está en featured) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {tieneOferta && (
            <span className="px-2.5 py-0.5 text-xs tracking-widest uppercase" style={{ background: '#FAF6EE', color: '#8B2A2A', fontFamily: 'Jost, sans-serif' }}>
              Oferta
            </span>
          )}
        </div>
      </div>

      {/* ZONA 2: Nombre + precio — top 210px, height 54px, siempre visible */}
      <div style={{ position: 'absolute', top: '208px', left: 0, right: 0, height: '54px', padding: '0 20px', overflow: 'hidden', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <h3
          className="font-normal leading-tight"
          style={{ color: '#1A1208', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.1rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '60%' }}
        >
          {p.nombre}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: '1px' }}>
          {tieneOferta && p.precio && (
            <span className="text-xs line-through" style={{ color: '#B8A88A', fontFamily: 'Jost, sans-serif' }}>
              {p.precio.toFixed(2)}€
            </span>
          )}
          {(p.precio || tieneOferta) && (
            <span className="text-sm font-medium" style={{ color: tieneOferta ? '#8B2A2A' : '#B8860B', fontFamily: 'Jost, sans-serif' }}>
              {tieneOferta ? `${p.precio_oferta?.toFixed(2)}€` : `${p.precio?.toFixed(2)}€`}
            </span>
          )}
        </div>
      </div>

      {/* ZONA 3: Descripción — top 262px, height 32px, truncada */}
      <div style={{ position: 'absolute', top: '262px', left: 0, right: 0, height: '28px', padding: '0 20px', overflow: 'hidden' }}>
        {p.descripcion && (
          <p style={{ color: '#8A7560', fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', margin: 0 }}>
            {p.descripcion}
          </p>
        )}
      </div>

      {/* ZONA 4: Footer — bottom 0, height 44px, siempre en la misma posición */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '44px', padding: '0 20px', borderTop: '1px solid rgba(184,134,11,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF' }}>
        <span className="text-xs tracking-[0.12em] uppercase" style={{ color: 'rgba(184,134,11,0.55)', fontFamily: 'Jost, sans-serif' }}>
          {p.categoria}
        </span>
        <span
          className="text-xs tracking-[0.1em] uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: '#B8860B', fontFamily: 'Jost, sans-serif' }}
        >
          Consultar
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  );
}

export default function ProductosSection() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [modalProducto, setModalProducto] = useState<Producto | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    fetch('/api/productos')
      .then(r => r.json())
      .then(data => setProductos(Array.isArray(data) ? data : []))
      .catch(() => setProductos([]))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = categoriaActiva === 'todos'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva);

  return (
    <section id="productos" style={{ background: '#FAF6EE', width: '100%', display: 'block' }}>
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
            Colección
          </p>
          <h2 className="text-5xl md:text-6xl font-light mb-6" style={{ color: '#1A1208', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
            Flores <em>&</em> Plantas
          </h2>
          <div className="w-12 h-px mb-6" style={{ background: '#B8860B' }} />
          <p className="text-base max-w-xl" style={{ color: '#8A7560', fontFamily: 'Jost, sans-serif' }}>
            Seleccionadas con mimo para que cada espacio y cada momento sean únicos.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIAS.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategoriaActiva(cat.key)}
              className="px-5 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-200 active:scale-95"
              style={{
                background: categoriaActiva === cat.key ? '#B8860B' : 'transparent',
                color: categoriaActiva === cat.key ? '#FAF6EE' : '#8A7560',
                border: `1px solid ${categoriaActiva === cat.key ? '#B8860B' : 'rgba(184,134,11,0.25)'}`,
                fontFamily: 'Jost, sans-serif',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col overflow-hidden" style={{ background: '#FFFFFF', height: '340px' }}>
                <div className="skeleton-shimmer" style={{ height: '200px', flexShrink: 0 }} />
                <div className="p-5 flex flex-col gap-3">
                  <div className="skeleton-shimmer" style={{ height: '16px', width: '65%', borderRadius: '3px' }} />
                  <div className="skeleton-shimmer" style={{ height: '12px', width: '40%', borderRadius: '3px' }} />
                  <div className="skeleton-shimmer" style={{ height: '10px', width: '80%', borderRadius: '3px', marginTop: '8px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-12 h-px" style={{ background: 'rgba(184,134,11,0.3)' }} />
            <p className="text-sm tracking-widest uppercase" style={{ color: '#8A7560', fontFamily: 'Jost, sans-serif' }}>
              {productos.length === 0 ? 'Próximamente nuestra colección' : 'No hay productos en esta categoría'}
            </p>
            {productos.length > 0 && (
              <button
                onClick={() => setCategoriaActiva('todos')}
                className="text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-60 pb-0.5"
                style={{ color: '#B8860B', borderBottom: '1px solid #B8860B', fontFamily: 'Jost, sans-serif' }}
              >
                Ver todos
              </button>
            )}
          </div>
        ) : (() => {
          const featured = filtrados.find(p => p.destacado) ?? filtrados[0];
          const rest = filtrados.filter(p => p.id !== featured.id);
          const featuredImg = proxyImageUrl(featured.imagen_url);
          const featuredOferta = featured.precio_oferta && featured.precio_oferta > 0 && featured.precio_oferta < (featured.precio ?? Infinity);

          return (
            <div className="flex flex-col gap-4">
              {/* Layout editorial cuando hay ≥2 productos */}
              {filtrados.length >= 2 ? (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  {/* Featured card grande — 2/5 */}
                  <div
                    className="lg:col-span-2 group relative overflow-hidden cursor-pointer flex flex-col justify-end"
                    style={{
                      minHeight: '480px',
                      background: '#1A1208',
                      boxShadow: '0 4px 24px rgba(26,18,8,0.12)',
                    }}
                    onClick={() => setModalProducto(featured)}
                  >
                    {featuredImg && (
                      <img
                        src={featuredImg}
                        alt={featured.nombre}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                        style={{ filter: 'brightness(0.55)' }}
                        loading="lazy"
                      />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(26,18,8,0.92) 0%, rgba(26,18,8,0.2) 55%, transparent 100%)' }}
                    />
                    {/* Badge */}
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                      <span className="px-3 py-1 text-xs tracking-widest uppercase" style={{ background: '#B8860B', color: '#FAF6EE', fontFamily: 'Jost, sans-serif' }}>
                        Destacado
                      </span>
                      {featuredOferta && (
                        <span className="px-3 py-1 text-xs tracking-widest uppercase" style={{ background: '#FAF6EE', color: '#8B2A2A', fontFamily: 'Jost, sans-serif' }}>
                          Oferta
                        </span>
                      )}
                    </div>
                    {/* Contenido inferior */}
                    <div className="relative z-10 p-7 flex flex-col gap-3">
                      <span className="text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(212,160,23,0.6)', fontFamily: 'Jost, sans-serif' }}>{featured.categoria}</span>
                      <h3 className="text-3xl font-light leading-tight" style={{ color: '#FAF6EE', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                        {featured.nombre}
                      </h3>
                      {featured.descripcion && (
                        <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: 'rgba(250,246,238,0.55)', fontFamily: 'Jost, sans-serif' }}>
                          {featured.descripcion}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(250,246,238,0.1)' }}>
                        <div className="flex flex-col gap-0.5">
                          {featuredOferta && featured.precio && (
                            <span className="text-xs line-through" style={{ color: 'rgba(250,246,238,0.3)', fontFamily: 'Jost, sans-serif' }}>
                              {featured.precio.toFixed(2)}€
                            </span>
                          )}
                          {(featured.precio || featuredOferta) && (
                            <span className="text-xl font-light" style={{ color: '#D4A017', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                              {featuredOferta ? `${featured.precio_oferta?.toFixed(2)}€` : `${featured.precio?.toFixed(2)}€`}
                            </span>
                          )}
                        </div>
                        <span
                          className="flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ color: '#D4A017', fontFamily: 'Jost, sans-serif' }}
                        >
                          Consultar
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grid del resto — 3/5 */}
                  <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 content-start">
                    {rest.slice(0, 6).map((p, i) => <ProductoCard key={p.id} p={p} delay={Math.min(i, 5) * 70} onOpen={setModalProducto} />)}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtrados.map((p, i) => <ProductoCard key={p.id} p={p} delay={i * 70} onOpen={setModalProducto} />)}
                </div>
              )}

              {/* Fila extra si hay más de 7 */}
              {rest.length > 6 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-0">
                  {rest.slice(6).map((p, i) => <ProductoCard key={p.id} p={p} delay={i * 60} onOpen={setModalProducto} />)}
                </div>
              )}
            </div>
          );
        })()}
      </div>
      {modalProducto && <ProductModal p={modalProducto} onClose={() => setModalProducto(null)} />}
    </section>
  );
}
