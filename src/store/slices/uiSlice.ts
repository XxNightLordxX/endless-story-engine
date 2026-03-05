import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Toast, ToastType } from '../../types';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  toasts: Toast[];
  modalOpen: string | null;
  loading: boolean;
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: true,
  toasts: [],
  modalOpen: null,
  loading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
        if (action.payload === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id' | 'timestamp'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    setModalOpen: (state, action: PayloadAction<string | null>) => {
      state.modalOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

// Helper function to add toast
export const showToast = (type: ToastType, message: string, duration: number = 5000): PayloadAction<Omit<Toast, 'id' | 'timestamp'>> => {
  return uiSlice.actions.addToast({ type, message, duration });
};

export const {
  setTheme,
  toggleTheme,
  toggleSidebar,
  setSidebarOpen,
  addToast,
  removeToast,
  clearToasts,
  setModalOpen,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;