import httpClients from '../../../api/httpClient';
import { UserEndpoints } from '../../../api/httpEndPoints';

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  merchant: string;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseSummary {
  monthlyTotal: number;
  monthlyTotalTrendPct: number;
  avgPerTransaction: number;
  topCategory: {
    name: string;
    percentage: number;
  };
}

export interface CategoryDistribution {
  category: string;
  amount: number;
  percentage: number;
}

export interface ExpenseListResponse {
  data: Expense[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const expenseService = {
  getExpenseList: async (params?: any) => {
    const response = await httpClients.get<ExpenseListResponse>(UserEndpoints.expenses.list, { params });
    return response.data;
  },

  getExpenseSummary: async (query: any) => {
    const response = await httpClients.get<ExpenseSummary>(`${UserEndpoints.expenses.list}/summary`, { params: query });
    return response.data;
  },

  getCategoryDistribution: async (query: any) => {
    const response = await httpClients.get<CategoryDistribution[]>(`${UserEndpoints.expenses.list}/category-distribution`, { params: query });
    return response.data;
  },

  createExpense: async (payload: Partial<Expense>) => {
    const response = await httpClients.post<Expense>(UserEndpoints.expenses.create, payload);
    return response.data;
  },

  updateExpense: async (id: string, payload: Partial<Expense>) => {
    const response = await httpClients.put<Expense>(UserEndpoints.expenses.update(id), payload);
    return response.data;
  },

  deleteExpense: async (id: string) => {
    const response = await httpClients.delete<{ success: boolean }>(UserEndpoints.expenses.delete(id));
    return response.data;
  },

  exportExpenseCsv: async (params?: any) => {
    const response = await httpClients.get(`${UserEndpoints.expenses.list}/export`, {
      params,
      responseType: 'blob',
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'expenses-export.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }
};
