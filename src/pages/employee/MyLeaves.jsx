import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leaveApi } from '../../api/leaves';
import { Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal, Pagination, LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';
import {
  CalendarDays,
  Plus,
  Filter,
  XCircle,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const EmployeeLeaves = () => {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'ledger'

  // Leaves state
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  // Ledger state
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [ledgerPage, setLedgerPage] = useState(1);
  const [ledgerTotalPages, setLedgerTotalPages] = useState(1);
  const [ledgerTotalItems, setLedgerTotalItems] = useState(0);

  // Cancellation Modal
  const [cancellingLeave, setCancellingLeave] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Details Modal
  const [viewingLeave, setViewingLeave] = useState(null);

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchLeaves();
    } else {
      fetchLedger();
    }
  }, [page, statusFilter, activeTab, ledgerPage]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const params = { page, size: 15 };
      if (statusFilter) params.status = statusFilter;

      const res = await leaveApi.getMyLeaves(params);
      setLeaves(res.items || []);
      setTotalPages(res.pages || 1);
      setTotalItems(res.total || 0);
    } catch (err) {
      console.error('Failed to load leaves', err);
      toast.error('Failed to load leave history');
    } finally {
      setLoading(false);
    }
  };

  const fetchLedger = async () => {
    setLedgerLoading(true);
    try {
      const res = await leaveApi.getLedger({ page: ledgerPage, size: 20 });
      setLedgerEntries(res.items || []);
      setLedgerTotalPages(res.pages || 1);
      setLedgerTotalItems(res.total || 0);
    } catch (err) {
      console.error('Failed to load leave ledger', err);
      toast.error('Failed to load leave transaction ledger');
    } finally {
      setLedgerLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingLeave) return;
    setCancelling(true);
    try {
      await leaveApi.cancelLeave(cancellingLeave.id);
      toast.success('Leave application cancelled successfully. Balance restored.');
      setCancellingLeave(null);
      fetchLeaves();
      if (activeTab === 'ledger') fetchLedger();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to cancel leave');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">Approved</Badge>;
      case 'PENDING':
        return <Badge variant="warning">Pending Review</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      case 'CANCELLED':
        return <Badge variant="default">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getTransactionBadge = (type) => {
    switch (type) {
      case 'ALLOCATION':
        return <Badge variant="success">ALLOCATION</Badge>;
      case 'REFUND':
        return <Badge variant="info">REFUND</Badge>;
      case 'RESERVATION':
        return <Badge variant="warning">RESERVED</Badge>;
      case 'DEDUCTION':
        return <Badge variant="danger">DEDUCTED</Badge>;
      case 'ADJUSTMENT':
        return <Badge variant="purple">ADJUSTMENT</Badge>;
      default:
        return <Badge variant="default">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Leave Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review time-off requests, supervisor approvals, and immutable quota transaction ledger.
          </p>
        </div>
        <Link to="/employee/apply-leave">
          <Button variant="primary" icon={Plus} className="text-xs">
            Apply New Leave
          </Button>
        </Link>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'requests'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Leave Requests</span>
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'ledger'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Leave Transaction Ledger</span>
        </button>
      </div>

      {/* TAB 1: Leave Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {/* Filter Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {['', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white dark:bg-emerald-600'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {st === '' ? 'All Requests' : st}
              </button>
            ))}
          </div>

          {/* Leaves History Table */}
          <Card className="p-0 overflow-hidden">
            {loading ? (
              <div className="py-20 flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : leaves.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No Leave Applications"
                description="You have not submitted any leave requests matching the active filter."
                action={
                  <Link to="/employee/apply-leave">
                    <Button variant="primary" className="text-xs">
                      Apply for Leave Now
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5">Leave Type</th>
                      <th className="p-3.5">Start Date</th>
                      <th className="p-3.5">End Date</th>
                      <th className="p-3.5 text-center">Days</th>
                      <th className="p-3.5">Reason</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {leaves.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center space-x-1.5">
                            <span>{item.leave_type}</span>
                            {item.is_half_day && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-semibold">
                                {item.half_day_session === 'SECOND_HALF'
                                  ? '2nd Half'
                                  : '1st Half'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono">
                          {item.start_date}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono">
                          {item.end_date}
                        </td>
                        <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                          {item.days}
                        </td>
                        <td className="p-3.5 text-slate-500 max-w-xs truncate">
                          {item.reason}
                        </td>
                        <td className="p-3.5 text-center">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={() => setViewingLeave(item)}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {(item.status === 'PENDING' || item.status === 'APPROVED') && (
                              <button
                                onClick={() => setCancellingLeave(item)}
                                className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded text-rose-600"
                                title="Cancel Application"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
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
              pageSize={15}
              onPageChange={setPage}
            />
          </Card>
        </div>
      )}

      {/* TAB 2: Leave Transaction Ledger */}
      {activeTab === 'ledger' && (
        <Card className="p-0 overflow-hidden">
          {ledgerLoading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : ledgerEntries.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No Ledger Transactions"
              description="No leave transactions recorded in your ledger yet."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Leave Type</th>
                    <th className="p-3.5">Transaction</th>
                    <th className="p-3.5 text-right">Delta (Days)</th>
                    <th className="p-3.5 text-right">Balance After</th>
                    <th className="p-3.5">Reason / Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ledgerEntries.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <td className="p-3.5 font-mono text-slate-500">
                        {tx.created_at ? new Date(tx.created_at).toLocaleString() : 'N/A'}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {tx.leave_type?.name || tx.leave_type_code || 'Leave'}
                      </td>
                      <td className="p-3.5">{getTransactionBadge(tx.transaction_type)}</td>
                      <td className="p-3.5 text-right font-bold">
                        <span
                          className={`inline-flex items-center space-x-1 ${
                            tx.delta_days > 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {tx.delta_days > 0 ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {tx.delta_days > 0 ? `+${tx.delta_days}` : tx.delta_days}
                          </span>
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                        {tx.balance_after ?? '--'}
                      </td>
                      <td className="p-3.5 text-slate-500 max-w-sm truncate">
                        {tx.reason || (tx.leave_id ? `Leave Request #${tx.leave_id}` : 'System operation')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            page={ledgerPage}
            totalPages={ledgerTotalPages}
            totalItems={ledgerTotalItems}
            pageSize={20}
            onPageChange={setLedgerPage}
          />
        </Card>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={!!viewingLeave}
        onClose={() => setViewingLeave(null)}
        title="Leave Application Details"
        subtitle={`Application #${viewingLeave?.id}`}
      >
        {viewingLeave && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl">
              <div>
                <p className="text-slate-400 uppercase font-semibold">Type</p>
                <p className="text-slate-900 dark:text-white font-bold mt-0.5">
                  {viewingLeave.leave_type}
                  {viewingLeave.is_half_day && ' (Half Day)'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 uppercase font-semibold">Status</p>
                <div className="mt-0.5">{getStatusBadge(viewingLeave.status)}</div>
              </div>
              <div>
                <p className="text-slate-400 uppercase font-semibold">Period</p>
                <p className="text-slate-900 dark:text-white font-bold mt-0.5 font-mono">
                  {viewingLeave.start_date} &rarr; {viewingLeave.end_date} ({viewingLeave.days} d)
                </p>
              </div>
              <div>
                <p className="text-slate-400 uppercase font-semibold">Submitted On</p>
                <p className="text-slate-900 dark:text-white font-bold mt-0.5">
                  {viewingLeave.created_at
                    ? new Date(viewingLeave.created_at).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Employee Justification:
              </p>
              <p className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                {viewingLeave.reason}
              </p>
            </div>

            {viewingLeave.rejection_reason && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <p className="text-rose-700 dark:text-rose-300 font-semibold mb-0.5">
                  Supervisor Rejection Remarks:
                </p>
                <p className="text-rose-600 dark:text-rose-400">
                  {viewingLeave.rejection_reason}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setViewingLeave(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancellingLeave}
        onClose={() => setCancellingLeave(null)}
        title="Cancel Leave Application"
        subtitle="This action will withdraw your request and restore allocated quota."
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to cancel your{' '}
            <strong className="text-slate-900 dark:text-white">
              {cancellingLeave?.leave_type}
            </strong>{' '}
            request from{' '}
            <strong>{cancellingLeave?.start_date}</strong> to{' '}
            <strong>{cancellingLeave?.end_date}</strong>?
          </p>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => setCancellingLeave(null)}
            >
              Keep Request
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmCancel}
              loading={cancelling}
            >
              Yes, Cancel Application
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
