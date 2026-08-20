import { NextResponse } from 'next/server';

const B = process.env.BACKEND_URL ?? 'http://localhost:8001';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(`${B}/api/testimonios`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Backend ${res.status}`);
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json([]);
  }
}
