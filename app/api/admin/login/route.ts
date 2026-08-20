import { NextResponse } from 'next/server';
import { setAdminCookie } from '@/app/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: '' }));
  const expected = process.env.ADMIN_PASSWORD ?? '';
  const secretConfigured = (process.env.ADMIN_SESSION_SECRET ?? '').length >= 16;

  if (!expected || !secretConfigured) {
    return NextResponse.json({ error: 'Panel no configurado' }, { status: 503 });
  }
  if (typeof password !== 'string' || password.length !== expected.length || password !== expected) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const res = setAdminCookie(NextResponse.json({ ok: true }));
  if (!res) {
    return NextResponse.json({ error: 'Panel no configurado' }, { status: 503 });
  }
  return res;
}
