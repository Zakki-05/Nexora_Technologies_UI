'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { NextLogo } from '@/components/layout/NextLogo';
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
  Network,
  Receipt,
  Bot,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NextSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Employees', href: '/admin/employees', icon: Users },
  { label: 'Org Hierarchy', href: '/admin/org-chart', icon: Network },
  { label: 'Departments', href: '/admin/departments', icon: Building2 },
  { label: 'Attendance', href: '/admin/attendance', icon: CalendarCheck },
  { label: 'Leave Requests', href: '/admin/leaves', icon: CalendarDays },
  { label: 'Holidays', href: '/admin/holidays', icon: Sparkles },
  { label: 'Salaries & Payroll', href: '/admin/salaries', icon: IndianRupee },
  { label: 'Expense Claims', href: '/admin/expenses', icon: Receipt },
  { label: 'Reports & Exports', href: '/admin/reports', icon: FileText },
  { label: 'Broadcasts', href: '/admin/notifications', icon: Bell },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert },
  { label: 'Nexora Copilot', href: '/ai', icon: Bot },
  { label: 'AI Settings & RAG', href: '/admin/ai-settings', icon: Sparkles },
  { label: 'Settings & Users', href: '/admin/settings', icon: Settings },
];

const EMPLOYEE_NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/employee', icon: LayoutDashboard },
  { label: 'Nexora Copilot', href: '/ai', icon: Bot },
  { label: 'My Profile', href: '/employee/profile', icon: User },
  { label: 'My Attendance', href: '/employee/attendance', icon: CalendarCheck },
  { label: 'Apply for Leave', href: '/employee/apply-leave', icon: CalendarDays },
  { label: 'My Leave History', href: '/employee/leaves', icon: FileText },
  { label: 'Company Holidays', href: '/employee/holidays', icon: Sparkles },
  { label: 'My Salary & Slips', href: '/employee/salary', icon: IndianRupee },
  { label: 'My Expense Claims', href: '/employee/expenses', icon: Receipt },
  { label: 'My Documents', href: '/employee/documents', icon: FolderOpen },
  { label: 'Notifications', href: '/employee/notifications', icon: Bell },
  { label: 'Change Password', href: '/employee/password', icon: KeyRound },
];

export function NextSidebar({ isOpen, onClose }: NextSidebarProps) {
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = isAdmin ? ADMIN_NAV_ITEMS : EMPLOYEE_NAV_ITEMS;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 h-full flex-shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        } bg-white dark:bg-[#0B1426] border-r border-slate-200/80 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 px-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center overflow-hidden">
            <NextLogo
              size="md"
              href={isAdmin ? '/admin' : '/employee'}
              showWordmark={!collapsed}
              showTagline={false}
            />
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isRoot = item.href === '/admin' || item.href === '/employee';
            const isActive = isRoot ? pathname === item.href : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-md shadow-[#2563EB]/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
          {!collapsed && user && (
            <div className="px-3 py-2 mb-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                {user.employee?.full_name || user.username}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.role}</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => void logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
