import React from 'react';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl transition-all duration-300 ${
        hoverEffect ? 'hover:-translate-y-1 hover:shadow-xl' : ''
      } ${
        glow ? 'shadow-lg shadow-[#2563EB]/15' : 'shadow-sm'
      } bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-[#F8FAFC] ${className}`}
    >
      {children}
    </div>
  );
};
