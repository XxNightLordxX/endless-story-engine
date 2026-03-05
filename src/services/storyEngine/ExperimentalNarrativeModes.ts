import { v4 as uuidv4 } from 'uuid';
import { webSearchIntegration } from './WebSearchIntegration';
import type { WebSearchResult, TechnicalSearchResult, LiterarySearchResult } from './WebSearchIntegration';

/**
 * Experimental Narrative Modes
 * 
 * This system provides unconventional and experimental storytelling formats.
 * It manages non-linear narratives, meta-narrative elements, and innovative structures.
 * 
 * Enhanced with real-time web search for experimental narrative techniques,
 * innovative storytelling methods, and narrative innovation trends.
 * 
 * Core Responsibilities:
 * - Implement non-linear narrative structures
 * - Manage meta-narrative and self-aware storytelling
 * - Provide experimental format options (epistolary, second-person, etc.)
 * - Handle parallel timelines and alternate realities
 * - Create innovative narrative devices
 * - Track reader interaction and choice-based paths
 */

// ===== TYPES & INTERFACES =====

export interface NarrativeMode {
  id: string;
  name: string;
  type: ExperimentalType;
  description: string;
  rules: NarrativeRules;
  structure: NarrativeStructure;
  active: boolean;
  parameters: ModeParameters;
}

export type ExperimentalType = 
  | 'non-linear' | 'meta-narrative' | 'epistolary' | 'second-person'
  | 'parallel-timelines' | 'multiple-perspectives' | 'interactive'
  | 'reverse-chronological' | 'fragmentary' | 'choose-your-own-adventure'
  | 'stream-of-consciousness' | 'procedural-generation' | 'ai-generated'
  | 'collaborative' | 'immersive' | 'multimedia' | 'transmedia';

export interface NarrativeRules {
  chronology: ChronologicalRule;
  perspective: PerspectiveRule;
  reality: RealityRule;
  narrator: NarratorRule;
  boundaries: BoundaryRule[];
  constraints: NarrativeConstraint[];
}

export type ChronologicalRule = 
  | 'linear' | 'non-linear' | 'reverse' | 'circular' 
  | 'simultaneous' | 'fragmented' | 'branching' | 'custom';

export type PerspectiveRule = 
  | 'first-person' | 'second-person' | 'third-person-limited'
  | 'third-person-omniscient' | 'shifting' | 'multiple' | 'custom';

export type RealityRule = 
  | 'single' | 'multiple' | 'meta' | 'subjective' 
  | 'dream-like' | 'hallucinatory' | 'surreal' | 'custom';

export interface NarratorRule {
  type: 'reliable' | 'unreliable' | 'multiple' | 'unknown' | 'meta';
  distance: 'intimate' | 'close' | 'moderate' | 'distant' | 'godlike';
  awareness: number; // 0-1, how aware of being a story
  agency: number; // 0-1, ability to influence the story
}

export interface BoundaryRule {
  type: string;
  description: string;
  violation: string;
  consequence: string;
}

export interface NarrativeConstraint {
  type: string;
  description: string;
  enforcement: 'strict' | 'loose' | 'optional';
  examples: string[];
}

export interface NarrativeStructure {
  segments: NarrativeSegment[];
  connections: NarrativeConnection[];
  entryPoints: string[];
  exitPoints: string[];
  requiredPath: string[] | 'none' | 'flexible';
}

export interface NarrativeSegment {
  id: string;
  type: SegmentType;
  content: string;
  position: SegmentPosition;
  metadata: SegmentMetadata;
  dependencies: string[];
  alternatives: string[];
  conditions: SegmentCondition[];
}

export type SegmentType = 
  | 'chapter' | 'scene' | 'fragment' | 'letter' | 'diary'
  | 'document' | 'transcript' | 'monologue' | 'interlude'
  | 'meta-commentary' | 'choice-point' | 'branch' | 'ending';

export interface SegmentPosition {
  timeline: string | number;
  reality: string;
  perspective: string;
  order: number;
  optional: boolean;
}

export interface SegmentMetadata {
  author?: string;
  date?: string;
  location?: string;
  context?: string;
  mediaType?: string;
  truthfulness?: number; // 0-1
}

export interface SegmentCondition {
  type: 'reader-choice' | 'character-state' | 'world-state' | 'previous-choice' | 'custom';
  requirement: string;
  description: string;
}

export interface NarrativeConnection {
  from: string;
  to: string;
  type: ConnectionType;
  strength: number; // 0-1
  description: string;
  conditional: boolean;
  condition?: string;
}

export type ConnectionType = 
  | 'sequential' | 'causal' | 'thematic' | 'parallel' 
  | 'contrasting' | 'echo' | 'branch' | 'merge' | 'custom';

