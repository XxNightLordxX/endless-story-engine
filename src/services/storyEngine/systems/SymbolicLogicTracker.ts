/**
 * SymbolicLogicTracker
 * 
 * Tracks symbolic elements, motifs, recurring themes, and their narrative
 * significance across the story. Ensures symbolic consistency and payoff.
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface SymbolicElement {
  id: string;
  name: string;
  type: SymbolicType;
  introducedIn: { chapter: number; scene?: string };
  symbolicOf: string[]; // What this element represents
  emotionalResonance: number; // 0-1
  visualRepresentation: string;
  associatedWith: SymbolAssociation[];
  evolution: SymbolicEvolution[];
  currentMeaning: string;
  dominantContexts: ContextType[];
  payoffExpected?: boolean;
}

export type SymbolicType = 
  | 'object'         // Physical items
  | 'color'          // Colors and hues
  | 'sound'          // Recurring sounds/music
  | 'gesture'        // Character gestures
  | 'phrase'         // Spoken or written phrases
  | 'location'       // Places with symbolic meaning
  | 'weather'        // Weather patterns
  | 'animal'         // Animals as symbols
  | 'number'         // Numerical symbolism
  | 'element'        // Natural elements (fire, water, etc.)
  | 'dream'          // Dream symbols
  | 'mythology'      // Mythological references
  | 'ritual'         // Ceremonial acts
  | 'art'            // Artistic works
  | 'clothing'       // Attire as symbol
  | 'weapon'         // Weapons with meaning
  | 'plant'          // Plants and flora
  | 'architecture'   // Structural symbolism
  | 'technology'     // Tech as symbol
  | 'celestial';     // Stars, moons, etc.

export interface SymbolAssociation {
  type: 'character' | 'emotion' | 'theme' | 'event' | 'location' | 'idea';
  target: string;
  strength: number; // 0-1
  introducedAt: number; // chapter number
}

export interface SymbolicEvolution {
  chapter: number;
  previousMeaning: string;
  newMeaning: string;
  catalyst: string; // What caused the change
  shiftDirection: 'expansion' | 'contraction' | 'inversion' | 'reinforcement';
}

export type ContextType = 
  | 'hope'
  | 'danger'
  | 'love'
  | 'betrayal'
  | 'sacrifice'
  | 'redemption'
  | 'power'
  | 'corruption'
  | 'freedom'
  | 'bondage'
  | 'life'
  | 'death'
  | 'rebirth'
  | 'wisdom'
  | 'ignorance'
  | 'truth'
  | 'deception';

// ============================================================================
// MOTIF STRUCTURE
// ============================================================================

export interface Motif {
  id: string;
  name: string;
  symbols: string[]; // IDs of related symbols
  pattern: MotifPattern;
  frequency: MotifFrequency;
  narrativeFunction: NarrativeFunction;
  arcProgression: MotifArcPoint[];
  payoffExpected: boolean;
  payoffChapters?: number[];
}

export type MotifPattern = 
  | 'linear'        // Straight progression
  | 'circular'      // Returns to start
  | 'spiral'        // Escalating returns
  | 'recurrent'     // Repeated appearances
  | 'contrapuntal'  // Parallel opposing
  | 'interrupted';  // Gaps in appearance

export type MotifFrequency = 
  | 'frequent'      // Every 1-3 chapters
  | 'regular'       // Every 4-6 chapters
  | 'occasional'    // Every 7-10 chapters
  | 'rare'          // Every 11+ chapters
  | 'climactic';    // Only at key moments

export type NarrativeFunction = 
  | 'foreshadowing'
  | 'echo'
  | 'contrast'
  | 'irony'
  | 'parallel'
  | 'thematic_anchor'
  | 'emotional_signpost'
  | 'moral_question'
  | 'structural_marker'
  | 'mystery_seed';

export interface MotifArcPoint {
  chapter: number;
  presentation: string; // How motif appears
  significance: number; // 0-1
  meaning: string;
}

// ============================================================================
// THEME TRACKING
// ============================================================================

export interface ThematicElement {
  id: string;
  name: string;
  category: ThemeCategory;
  expressionCount: number;
  contexts: ThematicContext[];
  opposingThemes: string[]; // IDs of opposing themes
  supportingThemes: string[]; // IDs of supporting themes
  evolution: ThemeEvolution[];
  dominance: number; // 0-1 across story
}

export type ThemeCategory = 
  | 'moral'
  | 'philosophical'
  | 'social'
  | 'political'
  | 'psychological'
  | 'existential'
  | 'spiritual'
  | 'metaphysical'
  | 'aesthetic'
  | 'pragmatic';

export interface ThematicContext {
  chapter: number;
  context: string;
  intensity: number; // 0-1
  characters: string[];
  outcome: string;
}

export interface ThemeEvolution {
  chapter: number;
  complexity: number; // 0-1
  nuance: number; // 0-1
  contradiction: boolean;
  synthesis: string[];
}

// ============================================================================
// SYMBOLIC PATTERN TRACKING
// ============================================================================

export interface SymbolicPattern {
  id: string;
  name: string;
  type: PatternType;
  instances: PatternInstance[];
  significance: number; // 0-1
  completeness: number; // 0-1
  resolution?: PatternResolution;
}

export type PatternType = 
  | 'number_sequence'   // 3, 7, 12, etc.
  | 'color_progression' // Color shifts
  | 'elemental_cycle'   // Fire→Water→Earth→Air
  | 'directional'       // North→East→South→West
  | 'temporal'          // Morning→Noon→Evening→Night
  | 'seasonal'          // Season cycle
  | 'life_cycle'        // Birth→Death→Rebirth
  | 'sacred_geometry'   // Triangles, circles, spirals
  | 'alchemical'        // Transformation stages
  | 'mythic';           // Archetypal patterns

export interface PatternInstance {
  chapter: number;
  context: string;
  stage: number;
  totalStages: number;
  meaning: string;
}

export interface PatternResolution {
  chapter: number;
  type: 'completion' | 'subversion' | 'transformation';
  outcome: string;
  significance: number;
}

// ============================================================================
// SYMBOLIC RELATIONSHIP MAP
// ============================================================================

export interface SymbolicRelationship {
  sourceSymbolId: string;
  targetSymbolId: string;
  relationshipType: RelationshipType;
  strength: number; // 0-1
  context: string;
  establishedChapter: number;
}

export type RelationshipType = 
  | 'reinforces'      // Strengthens meaning
  | 'contradicts'     // Opposes meaning
  | 'transforms'      // Changes meaning
  | 'encompasses'     // Contains
  | 'mirrors'         // Reflects
  | 'anticipates'     // Precedes
  | 'recalls'         // References back
  | 'paradoxically';  // Complex relationship

// ============================================================================
// PAYOFF TRACKING
// ============================================================================

export interface SymbolicPayoff {
  symbolId: string;
  setupChapters: number[];
  payoffChapter: number;
  payoffType: PayoffType;
  effectiveness: number; // 0-1
  resonance: number; // 0-1
  satisfaction: 'weak' | 'moderate' | 'strong' | 'epic';
}

export type PayoffType = 
  | 'direct'          // Explicit payoff
  | 'implicit'        // Suggested payoff
  | 'subverted'       // Unexpected twist
  | 'deferred'        // Delayed payoff
  | 'circular'        // Returns to start
  | 'transcendent';  // Elevates beyond original

// ============================================================================
// MAIN TRACKER CLASS
// ============================================================================

export class SymbolicLogicTracker {
  private symbols: Map<string, SymbolicElement> = new Map();
  private motifs: Map<string, Motif> = new Map();
  private themes: Map<string, ThematicElement> = new Map();
  private patterns: Map<string, SymbolicPattern> = new Map();
  private relationships: Map<string, SymbolicRelationship> = new Map();
  private payoffs: Map<string, SymbolicPayoff> = new Map();
  
  private symbolHistory: Map<string, number[]> = new Map();
  private motifFrequency: Map<string, number[]> = new Map();
  
  // Cross-system reference
  private arcEngine?: any;

  constructor() {
    this.initializeArchetypalSymbols();
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  private initializeArchetypalSymbols(): void {
    // Common archetypal symbols
    const archetypes: Array<{name: string, type: SymbolicType, meanings: string[]}> = [
      { name: 'sword', type: 'weapon', meanings: ['power', 'justice', 'violence', 'honor'] },
      { name: 'mirror', type: 'object', meanings: ['truth', 'self-reflection', 'illusion', 'duality'] },
      { name: 'rose', type: 'plant', meanings: ['love', 'beauty', 'sacrifice', 'time'] },
      { name: 'storm', type: 'weather', meanings: ['chaos', 'power', 'transformation', 'inner turmoil'] },
      { name: 'crossroads', type: 'location', meanings: ['choice', 'decision', 'destiny', 'transformation'] },
      { name: 'fire', type: 'element', meanings: ['passion', 'destruction', 'purification', 'enlightenment'] },
      { name: 'water', type: 'element', meanings: ['life', 'purity', 'change', 'depth'] },
      { name: 'bird', type: 'animal', meanings: ['freedom', 'spirit', 'messenger', 'perspective'] },
      { name: 'key', type: 'object', meanings: ['knowledge', 'opportunity', 'mystery', 'authority'] },
      { name: 'door', type: 'architecture', meanings: ['passage', 'opportunity', 'mystery', 'transition'] },
      { name: 'red', type: 'color', meanings: ['passion', 'danger', 'blood', 'power'] },
      { name: 'blue', type: 'color', meanings: ['calm', 'truth', 'coldness', 'depth'] },
      { name: 'gold', type: 'color', meanings: ['wealth', 'purity', 'greed', 'value'] },
      { name: 'silver', type: 'color', meanings: ['purity', 'wisdom', 'coldness', 'reflection'] },
      { name: 'three', type: 'number', meanings: ['balance', 'completeness', 'change', 'cycle'] },
      { name: 'seven', type: 'number', meanings: ['perfection', 'mystery', 'cycle', 'spirituality'] }
    ];

    archetypes.forEach(archetype => {
      const symbol: SymbolicElement = {
        id: `symbol-${archetype.name}`,
        name: archetype.name,
        type: archetype.type,
        introducedIn: { chapter: 0 },
        symbolicOf: archetype.meanings,
        emotionalResonance: 0.5,
        visualRepresentation: '',
        associatedWith: [],
        evolution: [],
        currentMeaning: archetype.meanings[0],
        dominantContexts: []
      };
      this.symbols.set(symbol.id, symbol);
    });
  }

  // ==========================================================================
  // SYMBOL MANAGEMENT
  // ==========================================================================

  introduceSymbol(
    name: string,
    type: SymbolicType,
    chapter: number,
    meanings: string[],
    visualRep?: string,
    scene?: string
  ): SymbolicElement {
    const id = `symbol-${name.toLowerCase().replace(/\s+/g, '-')}`;
    
    const symbol: SymbolicElement = {
      id,
      name,
      type,
      introducedIn: { chapter, scene },
      symbolicOf: meanings,
      emotionalResonance: 0.5,
      visualRepresentation: visualRep || '',
      associatedWith: [],
      evolution: [],
      currentMeaning: meanings[0],
      dominantContexts: []
    };

    this.symbols.set(id, symbol);
    this.symbolHistory.set(id, [chapter]);

    return symbol;
  }

  trackSymbolAppearance(
    symbolId: string,
    chapter: number,
    context: string,
    associatedElements: SymbolAssociation[]
  ): void {
    const symbol = this.symbols.get(symbolId);
    if (!symbol) {
      console.warn(`Symbol ${symbolId} not found`);
      return;
    }

    // Update history
    const history = this.symbolHistory.get(symbolId) || [];
    history.push(chapter);
    this.symbolHistory.set(symbolId, history);

    // Update associations
    associatedElements.forEach(assoc => {
      const existing = symbol.associatedWith.find(a => 
        a.type === assoc.type && a.target === assoc.target
      );
      if (existing) {
        existing.strength = Math.min(1, existing.strength + 0.1);
      } else {
        symbol.associatedWith.push({ ...assoc, introducedAt: chapter });
      }
    });

    // Analyze context for meaning evolution
    this.analyzeMeaningEvolution(symbol, chapter, context);
  }

  private analyzeMeaningEvolution(
    symbol: SymbolicElement,
    chapter: number,
    context: string
  ): void {
    // Check if context suggests new or evolved meaning
    const contextLower = context.toLowerCase();
    const keywords: Record<string, string> = {
      'hope': 'hope',
      'despair': 'despair',
      'love': 'love',
      'betrayal': 'betrayal',
      'death': 'death',
      'rebirth': 'rebirth',
      'power': 'power',
      'corruption': 'corruption'
    };

    let newContext: ContextType | null = null;
    for (const [keyword, type] of Object.entries(keywords)) {
      if (contextLower.includes(keyword)) {
        newContext = type as ContextType;
        break;
      }
    }

    if (newContext) {
      // Update dominant contexts
      if (!symbol.dominantContexts.includes(newContext)) {
        symbol.dominantContexts.push(newContext);
      }

      // Check for meaning shift
      const potentialMeaning = this.inferMeaningFromContext(symbol, context);
      if (potentialMeaning && potentialMeaning !== symbol.currentMeaning) {
        const evolution: SymbolicEvolution = {
          chapter,
          previousMeaning: symbol.currentMeaning,
          newMeaning: potentialMeaning,
          catalyst: context.substring(0, 100),
          shiftDirection: this.determineShiftDirection(symbol.currentMeaning, potentialMeaning)
        };
        symbol.evolution.push(evolution);
        symbol.currentMeaning = potentialMeaning;
      }
    }
  }

  private inferMeaningFromContext(symbol: SymbolicElement, context: string): string | null {
    const contextLower = context.toLowerCase();

    // Check against possible meanings
    for (const meaning of symbol.symbolicOf) {
      const meaningLower = meaning.toLowerCase();
      if (contextLower.includes(meaningLower)) {
        return meaning;
      }
    }

    // Infer from emotional words
    if (contextLower.includes('hope') || contextLower.includes('joy')) {
      const hopefulMeaning = symbol.symbolicOf.find(m => 
        ['freedom', 'life', 'love', 'hope'].includes(m.toLowerCase())
      );
      if (hopefulMeaning) return hopefulMeaning;
    }

    if (contextLower.includes('fear') || contextLower.includes('danger')) {
      const fearfulMeaning = symbol.symbolicOf.find(m => 
        ['death', 'danger', 'violence', 'destruction'].includes(m.toLowerCase())
      );
      if (fearfulMeaning) return fearfulMeaning;
    }

    return null;
  }

  private determineShiftDirection(
    previous: string,
    current: string
  ): SymbolicEvolution['shiftDirection'] {
    const opposites = [
      ['life', 'death'],
      ['love', 'hate'],
      ['hope', 'despair'],
      ['truth', 'deception'],
      ['freedom', 'bondage']
    ];

    for (const [a, b] of opposites) {
      if ((previous === a && current === b) || (previous === b && current === a)) {
        return 'inversion';
      }
    }

    if (previous.length < current.length) {
      return 'expansion';
    } else if (previous.length > current.length) {
      return 'contraction';
    } else {
      return 'reinforcement';
    }
  }

  evolveSymbol(
    symbolId: string,
    newMeaning: string,
    chapter: number,
    catalyst: string
  ): void {
    const symbol = this.symbols.get(symbolId);
    if (!symbol) {
      console.warn(`Symbol ${symbolId} not found`);
      return;
    }

    const evolution: SymbolicEvolution = {
      chapter,
      previousMeaning: symbol.currentMeaning,
      newMeaning,
      catalyst,
      shiftDirection: this.determineShiftDirection(symbol.currentMeaning, newMeaning)
    };

    symbol.evolution.push(evolution);
    symbol.currentMeaning = newMeaning;
  }

  // ==========================================================================
  // MOTIF MANAGEMENT
  // ==========================================================================

  createMotif(
    name: string,
    symbolIds: string[],
    pattern: MotifPattern,
    frequency: MotifFrequency,
    narrativeFunction: NarrativeFunction,
    payoffExpected: boolean,
    payoffChapters?: number[]
  ): Motif {
    const id = `motif-${name.toLowerCase().replace(/\s+/g, '-')}`;
    
    const motif: Motif = {
      id,
      name,
      symbols: symbolIds,
      pattern,
      frequency,
      narrativeFunction: narrativeFunction,
      arcProgression: [],
      payoffExpected,
      payoffChapters
    };

    this.motifs.set(id, motif);
    this.motifFrequency.set(id, []);

    return motif;
  }

  trackMotifAppearance(
    motifId: string,
    chapter: number,
    presentation: string,
    significance: number,
    meaning: string
  ): void {
    const motif = this.motifs.get(motifId);
    if (!motif) {
      console.warn(`Motif ${motifId} not found`);
      return;
    }

    motif.arcProgression.push({
      chapter,
      presentation,
      significance,
      meaning
    });

    const freq = this.motifFrequency.get(motifId) || [];
    freq.push(chapter);
    this.motifFrequency.set(motifId, freq);

    // Update symbol tracking
    motif.symbols.forEach(symbolId => {
      this.trackSymbolAppearance(symbolId, chapter, presentation, []);
    });
  }

  shouldMotifAppear(motifId: string, currentChapter: number): boolean {
    const motif = this.motifs.get(motifId);
    if (!motif) return false;

    const freq = this.motifFrequency.get(motifId) || [];
    const lastAppearance = freq.length > 0 ? freq[freq.length - 1] : 0;
    const chaptersSince = currentChapter - lastAppearance;

    let threshold: number;
    switch (motif.frequency) {
      case 'frequent':
        threshold = Math.floor(Math.random() * 3) + 1;
        break;
      case 'regular':
        threshold = Math.floor(Math.random() * 3) + 4;
        break;
      case 'occasional':
        threshold = Math.floor(Math.random() * 4) + 7;
        break;
      case 'rare':
        threshold = Math.floor(Math.random() * 5) + 11;
        break;
      case 'climactic':
        // Only appear near payoff chapters
        if (motif.payoffChapters) {
          const nearPayoff = motif.payoffChapters.some(pc => 
            Math.abs(pc - currentChapter) <= 2
          );
          return nearPayoff;
        }
        return false;
      default:
        threshold = 5;
    }

    return chaptersSince >= threshold;
  }

  // ==========================================================================
  // THEME MANAGEMENT
  // ==========================================================================

  introduceTheme(
    name: string,
    category: ThemeCategory,
    chapter: number
  ): ThematicElement {
    const id = `theme-${name.toLowerCase().replace(/\s+/g, '-')}`;
    
    const theme: ThematicElement = {
      id,
      name,
      category,
      expressionCount: 0,
      contexts: [],
      opposingThemes: [],
      supportingThemes: [],
      evolution: [],
      dominance: 0
    };

    this.themes.set(id, theme);
    return theme;
  }

  trackThemeExpression(
    themeId: string,
    chapter: number,
    context: string,
    intensity: number,
    characters: string[],
    outcome?: string
  ): void {
    const theme = this.themes.get(themeId);
    if (!theme) {
      console.warn(`Theme ${themeId} not found`);
      return;
    }

    theme.expressionCount++;
    theme.contexts.push({
      chapter,
      context,
      intensity,
      characters,
      outcome: outcome || ''
    });

    // Recalculate dominance
    this.updateThemeDominance(theme);
  }

  private updateThemeDominance(theme: ThematicElement): void {
    if (theme.contexts.length === 0) {
      theme.dominance = 0;
      return;
    }

    const avgIntensity = theme.contexts.reduce((sum, c) => sum + c.intensity, 0) / theme.contexts.length;
    const recentWeight = Math.min(1, theme.contexts.length / 10);
    theme.dominance = avgIntensity * recentWeight;
  }

  // ==========================================================================
  // PATTERN TRACKING
  // ==========================================================================

  createPattern(
    name: string,
    type: PatternType,
    totalStages: number
  ): SymbolicPattern {
    const id = `pattern-${name.toLowerCase().replace(/\s+/g, '-')}`;
    
    const pattern: SymbolicPattern = {
      id,
      name,
      type,
      instances: [],
      significance: 0.5,
      completeness: 0
    };

    this.patterns.set(id, pattern);
    return pattern;
  }

  trackPatternInstance(
    patternId: string,
    chapter: number,
    context: string,
    stage: number,
    totalStages: number,
    meaning: string
  ): void {
    const pattern = this.patterns.get(patternId);
    if (!pattern) {
      console.warn(`Pattern ${patternId} not found`);
      return;
    }

    pattern.instances.push({
      chapter,
      context,
      stage,
      totalStages,
      meaning
    });

    // Update completeness
    const stages = new Set(pattern.instances.map(i => i.stage));
    pattern.completeness = stages.size / totalStages;

    // Check for completion
    if (pattern.completeness >= 1 && !pattern.resolution) {
      this.resolvePattern(patternId, chapter);
    }
  }

  private resolvePattern(patternId: string, chapter: number): void {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return;

    pattern.resolution = {
      chapter,
      type: 'completion',
      outcome: 'Pattern fully realized across narrative',
      significance: pattern.instances.reduce((sum, i) => sum + i.stage, 0) / pattern.instances.length
    };
  }

  // ==========================================================================
  // RELATIONSHIP MANAGEMENT
  // ==========================================================================

  establishRelationship(
    sourceId: string,
    targetId: string,
    type: RelationshipType,
    strength: number,
    context: string,
    chapter: number
  ): void {
    const id = `rel-${sourceId}-${targetId}`;
    
    const relationship: SymbolicRelationship = {
      sourceSymbolId: sourceId,
      targetSymbolId: targetId,
      relationshipType: type,
      strength,
      context,
      establishedChapter: chapter
    };

    this.relationships.set(id, relationship);
  }

  // ==========================================================================
  // PAYOFF TRACKING
  // ==========================================================================

  registerPayoff(
    symbolId: string,
    setupChapters: number[],
    payoffChapter: number,
    type: PayoffType,
    effectiveness: number,
    resonance: number
  ): SymbolicPayoff {
    const payoff: SymbolicPayoff = {
      symbolId,
      setupChapters,
      payoffChapter,
      payoffType: type,
      effectiveness,
      resonance,
      satisfaction: this.calculateSatisfaction(effectiveness, resonance)
    };

    const id = `payoff-${symbolId}-${payoffChapter}`;
    this.payoffs.set(id, payoff);

    // Update motif payoff status if applicable
    this.motifs.forEach(motif => {
      if (motif.symbols.includes(symbolId)) {
        motif.payoffExpected = false;
      }
    });

    return payoff;
  }

  private calculateSatisfaction(effectiveness: number, resonance: number): SymbolicPayoff['satisfaction'] {
    const score = (effectiveness + resonance) / 2;
    if (score >= 0.9) return 'epic';
    if (score >= 0.7) return 'strong';
    if (score >= 0.5) return 'moderate';
    return 'weak';
  }

  checkForPendingPayoffs(chapter: number): SymbolicPayoff[] {
    const pending: SymbolicPayoff[] = [];

    this.motifs.forEach(motif => {
      if (motif.payoffExpected && motif.payoffChapters) {
        if (motif.payoffChapters.includes(chapter)) {
          motif.symbols.forEach(symbolId => {
            const history = this.symbolHistory.get(symbolId) || [];
            if (history.length >= 2) {
              pending.push({
                symbolId,
                setupChapters: history,
                payoffChapter: chapter,
                payoffType: 'implicit',
                effectiveness: 0.6,
                resonance: 0.5,
                satisfaction: 'moderate'
              });
            }
          });
        }
      }
    });

    return pending;
  }

  // ==========================================================================
  // ANALYSIS
  // ==========================================================================

  analyzeSymbol(symbolId: string): SymbolicAnalysis {
    const symbol = this.symbols.get(symbolId);
    if (!symbol) {
      return {
        appearances: 0,
        frequency: 0,
        dominantContexts: [],
        evolutionaryPath: [],
        recommendations: []
      };
    }

    const history = this.symbolHistory.get(symbolId) || [];
    const totalChapters = Math.max(1, history[history.length - 1] || 1);
    const frequency = history.length / totalChapters;

    const recommendations: string[] = [];
    if (frequency < 0.05 && history.length >= 1) {
      recommendations.push('Symbol appears rarely - consider more consistent usage');
    }
    if (frequency > 0.3) {
      recommendations.push('Symbol appears frequently - may risk overuse');
    }
    if (symbol.evolution.length === 0 && history.length > 5) {
      recommendations.push('Symbol has remained static - consider evolution');
    }
    if (symbol.payoffExpected) {
      recommendations.push('Symbol pending payoff - consider resolution');
    }

    return {
      appearances: history.length,
      frequency,
      dominantContexts: symbol.dominantContexts,
      evolutionaryPath: symbol.evolution,
      recommendations
    };
  }

  analyzeMotif(motifId: string): MotifAnalysis {
    const motif = this.motifs.get(motifId);
    if (!motif) {
      return {
        progression: [],
        consistency: 0,
        payoffStatus: 'unknown',
        recommendations: []
      };
    }

    const freq = this.motifFrequency.get(motifId) || [];
    let consistency = 1;
    if (freq.length > 1) {
      const intervals = [];
      for (let i = 1; i < freq.length; i++) {
        intervals.push(freq[i] - freq[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) / intervals.length;
      consistency = 1 - (Math.sqrt(variance) / avgInterval);
    }

    const recommendations: string[] = [];
    if (motif.payoffExpected && !motif.payoffChapters) {
      recommendations.push('Motif expects payoff but no chapters specified');
    }
    if (consistency < 0.5) {
      recommendations.push('Motif appearance is inconsistent');
    }

    return {
      progression: motif.arcProgression,
      consistency,
      payoffStatus: motif.payoffExpected ? 'pending' : 'complete',
      recommendations
    };
  }

  analyzeTheme(themeId: string): ThemeAnalysis {
    const theme = this.themes.get(themeId);
    if (!theme) {
      return {
        expressionCount: 0,
        avgIntensity: 0,
        dominantContexts: [],
        evolution: [],
        recommendations: []
      };
    }

    const avgIntensity = theme.contexts.length > 0
      ? theme.contexts.reduce((sum, c) => sum + c.intensity, 0) / theme.contexts.length
      : 0;

    const recommendations: string[] = [];
    if (theme.expressionCount < 3) {
      recommendations.push('Theme is underdeveloped - needs more expressions');
    }
    if (avgIntensity < 0.3) {
      recommendations.push('Theme lacks impact - increase intensity');
    }

    return {
      expressionCount: theme.expressionCount,
      avgIntensity,
      dominantContexts: theme.contexts.slice(-5),
      evolution: theme.evolution,
      recommendations
    };
  }

  // ==========================================================================
  // EXPORT / IMPORT
  // ==========================================================================

  exportState(): SymbolicTrackerState {
    return {
      symbols: Array.from(this.symbols.entries()),
      motifs: Array.from(this.motifs.entries()),
      themes: Array.from(this.themes.entries()),
      patterns: Array.from(this.patterns.entries()),
      relationships: Array.from(this.relationships.entries()),
      payoffs: Array.from(this.payoffs.entries()),
      symbolHistory: Array.from(this.symbolHistory.entries()),
      motifFrequency: Array.from(this.motifFrequency.entries())
    };
  }

  importState(state: SymbolicTrackerState): void {
    this.symbols = new Map(state.symbols);
    this.motifs = new Map(state.motifs);
    this.themes = new Map(state.themes);
    this.patterns = new Map(state.patterns);
    this.relationships = new Map(state.relationships);
    this.payoffs = new Map(state.payoffs);
    this.symbolHistory = new Map(state.symbolHistory);
    this.motifFrequency = new Map(state.motifFrequency);
  }

  reset(): void {
    this.symbols.clear();
    this.motifs.clear();
    this.themes.clear();
    this.patterns.clear();
    this.relationships.clear();
    this.payoffs.clear();
    this.symbolHistory.clear();
    this.motifFrequency.clear();
    this.initializeArchetypalSymbols();
  }

  /**
   * Set arc engine reference for symbolic logic tracker
   */
  setArcEngine(arcEngine: any): void {
    this.arcEngine = arcEngine;
  }

  /**
   * Get system status including cross-system connectivity
   */
  getSystemStatus(): {
    symbolsCount: number;
    motifsCount: number;
    themesCount: number;
    connectedSystems: string[];
  } {
    const connectedSystems: string[] = [];
    if (this.arcEngine) connectedSystems.push('arcEngine');

    return {
      symbolsCount: this.symbols.size,
      motifsCount: this.motifs.size,
      themesCount: this.themes.size,
      connectedSystems
    };
  }
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface SymbolicAnalysis {
  appearances: number;
  frequency: number;
  dominantContexts: ContextType[];
  evolutionaryPath: SymbolicEvolution[];
  recommendations: string[];
}

export interface MotifAnalysis {
  progression: MotifArcPoint[];
  consistency: number;
  payoffStatus: 'pending' | 'complete' | 'unknown';
  recommendations: string[];
}

export interface ThemeAnalysis {
  expressionCount: number;
  avgIntensity: number;
  dominantContexts: ThematicContext[];
  evolution: ThemeEvolution[];
  recommendations: string[];
}

export interface SymbolicTrackerState {
  symbols: [string, SymbolicElement][];
  motifs: [string, Motif][];
  themes: [string, ThematicElement][];
  patterns: [string, SymbolicPattern][];
  relationships: [string, SymbolicRelationship][];
  payoffs: [string, SymbolicPayoff][];
  symbolHistory: [string, number[]][];
  motifFrequency: [string, number[]][];
}

export default SymbolicLogicTracker;