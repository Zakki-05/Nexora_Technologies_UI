import React, { useState, useEffect } from 'react';
import { departmentApi } from '../../api/departments';
import { Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal, LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { Building2, Plus, Users, Edit2, Trash2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDept, setCurrentDept] = useState(null);
  const [reassignTargetId, setReassignTargetId] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await departmentApi.getAll({ size: 100 });
      setDepartments(data.items || []);
    } catch {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenAdd = () => {
    setName('');
    setDescription('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (dept) => {
    setCurrentDept(dept);
    setName(dept.name);
    setDescription(dept.description || '');
    setShowEditModal(true);
  };

  const handleOpenDelete = (dept) => {
    setCurrentDept(dept);
    const other = departments.find((d) => d.id !== dept.id);
    setReassignTargetId(other ? other.id.toString() : '');
    setShowDeleteModal(true);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await departmentApi.create({ name, description });
      toast.success('Department created!');
      setShowAddModal(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create department');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await departmentApi.update(currentDept.id, { name, description });
      toast.success('Department updated!');
      setShowEditModal(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update department');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const targetId =
        currentDept.employee_count > 0 ? parseInt(reassignTargetId, 10) : null;
      await departmentApi.delete(currentDept.id, targetId);
      toast.success('Department deleted successfully');
      setShowDeleteModal(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete department');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Department Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize teams, manage employee allocation, and departmental headcount
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="sm:self-auto self-start">
          <Plus className="w-4 h-4 mr-1.5" /> Add Department
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner className="py-24" />
      ) : departments.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No departments found"
          description="Create your first company department to get started."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(dept)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(dept)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {dept.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center text-slate-500">
                  <Users className="w-3.5 h-3.5 mr-1" /> Active Headcount
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full font-bold text-emerald-600">
                  {dept.employee_count} employee(s)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Department"
        subtitle="Create a new functional department"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <Input
            label="Department Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Platform Engineering"
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Responsibilities and domain..."
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create Department
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Department"
        subtitle={`Updating ${currentDept?.name}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            label="Department Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete & Reassign Safeguard Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Department"
        subtitle={`Safeguard verification for '${currentDept?.name}'`}
      >
        <div className="space-y-4">
          {currentDept?.employee_count > 0 ? (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300">
              <p className="font-bold mb-1">Active Employees Warning</p>
              This department currently has{' '}
              <strong>{currentDept.employee_count}</strong> active employee(s).
              To proceed, choose a destination department to safely reassign
              them before deletion:
            </div>
          ) : (
            <p className="text-xs text-slate-600 dark:text-slate-400">
              This department has 0 active employees. It can be safely removed.
            </p>
          )}

          {currentDept?.employee_count > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Reassign Employees To
              </label>
              <select
                value={reassignTargetId}
                onChange={(e) => setReassignTargetId(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {departments
                  .filter((d) => d.id !== currentDept.id)
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={saving}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
