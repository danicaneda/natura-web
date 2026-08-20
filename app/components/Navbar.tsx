"use client";

import { useEffect, useState } from "react";
import BotanicalMark from "./ui/BotanicalMark";
import OpenStatusBadge from "./OpenStatusBadge";
import { WhatsAppIcon } from "./ui/Icons";
import { SITE } from "@/app/lib/site";

const NAV_LINKS = [
  { id: "nosotros",   label: "Nosotros" },
  { id: "servicios",  label: "Servicios" },
  { id: "productos",  label: "Colección" },
  { id: "galeria",    label: "Galería" },
  { id: "contacto",   label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("inicio");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ["inicio", ...NAV_LINKS.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => e.isIntersecting && setActive(id),
        { rootMargin: "-45% 0px -50% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const solid = scrolled || menuOpen;
  const linkColor = solid ? "text-[color:var(--color-ink-3)]" : "text-[rgba(250,246,238,0.78)]";
  const activeColor = solid ? "text-[color:var(--color-gold-3)]" : "text-[color:var(--color-gold-2)]";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300`}
      style={{
        background: solid ? "rgba(250,246,238,0.92)" : "linear-gradient(to bottom, rgba(6,4,1,0.55), transparent)",
        borderBottom: solid ? "1px solid var(--rule-soft)" : "1px solid transparent",
        backdropFilter: solid ? "blur(14px) saturate(1.1)" : "none",
        WebkitBackdropFilter: solid ? "blur(14px) saturate(1.1)" : "none",
      }}
    >
      <nav className="n-container flex items-center justify-between" style={{ height: "var(--nav-h)" }} aria-label="Principal">
        {/* Brand */}
        <button
          onClick={() => scrollTo("inicio")}
          className="flex items-center gap-3 group"
          aria-label="Ir al inicio"
        >
          <span className={solid ? "text-[color:var(--color-gold-3)]" : "text-[color:var(--color-gold-2)]"}>
            <BotanicalMark size={20} />
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={`font-serif text-xl tracking-[0.32em] uppercase transition-colors ${solid ? "text-[color:var(--color-ink-2)]" : "text-[color:var(--color-cream)]"}`}
              style={{ fontWeight: 400 }}
            >
              Natura
            </span>
            <span
              className={`text-[0.55rem] tracking-[0.3em] uppercase mt-1 ${solid ? "text-[color:var(--color-ink-5)]" : "text-[rgba(250,246,238,0.55)]"}`}
            >
              Flores & Plantas
            </span>
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id}>
                <button
                  onClick={() => scrollTo(link.id)}
                  className={`relative px-4 py-2 text-[0.7rem] tracking-[0.18em] uppercase transition-colors ${isActive ? activeColor : linkColor} hover:!text-[color:var(--color-gold-2)]`}
                >
                  {link.label}
                  <span
                    className="absolute left-1/2 -translate-x-1/2 bottom-0 h-px bg-current transition-all duration-300"
                    style={{ width: isActive ? "18px" : "0px" }}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <OpenStatusBadge dark={!solid} />
          </div>

          <a
            href={SITE.whatsapp.url("Hola, me gustaría hacer una consulta.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex n-btn n-btn-gold"
            style={{ padding: "10px 20px", fontSize: "0.66rem" }}
          >
            <WhatsAppIcon size={13} />
            <span>Pedir por WhatsApp</span>
          </a>

          {/* Mobile phone quick action */}
          <a
            href={`tel:${SITE.phone.tel}`}
            className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors ${solid ? "bg-[color:var(--color-gold)] text-[color:var(--color-cream)]" : "bg-[rgba(250,246,238,0.14)] text-[color:var(--color-cream)] backdrop-blur"}`}
            aria-label={`Llamar a ${SITE.phone.display}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.13 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
            </svg>
          </a>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col items-center justify-center gap-1.5 w-10 h-10"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <span
              className="block w-5 h-px transition-transform duration-300"
              style={{
                background: solid ? "var(--color-ink-2)" : "var(--color-cream)",
                transform: menuOpen ? "translateY(4px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block w-5 h-px transition-opacity duration-300"
              style={{
                background: solid ? "var(--color-ink-2)" : "var(--color-cream)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-px transition-transform duration-300"
              style={{
                background: solid ? "var(--color-ink-2)" : "var(--color-cream)",
                transform: menuOpen ? "translateY(-4px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className="md:hidden overflow-hidden transition-all duration-500"
        style={{
          maxHeight: menuOpen ? "80vh" : "0px",
          background: "var(--color-cream)",
          borderTop: menuOpen ? "1px solid var(--rule-soft)" : "1px solid transparent",
        }}
      >
        <div className="n-container py-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-left py-3 px-3 text-sm tracking-[0.05em] transition-colors ${
                  isActive ? "text-[color:var(--color-gold-3)]" : "text-[color:var(--color-ink-3)]"
                }`}
                style={{ borderLeft: isActive ? "2px solid var(--color-gold)" : "2px solid transparent" }}
              >
                {link.label}
              </button>
            );
          })}
          <a
            href={SITE.whatsapp.url("Hola, me gustaría hacer una consulta.")}
            target="_blank"
            rel="noopener noreferrer"
            className="n-btn n-btn-gold mt-4"
          >
            <WhatsAppIcon size={13} />
            <span>Pedir por WhatsApp</span>
          </a>
          <a
            href={`tel:${SITE.phone.tel}`}
            className="n-btn n-btn-ghost mt-2"
          >
            Llamar · {SITE.phone.display}
          </a>
        </div>
      </div>
    </header>
  );
}
