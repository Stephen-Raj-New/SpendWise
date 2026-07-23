import { createAsyncThunk } from '@reduxjs/toolkit';
import { profileService } from '../services/profileService';
import type { Profile } from '../services/profileService';

export const fetchProfile = createAsyncThunk<Profile, void>(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await profileService.getProfile();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfileThunk = createAsyncThunk<Profile, Partial<Profile>>(
  'profile/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await profileService.updateProfile(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadAvatarThunk = createAsyncThunk<{ avatarUrl: string }, File>(
  'profile/uploadAvatar',
  async (file, { rejectWithValue }) => {
    try {
      const data = await profileService.uploadAvatar(file);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload avatar');
    }
  }
);

export const removeAvatarThunk = createAsyncThunk(
  'profile/removeAvatar',
  async (_, { rejectWithValue }) => {
    try {
      await profileService.removeAvatar();
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove avatar');
    }
  }
);

export const updatePreferencesThunk = createAsyncThunk<any, any>(
  'profile/updatePreferences',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await profileService.updatePreferences(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update preferences');
    }
  }
);

export const updatePasswordThunk = createAsyncThunk<any, any>(
  'profile/updatePassword',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await profileService.updatePassword(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update password');
    }
  }
);

export const toggle2faThunk = createAsyncThunk<{ twoFactorEnabled: boolean }, boolean>(
  'profile/toggle2fa',
  async (enabled, { rejectWithValue }) => {
    try {
      const data = await profileService.toggle2fa(enabled);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle 2FA');
    }
  }
);

export const deactivateAccountThunk = createAsyncThunk<any, string>(
  'profile/deactivate',
  async (password, { rejectWithValue }) => {
    try {
      const data = await profileService.deactivateAccount(password);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate account');
    }
  }
);
