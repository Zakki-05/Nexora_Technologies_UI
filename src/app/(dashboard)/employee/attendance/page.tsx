'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, StatusBadge, formatDateStr } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';

export default function EmployeeAttendancePage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-attendance'],
    queryFn: () => hrService.getMyAttendance({ page: 1, size: 30 }),
  });

  const punchIn = useMutation({
    mutationFn: () => hrService.punchIn(),
    onSuccess: () => {
      toast.success('Checked in');
      void queryClient.invalidateQueries({ queryKey: ['my-attendance'] });
    },
  });

  const punchOut = useMutation({
    mutationFn: () => hrService.punchOut(),
    onSuccess: () => {
      toast.success('Checked out');
      void queryClient.invalidateQueries({ queryKey: ['my-attendance'] });
    },
  });

  return (
    <DashboardShell>
      <PageHeader
        title="My Attendance"
        subtitle="Track your daily shifts, check-ins, and working hours"
        actions={
          <div className="flex gap-2">
            <button type="button" onClick={() => punchIn.mutate()} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">Punch In</button>
            <button type="button" onClick={() => punchOut.mutate()} className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold">Punch Out</button>
          </div>
        }
      />

      <div className="bg-white dark:bg-[#111C32] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <PanelSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0B1426] text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Check In</th>
                  <th className="px-4 py-3.5">Check Out</th>
                  <th className="px-4 py-3.5">Work Hours</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data?.items || []).map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-medium">{formatDateStr(r.date)}</td>
                    <td className="px-4 py-3">{r.check_in || '—'}</td>
                    <td className="px-4 py-3">{r.check_out || '—'}</td>
                    <td className="px-4 py-3 font-bold">{r.work_hours ?? '0.00'} hrs</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
