import React, { useState } from 'react';
import { authApi } from '../../api/auth';
import { Card } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { KeyRound, ShieldCheck, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export const EmployeeChangePassword = () => {
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      toast.error('New password and confirmation do not match');
      return;
    }

    if (form.new_password.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    setSaving(true);
    try {
      await authApi.changePassword(form.current_password, form.new_password);
      toast.success('Your password has been changed successfully!');
      setForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err) {
      console.error('Password change error', err);
      toast.error(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Change Account Password
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Keep your login credentials secure by choosing a unique, strong password.
        </p>
      </div>

      <Card title="Update Password" subtitle="Enter your current password followed by your desired new password">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            required
            placeholder="Enter your current password"
            value={form.current_password}
            onChange={(e) =>
              setForm({ ...form, current_password: e.target.value })
            }
          />

          <Input
            label="New Password"
            type="password"
            required
            placeholder="At least 8 characters"
            value={form.new_password}
            onChange={(e) => setForm({ ...form, new_password: e.target.value })}
          />

          <Input
            label="Confirm New Password"
            type="password"
            required
            placeholder="Re-enter your new password"
            value={form.confirm_password}
            onChange={(e) =>
              setForm({ ...form, confirm_password: e.target.value })
            }
          />

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start space-x-3 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Password Policy:
              </p>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                <li>Minimum of 8 characters in length</li>
                <li>Never share your corporate account credentials with others</li>
                <li>Avoid reusing passwords from personal websites</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="submit"
              variant="primary"
              icon={KeyRound}
              loading={saving}
            >
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
