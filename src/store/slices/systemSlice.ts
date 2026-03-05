import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SystemScreen, WorldState, CharacterStats, Skill, Ability, Item, Quest, StatusEffect } from '../../types';

interface SystemState {
  systemScreen: SystemScreen | null;
  worldState: WorldState | null;
  stats: CharacterStats | null;
  skills: Skill[];
  abilities: Ability[];
  inventory: Item[];
  quests: Quest[];
  statusEffects: StatusEffect[];
  loading: boolean;
  error: string | null;
}

const defaultStats: CharacterStats = {
  // Core Stats
  level: 1,
  experience: 0,
  experienceToNext: 100,
  
  // Primary Stats
  strength: 10,
  agility: 10,
  vitality: 10,
  intelligence: 10,
  wisdom: 10,
  perception: 10,
  charisma: 10,
  luck: 10,
  
  // Vampire Stats
  bloodEssence: 100,
  maxBloodEssence: 100,
  vampireLevel: 0,
  regeneration: 0,
  bloodControl: 0,
  shadowMastery: 0,
  nocturnalPower: 0,
  
  // Combat Stats
  attack: 10,
  defense: 10,
  criticalRate: 5,
  criticalDamage: 150,
  
  // Resource Stats
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  stamina: 100,
  maxStamina: 100,
};

const initialState: SystemState = {
  systemScreen: null,
  worldState: null,
  stats: defaultStats,
  skills: [],
  abilities: [],
  inventory: [],
  quests: [],
  statusEffects: [],
  loading: false,
  error: null,
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setSystemScreen: (state, action: PayloadAction<SystemScreen | null>) => {
      state.systemScreen = action.payload;
      if (action.payload) {
        state.stats = action.payload.stats;
        state.skills = action.payload.skills;
        state.abilities = action.payload.abilities;
        state.inventory = action.payload.inventory;
        state.quests = action.payload.quests;
        state.statusEffects = action.payload.statusEffects;
      }
    },
    setWorldState: (state, action: PayloadAction<WorldState | null>) => {
      state.worldState = action.payload;
    },
    updateStats: (state, action: PayloadAction<Partial<CharacterStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
      }
    },
    setSkills: (state, action: PayloadAction<Skill[]>) => {
      state.skills = action.payload;
    },
    addSkill: (state, action: PayloadAction<Skill>) => {
      state.skills.push(action.payload);
    },
    updateSkill: (state, action: PayloadAction<{ id: string; updates: Partial<Skill> }>) => {
      const index = state.skills.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.skills[index] = { ...state.skills[index], ...action.payload.updates };
      }
    },
    setAbilities: (state, action: PayloadAction<Ability[]>) => {
      state.abilities = action.payload;
    },
    addAbility: (state, action: PayloadAction<Ability>) => {
      state.abilities.push(action.payload);
    },
    setInventory: (state, action: PayloadAction<Item[]>) => {
      state.inventory = action.payload;
    },
    addItem: (state, action: PayloadAction<Item>) => {
      state.inventory.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.inventory = state.inventory.filter(item => item.id !== action.payload);
    },
    setQuests: (state, action: PayloadAction<Quest[]>) => {
      state.quests = action.payload;
    },
    addQuest: (state, action: PayloadAction<Quest>) => {
      state.quests.push(action.payload);
    },
    updateQuest: (state, action: PayloadAction<{ id: string; updates: Partial<Quest> }>) => {
      const index = state.quests.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.quests[index] = { ...state.quests[index], ...action.payload.updates };
      }
    },
    setStatusEffects: (state, action: PayloadAction<StatusEffect[]>) => {
      state.statusEffects = action.payload;
    },
    addStatusEffect: (state, action: PayloadAction<StatusEffect>) => {
      state.statusEffects.push(action.payload);
    },
    removeStatusEffect: (state, action: PayloadAction<string>) => {
      state.statusEffects = state.statusEffects.filter(effect => effect.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSystemScreen,
  setWorldState,
  updateStats,
  setSkills,
  addSkill,
  updateSkill,
  setAbilities,
  addAbility,
  setInventory,
  addItem,
  removeItem,
  setQuests,
  addQuest,
  updateQuest,
  setStatusEffects,
  addStatusEffect,
  removeStatusEffect,
  setLoading,
  setError,
} = systemSlice.actions;

export default systemSlice.reducer;