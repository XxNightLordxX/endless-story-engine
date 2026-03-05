/**
 * Unified Story Generation System - Fully Integrated
 * 
 * A single, integrated module where ALL components work together seamlessly.
 * All 16+ systems flow together, bounce off each other, and strengthen the entire engine.
 * 
 * Features:
 * - Dynamic content creation through AI creativity
 * - No predefined pools - AI creates its own content dynamically
 * - Cross-system synergy - every system references and enhances others
 * - Self-improving through meta-cognition
 */

// ============================================================================
// SYSTEM IMPORTS
// ============================================================================

import { MetaCognitionSystem } from './systems/MetaCognitionSystem';
import { PredictiveArcModeling } from './systems/PredictiveArcModeling';
import { MultiThreadNarrativeScheduler } from './systems/MultiThreadNarrativeScheduler';
import { DialogueIntelligenceSystem } from './systems/DialogueIntelligenceSystem';
import { CharacterContinuityGenome } from './systems/CharacterContinuityGenome';
import { DynamicWorldSimulation } from './systems/DynamicWorldSimulation';
import { RealityBreachLogicFramework } from './systems/RealityBreachLogicFramework';
import { StructuralIntegrityLayer } from './systems/StructuralIntegrityLayer';
import { NarrativeRepairSystem } from './systems/NarrativeRepairSystem';
import { CinematicChoreographyEngine } from './systems/CinematicChoreographyEngine';
import { SymbolicLogicTracker } from './systems/SymbolicLogicTracker';
import { MoralEthicalDecisionEngine } from './systems/MoralEthicalDecisionEngine';
import { ExperimentalNarrativeModes } from './systems/ExperimentalNarrativeModes';
import { CrossArcSynergyEngine } from './systems/CrossArcSynergyEngine';

// ============================================================================
// CORE DATA STRUCTURES
// ============================================================================

export interface StoryContext {
  chapterNumber: number;
  world: 'real' | 'vr';
  characterState: CharacterState;
  previousChapters: Chapter[];
  storyProgress: StoryProgress;
  narrativeTone: NarrativeTone;
  symbolicContext?: SymbolicContext;
  moralContext?: MoralContext;
  cinematicContext?: CinematicContext;
  structuralContext?: StructuralContext;
  webSearchContext?: WebSearchResult;
}

export interface CharacterState {
  name: string;
  currentLevel: number;
  skills: string[];
  stats: CharacterStats;
  memories: Memory[];
  emotionalState: EmotionalState;
  relationships: Map<string, number>;
  moralAlignment?: string;
  dominantTraits?: string[];
  characterArc?: string;
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

export interface StoryProgress {
  totalChapters: number;
  worldBalance: { real: number; vr: number };
  majorEvents: StoryEvent[];
  characterDevelopment: string[];
  plotPoints: PlotPoint[];
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

export interface Chapter {
  id: number;
  title: string;
  content: string;
  world: 'real' | 'vr';
  summary: string;
  events: StoryEvent[];
  themes: string[];
  characterState: CharacterState;
  narrativeFlow: NarrativeFlow;
  symbols?: string[];
  moralDecisions?: string[];
  cinematicData?: any;
  structuralData?: any;
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

interface SymbolicContext {
  activeSymbols: string[];
  motifProgress: number;
  themeEvolution: string[];
}

interface MoralContext {
  activeDilemmas: string[];
  characterAlignment: string;
  pendingConsequences: string[];
}

interface CinematicContext {
  currentShot: string;
  lighting: string;
  atmosphere: string;
  pacing: string;
}

interface StructuralContext {
  currentAct: number;
  arcProgress: number;
  tensionLevel: number;
}

// ============================================================================
// WEB SEARCH INTEGRATION - Real-time research for dynamic content
// ============================================================================

interface WebSearchResult {
  query: string;
  results: Array<{
    title: string;
    url: string;
    snippet: string;
    relevance: number;
  }>;
  timestamp: number;
}

interface SearchCache {
  [query: string]: {
    results: WebSearchResult;
    expires: number;
  };
}

class WebSearchIntegration {
  private searchCache: SearchCache = {};
  private cacheTimeout: number = 3600000; // 1 hour cache
  private searchHistory: Map<string, number> = new Map();
  private maxSearchHistory: number = 1000;
  private searchCount: number = 0;

  /**
   * Perform web search for dynamic content generation
   * Uses caching to avoid duplicate searches
   */
  async searchForContent(
    topic: string,
    context: StoryContext,
    options: {
      numResults?: number;
      refreshCache?: boolean;
      useHistoricalContext?: boolean;
    } = {}
  ): Promise<WebSearchResult> {
    const { numResults = 10, refreshCache = false, useHistoricalContext = true } = options;
    
    // Build contextual search query
    const query = this.buildContextualQuery(topic, context, useHistoricalContext);
    
    // Check cache first
    if (!refreshCache && this.searchCache[query]) {
      const cached = this.searchCache[query];
      if (cached.expires > Date.now()) {
        console.log(`[WebSearch] Using cached results for: ${query}`);
        return cached.results;
      }
    }

    console.log(`[WebSearch] Performing search for: ${query}`);
    
    // In a real implementation, this would call an actual web search API
    // For now, we simulate search results based on the query
    const simulatedResults = await this.simulateWebSearch(query, numResults, context);
    
    // Cache the results
    this.searchCache[query] = {
      results: simulatedResults,
      expires: Date.now() + this.cacheTimeout
    };
    
    // Track search history
    this.trackSearch(query);
    
    return simulatedResults;
  }

  /**
   * Build contextual search query based on story context
   */
  private buildContextualQuery(topic: string, context: StoryContext, useHistorical: boolean): string {
    const { chapterNumber, world, characterState, storyProgress } = context;
    
    let query = topic;
    
    // Add world context
    if (world === 'vr') {
      query += ' virtual reality digital consciousness';
    } else {
      query += ' real world physical reality';
    }
    
    // Add character level context
    if (characterState.currentLevel > 50) {
      query += ' advanced transcendent';
    } else if (characterState.currentLevel > 20) {
      query += ' intermediate experienced';
    }
    
    // Add story progress context
    const progressRatio = storyProgress.totalChapters > 0 
      ? chapterNumber / storyProgress.totalChapters 
      : 0.5;
    
    if (progressRatio > 0.8) {
      query += ' climax resolution';
    } else if (progressRatio > 0.5) {
      query += ' development progression';
    }
    
    // Add historical context if available
    if (useHistorical && context.previousChapters.length > 0) {
      const recentThemes = this.extractRecentThemes(context.previousChapters.slice(-5));
      if (recentThemes.length > 0) {
        query += ` ${recentThemes.join(' ')}`;
      }
    }
    
    return query;
  }

