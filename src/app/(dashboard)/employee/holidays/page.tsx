'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, formatDateStr } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { Sparkles } from 'lucide-react';

export default function EmployeeHolidaysPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['company-holidays'],
    queryFn: () => hrService.getHolidays(),
  });

  const items = Array.isArray(data) ? data : data?.items || [];

  return (
    <DashboardShell>
      <PageHeader title="Company Holidays" subtitle="Official national and corporate holidays" />

      {isLoading ? (
        <PanelSpinner />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((h) => (
            <div key={h.id} className="p-4 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">{h.name}</p>
                <p className="text-xs text-slate-500">{formatDateStr(h.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
