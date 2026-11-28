'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader, PanelSpinner, StatusBadge } from '@/components/shared/UiPrimitives';
import { hrService } from '@/services/hrService';
import type { Employee } from '@/types/hr';
import { Building2, Search, Crown, X } from 'lucide-react';

export default function AdminOrgChartPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  const { data: deptData, isLoading: deptsLoading } = useQuery({
    queryKey: ['org-depts'],
    queryFn: () => hrService.getDepartments({ page: 1, size: 100 }),
  });

  const { data: empData, isLoading: empsLoading } = useQuery({
    queryKey: ['org-emps'],
    queryFn: () => hrService.getEmployees({ page: 1, size: 100 }),
  });

  const departments = deptData?.items || [];
  const employees = empData?.items || [];
  const filteredEmps = searchTerm
    ? employees.filter(
        (e) =>
          e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : employees;

  return (
    <DashboardShell requireAdmin>
      <PageHeader
        title="Organization Hierarchy Chart"
        subtitle="Executive directorate and departmental workforce structure"
      />

      <div className="mb-6 relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Highlight employee by name, code, or role..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 text-sm outline-none"
        />
      </div>

      {deptsLoading || empsLoading ? (
        <PanelSpinner />
      ) : (
        <div className="space-y-6">
          <div className="max-w-md mx-auto p-5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#0891B2] text-white text-center shadow-lg">
            <Crown className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs uppercase font-bold tracking-wider opacity-85">Executive Directorate</p>
            <h2 className="text-lg font-extrabold">Nexora Technologies Inc.</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept) => {
              const deptMembers = filteredEmps.filter((e) => e.department_id === dept.id);
              return (
                <div
                  key={dept.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111C32] border border-slate-200/80 dark:border-slate-800 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#2563EB]" />
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{dept.name}</h3>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-[#2563EB]">
                      {dept.employee_count ?? deptMembers.length}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {deptMembers.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No matching members in loaded page</p>
                    ) : (
                      deptMembers.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedEmp(m)}
                          className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1426] hover:border-[#2563EB] border border-transparent transition flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{m.full_name}</p>
                            <p className="text-[11px] text-slate-500">{m.position}</p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{m.employee_code}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedEmp && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#111C32] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold">{selectedEmp.full_name}</h3>
              <button type="button" onClick={() => setSelectedEmp(null)} aria-label="Close modal">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <p><strong>Code:</strong> {selectedEmp.employee_code}</p>
              <p><strong>Position:</strong> {selectedEmp.position}</p>
              <p><strong>Email / Phone:</strong> {selectedEmp.email || selectedEmp.phone}</p>
              <p><strong>Status:</strong> <StatusBadge status={selectedEmp.employment_status} /></p>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
