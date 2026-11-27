'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { Sun, Moon, Menu, ChevronRight, Building2, LogOut } from 'lucide-react';

export function NextNavbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const pathname = usePathname();

  const segments = (pathname || '/').split('/').filter(Boolean);
  const breadcrumbTitle = segments.length > 1 ? (segments[1] ?? 'overview').replace(/-/g, ' ').toUpperCase() : 'OVERVIEW';

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#060D1F]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors safe-top">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center space-x-2 text-xs">
            <span className="font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#06B6D4]">
              Nexora EMS
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {isAdmin ? 'Admin Portal' : 'Employee Portal'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500 dark:text-[#94A3B8]">{breadcrumbTitle}</span>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Nexora Technologies Inc.</span>
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold ml-1">
              Enterprise
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <span>{user.employee?.full_name || user.username}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => void logout()}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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
