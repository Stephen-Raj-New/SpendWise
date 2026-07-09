import httpClients from '../../../api/httpClient';
import { UserEndpoints } from '../../../api/httpEndPoints';

export interface Transaction {
  _id: string;
  userId: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  status: string;
}

export interface TransactionListResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const transactionService = {
  getTransactionList: async (params?: any) => {
    const response = await httpClients.get<TransactionListResponse>(UserEndpoints.transactions.list, { params });
    return response.data;
  },

  exportTransactionCsv: async (params?: any) => {
    const response = await httpClients.get(`${UserEndpoints.transactions.list}/export`, {
      params,
      responseType: 'blob',
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions-export.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }
};
