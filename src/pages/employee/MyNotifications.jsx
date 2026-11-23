import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../api/notifications';
import { Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal, Pagination, LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';
import {
  Bell,
  CheckCircle2,
  CheckCheck,
  AlertCircle,
  Sparkles,
  Info,
  Calendar,
  ExternalLink,
  Clock,
  ShieldCheck,
  User,
  IndianRupee,
  CalendarDays,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const EmployeeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [page, unreadOnly]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getMyNotifications({
        page,
        size: 10,
        unread_only: unreadOnly,
      });
      setNotifications(res.items || []);
      setTotalPages(res.pages || 1);
      setTotalItems(res.total || 0);
    } catch (err) {
      console.error('Failed to load notifications', err);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      toast.success('Marked as read');
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleSelectNotification = async (item) => {
    setSelectedNotification(item);
    if (!item.is_read) {
      try {
        await notificationApi.markAsRead(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
        );
      } catch {
        // Ignore
      }
    }
  };

  const getTypeBadge = (type) => {
    switch (type?.toUpperCase()) {
      case 'AVATAR_APPROVED':
        return <Badge variant="success">Photo Approved</Badge>;
      case 'AVATAR_REJECTED':
        return <Badge variant="danger">Photo Declined</Badge>;
      case 'LEAVE_APPROVED':
      case 'LEAVE_STATUS':
        return <Badge variant="info">Leave Update</Badge>;
      case 'PAYROLL_GENERATED':
      case 'PAYSLIP':
        return <Badge variant="success">Payroll / Slips</Badge>;
      case 'ANNOUNCEMENT':
        return <Badge variant="purple">Announcement</Badge>;
      case 'ATTENDANCE_REMINDER':
        return <Badge variant="warning">Attendance</Badge>;
      default:
        return <Badge variant="default">{type || 'GENERAL'}</Badge>;
    }
  };

  const getActionTarget = (item) => {
    const text = `${item.title} ${item.message} ${item.type}`.toUpperCase();
    if (text.includes('AVATAR') || text.includes('PHOTO') || text.includes('PROFILE')) {
      return { label: 'Go to My Profile', path: '/employee/profile', icon: User };
    }
    if (text.includes('LEAVE')) {
      return { label: 'View Leave Status', path: '/employee/leaves', icon: CalendarDays };
    }
    if (text.includes('PAYROLL') || text.includes('PAYSLIP') || text.includes('SALARY')) {
      return { label: 'View Salary & Slips', path: '/employee/salary', icon: IndianRupee };
    }
    if (text.includes('ATTENDANCE')) {
      return { label: 'View Attendance', path: '/employee/attendance', icon: Clock };
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-emerald-500" />
            <span>My Notifications &amp; Alerts</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Stay updated with corporate announcements, leave approval statuses, photo reviews, and payroll notifications.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            icon={CheckCheck}
            className="text-xs"
          >
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            setUnreadOnly(false);
            setPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            !unreadOnly
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          All Notifications ({totalItems})
        </button>
        <button
          onClick={() => {
            setUnreadOnly(true);
            setPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            unreadOnly
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          Unread Only
        </button>
      </div>

      {/* Notification List */}
      <Card className="!p-0 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No Notifications Found"
            description={
              unreadOnly
                ? 'You have caught up with all unread notifications.'
                : 'No announcements or messages recorded in your feed yet.'
            }
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectNotification(item)}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-all cursor-pointer ${
                  !item.is_read
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  <div
                    className={`mt-0.5 p-2 rounded-xl flex items-center justify-center shrink-0 ${
                      !item.is_read
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h4>
                      {getTypeBadge(item.type)}
                      {!item.is_read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                      {item.message}
                    </p>

                    <div className="flex items-center space-x-3 mt-2 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.created_at ? new Date(item.created_at).toLocaleString() : ''}</span>
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                        Click to view full details &rarr;
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  {!item.is_read && (
                    <button
                      onClick={(e) => handleMarkAsRead(item.id, e)}
                      title="Mark as read"
                      className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
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

      {/* Full Notification Detail Modal */}
      <Modal
        isOpen={Boolean(selectedNotification)}
        onClose={() => setSelectedNotification(null)}
        title="Notification Details"
        subtitle={selectedNotification?.title}
      >
        {selectedNotification && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                {getTypeBadge(selectedNotification.type)}
                <span className="text-xs text-slate-500 font-mono">
                  ID: #{selectedNotification.id}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {selectedNotification.created_at
                    ? new Date(selectedNotification.created_at).toLocaleString()
                    : ''}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2">
                {selectedNotification.title}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {selectedNotification.message}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              {(() => {
                const action = getActionTarget(selectedNotification);
                if (action) {
                  const ActionIcon = action.icon;
                  return (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setSelectedNotification(null);
                        navigate(action.path);
                      }}
                      icon={ActionIcon}
                    >
                      {action.label}
                    </Button>
                  );
                }
                return <div />;
              })()}

              <Button
                size="sm"
                variant="secondary"
                onClick={() => setSelectedNotification(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
