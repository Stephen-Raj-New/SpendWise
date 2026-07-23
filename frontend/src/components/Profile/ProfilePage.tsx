import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { 
  fetchProfile, 
  updateProfileThunk, 
  uploadAvatarThunk, 
  removeAvatarThunk, 
  updatePreferencesThunk, 
  updatePasswordThunk, 
  toggle2faThunk, 
  deactivateAccountThunk 
} from '../../features/profile/redux/profileThunk';
import { resetSaveStatus } from '../../features/profile/redux/profileSlice';
import { logout } from '../../features/auth/redux/authSlice';
import toast from 'react-hot-toast';
import { Card } from '../ui/Card';
import { User, Camera, Trash2, Lock, Shield, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name is too short'),
  jobTitle: z.string().optional(),
  mobileNumber: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, saveStatus } = useSelector((state: RootState) => state.profile);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema)
  });

  const { 
    register: registerPwd, 
    handleSubmit: handlePwdSubmit, 
    reset: resetPwd, 
    formState: { errors: pwdErrors } 
  } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  // Preferences local state
  const [prefs, setPrefs] = useState({
    defaultCurrency: 'INR',
    displayLanguage: 'en',
    emailNotifications: {
      weeklyExpenseSummary: true,
      budgetThresholdAlerts: true
    }
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      reset({
        fullName: data.fullName || '',
        jobTitle: data.jobTitle || '',
        mobileNumber: data.mobileNumber || ''
      });
      if (data.preferences) {
        setPrefs(data.preferences);
      }
    }
  }, [data, reset]);

  useEffect(() => {
    if (saveStatus === 'saved') {
      toast.success('Changes saved successfully');
      setTimeout(() => dispatch(resetSaveStatus()), 2000);
    }
    if (saveStatus === 'error') {
      toast.error('Failed to save changes');
      setTimeout(() => dispatch(resetSaveStatus()), 2000);
    }
  }, [saveStatus, dispatch]);

  const onSubmitProfile = (formData: any) => {
    dispatch(updateProfileThunk(formData));
  };

  const onSubmitPassword = async (formData: any) => {
    const resultAction = await dispatch(updatePasswordThunk(formData));
    if (updatePasswordThunk.fulfilled.match(resultAction)) {
      toast.success('Password updated successfully. Please log in again.');
      resetPwd();
      dispatch(logout());
    } else {
      toast.error(resultAction.payload as string || 'Password update failed');
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return;
      }
      dispatch(uploadAvatarThunk(file));
    }
  };

  const handleDeactivate = async () => {
    if (!deactivatePassword) return;
    const resultAction = await dispatch(deactivateAccountThunk(deactivatePassword));
    if (deactivateAccountThunk.fulfilled.match(resultAction)) {
      toast.success('Account deactivated');
      setShowDeactivateModal(false);
      dispatch(logout());
      navigate('/login');
    } else {
      toast.error(resultAction.payload as string || 'Deactivation failed');
    }
  };

  const handlePrefChange = (field: string, value: any) => {
    setPrefs(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailNotifChange = (field: string, value: boolean) => {
    setPrefs(prev => ({
      ...prev,
      emailNotifications: { ...prev.emailNotifications, [field]: value }
    }));
  };

  const savePreferences = () => {
    dispatch(updatePreferencesThunk(prefs));
  };

  if (!data) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Personal Info */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Personal Information</h2>
            
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                {data.avatarUrl ? (
                  <img src={data.avatarUrl} alt="Avatar" className="h-24 w-24 rounded-full object-cover border-4 border-indigo-50 dark:border-indigo-900/20" />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center border-4 border-indigo-50 dark:border-indigo-900/20">
                    <User className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                  </div>
                )}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarUpload} 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/gif" 
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Profile Picture</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 mt-1">PNG, JPG or GIF (max. 5MB)</p>
                {data.avatarUrl && (
                  <button 
                    onClick={() => dispatch(removeAvatarThunk())}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address (Read-only)</label>
                <input type="email" value={data.email} disabled className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-400 shadow-sm sm:text-sm px-4 py-2" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input {...register('fullName')} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2" />
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message as string}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
                  <input {...register('jobTitle')} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                  <input {...register('mobileNumber')} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2" />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={loading.update} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                  {loading.update ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </Card>

          {/* Security */}
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <Shield className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Security</h2>
            </div>
            
            <form onSubmit={handlePwdSubmit(onSubmitPassword)} className="space-y-4 mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Change Password</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                <input type="password" {...registerPwd('currentPassword')} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2" />
                {pwdErrors.currentPassword && <p className="mt-1 text-sm text-red-600">{pwdErrors.currentPassword.message as string}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                <input type="password" {...registerPwd('newPassword')} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2" />
                {pwdErrors.newPassword && <p className="mt-1 text-sm text-red-600">{pwdErrors.newPassword.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                <input type="password" {...registerPwd('confirmPassword')} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2" />
                {pwdErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{pwdErrors.confirmPassword.message as string}</p>}
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading.password} className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50">
                  {loading.password ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security to your account.</p>
              </div>
              <button 
                onClick={() => dispatch(toggle2faThunk(!data.twoFactorEnabled))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${data.twoFactorEnabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${data.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Preferences */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Currency</label>
                <select 
                  value={prefs.defaultCurrency} 
                  onChange={(e) => handlePrefChange('defaultCurrency', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Language</label>
                <select 
                  value={prefs.displayLanguage}
                  onChange={(e) => handlePrefChange('displayLanguage', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Email Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Weekly Expense Summary</span>
                    <button 
                      onClick={() => handleEmailNotifChange('weeklyExpenseSummary', !prefs.emailNotifications.weeklyExpenseSummary)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${prefs.emailNotifications.weeklyExpenseSummary ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prefs.emailNotifications.weeklyExpenseSummary ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Budget Threshold Alerts</span>
                    <button 
                      onClick={() => handleEmailNotifChange('budgetThresholdAlerts', !prefs.emailNotifications.budgetThresholdAlerts)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${prefs.emailNotifications.budgetThresholdAlerts ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prefs.emailNotifications.budgetThresholdAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button onClick={savePreferences} className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Save Preferences
                </button>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <h2 className="text-lg font-medium text-red-900 dark:text-red-400">Danger Zone</h2>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              Once you deactivate your account, you will be logged out immediately. Your data will be kept for 30 days before permanent deletion.
            </p>
            <button 
              onClick={() => setShowDeactivateModal(true)}
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Deactivate Account
            </button>
          </Card>
        </div>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Deactivation</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Please enter your password to confirm you want to deactivate this account.
            </p>
            <input 
              type="password" 
              value={deactivatePassword}
              onChange={(e) => setDeactivatePassword(e.target.value)}
              placeholder="Enter password"
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-4 py-2 mb-6" 
            />
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeactivate}
                disabled={loading.deactivate || !deactivatePassword}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading.deactivate ? 'Deactivating...' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
