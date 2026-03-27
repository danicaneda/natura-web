import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

interface ContactoBody {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
}

function validate(body: ContactoBody): string | null {
  if (!body.nombre?.trim()) return 'Nombre obligatorio';
  if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return 'Email inválido';
  if (!body.mensaje?.trim() || body.mensaje.trim().length < 10) return 'Mensaje demasiado corto';
  if (body.mensaje.length > 1000) return 'Mensaje demasiado largo';
  return null;
}

export async function POST(request: Request) {
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

  const htmlBody = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1A1208;">
      <div style="background: #1A1208; padding: 28px 32px; text-align: center;">
        <p style="color: #C9A84C; letter-spacing: 4px; font-size: 12px; text-transform: uppercase; margin: 0 0 6px 0;">Floristería</p>
        <h1 style="color: #FAF6EE; font-size: 24px; font-weight: 300; margin: 0; letter-spacing: 3px;">NATURA</h1>
      </div>
      <div style="padding: 32px; background: #FAF6EE; border: 1px solid rgba(184,134,11,0.15); border-top: none;">
        <h2 style="font-size: 18px; font-weight: 400; color: #B8860B; margin: 0 0 24px 0;">Nuevo mensaje de contacto</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #8A7560; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 100px;">Nombre</td><td style="padding: 8px 0; font-size: 15px;">${body.nombre}</td></tr>
          <tr><td style="padding: 8px 0; color: #8A7560; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td><td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${body.email}" style="color: #B8860B;">${body.email}</a></td></tr>
          ${body.telefono ? `<tr><td style="padding: 8px 0; color: #8A7560; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Teléfono</td><td style="padding: 8px 0; font-size: 15px;"><a href="tel:${body.telefono}" style="color: #B8860B;">${body.telefono}</a></td></tr>` : ''}
        </table>
        <div style="margin-top: 20px; padding: 20px; background: #F5EDD8; border-left: 3px solid #B8860B;">
          <p style="margin: 0; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${body.mensaje.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
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
