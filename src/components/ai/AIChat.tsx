'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Bot,
  Maximize2,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Wrench,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useNexoraAI } from '@/features/ai/hooks/useNexoraAI';
import { AISidebar } from '@/components/ai/AISidebar';
import { AIMessage } from '@/components/ai/AIMessage';
import { AIChatInput } from '@/components/ai/AIChatInput';
import { AIMarkdown } from '@/components/ai/AIMarkdown';
import { NexoraAIOrb, type AIOrbState } from '@/components/ai/NexoraAIOrb';

const SUGGESTED_PROMPTS_EMPLOYEE = [
  'What is my current leave balance?',
  'Summarize my attendance for the last 14 days',
  'What are the upcoming company holidays?',
  'Draft a polite 2-day annual leave request email',
];

const SUGGESTED_PROMPTS_ADMIN = [
  'Give me the current workforce headcount breakdown',
  'How many pending leave requests are awaiting approval?',
  'Summarize organization attendance for today',
  'Draft an HR policy reminder on punctuality',
];

interface AIChatProps {
  compact?: boolean;
  onExpandToPage?: () => void;
}

export function AIChat({ compact = false, onExpandToPage }: AIChatProps) {
  const { isAdmin } = useAuth();
  const {
    status,
    conversations,
    activeConversationId,
    messages,
    searchQuery,
    setSearchQuery,
    isLoadingStatus,
    isLoadingMessages,
    isStreaming,
    streamingContent,
    streamingTools,
    streamingCitations,
    selectConversation,
    startNewConversation,
    stopGenerating,
    sendMessage,
    regenerateLast,
    renameConversation,
    togglePinConversation,
    deleteConversation,
    submitFeedback,
    exportConversationMarkdown,
  } = useNexoraAI();

  const [showSidebar, setShowSidebar] = useState(!compact);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, streamingContent]);

  const prompts = isAdmin ? SUGGESTED_PROMPTS_ADMIN : SUGGESTED_PROMPTS_EMPLOYEE;
  const aiDisabled = !isLoadingStatus && status !== null && !status.enabled;
  const lastAssistantId = [...messages].reverse().find((m) => m.role === 'assistant')?.id;
  const orbState: AIOrbState = aiDisabled
    ? 'error'
    : isStreaming
    ? streamingContent
      ? 'generating'
      : 'processing'
    : messages.length > 0
    ? 'completed'
    : 'idle';

  return (
    <div className="flex h-full w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B162C] shadow-sm">
      {showSidebar && !compact && (
        <AISidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelect={selectConversation}
          onNew={startNewConversation}
          onRename={renameConversation}
          onTogglePin={togglePinConversation}
          onDelete={deleteConversation}
          onExport={exportConversationMarkdown}
          canExport={messages.length > 0}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/70 dark:bg-[#091224]">
          <div className="flex items-center gap-2.5 min-w-0">
            {!compact && (
              <button
                type="button"
                onClick={() => setShowSidebar((s) => !s)}
                className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Toggle conversation sidebar"
              >
                {showSidebar ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
              </button>
            )}
            <NexoraAIOrb state={orbState} size="sm" />
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                Nexora Copilot
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {status?.enabled
                  ? `${status.active_provider} · ${status.active_model}`
                  : 'Your Intelligent Workforce Assistant'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compact && (
              <Link
                href="/ai"
                onClick={onExpandToPage}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full View</span>
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin/ai-settings"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AI Settings</span>
              </Link>
            )}
          </div>
        </div>

        {/* Disabled Notice */}
        {aiDisabled && (
          <div className="mx-4 mt-3 px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-semibold">Nexora AI is not activated yet.</p>
              <p className="opacity-90">
                {!status?.server_enabled || !status?.has_credentials
                  ? 'Backend AI_ENABLED=true and a provider API key (e.g., GEMINI_API_KEY) must be configured on the server.'
                  : 'An administrator must enable Nexora AI in AI Settings.'}
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full text-xs text-slate-400">
              Loading conversation...
            </div>
          ) : messages.length === 0 && !isStreaming ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0891B2] text-white flex items-center justify-center shadow-lg mb-3">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                How can Nexora Copilot help today?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
                Ask about your authorized workforce data, HR policies, or professional drafting.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={aiDisabled}
                    onClick={() => sendMessage(prompt)}
                    className="text-left px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0F1B33] hover:border-blue-400 dark:hover:border-cyan-500 text-xs text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <AIMessage
                  key={msg.id}
                  message={msg}
                  isLastAssistant={msg.id === lastAssistantId}
                  onRegenerate={regenerateLast}
                  onFeedback={submitFeedback}
                />
              ))}

              {isStreaming && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0891B2] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white dark:bg-[#0F1B33] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                    {streamingTools.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {streamingTools.map((tc, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                          >
                            <Wrench className="w-3 h-3" />
                            {tc.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {streamingContent ? (
                      <AIMarkdown content={streamingContent} />
                    ) : (
                      <p className="text-xs text-slate-400 animate-pulse">Thinking...</p>
                    )}
                    {streamingCitations.length > 0 && (
                      <p className="text-[11px] text-slate-400">
                        Sources: {streamingCitations.map((c) => c.title).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#091224]">
          <AIChatInput
            disabled={aiDisabled}
            isStreaming={isStreaming}
            onSend={sendMessage}
            onStop={stopGenerating}
          />
        </div>
      </div>
    </div>
  );
}
