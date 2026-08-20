import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8001';

export const dynamic = 'force-dynamic';

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
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Backend respondió ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
