import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Placeholder Pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
    <h2 className="text-xl font-semibold text-slate-800">{title} Module</h2>
    <p className="text-slate-500 mt-2">Placeholder page for {title}. Content will be built in the next phase.</p>
  </div>
);

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* User Routes */}
          <Route
            element={
              <ProtectedRoute role="user">
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
            <Route path="/income" element={<Placeholder title="Income" />} />
            <Route path="/expenses" element={<Placeholder title="Expenses" />} />
            <Route path="/transactions" element={<Placeholder title="Transactions" />} />
            <Route path="/budget" element={<Placeholder title="Budget" />} />
            <Route path="/categories" element={<Placeholder title="Categories" />} />
            <Route path="/reports" element={<Placeholder title="Reports" />} />
            <Route path="/notifications" element={<Placeholder title="Notifications" />} />
            <Route path="/profile" element={<Placeholder title="Profile" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute role="admin">
                <MainLayout />
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
    </Provider>
  );
};

export default App;
