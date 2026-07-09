import { createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from '../services/dashboardService';

export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (query?: any) => {
    return await dashboardService.getSummary(query);
  }
);

export const fetchIncomeVsExpense = createAsyncThunk(
  'dashboard/fetchIncomeVsExpense',
  async (query?: any) => {
    return await dashboardService.getIncomeVsExpense(query);
  }
);

export const fetchSpendingByCategory = createAsyncThunk(
  'dashboard/fetchSpendingByCategory',
  async (query?: any) => {
    return await dashboardService.getSpendingByCategory(query);
  }
);

export const fetchRecentTransactions = createAsyncThunk(
  'dashboard/fetchRecentTransactions',
  async ({ page, limit, query }: { page?: number; limit?: number; query?: any }) => {
    return await dashboardService.getRecentTransactions(page, limit, query);
  }
);

export const fetchBudgetProgress = createAsyncThunk(
  'dashboard/fetchBudgetProgress',
  async (query?: any) => {
    return await dashboardService.getBudgetProgress(query);
  }
);
