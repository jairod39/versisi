import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales } from '@/i18n/request';
import LanguageSwitcher from '@/components/LanguageSwitcher';
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
              <a href="/" className="font-display font-extrabold text-2xl flex-none">Versisi</a>
              <nav className="flex items-center gap-2 sm:gap-6 text-base font-semibold overflow-x-auto">
                <a href="/feed" className="px-3 py-1.5 rounded-full hover:bg-surface whitespace-nowrap">
                  {locale === 'en' ? 'Explore' : 'Explorar'}
                </a>
                <a href="/create" className="px-3 py-1.5 rounded-full hover:bg-surface whitespace-nowrap">
                  {locale === 'en' ? 'Create' : 'Crear reto'}
                </a>
                <a href="/dashboard" className="px-3 py-1.5 rounded-full hover:bg-surface whitespace-nowrap">
                  {locale === 'en' ? 'My requests' : 'Mis solicitudes'}
                </a>
              </nav>
              <LanguageSwitcher locale={locale} />
            </div>
          </header>
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
