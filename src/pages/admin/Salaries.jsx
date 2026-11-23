import React, { useState, useEffect } from 'react';
import { salaryApi } from '../../api/salaries';
import { employeeApi } from '../../api/employees';
import { Card, Badge, StatCard } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Modal, Pagination, LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  IndianRupee,
  Plus,
  Play,
  Calculator,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  Settings2,
  ListOrdered,
  FileCheck,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminSalaries = () => {
  const [activeTab, setActiveTab] = useState('payroll'); // 'payroll' | 'structures'

  // Salaries table state
  const [salaries, setSalaries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  // PDF download state
  const [downloadingId, setDownloadingId] = useState(null);

  // Manual Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    basic_salary: '',
    allowances: '0.00',
    deductions: '0.00',
    payment_date: new Date().toISOString().split('T')[0],
    status: 'PAID',
    payment_method: 'BANK_TRANSFER',
    notes: 'Regular monthly salary',
  });
  const [saving, setSaving] = useState(false);

  // Run Payroll Modal
  const [showRunModal, setShowRunModal] = useState(false);
  const [payrollForm, setPayrollForm] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    action: 'PREVIEW',
  });
  const [runningPayroll, setRunningPayroll] = useState(false);
  const [payrollPreviewResult, setPayrollPreviewResult] = useState(null);

  // Structures state
  const [structures, setStructures] = useState([]);
  const [structLoading, setStructLoading] = useState(false);
  const [editingStruct, setEditingStruct] = useState(null);
  const [structForm, setStructForm] = useState({
    annual_ctc: 600000,
    basic_percentage: 50,
    hra_percentage: 20,
    conveyance_allowance: 1600,
    medical_allowance: 1250,
    epf_applicable: true,
    esic_applicable: false,
    professional_tax: 200,
    tds_monthly: 0,
  });
  const [savingStruct, setSavingStruct] = useState(false);
  const [previewingStruct, setPreviewingStruct] = useState(null);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const [res, sum] = await Promise.all([
        salaryApi.getAll({
          page,
          size: 10,
          status_filter: statusFilter || undefined,
        }),
        salaryApi.getSummary(),
      ]);
      setSalaries(res.items || []);
      setTotalPages(res.pages || 1);
      setTotalItems(res.total || 0);
      setSummary(sum);
    } catch {
      toast.error('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await employeeApi.getAll({ size: 100 });
      setEmployees(data.items || []);
    } catch {
      // Ignore
    }
  };

  const fetchStructures = async () => {
    setStructLoading(true);
    try {
      const res = await salaryApi.getStructures({ size: 100 });
      setStructures(res.items || []);
    } catch {
      toast.error('Failed to load salary structures');
    } finally {
      setStructLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (activeTab === 'payroll') {
      fetchSalaries();
    } else {
      fetchStructures();
    }
  }, [page, statusFilter, activeTab]);

  const handleOpenAdd = () => {
    const firstEmp = employees[0];
    setFormData({
      employee_id: firstEmp ? firstEmp.id.toString() : '',
      basic_salary: firstEmp ? firstEmp.salary.toString() : '',
      allowances: '0.00',
      deductions: '0.00',
      payment_date: new Date().toISOString().split('T')[0],
      status: 'PAID',
      payment_method: 'BANK_TRANSFER',
      notes: 'Regular monthly salary',
    });
    setShowAddModal(true);
  };

  const handleEmployeeChange = (empId) => {
    const found = employees.find((e) => e.id.toString() === empId);
    setFormData({
      ...formData,
      employee_id: empId,
      basic_salary: found ? found.salary.toString() : formData.basic_salary,
    });
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await salaryApi.create({
        ...formData,
        employee_id: parseInt(formData.employee_id, 10),
        basic_salary: parseFloat(formData.basic_salary),
        allowances: parseFloat(formData.allowances || 0),
        deductions: parseFloat(formData.deductions || 0),
      });
      toast.success('Salary disbursement recorded successfully');
      setShowAddModal(false);
      fetchSalaries();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to record salary');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this salary disbursement record?')) {
      try {
        await salaryApi.delete(id);
        toast.success('Record deleted');
        fetchSalaries();
      } catch {
        toast.error('Failed to delete salary record');
      }
    }
  };

  const handleDownloadPdf = async (salaryId, empCode, month, year) => {
    setDownloadingId(salaryId);
    try {
      toast.loading('Generating official PDF payslip...', { id: 'admin-pdf' });
      const blob = await salaryApi.downloadPayslip(salaryId);
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: 'application/pdf' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Payslip_${empCode || salaryId}_${month}_${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Payslip downloaded!', { id: 'admin-pdf' });
    } catch (err) {
      console.error('Payslip download failed', err);
      toast.error('Failed to download PDF payslip', { id: 'admin-pdf' });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleRunPayrollSubmit = async (overrideAction = null) => {
    const actionToUse = overrideAction || payrollForm.action;
    setRunningPayroll(true);
    try {
      const res = await salaryApi.runPayroll({
        year: parseInt(payrollForm.year, 10),
        month: parseInt(payrollForm.month, 10),
        action: actionToUse,
      });

      if (actionToUse === 'PREVIEW') {
        setPayrollPreviewResult(res);
        toast.success(`Payroll preview calculated for ${res.total_employees} employees`);
      } else {
        toast.success(`Payroll successfully processed for ${res.processed_count} employees!`);
        setShowRunModal(false);
        setPayrollPreviewResult(null);
        fetchSalaries();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to execute payroll run');
    } finally {
      setRunningPayroll(false);
    }
  };

  const handleOpenEditStruct = async (struct) => {
    setEditingStruct(struct);
    setStructForm({
      annual_ctc: struct.annual_ctc,
      basic_percentage: struct.basic_percentage,
      hra_percentage: struct.hra_percentage,
      conveyance_allowance: struct.conveyance_allowance,
      medical_allowance: struct.medical_allowance,
      epf_applicable: struct.epf_applicable,
      esic_applicable: struct.esic_applicable,
      professional_tax: struct.professional_tax,
      tds_monthly: struct.tds_monthly,
    });
    // Trigger preview
    try {
      const prev = await salaryApi.previewStructure({
        annual_ctc: struct.annual_ctc,
        basic_percentage: struct.basic_percentage,
        hra_percentage: struct.hra_percentage,
        conveyance_allowance: struct.conveyance_allowance,
        medical_allowance: struct.medical_allowance,
        epf_applicable: struct.epf_applicable,
        esic_applicable: struct.esic_applicable,
        professional_tax: struct.professional_tax,
        tds_monthly: struct.tds_monthly,
      });
      setPreviewingStruct(prev);
    } catch {
      // Ignore
    }
  };

  const handleSaveStruct = async (e) => {
    e.preventDefault();
    if (!editingStruct) return;
    setSavingStruct(true);
    try {
      await salaryApi.updateStructure(editingStruct.employee_id, {
        annual_ctc: parseFloat(structForm.annual_ctc),
        basic_percentage: parseFloat(structForm.basic_percentage),
        hra_percentage: parseFloat(structForm.hra_percentage),
        conveyance_allowance: parseFloat(structForm.conveyance_allowance),
        medical_allowance: parseFloat(structForm.medical_allowance),
        epf_applicable: structForm.epf_applicable,
        esic_applicable: structForm.esic_applicable,
        professional_tax: parseFloat(structForm.professional_tax),
        tds_monthly: parseFloat(structForm.tds_monthly),
      });
      toast.success('Salary structure updated successfully');
      setEditingStruct(null);
      fetchStructures();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update salary structure');
    } finally {
      setSavingStruct(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Payroll & Statutory Compensation Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Indian statutory deductions (EPF, ESIC, PT, TDS), attendance-linked LOP calculations, and PDF payslips
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            onClick={() => {
              setPayrollPreviewResult(null);
              setShowRunModal(true);
            }}
            className="sm:self-auto self-start text-xs shadow-md shadow-emerald-500/20"
          >
            <Calculator className="w-4 h-4 mr-1.5" /> Run Monthly Payroll
          </Button>
          <Button
            variant="outline"
            onClick={handleOpenAdd}
            className="sm:self-auto self-start text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Manual Entry
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('payroll')}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'payroll'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>Payroll Disbursements & Slips</span>
        </button>
        <button
          onClick={() => setActiveTab('structures')}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'structures'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span>Corporate CTC Salary Structures</span>
        </button>
      </div>

      {/* TAB 1: PAYROLL RUNS & DISBURSEMENTS */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Total Disbursed Payroll"
                value={formatCurrency(summary.total_payroll)}
                subtitle={`${summary.record_count} total payments`}
                icon={IndianRupee}
                color="purple"
              />
              <StatCard
                title="Successfully Paid"
                value={formatCurrency(summary.total_paid)}
                icon={CheckCircle}
                color="emerald"
              />
              <StatCard
                title="Pending Disbursement"
                value={formatCurrency(summary.total_pending)}
                icon={Clock}
                color="amber"
              />
            </div>
          )}

          {/* Table */}
          <Card className="!p-0 overflow-hidden">
            {loading ? (
              <LoadingSpinner className="py-24" />
            ) : salaries.length === 0 ? (
              <EmptyState
                icon={IndianRupee}
                title="No salary records"
                description="No compensation payouts recorded in the system yet. Run monthly payroll to generate statements."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Period</th>
                      <th className="py-3 px-4">Basic</th>
                      <th className="py-3 px-4">Allowances</th>
                      <th className="py-3 px-4">Deductions</th>
                      <th className="py-3 px-4">Net Salary</th>
                      <th className="py-3 px-4">Payment Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {salaries.map((sal) => (
                      <tr
                        key={sal.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {sal.employee?.full_name || `Employee #${sal.employee_id}`}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {sal.employee?.employee_code}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                          {sal.month
                            ? `${new Date(2000, sal.month - 1).toLocaleString('default', { month: 'short' })} ${sal.year}`
                            : formatDate(sal.payment_date)}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {formatCurrency(sal.base_salary || sal.basic_salary)}
                        </td>
                        <td className="py-3 px-4 text-emerald-600 font-medium">
                          +{formatCurrency(sal.allowances || sal.bonuses || 0)}
                        </td>
                        <td className="py-3 px-4 text-rose-500 font-medium">
                          -{formatCurrency(sal.deductions || 0)}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-white">
                          {formatCurrency(sal.net_salary)}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {sal.payment_date ? formatDate(sal.payment_date) : 'Pending'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={sal.status === 'PAID' ? 'success' : 'warning'}
                          >
                            {sal.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() =>
                                handleDownloadPdf(
                                  sal.id,
                                  sal.employee?.employee_code,
                                  sal.month,
                                  sal.year
                                )
                              }
                              disabled={downloadingId === sal.id}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Download Official PDF Payslip"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(sal.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={10}
              onPageChange={(p) => setPage(p)}
            />
          </Card>
        </div>
      )}

      {/* TAB 2: SALARY STRUCTURES (CTC) */}
      {activeTab === 'structures' && (
        <Card className="!p-0 overflow-hidden">
          {structLoading ? (
            <LoadingSpinner className="py-24" />
          ) : structures.length === 0 ? (
            <EmptyState
              icon={Settings2}
              title="No Structures Configured"
              description="No employee salary structures found."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4 text-right">Annual CTC</th>
                    <th className="py-3 px-4 text-right">Monthly Base</th>
                    <th className="py-3 px-4 text-center">Basic %</th>
                    <th className="py-3 px-4 text-center">HRA %</th>
                    <th className="py-3 px-4 text-center">EPF / ESIC</th>
                    <th className="py-3 px-4 text-right">PT / TDS</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {structures.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {s.employee?.full_name || `Employee #${s.employee_id}`}
                        <span className="block text-[11px] text-slate-400 font-mono">
                          {s.employee?.employee_code}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                        {formatCurrency(s.annual_ctc)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-300">
                        {formatCurrency(s.monthly_gross)}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {s.basic_percentage}%
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {s.hra_percentage}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              s.epf_applicable
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                            }`}
                          >
                            EPF
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              s.esic_applicable
                                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                                : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                            }`}
                          >
                            ESIC
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                        ₹{s.professional_tax} / ₹{s.tds_monthly}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          onClick={() => handleOpenEditStruct(s)}
                          className="text-[11px] py-1 px-2.5"
                        >
                          Configure
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* RUN MONTHLY PAYROLL MODAL */}
      <Modal
        isOpen={showRunModal}
        onClose={() => setShowRunModal(false)}
        title="Run Corporate Monthly Payroll"
        subtitle="Automated statutory EPF, ESIC, PT, TDS deduction and Attendance LOP calculation"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payroll Year
              </label>
              <input
                type="number"
                value={payrollForm.year}
                onChange={(e) =>
                  setPayrollForm({ ...payrollForm, year: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payroll Month
              </label>
              <select
                value={payrollForm.month}
                onChange={(e) =>
                  setPayrollForm({ ...payrollForm, month: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {[...Array(12).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleString('default', { month: 'long' })} ({i + 1})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Execution Mode
              </label>
              <select
                value={payrollForm.action}
                onChange={(e) =>
                  setPayrollForm({ ...payrollForm, action: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="PREVIEW">PREVIEW (Simulate without saving)</option>
                <option value="PROCESS">PROCESS (Compute & Save Records)</option>
                <option value="LOCK">LOCK (Finalize & Lock Period)</option>
              </select>
            </div>
          </div>

          {/* Action button to calculate */}
          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              onClick={() => handleRunPayrollSubmit()}
              loading={runningPayroll}
              icon={Calculator}
              className="text-xs"
            >
              Calculate & Preview
            </Button>
          </div>

          {/* PREVIEW RESULTS DISPLAY */}
          {payrollPreviewResult && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-center">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Employees</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {payrollPreviewResult.total_employees}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Gross Pay</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {formatCurrency(payrollPreviewResult.total_gross_pay)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Deductions</p>
                  <p className="text-lg font-black text-rose-600 mt-0.5">
                    -{formatCurrency(payrollPreviewResult.total_deductions)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Net Payout</p>
                  <p className="text-lg font-black text-emerald-600 mt-0.5">
                    {formatCurrency(payrollPreviewResult.total_net_pay)}
                  </p>
                </div>
              </div>

              {/* Items Preview Table */}
              <div className="max-h-60 overflow-y-auto border rounded-xl border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-bold sticky top-0 text-[10px] uppercase text-slate-500">
                    <tr>
                      <th className="p-2.5">Employee</th>
                      <th className="p-2.5 text-right">Base</th>
                      <th className="p-2.5 text-right">Gross</th>
                      <th className="p-2.5 text-right">LOP Days</th>
                      <th className="p-2.5 text-right">Deductions</th>
                      <th className="p-2.5 text-right">Net Take-Home</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {payrollPreviewResult.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">
                          {item.employee_name} ({item.employee_code})
                        </td>
                        <td className="p-2.5 text-right">{formatCurrency(item.basic_salary)}</td>
                        <td className="p-2.5 text-right font-medium text-slate-700 dark:text-slate-300">
                          {formatCurrency(item.gross_salary)}
                        </td>
                        <td className="p-2.5 text-right font-mono text-amber-600">
                          {item.lop_days || 0}d
                        </td>
                        <td className="p-2.5 text-right text-rose-500">
                          -{formatCurrency(item.total_deductions)}
                        </td>
                        <td className="p-2.5 text-right font-bold text-emerald-600">
                          {formatCurrency(item.net_salary)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Confirm Process Button */}
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => setShowRunModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  icon={Play}
                  onClick={() => handleRunPayrollSubmit('PROCESS')}
                  loading={runningPayroll}
                >
                  Commit & Save Payroll Records
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* EDIT SALARY STRUCTURE MODAL */}
      <Modal
        isOpen={!!editingStruct}
        onClose={() => setEditingStruct(null)}
        title="Configure Salary Structure (CTC)"
        subtitle={`Employee: ${editingStruct?.employee?.full_name} (${editingStruct?.employee?.employee_code})`}
        maxWidth="max-w-2xl"
      >
        {editingStruct && (
          <form onSubmit={handleSaveStruct} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Annual CTC (₹)"
                type="number"
                step="1000"
                required
                value={structForm.annual_ctc}
                onChange={(e) =>
                  setStructForm({ ...structForm, annual_ctc: e.target.value })
                }
              />
              <Input
                label="Basic Salary % (of Monthly CTC)"
                type="number"
                step="0.5"
                min="30"
                max="70"
                required
                value={structForm.basic_percentage}
                onChange={(e) =>
                  setStructForm({ ...structForm, basic_percentage: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="HRA %"
                type="number"
                step="0.5"
                value={structForm.hra_percentage}
                onChange={(e) =>
                  setStructForm({ ...structForm, hra_percentage: e.target.value })
                }
              />
              <Input
                label="Conveyance (₹/mo)"
                type="number"
                step="50"
                value={structForm.conveyance_allowance}
                onChange={(e) =>
                  setStructForm({
                    ...structForm,
                    conveyance_allowance: e.target.value,
                  })
                }
              />
              <Input
                label="Medical (₹/mo)"
                type="number"
                step="50"
                value={structForm.medical_allowance}
                onChange={(e) =>
                  setStructForm({
                    ...structForm,
                    medical_allowance: e.target.value,
                  })
                }
              />
            </div>

            {/* Checkboxes for EPF and ESIC */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Statutory Compliance Deductions:
              </span>
              <div className="flex items-center space-x-6 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={structForm.epf_applicable}
                    onChange={(e) =>
                      setStructForm({
                        ...structForm,
                        epf_applicable: e.target.checked,
                      })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    EPF (12% of Basic, max ₹1,800/mo)
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={structForm.esic_applicable}
                    onChange={(e) =>
                      setStructForm({
                        ...structForm,
                        esic_applicable: e.target.checked,
                      })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    ESIC (0.75% where applicable)
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Professional Tax (₹/mo)"
                type="number"
                step="50"
                value={structForm.professional_tax}
                onChange={(e) =>
                  setStructForm({
                    ...structForm,
                    professional_tax: e.target.value,
                  })
                }
              />
              <Input
                label="TDS Monthly Deduction (₹)"
                type="number"
                step="100"
                value={structForm.tds_monthly}
                onChange={(e) =>
                  setStructForm({
                    ...structForm,
                    tds_monthly: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditingStruct(null)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={savingStruct}>
                Save Salary Structure
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* MANUAL DISBURSE MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Disburse Employee Salary"
        subtitle="Issue a manual compensation payout record"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <Select
            label="Employee"
            required
            value={formData.employee_id}
            onChange={(e) => handleEmployeeChange(e.target.value)}
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.full_name} ({e.employee_code})
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Basic Salary (₹)"
              type="number"
              step="0.01"
              required
              value={formData.basic_salary}
              onChange={(e) =>
                setFormData({ ...formData, basic_salary: e.target.value })
              }
            />
            <Input
              label="Allowances (₹)"
              type="number"
              step="0.01"
              value={formData.allowances}
              onChange={(e) =>
                setFormData({ ...formData, allowances: e.target.value })
              }
            />
            <Input
              label="Deductions (₹)"
              type="number"
              step="0.01"
              value={formData.deductions}
              onChange={(e) =>
                setFormData({ ...formData, deductions: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Payment Date"
              type="date"
              required
              value={formData.payment_date}
              onChange={(e) =>
                setFormData({ ...formData, payment_date: e.target.value })
              }
            />
            <Select
              label="Payment Method"
              value={formData.payment_method}
              onChange={(e) =>
                setFormData({ ...formData, payment_method: e.target.value })
              }
            >
              <option value="BANK_TRANSFER">BANK_TRANSFER</option>
              <option value="CHEQUE">CHEQUE</option>
              <option value="CASH">CASH</option>
            </Select>
          </div>

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
          </Select>

          <Input
            label="Notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Confirm Disbursement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
