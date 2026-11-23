import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'positive', // 'positive' | 'negative' | 'neutral'
  variant = 'blue', // 'blue' | 'cyan' | 'emerald' | 'indigo' | 'amber'
  className = '',
  loading = false,
}) => {
  const colorMap = {
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      glow: 'shadow-blue-500/10',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      accent: 'from-blue-600 to-cyan-500',
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      glow: 'shadow-cyan-500/10',
      iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      accent: 'from-cyan-500 to-blue-500',
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      glow: 'shadow-emerald-500/10',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      accent: 'from-emerald-500 to-teal-400',
    },
    indigo: {
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      glow: 'shadow-indigo-500/10',
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      accent: 'from-indigo-600 to-blue-500',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      glow: 'shadow-amber-500/10',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      accent: 'from-amber-500 to-orange-400',
    },
  };

  const current = colorMap[variant] || colorMap.blue;

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#111C32] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded mt-4" />
        <div className="h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded mt-2" />
      </div>
    );
  }

  return (
    <div
      className={`group relative overflow-hidden bg-white dark:bg-[#111C32] rounded-2xl border ${current.border} p-5 shadow-sm hover:shadow-lg ${current.glow} transition-all duration-300 transform hover:-translate-y-0.5 ${className}`}
    >
      {/* Decorative top accent line */}
      <div className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${current.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full`} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-[#94A3B8] tracking-wide uppercase truncate">
            {title}
          </p>
          <p className="text-xl sm:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-1.5 tracking-tight font-sans truncate">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${current.iconBg} transition-transform duration-300 group-hover:scale-110 shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-slate-500 dark:text-[#94A3B8] font-normal truncate">
              {subtitle}
            </span>
          )}
          {trend && (
            <span
              className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded-full ${
                trendType === 'positive'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : trendType === 'negative'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
              }`}
            >
              {trendType === 'positive' && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
              {trendType === 'negative' && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {trendType === 'neutral' && <Minus className="w-3 h-3 mr-0.5" />}
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
