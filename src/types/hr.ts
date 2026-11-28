export type UserRole =
  | 'PLATFORM_SUPER_ADMIN'
  | 'SUPER_ADMIN'
  | 'COMPANY_ADMIN'
  | 'ADMIN'
  | 'HR_MANAGER'
  | 'FINANCE_MANAGER'
  | 'PAYROLL_MANAGER'
  | 'DEPARTMENT_MANAGER'
  | 'AUDITOR'
  | 'EMPLOYEE';

export interface EmployeeSummary {
  id: number;
  employee_code: string;
  full_name: string;
  phone: string;
  position: string;
  department_id: number | null;
  employment_status: string;
  profile_picture?: string | null;
  pending_profile_picture?: string | null;
  profile_picture_status?: string | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole | string;
  is_active: boolean;
  organization_id?: number;
  created_at?: string;
  employee?: EmployeeSummary | null;
}

export interface AuthTokenPayload {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user?: User;
}

export interface Department {
  id: number;
  name: string;
  description?: string | null;
  employee_count?: number;
  organization_id?: number;
}

export interface Employee {
  id: number;
  employee_code: string;
  full_name: string;
  email?: string | null;
  phone: string;
  hire_date: string;
  position: string;
  salary: number | string;
  department_id: number;
  department?: Department | null;
  user_id: number;
  employment_status: string;
  gender?: string | null;
  date_of_birth?: string | null;
  address?: string | null;
  profile_picture?: string | null;
  organization_id?: number;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  company_code: string;
  contact_email?: string | null;
  timezone: string;
  subscription_plan: string;
  is_active: boolean;
}

export interface ExpenseClaim {
  id: number;
  employee_id: number;
  employee_name: string;
  employee_code: string;
  department: string;
  title: string;
  category: string;
  amount: number;
  approved_amount?: number | null;
  expense_date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string | null;
  receipt_name?: string | null;
  reviewer_remarks?: string | null;
  created_at: string;
}

export interface ExpenseListResult {
  items: ExpenseClaim[];
  total: number;
  total_amount: number;
  approved_amount: number;
  pending_amount: number;
}