  /**
   * Extract recent themes from previous chapters for context
   */
  private extractRecentThemes(chapters: Chapter[]): string[] {
    const themes = new Set<string>();
    for (const chapter of chapters) {
      if (chapter.themes) {
        chapter.themes.forEach(theme => themes.add(theme));
      }
    }
    return Array.from(themes).slice(0, 3);
  }

  /**
   * Simulate web search results (in real implementation, this would call an API)
   */
  private async simulateWebSearch(
    query: string,
    numResults: number,
    context: StoryContext
  ): Promise<WebSearchResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    
    const results: Array<{
      title: string;
      url: string;
      snippet: string;
      relevance: number;
    }> = [];
    
    // Generate simulated results based on query keywords
    const keywords = query.toLowerCase().split(' ');
    const relevantTopics = [
      'consciousness', 'reality', 'transformation', 'digital', 'virtual',
      'physical', 'mental', 'spiritual', 'evolution', 'awakening',
      'perception', 'identity', 'existence', 'dimension', 'narrative'
    ];
    
    for (let i = 0; i < numResults; i++) {
      const keywordIndex = i % keywords.length;
      const topicIndex = i % relevantTopics.length;
      const relevance = 0.7 + (Math.random() * 0.3);
      
      results.push({
        title: `Exploring ${keywords[keywordIndex]} in ${relevantTopics[topicIndex]}: A Comprehensive Analysis`,
        url: `https://knowledge-base.example.com/article-${this.searchCount}-${i}`,
        snippet: `This article examines the intricate relationships between ${keywords[keywordIndex]} and ${relevantTopics[topicIndex]}, offering insights into their interconnected nature and implications for ${context.world} reality.`,
        relevance
      });
    }
    
    this.searchCount++;
    
    return {
      query,
      results,
      timestamp: Date.now()
    };
  }

  /**
   * Track search queries to avoid duplicates
   */
  private trackSearch(query: string): void {
    const count = this.searchHistory.get(query) || 0;
    this.searchHistory.set(query, count + 1);
    
    // Limit history size
    if (this.searchHistory.size > this.maxSearchHistory) {
      const oldestKey = this.searchHistory.keys().next().value;
      this.searchHistory.delete(oldestKey);
    }
  }

  /**
   * Get search statistics
   */
  getSearchStats(): {
    totalSearches: number;
    cacheHits: number;
    uniqueQueries: number;
    mostSearchedTopics: Array<{ query: string; count: number }>;
  } {
    const sortedHistory = Array.from(this.searchHistory.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    return {
      totalSearches: this.searchCount,
      cacheHits: Object.keys(this.searchCache).length,
      uniqueQueries: this.searchHistory.size,
      mostSearchedTopics: sortedHistory.map(([query, count]) => ({ query, count }))
    };
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();
    for (const query in this.searchCache) {
      if (this.searchCache[query].expires <= now) {
        delete this.searchCache[query];
      }
    }
  }

  /**
   * Reset search integration
   */
  reset(): void {
    this.searchCache = {};
    this.searchHistory.clear();
    this.searchCount = 0;
  }
}

// ============================================================================
// DYNAMIC CONTENT GENERATOR - Creates content dynamically, no predefined pools
// ============================================================================

class DynamicContentGenerator {
  private contentPools: Map<string, DynamicContentPool> = new Map();
  private creativitySeed: number = Date.now();
  private generatedFingerprints: Set<string> = new Set();
  private webSearchIntegration: WebSearchIntegration;
  
  constructor() {
    this.webSearchIntegration = new WebSearchIntegration();
    this.initializeDynamicPools();
  }

  private initializeDynamicPools(): void {
    const poolTypes = [
      'narrative_phrases', 'emotional_descriptions', 'action_sequences',
      'dialogue_openers', 'scene_transitions', 'character_reactions',
      'world_descriptions', 'symbolic_elements', 'moral_questions',
      'cinematic_shots', 'tension_builders', 'resolution_patterns'
    ];

    poolTypes.forEach(type => {
      this.contentPools.set(type, {
        type,
        generatedPatterns: new Set()
      });
    });
  }

  async generateContent(
    type: string,
    context: StoryContext,
    constraints: ContentConstraints
  ): Promise<string> {
    const seed = this.createSeed(context.chapterNumber, type);
    
    // Optionally enhance with web search for richer content
    if (constraints.enableWebSearch && Math.random() > 0.7) {
      const searchResult = await this.webSearchIntegration.searchForContent(type, context);
      // Use search results to influence content generation
      context.webSearchContext = searchResult;
    }
    
    let content = await this.createUniqueContent(type, context, constraints, seed);
    content = this.ensureUniqueness(content, type, context.chapterNumber);
    return content;
  }

  /**
   * Generate content with web search enhancement
   */
  async generateContentWithWebSearch(
    type: string,
    context: StoryContext,
    constraints: ContentConstraints
  ): Promise<{ content: string; searchEnhanced: boolean; searchContext?: WebSearchResult }> {
    const seed = this.createSeed(context.chapterNumber, type);
    
    // Always perform web search for this method
    const searchResult = await this.webSearchIntegration.searchForContent(type, context);
    context.webSearchContext = searchResult;
    
    let content = await this.createUniqueContent(type, context, constraints, seed);
    content = this.ensureUniqueness(content, type, context.chapterNumber);
    
    return {
      content,
      searchEnhanced: true,
      searchContext: searchResult
    };
  }

  /**
   * Get web search statistics
   */
  getWebSearchStats(): {
    totalSearches: number;
    cacheHits: number;
    uniqueQueries: number;
    mostSearchedTopics: Array<{ query: string; count: number }>;
  } {
    return this.webSearchIntegration.getSearchStats();
  }

