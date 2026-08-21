import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8001';

export const revalidate = 60; // ISR: cachea 60s a nivel de Next

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const forwardParams = ['categoria', 'destacado', 'q', 'limit', 'offset', 'etiqueta'];
    let url = `${BACKEND}/api/productos?disponible=true`;
    for (const key of forwardParams) {
      const val = searchParams.get(key);
      if (val !== null) url += `&${key}=${encodeURIComponent(val)}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Backend respondió ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, { headers: CACHE_HEADERS });
  } catch {
    // Devuelve array vacío con cache corto para que si el backend cae
    // por cold-start la web no se quede muerta 60s enteros.
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'public, max-age=10, stale-while-revalidate=30' },
    });
  }
}
