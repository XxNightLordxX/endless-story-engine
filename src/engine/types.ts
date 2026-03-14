// ─── Core Types for the Story Engine ──────────────────────────────────────────

export type World = 'vr' | 'real';
export type Tone = 'dark' | 'neutral' | 'light';
export type ChapterLength = 'short' | 'medium' | 'long';
export type ArcPhase = 'setup' | 'rising' | 'complication' | 'climax' | 'resolution' | 'aftermath';
export type RelationType = 'ally' | 'rival' | 'mentor' | 'enemy' | 'friend' | 'love_interest' | 'mysterious' | 'neutral' | 'betrayed' | 'indebted';

// MC progression from naive gamer to seasoned survivor
export type ProgressionStage =
  | 'naive_player'       // Thinks it's just a game, excited and reckless
  | 'curious_tester'     // Notices transfers, starts poking at boundaries
  | 'opportunist'        // Actively exploits game mechanics for real-world gain
  | 'paranoid_hider'     // Realizes stakes are real, becomes secretive
  | 'strategic_abuser'   // Systematically exploits both worlds while covering tracks
  | 'seasoned_survivor'; // Fully aware of reality, operates with cold precision

// Concealment risk levels
export type ConcealmentRisk = 'safe' | 'noticed' | 'suspected' | 'investigated' | 'exposed';

// Exploit discovery status
export type ExploitStatus = 'undiscovered' | 'theorized' | 'tested' | 'confirmed' | 'actively_used' | 'patched' | 'evolved';

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

  // ─── NEW: Deep Character & Narrative Systems ───────────────────────────
  // MC psychology profile — drives decision-making and narrative voice
  mcPsychology: MCPsychology;
  // Exploit/cheat tracking — every workaround and abuse the MC discovers
  exploits: ExploitRecord[];
  // Concealment system — tracking how well MC hides powers in each world
  concealmentState: ConcealmentState;
  // Character progression arc — naive player to seasoned survivor
  progressionArc: ProgressionArcState;
  // Deep lore fragments — world history revealed piece by piece
  loreFragments: LoreFragment[];
  // Relationship dynamics — deeper than simple trust scores
  relationshipDynamics: RelationshipDynamic[];
  // Transfer log — every ability/item/stat that crossed the world boundary
  transferLog: TransferEvent[];
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

// ─── MC Psychology: Drives narrative voice and decision-making ──────────────

export interface MCPsychology {
  // Current progression stage
  stage: ProgressionStage;
  // How the MC views Eclipsis (game → tool → reality → trap → home)
  gamePerception: 'entertainment' | 'tool' | 'second_life' | 'trap' | 'home' | 'weapon';
  // Moral flexibility — how willing to exploit/cheat (0=rigid, 100=anything goes)
  moralFlexibility: number;
  // Self-awareness of changes (0=oblivious, 100=fully aware)
  selfAwareness: number;
  // Addiction level to the game/power (0=casual, 100=can't stop)
  addictionLevel: number;
  // How much MC rationalizes questionable actions
  rationalizationTendency: number;
  // Control need — how much MC needs to feel in control (drives exploit behavior)
  controlNeed: number;
  // Risk tolerance (0=extremely cautious, 100=reckless)
  riskTolerance: number;
  // Current internal monologue themes
  recurringThoughts: string[];
  // Behavioral patterns that have emerged
  behavioralPatterns: string[];
  // Things MC tells himself to justify actions
  rationalizations: string[];
  // Fears that drive behavior
  deepFears: string[];
  // What MC would never do (shrinks over time)
  moralLines: string[];
  // Moments that shifted his worldview
  pivotalMoments: { chapter: number; event: string; shift: string }[];
}

// ─── Exploit/Cheat Tracking ─────────────────────────────────────────────────

export interface ExploitRecord {
  id: string;
  name: string;
  description: string;
  // How the MC discovered this exploit
  discoveryMethod: 'accident' | 'experimentation' | 'npc_hint' | 'lore_clue' | 'desperation' | 'systematic_testing';
  status: ExploitStatus;
  discoveredChapter: number;
  firstUsedChapter: number | null;
  // Which world(s) this exploit affects
  affectsWorld: World | 'both';
  // The game mechanic being abused
  mechanicAbused: string;
  // What advantage it gives
  advantage: string;
  // Risk of detection/patching
  detectionRisk: 'none' | 'low' | 'medium' | 'high' | 'critical';
  // Has the system/devs noticed?
  systemAware: boolean;
  // Counter-measures the MC uses to avoid detection
  countermeasures: string[];
  // Times the MC has used this exploit
  usageCount: number;
  // Side effects discovered through use
  sideEffects: string[];
  // Can it evolve into something more powerful?
  evolutionPotential: string | null;
  // Category of exploit
  category: 'stat_transfer' | 'item_duplication' | 'skill_abuse' | 'boundary_exploit'
    | 'social_manipulation' | 'system_glitch' | 'class_hidden_feature' | 'economy_abuse'
    | 'pvp_cheese' | 'reality_hack';
}

// ─── Concealment System ─────────────────────────────────────────────────────

export interface ConcealmentState {
  // Overall concealment rating per world
  vrConcealment: ConcealmentProfile;
  realConcealment: ConcealmentProfile;
  // Active cover stories the MC maintains
  coverStories: CoverStory[];
  // Close calls — moments where concealment almost failed
  closeCalls: CloseCall[];
  // Items/abilities currently being hidden
  hiddenAssets: HiddenAsset[];
  // People actively investigating MC
  investigators: string[];
  // Overall heat level (0=invisible, 100=fully exposed)
  heatLevel: number;
}

