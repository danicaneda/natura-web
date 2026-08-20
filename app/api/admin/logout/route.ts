import { NextResponse } from 'next/server';
import { clearAdminCookie } from '@/app/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  return clearAdminCookie(res);
}
