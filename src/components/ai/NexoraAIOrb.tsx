'use client';

import React from 'react';
import { Bot } from 'lucide-react';

export type AIOrbState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'generating'
  | 'completed'
  | 'error';

const STATE_STYLES: Record<AIOrbState, { ring: string; glow: string; label: string }> = {
  idle: {
    ring: 'from-[#3B82F6] via-[#8B5CF6] to-[#22D3EE]',
    glow: 'shadow-blue-500/25',
    label: 'Ready',
  },
  listening: {
    ring: 'from-[#22D3EE] via-[#3B82F6] to-[#8B5CF6] animate-pulse',
    glow: 'shadow-cyan-500/40',
    label: 'Listening',
  },
  processing: {
    ring: 'from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] animate-spin',
    glow: 'shadow-violet-500/40',
    label: 'Thinking',
  },
  generating: {
    ring: 'from-[#22D3EE] via-[#10B981] to-[#3B82F6] animate-spin',
    glow: 'shadow-emerald-500/40',
    label: 'Streaming',
  },
  completed: {
    ring: 'from-[#10B981] to-[#22D3EE]',
    glow: 'shadow-emerald-500/30',
    label: 'Completed',
  },
  error: {
    ring: 'from-[#EF4444] to-[#F59E0B]',
    glow: 'shadow-rose-500/35',
    label: 'Attention',
  },
};

export function NexoraAIOrb({
  state = 'idle',
  size = 'sm',
}: {
  state?: AIOrbState;
  size?: 'sm' | 'md';
}) {
  const cfg = STATE_STYLES[state];
  const dim = size === 'md' ? 'w-10 h-10' : 'w-8 h-8';
  const iconDim = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div
      className={`relative ${dim} rounded-full p-[2px] shadow-lg ${cfg.glow} shrink-0`}
      title={`Nexora Copilot: ${cfg.label}`}
      aria-label={`Nexora Copilot status: ${cfg.label}`}
    >
      <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${cfg.ring}`} />
      <div className="relative w-full h-full rounded-full bg-[#05070D] text-white flex items-center justify-center">
        <Bot className={iconDim} />
      </div>
    </div>
  );
}
