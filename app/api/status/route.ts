import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8001';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/status`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Backend respondió ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch {
    return NextResponse.json({
      maintenance_mode: false,
      maintenance_title: 'Próximamente',
      maintenance_message: 'Estamos preparando algo especial. Vuelve pronto.',
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  }
}
