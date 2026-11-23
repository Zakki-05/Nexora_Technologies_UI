import React, { useState, useEffect, useRef } from 'react';
import { employeeApi } from '../../api/employees';
import { useAuth } from '../../context/AuthContext';
import { Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { LoadingSpinner, Modal } from '../../components/ui/Modal';
import { formatDate, formatCurrency } from '../../utils/formatters';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  ShieldCheck,
  Save,
  Clock,
  Camera,
  Upload,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const getAvatarUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path}`;
};

export const EmployeeProfile = () => {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Avatar Upload States
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    date_of_birth: '',
    gender: 'PREFER_NOT_TO_SAY',
    profile_picture: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await employeeApi.getMyProfile();
      setProfile(data);
      setFormData({
        phone: data.phone || '',
        address: data.address || '',
        date_of_birth: data.date_of_birth || '',
        gender: data.gender || 'PREFER_NOT_TO_SAY',
        profile_picture: data.profile_picture || '',
      });
    } catch (err) {
      console.error('Failed to load employee profile', err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await employeeApi.updateMyProfile(formData);
      setProfile(updated);
      toast.success('Profile updated successfully!');
      if (refreshProfile) refreshProfile();
    } catch (err) {
      console.error('Update failed', err);
      toast.error(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, or WEBP image formats are supported');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setShowUploadModal(true);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    setUploadingAvatar(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);

      const updated = await employeeApi.uploadAvatar(uploadData);
      setProfile(updated);
      setShowUploadModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success('Profile photo submitted for Admin approval!');
      if (refreshProfile) refreshProfile();
    } catch (err) {
      console.error('Failed to upload avatar', err);
      toast.error(err.response?.data?.detail || 'Failed to upload photo for approval');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const cancelAvatarUpload = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'EM';

  const activeAvatarSrc = getAvatarUrl(profile?.profile_picture);
  const pendingAvatarSrc = getAvatarUrl(profile?.pending_profile_picture);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
      />

      {/* Header Profile Hero */}
      <Card className="p-6 relative overflow-hidden">
        {/* Subtle background ambient blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
          {/* Avatar Container with interactive Camera Overlay */}
          <div className="relative group">
            {activeAvatarSrc ? (
              <img
                src={activeAvatarSrc}
                alt={profile.full_name}
                className="w-28 h-28 rounded-2xl object-cover border-2 border-emerald-500 shadow-md ring-4 ring-emerald-500/10 transition-transform group-hover:scale-[1.02]"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-3xl font-black shadow-md ring-4 ring-emerald-500/10">
                {initials}
              </div>
            )}

            {/* Camera Upload Overlay Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload new profile photo (Requires admin approval)"
              className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-semibold backdrop-blur-sm transition-all duration-200 cursor-pointer"
            >
              <Camera className="w-6 h-6 mb-1 text-emerald-300 drop-shadow" />
              <span>Change Photo</span>
            </button>

            {/* Small Quick-Action Camera Badge at bottom-right */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-transform active:scale-95 border-2 border-white dark:border-slate-900 cursor-pointer"
              title="Upload new profile picture"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {profile?.full_name || 'Staff Member'}
                </h1>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {profile?.job_position || 'Position Unspecified'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={profile?.employment_status === 'ACTIVE' ? 'success' : 'warning'}>
                  {profile?.employment_status || 'ACTIVE'}
                </Badge>
                {profile?.profile_picture_status === 'PENDING' && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 animate-pulse">
                    <Clock className="w-3 h-3 mr-1" /> Photo Pending Approval
                  </span>
                )}
                {profile?.profile_picture_status === 'APPROVED' && profile?.profile_picture && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Photo Verified
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>{profile?.department?.name || 'Department Unassigned'}</span>
              <span className="mx-1">&bull;</span>
              <span className="font-mono">{profile?.employee_code}</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Profile Picture</span>
              </button>
              <span className="text-[11px] text-slate-400">
                (JPG, PNG, WEBP &bull; Max 5MB &bull; Subject to Admin Approval)
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Photo Approval Status Alert Banners */}
      {profile?.profile_picture_status === 'PENDING' && (
        <div className="rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/80 dark:bg-amber-950/30 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg shrink-0 mt-0.5 sm:mt-0">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Profile Photo Update Pending Admin Approval
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                You uploaded a new profile picture. To maintain professional corporate standards, your photo is currently being reviewed by an Administrator or HR Manager.
              </p>
            </div>
          </div>
          {pendingAvatarSrc && (
            <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-2 rounded-xl border border-amber-200 dark:border-amber-800 shrink-0">
              <img
                src={pendingAvatarSrc}
                alt="Pending review"
                className="w-12 h-12 rounded-lg object-cover border border-amber-400"
              />
              <div className="text-right text-[11px]">
                <span className="block font-semibold text-amber-600 dark:text-amber-400">Proposed Photo</span>
                <span className="text-slate-400">Awaiting Decision</span>
              </div>
            </div>
          )}
        </div>
      )}

      {profile?.profile_picture_status === 'REJECTED' && (
        <div className="rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/80 dark:bg-rose-950/30 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg shrink-0 mt-0.5 sm:mt-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Profile Photo Was Not Approved by Administration
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                <span className="font-semibold">Reason:</span> {profile?.profile_picture_rejection_reason || 'Photo did not meet corporate quality or identity requirements.'}
              </p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">
                Please upload a clear, front-facing professional corporate headshot.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="danger"
            onClick={() => fileInputRef.current?.click()}
            icon={Upload}
            className="shrink-0"
          >
            Upload New Photo
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Employment Info (Read-only HR Data) */}
        <div className="md:col-span-1 space-y-6">
          <Card title="Official Details" subtitle="Company verified staff information">
            <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-2.5">
                <dt className="text-slate-400 font-semibold uppercase">Email Address</dt>
                <dd className="font-medium text-slate-900 dark:text-white mt-0.5 break-all">
                  {profile?.email}
                </dd>
              </div>
              <div className="py-2.5">
                <dt className="text-slate-400 font-semibold uppercase">Department</dt>
                <dd className="font-medium text-slate-900 dark:text-white mt-0.5">
                  {profile?.department?.name || 'Not assigned'}
                </dd>
              </div>
              <div className="py-2.5">
                <dt className="text-slate-400 font-semibold uppercase">Job Position</dt>
                <dd className="font-medium text-slate-900 dark:text-white mt-0.5">
                  {profile?.job_position}
                </dd>
              </div>
              <div className="py-2.5">
                <dt className="text-slate-400 font-semibold uppercase">Hire Date</dt>
                <dd className="font-medium text-slate-900 dark:text-white mt-0.5">
                  {profile?.hire_date ? formatDate(profile.hire_date) : 'N/A'}
                </dd>
              </div>
              <div className="py-2.5">
                <dt className="text-slate-400 font-semibold uppercase">Base Compensation</dt>
                <dd className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatCurrency(profile?.salary || 0)}
                </dd>
              </div>
            </dl>
          </Card>
        </div>

        {/* Right Column: Editable Profile Information */}
        <div className="md:col-span-2">
          <Card
            title="Personal & Contact Information"
            subtitle="You can maintain and update your personal details here"
          >
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Phone Number"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <Select
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  options={[
                    { label: 'Male', value: 'MALE' },
                    { label: 'Female', value: 'FEMALE' },
                    { label: 'Non-Binary', value: 'NON_BINARY' },
                    { label: 'Prefer not to say', value: 'PREFER_NOT_TO_SAY' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_birth: e.target.value })
                  }
                />

                <Input
                  label="External Avatar Link (Optional)"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.profile_picture}
                  onChange={(e) =>
                    setFormData({ ...formData, profile_picture: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Residential Address
                </label>
                <textarea
                  rows={3}
                  placeholder="Street address, city, state, postal code"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="submit" variant="primary" icon={Save} loading={saving}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* Confirmation & Preview Modal for Avatar Upload */}
      <Modal
        isOpen={showUploadModal}
        onClose={cancelAvatarUpload}
        title="Submit Profile Photo for Admin Approval"
      >
        <div className="space-y-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 flex items-start space-x-2.5">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500" />
            <div>
              <p className="font-semibold">Nexora Corporate Verification Workflow</p>
              <p className="mt-0.5 text-[11px]">
                Upon submission, your new photo will be queued for administrative review. Once verified by HR / Admin, it will automatically become your active profile photo across Nexora Workforce.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
            {/* Current Active Photo */}
            <div className="text-center space-y-2">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Photo
              </span>
              {activeAvatarSrc ? (
                <img
                  src={activeAvatarSrc}
                  alt="Current"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-300 dark:border-slate-700 mx-auto shadow"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-xl font-bold mx-auto border-2 border-slate-300 dark:border-slate-700">
                  {initials}
                </div>
              )}
            </div>

            <div className="text-slate-400 font-bold">&rarr;</div>

            {/* New Preview Photo */}
            <div className="text-center space-y-2">
              <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                New Preview
              </span>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="New preview"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 mx-auto shadow-lg ring-4 ring-emerald-500/20"
                />
              )}
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Selected file: <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{selectedFile?.name}</span> ({(selectedFile?.size / 1024).toFixed(1)} KB)
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={cancelAvatarUpload} disabled={uploadingAvatar}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUploadSubmit}
              loading={uploadingAvatar}
              icon={Upload}
            >
              Submit for Approval
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
