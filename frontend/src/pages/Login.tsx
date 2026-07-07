import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { setCredentials } from '../slices/authSlice';
import api from '../services/api';
import { connectSocket } from '../services/socket';

const DEV_AUTOFILL = true;

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRoleToggle = (selectedRole: 'user' | 'admin') => {
    setRole(selectedRole);
  };

  const getInitialValues = () => {
    if (DEV_AUTOFILL) {
      return role === 'admin'
        ? { email: 'admin@expensepro.com', password: 'User@123' }
        : { email: 'user@expensepro.com', password: 'User@123' };
    }
    return { email: '', password: '' };
  };

  const handleSubmit = async (values: any, { setSubmitting, setStatus }: any) => {
    try {
      const response = await api.post('/auth/login', { ...values, role });
      const { access_token } = response.data;
      
      dispatch(setCredentials({ token: access_token, role }));
      connectSocket();

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      setStatus('Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-slate-800">
          Login to ExpensePro
        </h2>

        <div className="mb-6 flex rounded-lg bg-slate-100 p-1">
          <button
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              role === 'user'
                ? 'bg-white text-blue-600 shadow'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => handleRoleToggle('user')}
          >
            Login as User
          </button>
          <button
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              role === 'admin'
                ? 'bg-white text-blue-600 shadow'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => handleRoleToggle('admin')}
          >
            Login as Admin
          </button>
        </div>

        <Formik
          enableReinitialize
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-4">
              {status && <div className="text-sm text-red-500">{status}</div>}
              
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <ErrorMessage name="email" component="div" className="mt-1 text-xs text-red-500" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <ErrorMessage name="password" component="div" className="mt-1 text-xs text-red-500" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
