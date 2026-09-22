import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { revokeAccessKeysBetween } from '@/lib/access-keys';

// POST /api/blocks  { blockedId } — bloquea a alguien y revoca sus Llaves Versisi al instante
export async function POST(req: NextRequest) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });

  const { blockedId } = await req.json();
  if (!blockedId) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });

  await supabase.from('blocks').upsert({ blocker_id: user.id, blocked_id: blockedId });

  // Revoca en ambos sentidos: la persona bloqueada pierde acceso a ti y a la conversación.
  await revokeAccessKeysBetween(user.id, blockedId);
  await revokeAccessKeysBetween(blockedId, user.id);

  return NextResponse.json({ ok: true });
}
