'use client';

import { useEffect, useRef, useState } from 'react';

interface EquipoItem {
  id: number;
  nombre: string;
  rol?: string;
  descripcion?: string;
  imagen_url?: string;
  orden: number;
  status: string;
}

function proxyImageUrl(url?: string | null): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      return `/api/media${parsed.pathname}`;
    }
    return url; // Cloudinary y otras URLs externas — directo
  } catch {
    if (url.startsWith('/media/') || url.startsWith('media/')) {
      return `/api/media/${url.replace(/^\/media\//, '').replace(/^media\//, '')}`;
    }
    return url;
  }
}

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FotoCard({ item, delay, tall }: { item: EquipoItem; delay: number; tall?: boolean }) {
  const { ref, visible } = useReveal(0.1);
  const imgUrl = proxyImageUrl(item.imagen_url);
  const minH = tall ? '420px' : '200px';

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden"
      style={{
        background: '#EDE0C4',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
        minHeight: minH,
        height: '100%',
      }}
    >
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={item.nombre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ minHeight: minH, display: 'block' }}
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3"
          style={{ minHeight: minH }}
        >
          <div style={{ fontSize: '2.5rem', opacity: 0.2 }}>📷</div>
          <p className="text-xs tracking-widest uppercase text-center px-4"
            style={{ color: 'rgba(138,117,96,0.4)', fontFamily: 'Jost, sans-serif' }}>
            {item.nombre}
          </p>
        </div>
      )}

      <div
        className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(to top, rgba(26,18,8,0.72) 0%, transparent 55%)' }}
      >
        <p className="text-base font-medium leading-tight" style={{ color: '#FAF6EE', fontFamily: 'Jost, sans-serif' }}>
          {item.nombre}
        </p>
        {item.rol && (
          <p className="text-xs tracking-[0.12em] uppercase mt-0.5" style={{ color: 'rgba(212,160,23,0.75)', fontFamily: 'Jost, sans-serif' }}>
            {item.rol}
          </p>
        )}
      </div>
    </div>
  );
}

export default function EquipoSection() {
  const header = useReveal(0.2);
  const [items, setItems] = useState<EquipoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/equipo')
      .then(r => r.json())
      .then((d: EquipoItem[]) => { setItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section id="equipo" style={{ background: '#FAF6EE', width: '100%', display: 'block' }}>
      <div className="w-full max-w-6xl mx-auto px-6 py-24">

        {/* Header */}
        <div
          ref={header.ref}
          className="flex flex-col items-center text-center mb-14"
          style={{
            opacity: header.visible ? 1 : 0,
            transform: header.visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#B8860B', fontFamily: 'Jost, sans-serif' }}>
            Personas reales
          </p>
          <h2 className="text-4xl md:text-5xl font-light mb-5" style={{ color: '#1A1208', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
            El equipo <em>detrás de cada ramo</em>
          </h2>
          <div className="w-12 h-px mb-5" style={{ background: '#B8860B' }} />
          <p className="text-base max-w-xl leading-relaxed" style={{ color: '#6B5A42', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
            Bego, Sara y Tere llevan años poniendo su corazón en cada flor.
            Una floristería familiar, cercana, para todos los momentos de tu vida.
          </p>
        </div>

        {/* Skeleton loading */}
        {loading && (
          <div className="hidden md:grid gap-3" style={{ gridTemplateColumns: '5fr 4fr 3fr', gridTemplateRows: '210px 210px' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse" style={{ background: '#EDE0C4', gridColumn: i === 0 ? '1' : undefined, gridRow: i === 0 ? '1 / span 2' : undefined }} />
            ))}
          </div>
        )}

        {/* Mobile layout */}
        {!loading && (
          <div className="flex flex-col gap-3 md:hidden">
            {items.map((item, i) => (
              <FotoCard key={item.id} item={item} delay={i * 80} />
            ))}
          </div>
        )}

        {/* Desktop bento grid */}
        {!loading && items.length > 0 && (
          <div
            className="hidden md:grid gap-3"
            style={{ gridTemplateColumns: '5fr 4fr 3fr', gridTemplateRows: '210px 210px' }}
          >
            {/* Foto 0 — grande izquierda, 2 rows */}
            {items[0] && (
              <div style={{ gridColumn: '1', gridRow: '1 / span 2' }}>
                <FotoCard item={items[0]} delay={0} tall />
              </div>
            )}
            {items[1] && (
              <div style={{ gridColumn: '2', gridRow: '1' }}>
                <FotoCard item={items[1]} delay={80} />
              </div>
            )}
            {items[2] && (
              <div style={{ gridColumn: '3', gridRow: '1' }}>
                <FotoCard item={items[2]} delay={160} />
              </div>
            )}
            {items[3] && (
              <div style={{ gridColumn: '2', gridRow: '2' }}>
                <FotoCard item={items[3]} delay={240} />
              </div>
            )}
            {items[4] && (
              <div style={{ gridColumn: '3', gridRow: '2' }}>
                <FotoCard item={items[4]} delay={320} />
              </div>
            )}
            {/* Si hay más de 5, mostrar fila extra */}
            {items.length > 5 && items.slice(5).map((item, i) => (
              <div key={item.id} style={{ gridColumn: `${(i % 3) + 1}` }}>
                <FotoCard item={item} delay={(5 + i) * 80} />
              </div>
            ))}
          </div>
        )}

        {/* CTA inferior */}
        <div className="flex flex-col items-center mt-12 gap-3">
          <p className="text-sm text-center" style={{ color: '#8A7560', fontFamily: 'Jost, sans-serif' }}>
            ¿Quieres conocernos mejor? Pásate por la tienda o escríbenos.
          </p>
          <a
            href="https://wa.me/34606598156?text=Hola%2C%20me%20gustar%C3%ADa%20conocer%20más%20sobre%20vuestro%20trabajo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase pb-0.5 transition-opacity hover:opacity-60"
            style={{ color: '#B8860B', borderBottom: '1px solid rgba(184,134,11,0.35)', fontFamily: 'Jost, sans-serif' }}
          >
            Escríbenos por WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
