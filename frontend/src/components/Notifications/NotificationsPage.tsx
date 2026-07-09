import React, { useEffect, useState } from 'react';
import { useLayout } from '../../layouts/DashboardLayout';
import { Card } from '../ui/Card';
import httpClients from '../../api/httpClient';
import { UserEndpoints } from '../../api/httpEndPoints';
import { Bell, Check, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

const NotificationsPage: React.FC = () => {
  const { setNavbarProps } = useLayout();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await httpClients.get(UserEndpoints.notifications.list);
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNavbarProps({
      searchPlaceholder: 'Search notifications...',
      actionLabel: 'Mark All Read',
      onAction: async () => {
        await httpClients.patch(UserEndpoints.notifications.markAllRead);
        fetchNotifications();
      },
    });
    fetchNotifications();
  }, [setNavbarProps]);

  const markAsRead = async (id: string) => {
    await httpClients.patch(UserEndpoints.notifications.markRead(id));
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="text-green-500" />;
      case 'warning': return <AlertTriangle className="text-amber-500" />;
      case 'error': return <AlertCircle className="text-red-500" />;
      default: return <Info className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Notifications</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Stay updated with your financial alerts.</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-500 flex flex-col items-center">
            <Bell size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
            <p>You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {notifications.map((n) => (
              <div key={n._id} className={`p-4 flex gap-4 transition-colors ${n.read ? 'bg-white dark:bg-slate-800' : 'bg-blue-50 dark:bg-blue-900/10'}`}>
                <div className="flex-shrink-0 mt-1">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-semibold ${n.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-slate-100'}`}>{n.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
                  <span className="text-xs text-slate-400 dark:text-slate-500 mt-2 block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
                {!n.read && (
                  <button 
                    onClick={() => markAsRead(n._id)}
                    className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotificationsPage;
