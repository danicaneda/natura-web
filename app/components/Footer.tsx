"use client";

import BotanicalMark from "./ui/BotanicalMark";
import { Google, Instagram, Star } from "./ui/Icons";
import { SITE } from "@/app/lib/site";

const LINKS = [
  { id: "nosotros",  label: "Nosotros" },
  { id: "servicios", label: "Servicios" },
  { id: "productos", label: "Colección" },
  { id: "galeria",   label: "Galería" },
  { id: "contacto",  label: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-[color:var(--color-ink-2)] text-[color:var(--color-cream)]">
      <div className="n-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Marca */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <BotanicalMark size={20} color="var(--color-gold-2)" />
              <span className="font-serif text-2xl tracking-[0.32em] uppercase text-[color:var(--color-gold-2)]" style={{ fontWeight: 400 }}>
                Natura
              </span>
            </div>
            <p className="text-[color:rgba(250,246,238,0.72)] text-sm leading-relaxed max-w-sm">
              Arte floral con alma. Ramos, plantas y arreglos únicos desde
              Reinosa, Cantabria.
            </p>
            {SITE.social.instagram && (
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="mt-2 inline-flex items-center gap-2 w-9 h-9 justify-center text-[color:var(--color-gold-2)] border border-[rgba(212,160,23,0.25)] hover:border-[color:var(--color-gold-2)] transition-colors"
              >
                <Instagram size={15} />
              </a>
            )}
          </div>

          {/* Nav */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="n-mono text-[color:rgba(212,160,23,0.75)]">Páginas</span>
            <nav className="flex flex-col gap-2">
              {LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => document.getElementById(l.id)?.scrollIntoView({ behavior: "smooth" })}
                  className="text-left text-sm text-[color:rgba(250,246,238,0.78)] hover:text-[color:var(--color-gold-2)] transition-colors w-fit"
                >
                  {l.label}
                </button>
              ))}
              <a
                href="/politica-privacidad"
                className="text-sm text-[color:rgba(250,246,238,0.78)] hover:text-[color:var(--color-gold-2)] transition-colors w-fit"
              >
                Política de privacidad
              </a>
            </nav>
          </div>

          {/* Contacto */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="n-mono text-[color:rgba(212,160,23,0.75)]">Contacto</span>
            <address className="not-italic text-sm text-[color:rgba(250,246,238,0.78)] flex flex-col gap-1.5">
              <span>{SITE.address.street}</span>
              <span>{SITE.address.postalCode} {SITE.address.city}, {SITE.address.region}</span>
              <a href={`tel:${SITE.phone.tel}`} className="hover:text-[color:var(--color-gold-2)] transition-colors w-fit">
                {SITE.phone.display}
              </a>
              <a href={`tel:${SITE.phone.tel2}`} className="hover:text-[color:var(--color-gold-2)] transition-colors w-fit">
                {SITE.phone.display2}
              </a>
              <a href={`mailto:${SITE.email}`} className="hover:text-[color:var(--color-gold-2)] transition-colors w-fit">
                {SITE.email}
              </a>
            </address>
            <div className="mt-3 text-xs text-[color:rgba(250,246,238,0.78)] leading-relaxed">
              Lun–Vie: 9:30–14:00 · 17:00–20:00<br />
              Sáb: 9:30–14:00 · Dom: cerrado
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="mt-12 py-5 flex flex-wrap items-center justify-center gap-4 border-y border-[rgba(212,160,23,0.12)] text-sm">
          <span className="flex text-[color:var(--color-gold-2)] gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} />)}
          </span>
          <span className="text-[color:rgba(250,246,238,0.72)]">
            {SITE.google.rating.toFixed(1)} · {SITE.google.reviewCount} reseñas en Google
          </span>
          <a
            href={SITE.google.reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[color:var(--color-gold-2)] hover:opacity-80 transition-opacity"
          >
            <Google size={13} />
            Ver reseñas
          </a>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[color:rgba(250,246,238,0.78)]">
          <p>© {new Date().getFullYear()} Natura Flores & Plantas — Reinosa, Cantabria.</p>
          <p className="inline-flex items-center gap-1.5">
            Hecho con
            <BotanicalMark size={12} color="var(--color-gold-2)" />
            en Cantabria
          </p>
        </div>
      </div>
    </footer>
  );
}
