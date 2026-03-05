import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import storyReducer from './slices/storySlice';
import systemReducer from './slices/systemSlice';
import adminReducer from './slices/adminSlice';
import uiReducer from './slices/uiSlice';
import storyEngineReducer from './slices/storyEngineSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    story: storyReducer,
    system: systemReducer,
    admin: adminReducer,
    ui: uiReducer,
    storyEngine: storyEngineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;