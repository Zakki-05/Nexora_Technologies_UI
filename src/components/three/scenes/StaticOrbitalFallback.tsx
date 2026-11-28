'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export function StaticOrbitalFallback({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden ${
        compact ? 'min-h-[240px]' : 'min-h-[340px]'
      }`}
      aria-label="Nexora Intelligence Core visual"
    >
      <div className="absolute w-64 h-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
      <div className="absolute w-48 h-48 rounded-full bg-violet-500/15 blur-3xl translate-x-10 -translate-y-8 pointer-events-none" />

      <svg
        viewBox="0 0 320 320"
        className="w-64 h-64 sm:w-80 sm:h-80 text-blue-500/40"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="160" cy="160" r="120" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
        <ellipse
          cx="160"
          cy="160"
          rx="135"
          ry="52"
          transform="rotate(-24 160 160)"
          stroke="url(#nexoraRing)"
          strokeWidth="1.5"
        />
        <ellipse
          cx="160"
          cy="160"
          rx="135"
          ry="52"
          transform="rotate(32 160 160)"
          stroke="url(#nexoraRing2)"
          strokeWidth="1.5"
        />
        <circle cx="244" cy="108" r="5" fill="#22D3EE" />
        <circle cx="82" cy="216" r="5" fill="#8B5CF6" />
        <circle cx="256" cy="204" r="4" fill="#3B82F6" />
        <defs>
          <linearGradient id="nexoraRing" x1="25" y1="160" x2="295" y2="160">
            <stop stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="0.5" stopColor="#22D3EE" stopOpacity="0.9" />
            <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="nexoraRing2" x1="25" y1="160" x2="295" y2="160">
            <stop stopColor="#8B5CF6" stopOpacity="0.2" />
            <stop offset="0.5" stopColor="#3B82F6" stopOpacity="0.9" />
            <stop offset="1" stopColor="#22D3EE" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3B82F6] via-[#8B5CF6] to-[#22D3EE] p-[1px] shadow-2xl shadow-blue-500/30">
        <div className="w-full h-full rounded-2xl bg-[#05070D]/90 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-cyan-300" />
        </div>
      </div>
    </div>
  );
}
