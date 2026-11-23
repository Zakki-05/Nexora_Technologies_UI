import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendance';
import { Card, Badge, StatCard } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';
import {
  CalendarCheck,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  FileText,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const EmployeeAttendance = () => {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayRecord, setTodayRecord] = useState(null);
  const [punching, setPunching] = useState(false);

  // Month & Year Filter
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchToday();
  }, []);

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth, selectedYear]);

  const fetchToday = async () => {
    try {
      const res = await attendanceApi.getTodayAttendance();
      setTodayRecord(res);
    } catch (err) {
      console.error('Error fetching today record', err);
    }
  };

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const [histRes, sumRes] = await Promise.all([
        attendanceApi.getMyAttendanceHistory({
          page: 1,
          size: 100,
        }),
        attendanceApi.getMyMonthlySummary(selectedMonth, selectedYear),
      ]);
      setHistory(histRes.items || []);
      setSummary(sumRes);
    } catch (err) {
      console.error('Failed to load attendance', err);
      toast.error('Failed to load attendance history');
    } finally {
      setLoading(false);
    }
  };

  const handlePunch = async (action) => {
    setPunching(true);
    setTodayRecord((prev) => ({
      ...prev,
      is_punched_in: action === 'in',
      check_in: prev?.check_in || (action === 'in' ? new Date().toTimeString().split(' ')[0] : prev?.check_in),
      check_out: action === 'out' ? new Date().toTimeString().split(' ')[0] : null,
    }));
    try {
      if (action === 'in') {
        const res = await attendanceApi.checkIn();
        toast.success(res.is_late ? 'Checked in (Late Arrival)' : 'Punched in successfully!');
      } else {
        const res = await attendanceApi.checkOut();
        const hrs = res.working_hours ?? res.work_hours ?? 0;
        toast.success(`Punched out! Working hours: ${Number(hrs).toFixed(2)}h`);
      }
      await fetchToday();
      fetchAttendanceData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Punch action failed');
      await fetchToday();
    } finally {
      setPunching(false);
    }
  };

  const isCheckedIn = !!todayRecord?.check_in;
  const isCurrentlyWorking = todayRecord?.is_punched_in ?? (todayRecord?.sessions?.some((s) => !s.punch_out) || (isCheckedIn && !todayRecord?.check_out));

  return (
    <div className="space-y-6">
      {/* Header & Quick Punch */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Attendance Record
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review punch records, working hours, and monthly attendance statistics.
          </p>
        </div>

        {/* Quick Punch Action */}
        <div className="flex items-center space-x-2">
          {!isCheckedIn || !isCurrentlyWorking ? (
            <Button
              variant="primary"
              icon={Clock}
              onClick={() => handlePunch('in')}
              loading={punching}
              className="text-xs"
            >
              {isCheckedIn ? 'Resume Shift / Punch In' : 'Punch In Today'}
            </Button>
          ) : (
            <Button
              variant="danger"
              icon={Clock}
              onClick={() => handlePunch('out')}
              loading={punching}
              className="text-xs"
            >
              Punch Out Today
            </Button>
          )}
        </div>
      </div>

      {/* Monthly Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Present Days"
          value={summary?.present_days || 0}
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="Late Arrivals"
          value={summary?.late_days || 0}
          icon={AlertCircle}
          color="amber"
        />
        <StatCard
          title="Half Days"
          value={summary?.half_days || 0}
          icon={Clock}
          color="sky"
        />
        <StatCard
          title="Total Hours"
          value={`${(summary?.total_working_hours || 0).toFixed(1)}h`}
          icon={CalendarCheck}
          color="purple"
        />
      </div>

      {/* Filter Controls */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
              Filter by Period
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-24 text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      </Card>

      {/* Attendance History Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : history.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No Attendance Logs"
            description="You have no recorded attendance entries for this period."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Punch In</th>
                  <th className="p-3.5">Punch Out</th>
                  <th className="p-3.5 text-right">Working Hours</th>
                  <th className="p-3.5 text-center">Late Arrival</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                      {formatDate(record.date)}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono">
                      {record.check_in
                        ? new Date(record.check_in).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '--:--'}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono">
                      {record.check_out
                        ? new Date(record.check_out).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '--:--'}
                    </td>
                    <td className="p-3.5 text-right font-medium text-slate-900 dark:text-white">
                      {(record.working_hours ?? record.work_hours)
                        ? `${Number(record.working_hours ?? record.work_hours).toFixed(2)} hrs`
                        : '--'}
                    </td>
                    <td className="p-3.5 text-center">
                      {record.is_late ? (
                        <Badge variant="warning">Late</Badge>
                      ) : (
                        <span className="text-slate-400">On Time</span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <Badge
                        variant={
                          record.status === 'PRESENT'
                            ? 'success'
                            : record.status === 'HALF_DAY'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {record.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
