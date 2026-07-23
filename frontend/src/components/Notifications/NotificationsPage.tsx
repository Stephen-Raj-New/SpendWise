import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useLayout } from '../../layouts/DashboardLayout';
import { Card } from '../ui/Card';
import { 
  fetchGroupedNotifications, 
  fetchNotifications, 
  markAsReadThunk, 
  markAllAsReadThunk, 
  deleteNotificationThunk 
} from '../../features/notifications/redux/notificationsThunk';
import { setFilters, setPage } from '../../features/notifications/redux/notificationsSlice';
import type { Notification } from '../../features/notifications/services/notificationsService';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  Landmark, 
  Rocket, 
  ArrowRight, 
  Check, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

const GroupConfig = {
  budget_alert: { label: 'BUDGET ALERTS', dot: 'bg-red-500', icon: AlertTriangle, iconBg: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  expense_added: { label: 'EXPENSES ADDED', dot: 'bg-indigo-500', icon: AlertTriangle, iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
  bill_reminder: { label: 'BILL REMINDERS', dot: 'bg-orange-600', icon: Clock, iconBg: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  income_received: { label: 'INCOME RECEIVED', dot: 'bg-blue-500', icon: Landmark, iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  system_update: { label: 'SYSTEM UPDATES', dot: 'bg-slate-500', icon: Rocket, iconBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' }
};

const NotificationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setNavbarProps } = useLayout();
  
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');
  
  const { 
    grouped, 
    list, 
    total, 
    page, 
    limit, 
    totalPages, 
    filters,
    loading 
  } = useAppSelector(state => state.notifications);

  useEffect(() => {
    setNavbarProps({}); // clear any navbar actions
    dispatch(fetchGroupedNotifications());
  }, [dispatch, setNavbarProps]);

  useEffect(() => {
    if (viewMode === 'list') {
      dispatch(fetchNotifications({ page, limit, type: filters.type, isRead: filters.isRead }));
    }
  }, [dispatch, viewMode, page, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'all') {
      dispatch(setFilters({ type: undefined, isRead: undefined }));
      setViewMode('grouped');
    } else if (val === 'unread') {
      dispatch(setFilters({ isRead: false }));
      setViewMode('list');
    } else {
      dispatch(setFilters({ type: val }));
      setViewMode('list');
    }
  };

  const handleActionClick = (action: any, notificationId: string) => {
    if (action.actionType === 'navigate') {
      navigate(action.payload);
      dispatch(markAsReadThunk(notificationId));
    }
  };

  const NotificationItem = ({ n }: { n: Notification }) => {
    const config = GroupConfig[n.type] || GroupConfig.system_update;
    const Icon = config.icon;
    
    return (
      <div className={`p-4 sm:p-5 flex gap-4 transition-colors relative border-b border-slate-100 dark:border-slate-800 last:border-0 ${n.isRead ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
        {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"></div>}
        
        <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl ${config.iconBg}`}>
          <Icon size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1 gap-2">
            <h4 className={`text-sm font-semibold truncate ${n.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-slate-100'}`}>
              {n.title}
            </h4>
            <span className="text-xs text-slate-400 whitespace-nowrap">{formatRelativeTime(n.createdAt)}</span>
          </div>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{n.message}</p>
          
          <div className="flex flex-wrap items-center gap-3">
            {n.actions && n.actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleActionClick(action, n._id)}
                className={`text-sm font-medium flex items-center transition-colors ${idx === 0 ? 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                {action.label}
                {idx === 0 && action.actionType === 'navigate' && <ArrowRight size={16} className="ml-1" />}
              </button>
            ))}
            
            <div className="flex-1"></div>
            
            <div className="flex gap-2">
              {!n.isRead && (
                <button
                  onClick={() => dispatch(markAsReadThunk(n._id))}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
              <button
                onClick={() => dispatch(deleteNotificationThunk(n._id))}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/30 dark:hover:text-red-400"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Notifications</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Stay updated with your financial alerts and reminders.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => dispatch(markAllAsReadThunk())}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Mark all as read
          </button>
          <select 
            onChange={handleFilterChange}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition-colors focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="budget_alert">Budget Alerts</option>
            <option value="expense_added">Expenses Added</option>
            <option value="bill_reminder">Bill Reminders</option>
            <option value="income_received">Income Received</option>
            <option value="system_update">System Updates</option>
          </select>
        </div>
      </div>

      {viewMode === 'grouped' ? (
        loading.grouped ? (
          <div className="py-12 text-center text-slate-500">Loading your alerts...</div>
        ) : (
          <div className="space-y-8">
            {Object.entries(GroupConfig).map(([typeKey, config]) => {
              const items = grouped[typeKey as keyof typeof grouped] || [];
              if (items.length === 0) return null;
              
              return (
                <div key={typeKey} className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <span className={`h-2 w-2 rounded-full ${config.dot}`}></span>
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                      {config.label}
                    </h3>
                  </div>
                  <Card className="p-0 overflow-hidden">
                    {items.map(n => <NotificationItem key={n._id} n={n} />)}
                  </Card>
                </div>
              );
            })}
            
            {Object.values(grouped).every(g => !g || g.length === 0) && (
              <Card className="py-16 flex flex-col items-center justify-center text-slate-500">
                <Bell size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                <p>You have no notifications yet.</p>
              </Card>
            )}
          </div>
        )
      ) : (
        <Card className="p-0 overflow-hidden">
          {loading.list ? (
            <div className="py-12 text-center text-slate-500">Loading...</div>
          ) : list.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-500">
              <Bell size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
              <p>No notifications found for this filter.</p>
            </div>
          ) : (
            <div>
              {list.map(n => <NotificationItem key={n._id} n={n} />)}
              
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
                <div>
                  Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total} alerts
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => dispatch(setPage(page - 1))}
                    className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => dispatch(setPage(page + 1))}
                    className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default NotificationsPage;
