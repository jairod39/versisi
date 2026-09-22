'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function Dashboard() {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [slug, setSlug] = useState('');

  async function load() {
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: challenge } = await supabase.from('challenges').select('slug').eq('owner_id', user.id).order('created_at', { ascending: false }).limit(1).single();
    if (challenge) setSlug(challenge.slug);

    const { data } = await supabase
      .from('requests')
      .select('id, status, profiles:visitor_id (name, photo_url)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    setRequests(data || []);
  }

  useEffect(() => { load(); }, []);

  async function act(id: string, action: 'approve' | 'reject') {
    const supabase = supabaseBrowser();
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(`/api/requests/${id}/${action}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    if (action === 'approve') router.push(`/es/dashboard/scenes/${id}`);
    else load();
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <h2 className="text-3xl font-extrabold mb-2">{t('title')}</h2>
      {slug && (
        <div className="card flex items-center justify-between gap-3 mb-6 flex-wrap">
          <span className="font-semibold break-all">/r/{slug}</span>
          <button className="btn btn-primary" onClick={() => navigator.clipboard.writeText(`${location.origin}/es/r/${slug}`)}>{t('copy')}</button>
        </div>
      )}
      {requests.length === 0 && <p className="text-muted">{t('empty')}</p>}
      <div className="grid gap-3">
        {requests.map((r) => (
          <div key={r.id} className="card flex items-center gap-4 flex-wrap">
            <img src={r.profiles.photo_url} className="w-14 h-14 rounded-full object-cover" />
            <b className="flex-1">{r.profiles.name}</b>
            <button className="btn btn-ghost" onClick={() => act(r.id, 'reject')}>{t('reject')}</button>
            <button className="btn btn-primary" onClick={() => act(r.id, 'approve')}>{t('approve')}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
