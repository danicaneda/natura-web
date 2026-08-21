import Link from "next/link";
import BotanicalMark from "./components/ui/BotanicalMark";
import { SITE } from "./lib/site";

export const metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe o ha cambiado de lugar. Vuelve al inicio o contáctanos por WhatsApp.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[color:var(--color-cream)] relative overflow-hidden flex items-center justify-center px-6 py-24">
      {/* Botánico decorativo */}
      <svg
        viewBox="0 0 500 600"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
      >
        <path d="M250 580 Q245 420 250 60" stroke="#B8860B" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="250" cy="340" rx="80" ry="145" transform="rotate(20 250 340)" fill="#B8860B" opacity="0.9" />
        <ellipse cx="250" cy="255" rx="65" ry="115" transform="rotate(-18 250 255)" fill="#B8860B" opacity="0.85" />
        <ellipse cx="250" cy="175" rx="45" ry="88" transform="rotate(8 250 175)" fill="#B8860B" opacity="0.7" />
        <circle cx="250" cy="62" r="20" fill="#B8860B" opacity="0.4" />
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-md">
        <Link href="/" aria-label="Volver al inicio" className="inline-flex flex-col items-center gap-3">
          <BotanicalMark size={40} color="var(--color-gold)" />
          <span className="font-serif tracking-[0.38em] uppercase text-[color:var(--color-gold-3)]">
            NATURA
          </span>
        </Link>

        <span className="n-eyebrow">Error 404</span>

        <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] text-[color:var(--color-ink-2)]">
          Esta flor no existe<br />
          <em className="text-[color:var(--color-gold)]">en nuestro jardín</em>
        </h1>

        <p className="n-body max-w-xs">
          La página que buscas no existe o ha cambiado de lugar.
          Descubre nuestra colección o habla con nosotros.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full max-w-xs">
          <Link href="/" className="n-btn n-btn-primary flex-1">
            Volver al inicio
          </Link>
          <a
            href={SITE.whatsapp.url("Hola, necesito ayuda.")}
            target="_blank"
            rel="noopener noreferrer"
            className="n-btn n-btn-whatsapp flex-1"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
