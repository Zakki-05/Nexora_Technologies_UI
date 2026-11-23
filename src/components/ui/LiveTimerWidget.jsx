import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendance';
import { Card, Badge } from './Badge';
import { Button } from './Button';
import { Modal } from './Modal';
import {
  Clock,
  Coffee,
  CheckCircle2,
  LogOut,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
  AlertTriangle,
  History,
  ChevronDown,
  Calendar,
  Briefcase,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const LiveTimerWidget = ({ onStatusChange }) => {
  const [liveStatus, setLiveStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);

  // Modals & Drawers
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [timeline, setTimeline] = useState([]);

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial live status & periodic sync
  useEffect(() => {
    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Compute live active session & break duration seconds
  useEffect(() => {
    if (!liveStatus) return;

    // Check punch in timestamp from backend
    const punchInRaw =
      liveStatus.session_punch_in ||
      liveStatus.current_session?.punch_in ||
      liveStatus.first_punch_in;

    if (liveStatus.is_punched_in && punchInRaw) {
      let punchInDate;
      if (typeof punchInRaw === 'string' && punchInRaw.includes(':') && !punchInRaw.includes('T')) {
        // Time string "HH:MM:SS" on today
        const [h, m, s] = punchInRaw.split(':');
        punchInDate = new Date();
        punchInDate.setHours(parseInt(h, 10), parseInt(m, 10), parseInt(s || 0, 10), 0);
      } else {
        punchInDate = new Date(punchInRaw);
      }
      const diff = Math.max(0, Math.floor((new Date() - punchInDate) / 1000));
      setSessionSeconds(diff);
    } else {
      setSessionSeconds(0);
    }

    // Check active break timestamp from backend
    const breakStartRaw =
      liveStatus.break_start_time ||
      liveStatus.active_break?.break_start;

    if (liveStatus.is_on_break && breakStartRaw) {
      const breakStartDate = new Date(breakStartRaw);
      const diff = Math.max(0, Math.floor((new Date() - breakStartDate) / 1000));
      setBreakSeconds(diff);
    } else {
      setBreakSeconds(0);
    }
  }, [liveStatus, currentTime]);

  const fetchLiveStatus = async () => {
    try {
      const res = await attendanceApi.getLiveStatus();
      setLiveStatus(res);
      if (onStatusChange) onStatusChange(res);
    } catch (err) {
      console.warn('Live status lookup error, falling back to today record:', err);
      try {
        const todayRes = await attendanceApi.getToday();
        if (todayRes) {
          setLiveStatus({
            is_punched_in: !!todayRes.is_punched_in,
            today_working_minutes: todayRes.actual_working_minutes || 0,
            today_break_minutes: todayRes.total_break_minutes || 0,
            status: todayRes.status,
            session_punch_in: todayRes.check_in,
            total_sessions_count: todayRes.sessions?.length || 1,
            is_on_break: false,
          });
        }
      } catch {
        // Ignore fallback error
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    try {
      const res = await attendanceApi.getTimeline();
      setTimeline(res.timeline || res.events || []);
    } catch {
      // Ignore
    }
  };

  const toggleTimeline = () => {
    if (!showTimeline) fetchTimeline();
    setShowTimeline(!showTimeline);
  };

  const formatSeconds = (totalSec) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const formatMinutesToHours = (minutes = 0) => {
    if (!minutes && minutes !== 0) return '0h 0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  // Actions
  const handleCheckIn = async () => {
    setActionLoading(true);
    // Optimistic UI feedback
    setLiveStatus((prev) => ({
      ...prev,
      is_punched_in: true,
      is_on_break: false,
      session_punch_in: new Date().toISOString(),
    }));
    try {
      const res = await attendanceApi.checkIn();
      toast.success(
        res.is_late
          ? 'Checked in successfully! (Marked Late Arrival)'
          : 'Punched in! Have an energetic and productive day.'
      );
      await fetchLiveStatus();
      fetchTimeline();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Punch in failed');
      await fetchLiveStatus();
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    // Optimistic UI feedback
    setLiveStatus((prev) => ({
      ...prev,
      is_punched_in: false,
      is_on_break: false,
    }));
    try {
      const res = await attendanceApi.checkOut();
      toast.success(`Punched out! Total working time: ${formatMinutesToHours(res.actual_working_minutes || 0)}`);
      await fetchLiveStatus();
      fetchTimeline();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Punch out failed');
      await fetchLiveStatus();
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartBreak = async (breakType) => {
    setShowBreakModal(false);
    setActionLoading(true);
    setLiveStatus((prev) => ({
      ...prev,
      is_on_break: true,
      current_break_type: breakType,
      break_start_time: new Date().toISOString(),
    }));
    try {
      await attendanceApi.startBreak(breakType);
      toast.success(`Started ${breakType.replace('_', ' ').toLowerCase()}! Enjoy your break.`);
      await fetchLiveStatus();
      fetchTimeline();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to start break');
      await fetchLiveStatus();
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndBreak = async () => {
    setActionLoading(true);
    setLiveStatus((prev) => ({
      ...prev,
      is_on_break: false,
    }));
    try {
      await attendanceApi.endBreak();
      toast.success('Break ended! Welcome back to work.');
      await fetchLiveStatus();
      fetchTimeline();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to end break');
      await fetchLiveStatus();
    } finally {
      setActionLoading(false);
    }
  };

  const isPunchedIn = !!liveStatus?.is_punched_in;
  const isOnBreak = !!liveStatus?.is_on_break;

  const productiveMins = liveStatus?.today_working_minutes ?? 0;
  const breakMins = liveStatus?.today_break_minutes ?? 0;
  const sessionsCount =
    liveStatus?.total_sessions_count ??
    liveStatus?.sessions_count ??
    (liveStatus?.sessions ? liveStatus.sessions.length : (isPunchedIn ? 1 : 0));
  const statusLabel =
    liveStatus?.status ||
    (isOnBreak ? 'ON BREAK' : isPunchedIn ? 'IN PROGRESS' : 'NOT STARTED');

  const breakOptions = [
    {
      type: 'TEA_BREAK',
      title: 'Tea / Coffee Break',
      desc: '15 min policy allowance &bull; Paid interval',
      icon: '☕',
      is_paid: true,
    },
    {
      type: 'LUNCH_BREAK',
      title: 'Lunch Break',
      desc: '45-60 min meal allowance &bull; Unpaid interval',
      icon: '🍱',
      is_paid: false,
    },
    {
      type: 'PERSONAL_BREAK',
      title: 'Personal Break',
      desc: '15 min urgent personal break &bull; Unpaid',
      icon: '🚶',
      is_paid: false,
    },
    {
      type: 'SHORT_BREAK',
      title: 'Quick Rest Break',
      desc: '10 min quick screen rest &bull; Paid interval',
      icon: '⚡',
      is_paid: true,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-2xl p-5 sm:p-6 w-full">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Meta Header: Status Pulse & Date */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10 text-xs">
        <div className="flex items-center space-x-2.5">
          <span className="flex h-3 w-3 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isOnBreak
                  ? 'bg-amber-400'
                  : isPunchedIn
                  ? 'bg-emerald-400'
                  : 'bg-slate-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isOnBreak
                  ? 'bg-amber-500'
                  : isPunchedIn
                  ? 'bg-emerald-500'
                  : 'bg-slate-500'
              }`}
            />
          </span>
          <span className="font-extrabold tracking-wider uppercase text-slate-200">
            {isOnBreak
              ? `On Break (${liveStatus?.current_break_type?.replace('_', ' ') || 'Active Break'})`
              : isPunchedIn
              ? `Currently Working (Session #${liveStatus?.active_session_number || 1})`
              : 'Punched Out / Shift Inactive'}
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 text-slate-300 font-medium">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            {currentTime.toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Main Grid: 3 Distinct Sections (Clock + KPIs + Actions) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center pt-5">
        {/* SECTION 1: Real-time Clock & Active Ticking Counter (Col 4) */}
        <div className="lg:col-span-4 space-y-2">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            System Wall Clock
          </p>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white drop-shadow">
              {currentTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </h2>
          </div>

          {/* Active Running Counter */}
          <div className="pt-1">
            {isOnBreak ? (
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs">
                <Coffee className="w-4 h-4 animate-bounce text-amber-400 shrink-0" />
                <span className="font-bold">Break: {formatSeconds(breakSeconds)}</span>
              </div>
            ) : isPunchedIn ? (
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs">
                <Timer className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
                <span className="font-bold">Active Session: {formatSeconds(sessionSeconds)}</span>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Ready to punch in for your next shift.
              </p>
            )}
          </div>
        </div>

        {/* SECTION 2: Daily Attendance KPI Stat Boxes (Col 5) */}
        <div className="lg:col-span-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Productive Time */}
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-2.5 text-center">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">
                Productive
              </span>
              <p className="text-sm sm:text-base font-extrabold font-mono text-emerald-400 mt-0.5 truncate">
                {formatMinutesToHours(productiveMins)}
              </p>
            </div>

            {/* Break Time */}
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-2.5 text-center">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">
                Break Time
              </span>
              <p className="text-sm sm:text-base font-extrabold font-mono text-amber-400 mt-0.5 truncate">
                {formatMinutesToHours(breakMins)}
              </p>
            </div>

            {/* Sessions Today */}
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-2.5 text-center">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">
                Sessions
              </span>
              <p className="text-sm sm:text-base font-extrabold font-mono text-sky-400 mt-0.5 truncate">
                {sessionsCount}
              </p>
            </div>

            {/* Status */}
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-2.5 text-center">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">
                Status
              </span>
              <p className="text-xs sm:text-sm font-bold text-indigo-300 mt-1 truncate">
                {statusLabel}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Action Controls Bar (Col 3) */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col xl:flex-row items-center justify-end gap-2.5 w-full">
          {isOnBreak ? (
            <button
              onClick={handleEndBreak}
              disabled={actionLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span>Resume Work</span>
            </button>
          ) : isPunchedIn ? (
            <>
              {/* Take Break Trigger */}
              <button
                onClick={() => setShowBreakModal(true)}
                disabled={actionLoading}
                className="flex-1 lg:w-full xl:flex-1 bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold text-xs py-2.5 px-3 rounded-xl border border-indigo-400/30 flex items-center justify-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
              >
                <Coffee className="w-3.5 h-3.5 shrink-0" />
                <span>Take Break</span>
              </button>

              {/* Punch Out */}
              <button
                onClick={handleCheckOut}
                disabled={actionLoading}
                className="flex-1 lg:w-full xl:flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-md shadow-rose-600/25 flex items-center justify-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Punch Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleCheckIn}
              disabled={actionLoading}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-sm py-3 px-6 rounded-xl shadow-xl shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Punch In Now</span>
            </button>
          )}

          {/* Activity Timeline Toggle */}
          <button
            onClick={toggleTimeline}
            className={`p-2.5 rounded-xl border transition-all shrink-0 ${
              showTimeline
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/10'
            }`}
            title="Toggle Today's Session Timeline"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Session Timeline Drawer */}
      {showTimeline && (
        <div className="mt-5 pt-4 border-t border-white/10 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <h4 className="uppercase font-bold tracking-wider text-slate-300">
              Today's Activity Timeline
            </h4>
            <span className="text-slate-400 font-mono">
              Total Logged: {formatMinutesToHours(productiveMins + breakMins)}
            </span>
          </div>

          {timeline.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">
              No sessions recorded yet today. Punch in to begin tracking.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {timeline.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs ${
                    item.event_type === 'BREAK'
                      ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                      : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>
                      {item.event_type === 'BREAK'
                        ? `☕ ${item.title || 'Break'}`
                        : `💼 Session #${item.session_number || idx + 1}`}
                    </span>
                    <span className="font-mono text-[11px]">
                      {item.duration_minutes || 0}m
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{item.start_time || 'Running'}</span>
                    <span>&rarr;</span>
                    <span>{item.end_time || 'Active'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SELECT BREAK CATEGORY MODAL */}
      <Modal
        isOpen={showBreakModal}
        onClose={() => setShowBreakModal(false)}
        title="Select Break Interval"
        subtitle="Choose your break category according to corporate attendance policy"
        maxWidth="max-w-md"
      >
        <div className="space-y-3 pt-1">
          {breakOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => handleStartBreak(opt.type)}
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:border-emerald-500 dark:hover:border-emerald-500 text-left transition-all flex items-center space-x-3 group"
            >
              <div className="text-2xl p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm shrink-0">
                {opt.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {opt.title}
                  </p>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      opt.is_paid
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                    }`}
                  >
                    {opt.is_paid ? 'PAID' : 'UNPAID'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {opt.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};
