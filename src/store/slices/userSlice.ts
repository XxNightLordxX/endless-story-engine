import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '../../api';

interface UserState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  preferences: {
    theme: 'light' | 'dark';
    fontSize: number;
    fontFamily: 'serif' | 'sans';
    lineHeight: number;
  };
}

function loadUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem('ese_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

const savedUser = loadUser();

const initialState: UserState = {
  user: savedUser,
  isAuthenticated: !!savedUser,
  preferences: {
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
    fontSize: 18,
    fontFamily: 'sans',
    lineHeight: 1.6,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('ese_user', JSON.stringify(action.payload));
    },
    updateUserLastRead: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.lastReadChapter = Math.max(state.user.lastReadChapter, action.payload);
        localStorage.setItem('ese_user', JSON.stringify(state.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('ese_user');
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const { setUser, updateUserLastRead, logout, updatePreferences } = userSlice.actions;
export default userSlice.reducer;
