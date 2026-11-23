import React, { useState, useEffect } from 'react';
import { holidayApi } from '../../api/holidays';
import { Card, Badge } from '../../components/ui/Badge';
import { LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';
import { Sparkles, Calendar, Clock, CheckCircle2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export const EmployeeHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchHolidays();
  }, [selectedYear]);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const res = await holidayApi.getAll(selectedYear);
      const items = Array.isArray(res) ? res : res?.items || [];
      // Sort chronologically by date
      items.sort((a, b) => new Date(a.date) - new Date(b.date));
      setHolidays(items);
    } catch (err) {
      console.error('Failed to load holidays', err);
      toast.error('Failed to load holidays');
    } finally {
      setLoading(false);
    }
  };

  const getDayCountdown = (holidayDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Timezone safe local date parsing
    let target;
    if (typeof holidayDate === 'string' && holidayDate.includes('-')) {
      const [y, m, d] = holidayDate.split('-').map(Number);
      target = new Date(y, m - 1, d);
    } else {
      target = new Date(holidayDate);
    }
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return <span className="text-slate-400 text-xs font-medium">Observed</span>;
    }
    if (diffDays === 0) {
      return <Badge variant="success">Today!</Badge>;
    }
    if (diffDays === 1) {
      return <Badge variant="warning">Tomorrow</Badge>;
    }
    return <Badge variant="info">In {diffDays} days</Badge>;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-emerald-500" />
            <span>Company Holidays &amp; Observances</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official paid holidays and corporate office closures for {selectedYear}.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Calendar Year:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {[selectedYear - 1, selectedYear, selectedYear + 1].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Holidays List */}
      <Card className="!p-0 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : holidays.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No Holidays Listed"
            description={`No company holidays declared yet for the calendar year ${selectedYear}.`}
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {holidays.map((h) => {
              // Parse date parts safely
              let monthStr = 'DEC';
              let dayNum = 1;
              let dayName = 'Holiday';

              if (typeof h.date === 'string' && h.date.includes('-')) {
                const [y, m, d] = h.date.split('-').map(Number);
                const dateObj = new Date(y, m - 1, d);
                monthStr = dateObj.toLocaleDateString(undefined, { month: 'short' });
                dayNum = d;
                dayName = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
              } else {
                const dateObj = new Date(h.date);
                monthStr = dateObj.toLocaleDateString(undefined, { month: 'short' });
                dayNum = dateObj.getDate();
                dayName = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
              }

              return (
                <div
                  key={h.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-13 h-13 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex flex-col items-center justify-center shrink-0 p-2 shadow-sm">
                      <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                        {monthStr}
                      </span>
                      <span className="text-lg font-black text-emerald-950 dark:text-emerald-200 leading-tight">
                        {dayNum}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {h.name}
                        </h4>
                        {h.is_optional && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                            <span>Optional</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{dayName}</span>
                        {' '}&bull; {h.description || 'Official Paid Corporate Holiday'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    {getDayCountdown(h.date)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
