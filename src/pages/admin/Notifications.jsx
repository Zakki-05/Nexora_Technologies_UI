import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../api/notifications';
import { Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Modal, Pagination, LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';
import {
  Bell,
  Send,
  CheckCircle,
  CheckCheck,
  AlertCircle,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Broadcast Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    type: 'ANNOUNCEMENT',
    target_role: '',
  });

  useEffect(() => {
    fetchNotifications();
  }, [page, unreadOnly]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getMyNotifications({
        page,
        size: 15,
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

  const handleMarkAsRead = async (id) => {
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

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) {
      toast.error('Title and message are required');
      return;
    }

    setBroadcasting(true);
    try {
      const payload = {
        title: broadcastForm.title,
        message: broadcastForm.message,
        type: broadcastForm.type,
        target_role: broadcastForm.target_role || null,
      };

      const res = await notificationApi.broadcast(payload);
      toast.success(res.message || 'Broadcast sent successfully!');
      setShowBroadcastModal(false);
      setBroadcastForm({
        title: '',
        message: '',
        type: 'ANNOUNCEMENT',
        target_role: '',
      });
      fetchNotifications();
    } catch (err) {
      console.error('Broadcast failed', err);
      toast.error(err.response?.data?.detail || 'Failed to send broadcast');
    } finally {
      setBroadcasting(false);
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'ANNOUNCEMENT':
        return <Badge variant="purple">Announcement</Badge>;
      case 'LEAVE_STATUS':
        return <Badge variant="info">Leave Status</Badge>;
      case 'ATTENDANCE_REMINDER':
        return <Badge variant="warning">Attendance</Badge>;
      case 'SYSTEM':
        return <Badge variant="danger">System</Badge>;
      default:
        return <Badge variant="default">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Broadcasts & Notifications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Send company-wide bulletins, manage alerts, and track system notifications.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            icon={CheckCheck}
            className="text-xs"
          >
            Mark All Read
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowBroadcastModal(true)}
            icon={Send}
            className="text-xs"
          >
            New Broadcast
          </Button>
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setUnreadOnly(false);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !unreadOnly
                ? 'bg-slate-900 text-white dark:bg-emerald-600'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => {
              setUnreadOnly(true);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              unreadOnly
                ? 'bg-slate-900 text-white dark:bg-emerald-600'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            Unread Only
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No Notifications Found"
            description={
              unreadOnly
                ? 'You have caught up with all notifications.'
                : 'No announcements or messages recorded yet.'
            }
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectNotification(item)}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  !item.is_read
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`mt-0.5 p-2 rounded-xl flex items-center justify-center shrink-0 ${
                      !item.is_read
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      {getTypeBadge(item.type)}
                      {!item.is_read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 whitespace-pre-wrap">
                      {item.message}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                    </p>
                  </div>
                </div>

                {!item.is_read && (
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(item.id);
                    }}
                    className="text-xs shrink-0 py-1 px-2.5"
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={15}
          onPageChange={setPage}
        />
      </Card>

      {/* Broadcast Modal */}
      <Modal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        title="Broadcast Announcement"
        subtitle="Publish a formal notice to all employees or specific target roles."
      >
        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <Input
            label="Announcement Title"
            required
            placeholder="e.g. Annual Company Offsite / Office Maintenance"
            value={broadcastForm.title}
            onChange={(e) =>
              setBroadcastForm({ ...broadcastForm, title: e.target.value })
            }
          />

          <Select
            label="Target Audience"
            value={broadcastForm.target_role}
            onChange={(e) =>
              setBroadcastForm({ ...broadcastForm, target_role: e.target.value })
            }
            options={[
              { label: 'All Users (Everyone)', value: '' },
              { label: 'Employees Only', value: 'EMPLOYEE' },
              { label: 'Admins Only', value: 'ADMIN' },
            ]}
          />

          <Select
            label="Notification Type"
            value={broadcastForm.type}
            onChange={(e) =>
              setBroadcastForm({ ...broadcastForm, type: e.target.value })
            }
            options={[
              { label: 'Company Announcement', value: 'ANNOUNCEMENT' },
              { label: 'General Notice', value: 'GENERAL' },
              { label: 'Attendance Reminder', value: 'ATTENDANCE_REMINDER' },
              { label: 'Urgent System Alert', value: 'SYSTEM' },
            ]}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Message Content
            </label>
            <textarea
              required
              rows={4}
              placeholder="Write the full announcement description here..."
              value={broadcastForm.message}
              onChange={(e) =>
                setBroadcastForm({ ...broadcastForm, message: e.target.value })
              }
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowBroadcastModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={broadcasting}>
              Send Broadcast
            </Button>
          </div>
        </form>
      </Modal>

      {/* Notification Details Modal */}
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
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
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

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
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
