// Core Types

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  readingProgress: ReadingProgress;
  bookmarks: number[];
  lastReadChapter: number;
  preferences: UserPreferences;
}

export interface ReadingProgress {
  currentChapter: number;
  scrollPosition: number;
  chaptersRead: number[];
  totalWordsRead: number;
  readingStreak: number;
  lastReadAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
  fontFamily: 'serif' | 'sans';
  lineHeight: number;
  letterSpacing: number;
  readingMode: 'comfort' | 'focus' | 'night' | 'print';
  autoScroll: boolean;
}

// Story Engine Types

export interface Chapter {
  id: number;
  title: string;
  content: string;
  wordCount: number;
  world: 'real' | 'vr';
  createdAt: string;
  publishedAt: string;
  summary: string;
  characters: string[];
  locations: string[];
  // AI Engine extensions
  chapterNumber?: number;
}

export interface Character {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'npc';
  backstory: string;
  motivations: string[];
  relationships: CharacterRelationship[];
  currentLocation: string;
  isAlive: boolean;
  // AI Engine extensions
  stats?: CharacterStats;
}

export interface CharacterRelationship {
  targetId: string;
  targetName: string;
  relationshipType: 'ally' | 'enemy' | 'neutral' | 'family' | 'romantic';
  strength: number;
  history: string;
}

export interface Location {
  id: string;
  name: string;
  world: 'real' | 'vr';
  region: string;
  description: string;
  currentFaction?: string;
  landmarks: string[];
}

export interface Faction {
  id: string;
  name: string;
  world: 'real' | 'vr';
  territory: string[];
  influence: number;
  alignment: 'good' | 'neutral' | 'evil';
  goals: string[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  type: 'weapon' | 'armor' | 'consumable' | 'artifact' | 'misc';
  world: 'real' | 'vr';
  canExtract: boolean;
  stats?: ItemStats;
  // AI Engine extensions
  statBoosts?: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
    perception?: number;
    luck?: number;
    attack?: number;
    defense?: number;
    magicAttack?: number;
    maxHP?: number;
    maxMP?: number;
  };
  requirements?: {
    level?: number;
    strength?: number;
    dexterity?: number;
    intelligence?: number;
    [key: string]: number | undefined;
  };
  effects?: string[];
}

export interface ItemStats {
  attack?: number;
  defense?: number;
  special?: string[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  category: 'combat' | 'magic' | 'passive' | 'vampire' | 'stealth' | 'support';
  requirements: string[];
  effects: string[];
  // AI Engine extensions
  type?: 'combat' | 'magic' | 'stealth' | 'support';
  damage?: number;
  manaCost?: number;
  cooldown?: number;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  type: 'active' | 'passive';
  cooldown?: number;
  manaCost?: number;
  bloodEssenceCost?: number;
  unlockLevel: number;
  // AI Engine extensions
  level?: number;
  effects?: string[];
}

// Character Stats (23 Stats per Master Spec)

export interface CharacterStats {
  // Core Stats
  level: number;
  experience: number;
  experienceToNext: number;
  
  // Primary Stats
  strength: number;
  agility: number;
  vitality: number;
  intelligence: number;
  wisdom: number;
  perception: number;
  charisma: number;
  luck: number;
  
  // Vampire Stats
  bloodEssence: number;
  maxBloodEssence: number;
  vampireLevel: number;
  regeneration: number;
  bloodControl: number;
  shadowMastery: number;
  nocturnalPower: number;
  
  // Combat Stats
  attack: number;
  defense: number;
  criticalRate: number;
  criticalDamage: number;
  
  // Resource Stats
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stamina: number;
  maxStamina: number;
  
  // AI Engine extensions
  dexterity?: number;
  constitution?: number;
  maxHP?: number;
  maxMP?: number;
  magicAttack?: number;
}

// Type alias for AI Engine compatibility (individual stat access)
export type CharacterStat = {
  [K in keyof CharacterStats]?: CharacterStats[K];
};

// System Screen Types

export interface SystemScreen {
  stats: CharacterStats;
  skills: Skill[];
  abilities: Ability[];
  inventory: Item[];
  titles: string[];
  quests: Quest[];
  statusEffects: StatusEffect[];
  worldState: WorldState;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  status: 'active' | 'completed' | 'failed';
  priority: 'main' | 'side' | 'hidden';
}

export interface QuestObjective {
  description: string;
  progress: number;
  target: number;
  completed: boolean;
}

export interface QuestReward {
  type: 'experience' | 'gold' | 'item' | 'skill' | 'ability';
  amount: number;
  itemId?: string;
}

export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  duration: number;
  type: 'buff' | 'debuff';
  effects: { [key: string]: number };
}

export interface WorldState {
  realWorld: WorldData;
  vrWorld: WorldData;
  syncLevel: number;
  breachEvents: BreachEvent[];
}

export interface WorldData {
  currentLocation: string;
  time: string;
  weather?: string;
  activeFactions: string[];
  recentEvents: string[];
}

export interface BreachEvent {
  id: string;
  description: string;
  type: 'minor' | 'major' | 'critical';
  impact: string;
  resolved: boolean;
}

// Admin Panel Types

export interface AdminState {
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
    overview: WorldState;
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
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  description: string;
  world: 'real' | 'vr';
  characters: string[];
  impact: string;
}

export interface LoreEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  relatedEntries: string[];
  importance: 'minor' | 'major' | 'critical';
}

export interface StoryMetrics {
  totalChapters: number;
  totalWords: number;
  averageChapterLength: number;
  generationTime: number;
  rewriteCount: number;
  continuityScore: number;
}

export interface SystemHealth {
  generationSuccessRate: number;
  errorCount: number;
  resourceUsage: number;
  performanceScore: number;
}

export interface ReaderEngagement {
  totalReaders: number;
  activeReaders: number;
  averageSessionTime: number;
  popularChapters: number[];
  dropOffPoints: number[];
}

// Command Box Types

export interface Command {
  id: string;
  text: string;
  timestamp: string;
  result?: string;
  status: 'pending' | 'success' | 'error';
}

export interface CommandSuggestion {
  command: string;
  description: string;
  parameters?: Parameter[];
}

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

// Toast Notification Types

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
  timestamp: string;
}

// Redux Store Types

export interface RootState {
  user: User | null;
  story: {
    currentChapter: Chapter | null;
    chapters: Chapter[];
    characters: Character[];
    locations: Location[];
    factions: Faction[];
  };
  system: {
    systemScreen: SystemScreen | null;
    worldState: WorldState | null;
  };
  admin: AdminState | null;
  ui: {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    toasts: Toast[];
  };
}