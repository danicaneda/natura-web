"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./ui/Icons";
import { SITE } from "@/app/lib/site";

export default function WhatsAppFab() {
  const [visible, setVisible] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    // Pulse muy sutil cada 18s, dura 2.4s (una iteración de la animación).
    // Respeta prefers-reduced-motion vía la clase que respeta el CSS global.
    const start = () => {
      setPulsing(true);
      setTimeout(() => setPulsing(false), 2400);
    };
    const first = setTimeout(start, 6000);
    const iv = setInterval(start, 18000);
    return () => { clearTimeout(first); clearInterval(iv); };
  }, [visible]);

  return (
    <a
      href={SITE.whatsapp.url("Hola, me gustaría hacer una consulta sobre vuestros productos.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={`fixed right-6 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${pulsing ? "n-wa-pulse" : ""}`}
      style={{
        bottom: "var(--fab-b2)",
        background: "linear-gradient(180deg, #16A092 0%, #128C7E 100%)",
        color: "#FFFFFF",
        boxShadow: "0 6px 24px rgba(18,140,126,0.4)",
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