export interface ConcealmentProfile {
  world: World;
  risk: ConcealmentRisk;
  // Specific things being concealed in this world
  concealedAbilities: string[];
  concealedItems: string[];
  concealedKnowledge: string[];
  // People who are suspicious in this world
  suspiciousCharacters: { characterId: string; suspicionLevel: number; whatTheySuspect: string }[];
  // Strategies MC uses to maintain cover
  activeStrategies: string[];
  // How many chapters since a close call
  chaptersSinceCloseCall: number;
}

export interface CoverStory {
  id: string;
  target: string; // who the cover story is for
  story: string;  // what MC tells them
  truth: string;  // what's actually happening
  believability: number; // 0-100
  established: number; // chapter
  lastReinforced: number; // chapter
  cracks: string[]; // inconsistencies that could unravel it
}

export interface CloseCall {
  chapter: number;
  world: World;
  whatHappened: string;
  whoWasPresent: string[];
  howMCRecovered: string;
  consequencesOngoing: string[];
  increasedSuspicionFor: string[];
}

export interface HiddenAsset {
  id: string;
  type: 'ability' | 'item' | 'stat' | 'knowledge';
  name: string;
  hiddenFrom: string[]; // character IDs or 'public'
  hidingMethod: string;
  discoveryRisk: number; // 0-100
  lastUsedSecretly: number | null; // chapter
}

// ─── Character Progression Arc ──────────────────────────────────────────────

export interface ProgressionArcState {
  currentStage: ProgressionStage;
  stageEnteredChapter: number;
  // Conditions that must be met to advance to next stage
  advancementTriggers: string[];
  // Key moments that defined each stage
  stageHistory: { stage: ProgressionStage; entered: number; exited: number | null; definingMoment: string }[];
  // MC's current dominant survival strategy
  dominantStrategy: 'brute_force' | 'stealth' | 'social_manipulation' | 'exploit_abuse' | 'knowledge_hoarding' | 'alliance_building';
  // How many exploits MC has actively used (drives stage transitions)
  exploitUsageCount: number;
  // How many close calls MC has survived
  closeCallCount: number;
  // Key realizations MC has had about the game's true nature
  realizations: { chapter: number; insight: string; impact: string }[];
}

// ─── Deep Lore Fragments ────────────────────────────────────────────────────

export interface LoreFragment {
  id: string;
  title: string;
  content: string;
  category: 'progenitor_history' | 'game_origin' | 'transfer_mechanics' | 'sealed_content'
    | 'developer_secrets' | 'ancient_war' | 'yuna_connection' | 'reality_nature';
  discoveredChapter: number;
  reliability: 'confirmed' | 'likely' | 'uncertain' | 'contradicted';
  // How this connects to other fragments
  connectedFragments: string[];
  // What this implies for the larger story
  implications: string[];
  // Has MC acted on this knowledge?
  actedUpon: boolean;
}

// ─── Relationship Dynamics ──────────────────────────────────────────────────

export interface RelationshipDynamic {
  characterId: string;
  // What MC shows this character vs what he really feels
  publicFace: string;
  privateFeelings: string;
  // What MC is hiding from this character
  hidingFrom: string[];
  // What this character knows/suspects
  theirSuspicions: string[];
  // Power dynamic
  powerBalance: 'mc_dominant' | 'equal' | 'they_dominant' | 'complicated';
  // Is MC manipulating this character?
  manipulationLevel: number; // 0=honest, 100=fully manipulating
  // Guilt about deception
  guiltLevel: number; // 0-100
  // Key moments in this relationship
  pivotalMoments: { chapter: number; event: string }[];
  // Potential for this character to become ally/enemy based on truth reveal
  truthRevealOutcome: 'strengthened' | 'damaged' | 'destroyed' | 'complicated' | 'unknown';
}

// ─── Transfer Events ────────────────────────────────────────────────────────

export interface TransferEvent {
  id: string;
  chapter: number;
  direction: 'vr_to_real' | 'real_to_vr';
  type: 'stat' | 'ability' | 'item' | 'knowledge' | 'physical_change';
  name: string;
  description: string;
  // Was this intentional or accidental?
  intentional: boolean;
  // MC's reaction when he discovered it
  mcReaction: string;
  // How MC is concealing this transfer
  concealmentMethod: string;
  // Side effects
  sideEffects: string[];
  // Is MC actively exploiting this?
  beingExploited: boolean;
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
  // NEW: Narrative control knobs
  exploitDensity: number; // 1-10 (how often MC discovers/uses exploits)
  concealmentPressure: number; // 1-10 (how hard it is to hide powers)
  progressionSpeed: number; // 1-10 (how fast MC evolves from naive to seasoned)
  moralDecay: number; // 1-10 (how quickly moral lines blur)
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
  primaryFocus: 'action' | 'character' | 'lore' | 'mystery' | 'social' | 'exploration'
    | 'training' | 'stealth' | 'emotional' | 'revelation' | 'exploit' | 'concealment';
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

  // ─── NEW: Narrative intelligence fields ──────────────────────────────
  // Current MC psychology stage — drives voice and decision-making
  mcStage: ProgressionStage;
  // What exploit activity should happen this chapter
  exploitDirective: ExploitDirective | null;
  // Concealment pressure for this chapter
  concealmentPressure: 'none' | 'low' | 'medium' | 'high' | 'critical';
  // Should a close call happen?
  closeCallScheduled: boolean;
  // Character growth beat — what internal shift should occur
  characterGrowthBeat: string | null;
  // Relationship to develop this chapter
  relationshipFocus: string | null;
  // Lore fragment to reveal
  loreReveal: string | null;
  // Transfer event to include
  transferEvent: string | null;
}

export interface ExploitDirective {
  type: 'discover' | 'test' | 'use' | 'evolve' | 'hide_evidence';
  exploitId: string | null; // null = discover a new one
  context: string; // narrative context for the exploit
}
