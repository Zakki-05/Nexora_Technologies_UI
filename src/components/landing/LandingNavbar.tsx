'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Laptop, Menu, Moon, Sun, X } from 'lucide-react';
import { NextLogo } from '@/components/layout/NextLogo';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme, type ThemeMode } from '@/providers/ThemeProvider';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Nexora AI', href: '#nexora-ai' },
  { label: 'Security', href: '#security' },
  { label: 'FAQ', href: '#faq' },
];

export function LandingNavbar() {
  const { user, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const themeBtns: Array<{ mode: ThemeMode; label: string; icon: React.ReactNode }> = [
    { mode: 'light', label: 'Light theme', icon: <Sun className="w-3.5 h-3.5" /> },
    { mode: 'dark', label: 'Dark theme', icon: <Moon className="w-3.5 h-3.5" /> },
    { mode: 'system', label: 'System theme', icon: <Laptop className="w-3.5 h-3.5" /> },
  ];

  const portalHref = user ? (isAdmin ? '/admin' : '/employee') : '/login';

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--surface)]/85 backdrop-blur-xl border-b border-[var(--border)] shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <NextLogo size="md" href="/" showTagline={false} />

        <nav className="hidden md:flex items-center gap-6" aria-label="Marketing navigation">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <div
            className="inline-flex items-center p-0.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]"
            role="group"
            aria-label="Theme mode"
          >
            {themeBtns.map((b) => (
              <button
                key={b.mode}
                type="button"
                onClick={() => setTheme(b.mode)}
                aria-label={b.label}
                title={b.label}
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === b.mode
                    ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {b.icon}
              </button>
            ))}
          </div>

          <Link
            href="/login"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            Login
          </Link>

          <Link
            href={portalHref}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white text-xs font-semibold shadow-md shadow-blue-500/25 hover:opacity-95 transition-opacity"
          >
            <span>{user ? 'Open Workspace' : 'Get Started'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden p-2 rounded-xl border border-[var(--border)] text-[var(--text-primary)]"
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold"
            >
              Login
            </Link>
            <Link
              href={portalHref}
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center py-2.5 rounded-xl bg-[#3B82F6] text-white text-xs font-semibold"
            >
              {user ? 'Workspace' : 'Get Started'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
