import { createAsyncThunk } from '@reduxjs/toolkit';
import { incomeService } from '../services/incomeService';
import type { Income, IncomeSummary, SourceDistribution, IncomeListResponse } from '../services/incomeService';

export const fetchIncomeList = createAsyncThunk<IncomeListResponse, any>(
  'income/fetchList',
  async (params) => {
    return await incomeService.getIncomeList(params);
  }
);

export const fetchIncomeSummary = createAsyncThunk<IncomeSummary, string>(
  'income/fetchSummary',
  async (range) => {
    return await incomeService.getIncomeSummary(range);
  }
);

export const fetchSourceDistribution = createAsyncThunk<SourceDistribution[], string>(
  'income/fetchSourceDistribution',
  async (range) => {
    return await incomeService.getSourceDistribution(range);
  }
);

export const createIncomeThunk = createAsyncThunk<Income, Partial<Income>>(
  'income/create',
  async (payload) => {
    return await incomeService.createIncome(payload);
  }
);

export const updateIncomeThunk = createAsyncThunk<Income, { id: string; payload: Partial<Income> }>(
  'income/update',
  async ({ id, payload }) => {
    return await incomeService.updateIncome(id, payload);
  }
);

export const deleteIncomeThunk = createAsyncThunk<{ success: boolean; id: string }, string>(
  'income/delete',
  async (id) => {
    await incomeService.deleteIncome(id);
    return { success: true, id };
  }
);
