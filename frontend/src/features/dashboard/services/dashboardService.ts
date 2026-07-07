import Client from '../../../api';

export interface DashboardSummary {
  totalBalance: number;
  totalBalanceTrendPct: number;
  income: number;
  expenses: number;
  budgetGoal: number;
}

export interface IncomeVsExpenseData {
  label: string;
  income: number;
  expense: number;
}

export interface CategorySpendingData {
  category: string;
  amount: number;
  color: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface PaginatedTransactions {
  data: Transaction[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface BudgetProgressData {
  category: string;
  spent: number;
  limit: number;
  status: 'success' | 'warning' | 'danger';
}

export const dashboardService = {
  getSummary: async (period?: string): Promise<DashboardSummary> => {
    const res = await Client.dashboard.getSummary(period);
    return res.data;
  },
  getIncomeVsExpense: async (): Promise<IncomeVsExpenseData[]> => {
    const res = await Client.dashboard.getIncomeVsExpense();
    return res.data;
  },
  getSpendingByCategory: async (): Promise<CategorySpendingData[]> => {
    const res = await Client.dashboard.getSpendingByCategory();
    return res.data;
  },
  getRecentTransactions: async (page = 1, limit = 5): Promise<PaginatedTransactions> => {
    const res = await Client.dashboard.getRecentTransactions(page, limit);
    return res.data;
  },
  getBudgetProgress: async (): Promise<BudgetProgressData[]> => {
    const res = await Client.dashboard.getBudgetProgress();
    return res.data;
  }
};
