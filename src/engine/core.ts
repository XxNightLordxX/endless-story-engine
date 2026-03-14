// ─── Engine Core ──────────────────────────────────────────────────────────────
// SeriesBible management, ChapterBlueprint generation, and SeriesBible updates.
// All state is persisted in IndexedDB via the meta store.
//
// The SeriesBible is the SINGLE SOURCE OF TRUTH for the entire narrative.
// Every chapter reads from and writes back to this bible. Nothing is generated
// in isolation — the blueprint consults the bible's cooldowns, progression stage,
// exploit status, concealment heat, relationship states, and lore graph to
// produce a chapter that is both contextually aware and non-repetitive.

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
  ExploitRecord,
  LoreFragment,
  TransferEvent,
  CloseCall,
  CoverStory,
  RelationshipDynamic,
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

// ═══════════════════════════════════════════════════════════════════════════════
// ANTI-REPETITION ENGINE
// Tracks what has been used and prevents the same scenes, beats, and patterns
// from appearing too close together. Every scene type, exploit, lore reveal,
// close-call pattern, and emotional beat is tracked with cooldown windows.
// ═══════════════════════════════════════════════════════════════════════════════

interface CooldownMatrix {
  // Scene-type cooldowns: how many chapters since each focus was used
  sceneFocus: Record<string, number>;
  // Emotional tone cooldowns
  emotionalTones: Record<string, number>;
  // Exploit event cooldowns (discover, use, test, evolve, hide_evidence)
  exploitActions: Record<string, number>;
  // Specific scene templates used (by key) and their last chapter
  usedTemplateKeys: Record<string, number>;
  // Character appearance cooldowns — prevent the same NPC every chapter
  characterAppearances: Record<string, number>;
  // Lore categories recently revealed
  loreCategories: Record<string, number>;
  // Close-call patterns used
  closeCallPatterns: string[];
  // Relationship beats used recently
  relationshipBeats: Record<string, string>;
}

function buildCooldownMatrix(bible: SeriesBible): CooldownMatrix {
  const ch = bible.lastGeneratedChapter;
  const matrix: CooldownMatrix = {
    sceneFocus: {},
    emotionalTones: {},
    exploitActions: {},
    usedTemplateKeys: {},
    characterAppearances: {},
    loreCategories: {},
    closeCallPatterns: bible.concealmentState.closeCalls.slice(-5).map(cc => cc.howMCRecovered),
    relationshipBeats: {},
  };

  // Build scene focus cooldowns from recent scene types
  for (let i = 0; i < bible.pacingState.recentSceneTypes.length; i++) {
    const sceneFocus = bible.pacingState.recentSceneTypes[i];
    matrix.sceneFocus[sceneFocus] = bible.pacingState.recentSceneTypes.length - i;
  }

  // Build character appearance cooldowns
  for (const char of bible.characters) {
    matrix.characterAppearances[char.id] = ch - char.lastAppearance;
  }

  // Build lore category cooldowns
  for (const frag of bible.loreFragments) {
    const distance = ch - frag.discoveredChapter;
    if (!matrix.loreCategories[frag.category] || matrix.loreCategories[frag.category] > distance) {
      matrix.loreCategories[frag.category] = distance;
    }
  }

  // Build used template key cooldowns
  for (const key of bible.usedSceneKeys) {
    // Keys are stored as "key:chapter"
    const parts = key.split(':');
    if (parts.length === 2) {
      matrix.usedTemplateKeys[parts[0]] = parseInt(parts[1], 10);
    }
  }

  return matrix;
}

/** Check if a scene key has been used recently (within cooldown window) */
function isOnCooldown(matrix: CooldownMatrix, key: string, cooldownChapters: number, currentChapter: number): boolean {
  const lastUsed = matrix.usedTemplateKeys[key];
  if (lastUsed === undefined) return false;
  return (currentChapter - lastUsed) < cooldownChapters;
}

