import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AdminState as ApiAdminState } from '../../api';

interface AdminSliceState {
  data: ApiAdminState | null;
  isGenerating: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AdminSliceState = {
  data: null,
  isGenerating: false,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminData: (state, action: PayloadAction<ApiAdminState>) => {
      state.data = action.payload;
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAdminData, setGenerating, setLoading, setError } = adminSlice.actions;
export default adminSlice.reducer;
