"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { proxyImageUrl } from "@/app/lib/utils";
import SectionHeader from "./ui/SectionHeader";
import BotanicalMark from "./ui/BotanicalMark";
import { useReveal } from "@/app/lib/useReveal";
import { SITE } from "@/app/lib/site";

interface EquipoItem {
  id: number;
  nombre: string;
  rol?: string;
  descripcion?: string;
  imagen_url?: string;
  orden: number;
  status: string;
}

function TeamCard({ item, delay = 0 }: { item: EquipoItem; delay?: number }) {
  const { ref, visible } = useReveal<HTMLElement>(0.15);
  const img = proxyImageUrl(item.imagen_url ?? undefined);

  return (
    <figure
      ref={ref as React.RefObject<HTMLElement>}
      className="group relative overflow-hidden bg-[color:var(--color-cream-2)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.7s var(--ease-out) ${delay}ms, transform 0.7s var(--ease-out) ${delay}ms`,
        aspectRatio: "3 / 4",
      }}
    >
      {img ? (
        <Image
          src={img}
          alt={`${item.nombre}${item.rol ? " — " + item.rol : ""}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <BotanicalMark size={28} color="var(--color-gold-3)" className="opacity-25" />
          <span className="text-[0.62rem] tracking-[0.2em] uppercase text-[color:var(--color-ink-5)]">
            {item.nombre}
          </span>
        </div>
      )}

      <figcaption
        className="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-0.5"
        style={{ background: "linear-gradient(to top, rgba(15,10,5,0.85) 0%, transparent 70%)" }}
      >
        <span className="font-serif text-lg text-[color:var(--color-cream)] leading-none">
          {item.nombre}
        </span>
        {item.rol && (
          <span className="text-[0.6rem] tracking-[0.22em] uppercase text-[color:var(--color-gold-2)]">
            {item.rol}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export default function EquipoSection() {
  const [items, setItems] = useState<EquipoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/equipo")
      .then((r) => r.json())
      .then((d: EquipoItem[]) => { setItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section id="equipo" className="bg-[color:var(--color-cream)]">
      <div className="n-container n-section-y">
        <SectionHeader
          eyebrow="Nuestro equipo"
          title={<>Las manos <em className="text-[color:var(--color-gold)]">detrás de cada ramo</em></>}
          subtitle="Una floristería familiar y cercana, para todos los momentos de tu vida."
        />

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="n-skeleton" style={{ aspectRatio: "3/4" }} />
              ))
            : items.map((it, i) => <TeamCard key={it.id} item={it} delay={i * 80} />)}
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 text-center">
          <p className="n-body">¿Quieres conocernos? Pásate por la tienda o escríbenos.</p>
          <a
            href={SITE.whatsapp.url("Hola, me gustaría conocer más sobre vuestro trabajo.")}
            target="_blank"
            rel="noopener noreferrer"
            className="n-link text-[0.72rem] tracking-[0.22em] uppercase"
          >
            Escribirnos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
