import { createHmac } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const COOKIE = 'natura_admin';

function getSecret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) return null;
  return s;
}

export function makeSessionToken(): string | null {
  const secret = getSecret();
  if (!secret) return null;
  return createHmac('sha256', secret).update('natura_admin_v1').digest('hex');
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = makeSessionToken();
  if (!expected) return false;
  const jar   = await cookies();
  const token = jar.get(COOKIE)?.value ?? '';
  return token.length === expected.length && token === expected;
}

export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdminAuthenticated()) return null;
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
}

export function setAdminCookie(response: NextResponse): NextResponse | null {
  const token = makeSessionToken();
  if (!token) return null;
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });
  return response;
}

export function clearAdminCookie(response: NextResponse): NextResponse {
  response.cookies.set(COOKIE, '', { maxAge: 0, path: '/' });
  return response;
}
