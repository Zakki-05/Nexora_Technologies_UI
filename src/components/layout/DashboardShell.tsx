'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { NextSidebar } from '@/components/layout/NextSidebar';
import { NextNavbar } from '@/components/layout/NextNavbar';
import { NextMobileBottomNav } from '@/components/layout/NextMobileBottomNav';
import { NexoraCopilot } from '@/components/shared/NexoraCopilot';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { DashboardSkeleton } from '@/components/feedback/NexoraSkeletons';

interface DashboardShellProps {
  requireAdmin?: boolean;
  children: React.ReactNode;
}

export function DashboardShell({ requireAdmin = false, children }: DashboardShellProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (requireAdmin && !isAdmin) {
      router.replace('/employee');
    }
  }, [loading, user, requireAdmin, isAdmin, router]);

  if (loading || !user || (requireAdmin && !isAdmin)) {
    return (
      <div className="min-h-screen w-full p-6 sm:p-10 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-[var(--background)] transition-colors duration-300 overflow-hidden relative">
      <NextSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative z-10">
        <NextNavbar
          onToggleSidebar={() => setSidebarOpen(true)}
          onOpenCommandPalette={() => setCommandOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {children}
        </main>
      </div>
      <NextMobileBottomNav onOpenSidebar={() => setSidebarOpen(true)} />
      <NexoraCopilot />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}
