import type { Metadata } from 'next';
import { LandingExperience } from '@/components/landing/LandingExperience';

export const metadata: Metadata = {
  title: 'Nexora Workforce | Enterprise Workforce Management',
  description:
    'Nexora Workforce 3.0 by Nexora Technologies — Unified enterprise HR, multi-session attendance, 10 corporate leave ledgers, and Indian statutory payroll.',
  openGraph: {
    title: 'Nexora Workforce | Enterprise Workforce Management',
    description:
      'Enterprise Workforce Management. Anywhere. On Any Device. Powered by Next.js, FastAPI, and PostgreSQL.',
    type: 'website',
  },
};

export default function PublicLandingPage() {
  return <LandingExperience />;
}
