import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export default getRequestConfig(async () => {
  const cookieLocale = cookies().get('NEXT_LOCALE')?.value;
  let locale: Locale = defaultLocale;
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    locale = cookieLocale as Locale;
  } else {
    const accept = headers().get('accept-language') || '';
    if (accept.toLowerCase().startsWith('en')) locale = 'en';
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
