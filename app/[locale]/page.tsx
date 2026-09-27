import { getTranslations } from 'next-intl/server';
import SampleScenes from '@/components/SampleScenes';

export default async function Landing({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('landing');
  return (
    <div className="max-w-5xl mx-auto px-5">
      <section className="grid md:grid-cols-[1.05fr,1fr] gap-10 md:gap-12 items-center pt-14 pb-10">
        <div>
          <span className="inline-block bg-sun text-[#221830] font-display font-extrabold text-sm px-4 py-1.5 rounded-full border-[3px] border-ink -rotate-2 mb-4">
            {t('slogan')}
          </span>
          <h1 className="text-6xl leading-[0.95] font-extrabold mb-5">{t('title')}</h1>
          <p className="text-muted max-w-xl mb-8 text-lg">{t('sub')}</p>
          <div className="flex gap-3 flex-wrap">
            <a href="/create" className="btn btn-primary">{t('cta')}</a>
            <a href="/feed" className="btn">{t('explore')}</a>
          </div>
        </div>
        <div>
          <SampleScenes locale={locale} />
          <p className="text-center text-muted text-xs mt-4">
            {locale === 'en'
              ? 'Sample illustrations — no real photos yet, this is what the game creates.'
              : 'Ilustraciones de ejemplo, sin fotos reales todavía: esto es lo que crea el juego.'}
          </p>
        </div>
      </section>

      <section className="mt-6 border-t border-line pt-10 pb-16">
        <h2 className="text-2xl font-extrabold mb-5">{t('safeTitle')}</h2>
        <ul className="grid gap-3 max-w-xl">
          <li>✅ {t('safe1')}</li>
          <li>✅ {t('safe2')}</li>
          <li>✅ {t('safe3')}</li>
          <li>✅ {t('safe4')}</li>
        </ul>
      </section>
    </div>
  );
}
