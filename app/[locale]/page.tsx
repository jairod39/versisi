import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export default async function Landing({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('landing');
  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <p className="text-coral font-display font-bold mb-3">{t('slogan')}</p>
      <h1 className="text-5xl font-extrabold mb-5 max-w-2xl">{t('title')}</h1>
      <p className="text-muted max-w-xl mb-8 text-lg">{t('sub')}</p>
      <div className="flex gap-3 flex-wrap">
        <a href={`/${locale}/create`} className="btn btn-primary">{t('cta')}</a>
        <a href={`/${locale}/feed`} className="btn">{t('explore')}</a>
      </div>

      <section className="mt-16 border-t border-line pt-10">
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
