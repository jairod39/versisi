import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { issueAccessKey } from '@/lib/access-keys';

// POST /api/requests — alguien pide jugar en un reto (sube su foto, aún sin generar nada)
export async function POST(req: NextRequest) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });

  const { slug, name, photoUrl, isOver18, photoConsent } = await req.json();
  if (!slug || !name || !isOver18 || !photoConsent) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  const { data: challenge, error: chErr } = await supabase
    .from('challenges')
    .select('id, owner_id')
    .eq('slug', slug)
    .single();
  if (chErr || !challenge) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  await supabase.from('profiles').upsert({
    id: user.id,
    name,
    photo_url: photoUrl || null,
    is_over_18: !!isOver18,
    photo_consent: !!photoConsent,
  });

  const { data: request, error } = await supabase
    .from('requests')
    .insert({ challenge_id: challenge.id, visitor_id: user.id })
    .select('id')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // La solicitud existe, pero todavía no hay Llave Versisi: esa solo se emite
  // cuando el dueño aprueba (ver /api/requests/[id]/approve).
  return NextResponse.json({ request });
}
