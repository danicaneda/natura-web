'use client';

import { useEffect, useRef, useState } from 'react';

export default function CtaBanner() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        background: 'linear-gradient(135deg, #1A1208 0%, #2C1F0E 40%, #1A1208 100%)',
        width: '100%',
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Textura de puntos dorados */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(184,134,11,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }}
      />

      {/* Líneas decorativas */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(184,134,11,0.4), transparent)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(184,134,11,0.4), transparent)',
        }}
      />

      {/* Orbes de luz */}
      <div aria-hidden="true" style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,134,11,0.07) 0%, transparent 70%)',
        top: '-100px', left: '-80px',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', width: 350, height: 350,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,134,11,0.06) 0%, transparent 70%)',
        bottom: '-80px', right: '-60px',
        pointerEvents: 'none',
      }} />

      <div
        className="w-full max-w-5xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-12"
        style={{
          position: 'relative', zIndex: 1,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Texto */}
        <div className="flex flex-col gap-5 text-center md:text-left max-w-xl">
          <div
            className="inline-flex items-center gap-2 self-center md:self-start px-4 py-1.5"
            style={{
              border: '1px solid rgba(212,160,23,0.3)',
              color: 'rgba(212,160,23,0.7)',
              letterSpacing: '0.3em',
              fontSize: '0.62rem',
              fontFamily: 'Jost, sans-serif',
              textTransform: 'uppercase',
            }}
          >
            Pedidos especiales
          </div>

          <h2
            className="text-4xl md:text-5xl font-light leading-tight"
            style={{ color: '#FAF6EE', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}
          >
            ¿Tienes una ocasión{' '}
            <em style={{ color: '#D4A017' }}>especial?</em>
          </h2>

          <p
            className="text-base leading-relaxed"
            style={{ color: 'rgba(250,246,238,0.55)', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}
          >
            Creamos arreglos únicos para bodas, eventos corporativos, celebraciones y mucho más.
            Cuéntanos tu visión y la hacemos realidad.
          </p>

          {/* Stats inline */}
          <div className="flex items-center gap-8 justify-center md:justify-start mt-2">
            {[
              { v: '+500', l: 'eventos' },
              { v: '15+', l: 'años' },
              { v: '100%', l: 'satisfacción' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <div style={{ color: '#D4A017', fontFamily: 'Jost, sans-serif', fontSize: '1.4rem', fontWeight: 300 }}>{s.v}</div>
                <div style={{ color: 'rgba(250,246,238,0.3)', fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-4 items-center md:items-end shrink-0">
          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 hover:opacity-85 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #B8860B, #D4A017)',
              color: '#FAF6EE',
              fontFamily: 'Jost, sans-serif',
              boxShadow: '0 8px 32px rgba(184,134,11,0.35)',
              minWidth: '220px',
            }}
          >
            Solicitar presupuesto
          </button>
          <a
            href="https://wa.me/34606598156?text=Hola%2C%20me%20gustar%C3%ADa%20consultar%20sobre%20un%20evento%20especial"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-10 py-4 text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 hover:opacity-85 active:scale-95"
            style={{
              border: '1px solid rgba(250,246,238,0.2)',
              color: 'rgba(250,246,238,0.7)',
              fontFamily: 'Jost, sans-serif',
              minWidth: '220px',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.118 1.529 5.845L.057 23.885l6.23-1.635A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.031-1.38l-.36-.214-3.742.981 1-3.642-.235-.374A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z"/>
            </svg>
            WhatsApp directo
          </a>
        </div>
      </div>
    </section>
  );
}
