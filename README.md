# Natura · Flores & Plantas

Web de la floristería **Natura** en Reinosa (Cantabria).
Stack: **Next.js 15 · React 19 · TypeScript 5 · Tailwind CSS 4 · Leaflet · Nodemailer · Vercel**.

Producción: **https://www.floresyplantasnatura.es**

---

## Arquitectura

```
Navegador ──▶ Next.js (Vercel)  ─┬─▶  /api/contacto          → SMTP
                                 ├─▶  /api/status            → FastAPI /api/status
                                 ├─▶  /api/productos|gallery → FastAPI (cache)
                                 └─▶  /api/admin/*  (cookie) → FastAPI /api/admin/* (Bearer)
                                                                    (BBDD SQLite)
```

- **Frontend** en este repo (`app/`).
- **Backend** FastAPI en `../../BBDD/api_server.py`, desplegado en Render
  (`https://natura-api.onrender.com`, free-tier — cold-start 15-30 s la primera petición).

---

## Puesta en marcha

```bash
npm install
cp .env.example .env.local        # rellenar valores
npm run dev                       # http://localhost:3000
```

### Variables de entorno

Ver **`.env.example`** para la plantilla completa. Resumen:

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | URL pública del backend (visible en cliente) |
| `BACKEND_URL` | URL usada por rutas server-side (`/api/*`) |
| `BBDD_SECRET` | Bearer compartido con el backend para `/api/admin/*` |
| `ADMIN_PASSWORD` | Contraseña del panel `/admin` |
| `ADMIN_SESSION_SECRET` | Secreto HMAC para firmar la cookie de sesión (≥ 32 chars) |
| `CONTACT_EMAIL` | Destinatario del formulario de contacto |
| `SMTP_HOST/PORT/USER/PASS` | Cuenta SMTP para envío del formulario |

> `ADMIN_SESSION_SECRET` y `ADMIN_PASSWORD` son obligatorias para que
> el panel `/admin` esté operativo. Si falta cualquiera, `/api/admin/login`
> responde `503 Panel no configurado` — comportamiento seguro por diseño.

Genera un secret fuerte con:

```bash
openssl rand -hex 32
```

---

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con Turbopack |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build (`.next`) en local |
| `npm run lint` | ESLint + reglas de `next/core-web-vitals` |

---

## Config central

Todos los datos del negocio (dirección, teléfonos, email, WhatsApp,
horarios, geo, redes sociales, URL de reseñas) viven en:

```
app/lib/site.ts     →  export const SITE = { ... }
```

**Regla:** cualquier dato que aparezca en dos sitios se centraliza aquí.
Los componentes lo importan con `import { SITE } from "@/app/lib/site"`.

---

## Seguridad

- Headers: `CSP` (sin `unsafe-eval`), `HSTS`, `X-Frame-Options: DENY`,
  `Referrer-Policy`, `Permissions-Policy`.
- Formulario de contacto: validación server-side, `escapeHtml` en el body
  HTML del email, rate-limit 3 envíos/IP cada 10 min.
- Admin: cookie `HttpOnly` firmada HMAC-SHA256 con `ADMIN_SESSION_SECRET`.
- Backend: valida `Bearer BBDD_SECRET` con `hmac.compare_digest`.

---

## Despliegue en Vercel

1. `vercel link` (una sola vez) — este repo ya trae `.vercel/` linkeado.
2. En **Vercel → Project → Settings → Environment Variables** cargar
   todas las variables listadas arriba en los tres entornos
   (Production, Preview, Development).
3. `git push origin master` — Vercel construye y despliega automáticamente.
4. Dominio: `www.floresyplantasnatura.es` (A/AAAA + CNAME configurados).

### Backend (Render)

- Servicio Python en `../../BBDD/api_server.py`.
- Variable `BBDD_SECRET` con el **mismo valor** que la del frontend.
- Cold-start: la home hace warm-up con `fetch(/api/health)` al montar.

---

## Checklist antes de publicar

- [ ] `.env.local` completado (todos los `cambia-esto-...` fuera).
- [ ] Variables cargadas en Vercel (production + preview).
- [ ] `BBDD_SECRET` idéntico en Vercel y en Render.
- [ ] `npm run build` sin errores.
- [ ] Formulario de contacto envía email correctamente.
- [ ] `/admin` accesible con la contraseña definida.
- [ ] `robots.txt` y `sitemap.xml` responden bajo el dominio final.

---

## Rediseño julio 2026

Web reconstruida por completo desde cero (nivel Aesop / Studio Freight).
Backup pre-rediseño en `../natura-backup-2026-07-17/`.
