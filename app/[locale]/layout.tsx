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
            <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
              <a href={`/${locale}`} className="font-display font-extrabold text-xl">Versisi</a>
              <nav className="flex gap-3 text-sm">
                <a href="/es" className="opacity-70 hover:opacity-100">ES</a>
                <a href="/en" className="opacity-70 hover:opacity-100">EN</a>
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
