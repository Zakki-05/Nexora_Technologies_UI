import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NexoraLogo } from '../ui/NexoraLogo';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  CalendarDays,
  IndianRupee,
  FileText,
  Bell,
  ShieldAlert,
  Settings,
  User,
  FolderOpen,
  KeyRound,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, isSuperAdmin, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const adminNavItems = [
    { label: 'Overview', to: '/admin', icon: LayoutDashboard },
    { label: 'Employees', to: '/admin/employees', icon: Users },
    { label: 'Departments', to: '/admin/departments', icon: Building2 },
    { label: 'Attendance', to: '/admin/attendance', icon: CalendarCheck },
    { label: 'Leave Requests', to: '/admin/leaves', icon: CalendarDays },
    { label: 'Holidays', to: '/admin/holidays', icon: Sparkles },
    { label: 'Salaries & Payroll', to: '/admin/salaries', icon: IndianRupee },
    { label: 'Reports & Exports', to: '/admin/reports', icon: FileText },
    { label: 'Broadcasts', to: '/admin/notifications', icon: Bell },
    { label: 'Audit Logs', to: '/admin/audit-logs', icon: ShieldAlert },
    { label: 'Settings & Users', to: '/admin/settings', icon: Settings },
  ];

  const employeeNavItems = [
    { label: 'Overview', to: '/employee', icon: LayoutDashboard },
    { label: 'My Profile', to: '/employee/profile', icon: User },
    { label: 'My Attendance', to: '/employee/attendance', icon: CalendarCheck },
    { label: 'Apply for Leave', to: '/employee/apply-leave', icon: CalendarDays },
    { label: 'My Leave History', to: '/employee/leaves', icon: FileText },
    { label: 'Company Holidays', to: '/employee/holidays', icon: Sparkles },
    { label: 'My Salary & Slips', to: '/employee/salary', icon: IndianRupee },
    { label: 'My Documents', to: '/employee/documents', icon: FolderOpen },
    { label: 'Notifications', to: '/employee/notifications', icon: Bell },
    { label: 'Change Password', to: '/employee/password', icon: KeyRound },
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 h-full flex-shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        } bg-white dark:bg-[#0B1426] border-r border-slate-200/80 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / Header */}
        <div className="h-20 px-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center overflow-hidden">
            <NexoraLogo
              size="md"
              to={isAdmin ? '/admin' : '/employee'}
              showWordmark={!collapsed}
              showTagline={false}
            />
          </div>

          <div className="flex items-center">
            {/* Desktop collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {isAdmin ? 'Administration' : 'Self-Service'}
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin' || item.to === '/employee'}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    collapsed ? 'justify-center px-2 py-3' : 'space-x-3 px-3.5 py-2.5'
                  } rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-[#2563EB] dark:bg-[#2563EB]/15 dark:text-[#06B6D4] shadow-sm dark:shadow-none'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#94A3B8] dark:hover:text-white dark:hover:bg-[#111C32]'
                  }`
                }
              >
                <Icon className={`w-4 h-4 flex-shrink-0`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-[#111C32] border border-slate-200/60 dark:border-slate-800 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed ? (
              <div className="min-w-0 flex-1 mr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                    {user?.employee?.full_name || user?.username}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded text-[#2563EB] dark:text-[#06B6D4] bg-[#2563EB]/10 inline-block mt-0.5 uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
            ) : null}

            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
