"use client";

import { useReveal } from "@/app/lib/useReveal";

/**
 * Trust bar: por qué Natura vs. floristería online genérica.
 * Sustituye al antiguo CtaBanner (que era otro "Solicitar presupuesto"
 * más — duplicaba lo que ya hay en Servicios y Contacto).
 */

const FEATURES: { title: string; desc: string; icon: React.ReactNode }[] = [
  {
    title: "Flores frescas del día",
    desc: "Renovamos el género cada mañana. Nunca ramo pasado.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21V13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M12 13c-3 0-5-2-5-5 0-2 2-4 5-4s5 2 5 4c0 3-2 5-5 5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M12 13c2 1 4 3 4 6M12 13c-2 1-4 3-4 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Foto previa por WhatsApp",
    desc: "Antes de entregar te mandamos foto para que veas cómo queda.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 6l1.5-2h5L16 6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Entrega el mismo día",
    desc: "En Reinosa. Pide antes de las 12h y llega esa misma tarde.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 7h11v9H3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M14 10h5l2 3v3h-7" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    title: "Pago fácil",
    desc: "Bizum, efectivo o tarjeta. Sin recargos, sin sorpresas.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M3 10h18M7 15h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function CtaBanner() {
  const { ref, visible } = useReveal(0.2);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[color:var(--color-ink-2)] text-[color:var(--color-cream)]"
    >
      {/* Ambiente radial dorado sutil */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 50%, rgba(212,160,23,0.09), transparent 70%)",
        }}
      />

      {/* Bordes finos */}
      <span className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,160,23,0.35), transparent)" }} />
      <span className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,160,23,0.2), transparent)" }} />

      <div
        className={`relative n-container py-16 md:py-20 n-reveal ${visible ? "is-visible" : ""}`}
      >
        <div className="flex flex-col items-center text-center gap-3 mb-10 md:mb-14">
          <span className="n-eyebrow" style={{ color: "var(--color-gold-2)" }}>
            Cómo trabajamos
          </span>
          <h2 className="font-serif text-[clamp(1.75rem,3.5vw,2.6rem)] leading-tight text-[color:var(--color-cream)] max-w-2xl">
            Cuatro razones por las que
            {" "}
            <em className="text-[color:var(--color-gold-2)]">nos eligen</em>
          </h2>
        </div>

        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 md:gap-x-6">
          {FEATURES.map((f, i) => (
            <li
              key={f.title}
              className="flex flex-col items-center text-center px-2 sm:px-4 relative"
              style={{
                // separadores verticales en desktop
                borderLeft: i > 0 ? "1px solid rgba(212,160,23,0.14)" : "none",
              }}
            >
              <span
                className="mb-3 sm:mb-4 flex items-center justify-center w-11 h-11 rounded-full text-[color:var(--color-gold-2)]"
                style={{ background: "rgba(212,160,23,0.09)", border: "1px solid rgba(212,160,23,0.2)" }}
              >
                {f.icon}
              </span>
              <h3 className="font-serif text-base sm:text-lg text-[color:var(--color-cream)] leading-tight mb-1.5">
                {f.title}
              </h3>
              <p className="text-[0.78rem] sm:text-[0.82rem] leading-relaxed text-[color:rgba(250,246,238,0.72)] max-w-[240px]">
                {f.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
