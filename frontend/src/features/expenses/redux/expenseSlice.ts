import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { 
  fetchExpenseSummary, 
  fetchCategoryDistribution, 
  fetchExpenseList, 
  createExpense, 
  updateExpense, 
  deleteExpense 
} from './expenseThunk';
import type { Expense, ExpenseSummary, CategoryDistribution, ExpenseListResponse } from '../services/expenseService';

interface ExpenseState {
  filters: {
    dateFrom?: string;
    dateTo?: string;
    range: string;
    year?: number;
    month?: number;
    quarter?: number;
  };
  summary: ExpenseSummary | null;
  distribution: CategoryDistribution[];
  list: ExpenseListResponse;
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  summary: null,
  distribution: [],
  list: { data: [], total: 0, page: 1, limit: 10, totalPages: 0 },
  loading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearExpenseError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchExpenseSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseSummary.fulfilled, (state, action: PayloadAction<ExpenseSummary>) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchExpenseSummary.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Distribution
      .addCase(fetchCategoryDistribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryDistribution.fulfilled, (state, action: PayloadAction<CategoryDistribution[]>) => {
        state.loading = false;
        state.distribution = action.payload;
      })
      .addCase(fetchCategoryDistribution.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // List
      .addCase(fetchExpenseList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseList.fulfilled, (state, action: PayloadAction<ExpenseListResponse>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchExpenseList.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
        state.list.data.unshift(action.payload);
        state.list.total += 1;
      })
      // Update
      .addCase(updateExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
        const index = state.list.data.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.list.data[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteExpense.fulfilled, (state, action: PayloadAction<{id: string, success: boolean}>) => {
        state.list.data = state.list.data.filter((item) => item._id !== action.payload.id);
        state.list.total -= 1;
      });
  },
});

export const { clearExpenseError } = expenseSlice.actions;
export default expenseSlice.reducer;
