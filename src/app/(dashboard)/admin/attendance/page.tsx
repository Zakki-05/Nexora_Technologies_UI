'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, StatusBadge, formatDateStr, triggerBlobDownload } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { FileSpreadsheet } from 'lucide-react';

export default function AdminAttendancePage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-attendance', page],
    queryFn: () => hrService.getAllAttendance({ page, size: 20 }),
  });

  const handleExport = async () => {
    try {
      const blob = await hrService.exportReportBlob('excel', 'attendance');
      triggerBlobDownload(blob, 'nexora_attendance.xlsx');
      toast.success('Attendance register exported');
    } catch {
      toast.error('Failed to export attendance');
    }
  };

  return (
    <DashboardShell requireAdmin>
      <PageHeader
        title="Attendance Management"
        subtitle="Multi-session attendance logs, check-in/out times, and working hours"
        actions={
          <button
            type="button"
            onClick={() => void handleExport()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel
          </button>
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
                  <th className="px-4 py-3.5">Employee ID</th>
                  <th className="px-4 py-3.5">Check In</th>
                  <th className="px-4 py-3.5">Check Out</th>
                  <th className="px-4 py-3.5">Hours</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data?.items || []).map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3 font-medium">{formatDateStr(row.date)}</td>
                    <td className="px-4 py-3 font-mono">{row.employee_name || `EMP #${row.employee_id}`}</td>
                    <td className="px-4 py-3">{row.check_in || '—'}</td>
                    <td className="px-4 py-3">{row.check_out || '—'}</td>
                    <td className="px-4 py-3 font-semibold">{row.work_hours ?? '0.00'} hrs</td>
                    <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.pages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs">
            <span className="text-slate-500">Page {data.page} of {data.pages}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 rounded border disabled:opacity-40">Prev</button>
              <button type="button" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded border disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
