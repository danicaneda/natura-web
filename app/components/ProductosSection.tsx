"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { proxyImageUrl } from "@/app/lib/utils";
import { swr } from "@/app/lib/cache";
import { SITE } from "@/app/lib/site";
import SectionHeader from "./ui/SectionHeader";
import SeasonalBadge from "./SeasonalBadge";
import BotanicalMark from "./ui/BotanicalMark";
import { Search, Close, ArrowUpRight, WhatsAppIcon } from "./ui/Icons";
import { useReveal } from "@/app/lib/useReveal";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  descripcion?: string;
  precio?: number;
  precio_oferta?: number;
  disponible: boolean;
  destacado: boolean;
  imagen_url?: string;
  etiquetas: string[];
}

const CATEGORIAS = [
  { key: "todos",     label: "Todos" },
  { key: "flores",    label: "Flores" },
  { key: "plantas",   label: "Plantas" },
  { key: "ramos",     label: "Ramos" },
  { key: "macetas",   label: "Macetas" },
  { key: "accesorios",label: "Accesorios" },
];

function priceOf(p: Producto) {
  const hasOffer = p.precio_oferta && p.precio_oferta > 0 && p.precio_oferta < (p.precio ?? Infinity);
  return { hasOffer: !!hasOffer, price: hasOffer ? p.precio_oferta! : p.precio };
}

function formatPrice(n: number) {
  return `${n.toFixed(2).replace(".", ",")} €`;
}

