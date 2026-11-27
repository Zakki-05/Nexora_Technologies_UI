import apiClient from '@/services/apiClient';
import type { PaginatedResponse } from '@/types/api';
import type { Department, Employee, ExpenseClaim, ExpenseListResult, Organization } from '@/types/hr';

export interface DashboardAdminData {
  total_employees: number;
  active_employees: number;
  total_departments: number;
  total_leaves: number;
  pending_leaves: number;
  today_present: number;
  today_late: number;
  attendance_rate: number;
  monthly_payroll?: number | string;
  department_distribution?: Array<{ department_id: number; name: string; count: number }>;
  recent_leaves?: Array<{ id: number; employee_name: string; leave_type: string; days_count: number; status: string }>;
}

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  employee_name?: string;
  employee_code?: string;
  date: string;
  check_in?: string | null;
  check_out?: string | null;
  work_hours?: number | string;
  actual_working_minutes?: number;
  total_break_minutes?: number;
  status: string;
  is_late?: boolean;
}

export interface LeaveRecord {
  id: number;
  employee_id: number;
  employee_name?: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_count: number | string;
  reason?: string | null;
  status: string;
  rejection_reason?: string | null;
}

export interface SalaryRecord {
  id: number;
  employee_id: number;
  employee_name?: string;
  employee_code?: string;
  month?: number;
  year?: number;
  payment_date?: string;
  basic_salary?: number | string;
  allowances?: number | string;
  deductions?: number | string;
  net_salary: number | string;
  status?: string;
}

export interface HolidayRecord {
  id: number;
  name: string;
  date: string;
  holiday_type?: string;
  description?: string | null;
}

export interface DocumentRecord {
  id: number;
  title: string;
  document_type: string;
  file_name?: string;
  file_path?: string;
  uploaded_at?: string;
  created_at?: string;
}

export interface NotificationRecord {
  id: number;
  title: string;
  message: string;
  type?: string;
  priority?: string;
  is_read: boolean;
  created_at?: string;
}

export interface AuditLogRecord {
  id: number;
  action: string;
  entity_type?: string;
  entity_id?: number;
  details?: string;
  user_email?: string;
  created_at?: string;
}

