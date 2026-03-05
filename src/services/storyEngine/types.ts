/**
 * Re-exported types for use by system modules
 */

export interface Chapter {
  id: number;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  world: 'real' | 'vr';
  createdAt: string;
  publishedAt: string;
  summary: string;
  characters: string[];
  locations: string[];
  themes?: string[];
  characterState?: CharacterState;
  events?: StoryEvent[];
  systemScreen?: string;
}

export interface Character {
  id: string;
  name: string;
  traits: string[];
  background: string;
  currentLevel?: number;
  skills?: string[];
  stats?: CharacterStats;
}

export interface CharacterState {
  name: string;
  currentLevel: number;
  skills: string[];
  stats: CharacterStats;
  memories: Memory[];
  emotionalState: EmotionalState;
  relationships: Map<string, number>;
}

export interface CharacterStats {
  strength: number;
  agility: number;
  intelligence: number;
  power: number;
  resilience: number;
}

export interface Memory {
  id: string;
  content: string;
  chapterCreated: number;
  emotionalWeight: number;
  worldContext: 'real' | 'vr';
}

export interface EmotionalState {
  primary: string;
  intensity: number;
  secondary: string[];
}

export interface StoryState {
  currentChapter: number;
  totalChapters: number;
  worldBalance: { real: number; vr: number };
  majorEvents: StoryEvent[];
  activePlotThreads: string[];
}

export interface StoryEvent {
  id: string;
  chapter: number;
  world: 'real' | 'vr';
  type: 'discovery' | 'battle' | 'emotional' | 'revelation' | 'transformation';
  description: string;
  impact: number;
  consequences: string[];
}

export interface PlotPoint {
  chapter: number;
  description: string;
  resolved: boolean;
}

export interface NarrativeTone {
  pacing: number;
  tension: number;
  darkness: number;
  emotionalDepth: number;
}

export interface NarrativeFlow {
  transitions: string[];
  pacing: 'fast' | 'medium' | 'slow';
  tension: 'building' | 'peak' | 'resolving';
  emotionalArc: string[];
}

export interface GenerationOptions {
  wordCountTarget: number;
  targetPacing: number;
  targetTension: number;
  enableContinuity: boolean;
  enableProgression: boolean;
  enforceUniqueness: boolean;
  enableSymbolicDepth?: boolean;
  enableMoralComplexity?: boolean;
  enableCinematicFlow?: boolean;
  enableExperimentalModes?: boolean;
}

export interface StoryGenerationOptions {
  targetWordCount?: number;
  targetPacing?: number;
  targetTension?: number;
  tension?: number; // Alias for targetTension
  enableContinuity?: boolean;
  enableProgression?: boolean;
  enforceUniqueness?: boolean;
  tone?: 'light' | 'dark' | 'neutral';
  genre?: string;
  theme?: string;
}

export interface StoryContext {
  chapterNumber: number;
  world: 'real' | 'vr';
  characterState: CharacterState;
  previousChapters: Chapter[];
  storyProgress: StoryProgress;
  narrativeTone: NarrativeTone;
}

export interface StoryProgress {
  totalChapters: number;
  worldBalance: { real: number; vr: number };
  majorEvents: StoryEvent[];
  characterDevelopment: string[];
  plotPoints: PlotPoint[];
}

// Additional interfaces needed by AIStoryEngine
export interface Location {
  id: string;
  name: string;
  world: 'real' | 'vr';
  region: string;
  description: string;
  currentFaction?: string;
  landmarks: string[];
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'quest' | 'misc';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description: string;
  stats?: ItemStats;
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
  level?: number;
  effects?: string[];
}