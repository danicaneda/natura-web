"use client";

import { useMemo } from "react";

const SEASONAL: Record<number, { flores: string[]; label: string }> = {
  1:  { flores: ["Tulipán", "Ranúnculo", "Mimosa"],                label: "Invierno" },
  2:  { flores: ["Tulipán", "Ranúnculo", "Anémona", "Mimosa"],     label: "San Valentín" },
  3:  { flores: ["Tulipán", "Narciso", "Jacinto", "Fresia"],       label: "Primavera" },
  4:  { flores: ["Tulipán", "Peonía", "Lilas", "Fresia"],          label: "Primavera" },
  5:  { flores: ["Peonía", "Lilas", "Fresia", "Ranúnculo"],        label: "Día de la Madre" },
  6:  { flores: ["Peonía", "Lavanda", "Rosa", "Lisianto"],         label: "Verano" },
  7:  { flores: ["Girasol", "Lavanda", "Rosa", "Lisianto"],        label: "Verano" },
  8:  { flores: ["Girasol", "Dalia", "Rosa", "Zinnia"],            label: "Verano" },
  9:  { flores: ["Dalia", "Crisantemo", "Rosa", "Anémona"],        label: "Otoño" },
  10: { flores: ["Crisantemo", "Dalia", "Genciana"],               label: "Todos los Santos" },
  11: { flores: ["Crisantemo", "Rosa", "Lisianto"],                label: "Otoño" },
  12: { flores: ["Poinsettia", "Narciso", "Rosa roja", "Acebo"],   label: "Navidad" },
};

export default function SeasonalBadge() {
  const mes = useMemo(() => new Date().getMonth() + 1, []);
  const season = SEASONAL[mes];
  if (!season) return null;

  return (
    <div
      className="inline-flex flex-wrap items-center gap-2.5 sm:gap-3.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full"
      style={{
        background: "color-mix(in srgb, var(--color-leaf) 8%, transparent)",
        border: "1px solid color-mix(in srgb, var(--color-leaf) 22%, transparent)",
      }}
    >
      <span
        className="inline-flex items-center gap-2 text-[0.6rem] tracking-[0.28em] uppercase font-semibold"
        style={{ color: "var(--color-leaf)" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 11c0-4 4-6 5-8-3-1-7 1-7 5 0 1 1 3 2 3z" fill="currentColor" opacity="0.85"/>
          <path d="M6 11V5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        En temporada · {season.label}
      </span>
      <span
        aria-hidden="true"
        className="hidden sm:inline-block w-px h-4"
        style={{ background: "color-mix(in srgb, var(--color-leaf) 30%, transparent)" }}
      />
      <span className="text-[0.78rem] text-[color:var(--color-ink-3)] font-medium">
        {season.flores.join(" · ")}
      </span>
    </div>
  );
}
