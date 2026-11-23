import React, { useState, useEffect } from 'react';
import { holidayApi } from '../../api/holidays';
import { Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal, LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';
import { Sparkles, Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    is_optional: false,
  });
  const [saving, setSaving] = useState(false);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const data = await holidayApi.getAll(year);
      setHolidays(data);
    } catch {
      toast.error('Failed to load holidays');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [year]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      is_optional: false,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (h) => {
    setIsEditing(true);
    setCurrentId(h.id);
    setFormData({
      name: h.name,
      date: h.date,
      description: h.description || '',
      is_optional: h.is_optional,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        await holidayApi.update(currentId, formData);
        toast.success('Holiday updated');
      } else {
        await holidayApi.create(formData);
        toast.success('Holiday added');
      }
      setShowModal(false);
      fetchHolidays();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save holiday');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this holiday entry?')) {
      try {
        await holidayApi.delete(id);
        toast.success('Holiday deleted');
        fetchHolidays();
      } catch {
        toast.error('Failed to delete holiday');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Company Holiday Calendar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure annual observances, paid leaves, and corporate holidays
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y} Holidays
              </option>
            ))}
          </select>
          <Button onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Holiday
          </Button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner className="py-24" />
      ) : holidays.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No holidays configured"
          description={`No holidays found for year ${year}.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {holidays.map((h) => (
            <div
              key={h.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                    {formatDate(h.date)}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(h)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(h.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
                  {h.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {h.description || 'Corporate recognized public holiday.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Type</span>
                <Badge variant={h.is_optional ? 'warning' : 'success'}>
                  {h.is_optional ? 'Optional' : 'Mandatory'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEditing ? 'Edit Holiday' : 'Add Holiday'}
        subtitle="Specify official holiday details"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Holiday Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Independence Day"
          />

          <Input
            label="Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Observance details..."
          />

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="is_optional"
              checked={formData.is_optional}
              onChange={(e) =>
                setFormData({ ...formData, is_optional: e.target.checked })
              }
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <label
              htmlFor="is_optional"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Optional / Restricted Holiday
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {isEditing ? 'Save Changes' : 'Create Holiday'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
