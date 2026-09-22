'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabaseBrowser } from '@/lib/supabase-browser';
import PhotoUpload from '@/components/PhotoUpload';

export default function VisitChallenge({ params }: { params: { slug: string } }) {
  const t = useTranslations('visit');
  const [owner, setOwner] = useState<any>(null);
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [age18, setAge18] = useState(false);
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase
        .from('challenges')
        .select('slug, profiles:owner_id (name, city, photo_url)')
        .eq('slug', params.slug)
        .single();
      setOwner((data as any)?.profiles || null);
    })();
  }, [params.slug]);

  async function submit() {
    setErr('');
    if (!name.trim() || !photoUrl || !age18 || !consent) { setErr('Completa todos los campos.'); return; }
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) await supabase.auth.signInAnonymously();
    const { data: { session } } = await supabase.auth.getSession();

    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ slug: params.slug, name, photoUrl, isOver18: age18, photoConsent: consent }),
    });
    const data = await res.json();
    if (data.request) setSent(true); else setErr(data.error || 'Error');
  }

  if (!owner) return <div className="max-w-xl mx-auto px-5 py-12">…</div>;

  if (sent) {
    return (
      <div className="max-w-xl mx-auto px-5 py-12 text-center">
        <img src={photoUrl!} className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
        <h2 className="text-2xl font-extrabold mb-2">{t('sent', { name: owner.name })}</h2>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <h2 className="text-3xl font-extrabold mb-2">{t('title', { name: owner.name })}</h2>
      <p className="text-muted mb-6">{t('sub', { name: owner.name, city: owner.city || '' })}</p>
      <div className="card grid gap-4">
        <div className="flex items-center gap-3">
          <img src={owner.photo_url} className="w-16 h-16 rounded-full object-cover" />
          <div><b>{owner.name}</b><p className="text-muted text-sm">{owner.city}</p></div>
        </div>
        <input className="input" placeholder={t('title', { name: '' })} value={name} onChange={(e) => setName(e.target.value)} />
        <PhotoUpload onUploaded={setPhotoUrl} />
        <label className="flex gap-2 items-start text-sm"><input type="checkbox" checked={age18} onChange={(e) => setAge18(e.target.checked)} className="mt-1" /> Tengo 18 años o más.</label>
        <label className="flex gap-2 items-start text-sm"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" /> Autorizo procesar mi foto solo si el dueño aprueba.</label>
        <p className="text-muted text-sm">{t('note', { name: owner.name })}</p>
        {err && <p className="text-red-600 font-semibold">{err}</p>}
        <button className="btn btn-primary" onClick={submit}>{t('send')}</button>
      </div>
    </div>
  );
}
