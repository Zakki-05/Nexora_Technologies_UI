import React, { useState, useEffect } from 'react';
import { expenseApi } from '../../api/expenses';
import { Card, Badge, StatCard } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  DollarSign,
  Search,
  Check,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminExpenses = () => {
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({ total_amount: 0, approved_amount: 0, pending_amount: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');

  // Review Modal State
  const [reviewingClaim, setReviewingClaim] = useState(null);
  const [reviewAction, setReviewAction] = useState('APPROVE'); // APPROVE or REJECT
  const [approvedAmount, setApprovedAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadClaims();
  }, [statusFilter, categoryFilter]);

  const loadClaims = async () => {
    setLoading(true);
    try {
      const data = await expenseApi.getAll({
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
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

  const handleOpenReview = (claim, action) => {
    setReviewingClaim(claim);
    setReviewAction(action);
    setApprovedAmount(claim.amount);
    setRemarks(action === 'APPROVE' ? 'Approved per company reimbursement policy.' : '');
  };

  const handleConfirmReview = async (e) => {
    e.preventDefault();
    if (reviewAction === 'REJECT' && !remarks.trim()) {
      toast.error('Please specify a rejection reason');
      return;
    }

    setProcessing(true);
    try {
      await expenseApi.review(reviewingClaim.id, {
        status: reviewAction === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        approved_amount: reviewAction === 'APPROVE' ? parseFloat(approvedAmount) : 0,
        remarks: remarks.trim(),
      });
      toast.success(
        `Claim ${reviewAction === 'APPROVE' ? 'approved' : 'rejected'} for ${reviewingClaim.employee_name}`
      );
      setReviewingClaim(null);
      loadClaims();
    } catch (err) {
      toast.error(err.message || 'Failed to review claim');
    } finally {
      setProcessing(false);
    }
  };

  const filteredClaims = claims.filter((c) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      c.title?.toLowerCase().includes(term) ||
      c.employee_name?.toLowerCase().includes(term) ||
      c.employee_code?.toLowerCase().includes(term) ||
      c.department?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Corporate Expense Claims &amp; Approvals
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit employee reimbursement requests, verify invoices, approve payments, and track budgets
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Budget Claimed
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
              Approved &amp; Paid
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
              Pending Review
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

      {/* Control Filter Bar */}
      <Card className="!p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              placeholder="Search by title, employee name, or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Review Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Categories</option>
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
      </Card>

      {/* Claims Table */}
      <Card className="!p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner className="py-20" />
        ) : filteredClaims.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No Claims Found"
            description="No reimbursement claims match your current filter criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Claim Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {claim.employee_name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {claim.employee_code} &bull; {claim.department}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {claim.title}
                      </p>
                      {claim.notes && (
                        <p className="text-[11px] text-slate-400 line-clamp-1">{claim.notes}</p>
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
                          Paid: {formatCurrency(claim.approved_amount)}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {claim.status === 'APPROVED' ? (
                        <Badge variant="success">Approved</Badge>
                      ) : claim.status === 'REJECTED' ? (
                        <Badge variant="danger">Rejected</Badge>
                      ) : (
                        <Badge variant="warning">Pending Review</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {claim.status === 'PENDING' ? (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenReview(claim, 'APPROVE')}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                            title="Approve Claim"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenReview(claim, 'REJECT')}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors"
                            title="Reject Claim"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Decision Logged</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Review Modal */}
      {reviewingClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setReviewingClaim(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {reviewAction === 'APPROVE' ? 'Approve Expense Claim' : 'Reject Expense Claim'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Review claim #{reviewingClaim.id} for <strong>{reviewingClaim.employee_name}</strong>
            </p>

            <form onSubmit={handleConfirmReview} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Title:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{reviewingClaim.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Original Claim:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {formatCurrency(reviewingClaim.amount)}
                  </span>
                </div>
              </div>

              {reviewAction === 'APPROVE' && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Approved Reimbursement Amount (₹ INR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {reviewAction === 'APPROVE' ? 'Approval Remarks' : 'Reason for Rejection *'}
                </label>
                <textarea
                  rows="3"
                  required={reviewAction === 'REJECT'}
                  placeholder={
                    reviewAction === 'APPROVE'
                      ? 'Approved per policy...'
                      : 'Missing tax invoice, non-compliant expense...'
                  }
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" type="button" onClick={() => setReviewingClaim(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className={reviewAction === 'REJECT' ? '!bg-rose-600 hover:!bg-rose-700' : ''}
                >
                  {processing
                    ? 'Processing...'
                    : reviewAction === 'APPROVE'
                    ? 'Confirm Approval'
                    : 'Confirm Rejection'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
