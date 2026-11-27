'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, StatCard, StatusBadge, formatINR } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { Users, Building2, CalendarCheck, CalendarDays, IndianRupee, Clock } from 'lucide-react';

export default function AdminOverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => hrService.getAdminDashboard(),
  });

  return (
    <DashboardShell requireAdmin>
      <PageHeader
        title="Enterprise Workforce Overview"
        subtitle="Real-time PostgreSQL workforce metrics, attendance rates, and department headcounts."
      />

      {isLoading || !data ? (
        <PanelSpinner />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Total Employees" value={data.total_employees} subtitle={`${data.active_employees} active`} icon={Users} accent="blue" />
            <StatCard title="Departments" value={data.total_departments} subtitle="Active corporate units" icon={Building2} accent="violet" />
            <StatCard title="Today's Attendance" value={`${data.attendance_rate}%`} subtitle={`${data.today_present} present, ${data.today_late} late`} icon={CalendarCheck} accent="emerald" />
            <StatCard title="Pending Leaves" value={data.pending_leaves} subtitle={`${data.total_leaves} total requests`} icon={CalendarDays} accent="amber" />
            <StatCard title="Monthly Payroll" value={formatINR(data.monthly_payroll)} subtitle="Active base payroll" icon={IndianRupee} accent="blue" />
            <StatCard title="Late Arrivals Today" value={data.today_late} subtitle="Post grace-period punches" icon={Clock} accent="rose" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Top Departments by Headcount</h2>
              <div className="space-y-3">
                {(data.department_distribution || []).slice(0, 8).map((dept) => {
                  const pct = data.total_employees > 0 ? Math.min(100, Math.round((dept.count / data.total_employees) * 100)) : 0;
                  return (
                    <div key={dept.department_id}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-700 dark:text-slate-200">{dept.name}</span>
                        <span className="text-slate-500">{dept.count} staff</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${Math.max(pct, 4)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Recent Leave Requests</h2>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data.recent_leaves || []).length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No recent leave requests.</p>
                ) : (
                  (data.recent_leaves || []).map((lv) => (
                    <div key={lv.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{lv.employee_name}</p>
                        <p className="text-slate-500">{lv.leave_type} &bull; {lv.days_count} day(s)</p>
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
