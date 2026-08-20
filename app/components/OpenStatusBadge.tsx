"use client";

import { useEffect, useState } from "react";

interface Status { open: boolean; label: string; }

function compute(): Status {
  const now = new Date();
  const day = now.getDay(); // 0=Dom, 6=Sáb
  const t = now.getHours() * 60 + now.getMinutes();
  const am = { from: 9 * 60 + 30, to: 14 * 60 };
  const pm = { from: 17 * 60,     to: 20 * 60 };

  if (day === 0) return { open: false, label: "Cerrado · abre mañana" };
  if (day === 6) {
    if (t >= am.from && t < am.to) return { open: true, label: "Abierto hasta las 14:00" };
    return { open: false, label: "Cerrado · abre lunes" };
  }
  if (t >= am.from && t < am.to)  return { open: true, label: "Abierto hasta las 14:00" };
  if (t >= pm.from && t < pm.to)  return { open: true, label: "Abierto hasta las 20:00" };
  if (t < am.from)                return { open: false, label: "Abrimos a las 9:30" };
  if (t >= am.to && t < pm.from)  return { open: false, label: "Volvemos a las 17:00" };
  return { open: false, label: "Volvemos mañana" };
}

export default function OpenStatusBadge({ dark = false }: { dark?: boolean }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    setStatus(compute());
    const iv = setInterval(() => setStatus(compute()), 60_000);
    return () => clearInterval(iv);
  }, []);

  if (!status) return null;

  const openBase   = dark ? "rgba(46,125,50,0.14)" : "rgba(46,125,50,0.08)";
  const closedBase = dark ? "rgba(255,255,255,0.05)" : "rgba(184,134,11,0.05)";
  const openText   = dark ? "rgba(190,230,190,0.92)" : "#245227";
  const closedText = dark ? "rgba(250,246,238,0.78)"  : "var(--color-ink-4)";
  const border     = dark ? "rgba(255,255,255,0.12)"  : "var(--rule-soft)";

  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.62rem] tracking-[0.12em] uppercase font-medium"
      style={{
        background: status.open ? openBase : closedBase,
        color: status.open ? openText : closedText,
        border: `1px solid ${border}`,
        whiteSpace: "nowrap",
      }}
      aria-live="polite"
    >
      <span
        className={status.open ? "n-status-dot" : ""}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: status.open ? "#2E7D32" : "#94A3B8",
          display: "block",
        }}
      />
      {status.label}
    </span>
  );
}
