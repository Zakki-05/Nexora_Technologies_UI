'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, StatusBadge } from '@/components/shared/UiPrimitives';
import { authService } from '@/services/authService';
import { Search, X } from 'lucide-react';

export default function AdminSettingsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: () => authService.getUsers({ page, size: 20, search: search || undefined }),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => authService.updateUserStatus(id, active),
    onSuccess: () => {
      toast.success('User status updated');
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  return (
    <DashboardShell requireAdmin>
      <PageHeader title="Settings & User Accounts" subtitle={`Total registered accounts: ${data?.total ?? '...'}`} />

      <div className="mb-4 relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search user email or username..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 text-sm outline-none"
        />
        {search && (
          <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
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
                  <th className="px-4 py-3.5">ID</th>
                  <th className="px-4 py-3.5">Email Address</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data?.items || []).map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-mono">#{u.id}</td>
                    <td className="px-4 py-3 font-semibold">{u.email}</td>
                    <td className="px-4 py-3 font-bold text-[#2563EB] dark:text-[#06B6D4]">{u.role}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.is_active ? 'ACTIVE' : 'INACTIVE'} /></td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => toggleStatusMutation.mutate({ id: u.id, active: !u.is_active })}
                        className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
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
