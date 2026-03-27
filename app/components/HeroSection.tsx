'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const WORDS = ['especiales', 'únicos', 'inolvidables', 'perfectos'];
const TITLE_LINE1 = 'La naturaleza';
const TITLE_LINE2 = 'más bella';

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${6 + (i * 6.8) % 88}%`,
  delay: `${(i * 1.3) % 12}s`,
  duration: `${10 + (i * 1.7) % 8}s`,
  size: `${8 + (i * 2.3) % 10}px`,
  dx: `${-40 + (i * 17) % 80}px`,
  rot: `${180 + (i * 43) % 360}deg`,
  opacity: 0.35 + (i % 3) * 0.15,
}));

export default function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [typedLine1, setTypedLine1] = useState('');
  const [typedLine2, setTypedLine2] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    let i = 0;
    const speed = 42;
    const delayStart = 300;
    // Type line 1
    const t1 = setTimeout(() => {
      const iv1 = setInterval(() => {
        i++;
        setTypedLine1(TITLE_LINE1.slice(0, i));
        if (i >= TITLE_LINE1.length) {
          clearInterval(iv1);
          // pause then type line 2
          let j = 0;
          setTimeout(() => {
            const iv2 = setInterval(() => {
              j++;
              setTypedLine2(TITLE_LINE2.slice(0, j));
              if (j >= TITLE_LINE2.length) {
                clearInterval(iv2);
                // blink cursor 3x then hide
                setTimeout(() => setShowCursor(false), 1800);
              }
            }, speed);
          }, 180);
        }
      }, speed);
    }, delayStart);
    return () => clearTimeout(t1);
  }, [loaded]);

  // Typewriter word cycle
  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIdx(i => (i + 1) % WORDS.length);
        setWordVisible(true);
      }, 400);
    }, 3200);
    return () => clearInterval(interval);
  }, [loaded]);

  useEffect(() => {
    const isMobile = () => window.innerWidth < 768;
    const el = parallaxRef.current;
    if (!el) return;

    const applySize = () => {
      if (isMobile()) {
        el.style.height = '100%';
        el.style.top = '0';
      } else {
        el.style.height = '115%';
        el.style.top = '-7.5%';
      }
    };
    applySize();
    window.addEventListener('resize', applySize, { passive: true });

    const onScroll = () => {
      if (isMobile() || !parallaxRef.current) return;
      parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', applySize);
    };
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0A0A0A' }}
    >
      {/* Fondo con imagen y overlay */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 w-full"
        style={{ height: '115%', top: '-7.5%', willChange: 'transform' }}
      >
        <Image
          src="/hero.jpeg"
          alt="Floristería Natura — Flores y Plantas en Reinosa"
          fill
          priority
          quality={90}
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
            filter: 'brightness(0.78)',
          }}
        />
      </div>

      {/* Overlay gradiente */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,8,2,0.55) 0%, rgba(10,8,2,0.08) 40%, rgba(10,8,2,0.08) 60%, rgba(10,8,2,0.65) 100%)',
        }}
      />

      {/* Pétalos flotantes */}
      {loaded && PETALS.map(p => (
        <div
          key={p.id}
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 2,
            animation: `petalFloat ${p.duration} ease-in ${p.delay} infinite`,
            ['--dx' as string]: p.dx,
            ['--rot' as string]: p.rot,
          }}
        >
          <svg viewBox="0 0 20 20" fill="none" style={{ width: '100%', height: '100%' }}>
            <ellipse cx="10" cy="6" rx="5" ry="8" fill={`rgba(212,160,23,${p.opacity})`} transform="rotate(-15 10 10)"/>
          </svg>
        </div>
      ))}

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-4xl mx-auto" style={{ zIndex: 3 }}>

        {/* Badge */}
        <div
          className="inline-flex items-center justify-center gap-2 px-5 py-1.5 mb-8 self-center"
          style={{
            border: '1px solid rgba(245,230,192,0.25)',
            color: 'rgba(245,230,192,0.65)',
            letterSpacing: '0.32em',
            fontSize: '0.6rem',
            fontFamily: 'Jost, sans-serif',
            textTransform: 'uppercase',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <span style={{ width: 20, height: '1px', background: 'rgba(212,160,23,0.4)', display: 'inline-block' }} />
          Floristería · Reinosa · Cantabria
          <span style={{ width: 20, height: '1px', background: 'rgba(212,160,23,0.4)', display: 'inline-block' }} />
        </div>

        {/* Título — typewriter */}
        <h1
          className="text-[3rem] leading-[1.1] sm:text-7xl md:text-8xl font-light mb-4 text-center w-full"
          style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            color: '#FAF6EE',
            textShadow: '0 2px 24px rgba(0,0,0,0.7), 0 1px 6px rgba(0,0,0,0.5)',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
            minHeight: '2.2em',
          }}
        >
          <span>{typedLine1}</span>
          {typedLine1.length === TITLE_LINE1.length && (
            <>
              <br />
              <em style={{ color: '#D4A017' }}>{typedLine2}</em>
            </>
          )}
          {showCursor && loaded && (
            <span
              style={{
                display: 'inline-block',
                width: '3px',
                height: '0.85em',
                background: '#D4A017',
                marginLeft: '3px',
                verticalAlign: 'middle',
                animation: 'twCursor 0.7s step-end infinite',
              }}
              aria-hidden="true"
            />
          )}
        </h1>

        {/* Subtítulo con palabra que cambia */}
        <div
          className="text-[2rem] sm:text-5xl md:text-6xl font-light mb-10 text-center"
          style={{
            fontFamily: 'Jost, sans-serif',
            fontWeight: 300,
            color: 'rgba(250,246,238,0.75)',
            textShadow: '0 2px 20px rgba(0,0,0,0.65)',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.9s ease 0.3s',
          }}
        >
          para momentos{' '}
          <span
            className="gold-shimmer"
            style={{
              display: 'inline-block',
              opacity: wordVisible ? 1 : 0,
              transform: wordVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
              fontStyle: 'italic',
            }}
          >
            {WORDS[wordIdx]}
          </span>
        </div>

        {/* Descripción */}
        <p
          className="text-sm md:text-base mb-12 leading-relaxed text-center w-full max-w-lg"
          style={{
            fontFamily: 'Jost, sans-serif',
            fontWeight: 300,
            color: 'rgba(250,246,238,0.72)',
            textShadow: '0 1px 12px rgba(0,0,0,0.6)',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s',
            letterSpacing: '0.02em',
          }}
        >
          Flores frescas, plantas exóticas y arreglos únicos creados con pasión.
          Lleva la elegancia de la naturaleza a cada rincón de tu vida.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.9s ease 0.55s, transform 0.9s ease 0.55s',
          }}
        >
          <button
            onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 hover:opacity-85 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #B8860B, #D4A017)',
              color: '#FAF6EE',
              fontFamily: 'Jost, sans-serif',
              boxShadow: '0 8px 32px rgba(184,134,11,0.3)',
            }}
          >
            Ver colección
          </button>
          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 active:scale-95"
            style={{
              border: '1px solid rgba(250,246,238,0.25)',
              color: 'rgba(250,246,238,0.8)',
              background: 'transparent',
              fontFamily: 'Jost, sans-serif',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            Hacer un pedido
          </button>
        </div>

        {/* Stats */}
        <div
          className="mt-16 pt-10 grid grid-cols-3 gap-8 w-full max-w-sm md:max-w-md"
          style={{
            borderTop: '1px solid rgba(245,230,192,0.1)',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1s ease 0.75s',
          }}
        >
          {[
            { valor: '+500', label: 'Variedades' },
            { valor: '15+', label: 'Años exp.' },
            { valor: '100%', label: 'Frescas' },
          ].map((s, i) => (
            <div key={s.label} className="text-center" style={{ opacity: loaded ? 1 : 0, transition: `opacity 0.8s ease ${0.8 + i * 0.1}s` }}>
              <div className="text-3xl md:text-4xl font-light" style={{ color: '#D4A017', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                {s.valor}
              </div>
              <div className="text-xs mt-1.5 tracking-[0.2em] uppercase" style={{ color: 'rgba(250,246,238,0.3)', fontFamily: 'Jost, sans-serif' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s ease 1s', zIndex: 3 }}
        onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(245,230,192,0.4)', fontFamily: 'Jost, sans-serif' }}>
          Descubrir
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '1px', height: '32px',
            background: 'linear-gradient(to bottom, transparent, rgba(212,160,23,0.6), transparent)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }} />
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.4, marginTop: 2 }}>
            <path d="M1 1l4 4 4-4" stroke="#D4A017" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