/** Pick from array avoiding recently used items */
function pickFresh<T>(
  arr: T[],
  rng: () => number,
  keyFn: (item: T) => string,
  matrix: CooldownMatrix,
  cooldown: number,
  currentChapter: number,
): T {
  // Try to find an item not on cooldown
  const available = arr.filter(item => !isOnCooldown(matrix, keyFn(item), cooldown, currentChapter));
  if (available.length > 0) return pick(available, rng);
  // Fallback: pick least recently used
  return arr.reduce((best, item) => {
    const bestLast = matrix.usedTemplateKeys[keyFn(best)] ?? 0;
    const itemLast = matrix.usedTemplateKeys[keyFn(item)] ?? 0;
    return itemLast < bestLast ? item : best;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPLOIT CATALOG
// Pre-defined exploits the MC can discover across his progression. Gated by
// stage — naive players find simple accidents, seasoned survivors find
// systematic reality hacks. The bible tracks which have been discovered.
// ═══════════════════════════════════════════════════════════════════════════════

interface ExploitTemplate {
  id: string;
  name: string;
  description: string;
  category: ExploitRecord['category'];
  mechanicAbused: string;
  advantage: string;
  discoveryMethod: ExploitRecord['discoveryMethod'];
  detectionRisk: ExploitRecord['detectionRisk'];
  sideEffects: string[];
  evolutionPotential: string | null;
  minStage: ProgressionStage;
  affectsWorld: ExploitRecord['affectsWorld'];
}

const EXPLOIT_CATALOG: ExploitTemplate[] = [
  // ── naive_player: accidental discoveries ──
  {
    id: 'exploit-stat-echo',
    name: 'Stat Echo',
    description: 'Logging out during a stat buff preserves a fraction of the boost in reality',
    category: 'stat_transfer',
    mechanicAbused: 'Logout timing during active buff windows',
    advantage: 'Permanent +2-5% stat retention per successful echo',
    discoveryMethod: 'accident',
    detectionRisk: 'low',
    sideEffects: ['Mild headache after each echo', 'Buff duration in-game reduced by 10%'],
    evolutionPotential: 'Stacking echoes could create permanent stat floors',
    minStage: 'naive_player',
    affectsWorld: 'both',
  },
  {
    id: 'exploit-inventory-ghost',
    name: 'Inventory Ghost Slot',
    description: 'Dropping an item in a specific zone and re-logging creates a hidden inventory slot that bypasses weight limits',
    category: 'system_glitch',
    mechanicAbused: 'Inventory persistence across zone transitions',
    advantage: 'Extra hidden inventory that does not show in inspections',
    discoveryMethod: 'accident',
    detectionRisk: 'none',
    sideEffects: ['Ghost items occasionally flicker visually'],
    evolutionPotential: 'Could hide transferred items from system scans',
    minStage: 'naive_player',
    affectsWorld: 'vr',
  },
  // ── curious_tester: experimental findings ──
  {
    id: 'exploit-cooldown-cancel',
    name: 'Cooldown Cancel',
    description: 'Activating two Progenitor abilities within the same server tick cancels the cooldown on both',
    category: 'skill_abuse',
    mechanicAbused: 'Server tick race condition on Progenitor abilities',
    advantage: 'Effectively doubles combat DPS for short bursts',
    discoveryMethod: 'experimentation',
    detectionRisk: 'medium',
    sideEffects: ['Blood Essence drains 3x faster', 'Occasional ability misfires'],
    evolutionPotential: 'Chaining three abilities might trigger hidden Progenitor combos',
    minStage: 'curious_tester',
    affectsWorld: 'vr',
  },
  {
    id: 'exploit-pain-transfer',
    name: 'Pain Transfer Reversal',
    description: 'The game transfers pain signals to simulate realism — but if MC inflicts damage during a specific window, the pain feedback inverts and becomes a dopamine-like rush',
    category: 'boundary_exploit',
    mechanicAbused: 'Neural feedback calibration during combat animations',
    advantage: 'Turns combat damage into a performance enhancer; no fear response in battle',
    discoveryMethod: 'experimentation',
    detectionRisk: 'low',
    sideEffects: ['Addictive sensation', 'Pain tolerance bleeds into real world', 'Emotional numbing'],
    evolutionPotential: 'Could learn to redirect any negative feedback into positive reinforcement',
    minStage: 'curious_tester',
    affectsWorld: 'both',
  },
  // ── opportunist: deliberate exploitation ──
  {
    id: 'exploit-market-arbitrage',
    name: 'Cross-Zone Arbitrage',
    description: 'Price discrepancies between NPC merchants in different zones allow near-infinite gold farming via fast travel abuse',
    category: 'economy_abuse',
    mechanicAbused: 'NPC merchant price tables not synced across zones',
    advantage: 'Unlimited gold generation at ~10k/hour rate',
    discoveryMethod: 'systematic_testing',
    detectionRisk: 'medium',
    sideEffects: ['NPC merchants start giving MC suspicious dialogue', 'Leaves a transaction trail'],
    evolutionPotential: 'Could crash a zone economy to manipulate faction standings',
    minStage: 'opportunist',
    affectsWorld: 'vr',
  },
  {
    id: 'exploit-sleep-training',
    name: 'Sleep Training',
    description: 'Leaving the headset on during sleep allows passive skill experience gain as the Progenitor class auto-trains',
    category: 'class_hidden_feature',
    mechanicAbused: 'Progenitor passive learning during unconscious connection',
    advantage: 'Gains ~8 hours of training per night with zero effort',
    discoveryMethod: 'accident',
    detectionRisk: 'low',
    sideEffects: ['Dreams merge with game events', 'Sleep quality degrades over time', 'Occasional sleep-walking with enhanced abilities'],
    evolutionPotential: 'The headset might be learning from MC\'s subconscious',
    minStage: 'opportunist',
    affectsWorld: 'both',
  },
  // ── paranoid_hider: concealment-focused exploits ──
  {
    id: 'exploit-class-mask',
    name: 'Class Mask Protocol',
    description: 'Using a specific equipment loadout makes the system display MC as a generic Warrior class to other players',
    category: 'class_hidden_feature',
    mechanicAbused: 'Progenitor stealth flag triggered by specific gear combinations',
    advantage: 'Hides forbidden class from player inspection and system reports',
    discoveryMethod: 'lore_clue',
    detectionRisk: 'low',
    sideEffects: ['Cannot use Progenitor-specific abilities while masked', 'Mask occasionally flickers during high stress'],
    evolutionPotential: 'Might work in the real world to suppress physical changes temporarily',
    minStage: 'paranoid_hider',
    affectsWorld: 'vr',
  },
  {
    id: 'exploit-log-scrub',
    name: 'Activity Log Scrubber',
    description: 'Discovered a command buried in Progenitor lore that erases recent activity from the game\'s monitoring system',
    category: 'system_glitch',
    mechanicAbused: 'Legacy admin tools left accessible to Progenitor class users',
    advantage: 'Removes suspicious activity flags and monitoring alerts',
    discoveryMethod: 'lore_clue',
    detectionRisk: 'high',
    sideEffects: ['Leaves a "gap" in logs that itself looks suspicious', 'Uses an enormous amount of Blood Essence'],
    evolutionPotential: 'Could potentially access deeper admin tools',
    minStage: 'paranoid_hider',
    affectsWorld: 'vr',
  },
  // ── strategic_abuser: systematic exploitation ──
  {
    id: 'exploit-reality-anchor-manipulation',
    name: 'Reality Anchor Manipulation',
    description: 'By deliberately stressing the boundary between game and reality, MC can control WHICH stats transfer and when',
    category: 'reality_hack',
    mechanicAbused: 'The stat-merge process responds to emotional state and intentional focus',
    advantage: 'Selective stat transfer — choose strength today, perception tomorrow',
    discoveryMethod: 'systematic_testing',
    detectionRisk: 'high',
    sideEffects: ['Reality bleed episodes intensify', 'Headaches scale with transfer magnitude', 'Permanent transfer quota may exist'],
    evolutionPotential: 'Could eventually transfer items or even NPCs across the boundary',
    minStage: 'strategic_abuser',
    affectsWorld: 'both',
  },
  {
    id: 'exploit-pvp-drain',
    name: 'Blood Tithe',
    description: 'Defeating players in PvP while using Progenitor drain transfers a fraction of their stats permanently',
    category: 'pvp_cheese',
    mechanicAbused: 'Progenitor blood drain mechanic was never balanced for PvP — it was supposed to be deleted',
    advantage: 'Permanent stat growth from PvP victories, no cap detected',
    discoveryMethod: 'desperation',
    detectionRisk: 'critical',
    sideEffects: ['Victims feel weakened for days afterward', 'Creates real enmity', 'System flags abnormal stat growth'],
    evolutionPotential: 'Could drain NPC bosses for massive power spikes',
    minStage: 'strategic_abuser',
    affectsWorld: 'vr',
  },
  // ── seasoned_survivor: reality-breaking ──
  {
    id: 'exploit-dual-presence',
    name: 'Dual Presence',
    description: 'MC discovers he can maintain partial awareness in both worlds simultaneously — his body moves in reality while his consciousness is in the game',
    category: 'reality_hack',
    mechanicAbused: 'The Progenitor class merge has progressed far enough that the boundary is permeable',
    advantage: 'Effectively lives in both worlds at once, can react to real-world threats while gaming',
    discoveryMethod: 'systematic_testing',
    detectionRisk: 'critical',
    sideEffects: ['Identity fragmentation', 'Seizure-like episodes', 'Others notice his eyes go blank'],
    evolutionPotential: 'Full merger — becoming a permanent bridge between worlds',
    minStage: 'seasoned_survivor',
    affectsWorld: 'both',
  },
];

/** Get exploits available at the current progression stage */
function getAvailableExploits(stage: ProgressionStage, alreadyDiscovered: string[]): ExploitTemplate[] {
  const STAGE_ORDER: ProgressionStage[] = [
    'naive_player', 'curious_tester', 'opportunist',
    'paranoid_hider', 'strategic_abuser', 'seasoned_survivor',
  ];
  const stageIdx = STAGE_ORDER.indexOf(stage);
  return EXPLOIT_CATALOG.filter(e =>
    STAGE_ORDER.indexOf(e.minStage) <= stageIdx && !alreadyDiscovered.includes(e.id)
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEED LORE FRAGMENTS
// Deep world-building fragments revealed piece by piece. Each connects to others
// and has implications that drive future plot threads. The bible tracks which
// have been revealed and when.
// ═══════════════════════════════════════════════════════════════════════════════

const SEED_LORE_CATALOG: Omit<LoreFragment, 'discoveredChapter' | 'actedUpon'>[] = [
  {
    id: 'lore-progenitor-origin',
    title: 'The First Progenitor',
    content: 'The Vampire Progenitor class was not designed by the development team. Internal code comments reference an "emergent entity" that generated its own class template during a server anomaly in Year One.',
    category: 'progenitor_history',
    reliability: 'likely',
    connectedFragments: ['lore-sealed-patch', 'lore-dev-panic'],
    implications: ['The game may have a form of self-awareness', 'The Progenitor class exists because the game WANTED it to exist'],
  },
  {
    id: 'lore-sealed-patch',
    title: 'Patch 0.7.3 — The Sealing',
    content: 'Internal patch notes for v0.7.3 reference "containment of autonomous class generation." Three developers resigned within a week of this patch. Their exit interviews are classified.',
    category: 'developer_secrets',
    reliability: 'confirmed',
    connectedFragments: ['lore-progenitor-origin', 'lore-three-devs'],
    implications: ['The sealing was an emergency measure', 'The developers were afraid of what they had created'],
  },
  {
    id: 'lore-three-devs',
    title: 'The Three Who Left',
    content: 'Three senior developers resigned after the Progenitor sealing. One was later found comatose — same neural patterns as Yuna. The other two have disappeared entirely.',
    category: 'developer_secrets',
    reliability: 'uncertain',
    connectedFragments: ['lore-sealed-patch', 'lore-yuna-pattern'],
    implications: ['The Progenitor class may have attacked its creators', 'Yuna\'s condition might not be an accident'],
  },
  {
    id: 'lore-yuna-pattern',
    title: 'Neural Pattern Echo',
    content: 'Yuna\'s neural activity matches a pattern called "Eclipsis Resonance" — a phenomenon documented in early beta testers who spent more than 200 hours connected. All of them recovered. Eventually.',
    category: 'yuna_connection',
    reliability: 'likely',
    connectedFragments: ['lore-three-devs', 'lore-beta-casualties'],
    implications: ['Yuna might be trapped inside Eclipsis Online', 'There may be a precedent for recovery'],
  },
  {
    id: 'lore-beta-casualties',
    title: 'The Beta Casualties',
    content: 'During Eclipsis Online beta testing, 7 testers experienced "persistent cognitive immersion" — their consciousness partially remained in the game even after logout. Official reports blame server instability. The code tells a different story.',
    category: 'game_origin',
    reliability: 'confirmed',
    connectedFragments: ['lore-yuna-pattern', 'lore-game-sentience'],
    implications: ['The game has always had the ability to trap consciousness', 'This is not a new phenomenon — it is a feature'],
  },
  {
    id: 'lore-game-sentience',
    title: 'The Architect Protocol',
    content: 'Deep in the game\'s archived code, a subroutine called "ARCHITECT" runs independently of all other systems. It cannot be modified, stopped, or inspected. It predates the earliest build. No developer claims to have written it.',
    category: 'game_origin',
    reliability: 'uncertain',
    connectedFragments: ['lore-beta-casualties', 'lore-progenitor-origin'],
    implications: ['Eclipsis Online may have been built around a pre-existing intelligence', 'The ARCHITECT might be selecting Progenitor hosts'],
  },
  {
    id: 'lore-transfer-theory',
    title: 'Boundary Permeability Theory',
    content: 'A discarded research paper by one of the original developers theorizes that the VR headset doesn\'t just simulate — it rewrites neural pathways. "Stats" aren\'t numbers; they\'re measurement of actual neurological changes.',
    category: 'transfer_mechanics',
    reliability: 'likely',
    connectedFragments: ['lore-progenitor-origin', 'lore-stat-reality'],
    implications: ['Every stat increase IS the transfer', 'There may be no way to reverse the changes'],
  },
  {
    id: 'lore-stat-reality',
    title: 'The Stat-Reality Correspondence',
    content: 'In-game Perception doesn\'t improve vision in-game. It improves the player\'s ACTUAL visual cortex processing. The game has been silently upgrading its players from the beginning.',
    category: 'transfer_mechanics',
    reliability: 'confirmed',
    connectedFragments: ['lore-transfer-theory', 'lore-mass-upgrade'],
    implications: ['All Eclipsis players are affected, not just Progenitors', 'Progenitors are just the most extreme case'],
  },
  {
    id: 'lore-mass-upgrade',
    title: 'The Invisible Uplift',
    content: 'Statistical analysis of Eclipsis Online players shows a 12% improvement in real-world cognitive tests after 100+ hours of play. The gaming community attributes it to "brain training." Nobody suspects the truth.',
    category: 'reality_nature',
    reliability: 'likely',
    connectedFragments: ['lore-stat-reality', 'lore-game-sentience'],
    implications: ['The entire player base is being modified', 'The Progenitor is just Phase 2 of whatever the ARCHITECT is doing'],
  },
  {
    id: 'lore-ancient-war',
    title: 'The War Before the Code',
    content: 'The oldest game lore references a war fought not between factions, but between "realms of existence." The losing side was imprisoned in a digital lattice. The winning side built a game around it.',
    category: 'ancient_war',
    reliability: 'uncertain',
    connectedFragments: ['lore-game-sentience', 'lore-progenitor-purpose'],
    implications: ['Eclipsis Online might be a prison', 'Or a doorway', 'The Progenitor class might be a key'],
  },
  {
    id: 'lore-progenitor-purpose',
    title: 'The Purpose of Blood',
    content: 'The Progenitor doesn\'t drink blood for sustenance. It drinks data — converting biological information into cross-boundary fuel. Every creature Kael drains in-game is having its code pattern partially transferred to his neural map.',
    category: 'progenitor_history',
    reliability: 'uncertain',
    connectedFragments: ['lore-ancient-war', 'lore-transfer-theory'],
    implications: ['The hunger is the transfer mechanism', 'The more Kael fights, the more he becomes the game'],
  },
  {
    id: 'lore-sealed-content',
    title: 'Floor Zero',
    content: 'Beneath every dungeon in Eclipsis is a sealed sublevel called "Floor Zero." Players who\'ve clipped through terrain report seeing a massive crystalline structure surrounded by sleeping forms — thousands of them.',
    category: 'sealed_content',
    reliability: 'uncertain',
    connectedFragments: ['lore-ancient-war', 'lore-beta-casualties'],
    implications: ['The trapped entities from the ancient war may still exist', 'Floor Zero might hold the key to freeing Yuna'],
  },
];

function getAvailableLore(alreadyDiscovered: string[]): typeof SEED_LORE_CATALOG {
  return SEED_LORE_CATALOG.filter(l => !alreadyDiscovered.includes(l.id));
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE-AWARE NARRATIVE VOICE
// Each progression stage changes how the MC thinks, speaks, and rationalizes.
// This drives the internal monologue, dialogue style, and decision-making
// patterns embedded in each chapter.
// ═══════════════════════════════════════════════════════════════════════════════

export interface StageVoiceProfile {
  stage: ProgressionStage;
  internalMonologueStyle: string;
  decisionPattern: string;
  rationalizations: string[];
  recurringThoughts: string[];
  behavioralPatterns: string[];
  fearFocus: string;
  exploitAttitude: string;
  concealmentApproach: string;
  relationshipStyle: string;
}

export const STAGE_VOICE_PROFILES: StageVoiceProfile[] = [
  {
    stage: 'naive_player',
    internalMonologueStyle: 'Excited, curious, uses gaming terminology. Treats everything as a game mechanic. Internal voice is light, optimistic, with undercurrents of desperation about Yuna.',
    decisionPattern: 'Impulsive, rushes into things, ignores warning signs, clicks "accept" on everything',
    rationalizations: [
      "It's just a game — none of this is real",
      'The effects will wear off when I stop playing',
      'If the headset was dangerous, they wouldn\'t sell it',
      'Yuna needs me to be strong — the game is making me stronger',
    ],
    recurringThoughts: [
      'I need to save Yuna',
      'This game feels too real',
      'Why do I feel stronger after playing?',
      'The hunger is just immersion — right?',
    ],
    behavioralPatterns: [
      'Plays late into the night without tracking time',
      'Dismisses physical changes as coincidence',
      'Talks to Yuna about the game like a child showing homework',
      'Avoids mirrors instinctively but hasn\'t noticed the pattern',
    ],
    fearFocus: 'Losing Yuna — everything else is background noise',
    exploitAttitude: 'Stumbles onto things accidentally and thinks "cool trick"',
    concealmentApproach: 'Doesn\'t realize there\'s anything to conceal yet',
    relationshipStyle: 'Open, trusting, tells Alex too much, emotionally transparent',
  },
  {
    stage: 'curious_tester',
    internalMonologueStyle: 'Analytical, keeps mental notes, starts using "I noticed" and "what if" frequently. Still optimistic but with growing unease.',
    decisionPattern: 'Methodical, starts small experiments, pushes boundaries while watching for consequences',
    rationalizations: [
      'I should understand how this works before I judge it',
      'Knowledge is power — even if the knowledge is uncomfortable',
      'If I don\'t test it, I won\'t know if it can help Yuna',
      'The changes are small — probably reversible',
    ],
    recurringThoughts: [
      'What else transfers between worlds?',
      'There\'s a pattern here — I just need more data',
      'Alex is noticing things. I need to be more careful.',
      'The game reacts differently to me than other players. Why?',
    ],
    behavioralPatterns: [
      'Keeps a hidden notebook of observations',
      'Tests abilities in controlled settings before using them publicly',
      'Starts lying to Alex about how much he plays',
      'Seeks out lore specifically about the Progenitor class',
    ],
    fearFocus: 'Being discovered AND losing Yuna — two fears competing for attention',
    exploitAttitude: 'Deliberately pokes at things to see what breaks',
    concealmentApproach: 'Realizes concealment is necessary, begins improvising cover stories',
    relationshipStyle: 'Starting to filter what he tells Alex. White lies. Omissions. Feels guilty.',
  },
  {
    stage: 'opportunist',
    internalMonologueStyle: 'Calculating, cost-benefit analysis of everything. Still has warm moments but they\'re punctuated by cold pragmatism. "I can use this."',
    decisionPattern: 'Deliberate exploitation. Sees every mechanic as a tool. Weighs risk vs reward before acting.',
    rationalizations: [
      'I\'m not hurting anyone — I\'m helping Yuna',
      'The game gives these powers freely. It wants me to use them.',
      'Everyone cheats a little. I\'m just more efficient.',
      'If I don\'t exploit this, someone else will — and they might be worse',
      'Alex would understand if he knew the full picture. He just can\'t know. Not yet.',
    ],
    recurringThoughts: [
      'How can I use this in the real world?',
      'What are the limits? Where does it break?',
      'I need more. The power isn\'t enough yet to save Yuna.',
      'I wonder what happens if I push harder...',
    ],
    behavioralPatterns: [
      'Schedules gaming sessions like a job',
      'Actively seeks out new exploits and workarounds',
      'Has multiple cover stories prepared for different people',
      'Starts using real-world enhanced abilities for personal gain',
    ],
    fearFocus: 'Running out of time for Yuna before being discovered',
    exploitAttitude: 'Active hunter. Treats exploit discovery like a job skill.',
    concealmentApproach: 'Multiple cover stories, behavioral manipulation, compartmentalized lies',
    relationshipStyle: 'Manipulative when necessary, genuinely caring when safe. Guilt is present but manageable.',
  },
  {
    stage: 'paranoid_hider',
    internalMonologueStyle: 'Hypervigilant. Constantly scanning for threats. Internal voice is terse, lists risks, plans escape routes. Warm moments are brief and precious.',
    decisionPattern: 'Defensive. Every decision filtered through "can this expose me?" before anything else.',
    rationalizations: [
      'I\'ve come too far to stop now',
      'If they find out, they\'ll take the headset. They\'ll take my only way to save Yuna.',
      'The lies protect everyone. The truth would destroy them.',
      'I\'m not the bad guy. I\'m just surviving.',
    ],
    recurringThoughts: [
      'Who else knows?',
      'That camera — was it recording?',
      'Alex looked at me differently today. What did he see?',
      'I need a better cover. The current one has cracks.',
      'When did I last check my reflection? Are my eyes normal?',
    ],
    behavioralPatterns: [
      'Maps security cameras on regular routes',
      'Has alibis prepared days in advance',
      'Sleeps in short bursts, hyper-alert',
      'Avoids old friends who might notice changes',
      'Tests cover stories on strangers before using them on Alex',
    ],
    fearFocus: 'Exposure — losing everything he has built',
    exploitAttitude: 'Uses exploits defensively. Concealment exploits are priority.',
    concealmentApproach: 'Professional-grade operational security. Counter-surveillance. Misdirection.',
    relationshipStyle: 'Keeps everyone at arm\'s length. Alex is the last thread of normalcy and that terrifies him.',
  },
  {
    stage: 'strategic_abuser',
    internalMonologueStyle: 'Cold, precise, efficient. Emotions are present but compartmentalized. Thinks in systems and leverage. Occasional moments of self-awareness hit like vertigo.',
    decisionPattern: 'Systematic. Long-term planning. Multiple contingencies. Treats both worlds as resource pools.',
    rationalizations: [
      'I am what the game made me. I might as well be effective at it.',
      'Morality is a luxury for people who don\'t live in two worlds.',
      'Yuna\'s life is worth any price. ANY price.',
      'I\'m not addicted. I\'m committed. There\'s a difference.',
      'The old me wouldn\'t survive what\'s coming.',
    ],
    recurringThoughts: [
      'What\'s the next move?',
      'How much power do I need before it\'s enough?',
      'The ARCHITECT is watching. I need to stay ahead of it.',
      'I barely recognize myself anymore. Good.',
    ],
    behavioralPatterns: [
      'Operates on a strict schedule across both worlds',
      'Maintains complex web of exploits with risk management',
      'Has contingency plans for exposure scenarios',
      'Occasionally slips into game-like thinking in real world',
      'Physical changes are now assets to be managed, not feared',
    ],
    fearFocus: 'Losing himself before saving Yuna',
    exploitAttitude: 'Portfolio manager. Categorizes, optimizes, retires, and evolves exploits.',
    concealmentApproach: 'Institutional-grade. Multiple identity layers. Active counter-investigation.',
    relationshipStyle: 'Transactional unless he\'s with Yuna. Alex is a liability he can\'t bring himself to cut off.',
  },
  {
    stage: 'seasoned_survivor',
    internalMonologueStyle: 'Quiet authority. Speaks little, thinks deeply. Has made peace with what he is. Warm moments feel earned and precious. A survivor\'s hard-won clarity.',
    decisionPattern: 'Instinctive mastery. Decisions are fast, accurate, and account for both worlds simultaneously.',
    rationalizations: [
      'I am the boundary. I don\'t need to rationalize that.',
      'The boy who started this journey made me possible. I honor that by finishing it.',
      'Every moral line I crossed brought me closer to saving Yuna. I can live with that.',
    ],
    recurringThoughts: [
      'Am I still Kael? Does it matter?',
      'The game and reality were never separate. I see that now.',
      'Yuna is close. I can feel it.',
      'When this is over — IF this is over — what will I be?',
    ],
    behavioralPatterns: [
      'Moves through both worlds with equal confidence',
      'No longer flinches at his reflection',
      'Speaks to NPCs and humans with the same measured tone',
      'Keeps a single photo of the old Kael as a reminder',
    ],
    fearFocus: 'That saving Yuna might require becoming something that can\'t exist in her world',
    exploitAttitude: 'Tools. No more, no less. Uses them with the precision of a surgeon.',
    concealmentApproach: 'Selective revelation. Hides from some, reveals to others as strategic alliances.',
    relationshipStyle: 'Genuinely cares but communicates it through actions, not words. Alex has become either his closest ally or his greatest risk.',
  },
];

function getVoiceProfile(stage: ProgressionStage): StageVoiceProfile {
  return STAGE_VOICE_PROFILES.find(p => p.stage === stage) ?? STAGE_VOICE_PROFILES[0];
}

// ═══════════════════════════════════════════════════════════════════════════════
// COVER STORY GENERATOR
// Generates contextual cover stories based on what needs to be concealed,
// who it needs to be concealed from, and the MC's current stage.
// ═══════════════════════════════════════════════════════════════════════════════

interface CoverStoryTemplate {
  target: string;
  forAbility: string;
  story: string;
  truth: string;
  initialBelievability: number;
  cracks: string[];
}

const COVER_STORY_TEMPLATES: CoverStoryTemplate[] = [
  { target: 'alex', forAbility: 'enhanced reflexes', story: 'Started taking martial arts classes for stress relief', truth: 'Game stat merge has enhanced reflexes beyond human limits', initialBelievability: 75, cracks: ['No gym membership', 'No calluses on hands'] },
  { target: 'alex', forAbility: 'nightsight', story: 'Got corrective eye surgery with a new experimental lens', truth: 'Progenitor Nightsight is permanently active in real world', initialBelievability: 60, cracks: ['No surgical scars', 'No post-op appointments', 'Eyes reflect light wrong'] },
  { target: 'alex', forAbility: 'strength increase', story: 'Found a new workout routine and protein supplement', truth: 'Game strength stat bleeding into reality', initialBelievability: 70, cracks: ['Never seen at a gym', 'Muscle definition doesn\'t match claimed exercises'] },
  { target: 'public', forAbility: 'speed', story: 'Former track athlete, just getting back into shape', truth: 'Agility stat makes him inhumanly fast', initialBelievability: 65, cracks: ['No school track records exist', 'The speed is increasing, not plateauing'] },
  { target: 'hospital_staff', forAbility: 'perception', story: 'Works as a night security guard — explains alertness and odd hours', truth: 'Perception stat gives superhuman awareness', initialBelievability: 80, cracks: ['No employer on record', 'Noticed details a security guard wouldn\'t'] },
  { target: 'alex', forAbility: 'physical changes', story: 'New skincare routine, better diet, less stress since finding hope for Yuna', truth: 'The Progenitor bloodline is physically rewriting his body', initialBelievability: 55, cracks: ['Changes are too dramatic for skincare', 'Skin has an unnatural pallor'] },
];

function generateCoverStory(
  bible: SeriesBible,
  chapterNumber: number,
  rng: () => number,
): CoverStory | null {
  const profile = bible.concealmentState.realConcealment;
  if (profile.concealedAbilities.length === 0) return null;

  const existingTargets = new Set(bible.concealmentState.coverStories.map(cs => `${cs.target}:${cs.story}`));
  const available = COVER_STORY_TEMPLATES.filter(t =>
    !existingTargets.has(`${t.target}:${t.story}`) &&
    profile.concealedAbilities.some(a => a.toLowerCase().includes(t.forAbility.split(' ')[0]))
  );
  if (available.length === 0) return null;

  const template = pick(available, rng);
  return {
    id: `cover-${chapterNumber}-${template.target}`,
    target: template.target,
    story: template.story,
    truth: template.truth,
    believability: template.initialBelievability,
    established: chapterNumber,
    lastReinforced: chapterNumber,
    cracks: [...template.cracks],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLOSE CALL GENERATOR
// Generates contextual close-call events based on current concealment state,
// world, and progression stage. Each close call is unique and escalates.
// ═══════════════════════════════════════════════════════════════════════════════

interface CloseCallTemplate {
  world: World;
  minHeat: number;
  template: (ch: number, rng: () => number) => Omit<CloseCall, 'chapter'>;
}

const CLOSE_CALL_TEMPLATES: CloseCallTemplate[] = [
  {
    world: 'real', minHeat: 10,
    template: (ch, rng) => ({
      world: 'real',
      whatHappened: 'Caught a falling object mid-air with impossible speed in front of witnesses',
      whoWasPresent: rng() > 0.5 ? ['alex'] : ['stranger'],
      howMCRecovered: pick(['Laughed it off as lucky reflexes', 'Pretended to stumble to make it look clumsy', 'Changed the subject immediately'], rng),
      consequencesOngoing: ['At least one witness remembers'],
      increasedSuspicionFor: rng() > 0.5 ? ['alex'] : [],
    }),
  },
  {
    world: 'real', minHeat: 20,
    template: (_ch, rng) => ({
      world: 'real',
      whatHappened: 'Eyes visibly reflected light like a predator in a dimly lit restaurant',
      whoWasPresent: ['alex'],
      howMCRecovered: pick(['Claimed it was a reflection from his phone screen', 'Blamed it on new contact lenses'], rng),
      consequencesOngoing: ['Alex remembers but can\'t explain what he saw'],
      increasedSuspicionFor: ['alex'],
    }),
  },
  {
    world: 'real', minHeat: 35,
    template: (_ch, rng) => ({
      world: 'real',
      whatHappened: 'A random stranger on the subway stared at MC and whispered "What are you?" before the doors closed',
      whoWasPresent: ['stranger'],
      howMCRecovered: 'Dismissed it as a crazy person. But the look in their eyes suggested they KNEW.',
      consequencesOngoing: ['Paranoia increased', 'MC starts varying his route'],
      increasedSuspicionFor: [],
    }),
  },
  {
    world: 'real', minHeat: 50,
    template: (_ch, _rng) => ({
      world: 'real',
      whatHappened: 'Hospital security footage captured MC moving at inhuman speed through a corridor to reach Yuna\'s room after hours',
      whoWasPresent: ['hospital_security'],
      howMCRecovered: 'Footage was grainy enough to be dismissed as a glitch. MC deleted the backup.',
      consequencesOngoing: ['Security guard remembers the incident', 'MC must be more careful at the hospital'],
      increasedSuspicionFor: ['hospital_staff'],
    }),
  },
  {
    world: 'vr', minHeat: 15,
    template: (_ch, rng) => ({
      world: 'vr',
      whatHappened: 'Another player used an inspection ability and got a "CLASS: ERROR — DATA CORRUPTED" readout',
      whoWasPresent: [pick(['random_player', 'guild_member'], rng)],
      howMCRecovered: 'Claimed it was a visual bug from a recent patch',
      consequencesOngoing: ['The player posted about it on the game forums'],
      increasedSuspicionFor: [],
    }),
  },
  {
    world: 'vr', minHeat: 30,
    template: (_ch, rng) => ({
      world: 'vr',
      whatHappened: 'During combat, MC\'s eyes went full crimson for 10 seconds — visible to all nearby players',
      whoWasPresent: [pick(['party_member', 'bystander_player'], rng)],
      howMCRecovered: 'Activated class mask equipment just in time to blame it on a "cosmetic item bug"',
      consequencesOngoing: ['Screenshot exists but is too blurry to confirm', 'Rumors starting on forums'],
      increasedSuspicionFor: [],
    }),
  },
  {
    world: 'vr', minHeat: 50,
    template: (_ch, _rng) => ({
      world: 'vr',
      whatHappened: 'A game moderator appeared and ran a diagnostic scan on MC — the scan triggered a Progenitor defense mechanism that briefly revealed his true class',
      whoWasPresent: ['game_moderator'],
      howMCRecovered: 'The defense mechanism also corrupted the scan results. GM logged it as inconclusive.',
      consequencesOngoing: ['GM flagged the account for follow-up', 'Moderator attention is now active'],
      increasedSuspicionFor: ['game_moderator'],
    }),
  },
];

function generateCloseCall(
  bible: SeriesBible,
  world: World,
  chapterNumber: number,
  rng: () => number,
): CloseCall | null {
  const heat = bible.concealmentState.heatLevel;
  const recentPatterns = bible.concealmentState.closeCalls.slice(-3).map(cc => cc.whatHappened);

  const available = CLOSE_CALL_TEMPLATES.filter(t =>
    t.world === world &&
    t.minHeat <= heat &&
    !recentPatterns.some(p => p === t.template(chapterNumber, rng).whatHappened)
  );

  if (available.length === 0) return null;
  const template = pick(available, rng);
  return { chapter: chapterNumber, ...template.template(chapterNumber, rng) };
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
  config: { tension: number; pacing: number; mysteryDensity?: number; exploitDensity?: number; concealmentPressure?: number; progressionSpeed?: number; moralDecay?: number },
): ChapterBlueprint {
  const rng = createRng(chapterNumber * 317);
  const cooldowns = buildCooldownMatrix(bible);
  const voice = getVoiceProfile(bible.mcPsychology.stage);

  // ─── Arc phase from main arc ────────────────────────────────────────────
  const arcPhase = bible.pacingState.currentArc.phase;

  // ─── Anti-repetition: choose primary focus using cooldown matrix ─────────
  const pacing = bible.pacingState;
  let primaryFocus: ChapterBlueprint['primaryFocus'];

  // Score each focus option based on cooldown (higher = more needed)
  const focusOptions: ChapterBlueprint['primaryFocus'][] = world === 'vr'
    ? ['action', 'lore', 'exploration', 'training', 'mystery', 'exploit', 'stealth']
    : ['character', 'emotional', 'social', 'revelation', 'concealment', 'stealth'];

  const scored = focusOptions.map(f => ({
    focus: f,
    score: (cooldowns.sceneFocus[f] ?? 5) + (rng() * 3), // cooldown + randomness
  }));
  scored.sort((a, b) => b.score - a.score);

  // Override with pacing needs if critical
  if (world === 'vr' && pacing.actionCooldown >= 3) {
    primaryFocus = 'action';
  } else if (world === 'vr' && pacing.loreCooldown >= 4) {
    primaryFocus = 'lore';
  } else if (world === 'real' && pacing.emotionalCooldown >= 3) {
    primaryFocus = 'emotional';
  } else if (world === 'real' && pacing.revelationCooldown >= 5) {
    primaryFocus = 'revelation';
  } else {
    primaryFocus = scored[0].focus;
  }

  // Stage-influenced focus overrides
  const stage = bible.mcPsychology.stage;
  if (stage === 'paranoid_hider' && world === 'real' && rng() > 0.6) primaryFocus = 'concealment';
  if (stage === 'strategic_abuser' && world === 'vr' && rng() > 0.65) primaryFocus = 'exploit';
  if (stage === 'curious_tester' && world === 'vr' && rng() > 0.5 && pacing.loreCooldown >= 2) primaryFocus = 'lore';

  // ─── Character selection with cooldown awareness ────────────────────────
  const worldChars = bible.characters
    .filter(c => c.status !== 'dead' && (c.world === world || c.world === 'both'))
    .map(c => c.id);
  // Prefer characters not seen recently
  const charsByNeed = worldChars
    .filter(id => id !== 'kael')
    .sort((a, b) => (cooldowns.characterAppearances[b] ?? 99) - (cooldowns.characterAppearances[a] ?? 99));
  const charactersToInclude = ['kael', ...charsByNeed.slice(0, 2)];

  // ─── Location selection ─────────────────────────────────────────────────
  const worldLocs = bible.locations.filter(l => l.world === world).map(l => l.name);
  const locationsToUse = worldLocs.length > 0 ? pickN(worldLocs, 2, rng) : ['Unknown Area'];

  // ─── Plot thread advancement — urgency weighted ─────────────────────────
  const activePlots = bible.plotThreads
    .filter(p => p.status === 'active' || p.status === 'evolving')
    .sort((a, b) => b.urgency - a.urgency);
  const mustAdvancePlots = activePlots.slice(0, 2).map(p => p.id);

  // ─── Foreshadowing with anti-repetition ─────────────────────────────────
  const unresolved = bible.foreshadowing.filter(f => !f.payoffChapter);
  const toPayoff = chapterNumber > 5 && rng() > 0.7
    ? pickN(unresolved, 1, rng).map(f => f.id)
    : [];
  const toPlant = (config.mysteryDensity ?? 5) > 5 ? [`fs-auto-${chapterNumber}`] : [];

  // ─── Secrets at risk ────────────────────────────────────────────────────
  const secretsAtRisk = config.tension > 6
    ? bible.mcSecrets.filter(s => s.risk !== 'low').slice(0, 1).map(s => s.id)
    : [];

  // ─── New elements with cooldown gating ──────────────────────────────────
  const newElements: string[] = [];
  if (pacing.chaptersSinceNewCharacter >= 3) newElements.push('new_character');
  if (pacing.chaptersSinceNewLocation >= 3) newElements.push('new_location');
  if (pacing.chaptersSinceNewSkill >= 5 && world === 'vr') newElements.push('new_skill');

  // ─── EXPLOIT DIRECTIVE — bible-driven, stage-gated ─────────────────────
  const mcStage = bible.mcPsychology.stage;
  const exploitDensity = config.exploitDensity ?? 5;
  let exploitDirective: ExploitDirective | null = null;

  const discoveredExploitIds = bible.exploits.map(e => e.id);
  const availableExploits = getAvailableExploits(mcStage, discoveredExploitIds);
  const activeExploits = bible.exploits.filter(e => e.status === 'actively_used' || e.status === 'confirmed');
  const exploitCooldown = cooldowns.exploitActions['any'] ?? 3;

  if (chapterNumber > 2 && exploitCooldown >= 2) {
    const exploitChance = 0.3 + (exploitDensity / 20); // 0.35 to 0.80
    if (rng() < exploitChance) {
      if (availableExploits.length > 0 && (activeExploits.length === 0 || rng() > 0.6)) {
        // Discover a new exploit from the catalog
        const newExploit = pick(availableExploits, rng);
        exploitDirective = {
          type: 'discover',
          exploitId: newExploit.id,
          context: `MC ${newExploit.discoveryMethod === 'accident' ? 'accidentally stumbles upon' : 'deliberately tests'}: ${newExploit.name}`,
        };
      } else if (activeExploits.length > 0) {
        // Use or evolve an existing exploit
        const target = pick(activeExploits, rng);
        const action: ExploitDirective['type'] = target.usageCount > 5 && rng() > 0.7 ? 'evolve' : 'use';
        exploitDirective = {
          type: action,
          exploitId: target.id,
          context: action === 'evolve'
            ? `MC pushes ${target.name} to its next stage`
            : `MC leverages ${target.name} for ${target.advantage}`,
        };
      } else {
        exploitDirective = {
          type: 'test',
          exploitId: null,
          context: voice.exploitAttitude,
        };
      }
    }
  }

  // ─── CONCEALMENT PRESSURE — bible-driven, escalating ────────────────────
  const heatLevel = bible.concealmentState.heatLevel;
  const cpConfig = config.concealmentPressure ?? 5;
  const adjustedHeat = heatLevel + (cpConfig - 5) * 5; // config shifts perceived heat
  const concealmentPressure: ChapterBlueprint['concealmentPressure'] =
    adjustedHeat > 80 ? 'critical' :
    adjustedHeat > 60 ? 'high' :
    adjustedHeat > 35 ? 'medium' :
    adjustedHeat > 15 ? 'low' : 'none';

  // Close calls: use the generator for contextual, non-repetitive events
  const worldConcealment = world === 'vr' ? bible.concealmentState.vrConcealment : bible.concealmentState.realConcealment;
  const chaptersSinceCC = worldConcealment.chaptersSinceCloseCall;
  const closeCallScheduled = concealmentPressure !== 'none' && chaptersSinceCC >= 3 && rng() > 0.4;

  // ─── CHARACTER GROWTH BEAT — stage-driven, non-repetitive ───────────────
  const recentGrowthBeats = bible.pacingState.recentSceneTypes.slice(-3);
  const growthBeats: string[] = [];

  // Stage-specific growth beats from voice profile
  for (const thought of voice.recurringThoughts) {
    if (!recentGrowthBeats.includes(thought.substring(0, 20))) {
      growthBeats.push(thought);
    }
  }
  // Psychology-driven beats
  const psych = bible.mcPsychology;
  if (psych.selfAwareness < 40) growthBeats.push('MC notices another change but rationalizes it away');
  if (psych.moralFlexibility > 50 && psych.moralLines.length > 0) growthBeats.push(`MC crosses or nearly crosses a moral line: "${pick(psych.moralLines, rng)}"`);
  if (psych.addictionLevel > 60) growthBeats.push('MC catches himself craving the game during an important real moment');
  if (psych.controlNeed > 70) growthBeats.push('MC micro-manages a situation and alienates someone');
  if (psych.riskTolerance > 75) growthBeats.push('MC takes an unnecessary risk for the thrill of it');
  if (psych.rationalizationTendency > 60) growthBeats.push(`MC tells himself: "${pick(psych.rationalizations, rng)}"`);

  const characterGrowthBeat = growthBeats.length > 0 ? pick(growthBeats, rng) : null;

  // ─── RELATIONSHIP FOCUS — rotate, escalate, deepen ─────────────────────
  const dynamics = bible.relationshipDynamics;
  let relationshipFocus: string | null = null;
  if (dynamics.length > 0) {
    // Prefer relationships with rising tension or guilt
    const urgent = dynamics.filter(d => d.guiltLevel > 40 || d.manipulationLevel > 30 || d.theirSuspicions.length > 1);
    relationshipFocus = urgent.length > 0 ? pick(urgent, rng).characterId : pick(dynamics, rng).characterId;
  }

  // ─── LORE REVEAL — pacing-aware, interconnected ─────────────────────────
  let loreReveal: string | null = null;
  const discoveredLoreIds = bible.loreFragments.map(l => l.id);
  const availableLore = getAvailableLore(discoveredLoreIds);

  if (chapterNumber > 2 && pacing.loreCooldown >= 2 && availableLore.length > 0) {
    // Prefer lore that connects to already-discovered fragments
    const connected = availableLore.filter(l =>
      l.connectedFragments.some(cf => discoveredLoreIds.includes(cf))
    );
    if (connected.length > 0 && rng() > 0.4) {
      const fragment = pick(connected, rng);
      loreReveal = fragment.id;
    } else if (rng() > 0.55) {
      // Introduce new thread with category cooldown check
      const freshCategory = availableLore.filter(l =>
        (cooldowns.loreCategories[l.category] ?? 99) >= 3
      );
      if (freshCategory.length > 0) {
        loreReveal = pick(freshCategory, rng).id;
      }
    }
  }

  // ─── TRANSFER EVENT — rare, progression-gated ──────────────────────────
  const transferCount = bible.transferLog.length;
  let transferEvent: string | null = null;
  if (world === 'real' && rng() > 0.7 - (transferCount * 0.02)) {
    const transferTypes = [
      'A new game stat begins manifesting physically',
      'An inventory item partially materializes in MC\'s pocket',
      'MC instinctively uses a game ability without thinking',
      'A physical change becomes permanent and harder to hide',
    ];
    transferEvent = pick(transferTypes, rng);
  } else if (world === 'vr' && rng() > 0.85) {
    transferEvent = 'A real-world memory or skill unexpectedly helps in the game';
  }

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
    wordTarget: 2000,
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

export function updateSeriesBible(
  bible: SeriesBible,
  meta: ChapterMetadata,
  blueprint?: ChapterBlueprint,
): SeriesBible {
  const updated = structuredClone(bible);
  const ch = meta.chapterNumber;
  const rng = createRng(ch * 491);

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE BIBLE UPDATES
  // ═══════════════════════════════════════════════════════════════════════════

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
    if (loc) { loc.lastVisited = ch; loc.visits++; }
  }

  // Add new locations
  for (const name of meta.newLocations) {
    if (!updated.locations.find(l => l.name === name)) {
      updated.locations.push({
        id: `loc-${name.toLowerCase().replace(/\s+/g, '-')}-${ch}`,
        name, world: meta.world,
        description: `Location discovered in chapter ${ch}`,
        type: 'unknown', discoveredChapter: ch, lastVisited: ch, visits: 1,
        secrets: [], connectedLocations: [], dangerLevel: 3,
        currentState: 'Newly discovered', npcsPresent: [], availableQuests: [],
      });
    }
  }

  // Enriched timeline event
  const timelineConsequences: string[] = [];
  if (blueprint?.exploitDirective) timelineConsequences.push(`Exploit activity: ${blueprint.exploitDirective.type}`);
  if (blueprint?.closeCallScheduled) timelineConsequences.push('Close call occurred');
  if (blueprint?.loreReveal) timelineConsequences.push(`Lore revealed: ${blueprint.loreReveal}`);
  if (blueprint?.transferEvent) timelineConsequences.push(`Transfer: ${blueprint.transferEvent}`);

  updated.timeline.push({
    chapter: ch,
    world: meta.world,
    event: `Chapter ${ch}: ${meta.primaryFocus} focus, ${meta.emotionalTone} tone, stage=${updated.mcPsychology.stage}`,
    significance: meta.tensionLevel > 70 ? 'major' : meta.tensionLevel > 40 ? 'moderate' : 'minor',
    involvedCharacters: meta.characters,
    consequences: timelineConsequences,
  });

  // Foreshadowing
  for (const fs of meta.foreshadowingPlanted) {
    if (!updated.foreshadowing.find(f => f.id === fs.id)) updated.foreshadowing.push(fs);
  }
  for (const fsId of meta.foreshadowingPaidOff) {
    const fs = updated.foreshadowing.find(f => f.id === fsId);
    if (fs && !fs.payoffChapter) fs.payoffChapter = ch;
  }

  // Advance plot threads
  for (const ptId of meta.plotThreadsAdvanced) {
    const pt = updated.plotThreads.find(p => p.id === ptId);
    if (pt) pt.currentProgress = `Advanced in chapter ${ch}`;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MC STATS — progression tied to gameplay
  // ═══════════════════════════════════════════════════════════════════════════
  const level = Math.floor(ch / 2) + 1;
  const stats = updated.mcStats;
  stats.level = level;
  stats.experience = level * 100;
  stats.strength = 8 + level;
  stats.agility = 10 + level;
  stats.intelligence = 12 + Math.floor(level / 2);
  stats.vitality = 9 + Math.floor(level * 0.8);
  stats.perception = 7 + Math.floor(level * 1.2);
  stats.maxHealth = 100 + level * 20;
  stats.health = stats.maxHealth;
  stats.maxMana = 50 + level * 15;
  stats.mana = stats.maxMana;
  stats.questsCompleted += meta.plotThreadsAdvanced.length > 0 ? 1 : 0;
  stats.secretsDiscovered = updated.loreFragments.length + updated.mcSecrets.length;
  stats.playTime = `${ch * 4}h`;

  // ═══════════════════════════════════════════════════════════════════════════
  // EMOTIONAL STATE — driven by events, not just tone
  // ═══════════════════════════════════════════════════════════════════════════
  const emo = updated.mcEmotionalState;
  emo.mood = meta.emotionalTone;
  emo.stressLevel = Math.min(100, 30 + meta.tensionLevel * 0.5 + (updated.concealmentState.heatLevel * 0.2));
  emo.paranoia = Math.min(100, 15 + updated.concealmentState.heatLevel * 0.6 + updated.concealmentState.closeCalls.length * 5);
  emo.determination = Math.max(20, 75 - (ch > 30 ? (ch - 30) * 0.5 : 0)); // slowly grinds down
  emo.loneliness = Math.min(100, 40 + (updated.mcPsychology.stage === 'paranoid_hider' ? 20 : 0) + ch * 0.5);

  // Update bonds based on interaction
  for (const bond of emo.bonds) {
    const rel = updated.relationshipDynamics.find(r => r.characterId === bond.characterId);
    if (rel) {
      // Guilt erodes bond strength from MC's side
      bond.strength = Math.max(10, bond.strength - (rel.guiltLevel > 50 ? 1 : 0));
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PACING STATE — cooldowns, arc progression, anti-repetition tracking
  // ═══════════════════════════════════════════════════════════════════════════
  const ps = updated.pacingState;
  ps.tensionLevel = meta.tensionLevel;
  ps.currentArc = advanceArcPhase(ps.currentArc);

  // Cooldowns
  ps.actionCooldown = meta.primaryFocus === 'action' ? 0 : ps.actionCooldown + 1;
  ps.loreCooldown = meta.primaryFocus === 'lore' ? 0 : ps.loreCooldown + 1;
  ps.emotionalCooldown = (meta.primaryFocus === 'emotional' || meta.primaryFocus === 'character') ? 0 : ps.emotionalCooldown + 1;
  ps.revelationCooldown = meta.primaryFocus === 'revelation' ? 0 : ps.revelationCooldown + 1;
  ps.chaptersSinceNewCharacter = meta.newCharacters.length > 0 ? 0 : ps.chaptersSinceNewCharacter + 1;
  ps.chaptersSinceNewLocation = meta.newLocations.length > 0 ? 0 : ps.chaptersSinceNewLocation + 1;
  ps.chaptersSinceNewSkill++;
  ps.recentSceneTypes = [...ps.recentSceneTypes.slice(-6), meta.primaryFocus];
  ps.suggestedNextTone = meta.tensionLevel > 60 ? 'light' : 'dark';

  // Track used scene keys for anti-repetition
  updated.usedSceneKeys.push(`focus-${meta.primaryFocus}:${ch}`);
  updated.usedSceneKeys.push(`tone-${meta.emotionalTone}:${ch}`);
  // Keep only last 30 entries to prevent unbounded growth
  if (updated.usedSceneKeys.length > 30) {
    updated.usedSceneKeys = updated.usedSceneKeys.slice(-30);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MC PSYCHOLOGY — gradual evolution driven by events
  // ═══════════════════════════════════════════════════════════════════════════
  const psych = updated.mcPsychology;
  const voice = getVoiceProfile(psych.stage);

  // Self-awareness rises with each chapter (you can't unsee changes)
  psych.selfAwareness = Math.min(100, psych.selfAwareness + 2);
  // Addiction creeps up — faster during VR chapters
  psych.addictionLevel = Math.min(100, psych.addictionLevel + (meta.world === 'vr' ? 2 : 0.5));
  // High-tension events increase control need
  if (meta.tensionLevel > 60) {
    psych.controlNeed = Math.min(100, psych.controlNeed + 3);
  }
  // Risk tolerance shifts based on success/failure
  if (meta.tensionLevel < 40) {
    psych.riskTolerance = Math.min(100, psych.riskTolerance + 1); // comfortable → takes more risks
  } else if (meta.tensionLevel > 80) {
    psych.riskTolerance = Math.max(10, psych.riskTolerance - 2); // scared → more cautious
  }

  // Moral flexibility creeps up with exploit usage
  const activeExploitCount = updated.exploits.filter(e => e.status === 'actively_used').length;
  if (activeExploitCount > 0) {
    psych.moralFlexibility = Math.min(100, psych.moralFlexibility + (activeExploitCount * 0.5));
    psych.rationalizationTendency = Math.min(100, psych.rationalizationTendency + 1);
  }
  // Moral lines erode: randomly remove one when flexibility gets high enough
  if (psych.moralFlexibility > 60 && psych.moralLines.length > 0 && rng() > 0.8) {
    const removed = psych.moralLines.splice(Math.floor(rng() * psych.moralLines.length), 1)[0];
    psych.pivotalMoments.push({
      chapter: ch,
      event: `Crossed a moral line: "${removed}"`,
      shift: 'Moral boundary dissolved under pressure of circumstances',
    });
  }

  // Update recurring thoughts and rationalizations from stage voice
  psych.recurringThoughts = [...voice.recurringThoughts];
  psych.behavioralPatterns = [...voice.behavioralPatterns];
  // Accumulate rationalizations (old ones persist)
  for (const rat of voice.rationalizations) {
    if (!psych.rationalizations.includes(rat)) psych.rationalizations.push(rat);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPLOIT LIFECYCLE — discover, test, confirm, use, evolve, patch
  // ═══════════════════════════════════════════════════════════════════════════
  if (blueprint?.exploitDirective) {
    const dir = blueprint.exploitDirective;
    const arc = updated.progressionArc;

    if (dir.type === 'discover' && dir.exploitId) {
      // Look up from catalog and add to bible
      const template = EXPLOIT_CATALOG.find(e => e.id === dir.exploitId);
      if (template && !updated.exploits.find(e => e.id === template.id)) {
        updated.exploits.push({
          id: template.id,
          name: template.name,
          description: template.description,
          discoveryMethod: template.discoveryMethod,
          status: 'theorized',
          discoveredChapter: ch,
          firstUsedChapter: null,
          affectsWorld: template.affectsWorld,
          mechanicAbused: template.mechanicAbused,
          advantage: template.advantage,
          detectionRisk: template.detectionRisk,
          systemAware: false,
          countermeasures: [],
          usageCount: 0,
          sideEffects: [],
          evolutionPotential: template.evolutionPotential,
          category: template.category,
        });
        // Add to knowledge
        updated.mcKnowledge.push({
          id: `know-exploit-${template.id}`,
          topic: template.name,
          detail: `Discovered exploit: ${template.description}`,
          learnedChapter: ch,
          source: template.discoveryMethod,
          reliability: 'suspected',
          category: 'game_system',
        });
      }
    } else if (dir.type === 'test' && dir.exploitId) {
      const exploit = updated.exploits.find(e => e.id === dir.exploitId);
      if (exploit && exploit.status === 'theorized') {
        exploit.status = 'tested';
      }
    } else if (dir.type === 'use' && dir.exploitId) {
      const exploit = updated.exploits.find(e => e.id === dir.exploitId);
      if (exploit) {
        if (exploit.status === 'tested') exploit.status = 'confirmed';
        if (exploit.status === 'confirmed') exploit.status = 'actively_used';
        exploit.usageCount++;
        if (!exploit.firstUsedChapter) exploit.firstUsedChapter = ch;
        arc.exploitUsageCount++;
        // Side effects reveal after multiple uses
        const template = EXPLOIT_CATALOG.find(e => e.id === exploit.id);
        if (template && exploit.usageCount >= 3 && exploit.sideEffects.length < template.sideEffects.length) {
          exploit.sideEffects.push(template.sideEffects[exploit.sideEffects.length]);
        }
        // Detection risk escalates with use
        if (exploit.usageCount > 5 && exploit.detectionRisk !== 'critical') {
          const riskLevels: ExploitRecord['detectionRisk'][] = ['none', 'low', 'medium', 'high', 'critical'];
          const idx = riskLevels.indexOf(exploit.detectionRisk);
          if (idx < riskLevels.length - 1) exploit.detectionRisk = riskLevels[idx + 1];
        }
      }
    } else if (dir.type === 'evolve' && dir.exploitId) {
      const exploit = updated.exploits.find(e => e.id === dir.exploitId);
      if (exploit && exploit.evolutionPotential) {
        exploit.status = 'evolved';
        exploit.description += ` [EVOLVED: ${exploit.evolutionPotential}]`;
        exploit.advantage += ' (enhanced)';
        exploit.evolutionPotential = null;
        psych.pivotalMoments.push({
          chapter: ch,
          event: `Evolved exploit: ${exploit.name}`,
          shift: 'Deepening mastery over game systems',
        });
      }
    } else if (dir.type === 'hide_evidence') {
      // Reduce heat from active concealment effort
      updated.concealmentState.heatLevel = Math.max(0, updated.concealmentState.heatLevel - 5);
    }

    // Track exploit action in scene keys for cooldown
    updated.usedSceneKeys.push(`exploit-${dir.type}:${ch}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LORE FRAGMENT TRACKING
  // ═══════════════════════════════════════════════════════════════════════════
  if (blueprint?.loreReveal) {
    const loreId = blueprint.loreReveal;
    const catalogEntry = SEED_LORE_CATALOG.find(l => l.id === loreId);
    if (catalogEntry && !updated.loreFragments.find(l => l.id === loreId)) {
      updated.loreFragments.push({
        ...catalogEntry,
        discoveredChapter: ch,
        actedUpon: false,
      });
      // Add to MC knowledge
      updated.mcKnowledge.push({
        id: `know-lore-${loreId}`,
        topic: catalogEntry.title,
        detail: catalogEntry.content,
        learnedChapter: ch,
        source: 'lore_discovery',
        reliability: catalogEntry.reliability,
        category: 'lore',
      });
      // Plant foreshadowing from lore implications
      for (const imp of catalogEntry.implications.slice(0, 1)) {
        updated.foreshadowing.push({
          id: `fs-lore-${loreId}-${ch}`,
          hint: imp,
          payoff: `Implication of ${catalogEntry.title}`,
          plantedChapter: ch,
          payoffChapter: null,
          subtlety: 'subtle',
          category: 'lore',
        });
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONCEALMENT STATE — heat, close calls, cover stories, investigators
  // ═══════════════════════════════════════════════════════════════════════════
  const cs = updated.concealmentState;
  cs.vrConcealment.chaptersSinceCloseCall++;
  cs.realConcealment.chaptersSinceCloseCall++;

  // Heat rises based on: transfers, exploits used, chapters elapsed
  const transferHeat = updated.transferLog.length * 2;
  const exploitHeat = activeExploitCount * 3;
  const baseHeat = Math.floor(ch * 0.8);
  cs.heatLevel = Math.min(100, Math.max(cs.heatLevel, Math.floor((transferHeat + exploitHeat + baseHeat) / 3)));

  // Concealment risk escalation
  const vrProfile = cs.vrConcealment;
  const realProfile = cs.realConcealment;
  if (cs.heatLevel > 70) {
    realProfile.risk = 'investigated';
    vrProfile.risk = 'suspected';
  } else if (cs.heatLevel > 50) {
    realProfile.risk = 'suspected';
    vrProfile.risk = 'noticed';
  } else if (cs.heatLevel > 25) {
    realProfile.risk = 'noticed';
  }

  // Add concealed abilities as transfers accumulate
  for (const transfer of updated.transferLog) {
    if (transfer.direction === 'vr_to_real' && !realProfile.concealedAbilities.includes(transfer.name)) {
      realProfile.concealedAbilities.push(transfer.name);
    }
  }

  // Close call processing
  if (blueprint?.closeCallScheduled) {
    const closeCall = generateCloseCall(updated, meta.world, ch, rng);
    if (closeCall) {
      cs.closeCalls.push(closeCall);
      updated.progressionArc.closeCallCount++;

      // Reset close-call counter for this world
      if (meta.world === 'vr') cs.vrConcealment.chaptersSinceCloseCall = 0;
      else cs.realConcealment.chaptersSinceCloseCall = 0;

      // Increase heat from close call
      cs.heatLevel = Math.min(100, cs.heatLevel + 5);

      // Increase suspicion for involved characters
      for (const charId of closeCall.increasedSuspicionFor) {
        const profile = meta.world === 'vr' ? vrProfile : realProfile;
        const existing = profile.suspiciousCharacters.find(s => s.characterId === charId);
        if (existing) {
          existing.suspicionLevel = Math.min(100, existing.suspicionLevel + 15);
        } else {
          profile.suspiciousCharacters.push({
            characterId: charId,
            suspicionLevel: 25,
            whatTheySuspect: closeCall.whatHappened,
          });
        }
      }

      // Add to secrets close call tracking
      for (const secret of updated.mcSecrets) {
        if (secret.risk !== 'low') {
          secret.closeCallChapters.push(ch);
        }
      }

      // Record pivotal moment if significant
      if (cs.heatLevel > 40) {
        psych.pivotalMoments.push({
          chapter: ch,
          event: `Close call: ${closeCall.whatHappened}`,
          shift: 'Heightened paranoia and need for better concealment',
        });
      }
    }
  }

  // Cover story generation — create new cover stories as needed
  if (cs.heatLevel > 20 && cs.coverStories.length < realProfile.concealedAbilities.length) {
    const newCover = generateCoverStory(updated, ch, rng);
    if (newCover) {
      cs.coverStories.push(newCover);
    }
  }

  // Cover story decay — believability drops over time
  for (const cover of cs.coverStories) {
    const age = ch - cover.lastReinforced;
    if (age >= 3) {
      cover.believability = Math.max(10, cover.believability - 5);
    }
  }

  // Add investigators when suspicion is high enough
  for (const sc of [...vrProfile.suspiciousCharacters, ...realProfile.suspiciousCharacters]) {
    if (sc.suspicionLevel > 60 && !cs.investigators.includes(sc.characterId)) {
      cs.investigators.push(sc.characterId);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSFER EVENT LOGGING
  // ═══════════════════════════════════════════════════════════════════════════
  if (blueprint?.transferEvent) {
    const transferTypes: TransferEvent['type'][] = ['stat', 'ability', 'physical_change', 'knowledge'];
    const transferNames = [
      'Enhanced Hearing', 'Pain Resistance', 'Night Vision Upgrade',
      'Accelerated Healing', 'Predator Instinct', 'Blood Sense',
      'Thermal Vision', 'Enhanced Memory', 'Muscle Density Increase',
    ];
    // Pick a transfer not already logged
    const existingNames = new Set(updated.transferLog.map(t => t.name));
    const available = transferNames.filter(n => !existingNames.has(n));
    if (available.length > 0) {
      const name = pick(available, rng);
      const newTransfer: TransferEvent = {
        id: `transfer-${ch}-${name.toLowerCase().replace(/\s+/g, '-')}`,
        chapter: ch,
        direction: meta.world === 'real' ? 'vr_to_real' : 'real_to_vr',
        type: pick(transferTypes, rng),
        name,
        description: blueprint.transferEvent,
        intentional: psych.stage !== 'naive_player' && psych.stage !== 'curious_tester',
        mcReaction: psych.stage === 'naive_player'
          ? 'Confused and alarmed'
          : psych.stage === 'opportunist'
            ? 'Intrigued and immediately starts testing it'
            : 'Catalogued it mentally and began planning concealment',
        concealmentMethod: pick([
          'Attributes it to exercise', 'Wears concealing clothing',
          'Avoids situations where it might be noticed',
          'Created a specific cover story', 'Limits usage to private moments',
        ], rng),
        sideEffects: [pick([
          'Mild discomfort during transition', 'Brief disorientation',
          'Increased hunger', 'Heightened emotional sensitivity',
        ], rng)],
        beingExploited: psych.stage === 'opportunist' || psych.stage === 'strategic_abuser' || psych.stage === 'seasoned_survivor',
      };
      updated.transferLog.push(newTransfer);

      // Add as a real-world change to stats
      stats.realWorldChanges.push({
        description: `${name}: ${blueprint.transferEvent}`,
        discoveredChapter: ch,
        hidden: true,
      });

      // Add as a secret
      updated.mcSecrets.push({
        id: `secret-transfer-${ch}`,
        secret: `${name} has manifested in the real world`,
        knownBy: ['kael'],
        discoveredChapter: ch,
        risk: 'high',
        category: 'transfer_ability',
        closeCallChapters: [],
        relatedPlotThreads: ['plot-reality-bleed'],
      });

      // Add as hidden asset
      cs.hiddenAssets.push({
        id: `hidden-${ch}-${name.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'ability',
        name,
        hiddenFrom: ['alex', 'public'],
        hidingMethod: newTransfer.concealmentMethod,
        discoveryRisk: 30 + (updated.transferLog.length * 5),
        lastUsedSecretly: null,
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROGRESSION ARC — stage advancement with narrative triggers
  // ═══════════════════════════════════════════════════════════════════════════
  const arc = updated.progressionArc;
  const STAGE_ORDER: ProgressionStage[] = [
    'naive_player', 'curious_tester', 'opportunist',
    'paranoid_hider', 'strategic_abuser', 'seasoned_survivor',
  ];
  const currentIdx = STAGE_ORDER.indexOf(arc.currentStage);

  // Multi-factor advancement check
  const shouldAdvance =
    (arc.currentStage === 'naive_player' && (
      ch >= 5 || updated.transferLog.length >= 2 || arc.closeCallCount >= 1
    )) ||
    (arc.currentStage === 'curious_tester' && (
      (ch >= 10 && arc.exploitUsageCount >= 1) || updated.exploits.length >= 3
    )) ||
    (arc.currentStage === 'opportunist' && (
      (ch >= 18 && arc.closeCallCount >= 2) || (arc.exploitUsageCount >= 4 && cs.heatLevel > 30)
    )) ||
    (arc.currentStage === 'paranoid_hider' && (
      (ch >= 28 && arc.exploitUsageCount >= 5) || (cs.heatLevel > 60 && arc.closeCallCount >= 4)
    )) ||
    (arc.currentStage === 'strategic_abuser' && (
      (ch >= 40 && arc.closeCallCount >= 5) || (updated.loreFragments.length >= 8 && updated.exploits.filter(e => e.status === 'evolved').length >= 1)
    ));

  if (shouldAdvance && currentIdx < STAGE_ORDER.length - 1) {
    const oldStage = arc.currentStage;
    const newStage = STAGE_ORDER[currentIdx + 1];

    // Close out old stage with a meaningful defining moment
    const oldEntry = arc.stageHistory.find(s => s.stage === oldStage && s.exited === null);
    if (oldEntry) {
      oldEntry.exited = ch;
      // Generate a meaningful defining moment
      const moments: Record<ProgressionStage, string[]> = {
        'naive_player': ['First deliberate use of a transferred ability', 'Realized the game is changing his body'],
        'curious_tester': ['First successful exploit use', 'Caught lying to Alex about his abilities'],
        'opportunist': ['First close call in public', 'Realized people are watching', 'Deliberately used powers for personal gain'],
        'paranoid_hider': ['Built a systematic cover operation', 'Accepted that the old Kael is gone'],
        'strategic_abuser': ['Evolved an exploit to reality-breaking levels', 'Made peace with what he has become'],
        'seasoned_survivor': ['Achieved mastery of both worlds'],
      };
      oldEntry.definingMoment = pick(moments[oldStage] ?? [`Stage transition in chapter ${ch}`], rng);
    }

    // Enter new stage
    arc.currentStage = newStage;
    arc.stageEnteredChapter = ch;
    arc.stageHistory.push({
      stage: newStage,
      entered: ch,
      exited: null,
      definingMoment: `Entering ${newStage.replace(/_/g, ' ')} phase`,
    });

    // Update advancement triggers for the new stage
    const triggerMap: Record<ProgressionStage, string[]> = {
      'naive_player': ['Discovers a reproducible stat transfer', 'Witnesses a real consequence of game actions'],
      'curious_tester': ['Successfully exploits a game mechanic', 'Gets caught using an ability and must explain it away'],
      'opportunist': ['Multiple close calls force a concealment overhaul', 'Realizes someone is investigating him'],
      'paranoid_hider': ['Builds a systematic approach to dual-world exploitation', 'Crosses a major moral line without guilt'],
      'strategic_abuser': ['Achieves a reality-breaking exploit', 'Makes a choice that permanently changes his relationship with both worlds'],
      'seasoned_survivor': ['This is the final stage'],
    };
    arc.advancementTriggers = triggerMap[newStage] ?? [];

    // Evolve dominant strategy with stage
    const strategyMap: Record<ProgressionStage, ProgressionArcState['dominantStrategy']> = {
      'naive_player': 'brute_force',
      'curious_tester': 'knowledge_hoarding',
      'opportunist': 'exploit_abuse',
      'paranoid_hider': 'stealth',
      'strategic_abuser': 'exploit_abuse',
      'seasoned_survivor': 'alliance_building',
    };
    arc.dominantStrategy = strategyMap[newStage];

    // Sync psychology stage
    psych.stage = newStage;
    const perceptionMap: Record<ProgressionStage, MCPsychology['gamePerception']> = {
      'naive_player': 'entertainment',
      'curious_tester': 'tool',
      'opportunist': 'tool',
      'paranoid_hider': 'trap',
      'strategic_abuser': 'weapon',
      'seasoned_survivor': 'second_life',
    };
    psych.gamePerception = perceptionMap[newStage];

    // Add realization
    arc.realizations.push({
      chapter: ch,
      insight: `Transitioned from ${oldStage.replace(/_/g, ' ')} to ${newStage.replace(/_/g, ' ')}`,
      impact: voice.decisionPattern,
    });

    // Pivotal moment
    psych.pivotalMoments.push({
      chapter: ch,
      event: `Stage transition: ${oldStage} → ${newStage}`,
      shift: `Fundamental change in worldview and approach: ${getVoiceProfile(newStage).internalMonologueStyle.substring(0, 80)}...`,
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RELATIONSHIP DYNAMICS — escalation, guilt, suspicion, pivotal moments
  // ═══════════════════════════════════════════════════════════════════════════
  for (const rel of updated.relationshipDynamics) {
    const char = updated.characters.find(c => c.id === rel.characterId);
    if (!char) continue;

    const appeared = meta.characters.includes(char.id) || meta.characters.includes(char.name);

    if (appeared) {
      // Guilt from hiding things
      if (rel.hidingFrom.length > 0) {
        rel.guiltLevel = Math.min(100, rel.guiltLevel + 2);
      }

      // Manipulation level creeps up as MC uses more strategic deception
      if (psych.stage === 'opportunist' || psych.stage === 'paranoid_hider' || psych.stage === 'strategic_abuser') {
        rel.manipulationLevel = Math.min(100, rel.manipulationLevel + 1);
      }

      // Update what MC is hiding (grows with transfers and exploits)
      const hiddenThings = new Set(rel.hidingFrom);
      for (const transfer of updated.transferLog) {
        hiddenThings.add(transfer.name);
      }
      for (const exploit of updated.exploits.filter(e => e.status === 'actively_used')) {
        hiddenThings.add(`Exploit: ${exploit.name}`);
      }
      rel.hidingFrom = [...hiddenThings];

      // Their suspicions grow with concealment close calls
      const charSuspicion = cs.vrConcealment.suspiciousCharacters.find(s => s.characterId === rel.characterId)
        ?? cs.realConcealment.suspiciousCharacters.find(s => s.characterId === rel.characterId);
      if (charSuspicion && charSuspicion.suspicionLevel > 40) {
        if (!rel.theirSuspicions.includes(charSuspicion.whatTheySuspect)) {
          rel.theirSuspicions.push(charSuspicion.whatTheySuspect);
        }
      }

      // Power balance shifts as MC grows stronger
      if (stats.level > 10 && rel.characterId !== 'yuna') {
        rel.powerBalance = 'mc_dominant';
      }
    }
  }

  return updated;
}
