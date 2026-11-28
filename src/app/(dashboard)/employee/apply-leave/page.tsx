'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';

export default function EmployeeApplyLeavePage() {
  const router = useRouter();
  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const applyMutation = useMutation({
    mutationFn: () =>
      hrService.applyLeave({
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason,
      }),
    onSuccess: () => {
      toast.success('Leave request submitted');
      router.push('/employee/leaves');
    },
  });

  return (
    <DashboardShell>
      <PageHeader title="Apply for Leave" subtitle="Submit a new leave application against your corporate quota" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (endDate < startDate) {
            toast.error('End date cannot be earlier than start date.');
            return;
          }
          if (reason.trim().length < 3) {
            toast.error('Please enter a reason (at least 3 characters).');
            return;
          }
          applyMutation.mutate();
        }}
        className="max-w-xl p-6 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
      >
        <div>
          <label className="block text-xs font-bold mb-1.5">Leave Type</label>
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-sm">
            <option value="CASUAL">Casual Leave</option>
            <option value="SICK">Sick Leave</option>
            <option value="ANNUAL">Annual / Earned Leave</option>
            <option value="UNPAID">Unpaid Leave</option>
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1.5">Start Date</label>
            <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5">End Date</label>
            <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1.5">Reason</label>
          <textarea rows={3} required minLength={3} value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-sm" />
        </div>
        <button type="submit" disabled={applyMutation.isPending} className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold">
          {applyMutation.isPending ? 'Submitting...' : 'Submit Leave Request'}
        </button>
      </form>
    </DashboardShell>
  );
}
