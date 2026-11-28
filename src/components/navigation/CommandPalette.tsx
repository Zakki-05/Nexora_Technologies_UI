'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  CalendarCheck,
  CalendarDays,
  FileText,
  IndianRupee,
  Laptop,
  LayoutDashboard,
  Moon,
  Receipt,
  Search,
  Settings,
  ShieldAlert,
  Sun,
  User,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';

interface CommandItem {
  id: string;
  label: string;
  group: 'Navigation' | 'Quick Actions' | 'Theme';
  keywords: string;
  icon: React.ReactNode;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { isAdmin } = useAuth();
  const { setTheme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items = useMemo<CommandItem[]>(() => {
    const go = (href: string) => {
      onClose();
      router.push(href);
    };

    const navItems: CommandItem[] = isAdmin
      ? [
          { id: 'adm-home', label: 'Admin Overview', group: 'Navigation', keywords: 'dashboard home kpi', icon: <LayoutDashboard className="w-4 h-4" />, run: () => go('/admin') },
          { id: 'adm-emp', label: 'Employees Directory', group: 'Navigation', keywords: 'staff people directory', icon: <Users className="w-4 h-4" />, run: () => go('/admin/employees') },
          { id: 'adm-dept', label: 'Departments', group: 'Navigation', keywords: 'teams org', icon: <Building2 className="w-4 h-4" />, run: () => go('/admin/departments') },
          { id: 'adm-att', label: 'Attendance Control', group: 'Navigation', keywords: 'punch shifts hours', icon: <CalendarCheck className="w-4 h-4" />, run: () => go('/admin/attendance') },
          { id: 'adm-leave', label: 'Leave Requests', group: 'Navigation', keywords: 'pto approval holiday', icon: <CalendarDays className="w-4 h-4" />, run: () => go('/admin/leaves') },
          { id: 'adm-sal', label: 'Salaries & Payroll', group: 'Navigation', keywords: 'epf esic payslip finance', icon: <IndianRupee className="w-4 h-4" />, run: () => go('/admin/salaries') },
          { id: 'adm-exp', label: 'Expense Claims', group: 'Navigation', keywords: 'reimbursements bills', icon: <Receipt className="w-4 h-4" />, run: () => go('/admin/expenses') },
          { id: 'adm-rep', label: 'Reports & Exports', group: 'Navigation', keywords: 'csv excel pdf', icon: <FileText className="w-4 h-4" />, run: () => go('/admin/reports') },
          { id: 'adm-aud', label: 'Audit Logs', group: 'Navigation', keywords: 'security events compliance', icon: <ShieldAlert className="w-4 h-4" />, run: () => go('/admin/audit-logs') },
          { id: 'adm-set', label: 'Settings & Users', group: 'Navigation', keywords: 'roles config', icon: <Settings className="w-4 h-4" />, run: () => go('/admin/settings') },
        ]
      : [
          { id: 'emp-home', label: 'Employee Overview', group: 'Navigation', keywords: 'dashboard home', icon: <LayoutDashboard className="w-4 h-4" />, run: () => go('/employee') },
          { id: 'emp-prof', label: 'My Profile', group: 'Navigation', keywords: 'account details', icon: <User className="w-4 h-4" />, run: () => go('/employee/profile') },
          { id: 'emp-att', label: 'My Attendance', group: 'Navigation', keywords: 'punch check in out', icon: <CalendarCheck className="w-4 h-4" />, run: () => go('/employee/attendance') },
          { id: 'emp-apply', label: 'Apply for Leave', group: 'Navigation', keywords: 'pto vacation sick', icon: <CalendarDays className="w-4 h-4" />, run: () => go('/employee/apply-leave') },
          { id: 'emp-sal', label: 'My Salary & Slips', group: 'Navigation', keywords: 'payslip epf', icon: <IndianRupee className="w-4 h-4" />, run: () => go('/employee/salary') },
          { id: 'emp-exp', label: 'My Expense Claims', group: 'Navigation', keywords: 'claims', icon: <Receipt className="w-4 h-4" />, run: () => go('/employee/expenses') },
        ];

    const quick: CommandItem[] = [
      {
        id: 'thm-dark',
        label: 'Switch Theme: Dark Mode',
        group: 'Theme',
        keywords: 'theme appearance midnight',
        icon: <Moon className="w-4 h-4 text-violet-400" />,
        run: () => {
          setTheme('dark');
          onClose();
        },
      },
      {
        id: 'thm-light',
        label: 'Switch Theme: Light Mode',
        group: 'Theme',
        keywords: 'theme appearance bright',
        icon: <Sun className="w-4 h-4 text-amber-500" />,
        run: () => {
          setTheme('light');
          onClose();
        },
      },
      {
        id: 'thm-sys',
        label: 'Switch Theme: System Default',
        group: 'Theme',
        keywords: 'theme appearance auto',
        icon: <Laptop className="w-4 h-4 text-cyan-500" />,
        run: () => {
          setTheme('system');
          onClose();
        },
      },
    ];

    return [...quick, ...navItems];
  }, [isAdmin, onClose, router, setTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.keywords.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex]?.run();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, filtered, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[14vh] px-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Global Command Palette"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
              <Search className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a module, open Nexora AI, or switch theme..."
                className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close command palette"
                className="p-1 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <p className="text-xs text-[var(--text-secondary)] text-center py-8">
                  No matching commands found.
                </p>
              ) : (
                filtered.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.run}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-colors ${
                      idx === selectedIndex
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                      {item.group}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
              <span>Use ↑↓ arrows and Enter to navigate</span>
              <span className="font-mono">ESC to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
