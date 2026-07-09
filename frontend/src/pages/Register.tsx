import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { registerService, verifyOtpService } from '../features/auth/services';
import { setCredentials } from '../features/auth/redux/authSlice';
import toast from 'react-hot-toast';

const registrationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .required('Full Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[a-z])/, 'Must contain lowercase')
    .matches(/(?=.*[A-Z])/, 'Must contain uppercase')
    .matches(/(?=.*[0-9])/, 'Must contain number')
    .matches(/(?=.*[!@#$%^&*])/, 'Must contain special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
    .required('Mobile Number is required'),
  preferredCurrency: Yup.string().required('Preferred Currency is required'),
  timeZone: Yup.string().required('Time Zone is required'),
  acceptTerms: Yup.boolean().oneOf([true], 'You must accept the Terms & Conditions'),
});

const Register = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegisterSubmit = async (values: any, { setSubmitting, setStatus }: any) => {
    try {
      const response = await registerService(values);
      setRegisteredEmail(values.email);
      setStep(2);
      
      // DEMO MODE: Show the OTP in a toast so friends can test it without backend access
      if (response.mockOtp) {
        toast.success(`Demo Mode OTP: ${response.mockOtp}`, {
          duration: 10000,
          icon: '🔑',
        });
      } else {
        toast.success('Registration successful. Please check your email/mobile for OTP.');
      }
    } catch (error: any) {
      setStatus(error.message || 'Registration failed.');
      toast.error(error.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    try {
      await verifyOtpService({ email: registeredEmail, otp });
      
      toast.success('OTP verified successfully! Please login to continue.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'OTP Verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (step === 2) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-2 text-center text-2xl font-bold text-slate-800">
            Verify OTP
          </h2>
          <p className="mb-6 text-center text-sm text-slate-600">
            We've sent a 6-digit OTP to your email and mobile number.
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Enter OTP</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-center text-lg tracking-widest focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="123456"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={isVerifying}
              className="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isVerifying ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              onClick={() => setStep(1)}
              className="w-full text-center text-sm text-slate-500 hover:text-slate-700 mt-2"
            >
              Back to Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 py-12">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-2 text-center text-2xl font-bold text-slate-800">
          Create an Account
        </h2>
        <p className="mb-6 text-center text-sm text-slate-600">
          Join ExpensePro to manage your finances seamlessly.
        </p>

        <Formik
          initialValues={{
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            mobileNumber: '',
            preferredCurrency: 'INR',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
            acceptTerms: false,
          }}
          validationSchema={registrationSchema}
          onSubmit={handleRegisterSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-4">
              {status && <div className="text-sm text-red-500 bg-red-50 p-2 rounded">{status}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
                  <Field
                    type="text"
                    name="fullName"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <ErrorMessage name="fullName" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
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

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Confirm Password</label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Mobile Number</label>
                  <Field
                    type="text"
                    name="mobileNumber"
                    maxLength={10}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <ErrorMessage name="mobileNumber" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Preferred Currency</label>
                  <Field as="select" name="preferredCurrency" className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </Field>
                  <ErrorMessage name="preferredCurrency" component="div" className="mt-1 text-xs text-red-500" />
                </div>
              </div>

              <div className="flex items-start mt-4">
                <div className="flex h-5 items-center">
                  <Field
                    type="checkbox"
                    name="acceptTerms"
                    id="acceptTerms"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="acceptTerms" className="font-medium text-slate-700">
                    I accept the Terms and Conditions
                  </label>
                  <ErrorMessage name="acceptTerms" component="div" className="mt-1 text-xs text-red-500" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
              
              <div className="mt-4 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Login here
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
