import { createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from '../services/dashboardService';

export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (period?: string) => {
    return await dashboardService.getSummary(period);
  }
);

export const fetchIncomeVsExpense = createAsyncThunk(
  'dashboard/fetchIncomeVsExpense',
  async () => {
    return await dashboardService.getIncomeVsExpense();
  }
);

export const fetchSpendingByCategory = createAsyncThunk(
  'dashboard/fetchSpendingByCategory',
  async () => {
    return await dashboardService.getSpendingByCategory();
  }
);

export const fetchRecentTransactions = createAsyncThunk(
  'dashboard/fetchRecentTransactions',
  async ({ page, limit }: { page?: number; limit?: number }) => {
    return await dashboardService.getRecentTransactions(page, limit);
  }
);

export const fetchBudgetProgress = createAsyncThunk(
  'dashboard/fetchBudgetProgress',
  async () => {
    return await dashboardService.getBudgetProgress();
  }
);
