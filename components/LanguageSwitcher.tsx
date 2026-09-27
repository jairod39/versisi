'use client';

export default function LanguageSwitcher({ locale }: { locale: string }) {
  function setLang(lang: 'es' | 'en') {
    document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=31536000`;
    window.location.reload();
  }
  return (
    <div className="flex gap-3 text-base font-semibold flex-none">
      <button onClick={() => setLang('es')} className={locale === 'es' ? 'opacity-100 font-extrabold' : 'opacity-60 hover:opacity-100'}>ES</button>
      <button onClick={() => setLang('en')} className={locale === 'en' ? 'opacity-100 font-extrabold' : 'opacity-60 hover:opacity-100'}>EN</button>
    </div>
  );
}