export interface ModeParameters {
  [key: string]: any;
}

export interface ParallelTimeline {
  id: string;
  name: string;
  description: string;
  divergencePoint: string;
  segments: string[];
  primary: boolean;
  accessibility: 'always' | 'condition' | 'discovery' | 'choice';
  condition?: string;
}

export interface NarrativeBranch {
  id: string;
  parentId: string;
  segmentId: string;
  description: string;
  consequences: BranchConsequence[];
  accessible: boolean;
  accessibilityCondition?: string;
}

export interface BranchConsequence {
  type: 'immediate' | 'future' | 'permanent' | 'conditional';
  description: string;
  impact: number; // -10 to 10
}

export interface InteractiveChoice {
  id: string;
  segmentId: string;
  question: string;
  options: ChoiceOption[];
  consequences: ChoiceConsequence[];
  visibility: 'always' | 'condition' | 'progression';
  visibilityCondition?: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
  description: string;
  leadsTo: string;
  branch?: string;
  moralAlignment?: number; // -1 to 1
  consequences: string[];
}

export interface ChoiceConsequence {
  type: 'character' | 'world' | 'story' | 'meta';
  target: string;
  effect: string;
  value: any;
}

export interface NarrativeState {
  currentSegment: string;
  visitedSegments: Set<string>;
  choices: Map<string, string>;
  characterStates: Map<string, any>;
  worldStates: Map<string, any>;
  achievements: Achievement[];
  pathTaken: string[];
  alternatePaths: string[][];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: string;
  unlocked: boolean;
  unlockTime?: number;
}

export interface MetaNarrativeLayer {
  type: 'authorial-intrusion' | 'character-awareness' | 'format-breaking'
        | 'fourth-wall' | 'self-reference' | 'narrative-metacommentary';
  content: string;
  placement: string;
  frequency: number; // 0-1
  purpose: string;
}

export interface NonLinearSequence {
  id: string;
  segments: string[];
  order: 'chronological' | 'thematic' | 'emotional' | 'random' | 'custom';
  sortingFunction?: string; // JS code for custom sorting
  userOrderable: boolean;
  defaultOrder: number[];
}

export interface FragmentaryNarrative {
  fragments: NarrativeFragment[];
  connections: FragmentConnection[];
  reconstructionRules: ReconstructionRule[];
  requiredFragments: string[];
  optionalFragments: string[];
}

export interface NarrativeFragment {
  id: string;
  content: string;
  type: string;
  timestamp?: number;
  metadata: Map<string, any>;
  placement: 'beginning' | 'middle' | 'end' | 'any' | 'custom';
  category: string;
}

export interface FragmentConnection {
  fromFragment: string;
  toFragment: string;
  connectionType: string;
  strength: number;
  description: string;
}

export interface ReconstructionRule {
  type: 'chronological' | 'thematic' | 'character' | 'custom';
  description: string;
  implementation: string;
}

export interface EpistolaryElement {
  type: 'letter' | 'email' | 'diary' | 'journal' | 'document' 
        | 'transcript' | 'text-message' | 'social-media-post'
        | 'interview' | 'police-report' | 'news-article';
  content: string;
  author: string;
  recipient?: string;
  date: string;
  medium: string;
  style: string;
  metadata: Map<string, any>;
}

export interface StreamOfConsciousness {
  content: string;
  characterId: string;
  depth: 'surface' | 'middle' | 'deep';
  coherence: number; // 0-1
  interruptions: ConsciousnessInterruption[];
  transitions: ConsciousnessTransition[];
  timeCompression: number; // 0-1, how much time is compressed
}

export interface ConsciousnessInterruption {
  type: 'sensory' | 'memory' | 'thought' | 'feeling' | 'external';
  content: string;
  placement: 'before' | 'during' | 'after';
  disruption: number; // 0-1
}

export interface ConsciousnessTransition {
  type: 'gradual' | 'abrupt' | 'seamless' | 'glitch' | 'custom';
  trigger: string;
  effect: string;
}

export interface ExperimentalAnalysis {
  modeId: string;
  complexity: number; // 0-1
  accessibility: number; // 0-1
  innovation: number; // 0-1
  coherence: number; // 0-1
  readerEngagement: number; // 0-1
  technicalFeasibility: number; // 0-1
  suggestions: string[];
  warnings: string[];
}

// ===== CLASS DEFINITION =====

export class ExperimentalNarrativeModes {
  private modes: Map<string, NarrativeMode> = new Map();
  private currentMode: NarrativeMode | null = null;
  private narrativeState: NarrativeState;
  private branches: Map<string, NarrativeBranch> = new Map();
  private choices: Map<string, InteractiveChoice> = new Map();
  private timelines: Map<string, ParallelTimeline> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private metaLayers: MetaNarrativeLayer[] = [];
  