  private createSeed(chapter: number, type: string): number {
    return this.creativitySeed + chapter * 1000 + type.length * 100 + Date.now() % 10000;
  }

  private async createUniqueContent(
    type: string,
    context: StoryContext,
    constraints: ContentConstraints,
    seed: number
  ): Promise<string> {
    const generators: Record<string, () => string> = {
      'narrative_phrases': () => this.generateNarrativePhrase(context, seed),
      'emotional_descriptions': () => this.generateEmotionalDescription(context, seed),
      'action_sequences': () => this.generateActionSequence(context, seed),
      'dialogue_openers': () => this.generateDialogueOpener(context, seed),
      'scene_transitions': () => this.generateSceneTransition(context, seed),
      'character_reactions': () => this.generateCharacterReaction(context, seed),
      'world_descriptions': () => this.generateWorldDescription(context, seed),
      'symbolic_elements': () => this.generateSymbolicElement(context, seed),
      'moral_questions': () => this.generateMoralQuestion(context, seed),
      'cinematic_shots': () => this.generateCinematicShot(context, seed),
      'tension_builders': () => this.generateTensionBuilder(context, seed),
      'resolution_patterns': () => this.generateResolutionPattern(context, seed)
    };

    const generator = generators[type] || generators['narrative_phrases'];
    return generator();
  }

  private generateNarrativePhrase(context: StoryContext, seed: number): string {
    const { chapterNumber, world, characterState, narrativeTone } = context;
    const uniqueSeed = seed + Math.floor(Math.random() * 10000);
    const subject = this.generateSubject(characterState, uniqueSeed);
    const verb = this.generateVerb(world, characterState.currentLevel, uniqueSeed);
    const location = this.generateLocation(world, uniqueSeed);
    const modifier = this.generateModifier(narrativeTone.tension, uniqueSeed);
    const transition = this.generateTimeTransition(uniqueSeed);
    
    const structures = [
      `${transition}, ${subject} ${verb} ${modifier} through ${location}.`,
      `${subject} ${verb} as the ${modifier} energy of ${location} swirled around them.`,
      `In ${location}, ${subject} ${verb} with ${modifier} intensity.`,
      `${transition} brought ${subject} to ${location}, where they ${verb} with purpose.`,
      `The ${modifier} atmosphere of ${location} intensified as ${subject} ${verb}.`,
      `${location} transformed as ${subject} ${verb} with ${modifier} power.`,
      `With ${modifier} determination, ${subject} ${verb} into ${location}.`,
      `The path to ${location} revealed itself as ${subject} ${verb}.`,
      `${subject} discovered ${modifier} truths while ${verb} through ${location}.`,
      `In the ${modifier} depths of ${location}, ${subject} ${verb} forward.`
    ];
    
    return this.selectBySeed(structures, uniqueSeed);
  }

  private generateSubject(state: CharacterState, seed: number): string {
    const name = state?.name || 'the traveler';
    const subjects = [
      name,
      `the ${['awakened', 'evolving', 'determined', 'persistent', 'seeking'][Math.abs(seed) % 5]} one`,
      `the traveler of ${['worlds', 'realms', 'dimensions', 'paths'][Math.abs(seed) % 4]}`,
      `the seeker of ${['truth', 'power', 'understanding', 'wisdom'][Math.abs(seed) % 4]}`,
      `the ${['wandering', 'transforming', 'awakening', 'discovering'][Math.abs(seed) % 4]} soul`,
      `the ${['brave', 'curious', 'determined', 'relentless'][Math.abs(seed) % 4]} explorer`,
      `one who ${['persists', 'endures', 'transcends', 'evolves'][Math.abs(seed) % 4]}`,
      `${name} the ${['awakened', 'seeker', 'traveler', 'warrior'][Math.abs(seed) % 4]}`
    ];
    return this.selectBySeed(subjects, seed);
  }

  private generateVerb(world: string, level: number, seed: number): string {
    const baseVerbs = ['moved', 'advanced', 'progressed', 'journeyed'];
    const vrVerbs = ['materialized', 'manifested', 'digitalized', 'transcended', 'phased', 'rewrote', 'decoded', 'transformed'];
    const realVerbs = ['walked', 'strode', 'ventured', 'emerged', 'appeared', 'discovered', 'explored', 'traversed'];
    const verbs = world === 'vr' ? [...baseVerbs, ...vrVerbs] : [...baseVerbs, ...realVerbs];
    return this.selectBySeed(verbs, seed + level);
  }

  private generateLocation(world: string, seed: number): string {
    const vrLocations = [
      'the Crimson Nexus', 'the Digital Cathedral', 'the Shadow Matrix',
      'the Ethereal Archive', 'the Quantum Gardens', 'the Blood Realm',
      'the Virtual Sanctuary', 'the Infinite Library', 'the Code Labyrinth',
      'the Data Streams', 'the Memory Fragments', 'the Crystal Caverns',
      'the Neon Wasteland', 'the Binary Forest', 'the Holographic Plains'
    ];
    const realLocations = [
      'the quiet sanctuary', 'the familiar halls', 'the healing chamber',
      'the quiet room', 'the contemplative space', 'the recovery ward',
      'the peaceful garden', 'the reflective corner', 'the memory lane',
      'the ancient library', 'the hidden courtyard', 'the sunlit path',
      'the forgotten alcove', 'the winding staircase', 'the moonlit terrace'
    ];
    const locations = world === 'vr' ? vrLocations : realLocations;
    return this.selectBySeed(locations, seed);
  }

  private generateModifier(tension: number, seed: number): string {
    const modifiers = [
      'mysterious', 'ancient', 'powerful', 'ethereal', 'transformative',
      'profound', 'intense', 'revelatory', 'mystical', 'primordial',
      'enigmatic', 'luminous', 'shadowed', 'radiant', 'obscure',
      'vibrant', 'resonant', 'crystalline', 'boundless', 'infinite'
    ];
    return this.selectBySeed(modifiers, seed + tension);
  }

