'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, formatDateStr } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { Sparkles, Plus } from 'lucide-react';

export default function AdminHolidaysPage() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['holidays'],
    queryFn: () => hrService.getHolidays(),
  });

  const createMutation = useMutation({
    mutationFn: () => hrService.createHoliday({ name, date, holiday_type: 'NATIONAL' }),
    onSuccess: () => {
      toast.success('Holiday added');
      setName('');
      setDate('');
      void queryClient.invalidateQueries({ queryKey: ['holidays'] });
    },
  });

  const items = Array.isArray(data) ? data : data?.items || [];

  return (
    <DashboardShell requireAdmin>
      <PageHeader title="Company Holidays" subtitle="Configure national and corporate holiday calendar" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name && date) createMutation.mutate();
        }}
        className="mb-6 p-4 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 flex flex-wrap gap-3 items-end"
      >
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-bold mb-1">Holiday Name</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-xs" />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">Date</label>
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-xs" />
        </div>
        <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold">
          <Plus className="w-4 h-4" /> Add Holiday
        </button>
      </form>

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
                <p className="text-sm font-bold text-slate-900 dark:text-white">{h.name}</p>
                <p className="text-xs text-slate-500">{formatDateStr(h.date)} &bull; {h.holiday_type || 'PUBLIC'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
