import type { Metadata } from 'next';
import { Newsreader, Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Organic Habits',
  description: 'Cultivate mindfulness. Track habits with your community.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`light ${newsreader.variable} ${jakarta.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen pb-32 overflow-x-hidden bg-surface">
        <AuthProvider>
          <div className="max-w-[430px] mx-auto relative min-h-screen bg-surface shadow-[0_0_80px_rgba(0,0,0,0.06)]">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
