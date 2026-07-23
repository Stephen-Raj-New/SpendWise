import httpClient from '../../../api/httpClient';

export interface Settings {
  _id?: string;
  appearance: {
    theme: string;
    compactMode: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: string;
    twoFactorEnabled: boolean;
  };
}

export const settingsService = {
  getSettings: async () => {
    const response = await httpClient.get('/user/settings');
    return response.data;
  },

  updateSettings: async (payload: Partial<Settings>) => {
    const response = await httpClient.put('/user/settings', payload);
    return response.data;
  },

  backupNow: async () => {
    const response = await httpClient.post('/user/settings/backup');
    return response.data;
  },

  revokeSessions: async () => {
    const response = await httpClient.post('/user/settings/revoke-sessions');
    return response.data;
  }
};
