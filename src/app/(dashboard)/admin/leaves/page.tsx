'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, StatusBadge, formatDateStr } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { Check, X } from 'lucide-react';

export default function AdminLeavesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-leaves'],
    queryFn: () => hrService.getAllLeaves({ page: 1, size: 50 }),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'APPROVED' | 'REJECTED' }) =>
      hrService.reviewLeave(id, status, status === 'REJECTED' ? 'Reviewed by HR Admin' : undefined),
    onSuccess: () => {
      toast.success('Leave request updated');
      void queryClient.invalidateQueries({ queryKey: ['admin-leaves'] });
    },
  });

  return (
    <DashboardShell requireAdmin>
      <PageHeader title="Leave Requests" subtitle="Approve or reject employee leave applications" />

      <div className="bg-white dark:bg-[#111C32] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <PanelSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0B1426] text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Employee</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Dates</th>
                  <th className="px-4 py-3.5">Days</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data?.items || []).map((lv) => (
                  <tr key={lv.id}>
                    <td className="px-4 py-3 font-bold">{lv.employee_name || `EMP #${lv.employee_id}`}</td>
                    <td className="px-4 py-3">{lv.leave_type}</td>
                    <td className="px-4 py-3">{formatDateStr(lv.start_date)} – {formatDateStr(lv.end_date)}</td>
                    <td className="px-4 py-3">{lv.days_count}</td>
                    <td className="px-4 py-3"><StatusBadge status={lv.status} /></td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {lv.status === 'PENDING' && (
                        <>
                          <button
                            type="button"
                            onClick={() => reviewMutation.mutate({ id: lv.id, status: 'APPROVED' })}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => reviewMutation.mutate({ id: lv.id, status: 'REJECTED' })}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
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
