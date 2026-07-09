import httpClients from "./httpClient";
import { UserEndpoints, AdminEndpoints } from "./httpEndPoints";

class Client {
  auth = {
    login: (data: any) => httpClients.post(UserEndpoints.auth.login, data),
    refresh: () => httpClients.post(UserEndpoints.auth.refresh),
    logout: () => httpClients.post(UserEndpoints.auth.logout),
  };
  
  dashboard = {
    getSummary: (query?: any) => httpClients.get(UserEndpoints.dashboard.summary, { params: query }),
    getIncomeVsExpense: (query?: any) => httpClients.get(UserEndpoints.dashboard.incomeVsExpense, { params: query }),
    getSpendingByCategory: (query?: any) => httpClients.get(UserEndpoints.dashboard.spendingByCategory, { params: query }),
    getRecentTransactions: (page: number, limit: number, query?: any) => httpClients.get(UserEndpoints.dashboard.recentTransactions, { params: { page, limit, ...query } }),
    getBudgetProgress: (query?: any) => httpClients.get(UserEndpoints.dashboard.budgetProgress, { params: query }),
  };
  
  adminDashboard = {
    getSummary: () => httpClients.get(AdminEndpoints.dashboard.summary),
  };

  // ... other domains can be added here following the same pattern
}

export default new Client();