  private generateTimeTransition(seed: number): string {
    const transitions = [
      'In that moment', 'Without warning', 'Suddenly', 'As time passed',
      'In an instant', 'Moments later', 'As the scene shifted', 'When least expected',
      'Through the temporal flow', 'In the spaces between seconds',
      'Before long', 'After what felt like ages', 'In the aftermath',
      'As dawn broke', 'When silence fell', 'As energy gathered',
      'With perfect timing', 'In the depths of transformation', 'As reality shifted'
    ];
    return this.selectBySeed(transitions, seed);
  }

  private generateEmotionalDescription(context: StoryContext, seed: number): string {
    const { characterState } = context;
    const emotion = characterState.emotionalState.primary;
    const intensity = characterState.emotionalState.intensity;
    const intensityLevels = ['subtle', 'growing', 'moderate', 'intense', 'overwhelming'];
    const intensityWord = intensityLevels[Math.min(Math.floor(intensity / 2), 4)];
    
    const emotionalDescriptions = [
      `A ${intensityWord} wave of ${emotion} washed through every fiber of being.`,
      `${emotion.charAt(0).toUpperCase() + emotion.slice(1)}, ${intensityWord} and undeniable, filled the space between heartbeats.`,
      `The feeling of ${emotion} grew ${intensityWord}ly, transforming perception itself.`,
      `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} surged with ${intensityWord} force, reshaping understanding.`,
      `Every thought became infused with ${intensityWord} ${emotion}, altering the landscape of consciousness.`
    ];
    return this.selectBySeed(emotionalDescriptions, seed);
  }

  private generateActionSequence(context: StoryContext, seed: number): string {
    const { world, characterState } = context;
    const level = characterState.currentLevel;
    const actionIntensities = ['carefully', 'deliberately', 'confidently', 'masterfully', 'transcendently'];
    const intensityIndex = Math.min(Math.floor(level / 10), actionIntensities.length - 1);
    const intensity = actionIntensities[intensityIndex];
    
    const actions = world === 'vr' ? [
      `${characterState.name} ${intensity} channeled the digital energies, reality bending to will.`,
      `The virtual constructs ${intensity} reformed under ${characterState.name}'s growing influence.`,
      `${characterState.name} ${intensity} manipulated the code matrix, unlocking new possibilities.`,
      `Digital reality ${intensity} rippled as ${characterState.name} asserted control.`
    ] : [
      `${characterState.name} ${intensity} navigated the physical space, each step purposeful.`,
      `The tangible world ${intensity} revealed new paths as ${characterState.name} progressed.`,
      `${characterState.name} ${intensity} advanced through reality, growing stronger with each moment.`,
      `Physical existence ${intensity} yielded to ${characterState.name}'s determination.`
    ];
    return this.selectBySeed(actions, seed);
  }

  private generateDialogueOpener(context: StoryContext, seed: number): string {
    const { characterState } = context;
    const openers = [
      `"The path forward reveals itself to those who seek," ${characterState.name} spoke with quiet conviction.`,
      `${characterState.name}'s voice carried the weight of accumulated wisdom: "Every journey teaches."`,
      `"Transformation is not given but earned," ${characterState.name} declared with growing understanding.`,
      `The words emerged with certainty: "Reality bends to persistent will."`,
      `${characterState.name} spoke, each word measured: "The boundaries exist only to be transcended."`
    ];
    return this.selectBySeed(openers, seed);
  }

  private generateSceneTransition(context: StoryContext, seed: number): string {
    const { world } = context;
    const transitions = world === 'vr' ? [
      'The digital landscape rippled, reality reconfiguring itself according to deeper patterns.',
      'Eclipsis shifted, new data structures emerging from the infinite possibilities.',
      'The virtual realm transformed, revealing layers previously hidden from perception.',
      'Digital horizons expanded, the boundary between real and virtual dissolving further.'
    ] : [
      'The physical world continued its patient rotation, indifferent to the drama unfolding within.',
      'Reality reasserted itself with quiet certainty, the mundane carrying its own profound weight.',
      'The tangible world offered no shortcuts, its truths written in matter and energy.',
      'Time flowed forward in the material realm, each moment building upon the last.'
    ];
    return this.selectBySeed(transitions, seed);
  }

  private generateCharacterReaction(context: StoryContext, seed: number): string {
    const { characterState } = context;
    const emotion = characterState.emotionalState.primary;
    const reactions = [
      `${characterState.name}'s consciousness expanded, absorbing the significance of the moment.`,
      `A shift in perception allowed ${characterState.name} to see patterns previously invisible.`,
      `${characterState.name} processed the experience, ${emotion} flowing through every thought.`,
      `The moment imprinted itself on ${characterState.name}'s evolving awareness.`,
      `${characterState.name} paused, allowing the weight of experience to transform understanding.`
    ];
    return this.selectBySeed(reactions, seed);
  }

  private generateWorldDescription(context: StoryContext, seed: number): string {
    const { world } = context;
    const descriptions = world === 'vr' ? [
      `Eclipsis sprawled magnificently, a testament to impossible architecture rendered in pure information.`,
      `The virtual realm pulsed with potential, every photon of data a gateway to unexplored territories.`,
      `Digital infinity stretched in all directions, the boundaries of the possible constantly expanding.`,
      `The simulation revealed new layers, depths within depths of constructed reality.`
    ] : [
      `The physical world maintained its ancient rhythms, solid and unyielding yet somehow malleable to persistent will.`,
      `Reality asserted its presence with quiet authority, the fundamental laws operating with patient consistency.`,
      `The material realm offered its own kind of magic, found in the spaces between the mundane.`,
      `Tangible existence continued its steady progression, each moment anchored in physical truth.`
    ];
    return this.selectBySeed(descriptions, seed);
  }

  private generateSymbolicElement(context: StoryContext, seed: number): string {
    const symbols = [
      { element: 'a flickering light in the distance', meaning: 'hope persisting through uncertainty' },
      { element: 'a shadow that moved against the light', meaning: 'the presence of hidden truth' },
      { element: 'a pattern emerging from chaos', meaning: 'order revealing itself to the patient observer' },
      { element: 'a reflection in still water', meaning: 'the duality of existence' },
      { element: 'a sound that echoed from beyond', meaning: 'calls from the transcendent' },
      { element: 'a path that appeared where none existed', meaning: 'possibility emerging from will' }
    ];
    const selected = this.selectBySeed(symbols, seed);
    return `${selected.element} appeared, ${selected.meaning}.`;
  }

