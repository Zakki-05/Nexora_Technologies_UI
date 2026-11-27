'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, triggerBlobDownload } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { FileSpreadsheet, FileText } from 'lucide-react';

export default function AdminReportsPage() {
  const handleDownload = async (format: 'excel' | 'csv', reportType: string) => {
    try {
      const blob = await hrService.exportReportBlob(format, reportType);
      triggerBlobDownload(blob, `nexora_${reportType}.${format === 'excel' ? 'xlsx' : 'csv'}`);
      toast.success(`${reportType} ${format.toUpperCase()} downloaded`);
    } catch {
      toast.error(`Failed to export ${reportType}`);
    }
  };

  const modules = [
    { type: 'employees', title: 'Employee Directory', desc: 'Complete 556-employee registry with codes, departments, and salaries' },
    { type: 'attendance', title: 'Attendance Register', desc: 'Daily punch-in/out logs, work hours, and late arrival flags' },
    { type: 'leaves', title: 'Leave Ledger Report', desc: 'Leave applications, approvals, and balance deductions' },
    { type: 'salaries', title: 'Payroll Summary', desc: 'Indian statutory payroll, EPF, ESIC, PT, TDS, and net pay' },
  ];

  return (
    <DashboardShell requireAdmin>
      <PageHeader title="Reports & Exports" subtitle="Download real-time Excel (.xlsx) and CSV workforce reports" />

      <div className="grid sm:grid-cols-2 gap-5">
        {modules.map((m) => (
          <div key={m.type} className="p-6 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{m.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
            </div>
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => void handleDownload('excel', m.type)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                <FileSpreadsheet className="w-4 h-4" /> Excel
              </button>
              <button
                type="button"
                onClick={() => void handleDownload('csv', m.type)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
              >
                <FileText className="w-4 h-4" /> CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
