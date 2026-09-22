import { supabaseAdmin } from './supabase-server';

/**
 * La Llave Versisi: cada conexión entre dos personas (una solicitud abierta,
 * o un match) tiene una llave propia. El token no contiene datos, es solo un
 * identificador aleatorio. Quien la tiene puede usar esa conexión; si el
 * dueño bloquea o revoca, la llave deja de abrir nada, sin que la otra
 * persona pueda hacer algo al respecto.
 */

export async function issueAccessKey(params: {
  ownerId: string;
  subjectId: string;
  requestId?: string;
  matchId?: string;
  expiresInDays?: number;
}) {
  const admin = supabaseAdmin();
  const expires_at = params.expiresInDays
    ? new Date(Date.now() + params.expiresInDays * 86400000).toISOString()
    : null;
  const { data, error } = await admin
    .from('access_keys')
    .insert({
      owner_id: params.ownerId,
      subject_id: params.subjectId,
      request_id: params.requestId ?? null,
      match_id: params.matchId ?? null,
      expires_at,
    })
    .select('token')
    .single();
  if (error) throw error;
  return data.token as string;
}

export async function revokeAccessKeysBetween(ownerId: string, subjectId: string) {
  const admin = supabaseAdmin();
  await admin
    .from('access_keys')
    .update({ status: 'revoked' })
    .eq('owner_id', ownerId)
    .eq('subject_id', subjectId);
}

export async function isAccessKeyValid(token: string) {
  const admin = supabaseAdmin();
  const { data } = await admin
    .from('access_keys')
    .select('status, expires_at')
    .eq('token', token)
    .single();
  if (!data) return false;
  if (data.status !== 'active') return false;
  if (data.expires_at && new Date(data.expires_at) < new Date()) return false;
  return true;
}
