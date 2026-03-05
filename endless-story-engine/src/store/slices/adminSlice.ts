import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Chapter, TimelineEvent, LoreEntry, StoryMetrics, SystemHealth, ReaderEngagement, User } from '../../types';

interface AdminSliceState {
  storyGeneration: {
    paused: boolean;
    speed: 'slow' | 'normal' | 'fast';
    queue: Chapter[];
    published: number;
    qualityScore: number;
  };
  storyControls: {
    pacing: number;
    tone: 'dark' | 'neutral' | 'light';
    tension: number;
    worldLogic: boolean;
  };
  systemControls: {
    diagnostics: boolean;
    statSystem: boolean;
    systemScreen: boolean;
    realityIntegration: boolean;
  };
  worldState: {
    timeline: TimelineEvent[];
    lore: LoreEntry[];
  };
  userManagement: {
    users: User[];
    activeUsers: number;
    totalUsers: number;
  };
  analytics: {
    storyMetrics: StoryMetrics;
    systemHealth: SystemHealth;
    readerEngagement: ReaderEngagement;
  };
  commands: string[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminSliceState = {
  storyGeneration: {
    paused: true,
    speed: 'normal',
    queue: [],
    published: 0,
    qualityScore: 95,
  },
  storyControls: {
    pacing: 5,
    tone: 'dark',
    tension: 6,
    worldLogic: true,
  },
  systemControls: {
    diagnostics: true,
    statSystem: true,
    systemScreen: true,
    realityIntegration: true,
  },
  worldState: {
    timeline: [],
    lore: [],
  },
  userManagement: {
    users: [],
    activeUsers: 0,
    totalUsers: 0,
  },
  analytics: {
    storyMetrics: {
      totalChapters: 0,
      totalWords: 0,
      averageChapterLength: 0,
      generationTime: 0,
      rewriteCount: 0,
      continuityScore: 100,
    },
    systemHealth: {
      generationSuccessRate: 100,
      errorCount: 0,
      resourceUsage: 25,
      performanceScore: 95,
    },
    readerEngagement: {
      totalReaders: 0,
      activeReaders: 0,
      averageSessionTime: 0,
      popularChapters: [],
      dropOffPoints: [],
    },
  },
  commands: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Story Generation Controls
    setPaused: (state, action: PayloadAction<boolean>) => {
      state.storyGeneration.paused = action.payload;
    },
    setSpeed: (state, action: PayloadAction<'slow' | 'normal' | 'fast'>) => {
      state.storyGeneration.speed = action.payload;
    },
    setQueue: (state, action: PayloadAction<Chapter[]>) => {
      state.storyGeneration.queue = action.payload;
    },
    setPublished: (state, action: PayloadAction<number>) => {
      state.storyGeneration.published = action.payload;
    },
    setQualityScore: (state, action: PayloadAction<number>) => {
      state.storyGeneration.qualityScore = action.payload;
    },
    
    // Story Controls
    setPacing: (state, action: PayloadAction<number>) => {
      state.storyControls.pacing = action.payload;
    },
    setTone: (state, action: PayloadAction<'dark' | 'neutral' | 'light'>) => {
      state.storyControls.tone = action.payload;
    },
    setTension: (state, action: PayloadAction<number>) => {
      state.storyControls.tension = action.payload;
    },
    setWorldLogic: (state, action: PayloadAction<boolean>) => {
      state.storyControls.worldLogic = action.payload;
    },
    
    // System Controls
    toggleDiagnostics: (state) => {
      state.systemControls.diagnostics = !state.systemControls.diagnostics;
    },
    toggleStatSystem: (state) => {
      state.systemControls.statSystem = !state.systemControls.statSystem;
    },
    toggleSystemScreen: (state) => {
      state.systemControls.systemScreen = !state.systemControls.systemScreen;
    },
    toggleRealityIntegration: (state) => {
      state.systemControls.realityIntegration = !state.systemControls.realityIntegration;
    },
    
    // World State
    setTimeline: (state, action: PayloadAction<TimelineEvent[]>) => {
      state.worldState.timeline = action.payload;
    },
    addTimelineEvent: (state, action: PayloadAction<TimelineEvent>) => {
      state.worldState.timeline.push(action.payload);
    },
    setLore: (state, action: PayloadAction<LoreEntry[]>) => {
      state.worldState.lore = action.payload;
    },
    addLoreEntry: (state, action: PayloadAction<LoreEntry>) => {
      state.worldState.lore.push(action.payload);
    },
    
    // User Management
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.userManagement.users = action.payload;
    },
    setActiveUsers: (state, action: PayloadAction<number>) => {
      state.userManagement.activeUsers = action.payload;
    },
    setTotalUsers: (state, action: PayloadAction<number>) => {
      state.userManagement.totalUsers = action.payload;
    },
    
    // Analytics
    setStoryMetrics: (state, action: PayloadAction<Partial<StoryMetrics>>) => {
      state.analytics.storyMetrics = { ...state.analytics.storyMetrics, ...action.payload };
    },
    setSystemHealth: (state, action: PayloadAction<Partial<SystemHealth>>) => {
      state.analytics.systemHealth = { ...state.analytics.systemHealth, ...action.payload };
    },
    setReaderEngagement: (state, action: PayloadAction<Partial<ReaderEngagement>>) => {
      state.analytics.readerEngagement = { ...state.analytics.readerEngagement, ...action.payload };
    },
    
    // Commands
    addCommand: (state, action: PayloadAction<string>) => {
      state.commands.push(action.payload);
      if (state.commands.length > 100) {
        state.commands = state.commands.slice(-100);
      }
    },
    clearCommands: (state) => {
      state.commands = [];
    },
    
    // Loading & Error
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPaused,
  setSpeed,
  setQueue,
  setPublished,
  setQualityScore,
  setPacing,
  setTone,
  setTension,
  setWorldLogic,
  toggleDiagnostics,
  toggleStatSystem,
  toggleSystemScreen,
  toggleRealityIntegration,
  setTimeline,
  addTimelineEvent,
  setLore,
  addLoreEntry,
  setUsers,
  setActiveUsers,
  setTotalUsers,
  setStoryMetrics,
  setSystemHealth,
  setReaderEngagement,
  addCommand,
  clearCommands,
  setLoading,
  setError,
} = adminSlice.actions;

export default adminSlice.reducer;