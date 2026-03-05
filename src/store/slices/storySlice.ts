import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Chapter, Character, Location, Faction } from '../../types';

interface StoryState {
  currentChapter: Chapter | null;
  chapters: Chapter[];
  characters: Character[];
  locations: Location[];
  factions: Faction[];
  isLoading: boolean;
  error: string | null;
}

const initialState: StoryState = {
  currentChapter: null,
  chapters: [],
  characters: [],
  locations: [],
  factions: [],
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
    setChapters: (state, action: PayloadAction<Chapter[]>) => {
      state.chapters = action.payload;
    },
    addChapter: (state, action: PayloadAction<Chapter>) => {
      state.chapters.push(action.payload);
    },
    setCharacters: (state, action: PayloadAction<Character[]>) => {
      state.characters = action.payload;
    },
    addCharacter: (state, action: PayloadAction<Character>) => {
      state.characters.push(action.payload);
    },
    updateCharacter: (state, action: PayloadAction<{ id: string; updates: Partial<Character> }>) => {
      const index = state.characters.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.characters[index] = { ...state.characters[index], ...action.payload.updates };
      }
    },
    setLocations: (state, action: PayloadAction<Location[]>) => {
      state.locations = action.payload;
    },
    addLocation: (state, action: PayloadAction<Location>) => {
      state.locations.push(action.payload);
    },
    setFactions: (state, action: PayloadAction<Faction[]>) => {
      state.factions = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentChapter,
  setChapters,
  addChapter,
  setCharacters,
  addCharacter,
  updateCharacter,
  setLocations,
  addLocation,
  setFactions,
  setLoading,
  setError,
} = storySlice.actions;

export default storySlice.reducer;