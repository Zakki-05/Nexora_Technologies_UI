import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminLayout, EmployeeLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { Login } from '../pages/auth/Login';
import { LandingPage } from '../pages/public/LandingPage';

// Admin Pages
import { AdminOverview } from '../pages/admin/Overview';
import { AdminEmployees } from '../pages/admin/Employees';
import { AdminDepartments } from '../pages/admin/Departments';
import { AdminAttendance } from '../pages/admin/Attendance';
import { AdminLeaves } from '../pages/admin/Leaves';
import { AdminHolidays } from '../pages/admin/Holidays';
import { AdminSalaries } from '../pages/admin/Salaries';
import { AdminReports } from '../pages/admin/Reports';
import { AdminNotifications } from '../pages/admin/Notifications';
import { AdminAuditLogs } from '../pages/admin/AuditLogs';
import { AdminSettings } from '../pages/admin/Settings';

// Employee Pages
import { EmployeeOverview } from '../pages/employee/Overview';
import { EmployeeProfile } from '../pages/employee/MyProfile';
import { EmployeeAttendance } from '../pages/employee/MyAttendance';
import { EmployeeApplyLeave } from '../pages/employee/ApplyLeave';
import { EmployeeLeaves } from '../pages/employee/MyLeaves';
import { EmployeeHolidays } from '../pages/employee/CompanyHolidays';
import { EmployeeSalary } from '../pages/employee/MySalary';
import { EmployeeDocuments } from '../pages/employee/MyDocuments';
import { EmployeeNotifications } from '../pages/employee/MyNotifications';
import { EmployeeChangePassword } from '../pages/employee/ChangePassword';

// Root Redirect Component
const RootRedirect = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/employee" replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root Path - Animated Enterprise Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Login */}
      <Route path="/login" element={<Login />} />

      {/* Admin Dashboard Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="leaves" element={<AdminLeaves />} />
          <Route path="holidays" element={<AdminHolidays />} />
          <Route path="salaries" element={<AdminSalaries />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* Employee Dashboard Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN', 'SUPER_ADMIN']} />}>
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<EmployeeOverview />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="attendance" element={<EmployeeAttendance />} />
          <Route path="apply-leave" element={<EmployeeApplyLeave />} />
          <Route path="leaves" element={<EmployeeLeaves />} />
          <Route path="holidays" element={<EmployeeHolidays />} />
          <Route path="salary" element={<EmployeeSalary />} />
          <Route path="documents" element={<EmployeeDocuments />} />
          <Route path="notifications" element={<EmployeeNotifications />} />
          <Route path="password" element={<EmployeeChangePassword />} />
        </Route>
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