export const hrService = {
  // Dashboard
  getAdminDashboard: async (): Promise<DashboardAdminData> => {
    const res = await apiClient.get<DashboardAdminData>('/dashboard/admin');
    return res.data;
  },
  getEmployeeDashboard: async (): Promise<Record<string, unknown>> => {
    const res = await apiClient.get<Record<string, unknown>>('/dashboard/employee');
    return res.data;
  },

  // Employees
  getEmployees: async (params: Record<string, string | number | undefined> = {}): Promise<PaginatedResponse<Employee>> => {
    const res = await apiClient.get<PaginatedResponse<Employee>>('/employees/', { params });
    return res.data;
  },
  getMyProfile: async (): Promise<Employee> => {
    const res = await apiClient.get<Employee>('/employees/me');
    return res.data;
  },
  updateMyProfile: async (data: Partial<Employee>): Promise<Employee> => {
    const res = await apiClient.patch<Employee>('/employees/me', data);
    return res.data;
  },
  createEmployee: async (data: Record<string, unknown>): Promise<Employee> => {
    const res = await apiClient.post<Employee>('/employees/', data);
    return res.data;
  },
  deleteEmployee: async (id: number): Promise<void> => {
    await apiClient.delete(`/employees/${id}`);
  },

  // Departments
  getDepartments: async (params: Record<string, string | number | undefined> = {}): Promise<PaginatedResponse<Department>> => {
    const res = await apiClient.get<PaginatedResponse<Department>>('/departments/', { params });
    return res.data;
  },
  createDepartment: async (data: { name: string; description?: string }): Promise<Department> => {
    const res = await apiClient.post<Department>('/departments/', data);
    return res.data;
  },
  deleteDepartment: async (id: number): Promise<void> => {
    await apiClient.delete(`/departments/${id}`);
  },

  // Attendance & Breaks
  getAllAttendance: async (params: Record<string, string | number | undefined> = {}): Promise<PaginatedResponse<AttendanceRecord>> => {
    const res = await apiClient.get<PaginatedResponse<AttendanceRecord>>('/attendance/', { params });
    return res.data;
  },
  getMyAttendance: async (params: Record<string, string | number | undefined> = {}): Promise<PaginatedResponse<AttendanceRecord>> => {
    const res = await apiClient.get<PaginatedResponse<AttendanceRecord>>('/attendance/me', { params });
    return res.data;
  },
  getLiveAttendanceStatus: async (): Promise<Record<string, unknown>> => {
    const res = await apiClient.get<Record<string, unknown>>('/attendance/me/live-status');
    return res.data;
  },
  punchIn: async (): Promise<AttendanceRecord> => {
    const res = await apiClient.post<AttendanceRecord>('/attendance/punch-in');
    return res.data;
  },
  punchOut: async (): Promise<AttendanceRecord> => {
    const res = await apiClient.post<AttendanceRecord>('/attendance/punch-out');
    return res.data;
  },

  // Leaves
  getAllLeaves: async (params: Record<string, string | number | undefined> = {}): Promise<PaginatedResponse<LeaveRecord>> => {
    const res = await apiClient.get<PaginatedResponse<LeaveRecord>>('/leaves/', { params });
    return res.data;
  },
  getMyLeaves: async (params: Record<string, string | number | undefined> = {}): Promise<PaginatedResponse<LeaveRecord>> => {
    const res = await apiClient.get<PaginatedResponse<LeaveRecord>>('/leaves/me', { params });
    return res.data;
  },
  getMyLeaveBalance: async (): Promise<Record<string, unknown>> => {
    const res = await apiClient.get<Record<string, unknown>>('/leaves/my-balance');
    return res.data;
  },
  applyLeave: async (data: Record<string, unknown>): Promise<LeaveRecord> => {
    const res = await apiClient.post<LeaveRecord>('/leaves/', data);
    return res.data;
  },
  reviewLeave: async (id: number, status: 'APPROVED' | 'REJECTED', rejectionReason?: string): Promise<LeaveRecord> => {
    const res = await apiClient.patch<LeaveRecord>(`/leaves/${id}/status`, {
      status,
      rejection_reason: rejectionReason,
    });
    return res.data;
  },

  // Salaries & Payslips
  getSalaries: async (params: Record<string, string | number | undefined> = {}): Promise<PaginatedResponse<SalaryRecord>> => {
    const res = await apiClient.get<PaginatedResponse<SalaryRecord>>('/salaries/', { params });
    return res.data;
  },
  getMySalaries: async (params: Record<string, string | number | undefined> = {}): Promise<PaginatedResponse<SalaryRecord>> => {
    const res = await apiClient.get<PaginatedResponse<SalaryRecord>>('/salaries/my-salary', { params });
    return res.data;
  },
  downloadPayslipPdf: async (salaryId: number, isMine = false): Promise<Blob> => {
    const path = isMine ? `/salaries/my-salary/${salaryId}/payslip` : `/salaries/${salaryId}/payslip`;
    const res = await apiClient.get<Blob>(path, { responseType: 'blob' });
    return res.data;
  },

  // Expenses
  getExpenses: async (params: Record<string, string | number | undefined> = {}): Promise<ExpenseListResult> => {
    const res = await apiClient.get<ExpenseListResult>('/expenses', { params });
    return res.data;
  },
  getMyExpenses: async (params: Record<string, string | number | undefined> = {}): Promise<ExpenseListResult> => {
    const res = await apiClient.get<ExpenseListResult>('/expenses/me', { params });
    return res.data;
  },
  submitExpense: async (data: Record<string, unknown>): Promise<ExpenseClaim> => {
    const res = await apiClient.post<ExpenseClaim>('/expenses', data);
    return res.data;
  },
  reviewExpense: async (id: number, data: { status: 'APPROVED' | 'REJECTED'; approved_amount?: number; remarks?: string }): Promise<ExpenseClaim> => {
    const res = await apiClient.patch<ExpenseClaim>(`/expenses/${id}/review`, data);
    return res.data;
  },

  // Holidays, Documents, Notifications, Audit Logs, Reports, Organizations
  getHolidays: async (): Promise<PaginatedResponse<HolidayRecord> | HolidayRecord[]> => {
    const res = await apiClient.get<PaginatedResponse<HolidayRecord> | HolidayRecord[]>('/holidays/');
    return res.data;
  },
  createHoliday: async (data: { name: string; date: string; holiday_type?: string; description?: string }): Promise<HolidayRecord> => {
    const res = await apiClient.post<HolidayRecord>('/holidays/', data);
    return res.data;
  },
  getMyDocuments: async (): Promise<PaginatedResponse<DocumentRecord> | DocumentRecord[]> => {
    const res = await apiClient.get<PaginatedResponse<DocumentRecord> | DocumentRecord[]>('/documents/me');
    return res.data;
  },
  getMyNotifications: async (params: Record<string, string | number | undefined> = {}): Promise<PaginatedResponse<NotificationRecord>> => {
    const res = await apiClient.get<PaginatedResponse<NotificationRecord>>('/notifications/me', { params });
    return res.data;
  },
  markAllNotificationsRead: async (): Promise<void> => {
    await apiClient.post('/notifications/mark-all-read');
  },
  sendAnnouncement: async (data: { title: string; content: string; priority?: string }): Promise<Record<string, unknown>> => {
    const res = await apiClient.post<Record<string, unknown>>('/announcements/', data);
    return res.data;
  },
  getAuditLogs: async (params: Record<string, string | number | undefined> = {}): Promise<PaginatedResponse<AuditLogRecord>> => {
    const res = await apiClient.get<PaginatedResponse<AuditLogRecord>>('/audit-logs/', { params });
    return res.data;
  },
  exportReportBlob: async (format: 'excel' | 'csv', reportType: string): Promise<Blob> => {
    const res = await apiClient.get<Blob>(`/reports/export/${format}`, {
      params: { report_type: reportType },
      responseType: 'blob',
    });
    return res.data;
  },
  getCurrentOrganization: async (): Promise<Organization> => {
    const res = await apiClient.get<Organization>('/organizations/current');
    return res.data;
  },
};
