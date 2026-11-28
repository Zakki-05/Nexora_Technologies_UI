'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, StatusBadge, formatDateStr } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';

export default function EmployeeLeavesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-leaves'],
    queryFn: () => hrService.getMyLeaves({ page: 1, size: 50 }),
  });

  return (
    <DashboardShell>
      <PageHeader
        title="My Leave History"
        subtitle="Track your submitted leave requests and approval status"
        actions={
          <Link href="/employee/apply-leave" className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold">
            Apply for Leave
          </Link>
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
                  <th className="px-4 py-3.5">Leave Type</th>
                  <th className="px-4 py-3.5">Dates</th>
                  <th className="px-4 py-3.5">Days</th>
                  <th className="px-4 py-3.5">Reason</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data?.items || []).map((lv) => (
                  <tr key={lv.id}>
                    <td className="px-4 py-3 font-bold">{lv.leave_type}</td>
                    <td className="px-4 py-3">{formatDateStr(lv.start_date)} – {formatDateStr(lv.end_date)}</td>
                    <td className="px-4 py-3">{lv.days_count}</td>
                    <td className="px-4 py-3 text-slate-500">{lv.reason || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={lv.status} /></td>
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
