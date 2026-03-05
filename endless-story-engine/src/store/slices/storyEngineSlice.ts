/**
 * Story Engine Redux Slice
 * Manages state for the AI Story Engine integration
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { StoryEngineConfig, GenerationResult } from '../../services/storyEngine';

export interface StoryEngineState {
  config: StoryEngineConfig;
  isGenerating: boolean;
  currentChapter: number;
  currentWorld: 'real' | 'vr';
  generatedChapters: GenerationResult[];
  syncLevel: number;
  bleedEffects: string[];
  narrativeState: {
    arcType: string;
    intensity: number;
    emotionalTone: number;
    conflictLevel: number;
  };
  characterMotivations: { [key: string]: string };
  worldState: {
    realWorld: {
      environmentalConditions: string;
      timeOfDay: string;
      weather: string;
    };
    vrWorld: {
      currentZone: string;
      stability: number;
      systemLevel: number;
    };
  };
  pendingStatMerges: { stat: string; amount: number; source: 'real' | 'vr' }[];
  qualitySettings: {
    threshold: number;
    autoRewrite: boolean;
    showSuggestions: boolean;
  };
}

const initialState: StoryEngineState = {
  config: {
    pacing: 5,
    tone: 'neutral',
    tension: 5,
    worldLogic: true,
    characterIntelligence: 80,
    consistencyScore: 75,
    qualityThreshold: 70,
    statMergeEnabled: true,
  },
  isGenerating: false,
  currentChapter: 1,
  currentWorld: 'real',
  generatedChapters: [],
  syncLevel: 0,
  bleedEffects: [],
  narrativeState: {
    arcType: 'setup',
    intensity: 3,
    emotionalTone: 5,
    conflictLevel: 3,
  },
  characterMotivations: {
    Kael: 'Save sister Yuna from mysterious coma',
    Yuna: 'Guide Kael from within the VR world',
    Alex: 'Support Kael through the crisis',
  },
  worldState: {
    realWorld: {
      environmentalConditions: 'Urban environment, overcast sky',
      timeOfDay: 'evening',
      weather: 'cloudy',
    },
    vrWorld: {
      currentZone: 'Starting Zone',
      stability: 100,
      systemLevel: 50,
    },
  },
  pendingStatMerges: [],
  qualitySettings: {
    threshold: 70,
    autoRewrite: false,
    showSuggestions: true,
  },
};

const storyEngineSlice = createSlice({
  name: 'storyEngine',
  initialState,
  reducers: {
    // Update configuration
    updateConfig: (state, action: PayloadAction<Partial<StoryEngineConfig>>) => {
      state.config = { ...state.config, ...action.payload };
    },

    // Set generation state
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },

    // Set current chapter
    setCurrentChapter: (state, action: PayloadAction<number>) => {
      state.currentChapter = action.payload;
    },

    // Set current world
    setCurrentWorld: (state, action: PayloadAction<'real' | 'vr'>) => {
      state.currentWorld = action.payload;
    },

    // Add generated chapter
    addGeneratedChapter: (state, action: PayloadAction<GenerationResult>) => {
      state.generatedChapters.push(action.payload);
    },

    // Clear generated chapters
    clearGeneratedChapters: (state) => {
      state.generatedChapters = [];
    },

    // Update sync level
    updateSyncLevel: (state, action: PayloadAction<number>) => {
      state.syncLevel = Math.max(0, Math.min(100, action.payload));
    },

    // Add bleed effect
    addBleedEffect: (state, action: PayloadAction<string>) => {
      state.bleedEffects.push(action.payload);
    },

    // Clear bleed effects
    clearBleedEffects: (state) => {
      state.bleedEffects = [];
    },

    // Update narrative state
    updateNarrativeState: (state, action: PayloadAction<Partial<StoryEngineState['narrativeState']>>) => {
      state.narrativeState = { ...state.narrativeState, ...action.payload };
    },

    // Update character motivation
    updateCharacterMotivation: (state, action: PayloadAction<{ character: string; motivation: string }>) => {
      state.characterMotivations[action.payload.character] = action.payload.motivation;
    },

    // Update real world state
    updateRealWorldState: (state, action: PayloadAction<Partial<StoryEngineState['worldState']['realWorld']>>) => {
      state.worldState.realWorld = { ...state.worldState.realWorld, ...action.payload };
    },

    // Update VR world state
    updateVRWorldState: (state, action: PayloadAction<Partial<StoryEngineState['worldState']['vrWorld']>>) => {
      state.worldState.vrWorld = { ...state.worldState.vrWorld, ...action.payload };
    },

    // Add pending stat merge
    addPendingStatMerge: (state, action: PayloadAction<{ stat: string; amount: number; source: 'real' | 'vr' }>) => {
      state.pendingStatMerges.push(action.payload);
    },

    // Clear pending stat merges
    clearPendingStatMerges: (state) => {
      state.pendingStatMerges = [];
    },

    // Update quality settings
    updateQualitySettings: (state, action: PayloadAction<Partial<StoryEngineState['qualitySettings']>>) => {
      state.qualitySettings = { ...state.qualitySettings, ...action.payload };
    },

    // Reset story engine state
    resetStoryEngine: (state) => {
      return {
        ...initialState,
        config: state.config, // Keep configuration
        qualitySettings: state.qualitySettings, // Keep quality settings
      };
    },
  },
});

export const {
  updateConfig,
  setGenerating,
  setCurrentChapter,
  setCurrentWorld,
  addGeneratedChapter,
  clearGeneratedChapters,
  updateSyncLevel,
  addBleedEffect,
  clearBleedEffects,
  updateNarrativeState,
  updateCharacterMotivation,
  updateRealWorldState,
  updateVRWorldState,
  addPendingStatMerge,
  clearPendingStatMerges,
  updateQualitySettings,
  resetStoryEngine,
} = storyEngineSlice.actions;

export default storyEngineSlice.reducer;