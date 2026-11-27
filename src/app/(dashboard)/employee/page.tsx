'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function EmployeeDashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Employee Portal — Nexora EMS 3.0
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Next.js App Router employee shell active. Self-service attendance, leave, and salary modules are scheduled for Phase 6–7 migration.
        </p>
      </div>
    </DashboardShell>
  );
}
