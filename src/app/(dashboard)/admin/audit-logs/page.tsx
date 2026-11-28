'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, formatDateStr } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';

export default function AdminAuditLogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => hrService.getAuditLogs({ page: 1, size: 50 }),
  });

  return (
    <DashboardShell requireAdmin>
      <PageHeader title="System Audit Logs" subtitle="Immutable compliance trail of administrative and security events" />

      <div className="bg-white dark:bg-[#111C32] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <PanelSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0B1426] text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Timestamp</th>
                  <th className="px-4 py-3.5">Action</th>
                  <th className="px-4 py-3.5">Actor</th>
                  <th className="px-4 py-3.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data?.items || []).map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 text-slate-500">{formatDateStr(log.created_at)}</td>
                    <td className="px-4 py-3 font-bold">{log.action}</td>
                    <td className="px-4 py-3">{log.user_email || 'System'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{log.details || '—'}</td>
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
