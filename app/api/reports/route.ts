import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });

  const { reportedId, reason } = await req.json();
  if (!reportedId) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });

  await supabase.from('reports').insert({ reporter_id: user.id, reported_id: reportedId, reason: reason || null });
  return NextResponse.json({ ok: true });
}
