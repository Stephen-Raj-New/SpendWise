import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../features/auth/redux/authSlice';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Request interceptor
httpClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip auto-logout for authentication endpoints
      if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register') || originalRequest.url?.includes('/auth/verify-otp')) {
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      
      try {
        // Attempt silent refresh here if implemented on backend
        // const refreshResponse = await axios.post('/auth/refresh', ...);
        // store.dispatch(setCredentials(...));
        // originalRequest.headers.Authorization = `Bearer ${new_token}`;
        // return httpClient(originalRequest);
        
        // For now, if refresh fails or isn't fully implemented, logout:
        store.dispatch(logout());
        window.location.href = '/login';
      } catch (refreshError) {
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;
