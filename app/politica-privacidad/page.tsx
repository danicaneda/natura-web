import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad y tratamiento de datos de Floristería Natura, Reinosa (Cantabria). Cómo usamos los datos del formulario de contacto.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/politica-privacidad" },
};

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-serif text-2xl text-[color:var(--color-ink-2)] mb-3">{title}</h2>
      <div className="text-[color:var(--color-ink-4)] leading-relaxed space-y-3 text-[0.95rem]">
        {children}
      </div>
    </section>
  );
}

export default function PoliticaPrivacidad() {
  return (
    <main className="min-h-screen bg-[color:var(--color-cream)]">
      <div className="mx-auto max-w-[760px] px-6 pt-24 pb-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[0.72rem] tracking-[0.22em] uppercase text-[color:var(--color-gold-3)] hover:opacity-70 transition-opacity"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver
        </Link>

        <div className="mt-10">
          <span className="n-eyebrow">Legal</span>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl text-[color:var(--color-ink-2)]">
            Política de privacidad
          </h1>
          <div className="w-12 h-px bg-[color:var(--color-gold)] mt-6 mb-10" />
        </div>

        <LegalSection title="1. Responsable del tratamiento">
          <p>
            <strong>Floristería Natura</strong><br />
            {SITE.address.street} — {SITE.address.postalCode} {SITE.address.city}, {SITE.address.region}<br />
            Teléfono: {SITE.phone.display2} · {SITE.phone.display}<br />
            Email: <a href={`mailto:${SITE.email}`} className="n-link">{SITE.email}</a>
          </p>
        </LegalSection>

        <LegalSection title="2. Datos que recogemos">
          <p>A través del formulario de contacto de esta web recogemos únicamente:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Nombre y apellidos</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono (opcional)</li>
            <li>Mensaje que el usuario redacta libremente</li>
          </ul>
          <p>No recogemos datos de pago ni datos especialmente protegidos.</p>
        </LegalSection>

        <LegalSection title="3. Finalidad">
          <p>
            Los datos facilitados se usan exclusivamente para responder a las
            consultas o pedidos que el usuario nos remite. No se utilizan para
            ninguna otra finalidad.
          </p>
        </LegalSection>

        <LegalSection title="4. Legitimación">
          <p>
            La base legal es el consentimiento expreso del usuario al enviar
            el formulario (art. 6.1.a RGPD) y el interés legítimo en atender
            consultas comerciales (art. 6.1.f RGPD).
          </p>
        </LegalSection>

        <LegalSection title="5. Conservación">
          <p>
            Los datos se conservan durante el tiempo necesario para gestionar
            la consulta y, en su caso, la relación comercial. Transcurrido ese
            periodo se eliminan de forma segura.
          </p>
        </LegalSection>

        <LegalSection title="6. Destinatarios">
          <p>
            No cedemos ni comunicamos sus datos a terceros, salvo obligación
            legal. El formulario se gestiona mediante un servidor de correo
            propio.
          </p>
        </LegalSection>

        <LegalSection title="7. Derechos">
          <p>Puede ejercer en cualquier momento:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Acceso</strong> a sus datos</li>
            <li><strong>Rectificación</strong> de datos inexactos</li>
            <li><strong>Supresión</strong> de sus datos</li>
            <li><strong>Oposición</strong> al tratamiento</li>
            <li><strong>Portabilidad</strong> de sus datos</li>
            <li><strong>Limitación</strong> del tratamiento</li>
          </ul>
          <p>
            Para ejercerlos, escriba a{" "}
            <a href={`mailto:${SITE.email}`} className="n-link">{SITE.email}</a>.
            También puede reclamar ante la Agencia Española de Protección de
            Datos (aepd.es).
          </p>
        </LegalSection>

        <LegalSection title="8. Cookies y analítica">
          <p>
            Usamos cookies técnicas imprescindibles y{" "}
            <strong>almacenamiento local del navegador</strong> (localStorage)
            para recordar su preferencia sobre este propio aviso de cookies.
          </p>
          <p>
            Para conocer de forma agregada cuántas personas visitan la web
            usamos <strong>Vercel Web Analytics</strong>, una solución que
            <em> no instala cookies</em> ni identifica personalmente al
            visitante: los datos se agregan por página y país mediante un
            hash rotativo y no se comparten con terceros. Puede consultar los
            detalles técnicos en{" "}
            <a
              href="https://vercel.com/docs/analytics/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="n-link"
            >
              vercel.com/docs/analytics/privacy-policy
            </a>
            .
          </p>
          <p>
            No utilizamos cookies publicitarias, ni de perfilado, ni de
            terceros con fines comerciales.
          </p>
        </LegalSection>

        <LegalSection title="9. Seguridad">
          <p>
            Aplicamos medidas técnicas y organizativas para proteger sus
            datos frente a accesos no autorizados, pérdida o alteración,
            conforme al RGPD y la LOPDGDD.
          </p>
        </LegalSection>

        <p className="mt-12 text-xs text-[color:var(--color-ink-5)]">
          Última actualización: {new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
        </p>
      </div>
    </main>
  );
}
