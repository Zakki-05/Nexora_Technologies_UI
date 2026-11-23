import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationApi } from '../../api/notifications';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Shield,
  Menu,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  ChevronRight,
  ExternalLink,
  Search,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const data = await notificationApi.getUnreadCount();
        setUnreadCount(data.unread_count);
      } catch {
        // Ignore
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenNotifications = async () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);
    if (nextState) {
      try {
        const res = await notificationApi.getMyNotifications({ size: 10 });
        setNotifications(res.items || []);
      } catch {
        // Ignore
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // Ignore
    }
  };

  const handleSelectNotification = async (item) => {
    setSelectedNotification(item);
    setShowNotifications(false);
    if (!item.is_read) {
      try {
        await notificationApi.markAsRead(item.id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
        );
      } catch {
        // Ignore
      }
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'URGENT':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            URGENT
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            HIGH
          </span>
        );
      default:
        return null;
    }
  };

  // Generate breadcrumb path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbTitle = pathSegments.length > 1
    ? pathSegments[1].replace(/-/g, ' ').toUpperCase()
    : 'OVERVIEW';

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#060D1F]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
          {/* Left: Mobile Toggle & Breadcrumb */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-xs">
              <span className="font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#06B6D4]">
                Nexora EMS
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {isAdmin ? 'Admin Portal' : 'Employee Portal'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-500 dark:text-[#94A3B8]">
                {breadcrumbTitle}
              </span>
            </div>
          </div>

          {/* Right: Actions & User Info */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-transparent dark:border-slate-800"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={handleOpenNotifications}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-transparent dark:border-slate-800"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#111C32] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-[#2563EB] dark:text-[#06B6D4]" />
                      Notifications &amp; Alerts
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-[#2563EB] dark:text-[#06B6D4] hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-center text-slate-500 py-8">
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleSelectNotification(n)}
                          className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                            !n.is_read ? 'bg-blue-50/50 dark:bg-[#2563EB]/10' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                              {getPriorityBadge(n.priority)}
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {n.title}
                              </p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {n.created_at ? new Date(n.created_at).toLocaleDateString() : ''}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1 line-clamp-2">
                            {n.message}
                          </p>

                          <div className="mt-1 flex items-center justify-between text-[10px] text-[#2563EB] dark:text-[#06B6D4] font-medium">
                            <span>View detail &rarr;</span>
                            {!n.is_read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Dropdown Footer Link */}
                  <div className="px-4 pt-2.5 mt-1 border-t border-slate-100 dark:border-slate-800 text-center">
                    <Link
                      to={isAdmin ? '/admin/notifications' : '/employee/notifications'}
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-bold text-[#2563EB] dark:text-[#06B6D4] hover:underline inline-flex items-center space-x-1"
                    >
                      <span>View All in Full Page</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Chip */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {user?.employee?.full_name ? user.employee.full_name[0] : user?.username?.[0] || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight truncate max-w-[120px]">
                  {user?.employee?.full_name || user?.username}
                </span>
                <span className="block text-[10px] font-semibold text-slate-400 dark:text-[#94A3B8] leading-tight">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Full Notification Detail Modal */}
      {selectedNotification && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedNotification(null)}
          title={selectedNotification.title}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold">
                Type: {selectedNotification.type || 'System Alert'}
              </span>
              <span>
                {selectedNotification.created_at
                  ? new Date(selectedNotification.created_at).toLocaleString()
                  : ''}
              </span>
            </div>

            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {selectedNotification.message}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedNotification(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
