'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, StatusBadge, formatDateStr } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';

export default function EmployeeProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => hrService.getMyProfile(),
  });

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (profile) {
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: () => hrService.updateMyProfile({ phone, address }),
    onSuccess: () => {
      toast.success('Profile updated');
      void queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
  });

  return (
    <DashboardShell>
      <PageHeader title="My Profile" subtitle="Manage your personal contact information" />

      {isLoading || !profile ? (
        <PanelSpinner />
      ) : (
        <div className="max-w-2xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-extrabold">{profile.full_name}</h2>
              <p className="text-xs text-slate-500">{profile.position} &bull; {profile.employee_code}</p>
            </div>
            <StatusBadge status={profile.employment_status} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <p><strong>Email:</strong> {profile.email || '—'}</p>
            <p><strong>Hire Date:</strong> {formatDateStr(profile.hire_date)}</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateMutation.mutate();
            }}
            className="space-y-4 pt-2"
          >
            <div>
              <label className="block text-xs font-bold mb-1">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-sm" />
            </div>
            <button type="submit" disabled={updateMutation.isPending} className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold">
              {updateMutation.isPending ? 'Saving...' : 'Save Contact Details'}
            </button>
          </form>
        </div>
      )}
    </DashboardShell>
  );
}
