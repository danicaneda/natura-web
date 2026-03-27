'use client';

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import ProductosSection from './ProductosSection';
import NosotrosSection from './NosotrosSection';
import EquipoSection from './EquipoSection';
import TestimoniosSection from './TestimoniosSection';
import GaleriaSection from './GaleriaSection';
import CtaBanner from './CtaBanner';
import ContactoSection from './ContactoSection';
import Footer from './Footer';
import MaintenancePage from './MaintenancePage';
import ScrollProgress from './ScrollProgress';
import ChatBot from './ChatBot';
import SectionWave from './SectionWave';

interface SiteStatus {
  maintenance_mode: boolean;
  maintenance_title: string;
  maintenance_message: string;
}

export default function HomeClient() {
  const [status, setStatus] = useState<SiteStatus | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then(r => r.json())
      .then(d => setStatus(d))
      .catch(() => setStatus({ maintenance_mode: false, maintenance_title: '', maintenance_message: '' }));
  }, []);

  if (status === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#FAF6EE' }}
      >
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: '#B8860B',
                animation: `pulse 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
      </div>
    );
  }

  if (status.maintenance_mode) {
    return (
      <MaintenancePage
        title={status.maintenance_title || 'Próximamente'}
        message={status.maintenance_message || 'Estamos preparando algo especial. Vuelve pronto.'}
      />
    );
  }

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main style={{ width: '100%' }}>
        <HeroSection />
        {/* Hero (#1A1208 dark) → Productos (#FAF6EE) */}
        <SectionWave from="#1A1208" to="#FAF6EE" variant={0} />
        <div className="botanical-texture">
          <ProductosSection />
        </div>
        {/* Productos (#FAF6EE) → Nosotros (#F5EDD8) */}
        <SectionWave from="#FAF6EE" to="#F5EDD8" variant={2} />
        <NosotrosSection />
        {/* Nosotros (#F5EDD8) → Equipo (#FAF6EE) */}
        <SectionWave from="#F5EDD8" to="#FAF6EE" variant={1} flip />
        <EquipoSection />
        {/* Equipo (#FAF6EE) → Testimonios (#F5EDD8) */}
        <SectionWave from="#FAF6EE" to="#F5EDD8" variant={0} flip />
        <TestimoniosSection />
        {/* Testimonios (#F5EDD8) → Galería (#FAF6EE) */}
        <SectionWave from="#F5EDD8" to="#FAF6EE" variant={2} />
        <div className="botanical-texture">
          <GaleriaSection />
        </div>
        {/* Galería (#FAF6EE) → CtaBanner (#2C1F0E dark) */}
        <SectionWave from="#FAF6EE" to="#2C1F0E" variant={1} />
        <CtaBanner />
        {/* CtaBanner (#2C1F0E) → Contacto (#FAF6EE) */}
        <SectionWave from="#2C1F0E" to="#FAF6EE" variant={0} />
        <ContactoSection />
      </main>
      <Footer />
      {/* Botones flotantes — WhatsApp a la izquierda del ChatBot, misma línea */}
      <a
        href="https://wa.me/34606598156"
        target="_blank"
        rel="noopener noreferrer"
        title="Contactar por WhatsApp"
        aria-label="Contactar por WhatsApp"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '88px',
          zIndex: 9996,
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: '#25D366',
          boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'; }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.118 1.529 5.845L.057 23.885l6.23-1.635A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.031-1.38l-.36-.214-3.742.981 1-3.642-.235-.374A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z"/>
        </svg>
      </a>
      <ChatBot />
    </>
  );
}
