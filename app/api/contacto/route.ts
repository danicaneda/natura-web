import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { escapeHtml } from '@/app/lib/utils';

export const dynamic = 'force-dynamic';

// Rate limiting: max 3 envíos por IP en ventana de 10 min
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX       = 3;
const rateMap        = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now   = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_MAX) return true;
  entry.count++;
  return false;
}

interface ContactoBody {
  nombre: string;
  email: string;
  telefono?: string;
  ocasion?: string;
  mensaje: string;
}

function validate(body: ContactoBody): string | null {
  if (!body.nombre?.trim()) return 'Nombre obligatorio';
  if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return 'Email inválido';
  if (!body.mensaje?.trim() || body.mensaje.trim().length < 10) return 'Mensaje demasiado corto';
  if (body.mensaje.length > 500) return 'Mensaje demasiado largo';
  return null;
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Demasiados envíos. Espera unos minutos o contáctanos por WhatsApp.' }, { status: 429 });
  }

  let body: ContactoBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const error = validate(body);
  if (error) return NextResponse.json({ error }, { status: 422 });

  const SMTP_HOST     = process.env.SMTP_HOST     ?? '';
  const SMTP_PORT     = parseInt(process.env.SMTP_PORT ?? '587');
  const SMTP_USER     = process.env.SMTP_USER     ?? '';
  const SMTP_PASS     = process.env.SMTP_PASS     ?? '';
  const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? 'terear@hotmail.es';

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('[Contacto] Variables SMTP no configuradas');
    return NextResponse.json({ error: 'Servicio de email no disponible temporalmente' }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const safeNombre   = escapeHtml(body.nombre);
  const safeEmail    = escapeHtml(body.email);
  const safeTelefono = body.telefono ? escapeHtml(body.telefono) : null;
  const safeMensaje  = escapeHtml(body.mensaje);

  const htmlBody = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1A1208;">
      <div style="background: #1A1208; padding: 28px 32px; text-align: center;">
        <p style="color: #C9A84C; letter-spacing: 4px; font-size: 12px; text-transform: uppercase; margin: 0 0 6px 0;">Floristería</p>
        <h1 style="color: #FAF6EE; font-size: 24px; font-weight: 300; margin: 0; letter-spacing: 3px;">NATURA</h1>
      </div>
      <div style="padding: 32px; background: #FAF6EE; border: 1px solid rgba(184,134,11,0.15); border-top: none;">
        <h2 style="font-size: 18px; font-weight: 400; color: #B8860B; margin: 0 0 24px 0;">Nuevo mensaje de contacto</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #8A7560; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 100px;">Nombre</td><td style="padding: 8px 0; font-size: 15px;">${safeNombre}</td></tr>
          <tr><td style="padding: 8px 0; color: #8A7560; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td><td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${safeEmail}" style="color: #B8860B;">${safeEmail}</a></td></tr>
          ${safeTelefono ? `<tr><td style="padding: 8px 0; color: #8A7560; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Teléfono</td><td style="padding: 8px 0; font-size: 15px;"><a href="tel:${safeTelefono}" style="color: #B8860B;">${safeTelefono}</a></td></tr>` : ''}
          ${body.ocasion ? `<tr><td style="padding: 8px 0; color: #8A7560; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Ocasión</td><td style="padding: 8px 0; font-size: 15px; color: #B8860B; font-weight: 500;">${escapeHtml(body.ocasion)}</td></tr>` : ''}
        </table>
        <div style="margin-top: 20px; padding: 20px; background: #F5EDD8; border-left: 3px solid #B8860B;">
          <p style="margin: 0; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${safeMensaje}</p>
        </div>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(184,134,11,0.2); font-size: 12px; color: #B8A88A;">
          Recibido el ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Natura Web" <${SMTP_USER}>`,
      to: CONTACT_EMAIL,
      replyTo: body.email,
      subject: `Nuevo mensaje de ${body.nombre} — Natura`,
      html: htmlBody,
      text: `Nombre: ${body.nombre}\nEmail: ${body.email}\nTeléfono: ${body.telefono ?? '—'}\n\n${body.mensaje}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Contacto] Error enviando email:', err);
    return NextResponse.json({ error: 'Error al enviar el mensaje. Intenta por WhatsApp.' }, { status: 500 });
  }
}
