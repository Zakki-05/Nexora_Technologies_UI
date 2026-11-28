'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Building2,
  ChevronRight,
  Laptop,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme, type ThemeMode } from '@/providers/ThemeProvider';

interface NextNavbarProps {
  onToggleSidebar: () => void;
  onOpenCommandPalette?: () => void;
}

export function NextNavbar({ onToggleSidebar, onOpenCommandPalette }: NextNavbarProps) {
  const { user, logout, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const segments = (pathname || '/').split('/').filter(Boolean);
  const breadcrumbTitle =
    segments.length > 1
      ? (segments[1] ?? 'overview').replace(/-/g, ' ').toUpperCase()
      : (segments[0] ?? 'overview').toUpperCase();

  const themeOptions: Array<{ mode: ThemeMode; label: string; icon: React.ReactNode }> = [
    { mode: 'light', label: 'Light theme', icon: <Sun className="w-3.5 h-3.5" /> },
    { mode: 'dark', label: 'Dark theme', icon: <Moon className="w-3.5 h-3.5" /> },
    { mode: 'system', label: 'System theme', icon: <Laptop className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[var(--surface)]/85 backdrop-blur-md border-b border-[var(--border)] transition-colors safe-top">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs truncate">
            <span className="font-bold uppercase tracking-wider text-[var(--primary)]">
              Nexora EMS
            </span>
            <span className="text-[var(--text-secondary)]">&bull;</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {isAdmin ? 'Admin Workspace' : 'Employee Workspace'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span className="font-medium text-[var(--text-secondary)]">{breadcrumbTitle}</span>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Nexora Technologies</span>
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--primary)] text-white font-bold ml-1">
              3.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Open command palette"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search or Jump...</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[10px] font-mono">
                Ctrl K
              </kbd>
            </button>
          )}

          {/* 3-way Theme Switcher */}
          <div
            className="inline-flex items-center p-0.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]"
            role="group"
            aria-label="Theme switcher"
          >
            {themeOptions.map((opt) => (
              <button
                key={opt.mode}
                type="button"
                onClick={() => setTheme(opt.mode)}
                aria-label={opt.label}
                title={opt.label}
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === opt.mode
                    ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {opt.icon}
              </button>
            ))}
          </div>

          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs font-semibold text-[var(--text-primary)]">
              <span>{user.employee?.full_name || user.username}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => void logout()}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
