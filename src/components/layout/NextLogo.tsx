'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NextLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
  href?: string | null;
}

const SIZE_MAP = {
  sm: { icon: 'w-7 h-7', px: 28, text: 'text-base', sub: 'text-[9px]' },
  md: { icon: 'w-9 h-9', px: 36, text: 'text-lg', sub: 'text-[10px]' },
  lg: { icon: 'w-11 h-11', px: 44, text: 'text-2xl', sub: 'text-xs' },
  xl: { icon: 'w-14 h-14', px: 56, text: 'text-3xl', sub: 'text-sm' },
} as const;

export function NextLogo({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  className = '',
  href = null,
}: NextLogoProps) {
  const cfg = SIZE_MAP[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`relative ${cfg.icon} rounded-xl bg-slate-100 dark:bg-[#0B1120] p-1 flex items-center justify-center border border-slate-200 dark:border-[#2563EB]/40 shadow-sm dark:shadow-lg dark:shadow-[#2563EB]/25 group-hover:border-[#06B6D4]/60 transition-all duration-300 overflow-hidden`}
      >
        <Image
          src="/nexora-mark.png"
          alt="Nexora Core Mark"
          width={cfg.px}
          height={cfg.px}
          className="w-full h-full object-contain filter drop-shadow"
        />
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <span className={`font-extrabold ${cfg.text} tracking-tight leading-none text-slate-900 dark:text-white`}>
            Nexora{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              Workforce
            </span>
          </span>
          {showTagline ? (
            <span className={`text-[#64748B] dark:text-[#94A3B8] font-medium tracking-wide mt-0.5 ${cfg.sub}`}>
              Empowering People, Driving Innovation
            </span>
          ) : (
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#2563EB] dark:text-[#06B6D4] mt-0.5">
              Technologies
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block group focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
