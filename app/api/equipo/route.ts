import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8001';

export const revalidate = 300;

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=300, s-maxage=1800, stale-while-revalidate=3600',
};

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/equipo`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Backend error: ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, { headers: CACHE_HEADERS });
  } catch {
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'public, max-age=10, stale-while-revalidate=30' },
    });
  }
}
