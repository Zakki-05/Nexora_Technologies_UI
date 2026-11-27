'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/shared/UiPrimitives';
import { authService } from '@/services/authService';
import { KeyRound } from 'lucide-react';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export default function EmployeeChangePasswordPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (vals: FormValues) => {
    try {
      await authService.changePassword(vals.currentPassword, vals.newPassword);
      toast.success('Password updated successfully');
      reset();
    } catch {
      // Handled by global Axios interceptor
    }
  };

  return (
    <DashboardShell>
      <PageHeader title="Change Password" subtitle="Update your Nexora Workforce account password" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md p-6 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
      >
        <div>
          <label className="block text-xs font-bold mb-1">Current Password</label>
          <input type="password" {...register('currentPassword')} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-sm" />
          {errors.currentPassword && <p className="text-xs text-rose-500 mt-1">{errors.currentPassword.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">New Password</label>
          <input type="password" {...register('newPassword')} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-sm" />
          {errors.newPassword && <p className="text-xs text-rose-500 mt-1">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">Confirm New Password</label>
          <input type="password" {...register('confirmPassword')} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-sm" />
          {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold">
          <KeyRound className="w-4 h-4" /> {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </DashboardShell>
  );
}
