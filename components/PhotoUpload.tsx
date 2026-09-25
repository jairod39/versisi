'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function PhotoUpload({ onUploaded, hint }: { onUploaded: (url: string) => void; hint?: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setBusy(true);
    const supabase = supabaseBrowser();

    let { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
      if (signInError) { setBusy(false); alert('Error de sesión: ' + signInError.message); return; }
      user = signInData.user;
    }

    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from('photos').upload(path, file, { upsert: true });
    setBusy(false);
    if (error) { alert('Error subiendo la foto: ' + error.message); return; }
    const { data } = supabase.storage.from('photos').getPublicUrl(path);
    onUploaded(data.publicUrl);
  }

  return (
    <label className="flex items-center gap-4 border-2 border-dashed border-line rounded-2xl p-4 cursor-pointer bg-bg">
      <div className="w-20 h-20 rounded-full bg-line overflow-hidden flex-none flex items-center justify-center text-xs text-muted relative">
        {busy ? (
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#3A3062" strokeWidth="4" />
            <circle cx="40" cy="40" r="36" fill="none" stroke="#FF3B5C" strokeWidth="4"
              strokeDasharray="226" strokeDashoffset="170" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="0.9s" repeatCount="indefinite" />
            </circle>
            <circle cx="40" cy="30" r="10" fill="#FF3B5C">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <path d="M22 62c2-14 10-20 18-20s16 6 18 20" fill="#FF3B5C" opacity="0.9">
              <animate attributeName="opacity" values="0.6;0.95;0.6" dur="1.2s" repeatCount="indefinite" />
            </path>
          </svg>
        ) : preview ? (
          <img src={preview} className="w-full h-full object-cover" />
        ) : 'Foto'}
      </div>
      <div>
        <b>{busy ? 'Procesando tu foto…' : 'Elegir foto'}</b>
        {hint && !busy && <small className="block text-muted">{hint}</small>}
      </div>
      <input type="file" accept="image/*" hidden onChange={handleFile} />
    </label>
  );
}
