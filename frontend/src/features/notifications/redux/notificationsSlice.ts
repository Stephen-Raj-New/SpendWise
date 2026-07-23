import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { GroupedNotifications, Notification } from '../services/notificationsService';
import { 
  fetchNotifications, 
  fetchGroupedNotifications, 
  markAsReadThunk, 
  markAllAsReadThunk, 
  deleteNotificationThunk 
} from './notificationsThunk';

interface NotificationsState {
  grouped: GroupedNotifications;
  list: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
  filters: {
    type?: string;
    isRead?: boolean;
  };
  loading: {
    list: boolean;
    grouped: boolean;
    action: boolean;
  };
  error: string | null;
}

const initialState: NotificationsState = {
  grouped: {
    budget_alert: [],
    expense_added: [],
    bill_reminder: [],
    income_received: [],
    system_update: []
  },
  list: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  unreadCount: 0,
  filters: {},
  loading: {
    list: false,
    grouped: false,
    action: false,
  },
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<NotificationsState['filters']>) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    notificationReceived(state, action: PayloadAction<Notification>) {
      const newNotification = action.payload;
      // Add to list
      state.list.unshift(newNotification);
      state.total += 1;
      
      // Add to grouped if appropriate
      if (newNotification.type && state.grouped[newNotification.type]) {
        state.grouped[newNotification.type]?.unshift(newNotification);
        // keep only top 5 in grouped
        if ((state.grouped[newNotification.type]?.length || 0) > 5) {
          state.grouped[newNotification.type]?.pop();
        }
      } else if (newNotification.type) {
        state.grouped[newNotification.type] = [newNotification];
      }
      
      if (!newNotification.isRead) {
        state.unreadCount += 1;
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch List
    builder.addCase(fetchNotifications.pending, (state) => {
      state.loading.list = true;
      state.error = null;
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.loading.list = false;
      state.list = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
      state.unreadCount = action.payload.unreadCount;
    });
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading.list = false;
      state.error = action.payload as string;
    });

    // Fetch Grouped
    builder.addCase(fetchGroupedNotifications.pending, (state) => {
      state.loading.grouped = true;
      state.error = null;
    });
    builder.addCase(fetchGroupedNotifications.fulfilled, (state, action) => {
      state.loading.grouped = false;
      state.grouped = { ...initialState.grouped, ...action.payload.data };
      state.unreadCount = action.payload.unreadCount;
    });
    builder.addCase(fetchGroupedNotifications.rejected, (state, action) => {
      state.loading.grouped = false;
      state.error = action.payload as string;
    });

    // Mark as Read
    builder.addCase(markAsReadThunk.fulfilled, (state, action) => {
      const id = action.payload;
      
      // Update in list
      const listItem = state.list.find(n => n._id === id);
      if (listItem && !listItem.isRead) {
        listItem.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      
      // Update in grouped
      Object.values(state.grouped).forEach(group => {
        if (group) {
          const groupItem = group.find((n: Notification) => n._id === id);
          if (groupItem && !groupItem.isRead) {
            groupItem.isRead = true;
            // prevent double-decrement if it was already updated in list
            if (!listItem) {
               state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
          }
        }
      });
    });

    // Mark All as Read
    builder.addCase(markAllAsReadThunk.fulfilled, (state) => {
      state.list.forEach(n => { n.isRead = true; });
      Object.values(state.grouped).forEach(group => {
        if (group) {
          group.forEach((n: Notification) => { n.isRead = true; });
        }
      });
      state.unreadCount = 0;
    });

    // Delete
    builder.addCase(deleteNotificationThunk.fulfilled, (state, action) => {
      const id = action.payload;
      
      // We don't recalculate totals nicely here, rely on a refetch if needed,
      // but for UI responsiveness we remove it.
      const listItemIndex = state.list.findIndex(n => n._id === id);
      if (listItemIndex !== -1) {
        if (!state.list[listItemIndex].isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.list.splice(listItemIndex, 1);
        state.total -= 1;
      }
      
      Object.keys(state.grouped).forEach(key => {
        const group = state.grouped[key as keyof GroupedNotifications];
        if (group) {
          const index = group.findIndex((n: Notification) => n._id === id);
          if (index !== -1) {
             if (listItemIndex === -1 && !group[index].isRead) {
                 state.unreadCount = Math.max(0, state.unreadCount - 1);
             }
             group.splice(index, 1);
          }
        }
      });
    });
  },
});

export const { setFilters, setPage, notificationReceived } = notificationsSlice.actions;
export default notificationsSlice.reducer;
