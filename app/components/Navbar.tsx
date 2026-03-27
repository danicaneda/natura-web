'use client';

import { useState, useEffect } from 'react';

const navLinks = [
  { href: 'inicio', label: 'Inicio' },
  { href: 'productos', label: 'Productos' },
  { href: 'nosotros', label: 'Nosotros' },
  { href: 'galeria', label: 'Galería' },
  { href: 'contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    navLinks.forEach(({ href }) => {
      const el = document.getElementById(href);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(href); },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const NAVBAR_HEIGHT = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(250,246,238,0.97)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.72), transparent)',
          borderBottom: scrolled ? '1px solid rgba(184,134,11,0.2)' : 'none',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 md:py-5 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo('inicio')} className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #B8860B, #8B6508)' }}
            >
              🌿
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-light text-xl tracking-[0.25em] uppercase transition-colors duration-300"
                style={{ color: scrolled ? '#8B6508' : '#F5E6C0', fontFamily: 'Cormorant Garamond, Georgia, serif' }}
              >
                NATURA
              </span>
              <span
                className="text-xs tracking-[0.3em] uppercase transition-colors duration-300"
                style={{ color: scrolled ? 'rgba(139,101,8,0.5)' : 'rgba(245,230,192,0.5)', fontFamily: 'Jost, sans-serif' }}
              >
                FLORES & PLANTAS
              </span>
            </div>
          </button>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(link => {
              const isActive = activeSection === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="relative px-4 py-2 text-xs tracking-[0.15em] uppercase font-normal group"
                  style={{
                    color: scrolled
                      ? (isActive ? '#B8860B' : '#6B5A42')
                      : (isActive ? '#D4A017' : 'rgba(250,246,238,0.72)'),
                    fontFamily: 'Jost, sans-serif',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = scrolled ? '#B8860B' : '#FAF6EE';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = scrolled ? '#6B5A42' : 'rgba(250,246,238,0.72)';
                  }}
                >
                  {link.label}
                  {/* Underline — active: solid, hover: fades in */}
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-px transition-all duration-300"
                    style={{
                      background: scrolled ? '#B8860B' : '#D4A017',
                      width: isActive ? '16px' : '0px',
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-2">
            {/* WhatsApp icono en hero (transparente) */}
            <a
              href="https://wa.me/34606598156"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hidden md:flex items-center justify-center w-9 h-9 transition-all hover:opacity-75 active:scale-95"
              style={{
                border: `1px solid ${scrolled ? 'rgba(184,134,11,0.3)' : 'rgba(250,246,238,0.2)'}`,
                color: scrolled ? '#B8860B' : 'rgba(250,246,238,0.7)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.118 1.529 5.845L.057 23.885l6.23-1.635A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.031-1.38l-.36-.214-3.742.981 1-3.642-.235-.374A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z"/>
              </svg>
            </a>
            {/* Desktop: texto completo */}
            <a
              href="tel:+34606598156"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.12em] uppercase transition-all hover:opacity-85 active:scale-95"
              style={{
                background: scrolled ? '#B8860B' : 'rgba(184,134,11,0.85)',
                color: '#FAF6EE',
                fontFamily: 'Jost, sans-serif',
                backdropFilter: scrolled ? 'none' : 'blur(4px)',
              }}
            >
              Llámanos
            </a>
            {/* Móvil: icono de teléfono */}
            <a
              href="tel:+34606598156"
              className="md:hidden flex items-center justify-center w-9 h-9 transition-all hover:opacity-75 active:scale-95"
              aria-label="Llamar"
              style={{
                background: scrolled ? '#B8860B' : 'rgba(184,134,11,0.85)',
                backdropFilter: scrolled ? 'none' : 'blur(4px)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAF6EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.13 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
              </svg>
            </a>

            {/* Hamburger — fixed animation */}
            <button
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              <span
                className="block w-5 h-0.5 rounded-full transition-all duration-300 origin-center"
                style={{
                  background: scrolled ? '#B8860B' : '#F5E6C0',
                  transform: menuOpen ? 'translateY(8px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="block w-5 h-0.5 rounded-full transition-all duration-300"
                style={{
                  background: scrolled ? '#B8860B' : '#F5E6C0',
                  opacity: menuOpen ? 0 : 1,
                  transform: menuOpen ? 'scaleX(0)' : 'none',
                }}
              />
              <span
                className="block w-5 h-0.5 rounded-full transition-all duration-300 origin-center"
                style={{
                  background: scrolled ? '#B8860B' : '#F5E6C0',
                  transform: menuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden transition-all duration-300 overflow-hidden"
          style={{
            maxHeight: menuOpen ? '420px' : '0',
            background: 'rgba(250,246,238,0.99)',
            backdropFilter: 'blur(14px)',
            borderTop: menuOpen ? '1px solid rgba(184,134,11,0.2)' : 'none',
          }}
        >
          <div className="flex flex-col px-6 py-5 gap-1">
            {navLinks.map(link => {
              const isActive = activeSection === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left py-3 px-4 text-sm transition-all duration-200"
                  style={{
                    color: isActive ? '#B8860B' : '#4A3C28',
                    fontFamily: 'Jost, sans-serif',
                    borderLeft: isActive ? '2px solid #B8860B' : '2px solid transparent',
                    background: isActive ? 'rgba(184,134,11,0.06)' : 'transparent',
                  }}
                >
                  {link.label}
                </button>
              );
            })}
            <a
              href="tel:+34606598156"
              className="mt-3 py-3 px-4 text-center text-sm font-medium tracking-[0.1em] uppercase transition-all hover:opacity-80 active:scale-95"
              style={{ background: '#B8860B', color: '#FAF6EE', fontFamily: 'Jost, sans-serif' }}
            >
              Llamar ahora · 606 59 81 56
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
