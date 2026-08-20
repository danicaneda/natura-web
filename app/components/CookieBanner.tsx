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
      className="fixed z-40 max-w-md rounded-md md:rounded-none md:max-w-none"
      style={{
        left: "16px",
        right: "16px",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
        background: "var(--color-ink-2)",
        color: "var(--color-cream)",
        border: "1px solid rgba(212,160,23,0.16)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
      }}
    >
      <div className="px-5 py-4 md:px-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <p className="text-sm text-[color:rgba(250,246,238,0.75)] leading-relaxed">
          Usamos cookies propias necesarias para el funcionamiento del sitio.{" "}
          <a href="/politica-privacidad" className="text-[color:var(--color-gold-2)] underline underline-offset-2">
            Más información
          </a>
          .
        </p>
        <div className="flex gap-2 md:ml-auto">
          <button
            onClick={() => respond("rejected")}
            className="n-btn"
            style={{
              padding: "8px 16px",
              fontSize: "0.62rem",
              background: "transparent",
              color: "rgba(250,246,238,0.65)",
              borderColor: "rgba(250,246,238,0.15)",
            }}
          >
            Rechazar
          </button>
          <button
            onClick={() => respond("accepted")}
            className="n-btn n-btn-gold"
            style={{ padding: "8px 16px", fontSize: "0.62rem" }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
