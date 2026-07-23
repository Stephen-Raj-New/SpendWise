import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  role: 'user' | 'admin' | null;
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    mobileNumber?: string;
  } | null;
}

const initialState: AuthState = {
  token: null,
  role: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; role: 'user' | 'admin', user?: any }>
    ) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      if (action.payload.user) {
        state.user = action.payload.user;
      }
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
