import React, { useState, useEffect } from 'react';
import { documentApi } from '../../api/documents';
import { Card, Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Modal, LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';
import {
  FolderOpen,
  Upload,
  Download,
  Trash2,
  FileText,
  Shield,
  FileCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const EmployeeDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('RESUME');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await documentApi.getMyDocuments();
      setDocuments(Array.isArray(res) ? res : res.items || []);
    } catch (err) {
      console.error('Failed to load documents', err);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFileToUpload(f);
      if (!title) {
        setTitle(f.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!fileToUpload) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('title', title.trim() || fileToUpload.name);
      formData.append('document_type', documentType);

      await documentApi.upload(formData);
      toast.success('Document uploaded successfully!');
      setShowUploadModal(false);
      setFileToUpload(null);
      setTitle('');
      fetchDocuments();
    } catch (err) {
      console.error('Upload failed', err);
      toast.error(err.response?.data?.detail || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await documentApi.delete(id);
      toast.success('Document deleted');
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete document');
    }
  };

  const handleDownload = (doc) => {
    try {
      documentApi.download(doc.id, doc.filename);
      toast.success(`Downloading ${doc.filename}...`);
    } catch (err) {
      toast.error('Failed to initiate download');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Documents & Credentials
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Securely upload, store, and access your employment contracts, certifications, and identification files.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowUploadModal(true)}
          icon={Upload}
          className="text-xs"
        >
          Upload Document
        </Button>
      </div>

      {/* Document Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : documents.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No Documents Uploaded"
            description="You have not uploaded any certificates, contracts or resumes yet."
            action={
              <Button
                variant="primary"
                onClick={() => setShowUploadModal(true)}
                className="text-xs"
              >
                Upload First File
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">File Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">File Size</th>
                  <th className="p-3.5">Upload Date</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="p-3.5 font-medium text-slate-900 dark:text-white flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-xs">{doc.filename}</span>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="purple">{doc.document_type}</Badge>
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono">
                      {formatFileSize(doc.file_size)}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {doc.uploaded_at ? formatDate(doc.uploaded_at) : 'N/A'}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-emerald-600 transition-colors"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-rose-600 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Personal Document"
        subtitle="Accepted formats: PDF, PNG, JPG, DOCX (Max 10MB)"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <Input
            label="Document Title"
            placeholder="e.g. Resume 2026, Degree Certificate, Passport"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Select
            label="Document Category"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            options={[
              { label: 'Resume / Curriculum Vitae', value: 'RESUME' },
              { label: 'Government ID Proof / Passport', value: 'ID_PROOF' },
              { label: 'Employment Contract', value: 'CONTRACT' },
              { label: 'Academic / Professional Certificate', value: 'CERTIFICATE' },
              { label: 'Other Document', value: 'OTHER' },
            ]}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Choose File
            </label>
            <input
              type="file"
              required
              onChange={handleFileChange}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-950 dark:file:text-emerald-300 cursor-pointer"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUploadModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={uploading}>
              Upload File
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
