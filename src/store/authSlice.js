import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const userJson = localStorage.getItem('user');
  
  return {
    user: userJson ? JSON.parse(userJson) : null,
    accessToken: accessToken || null,
    refreshToken: refreshToken || null,
    isAuthenticated: !!accessToken,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, access, refresh } = action.payload;
      if (user) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      }
      if (access) {
        state.accessToken = access;
        state.isAuthenticated = true;
        localStorage.setItem('access_token', access);
      }
      if (refresh) {
        state.refreshToken = refresh;
        localStorage.setItem('refresh_token', refresh);
      }
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
