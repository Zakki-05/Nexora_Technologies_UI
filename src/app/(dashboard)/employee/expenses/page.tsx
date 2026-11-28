'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, StatCard, StatusBadge, formatINR, formatDateStr } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { Receipt, CheckCircle, Clock, Plus } from 'lucide-react';

export default function EmployeeExpensesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('TRAVEL');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['my-expenses'],
    queryFn: () => hrService.getMyExpenses(),
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      hrService.submitExpense({
        title,
        category,
        amount: Number(amount),
        expense_date: expenseDate,
      }),
    onSuccess: () => {
      toast.success('Expense claim submitted');
      setTitle('');
      setAmount('');
      setExpenseDate('');
      setShowForm(false);
      void queryClient.invalidateQueries({ queryKey: ['my-expenses'] });
    },
  });

  return (
    <DashboardShell>
      <PageHeader
        title="My Expense Claims"
        subtitle="Submit business reimbursements and track approval status"
        actions={
          <button
            type="button"
            onClick={() => setShowForm((s) => !s)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
          >
            <Plus className="w-4 h-4" /> New Claim
          </button>
        }
      />

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitMutation.mutate();
          }}
          className="mb-6 p-5 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 grid sm:grid-cols-4 gap-3 items-end"
        >
          <div>
            <label className="block text-xs font-bold mb-1">Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-xs" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-xs">
              <option value="TRAVEL">Travel</option>
              <option value="HARDWARE">Hardware</option>
              <option value="SOFTWARE">Software</option>
              <option value="TRAINING">Training</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Amount (INR)</label>
            <input type="number" min="1" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-xs" />
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs font-bold mb-1">Date</label>
              <input type="date" required value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-xs" />
            </div>
            <button type="submit" disabled={submitMutation.isPending} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
              Submit
            </button>
          </div>
        </form>
      )}

      {isLoading || !data ? (
        <PanelSpinner />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Total Claimed" value={formatINR(data.total_amount)} icon={Receipt} accent="blue" />
            <StatCard title="Approved" value={formatINR(data.approved_amount)} icon={CheckCircle} accent="emerald" />
            <StatCard title="Pending" value={formatINR(data.pending_amount)} icon={Clock} accent="amber" />
          </div>

          <div className="bg-white dark:bg-[#111C32] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0B1426] text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Title</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.items.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 font-bold">{c.title}</td>
                    <td className="px-4 py-3">{c.category}</td>
                    <td className="px-4 py-3">{formatDateStr(c.expense_date)}</td>
                    <td className="px-4 py-3 font-bold">{formatINR(c.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
