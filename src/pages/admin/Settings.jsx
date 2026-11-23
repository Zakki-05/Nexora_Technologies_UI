import React, { useState, useEffect } from 'react';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Modal, Pagination, LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';
import {
  Settings,
  Users,
  Shield,
  KeyRound,
  UserCheck,
  UserX,
  Plus,
  Server,
  Lock,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminSettings = () => {
  const { user: currentUser, isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // users, profile, system

  // Users Management State
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userPage, setUserPage] = useState(1);
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // New User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    role: 'EMPLOYEE',
  });

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (activeTab === 'users') {
      const timer = setTimeout(() => {
        fetchUsers();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, userPage, userSearch, roleFilter]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await authApi.getUsers({
        page: userPage,
        size: 20,
        search: userSearch ? userSearch.trim() : undefined,
        role: roleFilter || undefined,
      });
      setUsers(res.items || []);
      setTotalUserPages(res.pages || 1);
      setTotalUsers(res.total || 0);
    } catch (err) {
      console.error('Failed to load users', err);
      toast.error('Failed to load user accounts');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      await authApi.updateUserStatus(user.id, !user.is_active);
      toast.success(
        `User ${user.email} marked as ${!user.is_active ? 'active' : 'inactive'}`
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: !u.is_active } : u))
      );
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const handleChangeRole = async (user, newRole) => {
    try {
      await authApi.updateUserRole(user.id, newRole);
      toast.success(`Role updated for ${user.email} to ${newRole}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update user role');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setAddingUser(true);
    try {
      await authApi.registerUser(newUserForm);
      toast.success('User account created successfully!');
      setShowAddUserModal(false);
      setNewUserForm({ email: '', password: '', role: 'EMPLOYEE' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create user');
    } finally {
      setAddingUser(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.new_password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setChangingPassword(true);
    try {
      await authApi.changePassword(
        passwordForm.current_password,
        passwordForm.new_password
      );
      toast.success('Password changed successfully!');
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System & Security Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage authenticated users, role-based access controls, credentials, and system status.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 py-3 px-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts & Roles</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 py-3 px-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'profile'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center space-x-2 py-3 px-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'system'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>System Environment</span>
        </button>
      </div>

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search users by email or username..."
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setUserPage(1);
                }}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {userSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setUserSearch('');
                    setUserPage(1);
                  }}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setUserPage(1);
                }}
                className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
              >
                <option value="">All Roles</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="ADMIN">ADMIN</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
              </select>

              <Button
                variant="primary"
                onClick={() => setShowAddUserModal(true)}
                icon={Plus}
                className="text-xs shrink-0"
              >
                Add User Account
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center px-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Registered Users: {totalUsers}
              {userSearch && (
                <span className="text-emerald-600 dark:text-emerald-400 ml-2 font-normal lowercase">
                  (filtered by &quot;{userSearch}&quot;)
                </span>
              )}
            </p>
          </div>

          <Card className="p-0 overflow-hidden">
            {loadingUsers ? (
              <div className="py-20 flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : users.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No Users Registered"
                description="No users found in database."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Email Address</th>
                      <th className="p-3.5">Assigned Role</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 font-mono text-slate-400">#{u.id}</td>
                        <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                          {u.email}
                        </td>
                        <td className="p-3.5">
                          {isSuperAdmin ? (
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u, e.target.value)}
                              className="text-xs px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                            >
                              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                              <option value="ADMIN">ADMIN</option>
                              <option value="EMPLOYEE">EMPLOYEE</option>
                            </select>
                          ) : (
                            <Badge
                              variant={
                                u.role === 'SUPER_ADMIN'
                                  ? 'purple'
                                  : u.role === 'ADMIN'
                                  ? 'info'
                                  : 'default'
                              }
                            >
                              {u.role}
                            </Badge>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <Badge variant={u.is_active ? 'success' : 'danger'}>
                            {u.is_active ? 'Active' : 'Disabled'}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.is_active
                                ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                                : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            }`}
                            title={u.is_active ? 'Deactivate User' : 'Activate User'}
                          >
                            {u.is_active ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Pagination
              page={userPage}
              totalPages={totalUserPages}
              totalItems={totalUsers}
              pageSize={20}
              onPageChange={setUserPage}
            />
          </Card>
        </div>
      )}

      {/* Tab: Security & Password */}
      {activeTab === 'profile' && (
        <div className="max-w-xl">
          <Card title="Change Administrator Password" subtitle="Ensure your account is protected with a strong credentials.">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                required
                placeholder="Enter current password"
                value={passwordForm.current_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    current_password: e.target.value,
                  })
                }
              />
              <Input
                label="New Password"
                type="password"
                required
                placeholder="At least 8 characters"
                value={passwordForm.new_password}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, new_password: e.target.value })
                }
              />
              <Input
                label="Confirm New Password"
                type="password"
                required
                placeholder="Re-enter new password"
                value={passwordForm.confirm_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirm_password: e.target.value,
                  })
                }
              />

              <div className="pt-2">
                <Button type="submit" variant="primary" loading={changingPassword}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Tab: System Environment */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Application Metadata" subtitle="Current running service build and API specifications.">
            <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 font-medium">Application Name</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200">
                  Employee Management System (EMS)
                </dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 font-medium">Backend Framework</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200">
                  FastAPI (Python 3.14)
                </dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 font-medium">Frontend Framework</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200">
                  React 18 + Vite + Tailwind CSS
                </dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 font-medium">Database Dialect</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200">
                  PostgreSQL / SQLite Native Fallback
                </dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 font-medium">Authentication Type</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-200">
                  OAuth2 JWT Bearer Tokens
                </dd>
              </div>
            </dl>
          </Card>

          <Card title="Security & RBAC Enforcement" subtitle="Strict policy rules active on this cluster.">
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                  Role-Based Access Control (RBAC)
                </p>
                <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                  SUPER_ADMIN has unrestricted administrative rights; ADMIN has management privileges; EMPLOYEE is restricted to self-service portals.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800">
                <p className="font-semibold text-sky-800 dark:text-sky-300">
                  Audit Logging & Safe Deletion
                </p>
                <p className="mt-1 text-[11px] text-sky-700 dark:text-sky-400">
                  All write and delete operations generate immutable records in the audit log. Departments with active staff cannot be removed.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        title="Create New User Account"
        subtitle="Provision login credentials and assign system roles."
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="user@ems-system.local"
            value={newUserForm.email}
            onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
          />

          <Input
            label="Initial Password"
            type="password"
            required
            placeholder="Minimum 8 characters"
            value={newUserForm.password}
            onChange={(e) =>
              setNewUserForm({ ...newUserForm, password: e.target.value })
            }
          />

          <Select
            label="System Role"
            value={newUserForm.role}
            onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
            options={[
              { label: 'EMPLOYEE (Standard Access)', value: 'EMPLOYEE' },
              { label: 'ADMIN (Department & Staff Management)', value: 'ADMIN' },
              ...(isSuperAdmin
                ? [{ label: 'SUPER_ADMIN (Full System Privileges)', value: 'SUPER_ADMIN' }]
                : []),
            ]}
          />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddUserModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={addingUser}>
              Create User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
