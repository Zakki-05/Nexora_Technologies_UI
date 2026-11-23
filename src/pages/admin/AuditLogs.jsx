import React, { useState, useEffect } from 'react';
import { auditApi } from '../../api/audit';
import { Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Modal, Pagination, LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';
import {
  ShieldAlert,
  Search,
  Filter,
  Eye,
  Activity,
  User,
  Database,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Details Modal
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, resourceFilter, startDate, endDate]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 20,
      };
      if (actionFilter) params.action = actionFilter;
      if (resourceFilter) params.resource_type = resourceFilter;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await auditApi.getLogs(params);
      setLogs(res.items || []);
      setTotalPages(res.pages || 1);
      setTotalItems(res.total || 0);
    } catch (err) {
      console.error('Failed to load audit logs', err);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action) => {
    if (action.includes('CREATE') || action.includes('REGISTER') || action.includes('CHECK_IN')) {
      return <Badge variant="success">{action}</Badge>;
    }
    if (action.includes('UPDATE') || action.includes('EDIT') || action.includes('ADJUST') || action.includes('CHECK_OUT')) {
      return <Badge variant="info">{action}</Badge>;
    }
    if (action.includes('DELETE') || action.includes('DEACTIVATE') || action.includes('REJECT')) {
      return <Badge variant="danger">{action}</Badge>;
    }
    return <Badge variant="default">{action}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System Audit Logs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immutable tracking of administrative actions, resource modifications, and compliance activity.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
              Action
            </label>
            <input
              type="text"
              placeholder="e.g. CREATE_EMPLOYEE"
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
              Resource Type
            </label>
            <input
              type="text"
              placeholder="e.g. EMPLOYEE, LEAVE"
              value={resourceFilter}
              onChange={(e) => {
                setResourceFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <Button
              variant="outline"
              onClick={() => {
                setActionFilter('');
                setResourceFilter('');
                setStartDate('');
                setEndDate('');
                setPage(1);
              }}
              className="w-full text-xs py-2"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="No Audit Logs"
            description="No system modifications match the active filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Resource</th>
                  <th className="p-3.5">Resource ID</th>
                  <th className="p-3.5">Details</th>
                  <th className="p-3.5 text-center">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 text-slate-500 font-mono">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : '-'}
                    </td>
                    <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                      {log.user ? `${log.user.email} (${log.user.role})` : `User #${log.user_id || 'System'}`}
                    </td>
                    <td className="p-3.5">{getActionBadge(log.action)}</td>
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                      {log.resource_type}
                    </td>
                    <td className="p-3.5 font-mono text-slate-500">
                      {log.resource_id || '-'}
                    </td>
                    <td className="p-3.5 text-slate-500 max-w-xs truncate">
                      {log.details || '-'}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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
          pageSize={20}
          onPageChange={setPage}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Audit Log Inspection"
        subtitle={`Log Entry #${selectedLog?.id}`}
      >
        {selectedLog && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl">
              <div>
                <p className="text-slate-400 uppercase font-semibold">Action</p>
                <p className="text-slate-900 dark:text-white font-bold mt-0.5">
                  {selectedLog.action}
                </p>
              </div>
              <div>
                <p className="text-slate-400 uppercase font-semibold">Resource Type</p>
                <p className="text-slate-900 dark:text-white font-bold mt-0.5">
                  {selectedLog.resource_type} (ID: {selectedLog.resource_id || 'N/A'})
                </p>
              </div>
              <div>
                <p className="text-slate-400 uppercase font-semibold">User</p>
                <p className="text-slate-900 dark:text-white font-bold mt-0.5">
                  {selectedLog.user ? selectedLog.user.email : `User #${selectedLog.user_id}`}
                </p>
              </div>
              <div>
                <p className="text-slate-400 uppercase font-semibold">Timestamp</p>
                <p className="text-slate-900 dark:text-white font-bold mt-0.5">
                  {selectedLog.created_at ? new Date(selectedLog.created_at).toLocaleString() : '-'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Full Log Details:
              </p>
              <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                {selectedLog.details || 'No additional details recorded.'}
              </pre>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
