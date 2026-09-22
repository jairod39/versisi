'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function Feed() {
  const t = useTranslations('feed');
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase
        .from('challenges')
        .select('slug, profiles:owner_id (name, city, photo_url)')
        .eq('is_public', true)
        .limit(30);
      setItems(data || []);
    })();
  }, []);

  return (
    <div className="max-w-xl mx-auto px-5 py-12 text-center">
      <h2 className="text-3xl font-extrabold mb-2">{t('title')}</h2>
      <p className="text-muted mb-8">{t('sub')}</p>
      <div className="grid gap-5 text-left">
        {items.map((c: any) => (
          <a key={c.slug} href={`/es/r/${c.slug}`} className="card flex items-center gap-4">
            <img src={c.profiles.photo_url} className="w-14 h-14 rounded-full object-cover" />
            <div className="flex-1">
              <b>{c.profiles.name}</b>
              <p className="text-muted text-sm">{c.profiles.city}</p>
            </div>
            <span className="btn btn-primary">{t('play', { name: c.profiles.name })}</span>
          </a>
        ))}
        {items.length === 0 && <p className="text-muted text-center">—</p>}
      </div>
    </div>
  );
}
