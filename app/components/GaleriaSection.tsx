"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { proxyImageUrl } from "@/app/lib/utils";
import { swr } from "@/app/lib/cache";
import SectionHeader from "./ui/SectionHeader";
import BotanicalMark from "./ui/BotanicalMark";
import { Close, ChevronLeft, ChevronRight } from "./ui/Icons";

interface Img { id: number; titulo?: string; imagen_url: string; categoria?: string; }

function BotanicalFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--color-cream-2)]">
      <BotanicalMark size={28} color="var(--color-gold)" className="opacity-25" />
    </div>
  );
}

function Gimg({ src, alt, priority, sizes }: { src: string; alt: string; priority?: boolean; sizes: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <BotanicalFallback />;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
      onError={() => setFailed(true)}
    />
  );
}

export default function GaleriaSection() {
  const [images, setImages] = useState<Img[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const lbTouchStartX = useRef<number | null>(null);

  useEffect(() => {
    swr<Img[]>(
      "natura_gallery",
      () => fetch("/api/gallery").then((r) => r.json()),
      (d) => { if (Array.isArray(d)) { setImages(d); setLoading(false); } },
      5 * 60 * 1000
    ).then((c) => { if (Array.isArray(c)) { setImages(c); setLoading(false); } });
  }, []);

  const closeLB = useCallback(() => setLightbox(null), []);
  const nextLB = useCallback(() => setLightbox((i) => (i === null ? null : (i + 1) % images.length)), [images.length]);
  const prevLB = useCallback(() => setLightbox((i) => (i === null ? null : (i - 1 + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowRight") nextLB();
      if (e.key === "ArrowLeft") prevLB();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLB, nextLB, prevLB]);

  useEffect(() => {
    const active = lightbox !== null || showAll;
    document.body.style.overflow = active ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox, showAll]);

  // Masonry-ish grid — first big, rest smaller
  const display = images.slice(0, 8);

  return (
    <section id="galeria" className="bg-[color:var(--color-cream-2)]">
      <div className="n-container n-section-y">
        <SectionHeader
          eyebrow="Galería"
          title={<>Nuestra <em className="text-[color:var(--color-gold)]">inspiración</em></>}
          subtitle="Cada imagen cuenta una historia de belleza natural."
        />

        <div className="mt-14">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="n-skeleton" style={{ height: i === 0 ? "440px" : "220px", gridColumn: i === 0 ? "span 2" : undefined }} />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center py-24 gap-4">
              <BotanicalMark size={32} color="var(--color-gold)" className="opacity-25" />
              <p className="text-sm tracking-[0.2em] uppercase text-[color:var(--color-ink-4)]">
                Próximamente nuestra galería
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {display.map((img, i) => {
                  const isHero = i === 0;
                  return (
                    <button
                      key={img.id}
                      onClick={() => setLightbox(i)}
                      className={`group relative overflow-hidden bg-[color:var(--color-cream-3)] ${isHero ? "col-span-2 row-span-2 aspect-[4/5] md:aspect-[6/7]" : "aspect-square"}`}
                      aria-label={img.titulo || `Imagen ${i + 1}`}
                    >
                      <Gimg
                        src={proxyImageUrl(img.imagen_url) ?? ""}
                        alt={img.titulo || "Composición floral de Natura"}
                        priority={isHero}
                        sizes={isHero ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                      />
                      {img.titulo && (
                        <span className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "linear-gradient(to top, rgba(15,10,5,0.75), transparent)" }}>
                          <span className="text-sm text-[color:var(--color-cream)] font-serif">{img.titulo}</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {images.length > display.length && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setShowAll(true)}
                    className="n-btn n-btn-ghost"
                  >
                    Ver todas ({images.length})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal: todas */}
      {showAll && (
        <div className="fixed inset-0 z-[70] overflow-y-auto" style={{ background: "rgba(10,7,4,0.97)" }}>
          <div className="n-container py-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[0.65rem] tracking-[0.28em] uppercase text-[color:var(--color-gold-2)] opacity-70 mb-1">
                  Galería completa
                </p>
                <h3 className="font-serif text-3xl text-[color:var(--color-cream)]">
                  {images.length} imágenes
                </h3>
              </div>
              <button
                onClick={() => setShowAll(false)}
                className="w-10 h-10 flex items-center justify-center border border-[rgba(245,230,192,0.15)] text-[color:var(--color-cream)] hover:border-[color:var(--color-gold-2)] transition-colors"
                aria-label="Cerrar galería"
              >
                <Close size={14} />
              </button>
            </div>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => { setLightbox(i); setShowAll(false); }}
                  className="group block w-full break-inside-avoid overflow-hidden relative"
                >
                  <Image
                    src={proxyImageUrl(img.imagen_url) ?? ""}
                    alt={img.titulo || "Composición floral"}
                    width={400}
                    height={500}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          style={{ background: "rgba(10,7,4,0.98)" }}
          onClick={closeLB}
          onTouchStart={(e) => (lbTouchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (lbTouchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - lbTouchStartX.current;
            if (Math.abs(dx) > 50) (dx < 0 ? nextLB : prevLB)();
            lbTouchStartX.current = null;
          }}
        >
          <button
            onClick={closeLB}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center border border-[rgba(245,230,192,0.15)] text-[color:var(--color-cream)] hover:border-[color:var(--color-gold-2)] transition-colors"
            aria-label="Cerrar"
          >
            <Close size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevLB(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-[rgba(245,230,192,0.15)] text-[color:var(--color-cream)] hover:border-[color:var(--color-gold-2)] transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft size={14} />
          </button>
          <div
            key={lightbox}
            className="relative flex items-center justify-center max-w-[92vw]"
            style={{ maxHeight: "88vh", animation: "n-lineReveal 0.28s var(--ease-out) reverse" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={proxyImageUrl(images[lightbox]?.imagen_url) ?? ""}
              alt={images[lightbox]?.titulo || "Composición floral"}
              width={1400}
              height={1050}
              sizes="(max-width: 768px) 100vw, 90vw"
              className="object-contain max-h-[88vh] w-auto h-auto"
              priority
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); nextLB(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-[rgba(245,230,192,0.15)] text-[color:var(--color-cream)] hover:border-[color:var(--color-gold-2)] transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight size={14} />
          </button>
          <div className="absolute bottom-6 flex flex-col items-center gap-1">
            {images[lightbox]?.titulo && (
              <p className="text-xs tracking-[0.22em] uppercase text-[rgba(245,230,192,0.5)]">
                {images[lightbox].titulo}
              </p>
            )}
            <p className="text-[0.68rem] text-[rgba(245,230,192,0.3)] tabular-nums">
              {lightbox + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
