'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, formatDateStr } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { FolderOpen } from 'lucide-react';

export default function EmployeeDocumentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-documents'],
    queryFn: () => hrService.getMyDocuments(),
  });

  const items = Array.isArray(data) ? data : data?.items || [];

  return (
    <DashboardShell>
      <PageHeader title="My Documents" subtitle="Verified corporate HR records, offer letters, and ID proofs" />

      {isLoading ? (
        <PanelSpinner />
      ) : items.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
          No documents uploaded yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((doc) => (
            <div key={doc.id} className="p-4 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-[#2563EB] flex items-center justify-center">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">{doc.title}</p>
                <p className="text-xs text-slate-500">{doc.document_type} &bull; {formatDateStr(doc.created_at || doc.uploaded_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
