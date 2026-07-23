import httpClient from '../../../api/httpClient';

export interface Profile {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  jobTitle?: string;
  avatarUrl?: string;
  isActive: boolean;
  twoFactorEnabled: boolean;
  preferences: {
    defaultCurrency: string;
    displayLanguage: string;
    emailNotifications: {
      weeklyExpenseSummary: boolean;
      budgetThresholdAlerts: boolean;
    };
  };
}

export const profileService = {
  getProfile: async () => {
    const response = await httpClient.get('/user/profile');
    return response.data;
  },

  updateProfile: async (payload: Partial<Profile>) => {
    const response = await httpClient.put('/user/profile', payload);
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await httpClient.post('/user/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  removeAvatar: async () => {
    const response = await httpClient.delete('/user/profile/avatar');
    return response.data;
  },

  updatePreferences: async (payload: any) => {
    const response = await httpClient.put('/user/profile/preferences', payload);
    return response.data;
  },

  updatePassword: async (payload: any) => {
    const response = await httpClient.put('/user/profile/password', payload);
    return response.data;
  },

  toggle2fa: async (enabled: boolean) => {
    const response = await httpClient.patch('/user/profile/2fa', { enabled });
    return response.data;
  },

  deactivateAccount: async (password: string) => {
    const response = await httpClient.patch('/user/profile/deactivate', { password });
    return response.data;
  }
};
