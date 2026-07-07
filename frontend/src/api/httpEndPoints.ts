export const UserEndpoints = {
  auth: { 
    login: '/auth/login', 
    refresh: '/auth/refresh', 
    logout: '/auth/logout' 
  },
  dashboard: { 
    summary: '/user/dashboard/summary', 
    incomeVsExpense: '/user/dashboard/income-vs-expense', 
    spendingByCategory: '/user/dashboard/spending-by-category',
    recentTransactions: '/user/dashboard/recent-transactions',
    budgetProgress: '/user/dashboard/budget-progress'
  },
  income: { 
    list: '/user/income', 
    create: '/user/income', 
    update: (id: string) => `/user/income/${id}`, 
    delete: (id: string) => `/user/income/${id}` 
  },
  expenses: { 
    list: '/user/expenses', 
    create: '/user/expenses', 
    update: (id: string) => `/user/expenses/${id}`, 
    delete: (id: string) => `/user/expenses/${id}` 
  },
  transactions: { 
    list: '/user/transactions' 
  },
  budget: { 
    list: '/user/budget', 
    update: (id: string) => `/user/budget/${id}` 
  },
  categories: { 
    list: '/user/categories', 
    create: '/user/categories' 
  },
  reports: { 
    generate: '/user/reports/generate', 
    list: '/user/reports' 
  },
  notifications: { 
    list: '/user/notifications', 
    markRead: (id: string) => `/user/notifications/${id}/read`, 
    markAllRead: '/user/notifications/read-all' 
  },
  profile: { 
    get: '/user/profile', 
    update: '/user/profile', 
    updatePassword: '/user/profile/password' 
  },
  settings: { 
    get: '/user/settings', 
    update: '/user/settings' 
  },
};

export const AdminEndpoints = {
  dashboard: { summary: '/admin/dashboard/summary' },
  users: { 
    list: '/admin/users', 
    detail: (id: string) => `/admin/users/${id}`, 
    deactivate: (id: string) => `/admin/users/${id}/deactivate`, 
    delete: (id: string) => `/admin/users/${id}` 
  },
  notifications: { broadcast: '/admin/notifications/broadcast' },
  reports: { generate: '/admin/reports/generate' },
  settings: { get: '/admin/settings', update: '/admin/settings' },
};
