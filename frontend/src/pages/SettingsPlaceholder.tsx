import React, { useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { useTheme } from '../contexts/ThemeContext';
import { useLayout } from '../layouts/DashboardLayout';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

const SettingsPlaceholder = () => {
  const { theme, setTheme } = useTheme();
  const { setNavbarProps } = useLayout();

  useEffect(() => {
    setNavbarProps({
      searchPlaceholder: 'Search settings...',
      actionLabel: 'Save Changes',
      onAction: () => console.log('Save Settings'),
    });
  }, [setNavbarProps]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 pb-4 mb-4 dark:border-slate-700">
          Appearance
        </h3>
        
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setTheme('light')}
            className={cn(
              'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all',
              theme === 'light' 
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-slate-200 hover:border-blue-300 dark:border-slate-700 dark:hover:border-slate-600'
            )}
          >
            <Sun size={32} className={theme === 'light' ? 'text-blue-600' : 'text-slate-400'} />
            <span className={cn('mt-2 font-medium', theme === 'light' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400')}>Light</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={cn(
              'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all',
              theme === 'dark' 
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-slate-200 hover:border-blue-300 dark:border-slate-700 dark:hover:border-slate-600'
            )}
          >
            <Moon size={32} className={theme === 'dark' ? 'text-blue-600' : 'text-slate-400'} />
            <span className={cn('mt-2 font-medium', theme === 'dark' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400')}>Dark</span>
          </button>
        </div>
      </Card>
      
      <Card>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 pb-4 mb-4 dark:border-slate-700">
          Other Settings
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          (Other settings will be implemented in the respective phase)
        </p>
      </Card>
    </div>
  );
};

export default SettingsPlaceholder;
