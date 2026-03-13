import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Chapter, ChapterSummary } from '../../api';

interface StoryState {
  currentChapter: Chapter | null;
  chapterList: ChapterSummary[];
  isLoading: boolean;
  error: string | null;
}

const initialState: StoryState = {
  currentChapter: null,
  chapterList: [],
  isLoading: false,
  error: null,
};

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setCurrentChapter: (state, action: PayloadAction<Chapter | null>) => {
      state.currentChapter = action.payload;
    },
    setChapterList: (state, action: PayloadAction<ChapterSummary[]>) => {
      state.chapterList = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCurrentChapter, setChapterList, setLoading, setError } = storySlice.actions;
export default storySlice.reducer;
