'use client';

import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Activity,
  Bot,
  FileText,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { aiService } from '@/features/ai/services/aiService';
import type {
  AIConfigPayload,
  AIDocument,
  AIProviderConfig,
  AIUsageSummary,
} from '@/features/ai/types/ai';

export default function AdminAISettingsPage() {
  const [configData, setConfigData] = useState<AIConfigPayload | null>(null);
  const [form, setForm] = useState<Partial<AIProviderConfig>>({});
  const [usage, setUsage] = useState<AIUsageSummary | null>(null);
  const [documents, setDocuments] = useState<AIDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('hr_policy');
  const [docVisibility, setDocVisibility] = useState<'organization' | 'hr_admin' | 'private'>('organization');
  const [docFile, setDocFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [cfgRes, usageRes, docsRes] = await Promise.all([
        aiService.getConfig(),
        aiService.getUsage(),
        aiService.listDocuments(),
      ]);
      setConfigData(cfgRes);
      setForm(cfgRes.config);
      setUsage(usageRes);
      setDocuments(docsRes);
    } catch {
      toast.error('Failed to load AI settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await aiService.updateConfig(form);
      setForm(updated);
      toast.success('AI settings saved.');
      await loadAll();
    } catch {
      toast.error('Failed to update AI settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile) {
      toast.error('Please select a document (.txt, .md, .csv, .json, .docx).');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', docFile);
      fd.append('title', docTitle.trim() || docFile.name);
      fd.append('category', docCategory);
      fd.append('visibility', docVisibility);
      await aiService.uploadDocument(fd);
      toast.success('Document indexed for RAG.');
      setDocTitle('');
      setDocFile(null);
      await loadAll();
    } catch {
      toast.error('Failed to upload and index document.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (id: number) => {
    try {
      await aiService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      toast.success('Document removed.');
    } catch {
      toast.error('Failed to delete document.');
    }
  };

  return (
    <DashboardShell requireAdmin>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-6 h-6 text-blue-600" />
              <span>Nexora AI Settings &amp; Knowledge Base</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configure LLM provider, token quotas, and HR policy documents for RAG.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">Loading AI configuration...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Provider & Guardrail Configuration */}
            <form
              onSubmit={handleSaveConfig}
              className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B162C] p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Provider &amp; Governance</span>
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    configData?.server_ai_enabled
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {configData?.server_ai_enabled ? 'Server AI_ENABLED=true' : 'Server AI_ENABLED=false'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Active Provider
                  </label>
                  <select
                    value={form.active_provider || 'gemini'}
                    onChange={(e) => setForm((f) => ({ ...f, active_provider: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#091224] px-3 py-2 text-sm"
                  >
                    {Object.entries(configData?.providers || {}).map(([key, info]) => (
                      <option key={key} value={key} disabled={!info.implemented}>
                        {info.label} {info.implemented ? (info.has_credentials ? '(Ready)' : '(No Key)') : '(Planned)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Active Model
                  </label>
                  <input
                    type="text"
                    value={form.active_model || ''}
                    onChange={(e) => setForm((f) => ({ ...f, active_model: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#091224] px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Max Tokens / Request
                  </label>
                  <input
                    type="number"
                    min={128}
                    max={8192}
                    value={form.max_tokens_per_request ?? 2048}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, max_tokens_per_request: Number(e.target.value) }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#091224] px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Daily Token Limit / User
                  </label>
                  <input
                    type="number"
                    min={1000}
                    max={5000000}
                    value={form.daily_user_token_limit ?? 50000}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, daily_user_token_limit: Number(e.target.value) }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#091224] px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {(
                  [
                    ['is_enabled', 'Enable Copilot'],
                    ['allow_tools', 'Workforce Tools'],
                    ['allow_rag', 'RAG Knowledge'],
                    ['allow_general_chat', 'General Chat'],
                  ] as const
                ).map(([field, label]) => (
                  <label
                    key={field}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(form[field])}
                      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.checked }))}
                      className="rounded border-slate-300 text-blue-600"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0891B2] text-white text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save AI Configuration'}</span>
                </button>
              </div>
            </form>

            {/* Usage Summary */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B162C] p-5 space-y-4 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Activity className="w-4 h-4 text-cyan-600" />
                <span>Usage &amp; Audit Summary</span>
              </h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#091224]">
                  <p className="text-slate-400">Total Requests</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    {usage?.total_requests ?? 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#091224]">
                  <p className="text-slate-400">Total Tokens</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    {(usage?.total_tokens ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Recent AI Audits
                </p>
                {(usage?.recent_audits || []).length === 0 ? (
                  <p className="text-xs text-slate-400">No AI audit events recorded yet.</p>
                ) : (
                  usage?.recent_audits.slice(0, 8).map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100 dark:border-slate-800/60"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {a.action}
                        {a.tool_name ? ` (${a.tool_name})` : ''}
                      </span>
                      <span className="text-slate-400">{a.output_status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RAG Knowledge Base */}
            <div className="lg:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B162C] p-5 space-y-4 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>RAG Knowledge Base Documents</span>
              </h2>

              <form onSubmit={handleUploadDoc} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. 2026 Leave & Attendance Policy"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#091224] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Visibility
                  </label>
                  <select
                    value={docVisibility}
                    onChange={(e) =>
                      setDocVisibility(e.target.value as 'organization' | 'hr_admin' | 'private')
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#091224] px-3 py-2 text-sm"
                  >
                    <option value="organization">All Employees</option>
                    <option value="hr_admin">HR &amp; Admin Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    File (.txt, .md, .docx, .csv)
                  </label>
                  <input
                    type="file"
                    accept=".txt,.md,.csv,.json,.docx,.pdf"
                    onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Indexing...' : 'Upload & Index'}</span>
                </button>
              </form>

              <div className="overflow-x-auto">
                <table className="min-w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-[#091224] text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Title</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Visibility</th>
                      <th className="px-3 py-2">Chunks</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {documents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-6 text-center text-slate-400">
                          No RAG documents indexed yet.
                        </td>
                      </tr>
                    ) : (
                      documents.map((d) => (
                        <tr key={d.id}>
                          <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-100">
                            {d.title}
                          </td>
                          <td className="px-3 py-2.5">{d.category}</td>
                          <td className="px-3 py-2.5">{d.visibility}</td>
                          <td className="px-3 py-2.5">{d.chunk_count}</td>
                          <td className="px-3 py-2.5">{d.status}</td>
                          <td className="px-3 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteDoc(d.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              title="Delete document"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
