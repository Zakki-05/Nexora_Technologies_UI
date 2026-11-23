import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { leaveApi } from '../../api/leaves';
import { Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/Modal';
import {
  CalendarDays,
  Send,
  AlertCircle,
  FileText,
  Clock,
  ArrowLeft,
  CheckCircle,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const EmployeeApplyLeave = () => {
  const navigate = useNavigate();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    leave_type: 'ANNUAL_LEAVE',
    start_date: '',
    end_date: '',
    reason: '',
    is_half_day: false,
    half_day_session: 'FIRST_HALF',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [typesRes, balancesRes] = await Promise.all([
        leaveApi.getLeaveTypes().catch(() => []),
        leaveApi.getMyLeaveBalances().catch(() => []),
      ]);

      const types = Array.isArray(typesRes) ? typesRes : typesRes.items || [];
      setLeaveTypes(types);

      if (types.length > 0) {
        setForm((prev) => ({ ...prev, leave_type: types[0].code }));
      }

      const balList = Array.isArray(balancesRes)
        ? balancesRes
        : balancesRes.type_balances || balancesRes.items || [];
      setBalances(balList);
    } catch (err) {
      console.error('Failed to load leave configuration', err);
      toast.error('Failed to load leave types');
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = () => {
    if (form.is_half_day) return 0.5;
    if (!form.start_date || !form.end_date) return 0;
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    if (end < start) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getSelectedTypeBalance = () => {
    if (!balances || balances.length === 0) return null;
    return (
      balances.find(
        (b) =>
          b.code === form.leave_type ||
          b.leave_type_code === form.leave_type ||
          b.leave_type === form.leave_type
      ) || null
    );
  };

  const selectedTypeInfo = leaveTypes.find((t) => t.code === form.leave_type);
  const selectedBalance = getSelectedTypeBalance();
  const daysCount = calculateDays();

  const handleStartDateChange = (val) => {
    setForm((prev) => ({
      ...prev,
      start_date: val,
      end_date: prev.is_half_day ? val : prev.end_date || val,
    }));
  };

  const handleHalfDayToggle = (checked) => {
    setForm((prev) => ({
      ...prev,
      is_half_day: checked,
      end_date: checked ? prev.start_date : prev.end_date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.start_date) {
      toast.error('Please select a start date');
      return;
    }

    if (!form.is_half_day && !form.end_date) {
      toast.error('Please select an end date');
      return;
    }

    if (!form.is_half_day && new Date(form.end_date) < new Date(form.start_date)) {
      toast.error('End date cannot precede start date');
      return;
    }

    if (!form.reason.trim()) {
      toast.error('Please provide a reason for the leave');
      return;
    }

    // Balance check for paid leaves
    if (selectedTypeInfo?.is_paid !== false && selectedBalance) {
      const avail = selectedBalance.available ?? selectedBalance.remaining_days ?? 0;
      if (avail < daysCount) {
        toast.error(
          `Insufficient ${selectedTypeInfo?.name || form.leave_type} balance. Available: ${avail} days, Requested: ${daysCount} days.`
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        leave_type: form.leave_type,
        start_date: form.start_date,
        end_date: form.is_half_day ? form.start_date : form.end_date,
        reason: form.reason,
        is_half_day: form.is_half_day,
        half_day_session: form.is_half_day ? form.half_day_session : null,
      };

      await leaveApi.applyLeave(payload);
      toast.success('Leave application submitted successfully!');
      navigate('/employee/leaves');
    } catch (err) {
      console.error('Apply leave error', err);
      toast.error(err.response?.data?.detail || 'Failed to submit leave application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              to="/employee/leaves"
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Leave Requests</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Apply for Leave
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Submit a formal corporate time-off request with policy validation and real-time quota reservation.
          </p>
        </div>
      </div>

      {/* Leave Quota Cards */}
      <Card
        title="Your Corporate Leave Entitlements"
        subtitle={`Available balance for year ${new Date().getFullYear()}`}
      >
        {balances.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            No quota configured. Unpaid leave can still be submitted.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {balances.slice(0, 8).map((b) => {
              const code = b.code || b.leave_type_code || b.leave_type;
              const name = b.leave_type || b.leave_type_name || code;
              const isSelected = form.leave_type === code;
              const avail = b.available ?? b.remaining_days ?? 0;
              const total = b.annual_allocation ?? b.total_days ?? 0;

              return (
                <button
                  type="button"
                  key={code}
                  onClick={() => setForm({ ...form, leave_type: code })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {name}
                    </p>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {avail}
                    <span className="text-xs font-normal text-slate-400 ml-1">
                      / {total} d
                    </span>
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {/* Leave Application Form */}
      <Card
        title="Time-off Application Form"
        subtitle="Specify leave category, dates, session, and justification"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Leave Type Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Leave Category
            </label>
            <select
              value={form.leave_type}
              onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {leaveTypes.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.name} ({t.code}) &bull; {t.is_paid ? 'Paid' : 'Unpaid'} &bull; Max {t.annual_quota} days
                </option>
              ))}
            </select>
          </div>

          {/* Half-Day Option Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Half-Day Leave
                </p>
                <p className="text-[11px] text-slate-500">
                  Take a 0.5 day leave for morning or afternoon duty
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_half_day}
                  onChange={(e) => handleHalfDayToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {form.is_half_day && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center space-x-6 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Select Session:
                </span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="half_day_session"
                    value="FIRST_HALF"
                    checked={form.half_day_session === 'FIRST_HALF'}
                    onChange={(e) =>
                      setForm({ ...form, half_day_session: e.target.value })
                    }
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    First Half (Morning)
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="half_day_session"
                    value="SECOND_HALF"
                    checked={form.half_day_session === 'SECOND_HALF'}
                    onChange={(e) =>
                      setForm({ ...form, half_day_session: e.target.value })
                    }
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    Second Half (Afternoon)
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={form.is_half_day ? 'Leave Date' : 'Start Date'}
              type="date"
              required
              value={form.start_date}
              onChange={(e) => handleStartDateChange(e.target.value)}
            />
            {!form.is_half_day && (
              <Input
                label="End Date"
                type="date"
                required
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            )}
          </div>

          {/* Duration & Quota Status Bar */}
          {daysCount > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Calculated Duration:
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {daysCount} {daysCount === 1 ? 'day' : 'days'}
                </span>
              </div>

              {selectedBalance && (
                <div className="text-xs text-slate-500 flex items-center space-x-2">
                  <span>Available Balance:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedBalance.available ?? selectedBalance.remaining_days ?? 0} days
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Reason / Medical Justification
            </label>
            <textarea
              required
              rows={4}
              placeholder="Please describe the reason for your time-off request..."
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link to="/employee/leaves">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              icon={Send}
              loading={submitting}
            >
              Submit Application
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
