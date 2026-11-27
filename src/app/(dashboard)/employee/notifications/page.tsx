'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, formatDateStr } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { Bell, CheckCheck } from 'lucide-react';

export default function EmployeeNotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-notifications'],
    queryFn: () => hrService.getMyNotifications({ page: 1, size: 30 }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => hrService.markAllNotificationsRead(),
    onSuccess: () => {
      toast.success('All notifications marked as read');
      void queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
    },
  });

  return (
    <DashboardShell>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated on approvals, payroll, and company broadcasts"
        actions={
          <button
            type="button"
            onClick={() => markAllMutation.mutate()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
          >
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </button>
        }
      />

      {isLoading ? (
        <PanelSpinner />
      ) : (
        <div className="space-y-3">
          {(data?.items || []).map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                n.is_read
                  ? 'bg-white dark:bg-[#111C32] border-slate-200 dark:border-slate-800'
                  : 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
              }`}
            >
              <Bell className="w-4 h-4 text-[#2563EB] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{n.message}</p>
                <p className="text-[10px] text-slate-400 mt-1">{formatDateStr(n.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
