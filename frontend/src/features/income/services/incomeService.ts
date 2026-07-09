import httpClients from '../../../api/httpClient';
import { UserEndpoints } from '../../../api/httpEndPoints';

export interface Income {
  _id: string;
  userId: string;
  source: string;
  description?: string;
  category: 'Service Revenue' | 'Product Sales' | 'Consulting' | 'Other';
  amount: number;
  currency: string;
  date: string;
  status: 'Confirmed' | 'Processing' | 'Failed';
  createdAt: string;
  updatedAt: string;
}

export interface IncomeListResponse {
  data: Income[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IncomeSummary {
  monthlyTotal: number;
  monthlyTotalTrendPct: number;
  avgPerTransaction: number;
  topSource: {
    name: string;
    percentage: number;
  };
}

export interface SourceDistribution {
  source: string;
  amount: number;
  percentage: number;
}

export const incomeService = {
  getIncomeList: async (params?: any) => {
    const response = await httpClients.get<IncomeListResponse>(UserEndpoints.income.list, { params });
    return response.data;
  },

  getIncomeSummary: async (query: any) => {
    const response = await httpClients.get<IncomeSummary>(`${UserEndpoints.income.list}/summary`, { params: query });
    return response.data;
  },

  getSourceDistribution: async (query: any) => {
    const response = await httpClients.get<SourceDistribution[]>(`${UserEndpoints.income.list}/source-distribution`, { params: query });
    return response.data;
  },

  createIncome: async (payload: Partial<Income>) => {
    const response = await httpClients.post<Income>(UserEndpoints.income.create, payload);
    return response.data;
  },

  updateIncome: async (id: string, payload: Partial<Income>) => {
    const response = await httpClients.put<Income>(UserEndpoints.income.update(id), payload);
    return response.data;
  },

  deleteIncome: async (id: string) => {
    const response = await httpClients.delete<{ success: boolean }>(UserEndpoints.income.delete(id));
    return response.data;
  },

  exportIncomeCsv: async (params?: any) => {
    const response = await httpClients.get(`${UserEndpoints.income.list}/export`, {
      params,
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data as Blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'income-export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
