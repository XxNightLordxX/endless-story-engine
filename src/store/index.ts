import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import storyReducer from './slices/storySlice';
import adminReducer from './slices/adminSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    story: storyReducer,
    admin: adminReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
