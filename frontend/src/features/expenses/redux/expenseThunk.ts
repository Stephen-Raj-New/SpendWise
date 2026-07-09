import { createAsyncThunk } from '@reduxjs/toolkit';
import { expenseService } from '../services/expenseService';
import type { Expense, ExpenseSummary, CategoryDistribution } from '../services/expenseService';

export const fetchExpenseSummary = createAsyncThunk<ExpenseSummary, any>(
  'expenses/fetchSummary',
  async (query, { rejectWithValue }) => {
    try {
      const data = await expenseService.getExpenseSummary(query);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch summary');
    }
  }
);

export const fetchCategoryDistribution = createAsyncThunk<CategoryDistribution[], any>(
  'expenses/fetchCategoryDistribution',
  async (query, { rejectWithValue }) => {
    try {
      const data = await expenseService.getCategoryDistribution(query);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch distribution');
    }
  }
);

export const fetchExpenseList = createAsyncThunk(
  'expenses/fetchList',
  async (params: any, { rejectWithValue }) => {
    try {
      const data = await expenseService.getExpenseList(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch list');
    }
  }
);

export const createExpense = createAsyncThunk(
  'expenses/create',
  async (payload: Partial<Expense>, { rejectWithValue }) => {
    try {
      const data = await expenseService.createExpense(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/update',
  async ({ id, payload }: { id: string; payload: Partial<Expense> }, { rejectWithValue }) => {
    try {
      const data = await expenseService.updateExpense(id, payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await expenseService.deleteExpense(id);
      return { id, ...data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete expense');
    }
  }
);
