import httpClients from '../../../api/httpClient';
import { UserEndpoints } from '../../../api/httpEndPoints';

export interface Category {
  _id: string;
  userId: string;
  name: string;
  color: string;
  type: 'income' | 'expense';
}

export interface CreateCategoryPayload {
  name: string;
  color: string;
  type: 'income' | 'expense';
}

export const categoryService = {
  getCategories: async (type?: string) => {
    const response = await httpClients.get<Category[]>(UserEndpoints.categories.list, { params: { type } });
    return response.data;
  },

  createCategory: async (payload: CreateCategoryPayload) => {
    const response = await httpClients.post<Category>(UserEndpoints.categories.create, payload);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    // We'll reuse the update endpoint format but send DELETE request, or add a delete endpoint
    const response = await httpClients.delete<{ success: boolean }>(`${UserEndpoints.categories.list}/${id}`);
    return response.data;
  },
};
