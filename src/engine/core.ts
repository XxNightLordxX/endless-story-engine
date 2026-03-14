// ─── Engine Core ──────────────────────────────────────────────────────────────
// SeriesBible management, ChapterBlueprint generation, and SeriesBible updates.
// All state is persisted in IndexedDB via the meta store.

import type {
  SeriesBible,
  ChapterBlueprint,
  StoryArc,
  ArcPhase,
  CharacterRecord,
  PlotThread,
  ForeshadowingSeed,
  LocationRecord,
  TimelineEvent,
  EmotionalState,
  PacingState,
  MCStats,
  World,
  MCPsychology,
  ConcealmentState,
  ProgressionArcState,
  ProgressionStage,
  ExploitDirective,
} from './types';
import { getMeta, setMeta } from '../db';

// ─── Seeded PRNG (matches api.ts) ────────────────────────────────────────────

function createRng(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(arr: T[], n: number, rng: () => number): T[] {
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

// ─── SeriesBible Defaults ────────────────────────────────────────────────────

function createDefaultMCStats(): MCStats {
  return {
    level: 1,
    experience: 0,
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    strength: 8,
    agility: 10,
    intelligence: 12,
    vitality: 9,
    luck: 5,
    perception: 7,
    charisma: 6,
    unallocatedPoints: 0,
    titles: ['Newcomer'],
    classes: ['Vampire Progenitor'],
    currentClass: 'Vampire Progenitor',
    reputation: [],
    currency: [{ type: 'Gold', amount: 0 }],
    questsCompleted: 0,
    secretsDiscovered: 0,
    deathCount: 0,
    playTime: '0h',
    realWorldChanges: [],
  };
}

function createDefaultEmotionalState(): EmotionalState {
  return {
    mood: 'determined',
    stressLevel: 40,
    hopeLevel: 60,
    loneliness: 55,
    determination: 75,
    paranoia: 20,
    bonds: [
      { characterId: 'yuna', strength: 95 },
      { characterId: 'alex', strength: 60 },
    ],
    recentTrauma: [],
    currentMotivation: 'Find a way to save Yuna through Eclipsis Online',
    internalConflicts: [
      'Guilt over enjoying the game while Yuna is comatose',
      'Fear of the physical changes the game is causing',
    ],
  };
}

function createDefaultMainArc(): StoryArc {
  return {
    id: 'arc-main-progenitor',
    title: 'The Progenitor Awakening',
    phase: 'setup',
    type: 'main',
    startChapter: 1,
    estimatedLength: 50,
    currentBeat: 1,
    totalBeats: 12,
    description: 'Kael discovers the Vampire Progenitor class and its connection to reality',
    stakes: 'Kael\'s humanity and Yuna\'s life',
    involvedCharacters: ['kael', 'yuna'],
  };
}

function createDefaultPacingState(): PacingState {
  return {
    currentArc: createDefaultMainArc(),
    activeMinorArcs: [],
    tensionLevel: 30,
    actionCooldown: 0,
    loreCooldown: 0,
    emotionalCooldown: 0,
    revelationCooldown: 0,
    chaptersSinceNewCharacter: 0,
    chaptersSinceNewLocation: 0,
    chaptersSinceNewSkill: 0,
    recentSceneTypes: [],
    suggestedNextTone: 'dark',
  };
}

function createDefaultMCPsychology(): MCPsychology {
  return {
    stage: 'naive_player',
    gamePerception: 'entertainment',
    moralFlexibility: 15,
    selfAwareness: 10,
    addictionLevel: 20,
    rationalizationTendency: 10,
    controlNeed: 30,
    riskTolerance: 60,
    recurringThoughts: ['I need to save Yuna', 'This game feels too real'],
    behavioralPatterns: ['Plays late into the night', 'Avoids mirrors'],
    rationalizations: ["It's just a game — the effects will wear off"],
    deepFears: ['Losing Yuna permanently', 'Becoming something inhuman'],
    moralLines: ['Never harm an innocent', 'Never lie to Alex', 'Never use powers to hurt real people'],
    pivotalMoments: [],
  };
}

function createDefaultConcealmentState(): ConcealmentState {
  return {
    vrConcealment: {
      world: 'vr',
      risk: 'safe',
      concealedAbilities: [],
      concealedItems: [],
      concealedKnowledge: ['Progenitor class is merging with reality'],
      suspiciousCharacters: [],
      activeStrategies: ['Avoids using unique Progenitor abilities in public areas'],
      chaptersSinceCloseCall: 0,
    },
    realConcealment: {
      world: 'real',
      risk: 'safe',
      concealedAbilities: ['Nightsight', 'Enhanced reflexes'],
      concealedItems: [],
      concealedKnowledge: ['Game stats are bleeding into reality'],
      suspiciousCharacters: [{ characterId: 'alex', suspicionLevel: 20, whatTheySuspect: 'Something is changing about Kael physically' }],
      activeStrategies: ['Wears sunglasses to hide eye changes', 'Attributes reflexes to adrenaline'],
      chaptersSinceCloseCall: 0,
    },
    coverStories: [],
    closeCalls: [],
    hiddenAssets: [
      {
        id: 'hidden-nightsight',
        type: 'ability',
        name: 'Nightsight (real-world)',
        hiddenFrom: ['alex', 'public'],
        hidingMethod: 'Pretends to use phone flashlight',
        discoveryRisk: 30,
        lastUsedSecretly: null,
      },
    ],
    investigators: [],
    heatLevel: 10,
  };
}

function createDefaultProgressionArc(): ProgressionArcState {
  return {
    currentStage: 'naive_player',
    stageEnteredChapter: 1,
    advancementTriggers: [
      'Discovers a stat transfer that he can reproduce',
      'Witnesses a real consequence of game actions',
      'Gets caught using an ability and must explain it away',
    ],
    stageHistory: [
      { stage: 'naive_player', entered: 1, exited: null, definingMoment: 'First login to Eclipsis Online' },
    ],
    dominantStrategy: 'brute_force',
    exploitUsageCount: 0,
    closeCallCount: 0,
    realizations: [],
  };
}

const SEED_CHARACTERS: CharacterRecord[] = [
  {
    id: 'kael',
    name: 'Kael',
    world: 'both',
    role: 'ally',
    description: 'A young man desperate to save his comatose sister, chosen by the Vampire Progenitor class',
    personality: ['determined', 'protective', 'adaptable', 'guarded'],
    motivations: ['Save Yuna', 'Understand the Progenitor class', 'Survive'],
    secrets: ['His stats are merging with reality', 'He can see in the dark'],
    firstAppearance: 1,
    lastAppearance: 1,
    appearances: [1],
    status: 'alive',
    relationships: [
      { characterId: 'yuna', type: 'ally', since: 1, notes: 'Sister, comatose' },
    ],
    developmentArc: ['Reluctant player', 'Growing power', 'Questioning humanity'],
    currentGoal: 'Explore Eclipsis Online and find a way to save Yuna',
    quirks: ['Talks to Yuna as if she can hear', 'Avoids mirrors'],
    dialogue_style: 'Direct, internal monologue heavy, dry humor under stress',
    knowledge: ['Basic game mechanics', 'Progenitor class exists'],
    trustOfMC: 100,
  },
  {
    id: 'yuna',
    name: 'Yuna',
    world: 'real',
    role: 'ally',
    description: 'Kael\'s younger sister, comatose for two years after a mysterious accident',
    personality: ['gentle', 'curious', 'brave'],
    motivations: [],
    secrets: ['Her neural patterns resemble game activity'],
    firstAppearance: 1,
    lastAppearance: 1,
    appearances: [1],
    status: 'comatose',
    relationships: [
      { characterId: 'kael', type: 'ally', since: 1, notes: 'Older brother' },
    ],
    developmentArc: ['Comatose presence', 'Signs of change'],
    currentGoal: '',
    quirks: [],
    dialogue_style: '',
    knowledge: [],
    trustOfMC: 100,
  },
  {
    id: 'alex',
    name: 'Alex',
    world: 'real',
    role: 'friend',
    description: 'Kael\'s best friend who notices the changes happening to him',
    personality: ['loyal', 'observant', 'blunt', 'worried'],
    motivations: ['Protect Kael', 'Understand what\'s happening'],
    secrets: [],
    firstAppearance: 2,
    lastAppearance: 2,
    appearances: [],
    status: 'alive',
    relationships: [
      { characterId: 'kael', type: 'friend', since: 1, notes: 'Best friend, growing concerned' },
    ],
    developmentArc: ['Supportive friend', 'Growing suspicion'],
    currentGoal: 'Figure out what is happening to Kael',
    quirks: ['Arrives at 2AM diners', 'No-filter honesty'],
    dialogue_style: 'Blunt, caring, uses rhetorical questions',
    knowledge: ['Kael is changing physically', 'He plays Eclipsis Online'],
    trustOfMC: 70,
  },
];

const SEED_PLOT_THREADS: PlotThread[] = [
  {
    id: 'plot-progenitor-awakening',
    title: 'The Progenitor Awakening',
    description: 'Kael\'s forbidden Vampire Progenitor class is evolving, merging game stats with reality',
    type: 'main',
    status: 'active',
    startedChapter: 1,
    resolvedChapter: null,
    involvedCharacters: ['kael'],
    stakes: 'Kael\'s humanity and the boundary between worlds',
    currentProgress: 'Kael has discovered the class and noticed initial stat-merge effects',
    nextBeat: 'The hunger grows stronger',
    urgency: 8,
  },
  {
    id: 'plot-save-yuna',
    title: 'Save Yuna',
    description: 'Kael believes something in Eclipsis Online can cure his sister\'s coma',
    type: 'main',
    status: 'active',
    startedChapter: 1,
    resolvedChapter: null,
    involvedCharacters: ['kael', 'yuna'],
    stakes: 'Yuna\'s life',
    currentProgress: 'Yuna\'s neural patterns are changing, resembling game activity',
    nextBeat: 'A clue about Yuna\'s connection to the game',
    urgency: 9,
  },
  {
    id: 'plot-reality-bleed',
    title: 'Reality Bleed',
    description: 'Game abilities and visuals are bleeding into the real world',
    type: 'mystery',
    status: 'active',
    startedChapter: 1,
    resolvedChapter: null,
    involvedCharacters: ['kael', 'alex'],
    stakes: 'The nature of reality itself',
    currentProgress: 'Nightsight, enhanced reflexes, and visual overlays are manifesting',
    nextBeat: 'A public incident nearly exposes Kael',
    urgency: 7,
  },
  {
    id: 'plot-forbidden-history',
    title: 'The Forbidden History',
    description: 'The Vampire Progenitor class was sealed for a reason — fragments of its history are scattered throughout Eclipsis',
    type: 'mystery',
    status: 'active',
    startedChapter: 1,
    resolvedChapter: null,
    involvedCharacters: ['kael'],
    stakes: 'Understanding the true nature of the class and the game',
    currentProgress: 'Kael has found initial lore fragments',
    nextBeat: 'Encounter an NPC who remembers the original Progenitor',
    urgency: 5,
  },
];

const SEED_FORESHADOWING: ForeshadowingSeed[] = [
  {
    id: 'fs-headset-origin',
    hint: 'The headset arrived with no return address',
    payoff: 'The headset was sent by the game itself',
    plantedChapter: 1,
    payoffChapter: null,
    subtlety: 'moderate',
    category: 'mystery',
  },
  {
    id: 'fs-yuna-neural',
    hint: 'Yuna\'s neural patterns resemble someone playing a video game',
    payoff: 'Yuna is connected to Eclipsis Online from within',
    plantedChapter: 1,
    payoffChapter: null,
    subtlety: 'subtle',
    category: 'plot',
  },
  {
    id: 'fs-real-world-integration',
    hint: 'System notification mentions "real-world integration"',
    payoff: 'The game is deliberately merging with reality',
    plantedChapter: 1,
    payoffChapter: null,
    subtlety: 'hidden',
    category: 'world',
  },
];

const SEED_LOCATIONS: LocationRecord[] = [
  {
    id: 'loc-apartment',
    name: "Kael's Apartment",
    world: 'real',
    description: 'A small, sparse apartment with minimal furniture',
    type: 'residence',
    discoveredChapter: 1,
    lastVisited: 1,
    visits: 1,
    secrets: ['The headset glows in sync with Kael\'s heartbeat'],
    connectedLocations: ['loc-hospital', 'loc-diner'],
    dangerLevel: 0,
    currentState: 'Lived-in, the headset sits on the desk',
    npcsPresent: [],
    availableQuests: [],
  },
  {
    id: 'loc-hospital',
    name: 'City General Hospital',
    world: 'real',
    description: 'Where Yuna lies in a coma, Room 412',
    type: 'medical',
    discoveredChapter: 1,
    lastVisited: 1,
    visits: 1,
    secrets: ['Dr. Yamada has seen similar neural patterns before'],
    connectedLocations: ['loc-apartment'],
    dangerLevel: 0,
    currentState: 'Yuna stable but showing unusual brain activity',
    npcsPresent: ['yuna'],
    availableQuests: [],
  },
  {
    id: 'loc-tutorial-castle',
    name: 'Eclipsis Online - Tutorial Castle',
    world: 'vr',
    description: 'An ornate castle with stone walls and torches, the entry point to Eclipsis',
    type: 'dungeon',
    discoveredChapter: 1,
    lastVisited: 1,
    visits: 1,
    secrets: ['Hidden passages lead to sealed Progenitor areas'],
    connectedLocations: [],
    dangerLevel: 1,
    currentState: 'Cleared',
    npcsPresent: [],
    availableQuests: [],
  },
];

// ─── SeriesBible CRUD ────────────────────────────────────────────────────────

const BIBLE_KEY = 'series_bible';

export function createDefaultSeriesBible(): SeriesBible {
  return {
    worldRules: [
      {
        id: 'wr-stat-merge',
        rule: 'Game stats can merge with reality for Progenitor class holders',
        establishedInChapter: 1,
        category: 'transfer_rule',
        exceptions: [],
      },
      {
        id: 'wr-forbidden-class',
        rule: 'The Vampire Progenitor class is sealed and forbidden by the developers',
        establishedInChapter: 1,
        category: 'game_mechanic',
        exceptions: ['Kael received it through an unknown mechanism'],
      },
      {
        id: 'wr-dual-world',
        rule: 'The story alternates between VR (Eclipsis Online) and the real world',
        establishedInChapter: 1,
        category: 'world_law',
        exceptions: [],
      },
    ],
    characters: [...SEED_CHARACTERS],
    plotThreads: [...SEED_PLOT_THREADS],
    foreshadowing: [...SEED_FORESHADOWING],
    mcInventory: [],
    mcSkills: [
      {
        id: 'skill-nightsight',
        name: 'Nightsight',
        description: 'See perfectly in darkness',
        level: 1,
        maxLevel: 10,
        acquiredChapter: 1,
        category: 'passive',
        worksInReal: true,
        discoveredWorksInReal: 2,
        cooldown: 'None (passive)',
        cost: 'None',
        limitations: ['Bright light causes brief disorientation'],
        synergiesWith: [],
        evolutionPath: ['Enhanced Nightsight', 'True Darkvision', 'Predator Sight'],
        usageHistory: [],
      },
      {
        id: 'skill-crimson-surge',
        name: 'Crimson Surge',
        description: 'Channel blood essence for a burst of speed and power',
        level: 1,
        maxLevel: 10,
        acquiredChapter: 1,
        category: 'combat',
        worksInReal: false,
        discoveredWorksInReal: null,
        cooldown: '30 seconds',
        cost: '50 Blood Essence',
        limitations: ['Hunger increases after use'],
        synergiesWith: ['skill-nightsight'],
        evolutionPath: ['Crimson Burst', 'Blood Tempest', 'Progenitor\'s Wrath'],
        usageHistory: [],
      },
    ],
    mcStats: createDefaultMCStats(),
    locations: [...SEED_LOCATIONS],
    factions: [],
    timeline: [
      {
        chapter: 1,
        world: 'real',
        event: 'Kael receives a mysterious VR headset and logs into Eclipsis Online',
        significance: 'critical',
        involvedCharacters: ['kael'],
        consequences: ['Assigned Vampire Progenitor class', 'Journey begins'],
      },
    ],
    mcSecrets: [
      {
        id: 'secret-stat-merge',
        secret: 'Game stats are bleeding into reality — enhanced senses, reflexes, strength',
        knownBy: ['kael'],
        discoveredChapter: 1,
        risk: 'high',
        category: 'transfer_ability',
        closeCallChapters: [],
        relatedPlotThreads: ['plot-reality-bleed'],
      },
    ],
    mcKnowledge: [
      {
        id: 'know-progenitor-class',
        topic: 'Vampire Progenitor Class',
        detail: 'A forbidden class that was sealed by the developers. It grants blood-based abilities.',
        learnedChapter: 1,
        source: 'System notification',
        reliability: 'confirmed',
        category: 'game_system',
      },
    ],
    mcEmotionalState: createDefaultEmotionalState(),
    pacingState: createDefaultPacingState(),
    usedSceneKeys: [],
    lastGeneratedChapter: 1,

    // Deep character & narrative systems
    mcPsychology: createDefaultMCPsychology(),
    exploits: [],
    concealmentState: createDefaultConcealmentState(),
    progressionArc: createDefaultProgressionArc(),
    loreFragments: [],
    relationshipDynamics: [
      {
        characterId: 'alex',
        publicFace: 'Everything is fine, just stressed about Yuna',
        privateFeelings: 'Grateful but afraid Alex will discover the truth',
        hidingFrom: ['Game stat transfers', 'Physical changes', 'Nightsight ability'],
        theirSuspicions: ['Kael looks different', 'He seems faster, more alert'],
        powerBalance: 'equal',
        manipulationLevel: 10,
        guiltLevel: 25,
        pivotalMoments: [],
        truthRevealOutcome: 'complicated',
      },
      {
        characterId: 'yuna',
        publicFace: 'Hopeful older brother visiting every day',
        privateFeelings: 'Desperate guilt mixed with fragile hope',
        hidingFrom: [],
        theirSuspicions: [],
        powerBalance: 'complicated',
        manipulationLevel: 0,
        guiltLevel: 60,
        pivotalMoments: [],
        truthRevealOutcome: 'unknown',
      },
    ],
    transferLog: [
      {
        id: 'transfer-nightsight',
        chapter: 1,
        direction: 'vr_to_real',
        type: 'ability',
        name: 'Nightsight',
        description: 'Perfect vision in darkness began manifesting in the real world',
        intentional: false,
        mcReaction: 'Confused and frightened, then fascinated',
        concealmentMethod: 'Pretends to use phone flashlight, wears sunglasses',
        sideEffects: ['Slight light sensitivity', 'Eyes occasionally reflect light like a cat'],
        beingExploited: false,
      },
    ],
  };
}

export async function loadSeriesBible(): Promise<SeriesBible> {
  return getMeta<SeriesBible>(BIBLE_KEY, createDefaultSeriesBible());
}

export async function saveSeriesBible(bible: SeriesBible): Promise<void> {
  await setMeta(BIBLE_KEY, bible);
}

// ─── Arc Phase Progression ───────────────────────────────────────────────────

const ARC_PHASES: ArcPhase[] = ['setup', 'rising', 'complication', 'climax', 'resolution', 'aftermath'];

function advanceArcPhase(arc: StoryArc): StoryArc {
  const idx = ARC_PHASES.indexOf(arc.phase);
  const beatRatio = arc.currentBeat / arc.totalBeats;

  let newPhase = arc.phase;
  if (beatRatio < 0.15) newPhase = 'setup';
  else if (beatRatio < 0.35) newPhase = 'rising';
  else if (beatRatio < 0.55) newPhase = 'complication';
  else if (beatRatio < 0.75) newPhase = 'climax';
  else if (beatRatio < 0.9) newPhase = 'resolution';
  else newPhase = 'aftermath';

  // Only advance forward, never backward
  if (ARC_PHASES.indexOf(newPhase) < idx) newPhase = arc.phase;

  return {
    ...arc,
    phase: newPhase,
    currentBeat: arc.currentBeat + 1,
  };
}

// ─── ChapterBlueprint Generation ─────────────────────────────────────────────

const VR_FOCUS_OPTIONS = ['action', 'lore', 'exploration', 'training', 'mystery'] as const;
const REAL_FOCUS_OPTIONS = ['character', 'emotional', 'social', 'revelation', 'stealth'] as const;

const EMOTIONAL_TARGETS = [
  'tension', 'wonder', 'dread', 'hope', 'despair', 'determination',
  'paranoia', 'curiosity', 'grief', 'excitement', 'isolation', 'connection',
];

export function generateBlueprint(
  chapterNumber: number,
  world: World,
  bible: SeriesBible,
  config: { tension: number; pacing: number; mysteryDensity?: number },
): ChapterBlueprint {
  const rng = createRng(chapterNumber * 317);

  // Determine arc phase from the main arc
  const arcPhase = bible.pacingState.currentArc.phase;

  // Choose primary focus based on world and pacing cooldowns
  const pacing = bible.pacingState;
  let primaryFocus: ChapterBlueprint['primaryFocus'];
  if (world === 'vr') {
    if (pacing.actionCooldown >= 2) {
      primaryFocus = 'action';
    } else if (pacing.loreCooldown >= 3) {
      primaryFocus = 'lore';
    } else {
      primaryFocus = pick([...VR_FOCUS_OPTIONS], rng);
    }
  } else {
    if (pacing.emotionalCooldown >= 2) {
      primaryFocus = 'emotional';
    } else if (pacing.revelationCooldown >= 4) {
      primaryFocus = 'revelation';
    } else {
      primaryFocus = pick([...REAL_FOCUS_OPTIONS], rng);
    }
  }

  // Select characters to include
  const worldChars = bible.characters
    .filter(c => c.status !== 'dead' && (c.world === world || c.world === 'both'))
    .map(c => c.id);
  const charactersToInclude = ['kael', ...pickN(worldChars.filter(id => id !== 'kael'), 2, rng)];

  // Select locations
  const worldLocs = bible.locations.filter(l => l.world === world).map(l => l.name);
  const locationsToUse = worldLocs.length > 0 ? pickN(worldLocs, 2, rng) : ['Unknown Area'];

  // Determine plot threads to advance
  const activePlots = bible.plotThreads
    .filter(p => p.status === 'active' || p.status === 'evolving')
    .sort((a, b) => b.urgency - a.urgency);
  const mustAdvancePlots = activePlots.slice(0, 2).map(p => p.id);

  // Foreshadowing
  const unresolved = bible.foreshadowing.filter(f => !f.payoffChapter);
  const toPayoff = chapterNumber > 5 && rng() > 0.7 ? pickN(unresolved, 1, rng).map(f => f.id) : [];
  const toPlant = (config.mysteryDensity ?? 5) > 5 ? [`fs-auto-${chapterNumber}`] : [];

  // Secrets at risk
  const secretsAtRisk = config.tension > 6
    ? bible.mcSecrets.filter(s => s.risk !== 'low').slice(0, 1).map(s => s.id)
    : [];

  // New elements
  const newElements: string[] = [];
  if (pacing.chaptersSinceNewCharacter >= 3) newElements.push('new_character');
  if (pacing.chaptersSinceNewLocation >= 3) newElements.push('new_location');
  if (pacing.chaptersSinceNewSkill >= 5 && world === 'vr') newElements.push('new_skill');

  // Word target
  const wordTargets = { short: 800, medium: 1200, long: 2000 };

  // ─── New narrative intelligence ─────────────────────────────────────────────
  const mcStage = bible.mcPsychology.stage;

  // Determine exploit directive based on progression and chapter
  let exploitDirective: ExploitDirective | null = null;
  const activeExploits = bible.exploits.filter(e => e.status === 'actively_used' || e.status === 'confirmed');
  if (chapterNumber > 3 && rng() > 0.6) {
    if (activeExploits.length === 0) {
      exploitDirective = { type: 'discover', exploitId: null, context: 'MC stumbles upon an unintended interaction' };
    } else if (rng() > 0.5) {
      exploitDirective = { type: 'use', exploitId: pick(activeExploits, rng).id, context: 'MC leverages a known exploit' };
    } else {
      exploitDirective = { type: 'test', exploitId: null, context: 'MC experiments with game boundaries' };
    }
  }

  // Concealment pressure scales with heat level and chapter
  const heatLevel = bible.concealmentState.heatLevel;
  const concealmentPressure: ChapterBlueprint['concealmentPressure'] =
    heatLevel > 80 ? 'critical' :
    heatLevel > 60 ? 'high' :
    heatLevel > 35 ? 'medium' :
    heatLevel > 15 ? 'low' : 'none';

  // Close calls happen when heat is building and it's been a while
  const chaptersSinceCC = Math.min(
    bible.concealmentState.vrConcealment.chaptersSinceCloseCall,
    bible.concealmentState.realConcealment.chaptersSinceCloseCall,
  );
  const closeCallScheduled = concealmentPressure !== 'none' && chaptersSinceCC >= 3 && rng() > 0.5;

  // Character growth beat based on psychology
  const growthBeats: string[] = [];
  if (bible.mcPsychology.selfAwareness < 40) growthBeats.push('MC notices another change but dismisses it');
  if (bible.mcPsychology.moralFlexibility > 50) growthBeats.push('MC rationalizes a questionable choice');
  if (bible.mcPsychology.addictionLevel > 60) growthBeats.push('MC struggles to log off / resist using powers');
  if (bible.mcPsychology.controlNeed > 70) growthBeats.push('MC micro-manages a situation to maintain control');
  growthBeats.push('MC reflects on how much has changed since the beginning');
  const characterGrowthBeat = growthBeats.length > 0 ? pick(growthBeats, rng) : null;

  // Relationship focus
  const dynamics = bible.relationshipDynamics;
  const relationshipFocus = dynamics.length > 0 ? pick(dynamics, rng).characterId : null;

  // Lore reveal (every few chapters)
  const loreReveal = chapterNumber > 2 && rng() > 0.65
    ? pick(['progenitor_history', 'transfer_mechanics', 'game_origin', 'sealed_content', 'yuna_connection'], rng)
    : null;

  // Transfer event (rare but impactful)
  const transferEvent = world === 'real' && rng() > 0.75
    ? 'A new game attribute manifests in the real world'
    : world === 'vr' && rng() > 0.85
      ? 'A real-world experience influences game performance'
      : null;

  return {
    chapterNumber,
    world,
    arcPhase,
    primaryFocus,
    secondaryFocus: pick(EMOTIONAL_TARGETS, rng),
    requiredPlotBeats: activePlots.slice(0, 1).map(p => p.nextBeat),
    suggestedScenes: [],
    charactersToInclude,
    locationsToUse,
    emotionalTarget: pick(EMOTIONAL_TARGETS, rng),
    tensionTarget: Math.min(100, bible.pacingState.tensionLevel + (config.tension > 5 ? 5 : -3)),
    wordTarget: wordTargets.long,
    mustAdvancePlots,
    foreshadowingToPlant: toPlant,
    foreshadowingToPayoff: toPayoff,
    secretsAtRisk,
    newElementsToIntroduce: newElements,

    // Narrative intelligence
    mcStage,
    exploitDirective,
    concealmentPressure,
    closeCallScheduled,
    characterGrowthBeat,
    relationshipFocus,
    loreReveal,
    transferEvent,
  };
}

// ─── SeriesBible Update After Chapter ────────────────────────────────────────

export interface ChapterMetadata {
  chapterNumber: number;
  world: World;
  characters: string[];
  locations: string[];
  newCharacters: string[];
  newLocations: string[];
  skillsUsed: string[];
  itemsGained: string[];
  emotionalTone: string;
  arcPhase: ArcPhase;
  tensionLevel: number;
  plotThreadsAdvanced: string[];
  foreshadowingPlanted: ForeshadowingSeed[];
  foreshadowingPaidOff: string[];
  primaryFocus: string;
}

export function updateSeriesBible(bible: SeriesBible, meta: ChapterMetadata): SeriesBible {
  const updated = structuredClone(bible);
  const ch = meta.chapterNumber;

  // Update lastGeneratedChapter
  updated.lastGeneratedChapter = ch;

  // Update character appearances
  for (const charName of meta.characters) {
    const record = updated.characters.find(c => c.name === charName || c.id === charName);
    if (record) {
      record.lastAppearance = ch;
      if (!record.appearances.includes(ch)) record.appearances.push(ch);
    }
  }

  // Add new characters to the bible
  for (const name of meta.newCharacters) {
    if (!updated.characters.find(c => c.name === name)) {
      updated.characters.push({
        id: `char-${name.toLowerCase().replace(/\s+/g, '-')}-${ch}`,
        name,
        world: meta.world,
        role: 'neutral',
        description: `Character encountered in chapter ${ch}`,
        personality: [],
        motivations: [],
        secrets: [],
        firstAppearance: ch,
        lastAppearance: ch,
        appearances: [ch],
        status: 'alive',
        relationships: [],
        developmentArc: [],
        currentGoal: '',
        quirks: [],
        dialogue_style: '',
        knowledge: [],
        trustOfMC: 0,
      });
    }
  }

  // Update location visits
  for (const locName of meta.locations) {
    const loc = updated.locations.find(l => l.name === locName);
    if (loc) {
      loc.lastVisited = ch;
      loc.visits++;
    }
  }

  // Add new locations
  for (const name of meta.newLocations) {
    if (!updated.locations.find(l => l.name === name)) {
      updated.locations.push({
        id: `loc-${name.toLowerCase().replace(/\s+/g, '-')}-${ch}`,
        name,
        world: meta.world,
        description: `Location discovered in chapter ${ch}`,
        type: 'unknown',
        discoveredChapter: ch,
        lastVisited: ch,
        visits: 1,
        secrets: [],
        connectedLocations: [],
        dangerLevel: 3,
        currentState: 'Newly discovered',
        npcsPresent: [],
        availableQuests: [],
      });
    }
  }

  // Add timeline event
  updated.timeline.push({
    chapter: ch,
    world: meta.world,
    event: `Chapter ${ch}: ${meta.primaryFocus} focus, ${meta.emotionalTone} tone`,
    significance: meta.tensionLevel > 70 ? 'major' : meta.tensionLevel > 40 ? 'moderate' : 'minor',
    involvedCharacters: meta.characters,
    consequences: [],
  });

  // Add planted foreshadowing
  for (const fs of meta.foreshadowingPlanted) {
    if (!updated.foreshadowing.find(f => f.id === fs.id)) {
      updated.foreshadowing.push(fs);
    }
  }

  // Mark paid-off foreshadowing
  for (const fsId of meta.foreshadowingPaidOff) {
    const fs = updated.foreshadowing.find(f => f.id === fsId);
    if (fs && !fs.payoffChapter) {
      fs.payoffChapter = ch;
    }
  }

  // Advance plot threads
  for (const ptId of meta.plotThreadsAdvanced) {
    const pt = updated.plotThreads.find(p => p.id === ptId);
    if (pt) {
      pt.currentProgress = `Advanced in chapter ${ch}`;
    }
  }

  // Update MC stats based on chapter
  const level = Math.floor(ch / 2) + 1;
  updated.mcStats.level = level;
  updated.mcStats.experience = level * 100;
  updated.mcStats.strength = 8 + level;
  updated.mcStats.agility = 10 + level;
  updated.mcStats.intelligence = 12 + Math.floor(level / 2);
  updated.mcStats.maxHealth = 100 + level * 20;
  updated.mcStats.health = updated.mcStats.maxHealth;
  updated.mcStats.maxMana = 50 + level * 15;
  updated.mcStats.mana = updated.mcStats.maxMana;

  // Update emotional state
  updated.mcEmotionalState.mood = meta.emotionalTone;
  updated.mcEmotionalState.stressLevel = Math.min(100, 30 + meta.tensionLevel * 0.5);
  updated.mcEmotionalState.paranoia = Math.min(100, 20 + ch * 2);

  // Update pacing state
  const ps = updated.pacingState;
  ps.tensionLevel = meta.tensionLevel;
  ps.currentArc = advanceArcPhase(ps.currentArc);

  // Update cooldowns
  if (meta.primaryFocus === 'action') { ps.actionCooldown = 0; } else { ps.actionCooldown++; }
  if (meta.primaryFocus === 'lore') { ps.loreCooldown = 0; } else { ps.loreCooldown++; }
  if (meta.primaryFocus === 'emotional' || meta.primaryFocus === 'character') { ps.emotionalCooldown = 0; } else { ps.emotionalCooldown++; }
  if (meta.primaryFocus === 'revelation') { ps.revelationCooldown = 0; } else { ps.revelationCooldown++; }

  if (meta.newCharacters.length > 0) { ps.chaptersSinceNewCharacter = 0; } else { ps.chaptersSinceNewCharacter++; }
  if (meta.newLocations.length > 0) { ps.chaptersSinceNewLocation = 0; } else { ps.chaptersSinceNewLocation++; }
  ps.chaptersSinceNewSkill++;

  ps.recentSceneTypes = [...ps.recentSceneTypes.slice(-4), meta.primaryFocus];
  ps.suggestedNextTone = meta.tensionLevel > 60 ? 'light' : 'dark';

  // ─── Update deep narrative systems ──────────────────────────────────────────

  // MC Psychology evolution — gradual shifts based on chapter events
  const psych = updated.mcPsychology;
  psych.selfAwareness = Math.min(100, psych.selfAwareness + 2);
  psych.addictionLevel = Math.min(100, psych.addictionLevel + 1);
  if (meta.tensionLevel > 60) {
    psych.controlNeed = Math.min(100, psych.controlNeed + 3);
    psych.paranoia = Math.min(100, (updated.mcEmotionalState.paranoia || 0) + 2);
  }
  // Moral flexibility creeps up as MC uses more exploits
  if (updated.exploits.filter(e => e.status === 'actively_used').length > 0) {
    psych.moralFlexibility = Math.min(100, psych.moralFlexibility + 2);
    psych.rationalizationTendency = Math.min(100, psych.rationalizationTendency + 1);
  }

  // Concealment state — heat rises slowly, close call counters tick
  const cs = updated.concealmentState;
  cs.vrConcealment.chaptersSinceCloseCall++;
  cs.realConcealment.chaptersSinceCloseCall++;
  // Heat naturally rises with more chapters (more to hide)
  cs.heatLevel = Math.min(100, cs.heatLevel + 1);
  // Real-world concealment gets harder as more transfers happen
  if (updated.transferLog.length > 2) {
    cs.realConcealment.risk = cs.heatLevel > 60 ? 'suspected' : cs.heatLevel > 30 ? 'noticed' : 'safe';
  }

  // Progression arc — check if stage should advance
  const arc = updated.progressionArc;
  const STAGE_ORDER: ProgressionStage[] = [
    'naive_player', 'curious_tester', 'opportunist',
    'paranoid_hider', 'strategic_abuser', 'seasoned_survivor',
  ];
  const currentIdx = STAGE_ORDER.indexOf(arc.currentStage);
  // Advance stage based on chapter count and exploit usage as a simple heuristic
  const shouldAdvance =
    (arc.currentStage === 'naive_player' && ch >= 5) ||
    (arc.currentStage === 'curious_tester' && ch >= 10 && arc.exploitUsageCount >= 1) ||
    (arc.currentStage === 'opportunist' && ch >= 18 && arc.closeCallCount >= 2) ||
    (arc.currentStage === 'paranoid_hider' && ch >= 28 && arc.exploitUsageCount >= 5) ||
    (arc.currentStage === 'strategic_abuser' && ch >= 40 && arc.closeCallCount >= 5);

  if (shouldAdvance && currentIdx < STAGE_ORDER.length - 1) {
    const oldStage = arc.currentStage;
    const newStage = STAGE_ORDER[currentIdx + 1];
    // Close out old stage
    const oldEntry = arc.stageHistory.find(s => s.stage === oldStage && s.exited === null);
    if (oldEntry) oldEntry.exited = ch;
    // Enter new stage
    arc.currentStage = newStage;
    arc.stageEnteredChapter = ch;
    arc.stageHistory.push({ stage: newStage, entered: ch, exited: null, definingMoment: `Advanced in chapter ${ch}` });
    // Sync psychology stage
    psych.stage = newStage;
    // Game perception evolves with stage
    const perceptionMap: Record<ProgressionStage, MCPsychology['gamePerception']> = {
      'naive_player': 'entertainment',
      'curious_tester': 'tool',
      'opportunist': 'tool',
      'paranoid_hider': 'trap',
      'strategic_abuser': 'weapon',
      'seasoned_survivor': 'second_life',
    };
    psych.gamePerception = perceptionMap[newStage];
  }

  // Relationship dynamics — guilt increases when hiding more
  for (const rel of updated.relationshipDynamics) {
    const char = updated.characters.find(c => c.id === rel.characterId);
    if (char && meta.characters.includes(char.id)) {
      // If MC interacted with this character, guilt builds from the deception
      if (rel.hidingFrom.length > 0) {
        rel.guiltLevel = Math.min(100, rel.guiltLevel + 2);
      }
    }
  }

  return updated;
}
