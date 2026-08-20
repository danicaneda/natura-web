"use client";

import { useState } from "react";
import SectionHeader from "./ui/SectionHeader";
import { WhatsAppIcon } from "./ui/Icons";
import { SITE } from "@/app/lib/site";

const FAQS = [
  {
    q: "¿Hacéis entrega a domicilio?",
    a: "Sí. En Reinosa el envío cuesta 2,50 €. Para el resto de comarcas calculamos según kilómetros. Puedes hacer el pedido por teléfono o WhatsApp y pagar con Bizum antes de la entrega.",
  },
  {
    q: "¿Cómo puedo hacer un pedido?",
    a: "La forma más rápida es por WhatsApp: cuéntanos qué necesitas y te enviamos una foto del ramo antes de entregarlo. También por teléfono o pasando por la tienda.",
  },
  {
    q: "¿Qué formas de pago aceptáis?",
    a: "En tienda, efectivo. Para pedidos a distancia, Bizum. Sencillo, sin complicaciones.",
  },
  {
    q: "¿Hacéis decoración de bodas y eventos?",
    a: "Es uno de nuestros servicios estrella. Más de 15 años decorando bodas en Cantabria: ramos de novia a medida, ceremonia e iglesia, centros de mesa, arcos florales. Presupuesto sin compromiso.",
  },
  {
    q: "¿Tenéis flores para funeral?",
    a: "Sí, con toda la sensibilidad que el momento requiere. Coronas desde 210 € y centros desde 60 €. Si es urgente, llámanos directamente.",
  },
  {
    q: "¿Cuánto cuesta un ramo personalizado?",
    a: "Depende de las flores, el tamaño y la ocasión. Cuéntanos tu presupuesto y lo adaptamos. Sin mínimo de pedido.",
  },
  {
    q: "¿Qué plantas recomendáis para principiantes?",
    a: "Pothos, Zamioculcas y suculentas son prácticamente infalibles. Pásate por la tienda y te asesoramos según tu casa, la luz disponible y tu ritmo de vida.",
  },
  {
    q: "¿Abrís en fechas especiales como San Valentín o el Día de la Madre?",
    a: "Sí, y ampliamos horario en esas fechas. Recomendamos encargar con antelación para garantizar disponibilidad, especialmente en San Valentín, Día de la Madre y Todos los Santos.",
  },
];

function Item({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const id = `faq-${index}`;
  return (
    <div className="border-b border-[color:var(--rule-soft)]">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className={`font-serif text-[1.05rem] md:text-[1.15rem] leading-tight transition-colors ${open ? "text-[color:var(--color-gold-3)]" : "text-[color:var(--color-ink-2)]"}`}>
          {q}
        </span>
        <span
          className="flex-none w-7 h-7 flex items-center justify-center border rounded-full transition-all duration-300"
          style={{
            background: open ? "var(--color-gold)" : "transparent",
            color: open ? "var(--color-cream)" : "var(--color-gold-3)",
            borderColor: open ? "var(--color-gold)" : "var(--rule)",
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            aria-hidden="true"
            style={{
              transform: open ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.35s var(--ease-spring)",
            }}
          >
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div id={id} className={`n-faq-body ${open ? "is-open" : ""}`}>
        <div>
          <p className="pb-5 pr-8 text-[color:var(--color-ink-4)] leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="bg-[color:var(--color-cream)]">
      <div className="n-container n-section-y">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <SectionHeader
              eyebrow="FAQ"
              title={<>Preguntas <em className="text-[color:var(--color-gold)]">frecuentes</em></>}
              subtitle="Todo lo que necesitas saber antes de tu pedido. Y si no está aquí, te lo contamos."
              align="left"
            />
            <div className="hidden lg:flex flex-col gap-3 mt-10">
              <a
                href={SITE.whatsapp.url()}
                target="_blank"
                rel="noopener noreferrer"
                className="n-btn n-btn-whatsapp"
              >
                <WhatsAppIcon size={13} />
                WhatsApp
              </a>
              <a href={`tel:${SITE.phone.tel}`} className="n-btn n-btn-ghost">
                Llamar · {SITE.phone.display}
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            {FAQS.map((f, i) => (
              <Item key={i} q={f.q} a={f.a} index={i} />
            ))}

            <div className="lg:hidden flex flex-col sm:flex-row gap-3 mt-8">
              <a
                href={SITE.whatsapp.url()}
                target="_blank"
                rel="noopener noreferrer"
                className="n-btn n-btn-whatsapp flex-1"
              >
                <WhatsAppIcon size={13} />
                WhatsApp
              </a>
              <a href={`tel:${SITE.phone.tel}`} className="n-btn n-btn-ghost flex-1">
                Llamar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
