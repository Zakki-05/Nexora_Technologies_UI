import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { AppProviders } from '@/providers/AppProviders';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Nexora Workforce | Enterprise Workforce Management',
    template: '%s | Nexora Workforce',
  },
  description:
    'Nexora Workforce — Enterprise Workforce Management. Anywhere. On Any Device. Multi-session attendance, 10 corporate leave ledgers, and Indian statutory payroll by Nexora Technologies.',
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
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-[#F8FAFC] text-[#0F172A] antialiased dark:bg-[#060D1F] dark:text-[#F8FAFC] font-sans selection:bg-[#2563EB] selection:text-white">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
