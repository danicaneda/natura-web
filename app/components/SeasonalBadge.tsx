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
    <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-[rgba(184,134,11,0.05)] border border-[color:var(--rule-soft)]">
      <span className="text-[0.58rem] tracking-[0.3em] uppercase text-[color:var(--color-gold)] font-medium">
        En temporada · {season.label}
      </span>
      <span className="w-px h-4 bg-[color:var(--rule)]" aria-hidden="true" />
      <span className="text-[0.78rem] text-[color:var(--color-ink-3)]">
        {season.flores.join(" · ")}
      </span>
    </div>
  );
}
