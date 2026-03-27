'use client';

import { useState, useEffect, useRef } from 'react';

export default function Footer() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const links = [
    { href: 'inicio', label: 'Inicio' },
    { href: 'productos', label: 'Productos' },
    { href: 'nosotros', label: 'Nosotros' },
    { href: 'galeria', label: 'Galería' },
    { href: 'contacto', label: 'Contacto' },
  ];

  return (
    <footer ref={ref} style={{ background: '#2C1F0E' }}>
      <div
        className="w-full max-w-6xl mx-auto px-6 py-20"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Top: logo + nav + contacto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-16">

          {/* Marca */}
          <div className="flex flex-col gap-5">
            <div>
              <p
                className="text-2xl tracking-[0.25em] uppercase"
                style={{ color: '#D4A017', fontFamily: 'Jost, sans-serif', fontWeight: 300, letterSpacing: '0.3em' }}
              >
                Natura
              </p>
              <p className="text-xs tracking-[0.3em] uppercase mt-1" style={{ color: 'rgba(184,134,11,0.4)', fontFamily: 'Jost, sans-serif' }}>
                Flores & Plantas
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(250,246,238,0.38)', fontFamily: 'Jost, sans-serif' }}>
              Arte floral con alma. Creamos momentos únicos con la belleza de la naturaleza desde Reinosa, Cantabria.
            </p>
            {/* Redes sociales */}
            <div className="flex items-center gap-3 mt-1">
              {[
                {
                  label: 'Instagram',
                  href: 'https://instagram.com',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
                },
                {
                  label: 'Facebook',
                  href: 'https://facebook.com',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
                },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 flex items-center justify-center transition-all hover:opacity-80"
                  style={{ color: 'rgba(212,160,23,0.6)', border: '1px solid rgba(184,134,11,0.2)' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(184,134,11,0.45)', fontFamily: 'Jost, sans-serif' }}>
              Páginas
            </p>
            <nav className="flex flex-col gap-2.5">
              {links.map(link => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-sm transition-all hover:opacity-60 w-fit"
                  style={{ color: 'rgba(250,246,238,0.55)', fontFamily: 'Jost, sans-serif' }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(184,134,11,0.45)', fontFamily: 'Jost, sans-serif' }}>
              Contacto
            </p>
            <div className="flex flex-col gap-3 text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
              <span style={{ color: 'rgba(250,246,238,0.55)', lineHeight: 1.6 }}>
                C. Peligros, 2<br />39200 Reinosa, Cantabria
              </span>
              <a
                href="tel:+34606598156"
                className="transition-all hover:opacity-70 w-fit"
                style={{ color: 'rgba(250,246,238,0.55)' }}
              >
                +34 606 59 81 56
              </a>
              <a
                href="mailto:hola@natura-flores.es"
                className="transition-all hover:opacity-70 w-fit"
                style={{ color: 'rgba(250,246,238,0.55)' }}
              >
                hola@natura-flores.es
              </a>
              <span style={{ color: 'rgba(250,246,238,0.3)', fontSize: '0.8rem' }}>
                Lun – Vie: 9:00 – 20:00<br />
                Sáb: 9:00 – 14:00
              </span>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="w-full h-px mb-8" style={{ background: 'rgba(184,134,11,0.12)' }} />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(250,246,238,0.18)', fontFamily: 'Jost, sans-serif' }}>
            © {new Date().getFullYear()} Natura Flores & Plantas — Reinosa, Cantabria. Todos los derechos reservados.
          </p>
          <p className="text-xs tracking-[0.2em] uppercase flex items-center gap-1.5" style={{ color: 'rgba(184,134,11,0.35)', fontFamily: 'Jost, sans-serif' }}>
            <span>Hecho con</span>
            <span style={{ color: '#B8860B' }}>✿</span>
            <span>y pasión</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