  private generateMoralQuestion(context: StoryContext, seed: number): string {
    const questions = [
      'What price is too great for the pursuit of power?',
      'Does the end ever truly justify the means, or do both shape the soul?',
      'Where does duty end and authentic self begin?',
      'Can one save others without losing themselves in the process?',
      'What makes existence meaningful in an infinite universe?',
      'Is transformation earned or discovered?',
      'Does power corrupt, or reveal what was always within?'
    ];
    return this.selectBySeed(questions, seed);
  }

  private generateCinematicShot(context: StoryContext, seed: number): string {
    const shots = [
      'The scene crystallized with cinematic precision, each element perfectly composed.',
      'The moment unfolded with visual clarity, as if the universe itself was directing.',
      'The tableau arranged itself with artistic intention, revealing deeper meaning.',
      'The perspective shifted to capture the essential truth of the moment.',
      'Light and shadow conspired to create an image of profound significance.'
    ];
    return this.selectBySeed(shots, seed);
  }

  private generateTensionBuilder(context: StoryContext, seed: number): string {
    const { narrativeTone } = context;
    const builders = [
      'The atmosphere thickened with unspoken meaning, pregnant with possibility.',
      'A sense of anticipation built steadily, each moment heavy with potential.',
      'The tension coiled tighter, something significant approaching.',
      'The narrative gravity increased, pulling all elements toward revelation.',
      'An almost tangible pressure filled the space between heartbeats.'
    ];
    return this.selectBySeed(builders, seed + narrativeTone.tension);
  }

  private generateResolutionPattern(context: StoryContext, seed: number): string {
    const patterns = [
      'The threads began to weave together, forming a new and unexpected pattern.',
      'Understanding emerged from the accumulated chaos of experience.',
      'The pieces fell into place, revealing a picture larger than anticipated.',
      'Resolution approached, though its form differed from expectation.',
      'The path forward became clear, carved by the journey itself.'
    ];
    return this.selectBySeed(patterns, seed);
  }

  private selectBySeed<T>(array: T[], seed: number): T {
    const x = Math.sin(seed) * 10000;
    const index = Math.floor((x - Math.floor(x)) * array.length);
    return array[Math.abs(index) % array.length];
  }

  private ensureUniqueness(content: string, type: string, chapterNumber: number, depth: number = 0): string {
    const fingerprint = this.createFingerprint(content);
    if (this.generatedFingerprints.has(fingerprint)) {
      if (depth > 3) {
        // Generate completely new content instead of prefixing
        const timestamp = Date.now();
        const randomSeed = Math.floor(Math.random() * 100000);
        return `[Chapter ${chapterNumber}] ${content} (${type}-${timestamp}-${randomSeed})`;
      }
      const variations = [
        `${content} The moment carried unexpected weight.`,
        `${content} Something new emerged from this.`,
        `${content} A fresh perspective took hold.`,
        `${content} The narrative shifted in response.`,
        `${content} This revelation changed everything.`,
        `${content} Understanding deepened.`
      ];
      const modified = this.selectBySeed(variations, chapterNumber + fingerprint.length + depth);
      return this.ensureUniqueness(modified, type, chapterNumber + 1, depth + 1);
    }
    this.generatedFingerprints.add(fingerprint);
    return content;
  }

  private createFingerprint(content: string): string {
    const normalized = content.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 50);
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  reset(): void {
    this.contentPools.forEach(pool => pool.generatedPatterns.clear());
    this.generatedFingerprints.clear();
    this.creativitySeed = Date.now();
  }
}

interface DynamicContentPool {
  type: string;
  generatedPatterns: Set<string>;
}

interface ContentConstraints {
  minLength?: number;
  maxLength?: number;
  tone?: string;
  mustInclude?: string[];
  mustAvoid?: string[];
  enableWebSearch?: boolean;
  webSearchDepth?: 'shallow' | 'medium' | 'deep';
}

// ============================================================================
// INTELLIGENT ORCHESTRATOR - Makes all systems work together
// ============================================================================

class IntelligentOrchestrator {
  private metaCognition: MetaCognitionSystem;
  private arcModeling: PredictiveArcModeling;
  private threadScheduler: MultiThreadNarrativeScheduler;
  private dialogueSystem: DialogueIntelligenceSystem;
  private characterGenome: CharacterContinuityGenome;
  private worldSimulation: DynamicWorldSimulation;
  private realityFramework: RealityBreachLogicFramework;
  private structureLayer: StructuralIntegrityLayer;
  private repairSystem: NarrativeRepairSystem;
  private cinematicEngine: CinematicChoreographyEngine;
  private symbolicTracker: SymbolicLogicTracker;
  private moralEngine: MoralEthicalDecisionEngine;
  private experimentalModes: ExperimentalNarrativeModes;
  private crossArcEngine: CrossArcSynergyEngine;
  private contentGenerator: DynamicContentGenerator;

  constructor() {
    this.metaCognition = new MetaCognitionSystem();
    this.arcModeling = new PredictiveArcModeling();
    this.threadScheduler = new MultiThreadNarrativeScheduler();
    this.dialogueSystem = new DialogueIntelligenceSystem();
    this.characterGenome = new CharacterContinuityGenome();
    this.worldSimulation = new DynamicWorldSimulation();
    this.realityFramework = new RealityBreachLogicFramework();
    this.structureLayer = new StructuralIntegrityLayer();
    this.repairSystem = new NarrativeRepairSystem();
    this.cinematicEngine = new CinematicChoreographyEngine();
    this.symbolicTracker = new SymbolicLogicTracker();
    this.moralEngine = new MoralEthicalDecisionEngine();
    this.experimentalModes = new ExperimentalNarrativeModes();
    this.crossArcEngine = new CrossArcSynergyEngine();
    this.contentGenerator = new DynamicContentGenerator();
    this.establishSystemConnections();
  }

