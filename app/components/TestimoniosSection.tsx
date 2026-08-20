"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { swr } from "@/app/lib/cache";
import SectionHeader from "./ui/SectionHeader";
import { ChevronLeft, ChevronRight, Google, Star } from "./ui/Icons";
import { SITE } from "@/app/lib/site";

interface Testimonio {
  id?: number;
  nombre: string;
  texto: string;
  nota: number;
  ocasion?: string;
}

const FALLBACK: Testimonio[] = [
  { nombre: "Mariana Pasquel",     texto: "El ramo que encargué quedó precioso. Siempre atentas y muy profesionales — se nota el cariño con el que hacen las cosas.", nota: 5, ocasion: "Regalo especial" },
  { nombre: "Andrea Jimenez",      texto: "La mejor de las mejores en su sector. Nivel técnico y estilo impresionantes, siempre innovando y de la mano de las últimas tendencias.", nota: 5, ocasion: "Valoración general" },
  { nombre: "Nieves Chico",        texto: "Un día espectacular gracias a Tere. Desde el principio entendió perfectamente nuestra idea. Recomiendo a todas las parejas que se pongan en sus manos.", nota: 5, ocasion: "Boda" },
  { nombre: "Patricia Sáiz Ruiloba", texto: "Encantada. Trato muy agradable, todas las facilidades del mundo. El ramo era enorme, precioso y muy original.", nota: 5, ocasion: "Envío a domicilio" },
  { nombre: "Cristina C.",         texto: "Nos casamos este verano y le encargamos el arco de flores para la ceremonia junto con los centros de mesa. El resultado espectacular y el trato muy cercano.", nota: 5, ocasion: "Boda" },
  { nombre: "Alberto Fernández",   texto: "Muy recomendable. Les mandé por WhatsApp una idea de lo que quería y Tere lo preparó y me mandó foto de cómo quedaba. Precio muy bien.", nota: 5, ocasion: "Pedido por teléfono" },
  { nombre: "Sally Maria Mallen",  texto: "Trato excepcional. El trato cercano de Tere, su ayuda, su predisposición y sensibilidad a la hora de tratar con nosotros ha sido de 10.", nota: 5, ocasion: "Funeral" },
  { nombre: "Joaquin Martinez",    texto: "Si buscas profesionales en el mundo de las flores, el equipo de Tere son de lo mejor. Servicio y precio de maravilla.", nota: 5, ocasion: "Ramo de novia" },
  { nombre: "Rita Callejo",        texto: "10/10. Tere es increíble, y hace unos ramos preciosos.", nota: 5, ocasion: "Calidad" },
  { nombre: "David Sansom",        texto: "Servicio rápido, personal y con mucho conocimiento. Me ha dejado súper contento.", nota: 5, ocasion: "Atención personal" },
  { nombre: "Luis Martín",         texto: "Tere una persona muy cariñosa y cercana. Encargamos la decoración floral para nuestra boda y aportó grandes ideas.", nota: 5, ocasion: "Decoración boda" },
  { nombre: "Noelia Benito",       texto: "Floristería con encanto y encantadoras sus floristas.", nota: 5, ocasion: "Ambiente" },
];

const VISIBLE_DESKTOP = 2;
const AUTOPLAY_MS = 6500;

function Card({ t }: { t: Testimonio }) {
  return (
    <article className="relative bg-[color:var(--color-cream)] border border-[color:var(--rule-soft)] p-8 md:p-10 flex flex-col h-full">
      <span
        aria-hidden="true"
        className="absolute top-4 left-6 font-serif text-[7rem] leading-none text-[color:var(--color-gold)] opacity-[0.08] pointer-events-none select-none"
      >
        &ldquo;
      </span>
      <div className="flex gap-1 mb-4 text-[color:var(--color-gold-2)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} filled={i < t.nota} />
        ))}
      </div>
      <blockquote className="font-serif italic text-lg md:text-xl leading-[1.5] text-[color:var(--color-ink-2)] flex-1">
        {t.texto}
      </blockquote>
      <div className="mt-8 pt-6 border-t border-[color:var(--rule-soft)] flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-sm text-[color:var(--color-ink-2)] font-medium">{t.nombre}</span>
          {t.ocasion && (
            <span className="text-[0.6rem] tracking-[0.18em] uppercase text-[color:var(--color-gold-3)] mt-0.5">
              {t.ocasion}
            </span>
          )}
        </div>
        <span className="inline-flex items-center gap-1.5 text-[0.65rem] text-[color:var(--color-ink-5)]">
          <Google size={12} />
          Google
        </span>
      </div>
    </article>
  );
}

export default function TestimoniosSection() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>(FALLBACK);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = testimonios.length;

  useEffect(() => {
    swr<Testimonio[]>(
      "natura_testimonios",
      () => fetch("/api/testimonios").then((r) => r.json()),
      (d) => { if (Array.isArray(d) && d.length > 0) setTestimonios(d); },
      5 * 60 * 1000
    );
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, AUTOPLAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, paused, next]);

  const visibleIdx = Array.from({ length: VISIBLE_DESKTOP }, (_, i) => (current + i) % total);

  return (
    <section id="testimonios" className="bg-[color:var(--color-cream-2)]">
      <div className="n-container n-section-y">
        <SectionHeader
          eyebrow="Testimonios"
          title={<>Lo que dicen <em className="text-[color:var(--color-gold)]">nuestros clientes</em></>}
        />

        {/* Trust strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="flex text-[color:var(--color-gold-2)] gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} />)}
            </span>
            <span className="text-[color:var(--color-ink-2)] font-medium">{SITE.google.rating.toFixed(1)}</span>
          </div>
          <span className="w-px h-4 bg-[color:var(--rule)]" aria-hidden="true" />
          <a
            href={SITE.google.reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 n-link text-[0.85rem]"
          >
            <Google size={13} />
            {SITE.google.reviewCount} reseñas verificadas
          </a>
        </div>

        <div
          className="mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {visibleIdx.map((idx, pos) => (
              <div
                key={`${idx}-${current}`}
                style={{
                  animation: "n-lineReveal 0.6s var(--ease-out) both",
                  animationDelay: `${pos * 80}ms`,
                }}
              >
                <Card t={testimonios[idx]} />
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Testimonio anterior"
                className="w-10 h-10 flex items-center justify-center border border-[color:var(--rule)] text-[color:var(--color-gold-3)] hover:bg-[rgba(184,134,11,0.06)] transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={next}
                aria-label="Testimonio siguiente"
                className="w-10 h-10 flex items-center justify-center border border-[color:var(--rule)] text-[color:var(--color-gold-3)] hover:bg-[rgba(184,134,11,0.06)] transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="flex gap-1.5 items-center">
              {testimonios.slice(0, Math.min(total, 12)).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Ir a testimonio ${i + 1}`}
                  className="p-2"
                >
                  <span
                    className="block transition-all duration-300"
                    style={{
                      width: current === i ? 20 : 6,
                      height: 4,
                      background: current === i ? "var(--color-gold)" : "var(--rule)",
                      borderRadius: 999,
                    }}
                  />
                </button>
              ))}
              {total > 12 && (
                <span className="text-[0.68rem] text-[color:var(--color-ink-5)] ml-2">+{total - 12}</span>
              )}
            </div>

            <span className="text-[0.7rem] tabular-nums text-[color:var(--color-ink-5)] tracking-[0.14em]">
              {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
