"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "./ui/Icons";
import { useReveal } from "@/app/lib/useReveal";

const STATS = [
  { value: 30,   label: "Años cuidando cada flor",  suffix: "+" },
  { value: 300,  label: "Bodas y eventos",          suffix: "+" },
  { value: 5.0,  label: "Valoración en Google",     suffix: "" },
  { value: 100,  label: "Recomendaciones reales",   suffix: "%" },
];

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isDecimal = !Number.isInteger(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const dur = 1600;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(ease * to);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString("es-ES")}
      {suffix}
    </span>
  );
}

export default function NosotrosSection() {
  const left = useReveal(0.1);
  const right = useReveal(0.1);

  return (
    <section id="nosotros" className="bg-[color:var(--color-cream)]">
      <div className="n-container n-section-y">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left — retrato editorial de Tere */}
          <div
            ref={left.ref}
            className={`n-reveal ${left.visible ? "is-visible" : ""} lg:col-span-5 relative`}
          >
            <figure className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-cream-2)]">
              {/* Foto */}
              <Image
                src="/tere.jpeg"
                alt="Tere, fundadora de Floristería Natura en Reinosa, sonriendo entre flores"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                style={{ objectPosition: "center 20%" }}
                quality={88}
              />

              {/* Sombreado inferior para asentar la cita */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(15,10,5,0.72) 0%, rgba(15,10,5,0.28) 45%, transparent 100%)",
                }}
              />

              {/* Marco fino interior */}
              <div
                className="absolute inset-4 sm:inset-6 border border-[rgba(245,230,192,0.28)] pointer-events-none"
                aria-hidden="true"
              />
              {/* Esquinas doradas */}
              {[
                { top: 10, left: 10,   corners: ["t","l"] },
                { top: 10, right: 10,  corners: ["t","r"] },
                { bottom: 10, left: 10, corners: ["b","l"] },
                { bottom: 10, right: 10,corners: ["b","r"] },
              ].map((pos, i) => {
                const style: React.CSSProperties = {
                  position: "absolute",
                  width: 14,
                  height: 14,
                  borderColor: "var(--color-gold-2)",
                  borderStyle: "solid",
                  borderTopWidth: pos.corners.includes("t") ? 1 : 0,
                  borderBottomWidth: pos.corners.includes("b") ? 1 : 0,
                  borderLeftWidth: pos.corners.includes("l") ? 1 : 0,
                  borderRightWidth: pos.corners.includes("r") ? 1 : 0,
                  top: pos.top,
                  left: pos.left,
                  right: pos.right,
                  bottom: pos.bottom,
                  pointerEvents: "none",
                };
                return <span key={i} aria-hidden="true" style={style} />;
              })}

              {/* Chip identificativo esquina superior */}
              <span
                className="absolute top-6 left-6 sm:top-8 sm:left-8 inline-flex items-center gap-2 px-3 py-1.5 text-[0.58rem] tracking-[0.24em] uppercase font-medium text-[color:var(--color-cream)] rounded-full backdrop-blur-sm"
                style={{ background: "rgba(15,10,5,0.35)", border: "1px solid rgba(245,230,192,0.2)" }}
              >
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--color-gold-2)" }}
                />
                Tere · Fundadora
              </span>

              {/* Cita — diferenciador emocional sobre el sombreado */}
              <figcaption className="absolute bottom-8 sm:bottom-10 inset-x-6 sm:inset-x-10">
                <div className="w-10 h-px bg-[color:var(--color-gold-2)] mb-3 opacity-90" />
                <blockquote
                  className="font-serif italic text-[clamp(1rem,3vw,1.25rem)] text-[color:var(--color-cream)] leading-snug"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
                >
                  &ldquo;Cada flor cuenta una historia.&rdquo;
                </blockquote>
                <p className="mt-3 text-[0.6rem] sm:text-[0.62rem] tracking-[0.28em] uppercase text-[rgba(245,230,192,0.75)] font-medium">
                  Floristería Natura · desde 1995
                </p>
              </figcaption>
            </figure>
          </div>

          {/* Right — texto */}
          <div
            ref={right.ref}
            className={`n-reveal ${right.visible ? "is-visible" : ""} lg:col-span-7 flex flex-col gap-8`}
          >
            <span className="n-eyebrow">Sobre nosotros</span>

            <h2 className="n-h1 max-w-xl">
              Arte floral con alma,<br />
              <em className="text-[color:var(--color-gold)]">desde Reinosa</em>
            </h2>

            <p className="n-lead max-w-lg">
              Tere lleva más de treinta años convirtiendo flores en emociones.
              Lo que empezó en 1995 como vocación se ha convertido en el
              referente floral de Cantabria — cada ramo lleva su firma: hecho
              a mano, pensado para ti, con las flores más frescas de temporada.
            </p>

            <ul className="grid gap-3 max-w-lg">
              {[
                ["Frescura garantizada", "Flores de temporada, renovadas cada día."],
                ["Arreglos a medida",     "Cada composición es única, pensada para ti."],
                ["Entrega a domicilio",   "En Reinosa y comarcas, con el mismo mimo."],
                ["Pasión floral",         "Tres décadas dedicadas al detalle."],
              ].map(([label, desc], i) => (
                <li key={label} className="flex items-start gap-3 text-sm">
                  <span
                    className="mt-0.5 flex-none w-6 tabular-nums text-[0.62rem] tracking-[0.24em] font-medium text-[color:var(--color-gold-3)]"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="text-[color:var(--color-ink-2)] font-medium">{label}</span>
                    <span className="text-[color:var(--color-ink-4)]"> — {desc}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-2">
              <a
                href="#contacto"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="n-btn n-btn-primary"
              >
                Hablar con Tere
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Stats — franja limpia. Los borders los pinta la clase .n-stat (2 col móvil / 4 col desktop) */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 border-y border-[color:var(--rule-soft)]">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="n-stat flex flex-col items-center text-center py-8 md:py-10 px-4 md:px-6"
            >
              <span className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-light text-[color:var(--color-gold)] leading-none">
                <CountUp to={s.value} suffix={s.suffix} />
              </span>
              <span className="mt-3 text-[0.58rem] md:text-[0.62rem] tracking-[0.2em] md:tracking-[0.22em] uppercase text-[color:var(--color-ink-4)] leading-snug">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
