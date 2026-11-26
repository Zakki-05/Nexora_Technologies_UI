import React, { useState, useEffect } from 'react';
import { employeeApi } from '../../api/employees';
import { departmentApi } from '../../api/departments';
import { authApi } from '../../api/auth';
import { reportApi } from '../../api/reports';
import { Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Modal, Pagination, LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Building2,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const getAvatarUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path}`;
};

export const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [saving, setSaving] = useState(false);

  // Avatar Approvals State
  const [pendingAvatarRequests, setPendingAvatarRequests] = useState([]);
  const [showAvatarReviewModal, setShowAvatarReviewModal] = useState(false);
  const [reviewingId, setReviewingId] = useState(null);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [rejectPromptId, setRejectPromptId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    user_id: '',
    department_id: '',
    full_name: '',
    phone: '',
    hire_date: new Date().toISOString().split('T')[0],
    position: '',
    salary: '',
    gender: 'Male',
    employment_status: 'ACTIVE',
    employee_code: '',
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeApi.getAll({
        page,
        size: 10,
        search: search || undefined,
        department_id: departmentId ? parseInt(departmentId, 10) : undefined,
        employment_status: statusFilter || undefined,
      });
      setEmployees(data.items);
      setTotalPages(data.pages);
      setTotalItems(data.total);
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingAvatars = async () => {
    try {
      const requests = await employeeApi.getPendingAvatarRequests();
      setPendingAvatarRequests(requests || []);
    } catch (err) {
      console.error('Failed to load pending avatars', err);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [deptList, userList] = await Promise.all([
        departmentApi.getAllList(),
        authApi.getUsers({ size: 100 }),
      ]);
      setDepartments(deptList);
      setUsers(userList.items || []);
    } catch {
      // Ignore
    }
    fetchPendingAvatars();
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, departmentId, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEmployees();
  };

  const handleOpenAdd = () => {
    setFormData({
      user_id: '',
      email: '',
      password: 'Employee@123',
      department_id: departments[0]?.id || '',
      full_name: '',
      phone: '',
      hire_date: new Date().toISOString().split('T')[0],
      position: '',
      salary: '',
      gender: 'Male',
      employment_status: 'ACTIVE',
      employee_code: '',
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (emp) => {
    setCurrentEmployee(emp);
    setFormData({
      department_id: emp.department_id,
      full_name: emp.full_name,
      phone: emp.phone,
      hire_date: emp.hire_date,
      position: emp.position,
      salary: emp.salary,
      gender: emp.gender || 'Male',
      employment_status: emp.employment_status,
      address: emp.address || '',
    });
    setShowEditModal(true);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await employeeApi.create({
        ...formData,
        email: formData.email?.trim() || undefined,
        password: formData.password?.trim() || 'Employee@123',
        user_id: formData.user_id ? parseInt(formData.user_id, 10) : undefined,
        department_id: parseInt(formData.department_id, 10),
        salary: parseFloat(formData.salary),
        employee_code: formData.employee_code || undefined,
      });
      toast.success(`Employee added! Login password: ${formData.password || 'Employee@123'}`);
      setShowAddModal(false);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create employee');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await employeeApi.update(currentEmployee.id, {
        ...formData,
        department_id: parseInt(formData.department_id, 10),
        salary: parseFloat(formData.salary),
      });
      toast.success('Employee updated successfully!');
      setShowEditModal(false);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update employee');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (emp) => {
    const nextStatus = emp.employment_status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await employeeApi.updateStatus(emp.id, nextStatus);
      toast.success(`Employee set to ${nextStatus}`);
      fetchEmployees();
    } catch {
      toast.error('Failed to change status');
    }
  };

  const handleDelete = async (emp) => {
    if (window.confirm(`Are you sure you want to deactivate ${emp.full_name}?`)) {
      try {
        await employeeApi.delete(emp.id, false);
        toast.success('Employee deactivated');
        fetchEmployees();
      } catch {
        toast.error('Failed to delete employee');
      }
    }
  };

  // Avatar Review Decisions
  const handleApproveAvatar = async (req) => {
    setReviewingId(req.employee_id);
    try {
      await employeeApi.reviewAvatarRequest(req.employee_id, {
        status: 'APPROVED',
      });
      toast.success(`Profile photo approved for ${req.full_name}!`);
      await fetchPendingAvatars();
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to approve avatar');
    } finally {
      setReviewingId(null);
    }
  };

  const handleRejectAvatar = async (req) => {
    const reason = rejectionReasons[req.employee_id] || 'Photo did not meet corporate quality guidelines.';
    setReviewingId(req.employee_id);
    try {
      await employeeApi.reviewAvatarRequest(req.employee_id, {
        status: 'REJECTED',
        rejection_reason: reason,
      });
      toast.success(`Profile photo rejected for ${req.full_name}`);
      setRejectPromptId(null);
      await fetchPendingAvatars();
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to reject avatar');
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Employee Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage corporate employee records, roles, departments, payroll, and avatar verifications
          </p>
        </div>
        <div className="flex items-center space-x-2.5 sm:self-auto self-start">
          {/* Photo Approvals Button */}
          <button
            onClick={() => {
              fetchPendingAvatars();
              setShowAvatarReviewModal(true);
            }}
            className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              pendingAvatarRequests.length > 0
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 shadow-sm'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-500" />
            <span>Photo Approvals</span>
            {pendingAvatarRequests.length > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black rounded-full bg-amber-500 text-slate-950 animate-pulse">
                {pendingAvatarRequests.length}
              </span>
            )}
          </button>

          {/* Export Buttons */}
          <button
            type="button"
            onClick={() => {
              toast.success('Generating Employee Directory Excel spreadsheet...');
              reportApi.exportExcel('employees', {
                department_id: departmentId ? parseInt(departmentId, 10) : undefined,
                employment_status: statusFilter || undefined,
              });
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-sm cursor-pointer"
            title="Download complete employee directory as Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          <button
            type="button"
            onClick={() => {
              toast.success('Generating Employee Directory CSV...');
              reportApi.exportCsv('employees', {
                department_id: departmentId ? parseInt(departmentId, 10) : undefined,
                employment_status: statusFilter || undefined,
              });
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer"
            title="Download complete employee directory as CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <Button onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Employee
          </Button>
        </div>
      </div>

      {/* Pending Photos Alert Strip if requests are waiting */}
      {pendingAvatarRequests.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border-l-4 border-amber-500 p-3.5 rounded-r-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center space-x-2.5">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong className="font-bold">{pendingAvatarRequests.length} employee{pendingAvatarRequests.length > 1 ? 's' : ''}</strong> submitted new profile photos requiring administrative review and approval.
            </span>
          </div>
          <button
            onClick={() => setShowAvatarReviewModal(true)}
            className="font-bold underline text-amber-700 dark:text-amber-300 hover:text-amber-800 shrink-0 ml-4 cursor-pointer"
          >
            Review Now &rarr;
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <Card className="!p-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              placeholder="Search by name, code, phone, position, or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={departmentId}
            onChange={(e) => {
              setDepartmentId(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="ON_LEAVE">ON_LEAVE</option>
            <option value="TERMINATED">TERMINATED</option>
          </select>
        </form>
      </Card>

      {/* Table */}
      <Card className="!p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner className="py-24" />
        ) : employees.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No employees found"
            description="No employee records matching your current filter settings."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Salary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {employees.map((emp) => {
                  const avatarSrc = getAvatarUrl(emp.profile_picture);
                  const isPendingAvatar = emp.profile_picture_status === 'PENDING';
                  const initials = emp.full_name
                    ? emp.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                    : 'EM';

                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            {avatarSrc ? (
                              <img
                                src={avatarSrc}
                                alt={emp.full_name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                {initials}
                              </div>
                            )}
                            {isPendingAvatar && (
                              <span
                                title="Photo update pending approval"
                                className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {emp.full_name}
                              {isPendingAvatar && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded font-normal">
                                  Photo Pending
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              {emp.user?.email || emp.email || emp.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-600 dark:text-slate-300">
                        {emp.employee_code}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {emp.department?.name || 'Unassigned'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {emp.position}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(emp.salary)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            emp.employment_status === 'ACTIVE'
                              ? 'success'
                              : emp.employment_status === 'INACTIVE'
                              ? 'danger'
                              : 'warning'
                          }
                        >
                          {emp.employment_status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(emp)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Toggle Status"
                          >
                            {emp.employment_status === 'ACTIVE' ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(emp)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Delete / Deactivate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* Modal: Admin Profile Picture Approvals Queue */}
      <Modal
        isOpen={showAvatarReviewModal}
        onClose={() => {
          setShowAvatarReviewModal(false);
          setRejectPromptId(null);
        }}
        title="Employee Profile Photo Approvals"
        subtitle="Review, approve, or reject employee-submitted profile photos"
        size="lg"
      >
        <div className="space-y-4">
          {pendingAvatarRequests.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <CheckCircle className="w-10 h-10 mx-auto text-emerald-500 opacity-80" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">All photo requests reviewed!</p>
              <p className="text-xs">There are no employee profile photos currently awaiting admin approval.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {pendingAvatarRequests.map((req) => {
                const currentSrc = getAvatarUrl(req.current_profile_picture);
                const pendingSrc = getAvatarUrl(req.pending_profile_picture);
                const isReviewing = reviewingId === req.employee_id;
                const isRejectPromptOpen = rejectPromptId === req.employee_id;

                return (
                  <div
                    key={req.employee_id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          {req.full_name}
                          <span className="font-mono text-xs font-normal px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {req.employee_code}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {req.department_name || 'Department Unassigned'} &bull; {req.email}
                        </p>
                      </div>

                      <span className="inline-flex items-center text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-800/60 font-medium">
                        <Clock className="w-3 h-3 mr-1" /> Awaiting Decision
                      </span>
                    </div>

                    {/* Side-by-side Avatar Comparison */}
                    <div className="flex items-center justify-center gap-6 py-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3">
                      {/* Current Photo */}
                      <div className="text-center space-y-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Current Active Photo
                        </span>
                        {currentSrc ? (
                          <img
                            src={currentSrc}
                            alt="Current"
                            className="w-16 h-16 rounded-xl object-cover border border-slate-300 dark:border-slate-700 mx-auto"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500 font-bold text-sm flex items-center justify-center mx-auto">
                            None
                          </div>
                        )}
                      </div>

                      <div className="text-slate-400 text-lg font-bold">&rarr;</div>

                      {/* Requested New Photo */}
                      <div className="text-center space-y-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Proposed New Photo
                        </span>
                        {pendingSrc ? (
                          <img
                            src={pendingSrc}
                            alt="Proposed"
                            className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-500 mx-auto shadow-md ring-2 ring-emerald-500/20"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500 font-bold text-sm flex items-center justify-center mx-auto">
                            No file
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rejection Prompt & Reason Preset Chips */}
                    {isRejectPromptOpen && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/60 space-y-2">
                        <label className="block text-xs font-bold text-rose-900 dark:text-rose-200">
                          Specify Reason for Rejection:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Face not clearly visible',
                            'Unprofessional background',
                            'Low resolution / blurry',
                            'Multiple persons or cartoon avatar',
                          ].map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() =>
                                setRejectionReasons({
                                  ...rejectionReasons,
                                  [req.employee_id]: chip,
                                })
                              }
                              className="text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-rose-400"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="Or type custom reason..."
                          value={rejectionReasons[req.employee_id] || ''}
                          onChange={(e) =>
                            setRejectionReasons({
                              ...rejectionReasons,
                              [req.employee_id]: e.target.value,
                            })
                          }
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-900 dark:text-slate-100"
                        />
                        <div className="flex justify-end space-x-2 pt-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setRejectPromptId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleRejectAvatar(req)}
                            loading={isReviewing}
                          >
                            Confirm Rejection
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {!isRejectPromptOpen && (
                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRejectPromptId(req.employee_id)}
                          icon={XCircle}
                          className="text-rose-600 hover:text-rose-700 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          Reject Photo
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleApproveAvatar(req)}
                          loading={isReviewing}
                          icon={CheckCircle}
                        >
                          Approve Photo
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAvatarReviewModal(false);
                setRejectPromptId(null);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Employee"
        subtitle="Provision an employee profile with direct portal login credentials"
        size="lg"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            placeholder="e.g. John Doe"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Corporate Email (Login Username)"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="e.g. john.doe@nexora.tech"
            />
            <div>
              <Input
                label="Initial Portal Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Employee@123"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Default: Employee@123 (Employee can change later)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+91 98765 43210"
            />
            <Input
              label="Employee Code (Optional)"
              value={formData.employee_code}
              onChange={(e) =>
                setFormData({ ...formData, employee_code: e.target.value })
              }
              placeholder="Auto-generated if blank (e.g. EMP-1051)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Department"
              value={formData.department_id}
              onChange={(e) =>
                setFormData({ ...formData, department_id: e.target.value })
              }
              required
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>

            <Input
              label="Job Position"
              required
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="e.g. Software Engineer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Annual Salary (₹)"
              type="number"
              step="0.01"
              required
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
              placeholder="750000"
            />

            <Input
              label="Hire Date"
              type="date"
              required
              value={formData.hire_date}
              onChange={(e) =>
                setFormData({ ...formData, hire_date: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>

            <Select
              label="Employment Status"
              value={formData.employment_status}
              onChange={(e) =>
                setFormData({ ...formData, employment_status: e.target.value })
              }
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="ON_LEAVE">ON_LEAVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save & Provision Employee
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Employee"
        subtitle={`Updating profile for ${currentEmployee?.full_name}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <Select
              label="Department"
              value={formData.department_id}
              onChange={(e) =>
                setFormData({ ...formData, department_id: e.target.value })
              }
              required
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Job Position"
              required
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
            <Input
              label="Salary (₹)"
              type="number"
              step="0.01"
              required
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
            />
          </div>

          <Select
            label="Employment Status"
            value={formData.employment_status}
            onChange={(e) =>
              setFormData({ ...formData, employment_status: e.target.value })
            }
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="ON_LEAVE">ON_LEAVE</option>
            <option value="TERMINATED">TERMINATED</option>
          </Select>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
