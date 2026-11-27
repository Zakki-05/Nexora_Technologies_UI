'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { Send } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('NORMAL');

  const sendMutation = useMutation({
    mutationFn: () => hrService.sendAnnouncement({ title, content, priority }),
    onSuccess: () => {
      toast.success('Corporate broadcast published');
      setTitle('');
      setContent('');
    },
  });

  return (
    <DashboardShell requireAdmin>
      <PageHeader title="Corporate Broadcasts" subtitle="Publish company-wide announcements and alerts" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim() && content.trim()) sendMutation.mutate();
        }}
        className="max-w-2xl p-6 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
      >
        <div>
          <label className="block text-xs font-bold mb-1.5">Announcement Title</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1.5">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-sm">
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1.5">Message</label>
          <textarea rows={4} required value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-sm" />
        </div>
        <button type="submit" disabled={sendMutation.isPending} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold">
          <Send className="w-4 h-4" /> {sendMutation.isPending ? 'Publishing...' : 'Publish Broadcast'}
        </button>
      </form>
    </DashboardShell>
  );
}
