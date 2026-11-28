'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, StatCard } from '@/components/shared/UiPrimitives';
import { DashboardSkeleton } from '@/components/feedback/NexoraSkeletons';
import { useAuth } from '@/providers/AuthProvider';
import { hrService } from '@/services/hrService';
import { Bot, CalendarCheck, CalendarDays, IndianRupee, Play, Receipt, Square } from 'lucide-react';

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
  const workedHours = Number(liveStatus?.work_hours ?? 0);
  const sessionsCount = Number(liveStatus?.sessions_count ?? 0);
  const breakMinutes = Number(liveStatus?.break_minutes ?? 0);
  const ringPct = Math.min(100, Math.round((workedHours / 8) * 100));

  return (
    <DashboardShell>
      <PageHeader
        title={`Welcome, ${user?.employee?.full_name || user?.username || 'Team Member'}`}
        subtitle={`Employee Code: ${user?.employee?.employee_code || 'N/A'} • ${user?.employee?.position || 'Staff'}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isPunchedIn || punchInMutation.isPending}
              onClick={() => punchInMutation.mutate()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition-colors"
            >
              <Play className="w-4 h-4" /> Punch In
            </button>
            <button
              type="button"
              disabled={!isPunchedIn || punchOutMutation.isPending}
              onClick={() => punchOutMutation.mutate()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-bold transition-colors"
            >
              <Square className="w-4 h-4" /> Punch Out
            </button>
          </div>
        }
      />

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90" aria-hidden="true">
                  <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="6" fill="none" className="text-[var(--surface-elevated)]" />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke={isPunchedIn ? '#10B981' : '#3B82F6'}
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={163.36}
                    strokeDashoffset={163.36 * (1 - ringPct / 100)}
                  />
                </svg>
                <span className="absolute font-mono text-xs font-bold tabular-nums">{workedHours}h</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Today&apos;s Attendance Control
                </p>
                <p className="text-lg font-bold text-[var(--text-primary)]">
                  {isPunchedIn ? 'Checked In & Active' : 'Not Checked In'}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Sessions today: {sessionsCount} &middot; Target: 8h shift
                </p>
              </div>
            </div>

            <Link
              href="/ai"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white text-xs font-semibold shadow-sm"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Nexora Copilot</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
            <StatCard title="Today's Status" value={isPunchedIn ? 'Punched In' : 'Checked Out'} subtitle={`${sessionsCount} session(s) today`} icon={CalendarCheck} accent={isPunchedIn ? 'emerald' : 'blue'} />
            <StatCard title="Worked Hours" value={`${workedHours} hrs`} subtitle={`Break: ${breakMinutes} mins`} icon={CalendarCheck} accent="blue" />
            <Link href="/employee/apply-leave" className="block hover:scale-[1.01] transition-transform">
              <StatCard title="Leave Portal" value="Apply Now" subtitle="View 10 corporate ledgers" icon={CalendarDays} accent="violet" />
            </Link>
            <Link href="/employee/salary" className="block hover:scale-[1.01] transition-transform">
              <StatCard title="Salary & Expenses" value="Payslips" subtitle="EPF / ESIC & Claims" icon={IndianRupee} accent="amber" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-wrap gap-3">
            <Link href="/employee/attendance" className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-elevated)]">My Attendance Logs</Link>
            <Link href="/employee/leaves" className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-elevated)]">Leave History</Link>
            <Link href="/employee/expenses" className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold inline-flex items-center gap-1 hover:bg-[var(--surface-elevated)]"><Receipt className="w-3.5 h-3.5" /> Expense Claims</Link>
            <Link href="/employee/holidays" className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-elevated)]">Company Holidays</Link>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
