"use client";

import { useReveal } from "@/app/lib/useReveal";

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
  className = "",
}: Props) {
  const { ref, visible } = useReveal(0.2);
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div
      ref={ref}
      className={`n-reveal ${visible ? "is-visible" : ""} flex flex-col gap-6 ${alignClass} ${className}`}
    >
      {eyebrow && <span className="n-eyebrow">{eyebrow}</span>}
      <Tag className={Tag === "h1" ? "n-h-display" : "n-h2"}>{title}</Tag>
      {subtitle && (
        <p className={`n-lead max-w-xl ${align === "center" ? "text-balance" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