  // Web search integration
  private experimentalTechniquesCache: Map<string, WebSearchResult[]> = new Map();
  private innovativeMethodsCache: Map<string, TechnicalSearchResult[]> = new Map();
  private innovationTrendsCache: Map<string, LiterarySearchResult[]> = new Map();

  constructor() {
    this.narrativeState = {
      currentSegment: '',
      visitedSegments: new Set(),
      choices: new Map(),
      characterStates: new Map(),
      worldStates: new Map(),
      achievements: [],
      pathTaken: [],
      alternatePaths: []
    };
  }

  // ===== WEB SEARCH INTEGRATION =====

  /**
   * Search for experimental narrative techniques
   */
  async searchExperimentalTechniques(
    technique: string,
    genre: string
  ): Promise<WebSearchResult[]> {
    const key = `${technique}-${genre}`;
    if (this.experimentalTechniquesCache.has(key)) {
      return this.experimentalTechniquesCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${technique} experimental narrative ${genre} fiction`
    );
    this.experimentalTechniquesCache.set(key, results);
    return results;
  }

  /**
   * Research innovative storytelling methods
   */
  async searchInnovativeMethods(
    method: string,
    innovation: string
  ): Promise<TechnicalSearchResult[]> {
    const key = `${method}-${innovation}`;
    if (this.innovativeMethodsCache.has(key)) {
      return this.innovativeMethodsCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchWritingBestPractices(
      `${method} ${innovation} storytelling innovation`
    );
    this.innovativeMethodsCache.set(key, results);
    return results;
  }

  /**
   * Look up narrative innovation trends
   */
  async searchInnovationTrends(
    trend: string,
    timeframe: string
  ): Promise<LiterarySearchResult[]> {
    const key = `${trend}-${timeframe}`;
    if (this.innovationTrendsCache.has(key)) {
      return this.innovationTrendsCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchLiteraryExamples(
      `${trend} ${timeframe} innovative`,
      'fiction'
    );
    this.innovationTrendsCache.set(key, results);
    return results;
  }

  /**
   * Clear web search cache
   */
  clearWebSearchCache(): void {
    this.experimentalTechniquesCache.clear();
    this.innovativeMethodsCache.clear();
    this.innovationTrendsCache.clear();
  }

  // ===== CORE FUNCTIONALITY =====

  /**
   * Create experimental narrative mode
   */
  public createMode(
    name: string,
    type: ExperimentalType,
    description: string,
    parameters: ModeParameters = {}
  ): NarrativeMode {
    const mode: NarrativeMode = {
      id: uuidv4(),
      name,
      type,
      description,
      rules: this.generateDefaultRules(type),
      structure: {
        segments: [],
        connections: [],
        entryPoints: [],
        exitPoints: [],
        requiredPath: 'flexible'
      },
      active: false,
      parameters
    };
    
    this.modes.set(mode.id, mode);
    return mode;
  }

  /**
   * Generate default rules for experimental type
   */
  private generateDefaultRules(type: ExperimentalType): NarrativeRules {
    const ruleDefaults: Record<ExperimentalType, NarrativeRules> = {
      'non-linear': {
        chronology: 'non-linear',
        perspective: 'third-person-omniscient',
        reality: 'single',
        narrator: { type: 'reliable', distance: 'moderate', awareness: 0, agency: 0 },
        boundaries: [],
        constraints: [
          {
            type: 'temporal',
            description: 'Events can occur in any order',
            enforcement: 'loose',
            examples: ['flashbacks', 'flashforwards', 'simultaneous events']
          }
        ]
      },
      'meta-narrative': {
        chronology: 'linear',
        perspective: 'third-person-omniscient',
        reality: 'meta',
        narrator: { type: 'meta', distance: 'godlike', awareness: 1, agency: 0.5 },
        boundaries: [
          {
            type: 'fourth-wall',
            description: 'Narrator can break the fourth wall',
            violation: 'maintaining traditional narrative frame',
            consequence: 'meta-commentary intrusion'
          }
        ],
        constraints: []
      },
      'epistolary': {
        chronology: 'linear',
        perspective: 'first-person',
        reality: 'single',
        narrator: { type: 'multiple', distance: 'intimate', awareness: 0, agency: 0 },
        boundaries: [
          {
            type: 'documentary',
            description: 'Story told through documents',
            violation: 'narrative summary',
            consequence: 'break from epistolary format'
          }
        ],
        constraints: [
          {
            type: 'documentary',
            description: 'All content must be in document form',
            enforcement: 'strict',
            examples: ['letters', 'emails', 'diaries', 'documents']
          }
        ]
      },
      'second-person': {
        chronology: 'linear',
        perspective: 'second-person',
        reality: 'single',
        narrator: { type: 'reliable', distance: 'intimate', awareness: 0, agency: 0 },
        boundaries: [],
        constraints: [
          {
            type: 'pronoun',
            description: 'Must use second-person pronouns throughout',
            enforcement: 'strict',
            examples: ['you', 'your', 'yours']
          }
        ]
      },
      'parallel-timelines': {
        chronology: 'simultaneous',
        perspective: 'third-person-limited',
        reality: 'multiple',
        narrator: { type: 'reliable', distance: 'moderate', awareness: 0.3, agency: 0 },
        boundaries: [
          {
            type: 'timeline',
            description: 'Multiple timelines exist simultaneously',
            violation: 'single timeline narrative',
            consequence: 'timeline convergence or divergence'
          }
        ],
        constraints: [
          {
            type: 'tracking',
            description: 'Must track multiple timelines clearly',
            enforcement: 'strict',
            examples: ['timeline markers', 'character identification']
          }
        ]
      },
      'multiple-perspectives': {
        chronology: 'linear',
        perspective: 'multiple',
        reality: 'single',
        narrator: { type: 'multiple', distance: 'close', awareness: 0, agency: 0 },
        boundaries: [],
        constraints: [
          {
            type: 'voice',
            description: 'Each perspective must have distinct voice',
            enforcement: 'loose',
            examples: ['unique vocabulary', 'character personality']
          }
        ]
      },
      'interactive': {
        chronology: 'branching',
        perspective: 'second-person',
        reality: 'single',
        narrator: { type: 'reliable', distance: 'intimate', awareness: 0, agency: 0 },
        boundaries: [
          {
            type: 'choice',
            description: 'Reader makes choices that affect story',
            violation: 'linear progression',
            consequence: 'branching narrative paths'
          }
        ],
        constraints: [
          {
            type: 'choice-points',
            description: 'Include meaningful choice points',
            enforcement: 'strict',
            examples: ['moral choices', 'path selection', 'character actions']
          }
        ]
      },
      'reverse-chronological': {
        chronology: 'reverse',
        perspective: 'third-person-limited',
        reality: 'single',
        narrator: { type: 'reliable', distance: 'moderate', awareness: 0, agency: 0 },
        boundaries: [],
        constraints: [
          {
            type: 'temporal',
            description: 'Story must move backward through time',
            enforcement: 'strict',
            examples: ['ending at beginning', 'causality reversal']
          }
        ]
      },
      'fragmentary': {
        chronology: 'fragmented',
        perspective: 'third-person-omniscient',
        reality: 'single',
        narrator: { type: 'reliable', distance: 'moderate', awareness: 0, agency: 0 },
        boundaries: [
          {
            type: 'fragment',
            description: 'Story consists of disconnected fragments',
            violation: 'continuous narrative',
            consequence: 'fragment reconstruction required'
          }
        ],
        constraints: [
          {
            type: 'fragment',
            description: 'Present story in fragments',
            enforcement: 'loose',
            examples: ['memory fragments', 'documentary pieces', 'partial scenes']
          }
        ]
      },
      'choose-your-own-adventure': {
        chronology: 'branching',
        perspective: 'second-person',
        reality: 'single',
        narrator: { type: 'reliable', distance: 'intimate', awareness: 0, agency: 0 },
        boundaries: [
          {
            type: 'choice',
            description: 'Reader chooses narrative path',
            violation: 'linear storytelling',
            consequence: 'multiple possible endings'
          }
        ],
        constraints: [
          {
            type: 'choice',
            description: 'Provide clear choice options',
            enforcement: 'strict',
            examples: ['option A', 'option B', 'option C']
          }
        ]
      },
      'stream-of-consciousness': {
        chronology: 'linear',
        perspective: 'first-person',
        reality: 'subjective',
        narrator: { type: 'unreliable', distance: 'intimate', awareness: 0.5, agency: 0.3 },
        boundaries: [],
        constraints: [
          {
            type: 'consciousness',
            description: 'Represent character\'s internal stream of thought',
            enforcement: 'loose',
            examples: ['associative jumps', 'sensory impressions', 'unfinished thoughts']
          }
        ]
      },
      'procedural-generation': {
        chronology: 'custom',
        perspective: 'third-person-limited',
        reality: 'single',
        narrator: { type: 'reliable', distance: 'moderate', awareness: 0, agency: 0 },
        boundaries: [
          {
            type: 'procedural',
            description: 'Content generated procedurally',
            violation: 'manual writing',
            consequence: 'algorithmic narrative'
          }
        ],
        constraints: []
      },
      'ai-generated': {
        chronology: 'custom',
        perspective: 'third-person-omniscient',
        reality: 'single',
        narrator: { type: 'meta', distance: 'moderate', awareness: 0.8, agency: 0.5 },
        boundaries: [
          {
            type: 'ai',
            description: 'Story generated by AI',
            violation: 'human authorship',
            consequence: 'machine-generated narrative'
          }
        ],
        constraints: []
      },
      'collaborative': {
        chronology: 'linear',
        perspective: 'multiple',
        reality: 'single',
        narrator: { type: 'multiple', distance: 'moderate', awareness: 0, agency: 0 },
        boundaries: [
          {
            type: 'collaboration',
            description: 'Multiple authors contribute',
            violation: 'single authorship',
            consequence: 'collaborative narrative'
          }
        ],
        constraints: []
      },
      'immersive': {
        chronology: 'linear',
        perspective: 'second-person',
        reality: 'single',
        narrator: { type: 'reliable', distance: 'intimate', awareness: 0, agency: 0 },
        boundaries: [
          {
            type: 'immersion',
            description: 'Fully immersive reader experience',
            violation: 'breaking immersion',
            consequence: 'meta-awareness'
          }
        ],
        constraints: []
      },
      'multimedia': {
        chronology: 'linear',
        perspective: 'third-person-omniscient',
        reality: 'single',
        narrator: { type: 'reliable', distance: 'moderate', awareness: 0, agency: 0 },
        boundaries: [
          {
            type: 'multimedia',
            description: 'Story includes multiple media types',
            violation: 'text-only',
            consequence: 'multimedia integration'
          }
        ],
        constraints: []
      },
      'transmedia': {
        chronology: 'custom',
        perspective: 'third-person-omniscient',
        reality: 'multiple',
        narrator: { type: 'reliable', distance: 'moderate', awareness: 0.2, agency: 0 },
        boundaries: [
          {
            type: 'transmedia',
            description: 'Story spans multiple media/platforms',
            violation: 'single platform',
            consequence: 'transmedia narrative'
          }
        ],
        constraints: []
      }
    };
    
    return ruleDefaults[type];
  }

  /**
   * Activate mode
   */
  public activateMode(modeId: string): void {
    const mode = this.modes.get(modeId);
    if (mode) {
      this.currentMode = mode;
      mode.active = true;
      this.resetNarrativeState();
    }
  }

  /**
   * Deactivate current mode
   */
  public deactivateMode(): void {
    if (this.currentMode) {
      this.currentMode.active = false;
      this.currentMode = null;
    }
  }

  /**
   * Reset narrative state
   */
  private resetNarrativeState(): void {
    this.narrativeState = {
      currentSegment: '',
      visitedSegments: new Set(),
      choices: new Map(),
      characterStates: new Map(),
      worldStates: new Map(),
      achievements: [],
      pathTaken: [],
      alternatePaths: []
    };
  }

  /**
   * Add segment to mode
   */
  public addSegment(modeId: string, segment: NarrativeSegment): void {
    const mode = this.modes.get(modeId);
    if (mode) {
      mode.structure.segments.push(segment);
      
      // Update structure
      if (segment.dependencies.length === 0) {
        mode.structure.entryPoints.push(segment.id);
      }
      if (segment.alternatives.length === 0) {
        mode.structure.exitPoints.push(segment.id);
      }
    }
  }

  /**
   * Add connection between segments
   */
  public addConnection(modeId: string, connection: NarrativeConnection): void {
    const mode = this.modes.get(modeId);
    if (mode) {
      mode.structure.connections.push(connection);
    }
  }

  /**
   * Create parallel timeline
   */
  public createParallelTimeline(
    name: string,
    description: string,
    divergencePoint: string,
    primary: boolean = false
  ): ParallelTimeline {
    const timeline: ParallelTimeline = {
      id: uuidv4(),
      name,
      description,
      divergencePoint,
      segments: [],
      primary,
      accessibility: 'always'
    };
    
    this.timelines.set(timeline.id, timeline);
    return timeline;
  }

  /**
   * Add segment to timeline
   */
  public addSegmentToTimeline(timelineId: string, segmentId: string): void {
    const timeline = this.timelines.get(timelineId);
    if (timeline) {
      timeline.segments.push(segmentId);
    }
  }

  /**
   * Create narrative branch
   */
  public createBranch(
    parentId: string,
    segmentId: string,
    description: string,
    consequences: BranchConsequence[],
    accessibilityCondition?: string
  ): NarrativeBranch {
    const branch: NarrativeBranch = {
      id: uuidv4(),
      parentId,
      segmentId,
      description,
      consequences,
      accessible: !accessibilityCondition,
      accessibilityCondition
    };
    
    this.branches.set(branch.id, branch);
    return branch;
  }

  /**
   * Create interactive choice
   */
  public createChoice(
    segmentId: string,
    question: string,
    options: ChoiceOption[],
    consequences: ChoiceConsequence[],
    visibilityCondition?: string
  ): InteractiveChoice {
    const choice: InteractiveChoice = {
      id: uuidv4(),
      segmentId,
      question,
      options,
      consequences,
      visibility: visibilityCondition ? 'condition' : 'always',
      visibilityCondition
    };
    
    this.choices.set(choice.id, choice);
    return choice;
  }

  /**
   * Handle reader choice
   */
  public handleChoice(choiceId: string, optionId: string): string {
    const choice = this.choices.get(choiceId);
    const option = choice?.options.find(o => o.id === optionId);
    
    if (!choice || !option) {
      throw new Error('Choice or option not found');
    }
    
    // Record choice
    this.narrativeState.choices.set(choiceId, optionId);
    
    // Apply consequences
    this.applyChoiceConsequences(choice.consequences, option);
    
    // Update path
    this.narrativeState.pathTaken.push(optionId);
    
    // Check for branch
    if (option.branch) {
      return option.branch;
    }
    
    return option.leadsTo;
  }

  /**
   * Apply choice consequences
   */
  private applyChoiceConsequences(consequences: ChoiceConsequence[], option: ChoiceOption): void {
    consequences.forEach(consequence => {
      switch (consequence.type) {
        case 'character':
          this.updateCharacterState(consequence.target, consequence.value);
          break;
        case 'world':
          this.updateWorldState(consequence.target, consequence.value);
          break;
        case 'story':
          // Handle story-level consequences
          break;
        case 'meta':
          // Handle meta-level consequences
          break;
      }
    });
  }

  /**
   * Update character state
   */
  private updateCharacterState(characterId: string, value: any): void {
    const currentState = this.narrativeState.characterStates.get(characterId) || {};
    this.narrativeState.characterStates.set(characterId, {
      ...currentState,
      ...value
    });
  }

  /**
   * Update world state
   */
  private updateWorldState(key: string, value: any): void {
    this.narrativeState.worldStates.set(key, value);
  }

  /**
   * Navigate to segment
   */
  public navigateToSegment(segmentId: string): void {
    this.narrativeState.currentSegment = segmentId;
    this.narrativeState.visitedSegments.add(segmentId);
  }

  /**
   * Get next segments
   */
  public getNextSegments(segmentId: string): NarrativeSegment[] {
    const mode = this.currentMode;
    if (!mode) return [];
    
    const connections = mode.structure.connections.filter(c => c.from === segmentId);
    return connections.map(c => {
      const segment = mode.structure.segments.find(s => s.id === c.to);
      return segment!;
    }).filter(s => s !== undefined);
  }

  /**
   * Get accessible branches
   */
  public getAccessibleBranches(segmentId: string): NarrativeBranch[] {
    return Array.from(this.branches.values()).filter(branch => {
      if (branch.parentId !== segmentId) return false;
      if (branch.accessibilityCondition) {
        return this.evaluateCondition(branch.accessibilityCondition);
      }
      return branch.accessible;
    });
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(condition: string): boolean {
    // Simple condition evaluation
    // In production, this would use a proper expression parser
    return true;
  }

  /**
   * Get choices for segment
   */
  public getChoicesForSegment(segmentId: string): InteractiveChoice[] {
    return Array.from(this.choices.values()).filter(choice => {
      if (choice.segmentId !== segmentId) return false;
      if (choice.visibility === 'condition' && choice.visibilityCondition) {
        return this.evaluateCondition(choice.visibilityCondition);
      }
      return choice.visibility === 'always';
    });
  }

  /**
   * Add meta narrative layer
   */
  public addMetaLayer(layer: MetaNarrativeLayer): void {
    this.metaLayers.push(layer);
  }

  /**
   * Get meta content for segment
   */
  public getMetaContent(segmentId: string): string[] {
    return this.metaLayers
      .filter(layer => layer.placement === segmentId || layer.placement === 'all')
      .map(layer => layer.content);
  }

  /**
   * Create achievement
   */
  public createAchievement(
    name: string,
    description: string,
    condition: string
  ): Achievement {
    const achievement: Achievement = {
      id: uuidv4(),
      name,
      description,
      condition,
      unlocked: false
    };
    
    this.achievements.set(achievement.id, achievement);
    return achievement;
  }

  /**
   * Check achievements
   */
  public checkAchievements(): Achievement[] {
    const unlocked: Achievement[] = [];
    
    this.achievements.forEach(achievement => {
      if (!achievement.unlocked && this.evaluateCondition(achievement.condition)) {
        achievement.unlocked = true;
        achievement.unlockTime = Date.now();
        unlocked.push(achievement);
        this.narrativeState.achievements.push(achievement);
      }
    });
    
    return unlocked;
  }

  /**
   * Generate non-linear sequence
   */
  public generateNonLinearSequence(
    modeId: string,
    segments: string[],
    order: NonLinearSequence['order']
  ): NonLinearSequence {
    const sequence: NonLinearSequence = {
      id: uuidv4(),
      segments,
      order,
      userOrderable: order !== 'custom',
      defaultOrder: this.generateDefaultOrder(segments, order)
    };
    
    return sequence;
  }

  /**
   * Generate default order
   */
  private generateDefaultOrder(segments: string[], order: NonLinearSequence['order']): number[] {
    switch (order) {
      case 'chronological':
      case 'random':
        return segments.map((_, i) => i);
      case 'thematic':
        return this.thematicSort(segments);
      case 'emotional':
        return this.emotionalSort(segments);
      case 'custom':
        return segments.map((_, i) => i);
      default:
        return segments.map((_, i) => i);
    }
  }

  /**
   * Thematic sort
   */
  private thematicSort(segments: string[]): number[] {
    // Simple implementation - in production would use actual thematic analysis
    return segments.map((_, i) => i);
  }

  /**
   * Emotional sort
   */
  private emotionalSort(segments: string[]): number[] {
    // Simple implementation - in production would use actual emotional analysis
    return segments.map((_, i) => i);
  }

  /**
   * Create fragmentary narrative
   */
  public createFragmentaryNarrative(
    fragments: NarrativeFragment[],
    reconstructionRules: ReconstructionRule[]
  ): FragmentaryNarrative {
    return {
      fragments,
      connections: this.connectFragments(fragments),
      reconstructionRules,
      requiredFragments: fragments.filter(f => !f.metadata.get('optional')).map(f => f.id),
      optionalFragments: fragments.filter(f => f.metadata.get('optional')).map(f => f.id)
    };
  }

  /**
   * Connect fragments
   */
  private connectFragments(fragments: NarrativeFragment[]): FragmentConnection[] {
    const connections: FragmentConnection[] = [];
    
    for (let i = 0; i < fragments.length; i++) {
      for (let j = i + 1; j < fragments.length; j++) {
        const strength = this.calculateFragmentConnection(fragments[i], fragments[j]);
        if (strength > 0.5) {
          connections.push({
            fromFragment: fragments[i].id,
            toFragment: fragments[j].id,
            connectionType: 'thematic',
            strength,
            description: 'Fragments share thematic elements'
          });
        }
      }
    }
    
    return connections;
  }

  /**
   * Calculate fragment connection
   */
  private calculateFragmentConnection(f1: NarrativeFragment, f2: NarrativeFragment): number {
    // Simple implementation - would use content analysis
    if (f1.category === f2.category) return 0.7;
    return 0.3;
  }

  /**
   * Analyze experimental mode
   */
  public analyzeMode(modeId: string): ExperimentalAnalysis {
    const mode = this.modes.get(modeId);
    if (!mode) {
      throw new Error('Mode not found');
    }
    
    return {
      modeId,
      complexity: this.calculateComplexity(mode),
      accessibility: this.calculateAccessibility(mode),
      innovation: this.calculateInnovation(mode),
      coherence: this.calculateCoherence(mode),
      readerEngagement: this.calculateReaderEngagement(mode),
      technicalFeasibility: this.calculateTechnicalFeasibility(mode),
      suggestions: this.generateSuggestions(mode),
      warnings: this.generateWarnings(mode)
    };
  }

  /**
   * Calculate complexity
   */
  private calculateComplexity(mode: NarrativeMode): number {
    let complexity = 0.3;
    
    if (mode.rules.chronology !== 'linear') complexity += 0.2;
    if (mode.rules.perspective === 'multiple') complexity += 0.2;
    if (mode.rules.reality === 'multiple') complexity += 0.2;
    if (mode.type === 'interactive') complexity += 0.2;
    
    return Math.min(1, complexity);
  }

  /**
   * Calculate accessibility
   */
  private calculateAccessibility(mode: NarrativeMode): number {
    let accessibility = 0.7;
    
    if (mode.type === 'non-linear') accessibility -= 0.2;
    if (mode.type === 'fragmentary') accessibility -= 0.2;
    if (mode.type === 'meta-narrative') accessibility -= 0.1;
    
    return Math.max(0, accessibility);
  }

  /**
   * Calculate innovation
   */
  private calculateInnovation(mode: NarrativeMode): number {
    const innovativeTypes: ExperimentalType[] = [
      'meta-narrative', 'ai-generated', 'collaborative', 'transmedia',
      'procedural-generation', 'immersive'
    ];
    
    return innovativeTypes.includes(mode.type) ? 0.8 : 0.5;
  }

  /**
   * Calculate coherence
   */
  private calculateCoherence(mode: NarrativeMode): number {
    let coherence = 0.7;
    
    if (mode.rules.chronology === 'non-linear' || mode.rules.chronology === 'fragmented') {
      coherence -= 0.2;
    }
    if (mode.rules.perspective === 'multiple') coherence -= 0.1;
    if (mode.rules.narrator.type === 'unreliable') coherence -= 0.2;
    
    return Math.max(0, coherence);
  }

  /**
   * Calculate reader engagement
   */
  private calculateReaderEngagement(mode: NarrativeMode): number {
    let engagement = 0.6;
    
    if (mode.type === 'interactive' || mode.type === 'choose-your-own-adventure') {
      engagement += 0.3;
    }
    if (mode.type === 'immersive') engagement += 0.2;
    
    return Math.min(1, engagement);
  }

  /**
   * Calculate technical feasibility
   */
  private calculateTechnicalFeasibility(mode: NarrativeMode): number {
    const complexTypes: ExperimentalType[] = [
      'ai-generated', 'procedural-generation', 'transmedia', 'multimedia'
    ];
    
    return complexTypes.includes(mode.type) ? 0.6 : 0.9;
  }

  /**
   * Generate suggestions
   */
  private generateSuggestions(mode: NarrativeMode): string[] {
    const suggestions: string[] = [];
    
    if (mode.type === 'non-linear') {
      suggestions.push('Include clear timeline markers');
      suggestions.push('Use consistent character names across timelines');
    }
    
    if (mode.type === 'meta-narrative') {
      suggestions.push('Balance meta-content with narrative content');
      suggestions.push('Make meta-commentary purposeful, not gratuitous');
    }
    
    if (mode.type === 'interactive') {
      suggestions.push('Ensure all choices are meaningful');
      suggestions.push('Provide clear consequences for choices');
    }
    
    return suggestions;
  }

  /**
   * Generate warnings
   */
  private generateWarnings(mode: NarrativeMode): string[] {
    const warnings: string[] = [];
    
    if (mode.type === 'fragmentary') {
      warnings.push('Fragmentary narratives can be confusing for some readers');
      warnings.push('Consider providing reconstruction hints');
    }
    
    if (mode.type === 'stream-of-consciousness') {
      warnings.push('Stream of consciousness requires skilled writing');
      warnings.push('Risk of reader disorientation');
    }
    
    return warnings;
  }

  // ===== PUBLIC API =====

  /**
   * Get current mode
   */
  public getCurrentMode(): NarrativeMode | null {
    return this.currentMode;
  }

  /**
   * Get mode by ID
   */
  public getMode(modeId: string): NarrativeMode | undefined {
    return this.modes.get(modeId);
  }

  /**
   * Get all modes
   */
  public getAllModes(): NarrativeMode[] {
    return Array.from(this.modes.values());
  }

  /**
   * Get narrative state
   */
  public getNarrativeState(): NarrativeState {
    return this.narrativeState;
  }

  /**
   * Get branches
   */
  public getBranches(): NarrativeBranch[] {
    return Array.from(this.branches.values());
  }

  /**
   * Get choices
   */
  public getChoices(): InteractiveChoice[] {
    return Array.from(this.choices.values());
  }

  /**
   * Get timelines
   */
  public getTimelines(): ParallelTimeline[] {
    return Array.from(this.timelines.values());
  }

  /**
   * Get achievements
   */
  public getAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  /**
   * Get meta layers
   */
  public getMetaLayers(): MetaNarrativeLayer[] {
    return this.metaLayers;
  }

  /**
   * Export mode configuration
   */
  public exportMode(modeId: string): string {
    const mode = this.modes.get(modeId);
    if (!mode) {
      throw new Error('Mode not found');
    }
    
    return JSON.stringify(mode, null, 2);
  }

  /**
   * Import mode configuration
   */
  public importMode(config: string): NarrativeMode {
    const mode: NarrativeMode = JSON.parse(config);
    this.modes.set(mode.id, mode);
    return mode;
  }

  /**
   * Clear all data
   */
  public clearAllData(): void {
    this.modes.clear();
    this.currentMode = null;
    this.branches.clear();
    this.choices.clear();
    this.timelines.clear();
    this.achievements.clear();
    this.metaLayers = [];
    this.resetNarrativeState();
  }
}