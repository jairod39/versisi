import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

function slugify() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

// POST /api/challenges  — crea un reto para el usuario logueado
export async function POST(req: NextRequest) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });

  const body = await req.json();
  const { name, city, photoUrl, isOver18, photoConsent, isPublic } = body;

  if (!name || !isOver18 || !photoConsent) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  // Guarda/actualiza el perfil
  await supabase.from('profiles').upsert({
    id: user.id,
    name,
    city: city || null,
    photo_url: photoUrl || null,
    is_over_18: !!isOver18,
    photo_consent: !!photoConsent,
  });

  const slug = slugify();
  const { data, error } = await supabase
    .from('challenges')
    .insert({ owner_id: user.id, slug, is_public: !!isPublic })
    .select('id, slug')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ challenge: data });
}
