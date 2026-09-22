import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// POST /api/requests/:id/reject — el dueño rechaza; nada se genera
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });

  const { data: request, error } = await supabase
    .from('requests')
    .select('id, challenges!inner(owner_id)')
    .eq('id', params.id)
    .single();
  if (error || !request) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if ((request as any).challenges.owner_id !== user.id) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  await supabase.from('requests').update({ status: 'rejected' }).eq('id', params.id);
  return NextResponse.json({ ok: true });
}
