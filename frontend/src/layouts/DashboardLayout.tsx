import React, { createContext, useContext, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../slices/authSlice';
import { disconnectSocket } from '../services/socket';
import { Navbar } from '../components/layout/Navbar';
import { 
  LayoutDashboard, 
  Wallet, 
  CreditCard, 
  ListOrdered, 
  PieChart, 
  Tags, 
  FileText, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Users
} from 'lucide-react';

// Context to allow pages to set Navbar properties
interface LayoutContextType {
  setNavbarProps: (props: { searchPlaceholder?: string; actionLabel?: string; onAction?: () => void }) => void;
}
export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used within DashboardLayout');
  return context;
};

const DashboardLayout = () => {
  const role = useSelector((state: RootState) => state.auth.role);
  const dispatch = useDispatch();
  
  const [navbarProps, setNavbarProps] = useState<{
    searchPlaceholder?: string;
    actionLabel?: string;
    onAction?: () => void;
  }>({});

  const handleLogout = () => {
    dispatch(logout());
    disconnectSocket();
  };

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/income', label: 'Income', icon: <Wallet size={20} /> },
    { to: '/expenses', label: 'Expenses', icon: <CreditCard size={20} /> },
    { to: '/transactions', label: 'Transactions', icon: <ListOrdered size={20} /> },
    { to: '/budget', label: 'Budget', icon: <PieChart size={20} /> },
    { to: '/categories', label: 'Categories', icon: <Tags size={20} /> },
    { to: '/reports', label: 'Reports', icon: <FileText size={20} /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { to: '/profile', label: 'Profile', icon: <User size={20} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/admin/users', label: 'User Management', icon: <Users size={20} /> },
    { to: '/admin/notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { to: '/admin/reports', label: 'Reports', icon: <FileText size={20} /> },
    { to: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <LayoutContext.Provider value={{ setNavbarProps }}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        {/* Fixed Sidebar */}
        <aside className="fixed bottom-0 left-0 top-0 z-40 w-64 border-r border-slate-200 bg-white flex flex-col dark:border-slate-700 dark:bg-slate-800">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-500">ExpensePro</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1 dark:text-slate-400">
              {role === 'admin' ? 'Admin Panel' : 'User Portal'}
            </p>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 space-y-1 pb-4 scrollbar-thin">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/40 dark:text-blue-300'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col ml-64">
          {/* Fixed Navbar */}
          <Navbar {...navbarProps} />
          
          {/* Scrollable Content with padding for navbar */}
          <main className="flex-1 pt-16 p-8 overflow-x-hidden">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default DashboardLayout;
