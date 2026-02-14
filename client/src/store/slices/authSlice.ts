import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
  _id: string;
  name : string
}

interface AuthState {
  userInfo: UserInfo | null;
}

const initialState: AuthState = {
  // Try to load user from localStorage if it exists
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')!)
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action 1: Store User Info
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // Action 2: Remove User Info (Logout)
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setUserInfo, logout } = authSlice.actions;
export default authSlice.reducer;