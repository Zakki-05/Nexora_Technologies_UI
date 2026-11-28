'use client';

import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AIChat } from '@/components/ai/AIChat';
import { NexoraAIOrb } from '@/components/ai/NexoraAIOrb';

export function AIFloatingButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide floating widget when user is already on the full /ai workspace
  if (pathname === '/ai') {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#0891B2] text-white text-xs font-bold shadow-xl hover:scale-105 transition-transform"
        aria-label="Open Nexora AI Copilot"
      >
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span>Nexora Copilot</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-[min(94vw,420px)] h-[min(78vh,600px)] flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B162C]">
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-[#2563EB] to-[#0891B2] text-white">
        <div className="flex items-center gap-2 text-xs font-bold">
          <NexoraAIOrb state="idle" size="sm" />
          <span>Nexora AI Copilot</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close Nexora AI Copilot"
          className="p-1 rounded-lg hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 min-h-0">
        <AIChat compact onExpandToPage={() => setIsOpen(false)} />
      </div>
    </div>
  );
}
