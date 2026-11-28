'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, StatusBadge, formatINR, triggerBlobDownload } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { Download } from 'lucide-react';

export default function AdminSalariesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-salaries'],
    queryFn: () => hrService.getSalaries({ page: 1, size: 50 }),
  });

  const handleDownloadPdf = async (salaryId: number) => {
    try {
      const blob = await hrService.downloadPayslipPdf(salaryId, false);
      triggerBlobDownload(blob, `Nexora_Payslip_${salaryId}.pdf`);
      toast.success('Payslip PDF downloaded');
    } catch {
      toast.error('Failed to download payslip PDF');
    }
  };

  return (
    <DashboardShell requireAdmin>
      <PageHeader title="Salaries & Indian Payroll" subtitle="Manage salary records, statutory EPF/ESIC deductions, and PDF payslips" />

      <div className="bg-white dark:bg-[#111C32] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <PanelSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0B1426] text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Employee</th>
                  <th className="px-4 py-3.5">Period</th>
                  <th className="px-4 py-3.5">Basic</th>
                  <th className="px-4 py-3.5">Deductions</th>
                  <th className="px-4 py-3.5">Net Pay</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data?.items || []).map((sal) => (
                  <tr key={sal.id}>
                    <td className="px-4 py-3 font-bold">{sal.employee_name || `EMP #${sal.employee_id}`}</td>
                    <td className="px-4 py-3">{sal.month && sal.year ? `${sal.month}/${sal.year}` : sal.payment_date || '—'}</td>
                    <td className="px-4 py-3">{formatINR(sal.basic_salary)}</td>
                    <td className="px-4 py-3 text-rose-500">{formatINR(sal.deductions)}</td>
                    <td className="px-4 py-3 font-extrabold text-emerald-600 dark:text-emerald-400">{formatINR(sal.net_salary)}</td>
                    <td className="px-4 py-3"><StatusBadge status={sal.status || 'PAID'} /></td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => void handleDownloadPdf(sal.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2563EB]/10 text-[#2563EB] font-bold hover:bg-[#2563EB]/20"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
