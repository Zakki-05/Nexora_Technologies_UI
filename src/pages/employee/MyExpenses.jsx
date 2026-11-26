import React, { useState, useEffect } from 'react';
import { expenseApi } from '../../api/expenses';
import { useAuth } from '../../context/AuthContext';
import { Card, Badge, StatCard } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Modal, LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Receipt,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  CreditCard,
  DollarSign,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const EmployeeExpenses = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({ total_amount: 0, approved_amount: 0, pending_amount: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');

  const [form, setForm] = useState({
    title: '',
    category: 'TRAVEL',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    notes: '',
    receipt_name: '',
  });

  useEffect(() => {
    loadClaims();
  }, [user]);

  const loadClaims = async () => {
    setLoading(true);
    try {
      const data = await expenseApi.getAll({
        employee_id: user?.employee_id || user?.id,
      });
      setClaims(data.items || []);
      setStats({
        total_amount: data.total_amount || 0,
        approved_amount: data.approved_amount || 0,
        pending_amount: data.pending_amount || 0,
      });
    } catch {
      toast.error('Failed to load expense claims');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount || parseFloat(form.amount) <= 0) {
      toast.error('Please enter a valid title and amount');
      return;
    }

    setSubmitting(true);
    try {
      await expenseApi.submit({
        ...form,
        employee_id: user?.employee_id || user?.id,
        employee_name: user?.employee?.full_name || user?.username || 'Current Employee',
        employee_code: user?.employee?.employee_code || 'EMP-1001',
        department: user?.employee?.department?.name || 'Operations',
      });
      toast.success('Expense claim submitted for administrative approval!');
      setShowSubmitModal(false);
      setForm({
        title: '',
        category: 'TRAVEL',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        notes: '',
        receipt_name: '',
      });
      loadClaims();
    } catch (err) {
      toast.error(err.message || 'Failed to submit expense claim');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      case 'PENDING':
      default:
        return <Badge variant="warning">Pending Review</Badge>;
    }
  };

  const filteredClaims = filterCategory
    ? claims.filter((c) => c.category === filterCategory)
    : claims;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Expense Claims &amp; Reimbursements
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Submit business travel, equipment, meals, and certification receipts for company reimbursement
          </p>
        </div>
        <Button onClick={() => setShowSubmitModal(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Submit New Claim
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Claimed
            </span>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(stats.total_amount)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Reimbursed / Approved
            </span>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatCurrency(stats.approved_amount)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Pending Approval
            </span>
            <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
              {formatCurrency(stats.pending_amount)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Table Card */}
      <Card className="!p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Claims History ({filteredClaims.length} records)
          </h3>
          <div className="flex items-center space-x-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              <option value="">All Categories</option>
              <option value="TRAVEL">Travel &amp; Fuel</option>
              <option value="MEALS">Meals &amp; Entertainment</option>
              <option value="HARDWARE">Hardware &amp; Equipment</option>
              <option value="SOFTWARE">Software &amp; Internet</option>
              <option value="TRAINING">Training &amp; Certification</option>
              <option value="MEDICAL">Medical &amp; Health</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner className="py-20" />
        ) : filteredClaims.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No Expense Claims"
            description="You have not submitted any reimbursement claims yet."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Title / Purpose</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {claim.title}
                      {claim.notes && (
                        <p className="text-[11px] text-slate-400 font-normal mt-0.5 line-clamp-1">
                          {claim.notes}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {claim.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{claim.expense_date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white font-mono">
                      {formatCurrency(claim.amount)}
                      {claim.approved_amount !== null && claim.status === 'APPROVED' && (
                        <p className="text-[10px] text-emerald-600 font-normal">
                          Approved: {formatCurrency(claim.approved_amount)}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(claim.status)}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                      {claim.reviewer_remarks || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* New Claim Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Submit Expense Reimbursement Claim
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Submit legitimate corporate expenses with business justification for HR and Finance review.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Claim Title / Purpose *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Client Dinner, Bangalore Tech Summit, Software License"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Expense Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="TRAVEL">Travel &amp; Fuel</option>
                    <option value="MEALS">Meals &amp; Hospitality</option>
                    <option value="HARDWARE">Hardware &amp; Equipment</option>
                    <option value="SOFTWARE">Software &amp; Subscriptions</option>
                    <option value="TRAINING">Certifications &amp; Courses</option>
                    <option value="MEDICAL">Medical &amp; Wellness</option>
                    <option value="OFFICE_SUPPLIES">Office Supplies</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Claim Amount (₹ INR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="e.g. 2500"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Expense Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.expense_date}
                    onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Receipt / Bill Ref
                  </label>
                  <input
                    type="text"
                    placeholder="Bill / Invoice #10294"
                    value={form.receipt_name}
                    onChange={(e) => setForm({ ...form, receipt_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Business Justification / Remarks
                </label>
                <textarea
                  rows="3"
                  placeholder="Explain why this expense was necessary for your project or corporate duties..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" type="button" onClick={() => setShowSubmitModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Claim'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
