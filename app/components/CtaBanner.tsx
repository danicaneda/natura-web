"use client";

import { useReveal } from "@/app/lib/useReveal";
import { ArrowRight, WhatsAppIcon } from "./ui/Icons";
import { SITE } from "@/app/lib/site";

export default function CtaBanner() {
  const { ref, visible } = useReveal(0.2);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[color:var(--color-ink-2)] text-[color:var(--color-cream)]"
    >
      {/* Wordmark decorativo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
      >
        <span
          className="font-serif whitespace-nowrap"
          style={{
            fontSize: "clamp(96px, 20vw, 240px)",
            color: "rgba(212,160,23,0.055)",
            letterSpacing: "0.16em",
            lineHeight: 1,
            fontWeight: 300,
            maxWidth: "100%",
          }}
        >
          NATURA
        </span>
      </span>

      {/* Ambiente radial dorado */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 50%, rgba(212,160,23,0.10), transparent 70%)",
        }}
      />

      {/* Bordes finos */}
      <span className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,160,23,0.35), transparent)" }} />
      <span className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,160,23,0.2), transparent)" }} />

      <div
        className={`relative n-container n-section-y flex flex-col items-center text-center gap-8 n-reveal ${visible ? "is-visible" : ""}`}
      >
        <span className="n-eyebrow" style={{ color: "var(--color-gold-2)" }}>
          Pedidos especiales
        </span>

        <h2 className="n-h1 text-[color:var(--color-cream)] max-w-3xl">
          ¿Tienes una ocasión{" "}
          <em className="text-[color:var(--color-gold-2)]">especial</em>?
          <br />
          <span className="text-[color:rgba(250,246,238,0.5)] text-[0.6em] font-light">
            Cuéntanos tu visión y la hacemos realidad.
          </span>
        </h2>

        <span className="n-rule" style={{ background: "var(--color-gold-2)", opacity: 0.4 }} />

        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-[color:rgba(250,246,238,0.5)]">
          {["Bodas & ceremonias", "Eventos corporativos", "Comuniones & bautizos", "Entrega a domicilio"].map((s) => (
            <li key={s} className="tracking-[0.06em]">{s}</li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 items-center mt-2">
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="n-btn n-btn-gold"
          >
            Solicitar presupuesto
            <ArrowRight size={14} />
          </a>
          <a
            href={SITE.whatsapp.url("Hola, me gustaría consultar sobre un evento especial.")}
            target="_blank"
            rel="noopener noreferrer"
            className="n-btn n-btn-ghost-dark"
          >
            <WhatsAppIcon size={13} />
            WhatsApp directo
          </a>
        </div>
      </div>
    </section>
  );
}
