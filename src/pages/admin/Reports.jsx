import React, { useState, useEffect } from 'react';
import { reportApi } from '../../api/reports';
import { departmentApi } from '../../api/departments';
import { Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  FileText,
  Download,
  Filter,
  Users,
  Building2,
  CalendarCheck,
  CalendarDays,
  IndianRupee,
  FileSpreadsheet,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('employees'); // employees, departments, attendance, leaves, salaries
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  // Filter States
  const [filters, setFilters] = useState({
    department_id: '',
    status: '',
    start_date: '',
    end_date: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [activeTab, filters]);

  const fetchDepartments = async () => {
    try {
      const res = await departmentApi.getDepartments({ limit: 100 });
      setDepartments(res.items || []);
    } catch (err) {
      console.error('Failed to load departments', err);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      let res;
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );

      if (activeTab === 'employees') {
        res = await reportApi.getEmployeeReport(cleanParams);
      } else if (activeTab === 'departments') {
        res = await reportApi.getDepartmentReport();
      } else if (activeTab === 'attendance') {
        res = await reportApi.getAttendanceReport(cleanParams);
      } else if (activeTab === 'leaves') {
        res = await reportApi.getLeaveReport(cleanParams);
      } else if (activeTab === 'salaries') {
        res = await reportApi.getSalaryReport(cleanParams);
      }

      setData(Array.isArray(res) ? res : res?.items || []);
    } catch (err) {
      console.error('Failed to fetch report', err);
      toast.error('Failed to load report data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );
      reportApi.exportCsv(activeTab, cleanParams);
      toast.success(`Exporting ${activeTab} report as CSV...`);
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const handleExportExcel = () => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );
      reportApi.exportExcel(activeTab, cleanParams);
      toast.success(`Exporting ${activeTab} report as Excel (.xlsx)...`);
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const tabs = [
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'leaves', label: 'Leaves', icon: CalendarDays },
    { id: 'salaries', label: 'Payroll & Salaries', icon: IndianRupee },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate, filter, and export comprehensive organizational reports in CSV and Excel formats.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleExportCsv}
            icon={Download}
            className="flex items-center text-xs"
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            onClick={handleExportExcel}
            icon={FileSpreadsheet}
            className="flex items-center text-xs"
          >
            Export Excel (.xlsx)
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-1 sm:space-x-4 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-3 sm:px-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          {activeTab !== 'departments' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
                Department
              </label>
              <select
                value={filters.department_id}
                onChange={(e) => setFilters({ ...filters, department_id: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'employees' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="ON_LEAVE">ON_LEAVE</option>
                <option value="TERMINATED">TERMINATED</option>
              </select>
            </div>
          )}

          {(activeTab === 'attendance' || activeTab === 'leaves') && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                />
              </div>
            </>
          )}

          {activeTab === 'salaries' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Month
                </label>
                <select
                  value={filters.month}
                  onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                />
              </div>
            </>
          )}

          <div>
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  department_id: '',
                  status: '',
                  start_date: '',
                  end_date: '',
                  month: new Date().getMonth() + 1,
                  year: new Date().getFullYear(),
                })
              }
              className="w-full text-xs py-2"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Report Data Table */}
      <Card className="overflow-hidden p-0">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Records: <span className="text-slate-900 dark:text-white font-bold">{data.length}</span>
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : data.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Records Found"
            description="No data matches the selected filter parameters."
          />
        ) : (
          <div className="overflow-x-auto">
            {activeTab === 'employees' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Emp Code</th>
                    <th className="p-3.5">Full Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Job Position</th>
                    <th className="p-3.5">Hire Date</th>
                    <th className="p-3.5 text-right">Base Salary</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-mono font-semibold text-emerald-600">
                        {emp.employee_code}
                      </td>
                      <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                        {emp.full_name}
                      </td>
                      <td className="p-3.5 text-slate-500">{emp.email}</td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">
                        {emp.department?.name || 'Unassigned'}
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">
                        {emp.job_position}
                      </td>
                      <td className="p-3.5 text-slate-500">{formatDate(emp.hire_date)}</td>
                      <td className="p-3.5 text-right font-medium text-slate-900 dark:text-white">
                        {formatCurrency(emp.salary)}
                      </td>
                      <td className="p-3.5 text-center">
                        <Badge
                          variant={
                            emp.employment_status === 'ACTIVE'
                              ? 'success'
                              : emp.employment_status === 'ON_LEAVE'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {emp.employment_status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'departments' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5 text-center">Head Count</th>
                    <th className="p-3.5 text-right">Avg Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.map((dept) => (
                    <tr key={dept.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                        {dept.name}
                      </td>
                      <td className="p-3.5 text-slate-500">{dept.description || '-'}</td>
                      <td className="p-3.5 text-center font-bold text-slate-700 dark:text-slate-300">
                        {dept.employee_count || 0}
                      </td>
                      <td className="p-3.5 text-right font-medium text-slate-900 dark:text-white">
                        {formatCurrency(dept.avg_salary || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'attendance' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Emp Code</th>
                    <th className="p-3.5">Employee Name</th>
                    <th className="p-3.5">Check In</th>
                    <th className="p-3.5">Check Out</th>
                    <th className="p-3.5 text-right">Hours</th>
                    <th className="p-3.5 text-center">Late</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                        {att.date}
                      </td>
                      <td className="p-3.5 font-mono text-emerald-600">
                        {att.employee?.employee_code || '-'}
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">
                        {att.employee?.full_name || '-'}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono">
                        {att.check_in ? new Date(att.check_in).toLocaleTimeString() : '-'}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono">
                        {att.check_out ? new Date(att.check_out).toLocaleTimeString() : '-'}
                      </td>
                      <td className="p-3.5 text-right font-medium text-slate-900 dark:text-white">
                        {(att.working_hours ?? att.work_hours) ? `${Number(att.working_hours ?? att.work_hours).toFixed(2)}h` : '-'}
                      </td>
                      <td className="p-3.5 text-center">
                        {att.is_late ? (
                          <Badge variant="warning">Yes</Badge>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <Badge
                          variant={
                            att.status === 'PRESENT'
                              ? 'success'
                              : att.status === 'HALF_DAY'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {att.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'leaves' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Employee</th>
                    <th className="p-3.5">Leave Type</th>
                    <th className="p-3.5">Start Date</th>
                    <th className="p-3.5">End Date</th>
                    <th className="p-3.5 text-center">Days</th>
                    <th className="p-3.5">Reason</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.map((lv) => (
                    <tr key={lv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                        {lv.employee?.full_name || 'Emp #' + lv.employee_id}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                        {lv.leave_type}
                      </td>
                      <td className="p-3.5 text-slate-500">{lv.start_date}</td>
                      <td className="p-3.5 text-slate-500">{lv.end_date}</td>
                      <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                        {lv.days}
                      </td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">{lv.reason}</td>
                      <td className="p-3.5 text-center">
                        <Badge
                          variant={
                            lv.status === 'APPROVED'
                              ? 'success'
                              : lv.status === 'PENDING'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {lv.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'salaries' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Employee</th>
                    <th className="p-3.5">Period</th>
                    <th className="p-3.5 text-right">Base</th>
                    <th className="p-3.5 text-right">Bonuses</th>
                    <th className="p-3.5 text-right">Deductions</th>
                    <th className="p-3.5 text-right">Net Salary</th>
                    <th className="p-3.5 text-center">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.map((sal) => (
                    <tr key={sal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                        {sal.employee?.full_name || 'Emp #' + sal.employee_id}
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono">
                        {sal.month}/{sal.year}
                      </td>
                      <td className="p-3.5 text-right text-slate-600 dark:text-slate-400">
                        {formatCurrency(sal.base_salary)}
                      </td>
                      <td className="p-3.5 text-right text-emerald-600">
                        +{formatCurrency(sal.bonuses || 0)}
                      </td>
                      <td className="p-3.5 text-right text-rose-600">
                        -{formatCurrency(sal.deductions || 0)}
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-900 dark:text-white">
                        {formatCurrency(sal.net_salary)}
                      </td>
                      <td className="p-3.5 text-center">
                        <Badge variant={sal.status === 'PAID' ? 'success' : 'warning'}>
                          {sal.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
