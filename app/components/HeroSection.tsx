"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, WhatsAppIcon, Star } from "./ui/Icons";
import { SITE } from "@/app/lib/site";

const ROTATING = ["inolvidables", "íntimos", "únicos", "especiales"];

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const iv = setInterval(() => setWordIdx((i) => (i + 1) % ROTATING.length), 3200);
    return () => clearInterval(iv);
  }, [loaded]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col justify-end"
      style={{ background: "#0A0704" }}
    >
      {/* Fondo */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpeg"
          alt=""
          fill
          priority
          quality={88}
          sizes="100vw"
          className="n-ken-burns object-cover"
          style={{ objectPosition: "center 30%", filter: "brightness(0.62) saturate(0.92)" }}
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(6,4,1,0.55) 0%, rgba(6,4,1,0.05) 30%, rgba(6,4,1,0.15) 55%, rgba(6,4,1,0.85) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(6,4,1,0.55) 100%)" }} />

      {/* Contenido */}
      <div className="relative z-10 n-container pt-[calc(var(--nav-h)+40px)] pb-32 md:pb-40 flex flex-col items-start">
        {/* Eyebrow */}
        <div
          className="flex items-center gap-3 mb-8 transition-opacity duration-700"
          style={{ opacity: loaded ? 1 : 0 }}
        >
          <span className="block w-8 h-px bg-[color:var(--color-gold-2)] opacity-70" />
          <span className="text-[0.62rem] tracking-[0.34em] uppercase font-medium text-[rgba(245,230,192,0.7)]">
            Floristería · {SITE.city} · {SITE.region}
          </span>
        </div>

        {/* Title */}
        <h1 className="n-h-display max-w-4xl text-[color:var(--color-cream)]">
          {loaded ? (
            <>
              <span className="n-line-mask">
                <span className="n-line-inner n-delay-1">Flores para</span>
              </span>
              <span className="n-line-mask">
                <span className="n-line-inner n-delay-2 italic text-[color:var(--color-gold-2)]" style={{ fontVariantLigatures: "common-ligatures" }}>
                  momentos{" "}
                  <span
                    key={wordIdx}
                    className="inline-block"
                    style={{ animation: "n-lineReveal 0.65s var(--ease-out) both" }}
                  >
                    {ROTATING[wordIdx]}
                  </span>
                </span>
              </span>
            </>
          ) : (
            <span className="opacity-0 block" style={{ minHeight: "clamp(6rem, 16vw, 13rem)" }}>
              Flores para momentos únicos
            </span>
          )}
        </h1>

        {/* Subtitle */}
        <p
          className="mt-8 max-w-xl text-[rgba(250,246,238,0.72)] text-base md:text-lg font-light leading-relaxed transition-opacity duration-700"
          style={{ opacity: loaded ? 1 : 0, transitionDelay: "500ms" }}
        >
          Ramos, plantas y arte floral con firma propia.
          Más de quince años cuidando cada flor en {SITE.city}.
        </p>

        {/* CTAs */}
        <div
          className="mt-10 flex flex-wrap items-center gap-3 transition-all duration-700"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(12px)",
            transitionDelay: "650ms",
          }}
        >
          <button
            onClick={() => scrollTo("productos")}
            className="n-btn n-btn-gold"
          >
            Ver colección
            <ArrowRight size={14} />
          </button>
          <a
            href={SITE.whatsapp.url("Hola, me gustaría hacer un pedido.")}
            target="_blank"
            rel="noopener noreferrer"
            className="n-btn n-btn-ghost-dark"
          >
            <WhatsAppIcon size={13} />
            Pedir por WhatsApp
          </a>
        </div>

        {/* Prueba social */}
        <div
          className="mt-12 flex items-center gap-3 text-[rgba(245,230,192,0.55)] transition-opacity duration-700"
          style={{ opacity: loaded ? 1 : 0, transitionDelay: "800ms" }}
        >
          <span className="flex text-[color:var(--color-gold-2)] gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} />
            ))}
          </span>
          <span className="text-[0.7rem] tracking-[0.14em]">
            {SITE.google.rating.toFixed(1)} · {SITE.google.reviewCount} reseñas en Google
          </span>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        onClick={() => scrollTo("nosotros")}
        className="absolute left-1/2 -translate-x-1/2 bottom-6 flex flex-col items-center gap-2 text-[rgba(245,230,192,0.45)] hover:text-[color:var(--color-gold-2)] transition-colors"
        aria-label="Descubrir"
      >
        <span className="text-[0.6rem] tracking-[0.32em] uppercase">Descubrir</span>
        <span
          aria-hidden="true"
          className="block w-px h-8"
          style={{ background: "linear-gradient(to bottom, transparent, currentColor, transparent)" }}
        />
      </button>
    </section>
  );
}
