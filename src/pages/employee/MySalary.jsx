import React, { useState, useEffect } from 'react';
import { salaryApi } from '../../api/salaries';
import { Card, Badge, StatCard } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal, Pagination, LoadingSpinner, EmptyState } from '../../components/ui/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  IndianRupee,
  FileText,
  Download,
  Printer,
  Calendar,
  CheckCircle,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const EmployeeSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Payslip Inspection
  const [viewingSlip, setViewingSlip] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchSalaries();
  }, [page]);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const res = await salaryApi.getMySalary({ page, size: 12 });
      setSalaries(res.items || []);
      setTotalPages(res.pages || 1);
      setTotalItems(res.total || 0);
    } catch (err) {
      console.error('Failed to load salary slips', err);
      toast.error('Failed to load salary statements');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (salaryId, year, month) => {
    setDownloadingId(salaryId);
    try {
      toast.loading('Generating official PDF payslip...', { id: 'pdf-toast' });
      const blob = await salaryApi.downloadMyPayslip(salaryId);
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: 'application/pdf' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Payslip_${year || new Date().getFullYear()}_${month || 1}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Payslip downloaded successfully!', { id: 'pdf-toast' });
    } catch (err) {
      console.error('PDF download error', err);
      toast.error(err.response?.data?.detail || 'Failed to download PDF payslip', {
        id: 'pdf-toast',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const latestSalary = salaries[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Salary & Compensation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View monthly payroll history, net disbursements, bonuses, and download official PDF payslips.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Base Monthly Salary"
          value={formatCurrency(latestSalary?.base_salary || latestSalary?.basic_salary || 0)}
          icon={IndianRupee}
          color="emerald"
        />
        <StatCard
          title="Last Net Pay"
          value={formatCurrency(latestSalary?.net_salary || 0)}
          icon={CheckCircle}
          color="sky"
        />
        <StatCard
          title="Last Disbursement"
          value={
            latestSalary?.payment_date
              ? formatDate(latestSalary.payment_date)
              : 'Pending'
          }
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Pay Slips Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : salaries.length === 0 ? (
          <EmptyState
            icon={IndianRupee}
            title="No Salary Slips Generated"
            description="Your payroll slips will appear here once processed by accounting."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Payroll Period</th>
                  <th className="p-3.5 text-right">Base Salary</th>
                  <th className="p-3.5 text-right">Allowances</th>
                  <th className="p-3.5 text-right">Deductions</th>
                  <th className="p-3.5 text-right">Net Paid</th>
                  <th className="p-3.5">Payment Date</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {salaries.map((sal) => (
                  <tr
                    key={sal.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white font-mono">
                      {sal.month
                        ? new Date(2000, sal.month - 1).toLocaleString('default', {
                            month: 'short',
                          })
                        : ''}{' '}
                      {sal.year}
                    </td>
                    <td className="p-3.5 text-right text-slate-600 dark:text-slate-300">
                      {formatCurrency(sal.base_salary || sal.basic_salary)}
                    </td>
                    <td className="p-3.5 text-right text-emerald-600 font-medium">
                      +{formatCurrency(sal.allowances || sal.bonuses || 0)}
                    </td>
                    <td className="p-3.5 text-right text-rose-600 font-medium">
                      -{formatCurrency(sal.deductions || 0)}
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-900 dark:text-white">
                      {formatCurrency(sal.net_salary)}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {sal.payment_date ? formatDate(sal.payment_date) : 'Pending'}
                    </td>
                    <td className="p-3.5 text-center">
                      <Badge variant={sal.status === 'PAID' ? 'success' : 'warning'}>
                        {sal.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <Button
                          variant="outline"
                          onClick={() => setViewingSlip(sal)}
                          icon={FileText}
                          className="text-[11px] py-1 px-2"
                        >
                          View
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => handleDownloadPdf(sal.id, sal.year, sal.month)}
                          icon={Download}
                          loading={downloadingId === sal.id}
                          className="text-[11px] py-1 px-2"
                        >
                          PDF
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={12}
          onPageChange={setPage}
        />
      </Card>

      {/* Payslip Modal */}
      <Modal
        isOpen={!!viewingSlip}
        onClose={() => setViewingSlip(null)}
        title="Official Payslip"
        subtitle={
          viewingSlip
            ? `Statement for ${new Date(2000, (viewingSlip.month || 1) - 1).toLocaleString('default', { month: 'long' })} ${viewingSlip.year}`
            : ''
        }
        maxWidth="max-w-xl"
      >
        {viewingSlip && (
          <div className="space-y-5 text-xs" id="printable-payslip">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex justify-between items-start">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  NEXORA WORKFORCE EMS
                </h3>
                <p className="text-[11px] text-slate-400">
                  Confidential Compensation Statement
                </p>
              </div>
              <Badge variant={viewingSlip.status === 'PAID' ? 'success' : 'warning'}>
                {viewingSlip.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl">
              <div>
                <p className="text-slate-400 uppercase font-semibold">Pay Period</p>
                <p className="text-slate-900 dark:text-white font-bold mt-0.5">
                  {viewingSlip.month}/{viewingSlip.year}
                </p>
              </div>
              <div>
                <p className="text-slate-400 uppercase font-semibold">Disbursement Date</p>
                <p className="text-slate-900 dark:text-white font-bold mt-0.5">
                  {viewingSlip.payment_date ? formatDate(viewingSlip.payment_date) : 'Pending'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Earnings & Additions
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-lg border-slate-100 dark:border-slate-800 p-2.5">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600 dark:text-slate-300">Basic Salary</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(viewingSlip.base_salary || viewingSlip.basic_salary)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600 dark:text-slate-300">
                    Allowances & Bonuses
                  </span>
                  <span className="font-semibold text-emerald-600">
                    +{formatCurrency(viewingSlip.allowances || viewingSlip.bonuses || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Deductions
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-lg border-slate-100 dark:border-slate-800 p-2.5">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600 dark:text-slate-300">
                    Taxes, EPF, ESIC, PT & LOP
                  </span>
                  <span className="font-semibold text-rose-600">
                    -{formatCurrency(viewingSlip.deductions || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
              <div>
                <p className="text-[11px] uppercase font-bold text-emerald-800 dark:text-emerald-300">
                  Total Net Take-Home
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Credited to registered bank account
                </p>
              </div>
              <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">
                {formatCurrency(viewingSlip.net_salary)}
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  icon={Printer}
                  onClick={handlePrint}
                  className="text-xs"
                >
                  Print
                </Button>
                <Button
                  variant="primary"
                  icon={Download}
                  onClick={() =>
                    handleDownloadPdf(
                      viewingSlip.id,
                      viewingSlip.year,
                      viewingSlip.month
                    )
                  }
                  loading={downloadingId === viewingSlip.id}
                  className="text-xs"
                >
                  Download PDF
                </Button>
              </div>
              <Button variant="outline" onClick={() => setViewingSlip(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
