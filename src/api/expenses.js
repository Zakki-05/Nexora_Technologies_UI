import api from './client';

// Local storage persistent fallback key
const EXPENSES_STORAGE_KEY = 'nexora_ems_expenses_data';

const getStoredExpenses = () => {
  try {
    const raw = localStorage.getItem(EXPENSES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored expenses', e);
  }
  // Initial seed claims for realistic enterprise experience
  return [
    {
      id: 1,
      employee_id: 55,
      employee_name: 'Afreen Sultana',
      employee_code: 'EMP-1055',
      department: 'Customer Support',
      title: 'Broadband Internet & Remote Work Allowance',
      category: 'SOFTWARE',
      amount: 1500.0,
      approved_amount: 1500.0,
      expense_date: '2026-11-20',
      status: 'APPROVED',
      notes: 'Monthly high-speed fiber connection for remote shift support.',
      reviewer_remarks: 'Approved per corporate work-from-home policy.',
      created_at: '2026-11-20T10:30:00Z',
    },
    {
      id: 2,
      employee_id: 5,
      employee_name: 'Zakki Adnan',
      employee_code: 'EMP-1005',
      department: 'Engineering',
      title: 'Cloud DevOps Architecture Certification Exam',
      category: 'TRAINING',
      amount: 14200.0,
      approved_amount: 14200.0,
      expense_date: '2026-11-18',
      status: 'APPROVED',
      notes: 'Professional certification fee under engineering upskilling allowance.',
      reviewer_remarks: 'Approved by Engineering Directorate.',
      created_at: '2026-11-18T14:15:00Z',
    },
    {
      id: 3,
      employee_id: 3,
      employee_name: 'John Doe',
      employee_code: 'EMP-1001',
      department: 'Engineering',
      title: 'Client Onsite Travel & Taxi Reimbursement',
      category: 'TRAVEL',
      amount: 3250.0,
      approved_amount: null,
      expense_date: '2026-11-25',
      status: 'PENDING',
      notes: 'Airport cab and local travel for client integration meeting.',
      reviewer_remarks: null,
      created_at: '2026-11-25T16:00:00Z',
    },
  ];
};

const saveStoredExpenses = (expenses) => {
  try {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.error('Failed to save expenses', e);
  }
};

export const expenseApi = {
  // Get all claims (with optional filters)
  getAll: async (params = {}) => {
    // Try backend first if endpoint exists, fallback gracefully to persistent storage
    try {
      const res = await api.get('/expenses', { params });
      return res.data;
    } catch {
      let items = getStoredExpenses();
      if (params.status) {
        items = items.filter((x) => x.status === params.status);
      }
      if (params.category) {
        items = items.filter((x) => x.category === params.category);
      }
      if (params.employee_id) {
        items = items.filter((x) => x.employee_id === parseInt(params.employee_id, 10));
      }
      return {
        items,
        total: items.length,
        total_amount: items.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0),
        approved_amount: items
          .filter((x) => x.status === 'APPROVED')
          .reduce((acc, curr) => acc + (parseFloat(curr.approved_amount || curr.amount) || 0), 0),
        pending_amount: items
          .filter((x) => x.status === 'PENDING')
          .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0),
      };
    }
  },

  // Submit a new expense claim
  submit: async (claimData) => {
    try {
      const res = await api.post('/expenses', claimData);
      return res.data;
    } catch {
      const items = getStoredExpenses();
      const newClaim = {
        id: Date.now(),
        employee_id: claimData.employee_id || 1,
        employee_name: claimData.employee_name || 'Current User',
        employee_code: claimData.employee_code || 'EMP-1001',
        department: claimData.department || 'General',
        title: claimData.title,
        category: claimData.category,
        amount: parseFloat(claimData.amount),
        approved_amount: null,
        expense_date: claimData.expense_date,
        status: 'PENDING',
        notes: claimData.notes || '',
        receipt_name: claimData.receipt_name || null,
        reviewer_remarks: null,
        created_at: new Date().toISOString(),
      };
      items.unshift(newClaim);
      saveStoredExpenses(items);
      return newClaim;
    }
  },

  // Admin Review (Approve / Reject)
  review: async (claimId, { status, approved_amount, remarks }) => {
    try {
      const res = await api.patch(`/expenses/${claimId}/review`, { status, approved_amount, remarks });
      return res.data;
    } catch {
      const items = getStoredExpenses();
      const idx = items.findIndex((x) => x.id === claimId);
      if (idx !== -1) {
        items[idx].status = status;
        items[idx].approved_amount = status === 'APPROVED' ? parseFloat(approved_amount || items[idx].amount) : 0;
        items[idx].reviewer_remarks = remarks || null;
        items[idx].reviewed_at = new Date().toISOString();
        saveStoredExpenses(items);
        return items[idx];
      }
      throw new Error('Expense claim not found');
    }
  },

  // Delete an unapproved claim
  delete: async (claimId) => {
    try {
      await api.delete(`/expenses/${claimId}`);
    } catch {
      const items = getStoredExpenses();
      const filtered = items.filter((x) => x.id !== claimId);
      saveStoredExpenses(filtered);
    }
  },
};
