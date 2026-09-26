import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  // Aplica a todo excepto archivos internos de Next.js, la API y archivos estáticos.
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
