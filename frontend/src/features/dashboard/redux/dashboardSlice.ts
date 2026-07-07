import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDashboardSummary,
  fetchIncomeVsExpense,
  fetchSpendingByCategory,
  fetchRecentTransactions,
  fetchBudgetProgress,
} from './dashboardThunk';
import type {
  DashboardSummary,
  IncomeVsExpenseData,
  CategorySpendingData,
  PaginatedTransactions,
  BudgetProgressData,
} from '../services/dashboardService';

interface DashboardState {
  summary: { data: DashboardSummary | null; loading: boolean; error: string | null };
  incomeVsExpense: { data: IncomeVsExpenseData[]; loading: boolean; error: string | null };
  spendingByCategory: { data: CategorySpendingData[]; loading: boolean; error: string | null };
  recentTransactions: { data: PaginatedTransactions | null; loading: boolean; error: string | null };
  budgetProgress: { data: BudgetProgressData[]; loading: boolean; error: string | null };
}

const initialState: DashboardState = {
  summary: { data: null, loading: false, error: null },
  incomeVsExpense: { data: [], loading: false, error: null },
  spendingByCategory: { data: [], loading: false, error: null },
  recentTransactions: { data: null, loading: false, error: null },
  budgetProgress: { data: [], loading: false, error: null },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchDashboardSummary.pending, (state) => { state.summary.loading = true; state.summary.error = null; })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => { state.summary.loading = false; state.summary.data = action.payload; })
      .addCase(fetchDashboardSummary.rejected, (state, action) => { state.summary.loading = false; state.summary.error = action.error.message || 'Failed'; })
      
      // Income Vs Expense
      .addCase(fetchIncomeVsExpense.pending, (state) => { state.incomeVsExpense.loading = true; })
      .addCase(fetchIncomeVsExpense.fulfilled, (state, action) => { state.incomeVsExpense.loading = false; state.incomeVsExpense.data = action.payload; })
      .addCase(fetchIncomeVsExpense.rejected, (state, action) => { state.incomeVsExpense.loading = false; state.incomeVsExpense.error = action.error.message || 'Failed'; })
      
      // Spending By Category
      .addCase(fetchSpendingByCategory.pending, (state) => { state.spendingByCategory.loading = true; })
      .addCase(fetchSpendingByCategory.fulfilled, (state, action) => { state.spendingByCategory.loading = false; state.spendingByCategory.data = action.payload; })
      .addCase(fetchSpendingByCategory.rejected, (state, action) => { state.spendingByCategory.loading = false; state.spendingByCategory.error = action.error.message || 'Failed'; })
      
      // Recent Transactions
      .addCase(fetchRecentTransactions.pending, (state) => { state.recentTransactions.loading = true; })
      .addCase(fetchRecentTransactions.fulfilled, (state, action) => { state.recentTransactions.loading = false; state.recentTransactions.data = action.payload; })
      .addCase(fetchRecentTransactions.rejected, (state, action) => { state.recentTransactions.loading = false; state.recentTransactions.error = action.error.message || 'Failed'; })
      
      // Budget Progress
      .addCase(fetchBudgetProgress.pending, (state) => { state.budgetProgress.loading = true; })
      .addCase(fetchBudgetProgress.fulfilled, (state, action) => { state.budgetProgress.loading = false; state.budgetProgress.data = action.payload; })
      .addCase(fetchBudgetProgress.rejected, (state, action) => { state.budgetProgress.loading = false; state.budgetProgress.error = action.error.message || 'Failed'; });
  },
});

export default dashboardSlice.reducer;