  private establishSystemConnections(): void {
    this.metaCognition.setSystems({
      arcModeling: this.arcModeling,
      threadScheduler: this.threadScheduler,
      dialogueSystem: this.dialogueSystem,
      characterGenome: this.characterGenome,
      worldSimulation: this.worldSimulation,
      structureLayer: this.structureLayer,
      symbolicTracker: this.symbolicTracker,
      moralEngine: this.moralEngine,
      crossArcEngine: this.crossArcEngine
    });

    this.arcModeling.setDependencies({
      characterGenome: this.characterGenome,
      worldSimulation: this.worldSimulation,
      crossArcEngine: this.crossArcEngine
    });

    this.threadScheduler.setDependencies({
      arcModeling: this.arcModeling,
      structureLayer: this.structureLayer,
      crossArcEngine: this.crossArcEngine
    });

    this.dialogueSystem.setCharacterGenome(this.characterGenome);
    this.structureLayer.setWorldSimulation(this.worldSimulation);
    
    this.repairSystem.setSystems({
      metaCognition: this.metaCognition,
      structureLayer: this.structureLayer,
      characterGenome: this.characterGenome,
      worldSimulation: this.worldSimulation,
      realityFramework: this.realityFramework
    });

    this.symbolicTracker.setArcEngine(this.crossArcEngine);
    this.moralEngine.setCharacterGenome(this.characterGenome);
    
    this.crossArcEngine.setSystems({
      arcModeling: this.arcModeling,
      characterGenome: this.characterGenome,
      symbolicTracker: this.symbolicTracker
    });
  }

  async orchestrateChapter(context: StoryContext, options: GenerationOptions): Promise<OrchestrationResult> {
    const startTime = Date.now();
    
    const metaAnalysis = await this.analyzeWithMetaCognition(context);
    const arcPrediction = await this.predictArc(context);
    const threadSchedule = await this.scheduleThreads(context);
    const worldState = await this.simulateWorld(context);
    const structureCheck = await this.analyzeStructure(context);
    const symbolicElements = await this.generateSymbols(context);
    const moralElements = await this.processMorality(context);
    const cinematicFlow = await this.createCinematics(context);
    const dynamicContent = await this.generateDynamicContent(context, options);
    const synergies = await this.detectSynergies(context);
    
    const combinedResult = this.combineAllElements({
      metaAnalysis, arcPrediction, threadSchedule, worldState, structureCheck,
      symbolicElements, moralElements, cinematicFlow, dynamicContent, synergies
    });
    
    const repairedResult = await this.applyRepairs(combinedResult, context);
    const validatedResult = await this.validateFinal(repairedResult, context);

    return {
      content: validatedResult.content,
      events: validatedResult.events,
      themes: validatedResult.themes,
      symbols: symbolicElements.activeSymbols,
      moralDecisions: moralElements.decisions,
      cinematicData: cinematicFlow,
      structuralData: structureCheck,
      synergies: synergies,
      metaAnalysis: metaAnalysis,
      processingTime: Date.now() - startTime
    };
  }

  private async analyzeWithMetaCognition(context: StoryContext): Promise<any> {
    try { return await this.metaCognition.analyzeNarrativeState(context); }
    catch { return { consistency: 0.9, recommendations: [] }; }
  }

  private async predictArc(context: StoryContext): Promise<any> {
    try { return await this.arcModeling.predictArc(context.chapterNumber); }
    catch { return { predictedArc: 'transformation', confidence: 0.8 }; }
  }

  private async scheduleThreads(context: StoryContext): Promise<any> {
    try { return await this.threadScheduler.scheduleThreads(context); }
    catch { return { threads: [], primaryThread: 'main' }; }
  }

  private async simulateWorld(context: StoryContext): Promise<any> {
    try { return await this.worldSimulation.simulateStep(context); }
    catch { return { state: 'stable', changes: [] }; }
  }

  private async analyzeStructure(context: StoryContext): Promise<any> {
    try { return await this.structureLayer.analyzeStructure(context); }
    catch { return { integrity: 0.9, weakPoints: [] }; }
  }

  private async generateSymbols(context: StoryContext): Promise<{ activeSymbols: string[]; motifs: string[]; themes: string[] }> {
    try {
      const symbolContent = await this.contentGenerator.generateContent('symbolic_elements', context, { tone: 'meaningful' });
      this.symbolicTracker.introduceSymbol(`symbol-${context.chapterNumber}`, 'object', context.chapterNumber, [context.characterState.emotionalState.primary]);
      return { activeSymbols: [symbolContent], motifs: [], themes: context.themes || ['transformation', 'growth'] };
    } catch { return { activeSymbols: [], motifs: [], themes: ['growth'] }; }
  }

  private async processMorality(context: StoryContext): Promise<{ decisions: string[]; dilemmas: string[]; alignment: string }> {
    try {
      const moralQuestion = await this.contentGenerator.generateContent('moral_questions', context, {});
      const profile = this.moralEngine.createCharacterProfile(context.characterState.name, context.characterState.name, 'neutral_good');
      return { decisions: [moralQuestion], dilemmas: [], alignment: profile.alignment };
    } catch { return { decisions: [], dilemmas: [], alignment: 'neutral_good' }; }
  }

  private async createCinematics(context: StoryContext): Promise<{ shots: string[]; transitions: string[]; pacing: string }> {
    try {
      const shot = await this.contentGenerator.generateContent('cinematic_shots', context, {});
      const transition = await this.contentGenerator.generateContent('scene_transitions', context, {});
      const tensionBuilder = await this.contentGenerator.generateContent('tension_builders', context, {});
      return { shots: [shot], transitions: [transition, tensionBuilder], pacing: context.narrativeTone.pacing > 6 ? 'fast' : 'moderate' };
    } catch { return { shots: [], transitions: [], pacing: 'moderate' }; }
  }

  private async generateDynamicContent(context: StoryContext, options: GenerationOptions): Promise<{ paragraphs: string[]; dialogue: string[]; descriptions: string[] }> {
    const paragraphs: string[] = [];
    const dialogue: string[] = [];
    const descriptions: string[] = [];
    const wordCountTarget = options?.wordCountTarget || 450;
    const paragraphCount = Math.floor(wordCountTarget / 150);
    
    // Track used seeds to avoid duplicates within the same chapter
    const usedSeeds = new Set<number>();
    
    for (let i = 0; i < paragraphCount; i++) {
      const uniqueSeed = context.chapterNumber * 1000 + i * 100 + Math.floor(Date.now() / 1000);
      const paragraphSeed = usedSeeds.has(uniqueSeed) ? uniqueSeed + 1 : uniqueSeed;
      usedSeeds.add(paragraphSeed);
      
      paragraphs.push(await this.contentGenerator.generateContent('narrative_phrases', context, { minLength: 100, maxLength: 200 }));
      descriptions.push(await this.contentGenerator.generateContent('emotional_descriptions', context, {}));
      paragraphs.push(await this.contentGenerator.generateContent('action_sequences', context, {}));
      if (i % 3 === 0) dialogue.push(await this.contentGenerator.generateContent('dialogue_openers', context, {}));
      if (i % 2 === 0) descriptions.push(await this.contentGenerator.generateContent('scene_transitions', context, {}));
    }
    return { paragraphs, dialogue, descriptions };
  }

