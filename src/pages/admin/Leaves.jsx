import React, { useState, useEffect } from 'react';
import { leaveApi } from '../../api/leaves';
import { Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal, Pagination, LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';
import { CalendarDays, CheckCircle, XCircle, Clock, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [activeTab, setActiveTab] = useState('ALL');

  // Reject Modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await leaveApi.getAll({
        page,
        size: 10,
        status_filter: activeTab === 'ALL' ? undefined : activeTab,
      });
      setLeaves(data.items);
      setTotalPages(data.pages);
      setTotalItems(data.total);
    } catch {
      toast.error('Failed to load leave applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [page, activeTab]);

  const handleApprove = async (leave) => {
    if (window.confirm(`Approve leave request for ${leave.employee?.full_name}?`)) {
      setProcessing(true);
      try {
        await leaveApi.review(leave.id, 'APPROVED');
        toast.success('Leave approved successfully!');
        fetchLeaves();
      } catch (err) {
        toast.error(err.response?.data?.detail || 'Failed to approve leave');
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleOpenReject = (leave) => {
    setSelectedLeave(leave);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }
    setProcessing(true);
    try {
      await leaveApi.review(selectedLeave.id, 'REJECTED', rejectionReason);
      toast.success('Leave rejected with remarks');
      setShowRejectModal(false);
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to reject leave');
    } finally {
      setProcessing(false);
    }
  };

  const tabs = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Leave Applications & Approvals
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Review employee time-off requests, adjust balances, and maintain approval audit trail
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={`py-2.5 px-4 text-xs font-bold transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Leaves Table */}
      <Card className="!p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner className="py-24" />
        ) : leaves.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No leave requests"
            description={`No leave applications found in '${activeTab}' status.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {leave.employee?.full_name || `Employee #${leave.employee_id}`}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {leave.employee?.employee_code}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {leave.leave_type}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {formatDate(leave.start_date)} to {formatDate(leave.end_date)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {leave.days_count} day(s)
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          leave.status === 'APPROVED'
                            ? 'success'
                            : leave.status === 'REJECTED'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {leave.status}
                      </Badge>
                      {leave.rejection_reason && (
                        <p className="text-[10px] text-rose-500 mt-1 italic">
                          "{leave.rejection_reason}"
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {leave.status === 'PENDING' ? (
                        <div className="inline-flex items-center space-x-1.5">
                          <button
                            onClick={() => handleApprove(leave)}
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 rounded-lg transition-colors"
                            title="Approve Leave"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenReject(leave)}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 rounded-lg transition-colors"
                            title="Reject Leave"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Reviewed
                        </span>
                      )}
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

      {/* Rejection Remarks Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Leave Request"
        subtitle={`Please state the reason for rejecting ${selectedLeave?.employee?.full_name}'s application`}
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Rejection Remarks / Justification
            </label>
            <textarea
              required
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Inadequate staffing during annual sprint period..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowRejectModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" type="submit" loading={processing}>
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
