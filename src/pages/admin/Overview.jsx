import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboard';
import { StatCard, Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Users,
  Building2,
  CalendarCheck,
  CalendarDays,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

export const AdminOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-3">
        <LoadingSpinner size="lg" />
        <p className="text-xs font-semibold text-slate-500 dark:text-[#94A3B8]">
          Loading Nexora Workforce Analytics...
        </p>
      </div>
    );
  }

  const chartData = stats?.department_distribution || [];
  const PIE_COLORS = ['#2563EB', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      {/* Top Personalized Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#2563EB]/10 text-[#2563EB] dark:text-[#06B6D4] mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Nexora EMS Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.employee?.full_name || user?.username || 'Administrator'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Real-time workforce intelligence, active attendance rates, and operational status
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <Link to="/admin/employees">
            <Button variant="primary" size="sm" className="flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Employee</span>
            </Button>
          </Link>
          <Link to="/admin/leaves">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Review Leaves</span>
            </Button>
          </Link>
          <Link to="/admin/reports">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Export Reports</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Workforce"
          value={stats?.total_employees || 0}
          subtitle={`${stats?.active_employees || 0} active employees on payroll`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Today's Attendance"
          value={`${stats?.attendance_rate || 0}%`}
          subtitle={`${stats?.today_present || 0} checked in (${stats?.today_late || 0} marked late)`}
          icon={CalendarCheck}
          color="cyan"
        />
        <StatCard
          title="Pending Leave Review"
          value={stats?.pending_leaves || 0}
          subtitle="Requests requiring admin decision"
          icon={CalendarDays}
          color="amber"
        />
        <StatCard
          title="Monthly Gross Payroll"
          value={formatCurrency(stats?.monthly_payroll || 0)}
          subtitle="Active salary allocation"
          icon={IndianRupee}
          color="emerald"
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution Bar Chart */}
        <div className="lg:col-span-2">
          <Card
            title="Department Workforce Distribution"
            subtitle="Personnel allocated across organization divisions"
          >
            {chartData.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                No department data available.
              </div>
            ) : (
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                    <XAxis
                      dataKey="name"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      angle={-15}
                      textAnchor="end"
                      height={40}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111C32',
                        borderColor: '#1E293B',
                        borderRadius: '0.75rem',
                        color: '#F8FAFC',
                        fontSize: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                      }}
                    />
                    <Bar
                      dataKey="count"
                      name="Employees"
                      fill="#2563EB"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        {/* Recent Leave Requests List */}
        <div>
          <Card
            title="Pending Leave Approvals"
            subtitle="Recent applications awaiting action"
            headerAction={
              <Link
                to="/admin/leaves"
                className="text-xs font-bold text-[#2563EB] dark:text-[#06B6D4] hover:underline inline-flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <div className="space-y-3">
              {(stats?.recent_leaves || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-12">
                  No pending leave applications.
                </p>
              ) : (
                stats.recent_leaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B1426] border border-slate-200/70 dark:border-slate-800 flex items-center justify-between hover:border-[#2563EB]/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1 mr-3">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {leave.employee?.full_name || 'Employee'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
                        {leave.leave_type || 'Leave'}: {formatDate(leave.start_date)} to {formatDate(leave.end_date)}
                      </p>
                    </div>
                    <Badge variant="warning">{leave.status}</Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
