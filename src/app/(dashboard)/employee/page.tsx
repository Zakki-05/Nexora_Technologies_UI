'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, StatCard } from '@/components/shared/UiPrimitives';
import { useAuth } from '@/providers/AuthProvider';
import { hrService } from '@/services/hrService';
import { CalendarCheck, CalendarDays, IndianRupee, Receipt, Play, Square } from 'lucide-react';

export default function EmployeeOverviewPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: liveStatus, isLoading } = useQuery({
    queryKey: ['emp-live-status'],
    queryFn: () => hrService.getLiveAttendanceStatus(),
  });

  const punchInMutation = useMutation({
    mutationFn: () => hrService.punchIn(),
    onSuccess: () => {
      toast.success('Punched in successfully');
      void queryClient.invalidateQueries({ queryKey: ['emp-live-status'] });
    },
  });

  const punchOutMutation = useMutation({
    mutationFn: () => hrService.punchOut(),
    onSuccess: () => {
      toast.success('Punched out successfully');
      void queryClient.invalidateQueries({ queryKey: ['emp-live-status'] });
    },
  });

  const isPunchedIn = Boolean(liveStatus?.is_punched_in);

  return (
    <DashboardShell>
      <PageHeader
        title={`Welcome, ${user?.employee?.full_name || user?.username || 'Team Member'}`}
        subtitle={`Employee Code: ${user?.employee?.employee_code || 'N/A'} • ${user?.employee?.position || 'Staff'}`}
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isPunchedIn || punchInMutation.isPending}
              onClick={() => punchInMutation.mutate()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold"
            >
              <Play className="w-4 h-4" /> Punch In
            </button>
            <button
              type="button"
              disabled={!isPunchedIn || punchOutMutation.isPending}
              onClick={() => punchOutMutation.mutate()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-bold"
            >
              <Square className="w-4 h-4" /> Punch Out
            </button>
          </div>
        }
      />

      {isLoading ? (
        <PanelSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Attendance Status" value={isPunchedIn ? 'ACTIVE' : 'CLOCKED OUT'} icon={CalendarCheck} accent={isPunchedIn ? 'emerald' : 'blue'} />
          <StatCard title="Leave Management" value="10 Ledgers" subtitle="Self-service requests" icon={CalendarDays} accent="violet" />
          <StatCard title="Salary & Payslips" value="PDF Ready" subtitle="Statutory EPF/ESIC" icon={IndianRupee} accent="blue" />
          <StatCard title="Expense Claims" value="Submit & Track" subtitle="Reimbursements" icon={Receipt} accent="amber" />
        </div>
      )}

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Apply for Leave', href: '/employee/apply-leave' },
          { label: 'View My Salary Slips', href: '/employee/salary' },
          { label: 'Submit Expense Claim', href: '/employee/expenses' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="p-4 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 hover:border-[#2563EB] text-sm font-bold text-slate-800 dark:text-white transition"
          >
            {link.label} &rarr;
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
