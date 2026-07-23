import { createSlice } from '@reduxjs/toolkit';
import type { Profile } from '../services/profileService';
import {
  fetchProfile,
  updateProfileThunk,
  uploadAvatarThunk,
  removeAvatarThunk,
  updatePreferencesThunk,
  updatePasswordThunk,
  toggle2faThunk,
  deactivateAccountThunk
} from './profileThunk';

interface ProfileState {
  data: Profile | null;
  loading: {
    fetch: boolean;
    update: boolean;
    avatar: boolean;
    password: boolean;
    deactivate: boolean;
  };
  error: string | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

const initialState: ProfileState = {
  data: null,
  loading: {
    fetch: false,
    update: false,
    avatar: false,
    password: false,
    deactivate: false,
  },
  error: null,
  saveStatus: 'idle'
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetSaveStatus(state) {
      state.saveStatus = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading.fetch = true;
      state.error = null;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.loading.fetch = false;
      state.data = action.payload;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading.fetch = false;
      state.error = action.payload as string;
    });

    // Update Profile
    builder.addCase(updateProfileThunk.pending, (state) => {
      state.loading.update = true;
      state.saveStatus = 'saving';
      state.error = null;
    });
    builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
      state.loading.update = false;
      state.saveStatus = 'saved';
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    });
    builder.addCase(updateProfileThunk.rejected, (state, action) => {
      state.loading.update = false;
      state.saveStatus = 'error';
      state.error = action.payload as string;
    });

    // Upload Avatar
    builder.addCase(uploadAvatarThunk.pending, (state) => {
      state.loading.avatar = true;
    });
    builder.addCase(uploadAvatarThunk.fulfilled, (state, action) => {
      state.loading.avatar = false;
      if (state.data) {
        state.data.avatarUrl = action.payload.avatarUrl;
      }
    });
    builder.addCase(uploadAvatarThunk.rejected, (state, action) => {
      state.loading.avatar = false;
      state.error = action.payload as string;
    });

    // Remove Avatar
    builder.addCase(removeAvatarThunk.pending, (state) => {
      state.loading.avatar = true;
    });
    builder.addCase(removeAvatarThunk.fulfilled, (state) => {
      state.loading.avatar = false;
      if (state.data) {
        state.data.avatarUrl = undefined;
      }
    });
    builder.addCase(removeAvatarThunk.rejected, (state, action) => {
      state.loading.avatar = false;
      state.error = action.payload as string;
    });

    // Update Preferences
    builder.addCase(updatePreferencesThunk.pending, (state) => {
      state.saveStatus = 'saving';
    });
    builder.addCase(updatePreferencesThunk.fulfilled, (state, action) => {
      state.saveStatus = 'saved';
      if (state.data) {
        state.data.preferences = action.payload;
      }
    });
    builder.addCase(updatePreferencesThunk.rejected, (state, action) => {
      state.saveStatus = 'error';
      state.error = action.payload as string;
    });

    // Update Password
    builder.addCase(updatePasswordThunk.pending, (state) => {
      state.loading.password = true;
      state.error = null;
    });
    builder.addCase(updatePasswordThunk.fulfilled, (state) => {
      state.loading.password = false;
    });
    builder.addCase(updatePasswordThunk.rejected, (state, action) => {
      state.loading.password = false;
      state.error = action.payload as string;
    });

    // Toggle 2FA
    builder.addCase(toggle2faThunk.fulfilled, (state, action) => {
      if (state.data) {
        state.data.twoFactorEnabled = action.payload.twoFactorEnabled;
      }
    });

    // Deactivate Account
    builder.addCase(deactivateAccountThunk.pending, (state) => {
      state.loading.deactivate = true;
    });
    builder.addCase(deactivateAccountThunk.fulfilled, (state) => {
      state.loading.deactivate = false;
    });
    builder.addCase(deactivateAccountThunk.rejected, (state, action) => {
      state.loading.deactivate = false;
      state.error = action.payload as string;
    });
  }
});

export const { resetSaveStatus } = profileSlice.actions;
export default profileSlice.reducer;
