import { createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService, type CreateCategoryPayload } from '../services/categoryService';
import { setLoading, setError, setCategories } from './categorySlice';

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (type: string | undefined, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const data = await categoryService.getCategories(type);
      dispatch(setCategories(data));
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch categories';
      dispatch(setError(message));
      return rejectWithValue(message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createCategoryThunk = createAsyncThunk(
  'category/createCategory',
  async (payload: CreateCategoryPayload, { rejectWithValue }) => {
    try {
      const data = await categoryService.createCategory(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const deleteCategoryThunk = createAsyncThunk(
  'category/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await categoryService.deleteCategory(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);
