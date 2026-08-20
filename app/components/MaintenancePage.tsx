"use client";

import BotanicalMark from "./ui/BotanicalMark";
import { SITE } from "@/app/lib/site";

interface Props {
  title: string;
  message: string;
}

export default function MaintenancePage({ title, message }: Props) {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, #1A1408 0%, #0A0704 70%)" }}
    >
      <div className="text-center max-w-lg flex flex-col items-center gap-6">
        <BotanicalMark size={40} color="var(--color-gold-2)" />
        <span className="n-eyebrow text-[color:var(--color-gold-2)]">Mantenimiento</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[color:var(--color-cream)]">{title}</h1>
        <p className="text-[color:rgba(250,246,238,0.65)] leading-relaxed">{message}</p>
        <a
          href={SITE.whatsapp.url("Hola, ¿podéis atender un pedido mientras la web está en mantenimiento?")}
          target="_blank"
          rel="noopener noreferrer"
          className="n-btn n-btn-gold mt-2"
        >
          Escríbenos mientras tanto
        </a>
      </div>
    </main>
  );
}
