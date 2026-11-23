import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api/dashboard';
import { useAuth } from '../../context/AuthContext';
import { Card, Badge, StatCard } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';
import { LiveTimerWidget } from '../../components/ui/LiveTimerWidget';
import {
  CalendarDays,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Bell,
  CheckCircle2,
  Calendar,
  Clock,
  Briefcase,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const EmployeeOverview = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardApi.getEmployeeStats();
      setData(res);
    } catch (err) {
      console.error('Failed to load employee dashboard', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <LoadingSpinner size="lg" />
        <p className="text-xs font-semibold text-slate-500 dark:text-[#94A3B8]">
          Loading Nexora Employee Workspace...
        </p>
      </div>
    );
  }

  const employee = data?.employee;
  const monthSummary = data?.month_summary;
  const balances = data?.leave_balances || [];
  const holidays = data?.upcoming_holidays || [];
  const announcements = data?.recent_announcements || [];

  const getPriorityBadge = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'URGENT':
        return <Badge variant="danger">URGENT</Badge>;
      case 'HIGH':
        return <Badge variant="warning">HIGH</Badge>;
      default:
        return <Badge variant="info">INFO</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#06B6D4] text-white p-6 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-sm">
                Nexora Self-Service Workspace
              </span>
              <span className="text-blue-100 text-xs font-mono font-medium">
                {employee?.employee_code || user?.email}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              Welcome back, {employee?.full_name || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl font-medium">
              {employee?.position || 'Staff Specialist'} &bull;{' '}
              {employee?.department?.name || employee?.department || 'General Department'}
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/25 text-center shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-blue-100 font-bold">
              Today's Schedule
            </p>
            <p className="text-sm font-extrabold text-white mt-0.5">
              {new Date().toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Full-Width Executive Live Attendance & Break Command Center */}
      <div className="w-full">
        <LiveTimerWidget onStatusChange={fetchDashboard} />
      </div>

      {/* 3. Corporate Leave Balances & Quotas */}
      <Card
        title="Time Off & Corporate Leave Quotas"
        subtitle={`Annual entitlements & real-time available balances for ${new Date().getFullYear()}`}
        headerAction={
          <Link to="/employee/apply-leave">
            <Button variant="primary" size="sm" className="text-xs shadow-md shadow-[#2563EB]/25">
              <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
              <span>Apply for Leave</span>
            </Button>
          </Link>
        }
      >
        {balances.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            No leave balance allocated yet. Please contact Human Resources.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {balances.map((b) => {
              const usedPct =
                b.total_days > 0
                  ? Math.min(100, Math.round((b.used_days / b.total_days) * 100))
                  : 0;
              return (
                <div
                  key={b.id || b.code || b.leave_type}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B1426] flex flex-col justify-between hover:border-[#2563EB]/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {b.leave_type}
                      </p>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                          b.is_paid !== false
                            ? 'bg-blue-500/10 text-[#2563EB] dark:text-[#06B6D4]'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {b.is_paid !== false ? 'PAID' : 'UNPAID'}
                      </span>
                    </div>
                    <div className="flex items-baseline space-x-1 mt-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white font-sans">
                        {b.remaining_days ?? b.total_days - b.used_days}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        / {b.total_days} d available
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          usedPct > 80
                            ? 'bg-rose-500'
                            : usedPct > 50
                            ? 'bg-amber-500'
                            : 'bg-[#2563EB]'
                        }`}
                        style={{ width: `${usedPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-mono">
                      <span>Used: {b.used_days || 0}d</span>
                      {b.pending_days > 0 && (
                        <span className="text-amber-500 font-semibold font-sans">
                          ({b.pending_days}d reserved)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* 4. Grid: Monthly Attendance Summary & Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Summary & Holidays (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Monthly Attendance Quick Stats */}
          {monthSummary && (
            <Card
              title="This Month's Attendance Summary"
              subtitle="Overview of shift completion and verified working hours"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-[11px] text-[#2563EB] dark:text-[#38BDF8] font-bold uppercase">
                    Present Days
                  </p>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {monthSummary.present_days || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold uppercase">
                    Late Arrivals
                  </p>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {monthSummary.late_days || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-[11px] text-[#0891B2] dark:text-[#06B6D4] font-bold uppercase">
                    Half Days
                  </p>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {monthSummary.half_days || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold uppercase">
                    Hours Worked
                  </p>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                    {(monthSummary.total_working_hours || 0).toFixed(1)}h
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Upcoming Holidays */}
          <Card
            title="Upcoming Company Holidays"
            subtitle="Official scheduled non-working days"
            headerAction={
              <Link
                to="/employee/holidays"
                className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] dark:text-[#06B6D4] inline-flex items-center gap-1"
              >
                <span>All Holidays</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            {holidays.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                No upcoming holidays scheduled in the next 30 days.
              </p>
            ) : (
              <div className="space-y-2.5">
                {holidays.slice(0, 4).map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0B1426] border border-slate-200/70 dark:border-slate-800"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-[#2563EB]/10 text-[#2563EB] dark:text-[#06B6D4]">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {h.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-[#94A3B8]">
                          {h.description || (h.is_optional ? 'Optional Holiday' : 'Public Holiday')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="primary">{formatDate(h.date)}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Company Bulletins & Announcements (5 cols) */}
        <div className="lg:col-span-5">
          <Card
            title="Bulletins & Notices"
            subtitle="Corporate announcements and leadership broadcast updates"
          >
            {announcements.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">
                No announcements published recently.
              </p>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 4).map((a) => (
                  <div
                    key={a.id}
                    className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1426]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(a.priority)}
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {a.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {a.created_at ? new Date(a.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-2 line-clamp-3">
                      {a.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
