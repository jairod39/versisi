import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { issueAccessKey } from '@/lib/access-keys';

// POST /api/requests/:id/decide  { interested: boolean }
// Cada persona (dueño o visitante) decide si le interesa la otra.
// Si ambos dicen que sí, se crea el match y se emite la Llave Versisi del chat.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });

  const { interested } = await req.json();

  const { data: request, error } = await supabase
    .from('requests')
    .select('id, visitor_id, challenges!inner(owner_id)')
    .eq('id', params.id)
    .single();
  if (error || !request) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const ownerId = (request as any).challenges.owner_id;
  const visitorId = request.visitor_id;
  if (user.id !== ownerId && user.id !== visitorId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  await supabase.from('decisions').upsert({
    request_id: request.id, profile_id: user.id, interested: !!interested,
  });

  if (!interested) return NextResponse.json({ match: false });

  const { data: decisions } = await supabase
    .from('decisions')
    .select('profile_id, interested')
    .eq('request_id', request.id);

  const ownerSaidYes = decisions?.some((d) => d.profile_id === ownerId && d.interested);
  const visitorSaidYes = decisions?.some((d) => d.profile_id === visitorId && d.interested);

  if (ownerSaidYes && visitorSaidYes) {
    const { data: match, error: mErr } = await supabase
      .from('matches')
      .insert({ request_id: request.id, user_a: ownerId, user_b: visitorId })
      .select('id')
      .single();
    if (mErr) return NextResponse.json({ error: mErr.message }, { status: 500 });

    // Llave Versisi del chat: cada uno recibe la llave de la conversación con el otro
    await issueAccessKey({ ownerId, subjectId: visitorId, matchId: match.id });
    await issueAccessKey({ ownerId: visitorId, subjectId: ownerId, matchId: match.id });

    return NextResponse.json({ match: true, matchId: match.id });
  }

  return NextResponse.json({ match: false });
}
