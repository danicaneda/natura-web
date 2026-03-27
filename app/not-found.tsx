'use client';

import { useEffect, useState } from 'react';

export default function NotFound() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAF6EE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #B8860B, #8B6508)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            margin: '0 auto 16px auto',
          }}
        >
          🌿
        </div>
        <p
          style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '1.1rem',
            letterSpacing: '4px',
            color: '#B8860B',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          NATURA
        </p>
      </div>

      {/* 404 */}
      <p
        style={{
          fontFamily: 'Jost, sans-serif',
          fontSize: '0.7rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#B8860B',
          margin: '0 0 16px 0',
        }}
      >
        Error 404
      </p>
      <h1
        style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          fontWeight: 300,
          color: '#1A1208',
          margin: '0 0 8px 0',
          lineHeight: 1.1,
          textAlign: 'center',
        }}
      >
        Página no encontrada
      </h1>

      <div style={{ width: '48px', height: '1px', background: '#B8860B', margin: '20px auto' }} />

      <p
        style={{
          fontFamily: 'Jost, sans-serif',
          fontSize: '0.95rem',
          color: '#8A7560',
          textAlign: 'center',
          maxWidth: '380px',
          lineHeight: 1.7,
          margin: '0 0 40px 0',
        }}
      >
        Parece que esta flor no existe en nuestro jardín.
        Vuelve al inicio y descubre nuestra colección.
      </p>

      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '14px 32px',
          background: '#B8860B',
          color: '#FAF6EE',
          fontFamily: 'Jost, sans-serif',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
      >
        Volver al inicio
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>

      {/* Links secundarios */}
      <div
        style={{
          marginTop: '32px',
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {[
          { label: 'Productos', href: '/#productos' },
          { label: 'Galería', href: '/#galeria' },
          { label: 'Contacto', href: '/#contacto' },
        ].map(link => (
          <a
            key={link.href}
            href={link.href}
            style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#B8860B',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(184,134,11,0.3)',
              paddingBottom: '2px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.6'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
