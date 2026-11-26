import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendance';
import { departmentApi } from '../../api/departments';
import { employeeApi } from '../../api/employees';
import { reportApi } from '../../api/reports';
import { Card, Badge, StatCard } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Modal, Pagination, LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatTime, formatDate } from '../../utils/formatters';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  Clock,
  Edit2,
  Calendar,
  AlertTriangle,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminAttendance = () => {
  const [records, setRecords] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [dailyReport, setDailyReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [departmentId, setDepartmentId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [showManualModal, setShowManualModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [saving, setSaving] = useState(false);

  const [manualForm, setManualForm] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    check_in: '09:00',
    check_out: '17:00',
    status: 'PRESENT',
    remarks: '',
  });

  const [editForm, setEditForm] = useState({
    check_in: '',
    check_out: '',
    status: 'PRESENT',
    remarks: '',
  });

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const [res, rep] = await Promise.all([
        attendanceApi.getAll({
          page,
          size: 15,
          date_filter: dateFilter || undefined,
          department_id: departmentId ? parseInt(departmentId, 10) : undefined,
          status_filter: statusFilter || undefined,
        }),
        attendanceApi.getDailyReport(dateFilter || undefined),
      ]);
      setRecords(res.items);
      setTotalPages(res.pages);
      setTotalItems(res.total);
      setDailyReport(rep);
    } catch {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [deptList, empList] = await Promise.all([
        departmentApi.getAllList(),
        employeeApi.getAll({ size: 100 }),
      ]);
      setDepartments(deptList);
      setEmployeesList(empList.items || []);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [page, dateFilter, departmentId, statusFilter]);

  const handleOpenManual = () => {
    setManualForm({
      employee_id: employeesList[0]?.id || '',
      date: dateFilter || new Date().toISOString().split('T')[0],
      check_in: '09:00',
      check_out: '17:00',
      status: 'PRESENT',
      remarks: 'Manual admin entry',
    });
    setShowManualModal(true);
  };

  const handleOpenEdit = (rec) => {
    setCurrentRecord(rec);
    setEditForm({
      check_in: rec.check_in || '',
      check_out: rec.check_out || '',
      status: rec.status,
      remarks: rec.remarks || '',
    });
    setShowEditModal(true);
  };

  const handleSaveManual = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await attendanceApi.recordManual({
        employee_id: parseInt(manualForm.employee_id, 10),
        date: manualForm.date,
        check_in: manualForm.check_in || null,
        check_out: manualForm.check_out || null,
        status: manualForm.status,
        remarks: manualForm.remarks,
      });
      toast.success('Attendance recorded');
      setShowManualModal(false);
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to record attendance');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await attendanceApi.correct(currentRecord.id, {
        check_in: editForm.check_in || null,
        check_out: editForm.check_out || null,
        status: editForm.status,
        remarks: editForm.remarks,
      });
      toast.success('Attendance updated');
      setShowEditModal(false);
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Attendance Administration
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor check-ins, punctuality, working hours, and correct discrepancies
          </p>
        </div>
        <div className="flex items-center space-x-2 sm:self-auto self-start">
          <button
            type="button"
            onClick={() => {
              toast.success('Generating Attendance Excel report...');
              reportApi.exportExcel('attendance', {
                start_date: startDate || undefined,
                end_date: endDate || undefined,
                department_id: departmentId ? parseInt(departmentId, 10) : undefined,
              });
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-sm cursor-pointer"
            title="Download attendance records as Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          <Button onClick={handleOpenManual}>
            <Plus className="w-4 h-4 mr-1.5" /> Manual Record
          </Button>
        </div>
      </div>

      {/* Daily Performance Metrics */}
      {dailyReport && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Attendance Rate
            </span>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">
              {dailyReport.attendance_rate}%
            </p>
          </div>
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Present
            </span>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {dailyReport.present}
            </p>
          </div>
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Late Arrivals
            </span>
            <p className="text-xl font-bold text-amber-600 mt-0.5">
              {dailyReport.late}
            </p>
          </div>
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Half Days
            </span>
            <p className="text-xl font-bold text-sky-600 mt-0.5">
              {dailyReport.half_day}
            </p>
          </div>
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Absent
            </span>
            <p className="text-xl font-bold text-rose-600 mt-0.5">
              {dailyReport.absent}
            </p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <Card className="!p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Filter by Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Department
            </label>
            <select
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Statuses</option>
              <option value="PRESENT">PRESENT</option>
              <option value="LATE">LATE</option>
              <option value="HALF_DAY">HALF_DAY</option>
              <option value="ABSENT">ABSENT</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Records Table */}
      <Card className="!p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner className="py-24" />
        ) : records.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No attendance records"
            description="No entries recorded for the selected date and filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4">Hours</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {records.map((rec) => (
                  <tr
                    key={rec.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {rec.employee?.full_name || `Employee #${rec.employee_id}`}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {rec.employee?.employee_code}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {formatDate(rec.date)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono">{formatTime(rec.check_in)}</span>
                      {rec.is_late && (
                        <span className="ml-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                          LATE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {formatTime(rec.check_out)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {rec.work_hours} hrs
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          rec.status === 'PRESENT'
                            ? 'success'
                            : rec.status === 'LATE'
                            ? 'warning'
                            : rec.status === 'HALF_DAY'
                            ? 'info'
                            : 'danger'
                        }
                      >
                        {rec.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(rec)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Correct Attendance"
                      >
                        <Edit2 className="w-4 h-4" />
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
          pageSize={15}
          onPageChange={(p) => setPage(p)}
        />
      </Card>

      {/* Manual Record Modal */}
      <Modal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        title="Record Attendance Manually"
        subtitle="Add past attendance records or adjustments"
      >
        <form onSubmit={handleSaveManual} className="space-y-4">
          <Select
            label="Employee"
            value={manualForm.employee_id}
            onChange={(e) =>
              setManualForm({ ...manualForm, employee_id: e.target.value })
            }
            required
          >
            <option value="">Select Employee</option>
            {employeesList.map((e) => (
              <option key={e.id} value={e.id}>
                {e.full_name} ({e.employee_code})
              </option>
            ))}
          </Select>

          <Input
            label="Date"
            type="date"
            required
            value={manualForm.date}
            onChange={(e) =>
              setManualForm({ ...manualForm, date: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Check-In Time"
              type="time"
              value={manualForm.check_in}
              onChange={(e) =>
                setManualForm({ ...manualForm, check_in: e.target.value })
              }
            />
            <Input
              label="Check-Out Time"
              type="time"
              value={manualForm.check_out}
              onChange={(e) =>
                setManualForm({ ...manualForm, check_out: e.target.value })
              }
            />
          </div>

          <Select
            label="Status"
            value={manualForm.status}
            onChange={(e) =>
              setManualForm({ ...manualForm, status: e.target.value })
            }
          >
            <option value="PRESENT">PRESENT</option>
            <option value="LATE">LATE</option>
            <option value="HALF_DAY">HALF_DAY</option>
            <option value="ABSENT">ABSENT</option>
          </Select>

          <Input
            label="Remarks"
            value={manualForm.remarks}
            onChange={(e) =>
              setManualForm({ ...manualForm, remarks: e.target.value })
            }
            placeholder="Reason for manual adjustment"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowManualModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Correct Record Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Correct Attendance Record"
        subtitle={`Editing record for ${currentRecord?.employee?.full_name || 'Employee'}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Check-In Time"
              type="time"
              value={editForm.check_in}
              onChange={(e) =>
                setEditForm({ ...editForm, check_in: e.target.value })
              }
            />
            <Input
              label="Check-Out Time"
              type="time"
              value={editForm.check_out}
              onChange={(e) =>
                setEditForm({ ...editForm, check_out: e.target.value })
              }
            />
          </div>

          <Select
            label="Status"
            value={editForm.status}
            onChange={(e) =>
              setEditForm({ ...editForm, status: e.target.value })
            }
          >
            <option value="PRESENT">PRESENT</option>
            <option value="LATE">LATE</option>
            <option value="HALF_DAY">HALF_DAY</option>
            <option value="ABSENT">ABSENT</option>
          </Select>

          <Input
            label="Audit Remarks"
            value={editForm.remarks}
            onChange={(e) =>
              setEditForm({ ...editForm, remarks: e.target.value })
            }
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Apply Correction
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
