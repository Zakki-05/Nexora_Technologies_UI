'use client';

import React, { useState } from 'react';
import { Send, Square } from 'lucide-react';

interface AIChatInputProps {
  disabled?: boolean;
  isStreaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  placeholder?: string;
}

export function AIChatInput({
  disabled = false,
  isStreaming,
  onSend,
  onStop,
  placeholder = 'Ask Nexora Copilot about leave balances, attendance, HR policies, or drafting...',
}: AIChatInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled || isStreaming) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
      <textarea
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B162C] px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 max-h-36"
      />
      {isStreaming ? (
        <button
          type="button"
          onClick={onStop}
          className="h-11 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>Stop</span>
        </button>
      ) : (
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="h-11 px-4 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0891B2] text-white text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 disabled:opacity-50 hover:opacity-95 transition-opacity"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      )}
    </form>
  );
}
