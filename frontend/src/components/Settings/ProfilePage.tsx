import React, { useEffect, useState } from 'react';
import { useLayout } from '../../layouts/DashboardLayout';
import { Card } from '../ui/Card';
import { User, Shield, Bell, Moon } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { setNavbarProps } = useLayout();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    setNavbarProps({
      searchPlaceholder: 'Search settings...',
    });
  }, [setNavbarProps]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and details.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 space-y-1">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <User size={18} /> Profile
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <Shield size={18} /> Security
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <Bell size={18} /> Notification Preferences
          </button>
          <button 
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <Moon size={18} /> Appearance
          </button>
        </div>

        <div className="flex-1">
          <Card>
            <div className="p-2 text-center text-slate-500">
              <h3 className="text-xl font-semibold mb-2 capitalize">{activeTab} Settings</h3>
              <p>This section is a frontend placeholder.</p>
              <p className="text-sm mt-4">In a production environment, this would link to `/user/profile` and `/user/settings` endpoints.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
