import httpClients from '../../../api/httpClient';
import { UserEndpoints } from '../../../api/httpEndPoints';

export interface Budget {
  _id: string;
  userId: string;
  category: string;
  limit: number;
  spent: number;
  month: string;
}

export interface SetBudgetPayload {
  category: string;
  limit: number;
  month: string;
}

export const budgetService = {
  getBudgets: async (query?: any) => {
    const response = await httpClients.get<Budget[]>(UserEndpoints.budget.list, { params: query });
    return response.data;
  },

  setBudget: async (payload: SetBudgetPayload) => {
    const response = await httpClients.post<Budget>(UserEndpoints.budget.list, payload);
    return response.data;
  },

  deleteBudget: async (id: string) => {
    const response = await httpClients.delete<{ success: boolean }>(UserEndpoints.budget.update(id));
    return response.data;
  },
};
