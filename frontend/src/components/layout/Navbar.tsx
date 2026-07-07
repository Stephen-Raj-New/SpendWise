import React, { useState } from 'react';
import { Search, Sun, Moon, Bell, Plus, User as UserIcon, LogOut, Settings as SettingsIcon, Menu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
// ... (keeping imports intact via regex/replace carefully)
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/redux/authSlice';
import Client from '../../api';
import type { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface NavbarProps {
  searchPlaceholder?: string;
  actionLabel?: string;
  onAction?: () => void;
  onMenuClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchPlaceholder = 'Search...',
  actionLabel = 'Add Transaction',
  onAction,
  onMenuClick,
}) => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.auth.role);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    import('../../api/socket').then(({ disconnectSocket }) => disconnectSocket());
    navigate('/login');
  };

  return (
    <header className="fixed top-0 md:left-64 left-0 right-0 z-50 h-16 border-b border-slate-200 bg-white/80 px-4 sm:px-6 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
      <div className="flex h-full items-center justify-between">
        {/* Left Side: Mobile Menu & Search */}
        <div className="flex flex-1 items-center space-x-2 sm:space-x-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-blue-500 dark:focus:bg-slate-800"
            />
          </div>
          <button className="sm:hidden p-2 text-slate-500 dark:text-slate-400">
            <Search size={20} />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            onClick={() => navigate(role === 'admin' ? '/admin/notifications' : '/notifications')}
            className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-900"></span>
          </button>

          {actionLabel && (
            <button
              onClick={onAction}
              className="hidden sm:flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-1.5" />
              {actionLabel}
            </button>
          )}
          {actionLabel && (
             <button
             onClick={onAction}
             className="sm:hidden flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors"
           >
             <Plus size={16} />
           </button>
          )}

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                <UserIcon size={18} />
              </div>
              <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
                {role === 'admin' ? 'Admin' : 'User'}
              </span>
            </button>

            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50 dark:border-slate-700 dark:bg-slate-800">
                  <button
                    onClick={() => { setIsProfileOpen(false); navigate(role === 'admin' ? '/admin/settings' : '/profile'); }}
                    className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/50"
                  >
                    <UserIcon size={16} className="mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => { setIsProfileOpen(false); navigate(role === 'admin' ? '/admin/settings' : '/settings'); }}
                    className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/50"
                  >
                    <SettingsIcon size={16} className="mr-2" />
                    Settings
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
