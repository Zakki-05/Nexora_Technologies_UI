'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { NextSidebar } from '@/components/layout/NextSidebar';
import { NextNavbar } from '@/components/layout/NextNavbar';
import { NextMobileBottomNav } from '@/components/layout/NextMobileBottomNav';
import { NexoraCopilot } from '@/components/shared/NexoraCopilot';

interface DashboardShellProps {
  requireAdmin?: boolean;
  children: React.ReactNode;
}

export function DashboardShell({ requireAdmin = false, children }: DashboardShellProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div className="h-screen w-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#060D1F]">
        <div className="w-10 h-10 rounded-full border-4 border-[#2563EB]/20 border-t-[#2563EB] animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-[#F8FAFC] dark:bg-[#060D1F] transition-colors duration-300 overflow-hidden relative">
      <NextSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative z-10">
        <NextNavbar onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {children}
        </main>
      </div>
      <NextMobileBottomNav onOpenSidebar={() => setSidebarOpen(true)} />
      <NexoraCopilot />
    </div>
  );
}
