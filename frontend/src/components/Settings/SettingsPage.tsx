import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { 
  fetchSettings, 
  updateSettingsThunk, 
  backupNowThunk, 
  revokeSessionsThunk 
} from '../../features/settings/redux/settingsThunk';
import { resetSaveStatus } from '../../features/settings/redux/settingsSlice';
import { toggle2faThunk } from '../../features/profile/redux/profileThunk';
import { logout } from '../../features/auth/redux/authSlice';
import toast from 'react-hot-toast';
import { Card } from '../ui/Card';
import { Palette, Bell, Shield, Download, CheckCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export const SettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, saveStatus, lastBackup } = useSelector((state: RootState) => state.settings);
  const profile = useSelector((state: RootState) => state.profile.data);
  const { theme, setTheme } = useTheme();

  const [localSettings, setLocalSettings] = useState<any>(null);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setLocalSettings(data);
      // Sync theme context if different
      if (data.appearance.theme !== theme && (data.appearance.theme === 'light' || data.appearance.theme === 'dark')) {
        if (data.appearance.theme !== theme) {
           setTheme(data.appearance.theme);
        }
      }
      
      if (data.appearance.compactMode) {
        document.body.classList.add('compact-mode');
      } else {
        document.body.classList.remove('compact-mode');
      }
    }
  }, [data]);

  useEffect(() => {
    if (saveStatus === 'saved') {
      toast.success('Settings updated');
      setTimeout(() => dispatch(resetSaveStatus()), 2000);
    }
    if (saveStatus === 'error') {
      toast.error('Failed to update settings');
      setTimeout(() => dispatch(resetSaveStatus()), 2000);
    }
  }, [saveStatus, dispatch]);

  const handleUpdate = (section: string, field: string, value: any) => {
    const updated = {
      ...localSettings,
      [section]: {
        ...localSettings[section],
        [field]: value
      }
    };
    setLocalSettings(updated);
    // Auto-save
    dispatch(updateSettingsThunk({ [section]: updated[section] }));
  };

  const handleRevoke = async () => {
    const resultAction = await dispatch(revokeSessionsThunk());
    if (revokeSessionsThunk.fulfilled.match(resultAction)) {
      toast.success('Sessions revoked. You will be logged out.');
      setShowRevokeModal(false);
      dispatch(logout());
      navigate('/login');
    }
  };

  const handleBackup = async () => {
    const resultAction = await dispatch(backupNowThunk());
    if (backupNowThunk.fulfilled.match(resultAction)) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resultAction.payload.data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", `spendwise-backup-${new Date().toISOString()}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast.success('Backup downloaded');
    }
  };

  const handleDiscard = () => {
    if (data) setLocalSettings(data);
  };

  if (!localSettings) return <div className="p-6">Loading settings...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workspace Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Appearance */}
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <Palette className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleUpdate('appearance', 'theme', 'light')}
                    className={`flex-1 py-2 px-4 rounded-md border text-sm font-medium ${localSettings.appearance.theme === 'light' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400' : 'border-gray-300 text-gray-700 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300'}`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => handleUpdate('appearance', 'theme', 'dark')}
                    className={`flex-1 py-2 px-4 rounded-md border text-sm font-medium ${localSettings.appearance.theme === 'dark' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400' : 'border-gray-300 text-gray-700 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300'}`}
                  >
                    Dark
                  </button>
                  <button 
                    onClick={() => handleUpdate('appearance', 'theme', 'system')}
                    className={`flex-1 py-2 px-4 rounded-md border text-sm font-medium ${localSettings.appearance.theme === 'system' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400' : 'border-gray-300 text-gray-700 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300'}`}
                  >
                    System
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Compact Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reduce padding and spacing in the UI</p>
                </div>
                <button 
                  onClick={() => handleUpdate('appearance', 'compactMode', !localSettings.appearance.compactMode)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${localSettings.appearance.compactMode ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${localSettings.appearance.compactMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <Bell className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notification Channels</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
                <button 
                  onClick={() => handleUpdate('notifications', 'email', !localSettings.notifications.email)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${localSettings.notifications.email ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${localSettings.notifications.email ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Push Notifications</span>
                <button 
                  onClick={() => handleUpdate('notifications', 'push', !localSettings.notifications.push)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${localSettings.notifications.push ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${localSettings.notifications.push ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">SMS Notifications</span>
                <button 
                  onClick={() => handleUpdate('notifications', 'sms', !localSettings.notifications.sms)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${localSettings.notifications.sms ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${localSettings.notifications.sms ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* Data Management */}
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <Download className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Data Management</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Export Data</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Download a JSON backup of your data.</p>
                  {lastBackup && (
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Last backup: {new Date(lastBackup).toLocaleString()}
                    </p>
                  )}
                </div>
                <button 
                  onClick={handleBackup}
                  disabled={loading.backup}
                  className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading.backup ? 'Backing up...' : 'Backup Now'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg opacity-60">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Restore Data</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Import data from a backup file.</p>
                </div>
                <button 
                  onClick={() => toast('Restore feature coming soon', { icon: '🚧' })}
                  className="px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Restore
                </button>
              </div>
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <Shield className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Privacy & Security</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Visibility</label>
                <select 
                  value={localSettings.privacy.profileVisibility} 
                  onChange={(e) => handleUpdate('privacy', 'profileVisibility', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                >
                  <option value="internal_only">Internal (Workspace Members)</option>
                  <option value="private">Private (Only Me)</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-slate-700">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                  <div className="mt-1">
                    {profile?.twoFactorEnabled ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Enabled</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">Disabled</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/profile')}
                  className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center"
                >
                  Configure <ExternalLink className="h-3 w-3 ml-1" />
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                <button 
                  onClick={() => setShowRevokeModal(true)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" /> Revoke all other sessions
                </button>
              </div>
            </div>
          </Card>

          {/* Privacy Compliance */}
          <Card className="p-6 bg-gray-50 dark:bg-slate-800/50 border-none shadow-none">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Privacy Compliance</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              Your data is encrypted using AES-256 standard and stored in compliance with GDPR and CCPA guidelines. You retain full ownership of your data.
            </p>
            <div className="flex space-x-4">
              <button onClick={() => toast('Audit logs coming soon', { icon: '📄' })} className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-medium">View Audit Logs</button>
              <button onClick={() => toast('Terms available in app footer', { icon: '⚖️' })} className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-medium">Legal Terms</button>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10 shadow-lg">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          SpendWise v1.0.0 &bull; All changes autosaved
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleDiscard}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            Discard Changes
          </button>
          <button 
            onClick={() => dispatch(updateSettingsThunk(localSettings))}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Revoke Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revoke All Sessions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This will sign you out of all other devices and require you to log in again on this device. Are you sure you want to proceed?
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowRevokeModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button 
                onClick={handleRevoke}
                disabled={loading.revoke}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading.revoke ? 'Revoking...' : 'Revoke Sessions'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
