'use client';

import React, { useState } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

interface ChatMsg {
  id: number;
  sender: 'ai' | 'user';
  text: string;
}

export function NexoraCopilot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am Nexora AI Copilot. Ask me about leave quotas, Indian EPF/ESIC payroll, Gratuity, shift rules, or expense claims.',
    },
  ]);

  const replyFor = (q: string): string => {
    const l = q.toLowerCase();
    if (l.includes('epf') || l.includes('esic') || l.includes('salary') || l.includes('payroll')) {
      return 'Indian Payroll: Basic is 50% of Gross, EPF is 12% of Basic (capped at ₹15,000 base), ESIC is 0.75% when Gross <= ₹21,000, Professional Tax is ₹200/mo, plus TDS & LOP.';
    }
    if (l.includes('gratuity') || l.includes('maternity')) {
      return 'Payment of Gratuity Act: eligible after 5 years continuous service ((15 × Basic × Years)/26). Maternity Benefit Act: 26 weeks paid leave.';
    }
    if (l.includes('leave')) {
      return 'Leave Policy: Annual (15–18 days), Sick & Casual (10–12 days), Maternity (180 days), Paternity (15 days) tracked across 10 atomic ledgers.';
    }
    if (l.includes('expense')) {
      return 'Expense Claims: Submit travel, hardware, or training claims under Expense Claims with receipt details for Admin review.';
    }
    return `Hi ${user?.employee?.full_name || user?.username || 'Team Member'}, I can assist with Leave Policies, EPF/ESIC Payroll, Gratuity, Attendance Shifts, or Expense Claims.`;
  };

  const handleSend = (text = input) => {
    const q = text.trim();
    if (!q) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: q },
      { id: Date.now() + 1, sender: 'ai', text: replyFor(q) },
    ]);
    setInput('');
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#0891B2] text-white text-xs font-bold shadow-xl hover:scale-105 transition-transform"
        aria-label="Open Nexora AI Copilot"
      >
        <Sparkles className="w-4 h-4" />
        <span className="hidden sm:inline">Nexora AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-80 sm:w-96 bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-[#2563EB] to-[#0891B2] text-white flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Bot className="w-4 h-4" />
          <span>Nexora AI Copilot</span>
        </div>
        <button type="button" onClick={() => setIsOpen(false)} aria-label="Close Nexora AI">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3 h-64 overflow-y-auto space-y-2.5 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2.5 rounded-xl max-w-[85%] ${
              m.sender === 'user'
                ? 'ml-auto bg-[#2563EB] text-white'
                : 'bg-slate-100 dark:bg-[#0B1426] text-slate-800 dark:text-slate-200'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask HR policy or payroll..."
          className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1426] border border-slate-200 dark:border-slate-700 text-xs outline-none"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-[#2563EB] text-white"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
