import { createAsyncThunk } from '@reduxjs/toolkit';
import { budgetService, type SetBudgetPayload } from '../services/budgetService';
import { setLoading, setError, setBudgets } from './budgetSlice';

export const fetchBudgets = createAsyncThunk(
  'budget/fetchBudgets',
  async (month: string | undefined, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const data = await budgetService.getBudgets(month);
      dispatch(setBudgets(data));
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch budgets';
      dispatch(setError(message));
      return rejectWithValue(message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const setBudgetThunk = createAsyncThunk(
  'budget/setBudget',
  async (payload: SetBudgetPayload, { rejectWithValue }) => {
    try {
      const data = await budgetService.setBudget(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set budget');
    }
  }
);

export const deleteBudgetThunk = createAsyncThunk(
  'budget/deleteBudget',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await budgetService.deleteBudget(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete budget');
    }
  }
);
