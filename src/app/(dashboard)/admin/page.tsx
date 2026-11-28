'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, StatCard, StatusBadge, formatINR } from '@/components/shared/UiPrimitives';
import { DashboardSkeleton } from '@/components/feedback/NexoraSkeletons';
import { useAuth } from '@/providers/AuthProvider';
import { hrService } from '@/services/hrService';
import { aiService } from '@/features/ai/services/aiService';
import {
  Activity,
  Bot,
  Building2,
  CalendarCheck,
  CalendarDays,
  Clock,
  IndianRupee,
  ShieldCheck,
  Users,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { isSuperAdmin } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => hrService.getAdminDashboard(),
  });

  const { data: aiUsage } = useQuery({
    queryKey: ['superadmin-ai-usage'],
    queryFn: () => aiService.getUsage(),
    enabled: isSuperAdmin,
  });

  return (
    <DashboardShell requireAdmin>
      <PageHeader
        title={isSuperAdmin ? 'Platform Super Admin Overview' : 'Enterprise Workforce Overview'}
        subtitle="Real-time PostgreSQL workforce metrics, attendance rates, and department headcounts."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/employees"
              className="px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold hover:bg-[var(--surface-elevated)] transition-colors"
            >
              Directory
            </Link>
            <Link
              href="/ai"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white text-xs font-semibold shadow-sm"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Nexora Copilot</span>
            </Link>
          </div>
        }
      />

      {isLoading || !data ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 tabular-nums">
            <StatCard title="Total Employees" value={data.total_employees} subtitle={`${data.active_employees} active`} icon={Users} accent="blue" />
            <StatCard title="Departments" value={data.total_departments} subtitle="Active corporate units" icon={Building2} accent="violet" />
            <StatCard title="Today's Attendance" value={`${data.attendance_rate}%`} subtitle={`${data.today_present} present, ${data.today_late} late`} icon={CalendarCheck} accent="emerald" />
            <StatCard title="Pending Leaves" value={data.pending_leaves} subtitle={`${data.total_leaves} total requests`} icon={CalendarDays} accent="amber" />
            <StatCard title="Monthly Payroll" value={formatINR(data.monthly_payroll)} subtitle="Active base payroll" icon={IndianRupee} accent="blue" />
            <StatCard title="Late Arrivals Today" value={data.today_late} subtitle="Post grace-period punches" icon={Clock} accent="rose" />
          </div>

          {isSuperAdmin && aiUsage && (
            <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-500 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[var(--text-primary)]">
                    Platform Governance &amp; AI Telemetry
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {aiUsage.total_requests} AI requests &middot; {aiUsage.total_tokens.toLocaleString()} total tokens &middot; {aiUsage.recent_audits.length} recent audit events
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/audit-logs"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-elevated)]"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Audit Logs</span>
                </Link>
                <Link
                  href="/admin/ai-settings"
                  className="px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-semibold"
                >
                  AI Settings
                </Link>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <h2 className="text-base font-bold text-[var(--text-primary)] mb-4">Top Departments by Headcount</h2>
              <div className="space-y-3">
                {(data.department_distribution || []).slice(0, 8).map((dept) => {
                  const pct = data.total_employees > 0 ? Math.min(100, Math.round((dept.count / data.total_employees) * 100)) : 0;
                  return (
                    <div key={dept.department_id}>
                      <div className="flex justify-between text-xs font-semibold mb-1 tabular-nums">
                        <span className="text-[var(--text-primary)]">{dept.name}</span>
                        <span className="text-[var(--text-secondary)]">{dept.count} staff</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--surface-elevated)] overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]" style={{ width: `${Math.max(pct, 4)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <h2 className="text-base font-bold text-[var(--text-primary)] mb-4">Recent Leave Requests</h2>
              <div className="divide-y divide-[var(--border)]">
                {(data.recent_leaves || []).length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)] py-6 text-center">No recent leave requests.</p>
                ) : (
                  (data.recent_leaves || []).map((lv) => (
                    <div key={lv.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[var(--text-primary)]">{lv.employee_name}</p>
                        <p className="text-[var(--text-secondary)]">{lv.leave_type} &bull; {lv.days_count} day(s)</p>
                      </div>
                      <StatusBadge status={lv.status} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
