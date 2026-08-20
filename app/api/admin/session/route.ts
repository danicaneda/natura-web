import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/app/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const ok = await isAdminAuthenticated();
  return NextResponse.json({ authenticated: ok }, { status: ok ? 200 : 401 });
}
