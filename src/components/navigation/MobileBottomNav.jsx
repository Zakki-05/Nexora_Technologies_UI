import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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

export const MobileBottomNav = ({ onOpenSidebar }) => {
  const { isAdmin } = useAuth();

  const adminNavItems = [
    { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Staff', to: '/admin/employees', icon: Users },
    { label: 'Attendance', to: '/admin/attendance', icon: CalendarCheck },
    { label: 'Org Chart', to: '/admin/org-chart', icon: Network },
  ];

  const employeeNavItems = [
    { label: 'Home', to: '/employee', icon: LayoutDashboard, end: true },
    { label: 'Attendance', to: '/employee/attendance', icon: CalendarCheck },
    { label: 'Leaves', to: '/employee/leaves', icon: CalendarDays },
    { label: 'Expenses', to: '/employee/expenses', icon: Receipt },
    { label: 'Profile', to: '/employee/profile', icon: User },
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#0B1426]/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1 shadow-lg transition-colors"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 min-w-[56px] min-h-[44px] ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-lg transition-transform ${
                      isActive ? 'bg-primary-50 dark:bg-primary-950/60 scale-110' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* Menu Toggle for Admin to access all other tools */}
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
};
