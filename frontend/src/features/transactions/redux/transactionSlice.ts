import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchTransactionList } from './transactionThunk';
import type { TransactionListResponse } from '../services/transactionService';

interface TransactionState {
  list: TransactionListResponse;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  list: { data: [], total: 0, page: 1, limit: 10, totalPages: 0 },
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // List
      .addCase(fetchTransactionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionList.fulfilled, (state, action: PayloadAction<TransactionListResponse>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTransactionList.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTransactionError } = transactionSlice.actions;
export default transactionSlice.reducer;
