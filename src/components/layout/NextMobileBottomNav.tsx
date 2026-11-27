'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  Network,
  Receipt,
  User,
  Menu,
} from 'lucide-react';

export function NextMobileBottomNav({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { isAdmin } = useAuth();
  const pathname = usePathname();

  const adminNavItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Staff', href: '/admin/employees', icon: Users, exact: false },
    { label: 'Attendance', href: '/admin/attendance', icon: CalendarCheck, exact: false },
    { label: 'Org Chart', href: '/admin/org-chart', icon: Network, exact: false },
  ];

  const employeeNavItems = [
    { label: 'Home', href: '/employee', icon: LayoutDashboard, exact: true },
    { label: 'Attendance', href: '/employee/attendance', icon: CalendarCheck, exact: false },
    { label: 'Leaves', href: '/employee/leaves', icon: CalendarDays, exact: false },
    { label: 'Expenses', href: '/employee/expenses', icon: Receipt, exact: false },
    { label: 'Profile', href: '/employee/profile', icon: User, exact: false },
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#0B1426]/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1 shadow-lg transition-colors safe-bottom"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 min-w-[56px] min-h-[44px] ${
                isActive
                  ? 'text-[#2563EB] dark:text-[#60A5FA] font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'bg-blue-50 dark:bg-blue-950/60 scale-110' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <button
            onClick={onOpenSidebar}
            type="button"
            className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 min-w-[56px] min-h-[44px]"
            aria-label="Open Full Menu"
          >
            <div className="p-1 rounded-lg">
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Menu</span>
          </button>
        )}
      </div>
    </nav>
  );
}
