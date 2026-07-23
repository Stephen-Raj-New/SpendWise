import { createAsyncThunk } from '@reduxjs/toolkit';
import { notificationsService } from '../services/notificationsService';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchList',
  async (params: { page?: number; limit?: number; type?: string; isRead?: boolean }, { rejectWithValue }) => {
    try {
      return await notificationsService.getNotifications(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchGroupedNotifications = createAsyncThunk(
  'notifications/fetchGrouped',
  async (_, { rejectWithValue }) => {
    try {
      return await notificationsService.getGroupedNotifications();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch grouped notifications');
    }
  }
);

export const markAsReadThunk = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationsService.markAsRead(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllAsReadThunk = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationsService.markAllAsRead();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

export const deleteNotificationThunk = createAsyncThunk(
  'notifications/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationsService.deleteNotification(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);
