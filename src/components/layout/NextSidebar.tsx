'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { NextLogo } from '@/components/layout/NextLogo';
import {
  Bell,
  Bot,
  Building2,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  IndianRupee,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Network,
  Receipt,
  Settings,
  ShieldAlert,
  Sparkles,
  User,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NextSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    title: 'Core',
    items: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Employees', href: '/admin/employees', icon: Users },
      { label: 'Org Hierarchy', href: '/admin/org-chart', icon: Network },
      { label: 'Departments', href: '/admin/departments', icon: Building2 },
    ],
  },
  {
    title: 'Operations & Payroll',
    items: [
      { label: 'Attendance', href: '/admin/attendance', icon: CalendarCheck },
      { label: 'Leave Requests', href: '/admin/leaves', icon: CalendarDays },
      { label: 'Holidays', href: '/admin/holidays', icon: Sparkles },
      { label: 'Salaries & Payroll', href: '/admin/salaries', icon: IndianRupee },
      { label: 'Expense Claims', href: '/admin/expenses', icon: Receipt },
    ],
  },
  {
    title: 'Intelligence & Governance',
    items: [
      { label: 'Nexora Copilot', href: '/ai', icon: Bot },
      { label: 'AI Settings & RAG', href: '/admin/ai-settings', icon: Sparkles },
      { label: 'Reports & Exports', href: '/admin/reports', icon: FileText },
      { label: 'Broadcasts', href: '/admin/notifications', icon: Bell },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert },
      { label: 'Settings & Users', href: '/admin/settings', icon: Settings },
    ],
  },
];

const EMPLOYEE_NAV_GROUPS: NavGroup[] = [
  {
    title: 'Workspace',
    items: [
      { label: 'Overview', href: '/employee', icon: LayoutDashboard },
      { label: 'Nexora Copilot', href: '/ai', icon: Bot },
      { label: 'My Profile', href: '/employee/profile', icon: User },
    ],
  },
  {
    title: 'Time & Leave',
    items: [
      { label: 'My Attendance', href: '/employee/attendance', icon: CalendarCheck },
      { label: 'Apply for Leave', href: '/employee/apply-leave', icon: CalendarDays },
      { label: 'My Leave History', href: '/employee/leaves', icon: FileText },
      { label: 'Company Holidays', href: '/employee/holidays', icon: Sparkles },
    ],
  },
  {
    title: 'Compensation & Docs',
    items: [
      { label: 'My Salary & Slips', href: '/employee/salary', icon: IndianRupee },
      { label: 'My Expense Claims', href: '/employee/expenses', icon: Receipt },
      { label: 'My Documents', href: '/employee/documents', icon: FolderOpen },
      { label: 'Notifications', href: '/employee/notifications', icon: Bell },
      { label: 'Change Password', href: '/employee/password', icon: KeyRound },
    ],
  },
];

export function NextSidebar({ isOpen, onClose }: NextSidebarProps) {
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('nexora_sidebar_collapsed');
    if (saved === 'true') setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem('nexora_sidebar_collapsed', String(next));
      return next;
    });
  };

  const groups = isAdmin ? ADMIN_NAV_GROUPS : EMPLOYEE_NAV_GROUPS;

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
        } bg-[var(--surface)] border-r border-[var(--border)] flex flex-col transition-all duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-4 border-b border-[var(--border)] flex items-center justify-between">
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
              onClick={toggleCollapsed}
              className="hidden md:flex p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Primary navigation">
          {groups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isRoot = item.href === '/admin' || item.href === '/employee';
                const isActive = isRoot ? pathname === item.href : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-md shadow-blue-500/25'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--border)]">
          {!collapsed && user && (
            <div className="px-3 py-2 mb-2 rounded-xl bg-[var(--surface-elevated)]">
              <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                {user.employee?.full_name || user.username}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] truncate">{user.role}</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => void logout()}
            title={collapsed ? 'Sign Out' : undefined}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
