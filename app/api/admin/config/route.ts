import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/adminAuth';

export const dynamic = 'force-dynamic';

const B = process.env.BACKEND_URL ?? 'http://localhost:8001';
const auth = () => ({ Authorization: `Bearer ${process.env.BBDD_SECRET ?? ''}`, 'Content-Type': 'application/json' });

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const res = await fetch(`${B}/api/admin/config`, { headers: auth(), cache: 'no-store' });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch { return NextResponse.json({ error: 'Backend no disponible' }, { status: 503 }); }
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const body = await req.json();
    const res = await fetch(`${B}/api/admin/config`, { method: 'POST', headers: auth(), body: JSON.stringify(body) });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch { return NextResponse.json({ error: 'Backend no disponible' }, { status: 503 }); }
}
