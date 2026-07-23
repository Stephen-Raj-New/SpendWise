import { createSlice } from '@reduxjs/toolkit';
import type { Settings } from '../services/settingsService';
import {
  fetchSettings,
  updateSettingsThunk,
  backupNowThunk,
  revokeSessionsThunk
} from './settingsThunk';

interface SettingsState {
  data: Settings | null;
  loading: {
    fetch: boolean;
    update: boolean;
    backup: boolean;
    revoke: boolean;
  };
  error: string | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastBackup: string | null;
}

const initialState: SettingsState = {
  data: null,
  loading: {
    fetch: false,
    update: false,
    backup: false,
    revoke: false,
  },
  error: null,
  saveStatus: 'idle',
  lastBackup: null
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    resetSaveStatus(state) {
      state.saveStatus = 'idle';
      state.error = null;
    },
    setLastBackup(state, action) {
      state.lastBackup = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchSettings.pending, (state) => {
      state.loading.fetch = true;
      state.error = null;
    });
    builder.addCase(fetchSettings.fulfilled, (state, action) => {
      state.loading.fetch = false;
      state.data = action.payload;
    });
    builder.addCase(fetchSettings.rejected, (state, action) => {
      state.loading.fetch = false;
      state.error = action.payload as string;
    });

    // Update
    builder.addCase(updateSettingsThunk.pending, (state) => {
      state.saveStatus = 'saving';
      state.error = null;
    });
    builder.addCase(updateSettingsThunk.fulfilled, (state, action) => {
      state.saveStatus = 'saved';
      state.data = { ...state.data, ...action.payload };
    });
    builder.addCase(updateSettingsThunk.rejected, (state, action) => {
      state.saveStatus = 'error';
      state.error = action.payload as string;
    });

    // Backup
    builder.addCase(backupNowThunk.pending, (state) => {
      state.loading.backup = true;
      state.error = null;
    });
    builder.addCase(backupNowThunk.fulfilled, (state, action) => {
      state.loading.backup = false;
      state.lastBackup = action.payload?.data?.timestamp || new Date().toISOString();
    });
    builder.addCase(backupNowThunk.rejected, (state, action) => {
      state.loading.backup = false;
      state.error = action.payload as string;
    });

    // Revoke
    builder.addCase(revokeSessionsThunk.pending, (state) => {
      state.loading.revoke = true;
    });
    builder.addCase(revokeSessionsThunk.fulfilled, (state) => {
      state.loading.revoke = false;
    });
    builder.addCase(revokeSessionsThunk.rejected, (state, action) => {
      state.loading.revoke = false;
      state.error = action.payload as string;
    });
  }
});

export const { resetSaveStatus, setLastBackup } = settingsSlice.actions;
export default settingsSlice.reducer;
