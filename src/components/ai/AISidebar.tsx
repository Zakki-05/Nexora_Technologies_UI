'use client';

import React, { useState } from 'react';
import {
  Download,
  MessageSquarePlus,
  Pencil,
  Pin,
  Search,
  Trash2,
} from 'lucide-react';
import type { AIConversation } from '@/features/ai/types/ai';

interface AISidebarProps {
  conversations: AIConversation[];
  activeConversationId: number | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelect: (id: number) => void;
  onNew: () => void;
  onRename: (id: number, title: string) => void;
  onTogglePin: (conv: AIConversation) => void;
  onDelete: (id: number) => void;
  onExport: () => void;
  canExport: boolean;
}

export function AISidebar({
  conversations,
  activeConversationId,
  searchQuery,
  onSearchChange,
  onSelect,
  onNew,
  onRename,
  onTogglePin,
  onDelete,
  onExport,
  canExport,
}: AISidebarProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftTitle, setDraftTitle] = useState('');

  const startRename = (conv: AIConversation) => {
    setEditingId(conv.id);
    setDraftTitle(conv.title);
  };

  const commitRename = (id: number) => {
    const trimmed = draftTitle.trim();
    if (trimmed) onRename(id, trimmed);
    setEditingId(null);
  };

  return (
    <aside className="w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#091224] flex flex-col h-full">
      <div className="p-3 space-y-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNew}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0891B2] text-white text-xs font-semibold shadow-sm hover:opacity-95"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
          <button
            type="button"
            onClick={onExport}
            disabled={!canExport}
            title="Export conversation as Markdown"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1930] text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8 px-3">
            No conversations yet. Start a new chat with Nexora Copilot.
          </p>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            return (
              <div
                key={conv.id}
                className={`group rounded-xl px-2.5 py-2 flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/70'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
                onClick={() => onSelect(conv.id)}
              >
                {editingId === conv.id ? (
                  <input
                    autoFocus
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    onBlur={() => commitRename(conv.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename(conv.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 text-xs bg-white dark:bg-slate-900 border border-blue-400 rounded px-1.5 py-0.5 outline-none"
                  />
                ) : (
                  <span className="flex-1 truncate text-xs font-medium">{conv.title}</span>
                )}

                <div
                  className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onTogglePin(conv)}
                    title={conv.is_pinned ? 'Unpin' : 'Pin'}
                    className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${
                      conv.is_pinned ? 'text-amber-500 opacity-100' : ''
                    }`}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => startRename(conv)}
                    title="Rename"
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(conv.id)}
                    title="Delete"
                    className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
