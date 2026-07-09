import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Income, IncomeSummary, SourceDistribution } from '../services/incomeService';
import { 
  fetchIncomeList, 
  fetchIncomeSummary, 
  fetchSourceDistribution,
  createIncomeThunk,
  updateIncomeThunk,
  deleteIncomeThunk
} from './incomeThunk';

interface IncomeState {
  list: Income[];
  total: number;
  page: number;
  totalPages: number;
  filters: {
    source?: string;
    category?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    range: string;
    year?: number;
    month?: number;
    quarter?: number;
  };
  summary: IncomeSummary | null;
  sourceDistribution: SourceDistribution[];
  loading: {
    list: boolean;
    summary: boolean;
    distribution: boolean;
    mutating: boolean;
  };
  error: string | null;
}

const initialState: IncomeState = {
  list: [],
  total: 0,
  page: 1,
  totalPages: 1,
  filters: {
    range: 'month',
  },
  summary: null,
  sourceDistribution: [],
  loading: {
    list: false,
    summary: false,
    distribution: false,
    mutating: false,
  },
  error: null,
};

const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<IncomeState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    resetFilters: (state) => {
      state.filters = { range: 'month' };
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchIncomeList.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(fetchIncomeList.fulfilled, (state, action) => {
        state.loading.list = false;
        state.list = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchIncomeList.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.error.message || 'Failed to fetch income list';
      })
      
      // Fetch Summary
      .addCase(fetchIncomeSummary.pending, (state) => {
        state.loading.summary = true;
      })
      .addCase(fetchIncomeSummary.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.summary = action.payload;
      })
      .addCase(fetchIncomeSummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.error = action.error.message || 'Failed to fetch summary';
      })
      
      // Fetch Distribution
      .addCase(fetchSourceDistribution.pending, (state) => {
        state.loading.distribution = true;
      })
      .addCase(fetchSourceDistribution.fulfilled, (state, action) => {
        state.loading.distribution = false;
        state.sourceDistribution = action.payload;
      })
      .addCase(fetchSourceDistribution.rejected, (state, action) => {
        state.loading.distribution = false;
        state.error = action.error.message || 'Failed to fetch distribution';
      })
      
      // Mutations
      .addCase(createIncomeThunk.pending, (state) => {
        state.loading.mutating = true;
      })
      .addCase(createIncomeThunk.fulfilled, (state) => {
        state.loading.mutating = false;
      })
      .addCase(createIncomeThunk.rejected, (state, action) => {
        state.loading.mutating = false;
        state.error = action.error.message || 'Failed to create income';
      })
      
      .addCase(updateIncomeThunk.pending, (state) => {
        state.loading.mutating = true;
      })
      .addCase(updateIncomeThunk.fulfilled, (state) => {
        state.loading.mutating = false;
      })
      .addCase(updateIncomeThunk.rejected, (state, action) => {
        state.loading.mutating = false;
        state.error = action.error.message || 'Failed to update income';
      })
      
      .addCase(deleteIncomeThunk.pending, (state) => {
        state.loading.mutating = true;
      })
      .addCase(deleteIncomeThunk.fulfilled, (state) => {
        state.loading.mutating = false;
      })
      .addCase(deleteIncomeThunk.rejected, (state, action) => {
        state.loading.mutating = false;
        state.error = action.error.message || 'Failed to delete income';
      });
  }
});

export const { setFilters, resetFilters, setPage } = incomeSlice.actions;
export default incomeSlice.reducer;
