// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './components/Dashboard/DashboardPage';
import IncomePage from './components/Income/IncomePage';
import ExpensePage from './components/Expenses/ExpensePage';
import TransactionPage from './components/Transactions/TransactionPage';
import BudgetPage from './components/Budget/BudgetPage';
import CategoriesPage from './components/Categories/CategoriesPage';
import ReportsPage from './components/Reports/ReportsPage';
import NotificationsPage from './components/Notifications/NotificationsPage';
import SettingsPage from './components/Settings/SettingsPage';
import { Card } from './components/ui/Card';

// Placeholder Pages inside Card primitive
const Placeholder = ({ title }: { title: string }) => (
  <Card className="mt-4">
    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{title} Module</h2>
    <p className="text-slate-500 mt-2 dark:text-slate-400">
      Placeholder page for {title}. Content will be built in the next phase.
    </p>
  </Card>
);

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* User Routes */}
            <Route
              element={
                <ProtectedRoute role="user">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/income" element={<IncomePage />} />
              <Route path="/expenses" element={<ExpensePage />} />
              <Route path="/transactions" element={<TransactionPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<SettingsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Admin Routes */}
            <Route
              element={
                <ProtectedRoute role="admin">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<Placeholder title="Admin Dashboard" />} />
              <Route path="/admin/users" element={<Placeholder title="User Management" />} />
              <Route path="/admin/notifications" element={<Placeholder title="Admin Notifications" />} />
              <Route path="/admin/reports" element={<Placeholder title="Admin Reports" />} />
              <Route path="/admin/settings" element={<Placeholder title="Admin Settings" />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
