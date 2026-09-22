'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

// Sube una foto al bucket privado "photos" de Supabase Storage y devuelve su URL pública.
// Antes de usarlo, crea el bucket "photos" (privado) en Supabase > Storage.
export default function PhotoUpload({ onUploaded, hint }: { onUploaded: (url: string) => void; hint?: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setBusy(true);
    const supabase = supabaseBrowser();
    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from('photos').upload(path, file, { upsert: true });
    setBusy(false);
    if (error) { alert('Error subiendo la foto: ' + error.message); return; }
    const { data } = supabase.storage.from('photos').getPublicUrl(path);
    onUploaded(data.publicUrl);
  }

  return (
    <label className="flex items-center gap-4 border-2 border-dashed border-line rounded-2xl p-4 cursor-pointer bg-bg">
      <div className="w-20 h-20 rounded-full bg-line overflow-hidden flex-none flex items-center justify-center text-xs text-muted">
        {preview ? <img src={preview} className="w-full h-full object-cover" /> : 'Foto'}
      </div>
      <div>
        <b>{busy ? 'Subiendo…' : 'Elegir foto'}</b>
        {hint && <small className="block text-muted">{hint}</small>}
      </div>
      <input type="file" accept="image/*" hidden onChange={handleFile} />
    </label>
  );
}
