'use client';

import { useEffect, useRef, useState } from 'react';

const testimonios = [
  {
    nombre: 'Mariana Pasquel',
    avatar: 'MP',
    texto: 'El ramo que encargué quedó PRECIOSO. Me ha encantado tanto que casi me lo regalo a mí misma 🤣💐 Siempre atentas y muy profesionales. Pedí un ramo para regalo disimulando una botella de champán y quedó espectacular. Se nota muchísimo el cariño con el que hacen las cosas, y eso vale oro. Siempre aciertan con los encargos. Sin duda, mi floristería de confianza.',
    nota: 5,
    ocasion: 'Regalo especial',
    via: 'Google',
  },
  {
    nombre: 'Andrea Jimenez',
    avatar: 'AJ',
    texto: 'La mejor de las mejores en su sector, su equipo es maravilloso y la dirección de la empresa es inmejorable. Abarcan todos los servicios imaginables en floristería, y el nivel técnico y de estilo es impresionante. Siempre innovando y de la mano de las últimas tendencias. Los mejores y sobre todo con el mejor trato.',
    nota: 5,
    ocasion: 'Valoración general',
    via: 'Google',
  },
  {
    nombre: 'Nieves Chico',
    avatar: 'NC',
    texto: 'Un día espectacular gracias a Tere porque desde el principio entendió perfectamente nuestra idea. Recomiendo a todas las parejas que se pongan en manos de ella. Mil gracias.',
    nota: 5,
    ocasion: 'Boda',
    via: 'Google',
  },
  {
    nombre: 'Patricia Sáiz Ruiloba',
    avatar: 'PS',
    texto: 'Encantada 😍 Súper agradable trato con todas las facilidades del mundo... Llamé por tlf para encargar un ramo con envío y pude pagarlo por bizum. El ramo era enorme, precioso y muy original!!! Gracias chicas 😘',
    nota: 5,
    ocasion: 'Envío a domicilio',
    via: 'Google',
  },
  {
    nombre: 'Cristina C.',
    avatar: 'CC',
    texto: 'Nos casamos este verano y le encargamos el arco de flores para la ceremonia junto con los centros de mesa. El resultado espectacular y el trato muy cercano. Muy recomendable.',
    nota: 5,
    ocasion: 'Boda',
    via: 'Google',
  },
  {
    nombre: 'Alberto Fernández',
    avatar: 'AF',
    texto: 'Muy recomendable. Hice un pedido de un ramo por teléfono, y la atención no pudo ser mejor. Les mandé por WhatsApp una idea de lo que quería y Tere lo preparó y me mandó foto de cómo quedaba... y de precio muy bien.',
    nota: 5,
    ocasion: 'Pedido por teléfono',
    via: 'Google',
  },
  {
    nombre: 'Sally Maria Mallen',
    avatar: 'SM',
    texto: 'Trato excepcional. Nuestro encargo fue un centro de flores para un funeral. El trato cercano de Tere, su ayuda, su predisposición y sensibilidad a la hora de tratar con nosotros sin duda ha sido de 10.',
    nota: 5,
    ocasion: 'Funeral',
    via: 'Google',
  },
  {
    nombre: 'Joaquin Martinez',
    avatar: 'JM',
    texto: 'Si quieres alguien profesional en el mundo de las flores, plantas, el equipo de Tere en Natura son de lo mejor. Son famosos los ramos de novia que prepara y entrega Tere a las novias. Servicio y precio de maravilla.',
    nota: 5,
    ocasion: 'Ramo de novia',
    via: 'Google',
  },
  {
    nombre: 'Rita Callejo',
    avatar: 'RC',
    texto: '10/10. Tere es increíble, y hace unos ramos de muerte.',
    nota: 5,
    ocasion: 'Calidad',
    via: 'Google',
  },
  {
    nombre: 'David Sansom',
    avatar: 'DS',
    texto: 'Teresa es un espectáculo! El servicio fue rápido, bueno, personal, con mucho conocimiento, la verdad, me ha dejado súper contento! Muchas gracias Teresa.',
    nota: 5,
    ocasion: 'Atención personal',
    via: 'Google',
  },
  {
    nombre: 'Luis Martin',
    avatar: 'LM',
    texto: 'Tere una persona muy cariñosa y cercana, encargamos la decoración floral para nuestra boda y aportó grandes ideas. Muchas gracias por formar parte de un día inolvidable.',
    nota: 5,
    ocasion: 'Decoración boda',
    via: 'Google',
  },
  {
    nombre: 'Noelia Benito Martinez',
    avatar: 'NB',
    texto: 'Floristería con encanto y encantadoras sus floristas.',
    nota: 5,
    ocasion: 'Ambiente',
    via: 'Google',
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill={i < n ? '#D4A017' : 'rgba(184,134,11,0.2)'}>
          <path d="M6 1l1.4 2.8 3.1.5-2.2 2.1.5 3.1L6 8.1l-2.8 1.4.5-3.1L1.5 4.3l3.1-.5z"/>
        </svg>
      ))}
    </div>
  );
}

