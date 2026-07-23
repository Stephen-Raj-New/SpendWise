import httpClients from '../../../api/httpClient';

export interface NotificationAction {
  label: string;
  actionType: string;
  payload: any;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'budget_alert' | 'bill_reminder' | 'income_received' | 'system_update' | 'expense_added';
  title: string;
  message: string;
  meta: Record<string, any>;
  isRead: boolean;
  actions: NotificationAction[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupedNotifications {
  budget_alert?: Notification[];
  bill_reminder?: Notification[];
  income_received?: Notification[];
  system_update?: Notification[];
  expense_added?: Notification[];
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

export interface GroupedNotificationsResponse {
  data: GroupedNotifications;
  unreadCount: number;
}

export const notificationsService = {
  getNotifications: async (params: { page?: number; limit?: number; type?: string; isRead?: boolean }) => {
    const response = await httpClients.get<NotificationsResponse>('/user/notifications', { params });
    return response.data;
  },

  getGroupedNotifications: async () => {
    const response = await httpClients.get<GroupedNotificationsResponse>('/user/notifications/grouped');
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await httpClients.patch<{ success: boolean }>(`/user/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await httpClients.patch<{ success: boolean }>('/user/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: string) => {
    const response = await httpClients.delete<{ success: boolean }>(`/user/notifications/${id}`);
    return response.data;
  }
};
