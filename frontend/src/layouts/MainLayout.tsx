import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../slices/authSlice';
import { disconnectSocket } from '../services/socket';
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

const MainLayout = () => {
  const role = useSelector((state: RootState) => state.auth.role);
  const dispatch = useDispatch();

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
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">ExpensePro</h1>
          <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
            {role === 'admin' ? 'Admin Panel' : 'User Portal'}
          </p>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