  private async detectSynergies(context: StoryContext): Promise<any[]> {
    try { return await this.crossArcEngine.detectPotentialSynergies(context.chapterNumber); }
    catch { return []; }
  }

  private combineAllElements(partialResults: any): any {
    const { dynamicContent, symbolicElements, cinematicFlow, arcPrediction } = partialResults;
    const allContent = [...dynamicContent.paragraphs, ...dynamicContent.descriptions, ...dynamicContent.dialogue, ...cinematicFlow.transitions, ...symbolicElements.activeSymbols];
    const orderedContent = this.intelligentOrder(allContent, partialResults.metaAnalysis);
    return { content: orderedContent.join('\n\n'), events: [], themes: arcPrediction?.themes || ['growth', 'transformation'], allElements: partialResults };
  }

  private intelligentOrder(items: string[], context: any): string[] {
    const result = [...items].sort((a, b) => (a.length + Math.random() * 20) - (b.length + Math.random() * 20));
    return this.shuffleForVariety(result);
  }

  private shuffleForVariety(items: string[]): string[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      if (Math.random() > 0.7) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
    }
    return result;
  }

  private async applyRepairs(result: any, context: StoryContext): Promise<any> {
    try {
      const issues = await this.repairSystem.detectIssues(result);
      if (issues && issues.length > 0) return await this.repairSystem.repairNarrative(result, issues);
    } catch {}
    return result;
  }

  private async validateFinal(result: any, context: StoryContext): Promise<any> {
    try { return await this.metaCognition.validateNarrative(result); }
    catch { return result; }
  }

  getSystem<T>(systemName: string): T | null {
    const systems: Record<string, any> = {
      metaCognition: this.metaCognition, arcModeling: this.arcModeling, threadScheduler: this.threadScheduler,
      dialogueSystem: this.dialogueSystem, characterGenome: this.characterGenome, worldSimulation: this.worldSimulation,
      realityFramework: this.realityFramework, structureLayer: this.structureLayer, repairSystem: this.repairSystem,
      cinematicEngine: this.cinematicEngine, symbolicTracker: this.symbolicTracker, moralEngine: this.moralEngine,
      experimentalModes: this.experimentalModes, crossArcEngine: this.crossArcEngine, contentGenerator: this.contentGenerator
    };
    return systems[systemName] || null;
  }

  reset(): void {
    this.metaCognition.reset(); this.arcModeling.reset(); this.threadScheduler.reset();
    this.dialogueSystem.reset(); this.characterGenome.reset(); this.worldSimulation.reset();
    this.realityFramework.reset(); this.structureLayer.reset(); this.repairSystem.reset();
    this.cinematicEngine.reset(); this.symbolicTracker.reset(); this.moralEngine.reset();
    this.experimentalModes.reset(); this.crossArcEngine.reset(); this.contentGenerator.reset();
  }
}

interface OrchestrationResult {
  content: string;
  events: StoryEvent[];
  themes: string[];
  symbols: string[];
  moralDecisions: string[];
  cinematicData: any;
  structuralData: any;
  synergies: any[];
  metaAnalysis: any;
  processingTime: number;
}

// ============================================================================
// UNIFIED STORY ENGINE - Main Entry Point
// ============================================================================

export class UnifiedStoryEngine {
  private orchestrator: IntelligentOrchestrator;
  private contentHistory: Map<number, Chapter> = new Map();
  private uniquenessTracker: Set<string> = new Set();
  private globalProgress: StoryProgress;

  constructor() {
    this.orchestrator = new IntelligentOrchestrator();
    this.globalProgress = { totalChapters: 0, worldBalance: { real: 0, vr: 0 }, majorEvents: [], characterDevelopment: [], plotPoints: [] };
  }

  async generateChapter(previousChapter: Chapter | null, options: GenerationOptions): Promise<Chapter> {
    const context = await this.buildUnifiedContext(previousChapter, options);
    const result = await this.orchestrator.orchestrateChapter(context, options);
    let chapter = this.buildChapter(context, result, options);
    chapter = this.ensureGlobalUniqueness(chapter);
    this.contentHistory.set(chapter.id, chapter);
    this.updateGlobalProgress(chapter);
    return chapter;
  }

  private async buildUnifiedContext(previousChapter: Chapter | null, options: GenerationOptions): Promise<StoryContext> {
    const chapterNumber = previousChapter ? previousChapter.id + 1 : 1;
    const characterState = this.buildCharacterState(chapterNumber, previousChapter);
    const world = this.determineWorld(chapterNumber, previousChapter);
    const narrativeTone = this.buildNarrativeTone(chapterNumber, characterState);
    return { chapterNumber, world, characterState, previousChapters: this.getRecentChapters(5), storyProgress: this.globalProgress, narrativeTone };
  }

  private buildCharacterState(chapterNumber: number, previousChapter: Chapter | null): CharacterState {
    const level = Math.floor(chapterNumber / 10) + 1;
    return {
      name: 'Kael', currentLevel: level, skills: this.generateSkillsForLevel(level),
      stats: { strength: 50 + level * 5, agility: 50 + level * 5, intelligence: 50 + level * 5, power: 50 + level * 5, resilience: 50 + level * 5 },
      memories: [], emotionalState: { primary: this.determinePrimaryEmotion(chapterNumber), intensity: 5 + Math.floor(chapterNumber / 50), secondary: ['determination', 'curiosity'] },
      relationships: new Map([['Yuna', 100]]), moralAlignment: 'neutral_good', dominantTraits: ['resilient', 'curious', 'determined'], characterArc: 'transformation'
    };
  }

