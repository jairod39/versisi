import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales } from '@/i18n/request';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children, params: { locale },
}: { children: React.ReactNode; params: { locale: string } }) {
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <header className="sticky top-0 z-20 bg-bg border-b border-line">
            <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
              <a href={`/${locale}`} className="font-display font-extrabold text-2xl flex-none">Versisi</a>
              <nav className="flex items-center gap-2 sm:gap-6 text-base font-semibold overflow-x-auto">
                <a href={`/${locale}/feed`} className="px-3 py-1.5 rounded-full hover:bg-surface whitespace-nowrap">
                  {locale === 'en' ? 'Explore' : 'Explorar'}
                </a>
                <a href={`/${locale}/create`} className="px-3 py-1.5 rounded-full hover:bg-surface whitespace-nowrap">
                  {locale === 'en' ? 'Create' : 'Crear reto'}
                </a>
                <a href={`/${locale}/dashboard`} className="px-3 py-1.5 rounded-full hover:bg-surface whitespace-nowrap">
                  {locale === 'en' ? 'My requests' : 'Mis solicitudes'}
                </a>
              </nav>
              <div className="flex gap-3 text-base font-semibold flex-none">
                <a href="/es" className="opacity-70 hover:opacity-100">ES</a>
                <a href="/en" className="opacity-70 hover:opacity-100">EN</a>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
