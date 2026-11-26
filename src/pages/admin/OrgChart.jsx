import React, { useState, useEffect } from 'react';
import { employeeApi } from '../../api/employees';
import { departmentApi } from '../../api/departments';
import { Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import {
  Network,
  Users,
  Building2,
  Search,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Mail,
  Phone,
  Briefcase,
  Layers,
  Crown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminOrgChart = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDepts, setExpandedDepts] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [deptList, empRes] = await Promise.all([
        departmentApi.getAllList ? departmentApi.getAllList() : departmentApi.getDepartments({ limit: 100 }),
        employeeApi.getAll({ size: 100 }),
      ]);
      const depts = Array.isArray(deptList) ? deptList : deptList.items || [];
      const emps = empRes.items || [];
      setDepartments(depts);
      setEmployees(emps);

      // Auto-expand first 5 departments
      const initExpanded = {};
      depts.slice(0, 5).forEach((d) => {
        initExpanded[d.id] = true;
      });
      setExpandedDepts(initExpanded);
    } catch (err) {
      console.error('Failed to load org chart data', err);
      toast.error('Failed to load organization hierarchy');
    } finally {
      setLoading(false);
    }
  };

  const toggleDept = (deptId) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [deptId]: !prev[deptId],
    }));
  };

  const expandAll = () => {
    const all = {};
    departments.forEach((d) => (all[d.id] = true));
    setExpandedDepts(all);
  };

  const collapseAll = () => {
    setExpandedDepts({});
  };

  // Filter departments & employees
  const filteredDepartments = departments.filter((dept) => {
    if (selectedDeptId && dept.id !== parseInt(selectedDeptId, 10)) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const matchesDeptName = dept.name.toLowerCase().includes(term);
    const hasMatchingEmployee = employees.some(
      (e) =>
        e.department_id === dept.id &&
        (e.full_name?.toLowerCase().includes(term) ||
          e.employee_code?.toLowerCase().includes(term) ||
          e.position?.toLowerCase().includes(term) ||
          e.user?.email?.toLowerCase().includes(term))
    );
    return matchesDeptName || hasMatchingEmployee;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Organization Hierarchy & Team Chart
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Interactive 2.0
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visualize organizational reporting lines, executive leadership, and multi-department teams
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="secondary" onClick={expandAll} className="text-xs py-1.5 px-3">
            Expand All
          </Button>
          <Button variant="secondary" onClick={collapseAll} className="text-xs py-1.5 px-3">
            Collapse All
          </Button>
        </div>
      </div>

      {/* Control Bar */}
      <Card className="!p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              placeholder="Search by employee name, code, title, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
          >
            <option value="">All Departments ({departments.length})</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Hierarchy View */}
      {loading ? (
        <LoadingSpinner className="py-24" />
      ) : departments.length === 0 ? (
        <EmptyState
          icon={Network}
          title="No Organization Data"
          description="Initialize departments and employees to visualize the team chart."
        />
      ) : (
        <div className="space-y-6">
          {/* Executive Leadership Tier */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl border border-slate-700/60 shadow-xl text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                  Executive Leadership & Corporate Governance
                </h3>
              </div>
              <span className="text-[11px] text-slate-300 bg-white/10 px-2.5 py-1 rounded-full font-medium">
                Level 1: System Directorate
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CTO & Super Admin Card */}
              <div
                onClick={() => {
                  const superAdminEmp = employees.find((e) => e.employee_code === 'EMP-1000');
                  if (superAdminEmp) setSelectedEmployee(superAdminEmp);
                }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl transition-all cursor-pointer backdrop-blur-md flex items-center space-x-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white font-extrabold text-base shadow-lg shrink-0">
                  SA
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-white truncate">Super Administrator</h4>
                    <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-amber-400 text-slate-950">
                      CTO
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/80">Chief Technology Officer &amp; Principal Architect</p>
                  <p className="text-[11px] text-slate-300 mt-1 flex items-center space-x-1 truncate">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0 inline" />
                    <span>superadmin@ems.com</span>
                  </p>
                </div>
              </div>

              {/* HR & Operations Director Card */}
              <div
                onClick={() => {
                  const adminEmp = employees.find((e) => e.employee_code === 'EMP-1002');
                  if (adminEmp) setSelectedEmployee(adminEmp);
                }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl transition-all cursor-pointer backdrop-blur-md flex items-center space-x-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold text-base shadow-lg shrink-0">
                  HR
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-white truncate">System Administrator</h4>
                    <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-emerald-400 text-slate-950">
                      ADMIN
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/80">HR &amp; Operations Director</p>
                  <p className="text-[11px] text-slate-300 mt-1 flex items-center space-x-1 truncate">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0 inline" />
                    <span>admin@ems.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Departmental Tree & Team Nodes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Departmental Clusters ({filteredDepartments.length} Departments Active)
              </h3>
            </div>

            {filteredDepartments.map((dept) => {
              const deptEmployees = employees.filter((e) => e.department_id === dept.id);
              const isExpanded = !!expandedDepts[dept.id];

              return (
                <div
                  key={dept.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
                >
                  {/* Department Banner Bar */}
                  <div
                    onClick={() => toggleDept(dept.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors select-none"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {dept.name}
                          </h4>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            {deptEmployees.length} member{deptEmployees.length === 1 ? '' : 's'}
                          </span>
                        </div>
                        {dept.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {dept.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:inline">
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Department Members Grid */}
                  {isExpanded && (
                    <div className="p-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
                      {deptEmployees.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400 italic">
                          No team members allocated to this department yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {deptEmployees.map((emp) => {
                            const isMatched =
                              searchTerm &&
                              (emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                emp.employee_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                emp.position?.toLowerCase().includes(searchTerm.toLowerCase()));

                            return (
                              <div
                                key={emp.id}
                                onClick={() => setSelectedEmployee(emp)}
                                className={`p-3.5 rounded-xl border bg-white dark:bg-slate-900 transition-all cursor-pointer hover:shadow-md hover:border-emerald-500/50 ${
                                  isMatched
                                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                                    : 'border-slate-200/80 dark:border-slate-800'
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  {/* Avatar Initials */}
                                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-slate-200 dark:border-slate-700">
                                    {emp.full_name ? emp.full_name.slice(0, 2) : 'EM'}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        {emp.full_name}
                                      </h5>
                                      <span className="text-[10px] font-mono text-slate-400">
                                        {emp.employee_code}
                                      </span>
                                    </div>

                                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate mt-0.5">
                                      {emp.position || 'Staff Associate'}
                                    </p>

                                    <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5">
                                      {emp.user?.email && (
                                        <p className="truncate flex items-center space-x-1">
                                          <Mail className="w-2.5 h-2.5 inline text-slate-400" />
                                          <span>{emp.user.email}</span>
                                        </p>
                                      )}
                                      {emp.phone && (
                                        <p className="truncate flex items-center space-x-1">
                                          <Phone className="w-2.5 h-2.5 inline text-slate-400" />
                                          <span>{emp.phone}</span>
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedEmployee(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
            >
              ✕
            </button>

            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-black uppercase border border-emerald-500/30">
                {selectedEmployee.full_name ? selectedEmployee.full_name.slice(0, 2) : 'EM'}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedEmployee.full_name}
                </h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {selectedEmployee.position}
                </p>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedEmployee.employee_code}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400">Department</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedEmployee.department?.name || 'Assigned Department'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400">Email Address</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedEmployee.user?.email || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400">Phone Number</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedEmployee.phone || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400">Employment Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {selectedEmployee.employment_status || 'ACTIVE'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Date of Joining</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedEmployee.hire_date || 'N/A'}
                </span>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => setSelectedEmployee(null)}
              className="w-full mt-5 text-xs py-2"
            >
              Close Window
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
