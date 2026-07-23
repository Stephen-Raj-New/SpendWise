import { createAsyncThunk } from '@reduxjs/toolkit';
import { settingsService } from '../services/settingsService';
import type { Settings } from '../services/settingsService';

export const fetchSettings = createAsyncThunk<Settings, void>(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const data = await settingsService.getSettings();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    }
  }
);

export const updateSettingsThunk = createAsyncThunk<Settings, Partial<Settings>>(
  'settings/updateSettings',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await settingsService.updateSettings(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

export const backupNowThunk = createAsyncThunk<any, void>(
  'settings/backupNow',
  async (_, { rejectWithValue }) => {
    try {
      const data = await settingsService.backupNow();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate backup');
    }
  }
);

export const revokeSessionsThunk = createAsyncThunk<any, void>(
  'settings/revokeSessions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await settingsService.revokeSessions();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to revoke sessions');
    }
  }
);
