"use client";

import SectionHeader from "./ui/SectionHeader";
import { ArrowUpRight } from "./ui/Icons";
import { useReveal } from "@/app/lib/useReveal";
import { SITE } from "@/app/lib/site";

const SERVICES = [
  {
    id: "bodas",
    kicker: "01",
    title: "Bodas & ceremonias",
    desc: "Ramos de novia, arcos florales, centros de mesa y decoración completa. Cada boda merece flores que cuenten su historia.",
    msg: "Hola, me gustaría información para una boda.",
  },
  {
    id: "eventos",
    kicker: "02",
    title: "Eventos corporativos",
    desc: "Decoración floral para inauguraciones, aniversarios y celebraciones. Presencia elegante para tu marca o tu evento.",
    msg: "Hola, me gustaría información para un evento.",
  },
  {
    id: "comuniones",
    kicker: "03",
    title: "Comuniones & bautizos",
    desc: "Ramos, coronas, lazos y detalles florales para los momentos más especiales de la infancia. Delicados y con sentido.",
    msg: "Hola, me gustaría información para una comunión.",
  },
  {
    id: "entrega",
    kicker: "04",
    title: "Entrega a domicilio",
    desc: "Entregamos en Reinosa y comarcas el mismo día. Sorprende a quien más quieres con naturaleza en su puerta.",
    msg: "Hola, me gustaría hacer un pedido con entrega a domicilio.",
  },
];

export default function ServiciosSection() {
  const grid = useReveal(0.08);

  return (
    <section id="servicios" className="bg-[color:var(--color-ink)] text-[color:var(--color-cream)] relative overflow-hidden">
      {/* SVG botánico */}
      <svg
        viewBox="0 0 500 600"
        fill="none"
        aria-hidden="true"
        className="absolute -right-16 top-1/2 -translate-y-1/2 w-[480px] h-[576px] opacity-[0.04] pointer-events-none"
      >
        <path d="M250 580 Q245 420 250 60" stroke="#D4A017" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="250" cy="340" rx="80" ry="145" transform="rotate(20 250 340)" fill="#D4A017" opacity="0.9" />
        <ellipse cx="250" cy="255" rx="65" ry="115" transform="rotate(-18 250 255)" fill="#D4A017" opacity="0.85" />
        <ellipse cx="250" cy="175" rx="45" ry="88" transform="rotate(8 250 175)" fill="#D4A017" opacity="0.7" />
      </svg>

      <div className="n-container n-section-y relative">
        <div className="max-w-2xl">
          <SectionHeader
            eyebrow="Servicios"
            title={<>Arte floral para <em className="text-[color:var(--color-gold-2)]">cada ocasión</em></>}
            subtitle="Desde una boda íntima hasta la entrega más sencilla, ponemos el mismo cuidado en cada flor."
            align="left"
          />
        </div>

        <div
          ref={grid.ref}
          className={`n-reveal ${grid.visible ? "is-visible" : ""} mt-16 grid md:grid-cols-2 border border-[rgba(212,160,23,0.14)]`}
        >
          {SERVICES.map((s, i) => (
            <a
              key={s.id}
              href={SITE.whatsapp.url(s.msg)}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-10 md:p-12 flex flex-col gap-6 min-h-[280px] transition-all duration-500 focus-visible:z-10"
              style={{
                background: "#12100A",
                borderBottom: i < 2 ? "1px solid rgba(212,160,23,0.14)" : "none",
                borderRight: i % 2 === 0 ? "1px solid rgba(212,160,23,0.14)" : "none",
              }}
            >
              {/* Overlay al hover — más rico */}
              <span
                aria-hidden="true"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(135deg, rgba(212,160,23,0.10), transparent 60%)" }}
              />
              {/* Línea dorada superior al hover */}
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                style={{ background: "linear-gradient(to right, var(--color-gold-2), transparent)" }}
              />

              <span className="relative text-[0.62rem] tracking-[0.35em] uppercase text-[color:var(--color-gold-2)] opacity-80 font-medium">
                {s.kicker} — Servicio
              </span>

              <h3 className="relative n-h3 text-[color:var(--color-cream)] transition-colors duration-300 group-hover:text-[color:var(--color-gold-2)]">
                {s.title}
              </h3>

              <p className="relative text-[color:rgba(250,246,238,0.72)] text-[0.9rem] leading-relaxed flex-1">
                {s.desc}
              </p>

              <span className="relative inline-flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase text-[color:var(--color-gold-2)] font-medium">
                Consultar disponibilidad
                <ArrowUpRight size={11} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
