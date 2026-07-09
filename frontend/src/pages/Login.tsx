import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { setCredentials } from '../features/auth/redux/authSlice';
import { loginService } from '../features/auth/services';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const DEV_AUTOFILL = false;

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [showPassword, setShowPassword] = useState(false);
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
      const data = await loginService({ ...values, role });
      const { access_token } = data;
      const responseRole = data.role || role; 
      
      dispatch(setCredentials({ token: access_token, role: responseRole }));
      import('../api/socket').then(({ connectSocket }) => connectSocket());

      toast.success('Logged in successfully!');

      if (responseRole === 'admin') {
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
                <div className="relative">
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="mt-1 text-xs text-red-500" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>

              <div className="mt-4 text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Register
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
