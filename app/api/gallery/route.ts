import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8001';

export const revalidate = 120;

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=120, s-maxage=600, stale-while-revalidate=1800',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    let url = `${BACKEND}/api/gallery`;
    const params: string[] = [];
    const categoria = searchParams.get('categoria');
    const limit = searchParams.get('limit');
    if (categoria) params.push(`categoria=${encodeURIComponent(categoria)}`);
    if (limit) params.push(`limit=${encodeURIComponent(limit)}`);
    if (params.length) url += `?${params.join('&')}`;

    const res = await fetch(url, {
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Backend respondió ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, { headers: CACHE_HEADERS });
  } catch {
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'public, max-age=10, stale-while-revalidate=30' },
    });
  }
}
