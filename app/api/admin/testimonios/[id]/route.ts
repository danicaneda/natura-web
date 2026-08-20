import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/adminAuth';

export const dynamic = 'force-dynamic';

const B = process.env.BACKEND_URL ?? 'http://localhost:8001';
const auth = () => ({ Authorization: `Bearer ${process.env.BBDD_SECRET ?? ''}` });

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const { id } = await params;
  try {
    const res = await fetch(`${B}/api/admin/testimonios/${id}`, { method: 'DELETE', headers: auth() });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch { return NextResponse.json({ error: 'Backend no disponible' }, { status: 503 }); }
}
