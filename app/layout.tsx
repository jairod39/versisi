import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Versisi',
  description: 'Versisi — un juego para conocer a alguien.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>;
}
