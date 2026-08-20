"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import SectionHeader from "./ui/SectionHeader";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone, WhatsAppIcon } from "./ui/Icons";
import { SITE } from "@/app/lib/site";

const MapaReinosa = dynamic(() => import("./MapaReinosa"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[color:var(--color-cream-2)]">
      <span className="text-sm text-[color:var(--color-ink-5)]">Cargando mapa…</span>
    </div>
  ),
});

const OCASIONES = ["Regalo", "Boda", "Comunión o bautizo", "Evento o celebración", "Funeral", "Decoración", "Otro"];

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  ocasion: string;
  mensaje: string;
}

export default function ContactoSection() {
  const [form, setForm] = useState<FormState>({
    nombre: "",
    email: "",
    telefono: "",
    ocasion: "",
    mensaje: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => { const c = { ...e }; delete c[k]; return c; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio";
    if (!form.email.trim()) errs.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Introduce un email válido";
    if (!form.mensaje.trim()) errs.mensaje = "El mensaje es obligatorio";
    else if (form.mensaje.trim().length < 10) errs.mensaje = "Cuéntanos un poco más";
    return errs;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSending(true);
    setErrors({});
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors({ _form: data?.error ?? "No pudimos enviar. Prueba por WhatsApp." });
        return;
      }
      setSent(true);
    } catch {
      setErrors({ _form: "Sin conexión. Prueba por WhatsApp." });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacto" className="bg-[color:var(--color-cream-2)]">
      <div className="n-container n-section-y">
        <SectionHeader
          eyebrow="Contacto"
          title={<>Hablemos de tu <em className="text-[color:var(--color-gold)]">pedido</em></>}
          subtitle="Cuéntanos qué necesitas y te ayudamos a crear la composición perfecta."
        />

        <div className="mt-16 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Info */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <span className="n-mono text-[color:var(--color-gold-3)]">Visítanos</span>
              <p className="mt-2 flex items-start gap-2 text-[color:var(--color-ink-2)]">
                <MapPin size={16} className="mt-0.5 flex-none text-[color:var(--color-gold)]" />
                <span>{SITE.address.street}<br />{SITE.address.postalCode} {SITE.address.city}, {SITE.address.region}</span>
              </p>
              <a
                href={SITE.google.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 n-link text-[0.8rem] inline-flex items-center gap-1"
              >
                Cómo llegar <ArrowUpRight size={10} />
              </a>
            </div>

            <div>
              <span className="n-mono text-[color:var(--color-gold-3)]">Teléfono</span>
              <div className="mt-2 flex flex-col gap-1">
                <a href={`tel:${SITE.phone.tel}`} className="text-[color:var(--color-ink-2)] flex items-center gap-2 hover:text-[color:var(--color-gold-3)] transition-colors">
                  <Phone size={14} className="text-[color:var(--color-gold)]" />
                  {SITE.phone.display}
                </a>
                <a href={`tel:${SITE.phone.tel2}`} className="text-[color:var(--color-ink-4)] flex items-center gap-2 hover:text-[color:var(--color-gold-3)] transition-colors text-sm">
                  <Phone size={13} className="text-[color:var(--color-gold-2)]" />
                  {SITE.phone.display2}
                </a>
              </div>
              <a
                href={SITE.whatsapp.url()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-[color:#128C7E] text-sm hover:opacity-80 transition-opacity"
              >
                <WhatsAppIcon size={14} />
                Escribir por WhatsApp
              </a>
            </div>

            <div>
              <span className="n-mono text-[color:var(--color-gold-3)]">Email</span>
              <p className="mt-2">
                <a href={`mailto:${SITE.email}`} className="text-[color:var(--color-ink-2)] flex items-center gap-2 hover:text-[color:var(--color-gold-3)] transition-colors">
                  <Mail size={14} className="text-[color:var(--color-gold)]" />
                  {SITE.email}
                </a>
              </p>
            </div>

            <div className="pt-6 border-t border-[color:var(--rule-soft)]">
              <span className="n-mono text-[color:var(--color-gold-3)]">Horario</span>
              <ul className="mt-3 space-y-2 text-sm">
                {SITE.hours.map((h) => (
                  <li key={h.label} className="flex justify-between gap-4">
                    <span className="text-[color:var(--color-ink-3)]">{h.label}</span>
                    <span className={h.value === "Cerrado" ? "text-[color:var(--color-ink-5)]" : "text-[color:var(--color-gold-3)]"}>
                      {h.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-7">
            {sent ? (
              <div className="bg-[color:var(--color-cream)] border border-[color:var(--rule-soft)] p-10 md:p-14 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[rgba(184,134,11,0.1)] border border-[color:var(--rule)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-serif text-3xl text-[color:var(--color-ink-2)]">¡Mensaje recibido!</h3>
                <p className="n-body">Te contactaremos en breve. Gracias por confiar en Natura.</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <a
                    href={SITE.whatsapp.url(`Hola, soy ${form.nombre}. ${form.mensaje}`.trim())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="n-btn n-btn-whatsapp"
                  >
                    <WhatsAppIcon size={13} />
                    También por WhatsApp
                  </a>
                  <button
                    onClick={() => { setSent(false); setForm({ nombre: "", email: "", telefono: "", ocasion: "", mensaje: "" }); }}
                    className="n-btn n-btn-ghost"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={submit} noValidate className="bg-[color:var(--color-cream)] p-8 md:p-10 border border-[color:var(--rule-soft)]">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="nombre" className="n-label">Nombre <span className="text-[color:var(--color-danger)]">*</span></label>
                    <input
                      id="nombre"
                      type="text"
                      value={form.nombre}
                      onChange={(e) => set("nombre", e.target.value)}
                      autoComplete="name"
                      autoCapitalize="words"
                      enterKeyHint="next"
                      className="n-field"
                      aria-invalid={!!errors.nombre}
                      aria-describedby={errors.nombre ? "err-nombre" : undefined}
                      placeholder="María García"
                    />
                    {errors.nombre && <span id="err-nombre" className="text-xs text-[color:var(--color-danger)] mt-1">{errors.nombre}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="n-label">Email <span className="text-[color:var(--color-danger)]">*</span></label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      autoComplete="email"
                      inputMode="email"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      enterKeyHint="next"
                      className="n-field"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "err-email" : undefined}
                      placeholder="maria@ejemplo.com"
                    />
                    {errors.email && <span id="err-email" className="text-xs text-[color:var(--color-danger)] mt-1">{errors.email}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="telefono" className="n-label">Teléfono <span className="text-[color:var(--color-ink-5)] normal-case tracking-normal text-[0.68rem]">(opcional)</span></label>
                    <input
                      id="telefono"
                      type="tel"
                      value={form.telefono}
                      onChange={(e) => set("telefono", e.target.value)}
                      autoComplete="tel"
                      inputMode="tel"
                      enterKeyHint="next"
                      className="n-field"
                      placeholder="+34 606 59 81 56"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="ocasion" className="n-label">Para qué ocasión</label>
                    <select
                      id="ocasion"
                      value={form.ocasion}
                      onChange={(e) => set("ocasion", e.target.value)}
                      className="n-field appearance-none pr-6 cursor-pointer"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236E5B3F' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 4px center",
                      }}
                    >
                      <option value="">Selecciona…</option>
                      {OCASIONES.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-6">
                  <div className="flex items-center justify-between">
                    <label htmlFor="mensaje" className="n-label">Mensaje <span className="text-[color:var(--color-danger)]">*</span></label>
                    <span className={`text-[0.65rem] tabular-nums ${form.mensaje.length > 480 ? "text-[color:var(--color-danger)]" : "text-[color:var(--color-ink-5)]"}`}>
                      {form.mensaje.length} / 500
                    </span>
                  </div>
                  <textarea
                    id="mensaje"
                    rows={5}
                    maxLength={500}
                    value={form.mensaje}
                    onChange={(e) => set("mensaje", e.target.value)}
                    enterKeyHint="send"
                    autoCapitalize="sentences"
                    className="n-field resize-none"
                    placeholder="Cuéntanos qué necesitas: tipo de flores, ocasión, presupuesto, fecha…"
                    aria-invalid={!!errors.mensaje}
                    aria-describedby={errors.mensaje ? "err-msg" : undefined}
                  />
                  {errors.mensaje && <span id="err-msg" className="text-xs text-[color:var(--color-danger)] mt-1">{errors.mensaje}</span>}
                </div>

                {errors._form && (
                  <p className="mt-4 p-3 text-sm text-[color:var(--color-danger)] bg-[rgba(139,42,42,0.06)] border border-[rgba(139,42,42,0.18)]">
                    {errors._form}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <a
                    href={SITE.whatsapp.url()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[color:#128C7E] hover:opacity-80 transition-opacity"
                  >
                    <WhatsAppIcon size={13} />
                    Prefiero WhatsApp
                  </a>
                  <button type="submit" disabled={sending} className="n-btn n-btn-primary">
                    {sending ? (
                      <>
                        <span className="w-3.5 h-3.5 border border-[rgba(250,246,238,0.35)] border-t-[color:var(--color-cream)] rounded-full n-spin" />
                        Enviando…
                      </>
                    ) : (
                      <>
                        Enviar mensaje
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-16 overflow-hidden border border-[color:var(--rule-soft)]">
          <div className="flex items-center gap-3 px-5 py-3 bg-[color:var(--color-cream)]">
            <MapPin size={14} className="text-[color:var(--color-gold)]" />
            <span className="text-[0.7rem] tracking-[0.16em] uppercase text-[color:var(--color-ink-3)]">
              {SITE.address.street} — {SITE.address.postalCode} {SITE.address.city}
            </span>
            <a
              href={SITE.google.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto n-link text-xs inline-flex items-center gap-1"
            >
              Google Maps <ArrowUpRight size={10} />
            </a>
          </div>
          <div className="h-[380px]">
            <MapaReinosa />
          </div>
        </div>
      </div>
    </section>
  );
}
