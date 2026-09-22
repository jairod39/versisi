import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { issueAccessKey } from '@/lib/access-keys';
import { generateScene, SCENE_KEYS } from '@/lib/generator';
import { canSpendToday, recordSpend } from '@/lib/budget';

// POST /api/requests/:id/approve — el dueño del reto aprueba y dispara la generación
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });

  const { data: request, error } = await supabase
    .from('requests')
    .select('id, visitor_id, challenge_id, challenges!inner(owner_id)')
    .eq('id', params.id)
    .single();
  if (error || !request) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const ownerId = (request as any).challenges.owner_id;
  if (ownerId !== user.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  if (!(await canSpendToday())) {
    return NextResponse.json({ error: 'daily_budget_reached' }, { status: 429 });
  }

  await supabase.from('requests').update({ status: 'approved' }).eq('id', params.id);

  // Emitimos la Llave Versisi para esta conexión (dueño <-> visitante)
  await issueAccessKey({ ownerId, subjectId: request.visitor_id, requestId: request.id });

  const { data: owner } = await supabase.from('profiles').select('photo_url').eq('id', ownerId).single();
  const { data: visitor } = await supabase.from('profiles').select('photo_url').eq('id', request.visitor_id).single();

  for (const sceneKey of SCENE_KEYS) {
    try {
      const { imageUrl, costCents } = await generateScene(
        owner?.photo_url || '', visitor?.photo_url || '', sceneKey
      );
      await supabase.from('scene_sets').insert({
        request_id: request.id, scene_key: sceneKey, image_url: imageUrl, status: 'done',
      });
      if (costCents > 0) await recordSpend(costCents);
    } catch (e) {
      await supabase.from('scene_sets').insert({
        request_id: request.id, scene_key: sceneKey, status: 'failed',
      });
    }
  }

  return NextResponse.json({ ok: true });
}