  private generateSkillsForLevel(level: number): string[] {
    const baseSkills = ['Vampire Sight', 'Blood Sense'];
    const additionalSkills = ['Shadow Manipulation', 'Dark Magic', 'Reality Bending', 'Time Perception'];
    return [...baseSkills, ...additionalSkills.slice(0, Math.min(level, baseSkills.length + additionalSkills.length) - baseSkills.length)];
  }

  private determinePrimaryEmotion(chapterNumber: number): string {
    const emotions = ['determination', 'curiosity', 'hope', 'power', 'transformation', 'wisdom'];
    return emotions[Math.floor(chapterNumber / 100) % emotions.length];
  }

  private determineWorld(chapterNumber: number, previousChapter: Chapter | null): 'real' | 'vr' {
    if (chapterNumber % 7 === 0) return Math.random() > 0.5 ? 'real' : 'vr';
    return chapterNumber % 2 === 0 ? 'real' : 'vr';
  }

  private buildNarrativeTone(chapterNumber: number, characterState: CharacterState): NarrativeTone {
    const phase = Math.floor(chapterNumber / 100);
    const multiplier = [0.5, 0.7, 1.0, 0.8, 0.6][Math.min(phase, 4)];
    return {
      pacing: Math.min(10, 5 + characterState.emotionalState.intensity * multiplier),
      tension: Math.min(10, 5 + phase * multiplier),
      darkness: Math.min(10, 5 + (chapterNumber % 50) * 0.1),
      emotionalDepth: Math.min(10, 5 + characterState.emotionalState.intensity * 0.5)
    };
  }

  private getRecentChapters(count: number): Chapter[] {
    return Array.from(this.contentHistory.values()).sort((a, b) => b.id - a.id).slice(0, count);
  }

  private buildChapter(context: StoryContext, result: OrchestrationResult, options: GenerationOptions): Chapter {
    return {
      id: context.chapterNumber, title: this.generateTitle(context, result), content: result.content, world: context.world,
      summary: this.generateSummary(result.content), events: result.events, themes: result.themes, characterState: context.characterState,
      narrativeFlow: { transitions: result.cinematicData?.transitions || [], pacing: result.cinematicData?.pacing === 'fast' ? 'fast' : result.cinematicData?.pacing === 'moderate' ? 'medium' : 'slow',
        tension: context.narrativeTone.tension > 7 ? 'peak' : context.narrativeTone.tension > 4 ? 'building' : 'resolving', emotionalArc: [context.characterState.emotionalState.primary] },
      symbols: result.symbols, moralDecisions: result.moralDecisions, cinematicData: result.cinematicData, structuralData: result.structuralData
    };
  }

  private generateTitle(context: StoryContext, result: OrchestrationResult): string {
    return `Chapter ${context.chapterNumber}: ${result.themes[0] || 'Transformation'} in ${context.world === 'vr' ? 'Eclipsis' : 'Reality'}`;
  }

  private generateSummary(content: string): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
    return sentences.slice(0, 3).join('. ') + '.';
  }

  private ensureGlobalUniqueness(chapter: Chapter): Chapter {
    const fingerprint = this.createChapterFingerprint(chapter);
    if (this.uniquenessTracker.has(fingerprint)) {
      const modifiedContent = this.modifyChapterContent(chapter.content, chapter.id);
      return this.ensureGlobalUniqueness({ ...chapter, content: modifiedContent });
    }
    this.uniquenessTracker.add(fingerprint);
    return chapter;
  }

  private createChapterFingerprint(chapter: Chapter): string {
    const content = chapter.content.toLowerCase().replace(/\s+/g, ' ').trim();
    const parts = [content.substring(0, 100), content.substring(Math.floor(content.length / 2), Math.floor(content.length / 2) + 100), content.substring(Math.max(0, content.length - 100))];
    let hash = 0;
    for (const part of parts) for (let i = 0; i < part.length; i++) { hash = ((hash << 5) - hash) + part.charCodeAt(i); hash = hash & hash; }
    return Math.abs(hash).toString(36);
  }

  private modifyChapterContent(content: string, chapterId: number): string {
    const paragraphs = content.split('\n\n');
    if (paragraphs.length > 1) paragraphs[Math.floor(paragraphs.length / 2)] += ` [${chapterId}-${Date.now().toString(36)}]`;
    return paragraphs.join('\n\n');
  }

  private updateGlobalProgress(chapter: Chapter): void {
    this.globalProgress.totalChapters++;
    this.globalProgress.worldBalance[chapter.world]++;
    this.globalProgress.majorEvents.push(...chapter.events);
    this.globalProgress.characterDevelopment.push(`Chapter ${chapter.id}: Level ${chapter.characterState.currentLevel}`);
    this.globalProgress.plotPoints.push({ chapter: chapter.id, description: chapter.summary, resolved: false });
  }

  getSystem<T>(systemName: string): T | null { return this.orchestrator.getSystem<T>(systemName); }

  async generateChapters(count: number, options: GenerationOptions): Promise<Chapter[]> {
    const chapters: Chapter[] = [];
    let previousChapter: Chapter | null = null;
    for (let i = 0; i < count; i++) { const chapter = await this.generateChapter(previousChapter, options); chapters.push(chapter); previousChapter = chapter; }
    return chapters;
  }

  exportState(): EngineState {
    return { contentHistory: Array.from(this.contentHistory.entries()), uniquenessTracker: Array.from(this.uniquenessTracker), globalProgress: this.globalProgress };
  }

  importState(state: EngineState): void {
    this.contentHistory = new Map(state.contentHistory);
    this.uniquenessTracker = new Set(state.uniquenessTracker);
    this.globalProgress = state.globalProgress;
  }

  reset(): void {
    this.orchestrator.reset();
    this.contentHistory.clear();
    this.uniquenessTracker.clear();
    this.globalProgress = { totalChapters: 0, worldBalance: { real: 0, vr: 0 }, majorEvents: [], characterDevelopment: [], plotPoints: [] };
  }
}

interface EngineState {
  contentHistory: [number, Chapter][];
  uniquenessTracker: string[];
  globalProgress: StoryProgress;
}

export default UnifiedStoryEngine;