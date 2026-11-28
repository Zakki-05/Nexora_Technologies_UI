'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import { Building2, Plus, Trash2, Users } from 'lucide-react';

export default function AdminDepartmentsPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => hrService.getDepartments({ page: 1, size: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: () => hrService.createDepartment({ name, description }),
    onSuccess: () => {
      toast.success('Department created');
      setName('');
      setDescription('');
      setShowCreate(false);
      void queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => hrService.deleteDepartment(id),
    onSuccess: () => {
      toast.success('Department deleted');
      void queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });

  return (
    <DashboardShell requireAdmin>
      <PageHeader
        title="Department Management"
        subtitle={`${data?.total ?? 0} departments configured`}
        actions={
          <button
            type="button"
            onClick={() => setShowCreate((s) => !s)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        }
      />

      {showCreate && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) createMutation.mutate();
          }}
          className="mb-6 p-5 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 grid sm:grid-cols-3 gap-3 items-end"
        >
          <div>
            <label className="block text-xs font-bold mb-1">Department Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1426] text-xs"
            />
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
          >
            {createMutation.isPending ? 'Saving...' : 'Create Department'}
          </button>
        </form>
      )}

      {isLoading ? (
        <PanelSpinner />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.items || []).map((dept) => (
            <div
              key={dept.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(dept.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                    title="Delete Department"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-base mt-3 text-slate-900 dark:text-white">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{dept.description || 'Corporate department unit'}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Active Headcount
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                  {dept.employee_count ?? 0} employee(s)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
