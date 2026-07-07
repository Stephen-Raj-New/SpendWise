import httpClients from "./httpClient";
import { UserEndpoints, AdminEndpoints } from "./httpEndPoints";

class Client {
  auth = {
    login: (data: any) => httpClients.post(UserEndpoints.auth.login, data),
    refresh: () => httpClients.post(UserEndpoints.auth.refresh),
    logout: () => httpClients.post(UserEndpoints.auth.logout),
  };
  
  dashboard = {
    getSummary: (period?: string) => httpClients.get(UserEndpoints.dashboard.summary + (period ? `?period=${period}` : '')),
    getIncomeVsExpense: () => httpClients.get(UserEndpoints.dashboard.incomeVsExpense),
    getSpendingByCategory: () => httpClients.get(UserEndpoints.dashboard.spendingByCategory),
    getRecentTransactions: (page: number, limit: number) => httpClients.get(`${UserEndpoints.dashboard.recentTransactions}?page=${page}&limit=${limit}`),
    getBudgetProgress: () => httpClients.get(UserEndpoints.dashboard.budgetProgress),
  };
  
  adminDashboard = {
    getSummary: () => httpClients.get(AdminEndpoints.dashboard.summary),
  };

  // ... other domains can be added here following the same pattern
}

export default new Client();
