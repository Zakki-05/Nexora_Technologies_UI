'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, StatusBadge, formatINR, triggerBlobDownload } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { Download } from 'lucide-react';

export default function EmployeeSalaryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-salaries'],
    queryFn: () => hrService.getMySalaries({ page: 1, size: 24 }),
  });

  const handleDownloadPdf = async (salaryId: number) => {
    try {
      const blob = await hrService.downloadPayslipPdf(salaryId, true);
      triggerBlobDownload(blob, `My_Nexora_Payslip_${salaryId}.pdf`);
      toast.success('Payslip PDF downloaded');
    } catch {
      toast.error('Failed to download payslip PDF');
    }
  };

  return (
    <DashboardShell>
      <PageHeader title="My Salary & Payslips" subtitle="View your monthly statutory breakdown and download PDF payslips" />

      <div className="bg-white dark:bg-[#111C32] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <PanelSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0B1426] text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Pay Period</th>
                  <th className="px-4 py-3.5">Basic</th>
                  <th className="px-4 py-3.5">Deductions</th>
                  <th className="px-4 py-3.5">Net Pay</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data?.items || []).map((sal) => (
                  <tr key={sal.id}>
                    <td className="px-4 py-3 font-bold">{sal.month && sal.year ? `${sal.month}/${sal.year}` : sal.payment_date || '—'}</td>
                    <td className="px-4 py-3">{formatINR(sal.basic_salary)}</td>
                    <td className="px-4 py-3 text-rose-500">{formatINR(sal.deductions)}</td>
                    <td className="px-4 py-3 font-extrabold text-emerald-600 dark:text-emerald-400">{formatINR(sal.net_salary)}</td>
                    <td className="px-4 py-3"><StatusBadge status={sal.status || 'PAID'} /></td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => void handleDownloadPdf(sal.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2563EB]/10 text-[#2563EB] font-bold"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PDF
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
