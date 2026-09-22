'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

const KEYS = ['vac', 'wed', 'old'] as const;

export default function Scenes({ params }: { params: { requestId: string } }) {
  const t = useTranslations('scenes');
  const router = useRouter();
  const [scenes, setScenes] = useState<any[]>([]);
  const [tab, setTab] = useState(0);
  const [otherName, setOtherName] = useState('');
  const [decided, setDecided] = useState<null | 'waiting' | 'no'>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const supabase = supabaseBrowser();
    const { data } = await supabase
      .from('scene_sets')
      .select('scene_key, image_url, status')
      .eq('request_id', params.requestId);
    setScenes(data || []);
    setLoading((data || []).length < 3);

    const { data: req } = await supabase
      .from('requests')
      .select('profiles:visitor_id (name)')
      .eq('id', params.requestId)
      .single();
    setOtherName((req as any)?.profiles?.name || '');
  }

  useEffect(() => {
    load();
    const iv = setInterval(load, 2000);
    return () => clearInterval(iv);
  }, []);

  async function decide(interested: boolean) {
    const supabase = supabaseBrowser();
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/requests/${params.requestId}/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ interested }),
    });
    const data = await res.json();
    if (!interested) return setDecided('no');
    if (data.match) router.push(`/es/match/${data.matchId}`);
    else setDecided('waiting');
  }

  const img = scenes.find((s) => s.scene_key === KEYS[tab])?.image_url;

  return (
    <div className="max-w-xl mx-auto px-5 py-12 text-center">
      {loading ? (
        <p className="text-muted">Ilustrando escenas…</p>
      ) : (
        <>
          <div className="flex gap-2 justify-center mb-4">
            {KEYS.map((k, i) => (
              <button key={k} onClick={() => setTab(i)} className={`btn ${tab === i ? 'btn-primary' : ''}`}>{t(k)}</button>
            ))}
          </div>
          <div className="border-4 border-ink rounded-xl overflow-hidden max-w-sm mx-auto mb-3">
            {img && <img src={img} className="w-full" />}
          </div>
          <p className="text-muted text-sm mb-6">{t('disc')}</p>
          {decided === 'waiting' && <p className="font-semibold">{t('waiting', { name: otherName })}</p>}
          {decided === 'no' && <p className="text-muted">—</p>}
          {!decided && (
            <>
              <h3 className="font-bold text-lg mb-3">{t('q', { name: otherName })}</h3>
              <div className="flex gap-3 justify-center">
                <button className="btn" onClick={() => decide(false)}>{t('no')}</button>
                <button className="btn btn-primary" onClick={() => decide(true)}>{t('yes')}</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
