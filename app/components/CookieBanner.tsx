"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "natura_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!stored) setVisible(true);
  }, []);

  const respond = (value: "accepted" | "rejected") => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed z-40 max-w-md md:max-w-lg rounded-md"
      style={{
        left: "16px",
        // En desktop pegado a la derecha (menos protagonista); móvil ocupa todo.
        right: "16px",
        bottom: "var(--cookie-b)",
        background: "var(--color-ink-2)",
        color: "var(--color-cream)",
        border: "1px solid rgba(212,160,23,0.16)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.28)",
      }}
    >
      <div className="px-4 py-3 md:px-5 flex flex-wrap items-center gap-3">
        <p className="text-[0.82rem] text-[color:rgba(250,246,238,0.85)] leading-snug flex-1 min-w-[180px]">
          Cookies técnicas necesarias.{" "}
          <a href="/politica-privacidad" className="text-[color:var(--color-gold-2)] underline underline-offset-2 hover:opacity-80">
            Info
          </a>
        </p>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => respond("rejected")}
            className="px-3 py-1.5 text-[0.62rem] tracking-[0.18em] uppercase font-medium text-[rgba(250,246,238,0.65)] hover:text-[color:var(--color-cream)] transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={() => respond("accepted")}
            className="px-4 py-1.5 text-[0.62rem] tracking-[0.18em] uppercase font-semibold text-[color:var(--color-ink-2)] rounded-sm transition-colors"
            style={{ background: "var(--color-gold-2)" }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
