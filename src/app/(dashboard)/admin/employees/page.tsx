'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, StatusBadge, formatINR, triggerBlobDownload } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { Search, FileSpreadsheet, Trash2, X } from 'lucide-react';

export default function AdminEmployeesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['employees', page, search],
    queryFn: () => hrService.getEmployees({ page, size: 20, search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => hrService.deleteEmployee(id),
    onSuccess: () => {
      toast.success('Employee updated/deactivated');
      void queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const handleExport = async (format: 'excel' | 'csv') => {
    try {
      const blob = await hrService.exportReportBlob(format, 'employees');
      triggerBlobDownload(blob, `nexora_employees.${format === 'excel' ? 'xlsx' : 'csv'}`);
      toast.success(`Exported ${format.toUpperCase()} successfully`);
    } catch {
      toast.error('Failed to export employee report');
    }
  };

  return (
    <DashboardShell requireAdmin>
      <PageHeader
        title="Employee Directory"
        subtitle={`Managing ${data?.total ?? '...'} corporate employees in PostgreSQL`}
        actions={
          <>
            <button
              type="button"
              onClick={() => void handleExport('excel')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </button>
            <button
              type="button"
              onClick={() => void handleExport('csv')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Export CSV
            </button>
          </>
        }
      />

      <div className="mb-4 relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search name, code, email, phone, position..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-[#111C32] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <PanelSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0B1426] text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Employee</th>
                  <th className="px-4 py-3.5">Code</th>
                  <th className="px-4 py-3.5">Position</th>
                  <th className="px-4 py-3.5">Salary</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data?.items || []).map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900 dark:text-white">{emp.full_name}</p>
                      <p className="text-slate-500">{emp.email || emp.phone}</p>
                    </td>
                    <td className="px-4 py-3.5 font-mono">{emp.employee_code}</td>
                    <td className="px-4 py-3.5">{emp.position}</td>
                    <td className="px-4 py-3.5 font-semibold">{formatINR(emp.salary)}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={emp.employment_status} /></td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(emp.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Deactivate Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.pages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Page {data.page} of {data.pages} ({data.total} total)</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= data.pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