function ProductCard({ p, onOpen, delay = 0 }: { p: Producto; onOpen: (p: Producto) => void; delay?: number }) {
  const { ref, visible } = useReveal<HTMLButtonElement>(0.12);
  const [failed, setFailed] = useState(false);
  const img = proxyImageUrl(p.imagen_url);
  const { hasOffer, price } = priceOf(p);

  return (
    <button
      ref={ref}
      onClick={() => onOpen(p)}
      className="group relative text-left overflow-hidden bg-[color:var(--color-cream-2)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] focus-visible:-translate-y-1 focus-visible:shadow-[var(--shadow-md)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
        aspectRatio: "4 / 5",
      }}
      aria-label={`Ver ${p.nombre}`}
    >
      {img && !failed ? (
        <Image
          src={img}
          alt={p.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <BotanicalMark size={36} color="var(--color-gold)" className="opacity-25" />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2" style={{ background: "linear-gradient(to top, rgba(15,10,5,0.92) 0%, rgba(15,10,5,0.55) 55%, transparent 100%)" }}>
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-serif text-lg text-[color:var(--color-cream)] leading-tight line-clamp-1">{p.nombre}</h3>
          {price != null && (
            <span className={`font-serif text-xl md:text-2xl font-medium leading-none tabular-nums ${hasOffer ? "text-[#F5A0A0]" : "text-[color:var(--color-gold-2)]"}`}>
              {formatPrice(price)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[0.6rem] tracking-[0.18em] uppercase text-[rgba(250,246,238,0.72)] font-medium">
            {p.categoria}
          </span>
          <span className="text-[0.6rem] tracking-[0.18em] uppercase inline-flex items-center gap-1 text-[color:var(--color-gold-2)] font-medium transition-transform duration-300 group-hover:translate-x-0.5">
            Ver detalle <ArrowUpRight size={10} />
          </span>
        </div>
      </div>

      {hasOffer && (
        <span className="absolute top-3 left-3 text-[0.6rem] tracking-[0.18em] uppercase px-2 py-1 bg-[color:var(--color-cream)] text-[color:var(--color-danger)]">
          Oferta
        </span>
      )}
      {p.destacado && !hasOffer && (
        <span className="absolute top-3 left-3 text-[0.6rem] tracking-[0.18em] uppercase px-2 py-1 bg-[color:var(--color-gold)] text-[color:var(--color-cream)]">
          Destacado
        </span>
      )}
    </button>
  );
}

function ProductModal({ p, onClose }: { p: Producto; onClose: () => void }) {
  const img = proxyImageUrl(p.imagen_url);
  const { hasOffer, price } = priceOf(p);
  const waText = `Hola, me interesa: ${p.nombre}${price ? ` (${formatPrice(price)})` : ""}. ¿Podéis darme más detalles?`;
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    triggerRef.current = document.activeElement;
    document.body.style.overflow = "hidden";
    // Fija el foco al botón cerrar tras el paint para que Tab cicle dentro del modal
    const focusT = setTimeout(() => closeBtnRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusT);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      // Devuelve el foco al elemento que lo abrió
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={p.nombre}
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: "rgba(15,10,5,0.72)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-[color:var(--color-cream)] w-full max-w-3xl max-h-[94vh] sm:max-h-[92vh] overflow-hidden flex flex-col md:flex-row shadow-[var(--shadow-lg)] rounded-t-2xl sm:rounded-none">
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center bg-[rgba(15,10,5,0.08)] rounded-full text-[color:var(--color-ink-2)] hover:bg-[rgba(15,10,5,0.16)] active:bg-[rgba(15,10,5,0.22)] transition-colors z-10 backdrop-blur-sm"
          aria-label={`Cerrar detalle de ${p.nombre}`}
        >
          <Close size={14} />
        </button>

        <div className="md:w-[52%] relative bg-[color:var(--color-cream-2)] aspect-[4/5] md:aspect-auto md:min-h-[440px] flex-none">
          {img ? (
            <Image src={img} alt={p.nombre} fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BotanicalMark size={48} color="var(--color-gold)" className="opacity-25" />
            </div>
          )}
        </div>

        <div className="md:w-[48%] flex flex-col min-h-0 flex-1">
          <div className="p-6 sm:p-7 md:p-8 overflow-y-auto flex flex-col gap-4 flex-1" style={{ overscrollBehavior: "contain" }}>
            <div className="flex gap-2 flex-wrap">
              {p.destacado && <span className="n-chip">Destacado</span>}
              {hasOffer && <span className="n-chip" style={{ color: "var(--color-danger)", borderColor: "rgba(139,42,42,0.25)", background: "rgba(139,42,42,0.05)" }}>Oferta</span>}
              <span className="n-chip">{p.categoria}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[color:var(--color-ink-2)] leading-tight">{p.nombre}</h3>

            <div className="flex items-baseline gap-3">
              {hasOffer && p.precio && (
                <span className="text-sm line-through text-[color:var(--color-ink-5)]">{formatPrice(p.precio)}</span>
              )}
              {price != null && (
                <span className="font-serif text-2xl text-[color:var(--color-gold)]">{formatPrice(price)}</span>
              )}
            </div>

            {p.descripcion && (
              <p className="n-body max-w-md">{p.descripcion}</p>
            )}

            {p.etiquetas?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {p.etiquetas.map((t) => (
                  <span key={t} className="n-chip" style={{ padding: "2px 8px", fontSize: "0.62rem" }}>{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Barra CTA sticky bottom — al alcance del pulgar en móvil */}
          <div
            className="flex-none border-t border-[color:var(--rule-soft)] bg-[color:var(--color-cream)] px-6 py-4 sm:px-7 sm:py-5 flex flex-col gap-2"
            style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
          >
            <a
              href={SITE.whatsapp.url(waText)}
              target="_blank"
              rel="noopener noreferrer"
              className="n-btn n-btn-whatsapp"
            >
              <WhatsAppIcon size={13} />
              Preguntar por WhatsApp
            </a>
            <button
              onClick={() => { onClose(); document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" }); }}
              className="n-btn n-btn-ghost"
            >
              Enviar por formulario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductosSection() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [slowWarning, setSlowWarning] = useState(false);
  const [cat, setCat] = useState("todos");
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [modal, setModal] = useState<Producto | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDq(q), 260);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const slow = setTimeout(() => setSlowWarning(true), 3200);
    swr<Producto[]>(
      "natura_productos",
      () => fetch("/api/productos").then((r) => r.json()),
      (data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProductos(data);
          setLoading(false);
          setSlowWarning(false);
          clearTimeout(slow);
        }
      },
      5 * 60 * 1000
    ).then((cached) => {
      if (Array.isArray(cached) && cached.length > 0) {
        setProductos(cached);
        setLoading(false);
        setSlowWarning(false);
        clearTimeout(slow);
      }
    });
    return () => clearTimeout(slow);
  }, []);

  const filtered = productos.filter((p) => {
    const matchCat = cat === "todos" || p.categoria === cat;
    const term = dq.toLowerCase().trim();
    const matchQ = !term ||
      p.nombre.toLowerCase().includes(term) ||
      (p.descripcion ?? "").toLowerCase().includes(term) ||
      p.categoria.toLowerCase().includes(term) ||
      p.etiquetas.some((e) => e.toLowerCase().includes(term));
    return matchCat && matchQ;
  });

  const countBy = (key: string) =>
    key === "todos" ? productos.length : productos.filter((p) => p.categoria === key).length;

  return (
    <section id="productos" className="bg-[color:var(--color-cream)]">
      <div className="n-container n-section-y">
        <SectionHeader
          eyebrow="Colección"
          title={<>Flores <em className="text-[color:var(--color-gold)]">&amp;</em> plantas</>}
          subtitle="Seleccionadas con mimo para que cada espacio y cada momento sean únicos."
        />

        <div className="mt-8 flex justify-center">
          <SeasonalBadge />
        </div>

        {!loading && productos.length > 0 && (
          <div className="mt-10 relative w-full max-w-md mx-auto">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[color:var(--color-ink-5)]" aria-hidden="true">
              <Search size={14} />
            </span>
            <input
              ref={searchRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar flores, plantas, ramos…"
              className="n-field pl-7"
              aria-label="Buscar productos"
            />
            {q && (
              <button
                onClick={() => { setQ(""); searchRef.current?.focus(); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[color:var(--color-ink-4)]"
                aria-label="Limpiar búsqueda"
              >
                <Close size={12} />
              </button>
            )}
          </div>
        )}

        {/* Filtros — scroll horizontal snap en móvil, wrap centrado en desktop */}
        <div className="mt-8 n-hscroll sm:!flex sm:!overflow-visible sm:!p-0 sm:!m-0 sm:flex-wrap sm:justify-center" role="tablist" aria-label="Filtrar productos por categoría">
          {CATEGORIAS.map((c) => {
            const count = countBy(c.key);
            if (count === 0 && c.key !== "todos") return null;
            const active = cat === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                role="tab"
                aria-selected={active}
                className={`px-4 py-2.5 text-[0.68rem] tracking-[0.18em] uppercase border transition-colors whitespace-nowrap ${
                  active
                    ? "bg-[color:var(--color-ink-2)] text-[color:var(--color-cream)] border-[color:var(--color-ink-2)]"
                    : "bg-[color:var(--color-cream)] text-[color:var(--color-ink-4)] border-[color:var(--rule)] hover:text-[color:var(--color-ink-2)] hover:border-[color:var(--color-gold)] active:bg-[rgba(184,134,11,0.06)]"
                }`}
              >
                {c.label}
                {count > 0 && (
                  <span className="ml-1.5 text-[0.58rem] opacity-60 tabular-nums">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Contenido */}
        <div className="mt-12">
          {loading ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="n-skeleton aspect-[4/5]" />
                ))}
              </div>
              {slowWarning && (
                <p className="mt-6 text-center text-[0.72rem] tracking-[0.18em] uppercase text-[color:var(--color-ink-5)]">
                  Cargando el catálogo… gracias por tu paciencia.
                </p>
              )}
            </>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-24 gap-5 text-center">
              <BotanicalMark size={36} color="var(--color-gold)" className="opacity-30" />
              <p className="text-sm tracking-[0.18em] uppercase text-[color:var(--color-ink-4)]">
                {productos.length === 0
                  ? "Colección disponible pronto"
                  : dq
                  ? `Sin resultados para "${dq}"`
                  : "Sin productos en esta categoría"}
              </p>
              {productos.length > 0 ? (
                <button onClick={() => { setCat("todos"); setQ(""); }} className="n-btn n-btn-ghost">
                  Ver todo
                </button>
              ) : (
                <a
                  href={SITE.whatsapp.url("Hola, me gustaría saber qué flores y plantas tenéis disponibles.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="n-btn n-btn-whatsapp"
                >
                  <WhatsAppIcon size={13} />
                  Consultar disponibilidad
                </a>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} p={p} onOpen={setModal} delay={Math.min(i, 8) * 50} />
              ))}
            </div>
          )}
        </div>
      </div>

      {modal && <ProductModal p={modal} onClose={() => setModal(null)} />}
    </section>
  );
}
