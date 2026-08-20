"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./ui/Icons";
import { SITE } from "@/app/lib/site";

const ITEMS = [
  {
    id: "inicio",
    label: "Inicio",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "productos",
    label: "Flores",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22V12" />
        <path d="M12 17c-2-1-4-3-4-6a4 4 0 018 0c0 3-2 5-4 6z" />
        <path d="M12 12c1-2 3-4 6-3.5" />
        <path d="M12 12c-1-2-3-4-6-3.5" />
      </svg>
    ),
  },
  {
    id: "galeria",
    label: "Galería",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "contacto",
    label: "Contacto",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
];

export default function MobileNav() {
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => e.isIntersecting && setActive(item.id),
        { rootMargin: "-45% 0px -50% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className="md:hidden fixed inset-x-0 bottom-0 z-40"
      style={{
        background: "rgba(250,246,238,0.94)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop: "1px solid var(--rule-soft)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        boxShadow: "0 -6px 20px rgba(15,10,5,0.05)",
      }}
      aria-label="Navegación móvil"
    >
      <div className="flex" style={{ height: "var(--mobile-nav-h)" }}>
        {ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative ${
                isActive ? "text-[color:var(--color-gold-3)]" : "text-[color:var(--color-ink-4)] active:text-[color:var(--color-gold-3)]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-[color:var(--color-gold)]"
                />
              )}
              <span
                className="flex items-center justify-center transition-transform duration-300"
                style={{ transform: isActive ? "translateY(-1px)" : "none" }}
              >
                {item.svg}
              </span>
              <span className="text-[0.55rem] tracking-[0.12em] uppercase font-medium">{item.label}</span>
            </button>
          );
        })}

        <a
          href={SITE.whatsapp.url("Hola, me gustaría hacer un pedido.")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center gap-1 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(180deg, #14A896, #128C7E)" }}
          aria-label="Escribir por WhatsApp"
        >
          <WhatsAppIcon size={20} />
          <span className="text-[0.55rem] tracking-[0.12em] uppercase font-semibold">Pedir</span>
        </a>
      </div>
    </nav>
  );
}
