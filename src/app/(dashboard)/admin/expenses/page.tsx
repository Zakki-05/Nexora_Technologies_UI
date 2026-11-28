'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, StatCard, StatusBadge, formatINR, formatDateStr } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { Receipt, CheckCircle, Clock, Check, X } from 'lucide-react';

export default function AdminExpensesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-expenses'],
    queryFn: () => hrService.getExpenses(),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, amount }: { id: number; status: 'APPROVED' | 'REJECTED'; amount: number }) =>
      hrService.reviewExpense(id, { status, approved_amount: status === 'APPROVED' ? amount : 0 }),
    onSuccess: () => {
      toast.success('Expense claim reviewed');
      void queryClient.invalidateQueries({ queryKey: ['admin-expenses'] });
    },
  });

  return (
    <DashboardShell requireAdmin>
      <PageHeader title="Corporate Expense Claims" subtitle="Review and approve employee reimbursements" />

      {isLoading || !data ? (
        <PanelSpinner />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Total Claimed" value={formatINR(data.total_amount)} icon={Receipt} accent="blue" />
            <StatCard title="Approved Amount" value={formatINR(data.approved_amount)} icon={CheckCircle} accent="emerald" />
            <StatCard title="Pending Review" value={formatINR(data.pending_amount)} icon={Clock} accent="amber" />
          </div>

          <div className="bg-white dark:bg-[#111C32] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#0B1426] text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3.5">Employee</th>
                    <th className="px-4 py-3.5">Title &amp; Category</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Amount</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.items.map((claim) => (
                    <tr key={claim.id}>
                      <td className="px-4 py-3 font-bold">{claim.employee_name} <span className="text-slate-400 font-mono">({claim.employee_code})</span></td>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{claim.title}</p>
                        <p className="text-slate-400">{claim.category}</p>
                      </td>
                      <td className="px-4 py-3">{formatDateStr(claim.expense_date)}</td>
                      <td className="px-4 py-3 font-bold">{formatINR(claim.amount)}</td>
                      <td className="px-4 py-3"><StatusBadge status={claim.status} /></td>
                      <td className="px-4 py-3 text-right space-x-1">
                        {claim.status === 'PENDING' && (
                          <>
                            <button
                              type="button"
                              onClick={() => reviewMutation.mutate({ id: claim.id, status: 'APPROVED', amount: claim.amount })}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => reviewMutation.mutate({ id: claim.id, status: 'REJECTED', amount: 0 })}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
