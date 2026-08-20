"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./ui/Icons";
import { SITE } from "@/app/lib/site";

export default function WhatsAppFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={SITE.whatsapp.url("Hola, me gustaría hacer una consulta sobre vuestros productos.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed right-6 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all"
      style={{
        bottom: "var(--fab-b2)",
        background: "#128C7E",
        color: "#FFFFFF",
        boxShadow: "0 6px 24px rgba(18,140,126,0.35)",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.6)",
        transitionProperty: "opacity, transform, box-shadow, background-color",
        transitionDuration: "260ms",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      <WhatsAppIcon size={22} />
    </a>
  );
}
