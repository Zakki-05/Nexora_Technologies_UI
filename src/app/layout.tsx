import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AppProviders } from '@/providers/AppProviders';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Nexora Workforce 3.0 | The Future of Workforce Management',
    template: '%s | Nexora Workforce',
  },
  description:
    'Nexora Workforce 3.0 by Nexora Technologies — Manage people, multi-session attendance, 10 corporate leave ledgers, Indian statutory payroll, and Nexora AI through one connected enterprise platform.',
  applicationName: 'Nexora Workforce',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nexora EMS',
  },
};

export const viewport: Viewport = {
  themeColor: '#05070D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased selection:bg-[#3B82F6] selection:text-white">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
