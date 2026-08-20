"use client";

import { useEffect, useRef, useState } from "react";
import BotanicalMark from "./ui/BotanicalMark";
import { ArrowRight } from "./ui/Icons";
import { useReveal } from "@/app/lib/useReveal";

const STATS = [
  { value: 15,   label: "Años cuidando cada flor",  suffix: "+" },
  { value: 120,  label: "Bodas y eventos",          suffix: "+" },
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
          {/* Left — composición editorial */}
          <div
            ref={left.ref}
            className={`n-reveal ${left.visible ? "is-visible" : ""} lg:col-span-5 relative`}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-cream-2)]">
              {/* SVG botánico grande */}
              <svg viewBox="0 0 400 500" fill="none" aria-hidden="true" className="absolute inset-0 w-full h-full opacity-[0.16]">
                <path d="M200 480 Q195 340 200 60" stroke="#6B4A0A" strokeWidth="3.5" strokeLinecap="round" />
                <ellipse cx="200" cy="280" rx="70" ry="130" transform="rotate(20 200 280)" fill="#6B4A0A" opacity="0.85" />
                <ellipse cx="200" cy="200" rx="58" ry="105" transform="rotate(-16 200 200)" fill="#6B4A0A" opacity="0.75" />
                <ellipse cx="200" cy="130" rx="42" ry="85" transform="rotate(8 200 130)" fill="#6B4A0A" opacity="0.65" />
                <path d="M200 240 Q262 210 300 190" stroke="#6B4A0A" strokeWidth="2" strokeLinecap="round" />
                <ellipse cx="290" cy="192" rx="34" ry="60" transform="rotate(-30 290 192)" fill="#6B4A0A" opacity="0.55" />
                <path d="M200 175 Q140 148 105 130" stroke="#6B4A0A" strokeWidth="2" strokeLinecap="round" />
                <ellipse cx="115" cy="132" rx="30" ry="55" transform="rotate(30 115 132)" fill="#6B4A0A" opacity="0.5" />
                <circle cx="200" cy="62" r="14" fill="#6B4A0A" opacity="0.5" />
              </svg>

              {/* Marco */}
              <div className="absolute inset-6 border border-[rgba(184,134,11,0.22)]" aria-hidden="true" />
              {/* Esquinas doradas */}
              {[
                { top: 12, left: 12,   corners: ["t","l"] },
                { top: 12, right: 12,  corners: ["t","r"] },
                { bottom: 12, left: 12, corners: ["b","l"] },
                { bottom: 12, right: 12,corners: ["b","r"] },
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
                };
                return <span key={i} aria-hidden="true" style={style} />;
              })}

              {/* Overlay tipográfico */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-serif text-[clamp(4rem,8vw,7rem)] leading-none text-[color:var(--color-ink-2)] opacity-[0.11]">Arte</span>
                <span className="font-serif italic text-[clamp(4rem,8vw,7rem)] leading-none text-[color:var(--color-gold-3)] opacity-[0.18]">floral</span>
              </div>

              {/* Cita */}
              <figure className="absolute bottom-10 inset-x-10 text-center">
                <div className="mx-auto w-8 h-px bg-[color:var(--color-gold)] mb-3" />
                <blockquote className="font-serif italic text-lg text-[color:var(--color-ink-3)] opacity-80 leading-snug">
                  &ldquo;Cada flor cuenta una historia&rdquo;
                </blockquote>
                <figcaption className="mt-2 text-[0.62rem] tracking-[0.3em] uppercase text-[color:var(--color-gold-3)] opacity-70">
                  Tere · Floristería Natura
                </figcaption>
              </figure>
            </div>
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
              Tere lleva más de quince años convirtiendo flores en emociones.
              Lo que empezó como vocación se ha convertido en el referente
              floral de Cantabria — cada ramo lleva su firma: hecho a mano,
              pensado para ti, con las flores más frescas de temporada.
            </p>

            <ul className="grid gap-3 max-w-lg">
              {[
                ["Frescura garantizada", "Flores de temporada, renovadas cada día."],
                ["Arreglos a medida",     "Cada composición es única, pensada para ti."],
                ["Entrega a domicilio",   "En Reinosa y comarcas, con el mismo mimo."],
                ["Pasión floral",         "Quince años dedicados al detalle."],
              ].map(([label, desc]) => (
                <li key={label} className="flex items-start gap-3 text-sm">
                  <BotanicalMark size={14} color="var(--color-gold)" className="mt-1 flex-none" />
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

        {/* Stats — franja limpia */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 border-y border-[color:var(--rule-soft)]">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center py-10 px-6"
              style={{
                borderRight: i < STATS.length - 1 ? "1px solid var(--rule-soft)" : "none",
              }}
            >
              <span className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-[color:var(--color-gold)] leading-none">
                <CountUp to={s.value} suffix={s.suffix} />
              </span>
              <span className="mt-3 text-[0.62rem] tracking-[0.22em] uppercase text-[color:var(--color-ink-4)]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
