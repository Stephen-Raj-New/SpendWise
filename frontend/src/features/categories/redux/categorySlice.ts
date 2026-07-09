import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../services/categoryService';

interface CategoryState {
  list: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  list: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.list = action.payload;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setCategories } = categorySlice.actions;
export default categorySlice.reducer;
