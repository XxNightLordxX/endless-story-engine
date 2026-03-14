// ─── Core Types for the Story Engine ──────────────────────────────────────────

export type World = 'vr' | 'real';
export type Tone = 'dark' | 'neutral' | 'light';
export type ChapterLength = 'short' | 'medium' | 'long';
export type ArcPhase = 'setup' | 'rising' | 'complication' | 'climax' | 'resolution' | 'aftermath';
export type RelationType = 'ally' | 'rival' | 'mentor' | 'enemy' | 'friend' | 'love_interest' | 'mysterious' | 'neutral' | 'betrayed' | 'indebted';

// ─── Series Bible: Single Source of Truth ─────────────────────────────────────

export interface SeriesBible {
  // World rules that can never be contradicted
  worldRules: WorldRule[];
  // Every character that has ever appeared
  characters: CharacterRecord[];
  // Active and resolved plot threads
  plotThreads: PlotThread[];
  // Foreshadowing seeds planted for future payoff
  foreshadowing: ForeshadowingSeed[];
  // Skills, items, abilities the MC has acquired
  mcInventory: InventoryItem[];
  mcSkills: SkillRecord[];
  mcStats: MCStats;
  // Locations discovered and their state
  locations: LocationRecord[];
  // Factions and their disposition toward MC
  factions: FactionRecord[];
  // Timeline of major events
  timeline: TimelineEvent[];
  // Secrets the MC is keeping
  mcSecrets: SecretRecord[];
  // Knowledge the MC has gained
  mcKnowledge: KnowledgeRecord[];
  // Emotional state tracking
  mcEmotionalState: EmotionalState;
  // Story pacing state
  pacingState: PacingState;
  // Used scene/template tracking to prevent duplicates
  usedSceneKeys: string[];
  // Chapter generation metadata
  lastGeneratedChapter: number;
}

export interface WorldRule {
  id: string;
  rule: string;
  establishedInChapter: number;
  category: 'game_mechanic' | 'transfer_rule' | 'world_law' | 'social_rule' | 'magic_system' | 'technology';
  exceptions: string[];
}

export interface CharacterRecord {
  id: string;
  name: string;
  world: World | 'both';
  role: RelationType;
  description: string;
  personality: string[];
  motivations: string[];
  secrets: string[];
  firstAppearance: number;
  lastAppearance: number;
  appearances: number[];
  status: 'alive' | 'dead' | 'missing' | 'unknown' | 'comatose';
  relationships: { characterId: string; type: RelationType; since: number; notes: string }[];
  developmentArc: string[];
  currentGoal: string;
  quirks: string[];
  dialogue_style: string;
  knowledge: string[]; // what this character knows
  trustOfMC: number; // -100 to 100
}

export interface PlotThread {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'major' | 'minor' | 'personal' | 'mystery' | 'romance' | 'rivalry';
  status: 'active' | 'resolved' | 'dormant' | 'failed' | 'evolving';
  startedChapter: number;
  resolvedChapter: number | null;
  involvedCharacters: string[];
  stakes: string;
  currentProgress: string;
  nextBeat: string;
  urgency: number; // 1-10
}

export interface ForeshadowingSeed {
  id: string;
  hint: string;
  payoff: string;
  plantedChapter: number;
  payoffChapter: number | null;
  subtlety: 'obvious' | 'moderate' | 'subtle' | 'hidden';
  category: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'unknown';
  acquiredChapter: number;
  acquiredMethod: string;
  transferredToReal: boolean;
  transferChapter: number | null;
  realWorldForm: string;
  currentlyHeld: boolean;
  hiddenProperties: string[];
  usageCount: number;
}

export interface SkillRecord {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  acquiredChapter: number;
  category: 'combat' | 'utility' | 'passive' | 'social' | 'crafting' | 'movement' | 'perception' | 'forbidden' | 'transfer';
  worksInReal: boolean;
  discoveredWorksInReal: number | null;
  cooldown: string;
  cost: string;
  limitations: string[];
  synergiesWith: string[];
  evolutionPath: string[];
  usageHistory: { chapter: number; context: string }[];
}

export interface MCStats {
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
  luck: number;
  perception: number;
  charisma: number;
  unallocatedPoints: number;
  titles: string[];
  classes: string[];
  currentClass: string;
  reputation: { factionId: string; value: number }[];
  currency: { type: string; amount: number }[];
  questsCompleted: number;
  secretsDiscovered: number;
  deathCount: number;
  playTime: string;
  // Real world physical changes
  realWorldChanges: { description: string; discoveredChapter: number; hidden: boolean }[];
}

export interface LocationRecord {
  id: string;
  name: string;
  world: World;
  description: string;
  type: string;
  discoveredChapter: number;
  lastVisited: number;
  visits: number;
  secrets: string[];
  connectedLocations: string[];
  dangerLevel: number;
  currentState: string;
  npcsPresent: string[];
  availableQuests: string[];
}