const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?q=Natura+flores+y+plantas+Reinosa+rese%C3%B1as&tbm=lcl';

function GoogleLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function TestimonioCard({ t }: { t: typeof testimonios[0] }) {
  return (
    <div
      className="flex-shrink-0 flex flex-col gap-4 p-7 mx-3"
      style={{
        width: '320px',
        background: '#FFFFFF',
        border: '1px solid rgba(184,134,11,0.1)',
        boxShadow: '0 2px 16px rgba(26,18,8,0.04)',
      }}
    >
      {/* Header: avatar + nombre + Google badge */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
          style={{ background: 'linear-gradient(135deg, #B8860B, #D4A017)', color: '#FAF6EE', fontFamily: 'Jost, sans-serif', letterSpacing: '0.05em' }}
        >
          {t.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: '#1A1208', fontFamily: 'Jost, sans-serif' }}>{t.nombre}</p>
          <p className="text-xs mt-0.5 tracking-widest uppercase" style={{ color: 'rgba(184,134,11,0.5)', fontFamily: 'Jost, sans-serif' }}>{t.ocasion}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0 px-2 py-1" style={{ border: '1px solid rgba(0,0,0,0.07)', borderRadius: '4px' }}>
          <GoogleLogo />
          <span className="text-xs" style={{ color: '#5F6368', fontFamily: 'Jost, sans-serif' }}>Google</span>
        </div>
      </div>

      {/* Stars */}
      <Stars n={t.nota} />

      {/* Texto */}
      <p
        className="text-sm leading-relaxed flex-1"
        style={{ color: '#4A3C28', fontFamily: 'Jost, sans-serif', fontStyle: 'italic' }}
      >
        &ldquo;{t.texto}&rdquo;
      </p>
    </div>
  );
}

export default function TestimoniosSection() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const doubled = [...testimonios, ...testimonios];

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="testimonios"
      style={{ background: '#F5EDD8', width: '100%', display: 'block', overflow: 'hidden' }}
    >
      <div className="w-full max-w-6xl mx-auto px-6 pt-28 pb-16">
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
            Reseñas
          </p>
          <h2 className="text-5xl md:text-6xl font-light mb-6" style={{ color: '#1A1208', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
            Lo que dicen <em>nuestros clientes</em>
          </h2>
          <div className="w-12 h-px mb-6" style={{ background: '#B8860B' }} />
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="18" height="18" viewBox="0 0 12 12" fill="#D4A017">
                    <path d="M6 1l1.4 2.8 3.1.5-2.2 2.1.5 3.1L6 8.1l-2.8 1.4.5-3.1L1.5 4.3l3.1-.5z"/>
                  </svg>
                ))}
              </div>
              <p className="text-sm" style={{ color: '#8A7560', fontFamily: 'Jost, sans-serif' }}>
                5.0 · Reseñas verificadas en Google
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase pb-0.5 transition-opacity hover:opacity-60"
                style={{ color: '#B8860B', borderBottom: '1px solid rgba(184,134,11,0.4)', fontFamily: 'Jost, sans-serif' }}
              >
                <GoogleLogo />
                Ver todas en Google
              </a>
              <a
                href="https://search.google.com/local/writereview?placeid=ChIJYfockF9oOQ0R2xi0-RQ0lrs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2 text-xs tracking-[0.15em] uppercase transition-all hover:opacity-85 active:scale-95"
                style={{
                  border: '1px solid rgba(184,134,11,0.3)',
                  color: '#B8860B',
                  fontFamily: 'Jost, sans-serif',
                }}
              >
                ✦ Dejar tu reseña
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee — full width, fuera del max-w container */}
      <div
        className="w-full overflow-hidden pb-28"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div className="marquee-track">
          {doubled.map((t, i) => (
            <TestimonioCard key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
