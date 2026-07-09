import { createAsyncThunk } from '@reduxjs/toolkit';
import { transactionService } from '../services/transactionService';

export const fetchTransactionList = createAsyncThunk(
  'transactions/fetchList',
  async (params: any, { rejectWithValue }) => {
    try {
      const data = await transactionService.getTransactionList(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);
