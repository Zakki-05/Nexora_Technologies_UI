import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
import { NexoraOfficialLogo } from '../ui/NexoraLogo';

export const PortalFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#081024]/80 backdrop-blur-md transition-colors duration-300 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Official Company Logo & Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
          <NexoraOfficialLogo className="h-7 sm:h-8" />
          <div className="hidden sm:block h-4 w-px bg-slate-300 dark:bg-slate-700" />
          <span className="text-xs text-slate-500 dark:text-[#94A3B8] font-medium tracking-wide">
            Empowering People, Driving Innovation.
          </span>
        </div>

        {/* Right: Security Badge & Copyright */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 text-xs text-slate-500 dark:text-[#94A3B8]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-[#38BDF8] border border-blue-200/60 dark:border-blue-900/50 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-bit Secure Enterprise RBAC</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Systems Normal</span>
          </span>
          <span className="text-slate-400 dark:text-slate-500">
            &copy; {currentYear} Nexora Technologies Inc. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default PortalFooter;
