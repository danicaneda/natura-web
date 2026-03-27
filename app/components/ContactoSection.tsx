'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MapaReinosa = dynamic(() => import('./MapaReinosa'), { ssr: false, loading: () => (
  <div style={{ width: '100%', height: '320px', background: '#EDE0C4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span style={{ color: '#8A7560', fontFamily: 'Jost, sans-serif', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Cargando mapa…</span>
  </div>
) });

const WA_NUMBER = '34606598156';
const WA_URL = `https://wa.me/${WA_NUMBER}`;

function buildWaUrl(nombre: string, mensaje: string): string {
  const text = `Hola, soy ${nombre}. ${mensaje}`.trim();
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export default function ContactoSection() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const [errors, setErrors] = useState<Record<string, string>>({} as Record<string, string>);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio';
    if (!form.email.trim()) {
      errs.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Introduce un email válido';
    }
    if (!form.mensaje.trim()) errs.mensaje = 'El mensaje es obligatorio';
    else if (form.mensaje.trim().length < 10) errs.mensaje = 'El mensaje es demasiado corto';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setEnviando(true);
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ _form: data.error ?? 'Error al enviar. Intenta por WhatsApp.' });
        return;
      }
      setEnviado(true);
    } catch {
      setErrors({ _form: 'Error de conexión. Intenta por WhatsApp.' });
    } finally {
      setEnviando(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const WA_SVG = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.118 1.529 5.845L.057 23.885l6.23-1.635A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.031-1.38l-.36-.214-3.742.981 1-3.642-.235-.374A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z"/>
    </svg>
  );

  return (
    <section id="contacto" style={{ background: '#F5EDD8', width: '100%', display: 'block' }}>
      <div className="w-full max-w-6xl mx-auto px-6 py-28">

        {/* Header con scroll-reveal */}
        <div
          ref={headerRef}
          className="flex flex-col items-center text-center mb-20"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#B8860B', fontFamily: 'Jost, sans-serif' }}>
            Contacto
          </p>
          <h2 className="text-5xl md:text-6xl font-light mb-6" style={{ color: '#1A1208', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
            Hablemos de tu <em>pedido</em>
          </h2>
          <div className="w-12 h-px mb-6" style={{ background: '#B8860B' }} />
          <p className="text-base max-w-xl" style={{ color: '#8A7560', fontFamily: 'Jost, sans-serif' }}>
            Cuéntanos qué necesitas y te ayudamos a crear la composición perfecta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* Info contacto — 2/5 */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-1.5" style={{ color: '#B8860B', fontFamily: 'Jost, sans-serif' }}>Visítanos</p>
              <p style={{ color: '#1A1208', fontFamily: 'Jost, sans-serif', fontSize: '0.95rem' }}>C. Peligros, 2, 39200 Reinosa, Cantabria</p>
            </div>

            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#B8860B', fontFamily: 'Jost, sans-serif' }}>Teléfono</p>
              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href="tel:+34606598156"
                  className="transition-opacity hover:opacity-70"
                  style={{ color: '#1A1208', fontFamily: 'Jost, sans-serif', fontSize: '0.95rem' }}
                >
                  +34 606 59 81 56
                </a>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Escribir por WhatsApp"
                  className="flex items-center gap-1.5 px-3 py-1 transition-all hover:opacity-85 active:scale-95"
                  style={{ background: '#25D366', borderRadius: '20px', color: 'white' }}
                >
                  {WA_SVG}
                  <span style={{ fontSize: '0.75rem', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>WhatsApp</span>
                </a>
              </div>
            </div>

            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-1.5" style={{ color: '#B8860B', fontFamily: 'Jost, sans-serif' }}>Email</p>
              <a
                href="mailto:terear@hotmail.es"
                className="transition-opacity hover:opacity-70"
                style={{ color: '#1A1208', fontFamily: 'Jost, sans-serif', fontSize: '0.95rem' }}
              >
                terear@hotmail.es
              </a>
            </div>

            <div className="w-12 h-px" style={{ background: 'rgba(184,134,11,0.25)' }} />

            {/* Horario */}
            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: '#B8860B', fontFamily: 'Jost, sans-serif' }}>Horario</p>
              <div className="space-y-2.5" style={{ fontFamily: 'Jost, sans-serif' }}>
                {[
                  ['Lunes – Viernes', '9:30 – 14:00 · 17:00 – 20:00', false],
                  ['Sábado', '9:30 – 14:00', false],
                  ['Domingo', 'Cerrado', true],
                ].map(([dia, hora, cerrado]) => (
                  <div key={String(dia)} className="flex justify-between text-sm">
                    <span style={{ color: '#4A3C28' }}>{dia}</span>
                    <span style={{ color: cerrado ? '#B8A88A' : '#B8860B' }}>{hora}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Formulario — 3/5 */}
          <div className="lg:col-span-3">
            {enviado ? (
              <div className="flex flex-col items-center text-center py-16">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                  style={{ background: 'rgba(184,134,11,0.1)', border: '1px solid rgba(184,134,11,0.25)' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="1.8">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="text-3xl font-light mb-3" style={{ color: '#1A1208', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                  ¡Mensaje recibido!
                </h3>
                <p className="mb-4 text-sm" style={{ color: '#8A7560', fontFamily: 'Jost, sans-serif' }}>
                  Te contactaremos en breve. Gracias por confiar en Natura.
                </p>
                <a
                  href={buildWaUrl(form.nombre, form.mensaje)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 mb-6 text-xs tracking-[0.1em] uppercase transition-all hover:opacity-85 active:scale-95"
                  style={{ background: '#25D366', color: 'white', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}
                >
                  {WA_SVG}
                  También puedes escribirnos por WhatsApp
                </a>
                <button
                  className="text-xs tracking-[0.2em] uppercase pb-0.5 transition-opacity hover:opacity-60"
                  style={{ color: '#B8860B', borderBottom: '1px solid #B8860B', fontFamily: 'Jost, sans-serif' }}
                  onClick={() => { setEnviado(false); setForm({ nombre: '', email: '', telefono: '', mensaje: '' }); setErrors({}); }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {[
                  { id: 'nombre', label: 'Nombre', type: 'text', placeholder: 'María García', required: true },
                  { id: 'email', label: 'Email', type: 'email', placeholder: 'maria@ejemplo.com', required: true },
                  { id: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '+34 606 59 81 56', required: false },
                ].map(field => (
                  <div key={field.id} className="flex flex-col gap-1">
                    <label
                      htmlFor={field.id}
                      className="text-xs tracking-[0.15em] uppercase"
                      style={{ color: errors[field.id] ? '#8B2A2A' : '#8A7560', fontFamily: 'Jost, sans-serif' }}
                    >
                      {field.label}{field.required && ' *'}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.id as keyof typeof form]}
                      onChange={e => handleChange(field.id, e.target.value)}
                      className="w-full px-0 py-3 text-sm outline-none transition-all"
                      style={{
                        background: 'transparent',
                        borderBottom: `1px solid ${errors[field.id] ? 'rgba(139,42,42,0.5)' : 'rgba(184,134,11,0.25)'}`,
                        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                        color: '#1A1208',
                        fontFamily: 'Jost, sans-serif',
                      }}
                      onFocus={e => (e.target.style.borderBottomColor = errors[field.id] ? 'rgba(139,42,42,0.7)' : '#B8860B')}
                      onBlur={e => (e.target.style.borderBottomColor = errors[field.id] ? 'rgba(139,42,42,0.5)' : 'rgba(184,134,11,0.25)')}
                    />
                    {errors[field.id] && (
                      <span className="text-xs mt-0.5" style={{ color: '#8B2A2A', fontFamily: 'Jost, sans-serif' }}>
                        {errors[field.id]}
                      </span>
                    )}
                  </div>
                ))}

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="mensaje" className="text-xs tracking-[0.15em] uppercase" style={{ color: errors.mensaje ? '#8B2A2A' : '#8A7560', fontFamily: 'Jost, sans-serif' }}>
                      Mensaje *
                    </label>
                    <span
                      className="text-xs tabular-nums"
                      style={{
                        fontFamily: 'Jost, sans-serif',
                        color: form.mensaje.length > 480
                          ? '#8B2A2A'
                          : form.mensaje.length > 380
                          ? '#B8860B'
                          : 'rgba(138,117,96,0.5)',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {form.mensaje.length}/500
                    </span>
                  </div>
                  <textarea
                    id="mensaje"
                    rows={4}
                    maxLength={500}
                    placeholder="Cuéntanos qué necesitas: tipo de flores, ocasión, presupuesto..."
                    value={form.mensaje}
                    onChange={e => handleChange('mensaje', e.target.value)}
                    className="w-full px-0 py-3 text-sm outline-none resize-none transition-all"
                    style={{
                      background: 'transparent',
                      borderBottom: `1px solid ${errors.mensaje ? 'rgba(139,42,42,0.5)' : 'rgba(184,134,11,0.25)'}`,
                      borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                      color: '#1A1208',
                      fontFamily: 'Jost, sans-serif',
                    }}
                    onFocus={e => (e.target.style.borderBottomColor = errors.mensaje ? 'rgba(139,42,42,0.7)' : '#B8860B')}
                    onBlur={e => (e.target.style.borderBottomColor = errors.mensaje ? 'rgba(139,42,42,0.5)' : 'rgba(184,134,11,0.25)')}
                  />
                  {errors.mensaje && (
                    <span className="text-xs mt-0.5" style={{ color: '#8B2A2A', fontFamily: 'Jost, sans-serif' }}>
                      {errors.mensaje}
                    </span>
                  )}
                </div>

                {errors._form && (
                  <div className="py-3 px-4 text-sm" style={{ background: 'rgba(139,42,42,0.08)', border: '1px solid rgba(139,42,42,0.2)', color: '#8B2A2A', fontFamily: 'Jost, sans-serif' }}>
                    {errors._form}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 flex-wrap gap-4">
                  <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs transition-opacity hover:opacity-80"
                    style={{ color: '#25D366', fontFamily: 'Jost, sans-serif' }}
                  >
                    <span style={{ color: '#25D366' }}>{WA_SVG}</span>
                    Escribir por WhatsApp
                  </a>
                  <button
                    type="submit"
                    disabled={enviando}
                    className="px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium transition-all hover:opacity-85 disabled:opacity-50 active:scale-95 flex items-center gap-2"
                    style={{ background: '#B8860B', color: '#FAF6EE', fontFamily: 'Jost, sans-serif' }}
                  >
                    {enviando ? (
                      <>
                        <span
                          className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full"
                          style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}
                        />
                        Enviando…
                      </>
                    ) : 'Enviar mensaje'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-16" style={{ overflow: 'hidden', border: '1px solid rgba(184,134,11,0.18)' }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#EDE0C4' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <p className="text-xs tracking-[0.15em] uppercase" style={{ color: '#B8860B', fontFamily: 'Jost, sans-serif' }}>
              C. Peligros, 2 — 39200 Reinosa, Cantabria
            </p>
            <a
              href="https://maps.google.com/?q=C.+Peligros+2+Reinosa+Cantabria"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs transition-opacity hover:opacity-60 flex items-center gap-1"
              style={{ color: '#B8860B', fontFamily: 'Jost, sans-serif', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              Abrir en Google Maps
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 9L9 1M9 1H3M9 1v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
          <div style={{ height: '360px' }}>
            <MapaReinosa />
          </div>
        </div>
      </div>

    </section>
  );
}
