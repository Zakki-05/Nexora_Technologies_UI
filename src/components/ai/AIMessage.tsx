'use client';

import React, { useState } from 'react';
import {
  Bot,
  Check,
  Copy,
  FileText,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  User,
  Wrench,
} from 'lucide-react';
import { AIMarkdown } from '@/components/ai/AIMarkdown';
import type { AIMessage as AIMessageType } from '@/features/ai/types/ai';

interface AIMessageProps {
  message: AIMessageType;
  isLastAssistant?: boolean;
  onRegenerate?: () => void;
  onFeedback?: (messageId: number, rating: 'positive' | 'negative') => void;
}

export function AIMessage({
  message,
  isLastAssistant = false,
  onRegenerate,
  onFeedback,
}: AIMessageProps) {
  const [copied, setCopied] = useState(false);
  const [rated, setRated] = useState<'positive' | 'negative' | null>(null);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard?.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleRate = (rating: 'positive' | 'negative') => {
    setRated(rating);
    onFeedback?.(message.id, rating);
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0891B2] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-r from-[#2563EB] to-[#0891B2] text-white shadow-sm'
            : 'bg-white dark:bg-[#0F1B33] border border-slate-200 dark:border-slate-800 shadow-sm'
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          <>
            {message.tool_calls && message.tool_calls.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {message.tool_calls.map((tc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800"
                  >
                    <Wrench className="w-3 h-3" />
                    {tc.name}
                  </span>
                ))}
              </div>
            )}

            <AIMarkdown content={message.content} />

            {message.citations && message.citations.length > 0 && (
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                {message.citations.map((cit, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    <FileText className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    {cit.title}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  title="Copy response"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                {isLastAssistant && onRegenerate && (
                  <button
                    type="button"
                    onClick={onRegenerate}
                    className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    title="Regenerate response"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>
                )}
              </div>

              {message.id > 0 && onFeedback && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleRate('positive')}
                    aria-label="Helpful response"
                    className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      rated === 'positive' ? 'text-emerald-500' : ''
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRate('negative')}
                    aria-label="Unhelpful response"
                    className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      rated === 'negative' ? 'text-rose-500' : ''
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
