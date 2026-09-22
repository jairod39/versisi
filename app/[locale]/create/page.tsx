'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';
import PhotoUpload from '@/components/PhotoUpload';

export default function CreateChallenge() {
  const t = useTranslations('create');
  const router = useRouter();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [age18, setAge18] = useState(false);
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function ensureLoggedIn() {
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return;
    // Sesión anónima simple para que el prototipo funcione sin formulario de registro.
    // En producción, reemplázalo por un login real (email o Telegram).
    await supabase.auth.signInAnonymously();
  }

  async function submit() {
    setErr('');
    if (!name.trim()) return setErr(t('errName'));
    if (!age18 || !consent) return setErr(t('errConsent'));
    if (!photoUrl) return setErr(t('errPhoto'));

    setBusy(true);
    await ensureLoggedIn();
    const supabase = supabaseBrowser();
    const { data: { session } } = await supabase.auth.getSession();

    const res = await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ name, city, photoUrl, isOver18: age18, photoConsent: consent, isPublic: false }),
    });
    setBusy(false);
    const data = await res.json();
    if (data.challenge) router.push(`/es/r/${data.challenge.slug}`);
    else setErr(data.error || 'Error');
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <h2 className="text-3xl font-extrabold mb-6">{t('title')}</h2>
      <div className="card grid gap-4">
        <div>
          <label className="font-semibold block mb-1">{t('name')}</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
        </div>
        <div>
          <label className="font-semibold block mb-1">{t('city')}</label>
          <input className="input" value={city} onChange={(e) => setCity(e.target.value)} maxLength={40} />
        </div>
        <div>
          <label className="font-semibold block mb-1">{t('photo')}</label>
          <PhotoUpload onUploaded={setPhotoUrl} hint={t('photoHint')} />
        </div>
        <label className="flex gap-2 items-start text-sm">
          <input type="checkbox" checked={age18} onChange={(e) => setAge18(e.target.checked)} className="mt-1" />
          {t('age18')}
        </label>
        <label className="flex gap-2 items-start text-sm">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
          {t('consent')}
        </label>
        {err && <p className="text-red-600 font-semibold">{err}</p>}
        <button className="btn btn-primary" onClick={submit} disabled={busy}>
          {busy ? '…' : t('submit')}
        </button>
      </div>
    </div>
  );
}
