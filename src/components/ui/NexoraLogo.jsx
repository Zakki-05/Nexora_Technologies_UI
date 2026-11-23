import React from 'react';
import { Link } from 'react-router-dom';

export const NexoraLogo = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  className = '',
  to = null,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-11 h-11', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-14 h-14', text: 'text-3xl', sub: 'text-sm' },
  };

  const { icon, text, sub } = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Nexora Modular Systems Core Mark */}
      <div className={`relative ${icon} rounded-xl bg-slate-100 dark:bg-[#0B1120] p-1 flex items-center justify-center border border-slate-200 dark:border-[#2563EB]/40 shadow-sm dark:shadow-lg dark:shadow-[#2563EB]/25 group-hover:border-[#06B6D4]/60 transition-all duration-300 overflow-hidden`}>
        <img
          src="/nexora-mark.png"
          alt="Nexora Core Mark"
          className="w-full h-full object-contain filter drop-shadow"
        />
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <span className={`font-extrabold ${text} tracking-tight leading-none text-slate-900 dark:text-white`}>
            Nexora <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">Workforce</span>
          </span>
          {showTagline ? (
            <span className={`text-[#64748B] dark:text-[#94A3B8] font-medium tracking-wide mt-0.5 ${sub}`}>
              Empowering People, Driving Innovation
            </span>
          ) : (
            <span className={`text-[10px] uppercase font-bold tracking-widest text-[#2563EB] dark:text-[#06B6D4] mt-0.5`}>
              Technologies
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block group focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};

export const NexoraOfficialLogo = ({ className = 'h-10', to = null }) => {
  const content = (
    <div className="inline-flex items-center select-none">
      {/* Light Theme: Bold dark navy corporate name text */}
      <img
        src="/nexora-official-logo-light.png"
        alt="Nexora Technologies Official Logo"
        className={`block dark:hidden ${className} w-auto object-contain filter drop-shadow-sm`}
      />
      {/* Dark Theme: Vibrant cyan/white glowing name text */}
      <img
        src="/nexora-official-logo.png"
        alt="Nexora Technologies Official Logo"
        className={`hidden dark:block ${className} w-auto object-contain filter drop-shadow-sm`}
      />
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};