export interface FactionRecord {
  id: string;
  name: string;
  description: string;
  world: World;
  alignment: string;
  leader: string;
  mcReputation: number; // -100 to 100
  discoveredChapter: number;
  goals: string[];
  conflicts: string[];
  members: string[];
  territory: string[];
  secrets: string[];
}

export interface TimelineEvent {
  chapter: number;
  world: World;
  event: string;
  significance: 'minor' | 'moderate' | 'major' | 'critical' | 'world_changing';
  involvedCharacters: string[];
  consequences: string[];
}

export interface SecretRecord {
  id: string;
  secret: string;
  knownBy: string[]; // character IDs who know
  discoveredChapter: number;
  risk: 'low' | 'medium' | 'high' | 'catastrophic';
  category: 'transfer_ability' | 'real_world_changes' | 'game_knowledge' | 'personal' | 'world_secret';
  closeCallChapters: number[]; // chapters where secret was almost discovered
  relatedPlotThreads: string[];
}

export interface KnowledgeRecord {
  id: string;
  topic: string;
  detail: string;
  learnedChapter: number;
  source: string;
  reliability: 'confirmed' | 'suspected' | 'rumor' | 'false';
  category: 'game_system' | 'lore' | 'npc_info' | 'world_history' | 'skill_knowledge' | 'real_world' | 'transfer_mechanics';
}

export interface EmotionalState {
  mood: string;
  stressLevel: number; // 0-100
  hopeLevel: number; // 0-100
  loneliness: number; // 0-100
  determination: number; // 0-100
  paranoia: number; // 0-100 (about hiding secrets)
  bonds: { characterId: string; strength: number }[];
  recentTrauma: string[];
  currentMotivation: string;
  internalConflicts: string[];
}

export interface PacingState {
  currentArc: StoryArc;
  activeMinorArcs: StoryArc[];
  tensionLevel: number; // 0-100
  actionCooldown: number; // chapters since last big action scene
  loreCooldown: number; // chapters since last lore dump
  emotionalCooldown: number; // chapters since last emotional scene
  revelationCooldown: number; // chapters since last big reveal
  chaptersSinceNewCharacter: number;
  chaptersSinceNewLocation: number;
  chaptersSinceNewSkill: number;
  recentSceneTypes: string[];
  suggestedNextTone: string;
}

export interface StoryArc {
  id: string;
  title: string;
  phase: ArcPhase;
  type: 'main' | 'major' | 'minor' | 'personal';
  startChapter: number;
  estimatedLength: number;
  currentBeat: number;
  totalBeats: number;
  description: string;
  stakes: string;
  involvedCharacters: string[];
}

// ─── Chapter Generation Types ─────────────────────────────────────────────────

export interface StoryConfig {
  tone: Tone;
  pacing: number; // 1-10
  tension: number; // 1-10
  chapterLength: ChapterLength;
  storyPrompt: string;
  detailLevel: number; // 1-10 (backstory/description density)
  characterFocus: number; // 1-10 (how much to focus on internal thoughts)
  loreDepth: number; // 1-10 (how much world-building to include)
  actionBalance: number; // 1-10 (action vs introspection ratio)
  mysteryDensity: number; // 1-10 (how many mysteries/questions to raise)
}

export interface GeneratedChapter {
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  world: World;
  summary: string;
  characters: string[];
  locations: string[];
  newCharacters: string[];
  newLocations: string[];
  skillsUsed: string[];
  itemsGained: string[];
  plotThreadsAdvanced: string[];
  foreshadowingPlanted: string[];
  foreshadowingPaidOff: string[];
  emotionalTone: string;
  arcPhase: ArcPhase;
  tensionLevel: number;
  createdAt: string;
  // Metadata for the glossary/codex
  glossaryUpdates: { id: string; type: string; name: string; description: string }[];
  codexUpdates: { id: string; category: string; title: string; content: string }[];
}

export interface ChapterBlueprint {
  chapterNumber: number;
  world: World;
  arcPhase: ArcPhase;
  primaryFocus: 'action' | 'character' | 'lore' | 'mystery' | 'social' | 'exploration' | 'training' | 'stealth' | 'emotional' | 'revelation';
  secondaryFocus: string;
  requiredPlotBeats: string[];
  suggestedScenes: string[];
  charactersToInclude: string[];
  locationsToUse: string[];
  emotionalTarget: string;
  tensionTarget: number;
  wordTarget: number;
  mustAdvancePlots: string[];
  foreshadowingToPlant: string[];
  foreshadowingToPayoff: string[];
  secretsAtRisk: string[];
  newElementsToIntroduce: string[];
}
