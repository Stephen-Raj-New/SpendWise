import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Budget } from '../services/budgetService';

interface BudgetState {
  list: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  list: [],
  loading: false,
  error: null,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setBudgets: (state, action: PayloadAction<Budget[]>) => {
      state.list = action.payload;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setBudgets } = budgetSlice.actions;
export default budgetSlice.reducer;
