'use client';

import { useEffect, useRef, useState } from 'react';

const valores = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4C14 4 8 8 8 14a6 6 0 0012 0c0-6-6-10-6-10z" stroke="#B8860B" strokeWidth="1.4" strokeLinejoin="round" fill="rgba(184,134,11,0.08)"/>
        <path d="M14 14v9" stroke="#B8860B" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    titulo: 'Frescura garantizada',
    desc: 'Flores y plantas de temporada, renovadas cada día para asegurar la máxima calidad.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="4" stroke="#B8860B" strokeWidth="1.4" fill="rgba(184,134,11,0.08)"/>
        <path d="M14 4v4M14 20v4M4 14h4M20 14h4M7 7l2.8 2.8M18.2 18.2L21 21M7 21l2.8-2.8M18.2 9.8L21 7" stroke="#B8860B" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    titulo: 'Arreglos a medida',
    desc: 'Composiciones personalizadas adaptadas a tu ocasión, gusto y presupuesto.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M5 14h14M14 8l6 6-6 6" stroke="#B8860B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 6c2 2 3 5 3 8s-1 6-3 8" stroke="#B8860B" strokeWidth="1.4" strokeLinecap="round" fill="rgba(184,134,11,0.08)"/>
      </svg>
    ),
    titulo: 'Entrega a domicilio',
    desc: 'Llevamos la naturaleza hasta tu puerta con mimo, puntualidad y cuidado.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 6l2 5h5l-4 3 1.5 5L14 16l-4.5 3 1.5-5-4-3h5z" stroke="#B8860B" strokeWidth="1.4" strokeLinejoin="round" fill="rgba(184,134,11,0.08)"/>
      </svg>
    ),
    titulo: 'Pasión floral',
    desc: 'Más de 15 años dedicados al arte floral con amor, experiencia y profesionalidad.',
  },
];

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function CountUp({ to, suffix = '', duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const raf = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * to));
      if (t < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [started, to, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

const STATS = [
  { label: 'Años en Reinosa', value: 15, suffix: '+' },
  { label: 'Clientes felices', value: 2400, suffix: '+' },
  { label: 'Variedades', value: 500, suffix: '+' },
  { label: 'Bodas & eventos', value: 500, suffix: '+' },
];

export default function NosotrosSection() {
  const header = useReveal(0.2);
  const grid = useReveal(0.1);
  const cita = useReveal(0.3);

  return (
    <section id="nosotros" style={{ background: '#F5EDD8', width: '100%', display: 'block' }}>
      <div className="w-full max-w-6xl mx-auto px-6 py-28">

        {/* Header */}
        <div
          ref={header.ref}
          className="flex flex-col items-center text-center mb-20"
          style={{
            opacity: header.visible ? 1 : 0,
            transform: header.visible ? 'translateY(0)' : 'translateY(22px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#B8860B', fontFamily: 'Jost, sans-serif' }}>
            Quiénes somos
          </p>
          <h2 className="text-5xl md:text-6xl font-light mb-6" style={{ color: '#1A1208', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
            Arte floral <em>con alma</em>
          </h2>
          <div className="w-12 h-px mb-8" style={{ background: '#B8860B' }} />
          <p className="text-base leading-relaxed max-w-2xl" style={{ color: '#4A3C28', fontFamily: 'Jost, sans-serif' }}>
            En Natura creemos que las flores son la forma más pura de expresar lo que sentimos.
            Cuidamos cada detalle para que cada ramo, cada planta y cada arreglo sea una obra de arte natural.
            Trabajamos con cultivadores locales para garantizar la máxima frescura en cada creación.
          </p>
        </div>

        {/* Grid de valores */}
        <div ref={grid.ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {valores.map((v, i) => (
            <div
              key={v.titulo}
              className="flex flex-col p-8 transition-all duration-300"
              style={{
                background: '#FAF6EE',
                border: '1px solid rgba(184,134,11,0.12)',
                opacity: grid.visible ? 1 : 0,
                transform: grid.visible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.65s ease ${i * 100}ms, transform 0.65s ease ${i * 100}ms, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#FFFFFF';
                el.style.borderColor = 'rgba(184,134,11,0.28)';
                el.style.boxShadow = '0 6px 24px rgba(184,134,11,0.1)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#FAF6EE';
                el.style.borderColor = 'rgba(184,134,11,0.12)';
                el.style.boxShadow = 'none';
              }}
            >
              <div className="mb-6">{v.icon}</div>
              <h3 className="text-lg mb-3" style={{ color: '#1A1208', fontFamily: 'Jost, sans-serif', fontSize: '1.05rem', fontWeight: 500, letterSpacing: '0.01em' }}>
                {v.titulo}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#8A7560', fontFamily: 'Jost, sans-serif' }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stats animados */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-16" style={{ background: 'rgba(184,134,11,0.12)' }}>
          {STATS.map(s => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center py-10 px-6"
              style={{ background: '#F5EDD8' }}
            >
              <div
                className="text-4xl md:text-5xl font-light mb-2"
                style={{ color: '#B8860B', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}
              >
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div
                className="text-xs tracking-[0.2em] uppercase"
                style={{ color: '#8A7560', fontFamily: 'Jost, sans-serif' }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Cita */}
        <div
          ref={cita.ref}
          className="flex flex-col items-center text-center mt-20 px-6"
          style={{
            opacity: cita.visible ? 1 : 0,
            transform: cita.visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="w-12 h-px mb-8" style={{ background: 'rgba(184,134,11,0.3)' }} />
          <blockquote
            className="text-xl md:text-2xl font-light italic max-w-2xl leading-relaxed"
            style={{ color: '#4A3C28', fontFamily: 'Jost, sans-serif' }}
          >
            &ldquo;Una flor no piensa en competir con la flor de al lado. Simplemente florece.&rdquo;
          </blockquote>
          <p className="mt-4 text-xs tracking-widest uppercase" style={{ color: '#B8860B', fontFamily: 'Jost, sans-serif' }}>— Zen Shin</p>
        </div>

      </div>
    </section>
  );
}
