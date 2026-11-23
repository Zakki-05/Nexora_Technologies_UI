import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30',
    info: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30',
    primary: 'bg-[#2563EB]/10 text-[#2563EB] dark:text-[#38BDF8] border border-[#2563EB]/30',
    secondary: 'bg-[#06B6D4]/10 text-[#0891B2] dark:text-[#06B6D4] border border-[#06B6D4]/30',
    purple: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

export const Card = ({ children, className = '', title, subtitle, headerAction }) => {
  return (
    <div
      className={`bg-white dark:bg-[#111C32] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  subtitle,
  onClick,
}) => {
  const iconColors = {
    blue: 'bg-[#2563EB]/10 text-[#2563EB] dark:text-[#38BDF8]',
    cyan: 'bg-[#06B6D4]/10 text-[#0891B2] dark:text-[#06B6D4]',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-white dark:bg-[#111C32] p-5 sm:p-5.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] truncate">
            {title}
          </p>
          <p className="text-xl sm:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight font-sans truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] mt-1 font-medium truncate">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${
              iconColors[color] || iconColors.blue
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-xs">
          <span
            className={`font-bold mr-1.5 ${
              trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-slate-400 truncate">{trend.label}</span>
        </div>
      )}
    </div>
  );
};
