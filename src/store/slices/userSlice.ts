import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, UserPreferences } from '../../types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  preferences: UserPreferences;
  readingProgress: {
    currentChapter: number;
    scrollPosition: number;
    chaptersRead: number[];
    totalWordsRead: number;
    readingStreak: number;
    lastReadAt: string;
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  fontSize: 18,
  fontFamily: 'sans',
  lineHeight: 1.6,
  letterSpacing: 0,
  readingMode: 'focus',
  autoScroll: false,
};

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  preferences: defaultPreferences,
  readingProgress: {
    currentChapter: 1,
    scrollPosition: 0,
    chaptersRead: [],
    totalWordsRead: 0,
    readingStreak: 0,
    lastReadAt: new Date().toISOString(),
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    updateReadingProgress: (state, action: PayloadAction<Partial<UserState['readingProgress']>>) => {
      state.readingProgress = {
        ...state.readingProgress,
        ...action.payload,
      };
    },
    addChapterToRead: (state, action: PayloadAction<number>) => {
      if (!state.readingProgress.chaptersRead.includes(action.payload)) {
        state.readingProgress.chaptersRead.push(action.payload);
      }
    },
    updateScrollPosition: (state, action: PayloadAction<number>) => {
      state.readingProgress.scrollPosition = action.payload;
    },
  },
});

export const {
  setUser,
  logout,
  updatePreferences,
  updateReadingProgress,
  addChapterToRead,
  updateScrollPosition,
} = userSlice.actions;

export default userSlice.reducer;