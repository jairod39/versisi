import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// POST /api/match/:id/messages  { body: string } — enviar un mensaje de chat
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });

  const { body } = await req.json();
  if (!body || !body.trim()) return NextResponse.json({ error: 'empty' }, { status: 400 });

  const { data: match } = await supabase
    .from('matches')
    .select('id, user_a, user_b')
    .eq('id', params.id)
    .single();
  if (!match || (match.user_a !== user.id && match.user_b !== user.id)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const { error } = await supabase.from('messages').insert({
    match_id: match.id, sender_id: user.id, body: body.slice(0, 2000),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
