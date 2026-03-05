import { v4 as uuidv4 } from 'uuid';
import { webSearchIntegration } from './WebSearchIntegration';
import type { WebSearchResult, NarrativeSearchResult, TechnicalSearchResult } from './WebSearchIntegration';

/**
 * Cross-Arc Synergy Engine
 * 
 * This system manages connections, relationships, and synergies between different
 * narrative arcs. It ensures that story threads interact meaningfully and create
 * a cohesive multi-arc narrative experience.
 * 
 * Enhanced with real-time web search for arc connection patterns,
 * narrative synergy techniques, and inter-arc relationship examples.
 * 
 * Core Responsibilities:
 * - Track multiple narrative arcs simultaneously
 * - Identify and create arc connections
 * - Manage arc interdependencies and conflicts
 * - Ensure thematic coherence across arcs
 * - Coordinate arc timing and pacing
 * - Create arc convergence and divergence points
 * - Analyze arc balance and synergy
 */

// ===== TYPES & INTERFACES =====

export interface NarrativeArc {
  id: string;
  name: string;
  type: ArcType;
  primaryCharacters: string[];
  primaryThemes: string[];
  status: ArcStatus;
  priority: number; // 1-10
  arcNumber: number;
  chapters: ChapterInArc[];
  connections: ArcConnection[];
  dependencies: ArcDependency[];
  conflicts: ArcConflict[];
  metadata: ArcMetadata;
}

export type ArcType = 
  | 'main' | 'subplot' | 'character-arc' | 'thematic-arc' 
  | 'mystery' | 'romance' | 'political' | 'action'
  | 'coming-of-age' | 'revenge' | 'redemption' | 'journey';

export type ArcStatus = 
  | 'not-started' | 'in-progress' | 'paused' | 'completed'
  | 'abandoned' | 'on-hold' | 'converging' | 'diverging';

export interface ChapterInArc {
  chapterNumber: number;
  importance: number; // 0-1, how important this chapter is to the arc
  events: ArcEvent[];
  advancement: number; // 0-1, how much the arc advances
  emotionalNote: string;
}

export interface ArcEvent {
  id: string;
  chapter: number;
  description: string;
  impact: number; // 0-1
  significance: string;
  characterInvolvement: Map<string, number>; // Character -> involvement level
}

export interface ArcConnection {
  id: string;
  fromArc: string;
  toArc: string;
  type: ConnectionType;
  strength: number; // 0-1
  nature: string;
  chapter: number;
  description: string;
  bidirectional: boolean;
  active: boolean;
  evolution: ConnectionEvolution[];
}

export type ConnectionType = 
  | 'character-share' | 'thematic' | 'causal' | 'temporal' 
  | 'symbolic' | 'contrast' | 'reinforcement' | 'conflict'
  | 'convergence' | 'divergence' | 'echo' | 'resolution';

export interface ConnectionEvolution {
  chapter: number;
  oldStrength: number;
  newStrength: number;
  reason: string;
}

export interface ArcDependency {
  id: string;
  dependentArc: string;
  requiredArc: string;
  type: DependencyType;
  condition: string;
  critical: boolean;
  satisfied: boolean;
}

export type DependencyType = 
  | 'completion' | 'specific-event' | 'character-state' 
  | 'information' | 'resolution' | 'timing';

export interface ArcConflict {
  id: string;
  arc1: string;
  arc2: string;
  type: ConflictType;
  description: string;
  severity: number; // 1-10
  status: 'unresolved' | 'resolving' | 'resolved' | 'managed';
  resolutionStrategy: string;
}

export type ConflictType = 
  | 'character' | 'theme' | 'plot' | 'timing' | 'pacing' 
  | 'logic' | 'thematic' | 'tonal' | 'structural';

export interface ArcMetadata {
  description: string;
  goals: string[];
  resolutionCondition: string;
  timelineEstimate: number; // chapters
  flexibility: number; // 0-1, how flexible the arc is
  complexity: number; // 0-1
}

export interface SynergyAnalysis {
  arcId: string;
  overallSynergy: number; // 0-1
  connections: number;
  conflicts: number;
  dependencyHealth: number; // 0-1
  thematicCoherence: number; // 0-1
  balanceScore: number; // 0-1
  recommendations: string[];
}

export interface ConvergencePoint {
  id: string;
  chapter: number;
  arcs: string[];
  type: ConvergenceType;
  description: string;
  planned: boolean;
  outcomes: ConvergenceOutcome[];
}

export type ConvergenceType = 
  | 'full-merge' | 'temporary-intersection' | 'information-sharing'
  | 'climax-collision' | 'thematic-resonance' | 'character-reunion';

export interface ConvergenceOutcome {
  arc: string;
  outcome: string;
  impact: string;
  futureState: string;
}

export interface DivergencePoint {
  id: string;
  chapter: number;
  arcs: string[];
  type: DivergenceType;
  description: string;
  triggerEvent: string;
}

export type DivergenceType = 
  | 'path-split' | 'new-thread' | 'perspective-shift'
  | 'revelation-branch' | 'mystery-unfolding';

export interface ArcBalancing {
  chapter: number;
  arcDistribution: Map<string, number>; // Arc -> prominence 0-1
  recommendedDistribution: Map<string, number>;
  imbalances: ArcImbalance[];
  suggestions: BalancingSuggestion[];
}

export interface ArcImbalance {
  arc: string;
  type: 'over-coverage' | 'under-coverage' | 'mis-timing' | 'priority-mismatch';
  severity: number; // 1-10
  description: string;
  current: number;
  target: number;
}

export interface BalancingSuggestion {
  type: 'increase' | 'decrease' | 'pause' | 'accelerate';
  arc: string;
  description: string;
  method: string;
  expectedEffect: string;
}

export interface CrossArcThematicMap {
  themes: Map<string, CrossArcTheme>;
  connections: ThematicConnection[];
  conflicts: ThematicConflict[];
}

export interface CrossArcTheme {
  name: string;
  arcs: string[];
  variations: Map<string, string>; // Arc -> theme variation
  depth: Map<string, number>; // Arc -> exploration depth
  unifiedInterpretation: string;
  evolution: ThematicEvolution[];
}

export interface ThematicConnection {
  theme: string;
  arc1: string;
  arc2: string;
  nature: string;
  strength: number; // 0-1
}

export interface ThematicConflict {
  theme: string;
  arc1: string;
  arc2: string;
  nature: string;
  severity: number; // 1-10
  resolution?: string;
}

export interface ThematicEvolution {
  chapter: number;
  change: string;
  affectedArcs: string[];
  reason: string;
}

export interface ArcTimeline {
  arcId: string;
  phases: ArcPhase[];
  criticalPoints: ArcCriticalPoint[];
  estimatedCompletion: number;
  currentPhase: string;
}

export interface ArcPhase {
  name: string;
  startChapter: number;
  endChapter: number;
  description: string;
  goals: string[];
  relationshipWithOtherArcs: Map<string, string>;
}

export interface ArcCriticalPoint {
  chapter: number;
  type: 'milestone' | 'convergence' | 'divergence' | 'climax' | 'resolution';
  description: string;
  affectedArcs: string[];
  significance: number; // 1-10
}

export interface ArcSynchronization {
  chapter: number;
  synchronizedEvents: SynchronizedEvent[];
  timingAdjustments: TimingAdjustment[];
  pacingAlignment: PacingAlignment;
}

export interface SynchronizedEvent {
  chapter: number;
  arcs: string[];
  event: string;
  purpose: string;
  coordination: string;
}

export interface TimingAdjustment {
  arc: string;
  adjustment: 'accelerate' | 'decelerate' | 'hold' | 'advance';
  chapters: number;
  reason: string;
}

export interface PacingAlignment {
  overallPace: 'synchronized' | 'desynchronized' | 'conflicting';
  arcPaces: Map<string, 'fast' | 'moderate' | 'slow'>;
  recommendations: string[];
}

export interface CrossArcNarrativeReport {
  totalArcs: number;
  activeArcs: number;
  completedArcs: number;
  averageArcComplexity: number;
  totalConnections: number;
  totalConflicts: number;
  convergencePoints: number;
  divergencePoints: number;
  thematicCoherence: number;
  overallBalance: number;
  recommendations: string[];
}

// ===== CLASS DEFINITION =====

export class CrossArcSynergyEngine {
  private arcs: Map<string, NarrativeArc> = new Map();
  private connections: Map<string, ArcConnection> = new Map();
  private dependencies: Map<string, ArcDependency> = new Map();
  private conflicts: Map<string, ArcConflict> = new Map();
  private convergencePoints: Map<string, ConvergencePoint> = new Map();
  private divergencePoints: Map<string, DivergencePoint> = new Map();
  private thematicMap: CrossArcThematicMap;
  private synchronization: ArcSynchronization[] = [];
  
  // Web search integration
  private arcConnectionCache: Map<string, NarrativeSearchResult[]> = new Map();
  private synergyTechniquesCache: Map<string, TechnicalSearchResult[]> = new Map();
  private convergenceStrategiesCache: Map<string, WebSearchResult[]> = new Map();

  constructor() {
    this.thematicMap = {
      themes: new Map(),
      connections: [],
      conflicts: []
    };
  }

  // ===== WEB SEARCH INTEGRATION =====

  /**
   * Search for arc connection patterns
   */
  async searchArcConnections(
    connectionType: string,
    genre: string
  ): Promise<NarrativeSearchResult[]> {
    const key = `${connectionType}-${genre}`;
    if (this.arcConnectionCache.has(key)) {
      return this.arcConnectionCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchNarrativeTechniques(
      `${connectionType} story arc connection`,
      genre
    );
    this.arcConnectionCache.set(key, results);
    return results;
  }

  /**
   * Research narrative synergy techniques
   */
  async searchSynergyTechniques(
    technique: string,
    arcCount: number
  ): Promise<TechnicalSearchResult[]> {
    const key = `${technique}-${arcCount}`;
    if (this.synergyTechniquesCache.has(key)) {
      return this.synergyTechniquesCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchWritingBestPractices(
      `${technique} multiple arcs ${arcCount} synergy`
    );
    this.synergyTechniquesCache.set(key, results);
    return results;
  }

  /**
   * Look up convergence strategies
   */
  async searchConvergenceStrategies(
    convergenceType: string,
    genre: string
  ): Promise<WebSearchResult[]> {
    const key = `${convergenceType}-${genre}`;
    if (this.convergenceStrategiesCache.has(key)) {
      return this.convergenceStrategiesCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${convergenceType} story arcs convergence ${genre} fiction`
    );
    this.convergenceStrategiesCache.set(key, results);
    return results;
  }

  /**
   * Clear web search cache
   */
  clearWebSearchCache(): void {
    this.arcConnectionCache.clear();
    this.synergyTechniquesCache.clear();
    this.convergenceStrategiesCache.clear();
  }

  // ===== CORE FUNCTIONALITY =====

  /**
   * Create narrative arc
   */
  public createArc(
    name: string,
    type: ArcType,
    primaryCharacters: string[],
    primaryThemes: string[],
    metadata: Partial<ArcMetadata> = {}
  ): NarrativeArc {
    const arc: NarrativeArc = {
      id: uuidv4(),
      name,
      type,
      primaryCharacters,
      primaryThemes,
      status: 'not-started',
      priority: 5,
      arcNumber: this.arcs.size + 1,
      chapters: [],
      connections: [],
      dependencies: [],
      conflicts: [],
      metadata: {
        description: metadata.description || '',
        goals: metadata.goals || [],
        resolutionCondition: metadata.resolutionCondition || '',
        timelineEstimate: metadata.timelineEstimate || 10,
        flexibility: metadata.flexibility ?? 0.5,
        complexity: metadata.complexity ?? 0.5
      }
    };
    
    this.arcs.set(arc.id, arc);
    
    // Add themes to thematic map
    primaryThemes.forEach(theme => {
      this.addToThematicMap(theme, arc.id);
    });
    
    return arc;
  }

  /**
   * Add to thematic map
   */
  private addToThematicMap(theme: string, arcId: string): void {
    let crossArcTheme = this.thematicMap.themes.get(theme);
    
    if (!crossArcTheme) {
      crossArcTheme = {
        name: theme,
        arcs: [],
        variations: new Map(),
        depth: new Map(),
        unifiedInterpretation: '',
        evolution: []
      };
      this.thematicMap.themes.set(theme, crossArcTheme);
    }
    
    if (!crossArcTheme.arcs.includes(arcId)) {
      crossArcTheme.arcs.push(arcId);
    }
    
    crossArcTheme.variations.set(arcId, 'standard interpretation');
    crossArcTheme.depth.set(arcId, 0.1);
  }

  /**
   * Start arc
   */
  public startArc(arcId: string, chapter: number): void {
    const arc = this.arcs.get(arcId);
    if (arc) {
      arc.status = 'in-progress';
      this.addChapterToArc(arcId, chapter, 0.8, 'Arc begins');
    }
  }

  /**
   * Add chapter to arc
   */
  public addChapterToArc(
    arcId: string,
    chapterNumber: number,
    advancement: number,
    emotionalNote: string,
    events: ArcEvent[] = []
  ): void {
    const arc = this.arcs.get(arcId);
    if (!arc) return;
    
    const chapterInArc: ChapterInArc = {
      chapterNumber,
      importance: this.calculateChapterImportance(arc, chapterNumber),
      events,
      advancement,
      emotionalNote
    };
    
    arc.chapters.push(chapterInArc);
    
    // Add arc events
    events.forEach(event => {
      arc.metadata.goals.push(event.description);
    });
  }

  /**
   * Calculate chapter importance
   */
  private calculateChapterImportance(arc: NarrativeArc, chapterNumber: number): number {
    // First and last chapters are more important
    if (arc.chapters.length === 0) return 0.9;
    
    const totalEstimatedChapters = arc.metadata.timelineEstimate;
    if (chapterNumber === 1 || chapterNumber >= totalEstimatedChapters - 2) {
      return 0.9;
    }
    
    return 0.5 + Math.random() * 0.3;
  }

  /**
   * Create connection between arcs
   */
  public createConnection(
    fromArc: string,
    toArc: string,
    type: ConnectionType,
    chapter: number,
    description: string
  ): ArcConnection {
    const connection: ArcConnection = {
      id: uuidv4(),
      fromArc,
      toArc,
      type,
      strength: 0.5,
      nature: this.determineConnectionNature(type),
      chapter,
      description,
      bidirectional: false,
      active: true,
      evolution: []
    };
    
    this.connections.set(connection.id, connection);
    
    // Update arc connection lists
    const fromArcObj = this.arcs.get(fromArc);
    const toArcObj = this.arcs.get(toArc);
    
    if (fromArcObj) fromArcObj.connections.push(connection);
    if (toArcObj) toArcObj.connections.push(connection);
    
    return connection;
  }

  /**
   * Determine connection nature
   */
  private determineConnectionNature(type: ConnectionType): string {
    const natures: Record<ConnectionType, string> = {
      'character-share': 'Both arcs involve the same character(s)',
      'thematic': 'Both arcs explore similar themes',
      'causal': 'Events in one arc cause events in the other',
      'temporal': 'Both arcs occur simultaneously',
      'symbolic': 'Both arcs share symbolic elements',
      'contrast': 'Both arcs present contrasting perspectives',
      'reinforcement': 'Both arcs reinforce each other',
      'conflict': 'Both arcs are in conflict',
      'convergence': 'Arcs are converging',
      'divergence': 'Arcs are diverging',
      'echo': 'One arc echoes themes from the other',
      'resolution': 'One arc resolves elements of the other'
    };
    
    return natures[type];
  }

  /**
   * Create dependency between arcs
   */
  public createDependency(
    dependentArc: string,
    requiredArc: string,
    type: DependencyType,
    condition: string,
    critical: boolean = false
  ): ArcDependency {
    const dependency: ArcDependency = {
      id: uuidv4(),
      dependentArc,
      requiredArc,
      type,
      condition,
      critical,
      satisfied: false
    };
    
    this.dependencies.set(dependency.id, dependency);
    
    // Update arc dependency lists
    const dependentArcObj = this.arcs.get(dependentArc);
    if (dependentArcObj) {
      dependentArcObj.dependencies.push(dependency);
    }
    
    return dependency;
  }

  /**
   * Create conflict between arcs
   */
  public createConflict(
    arc1: string,
    arc2: string,
    type: ConflictType,
    description: string,
    severity: number
  ): ArcConflict {
    const conflict: ArcConflict = {
      id: uuidv4(),
      arc1,
      arc2,
      type,
      description,
      severity,
      status: 'unresolved',
      resolutionStrategy: ''
    };
    
    this.conflicts.set(conflict.id, conflict);
    
    // Update arc conflict lists
    const arc1Obj = this.arcs.get(arc1);
    const arc2Obj = this.arcs.get(arc2);
    
    if (arc1Obj) arc1Obj.conflicts.push(conflict);
    if (arc2Obj) arc2Obj.conflicts.push(conflict);
    
    return conflict;
  }

  /**
   * Create convergence point
   */
  public createConvergencePoint(
    chapter: number,
    arcs: string[],
    type: ConvergenceType,
    description: string,
    planned: boolean = true
  ): ConvergencePoint {
    const point: ConvergencePoint = {
      id: uuidv4(),
      chapter,
      arcs,
      type,
      description,
      planned,
      outcomes: arcs.map(arc => ({
        arc,
        outcome: 'convergence impact',
        impact: 'arc affected by convergence',
        futureState: 'new state'
      }))
    };
    
    this.convergencePoints.set(point.id, point);
    
    return point;
  }

  /**
   * Create divergence point
   */
  public createDivergencePoint(
    chapter: number,
    arcs: string[],
    type: DivergenceType,
    description: string,
    triggerEvent: string
  ): DivergencePoint {
    const point: DivergencePoint = {
      id: uuidv4(),
      chapter,
      arcs,
      type,
      description,
      triggerEvent
    };
    
    this.divergencePoints.set(point.id, point);
    
    return point;
  }

  /**
   * Analyze arc synergy
   */
  public analyzeSynergy(arcId: string): SynergyAnalysis {
    const arc = this.arcs.get(arcId);
    if (!arc) {
      throw new Error('Arc not found');
    }
    
    const connections = arc.connections.filter(c => c.active);
    const conflicts = arc.conflicts.filter(c => c.status === 'unresolved');
    
    return {
      arcId,
      overallSynergy: this.calculateOverallSynergy(arc),
      connections: connections.length,
      conflicts: conflicts.length,
      dependencyHealth: this.calculateDependencyHealth(arc),
      thematicCoherence: this.calculateThematicCoherence(arc),
      balanceScore: this.calculateBalanceScore(arc),
      recommendations: this.generateSynergyRecommendations(arc)
    };
  }

  /**
   * Calculate overall synergy
   */
  private calculateOverallSynergy(arc: NarrativeArc): number {
    const connectionStrength = arc.connections.reduce((sum, c) => sum + c.strength, 0);
    const normalizedConnections = arc.connections.length > 0 
      ? connectionStrength / arc.connections.length 
      : 0;
    
    const conflictPenalty = arc.conflicts.reduce((sum, c) => sum + c.severity, 0) / 10;
    
    return Math.max(0, Math.min(1, normalizedConnections - conflictPenalty * 0.3));
  }

  /**
   * Calculate dependency health
   */
  private calculateDependencyHealth(arc: NarrativeArc): number {
    if (arc.dependencies.length === 0) return 1;
    
    const satisfied = arc.dependencies.filter(d => d.satisfied).length;
    return satisfied / arc.dependencies.length;
  }

  /**
   * Calculate thematic coherence
   */
  private calculateThematicCoherence(arc: NarrativeArc): number {
    let coherence = 0;
    
    arc.primaryThemes.forEach(theme => {
      const crossArcTheme = this.thematicMap.themes.get(theme);
      if (crossArcTheme && crossArcTheme.arcs.length > 1) {
        coherence += 0.3;
      }
    });
    
    return Math.min(1, coherence / arc.primaryThemes.length);
  }

  /**
   * Calculate balance score
   */
  private calculateBalanceScore(arc: NarrativeArc): number {
    // Simple implementation - in production would consider arc pacing relative to others
    return 0.7;
  }

  /**
   * Generate synergy recommendations
   */
  private generateSynergyRecommendations(arc: NarrativeArc): string[] {
    const recommendations: string[] = [];
    
    if (arc.connections.length < 2) {
      recommendations.push('Consider adding more connections to other arcs');
    }
    
    if (arc.conflicts.length > 2) {
      recommendations.push('Resolve arc conflicts to improve narrative flow');
    }
    
    if (arc.primaryThemes.length > 0) {
      recommendations.push('Explore thematic connections with other arcs');
    }
    
    return recommendations;
  }

  /**
   * Balance arcs for chapter
   */
  public balanceArcs(chapter: number): ArcBalancing {
    const activeArcs = Array.from(this.arcs.values()).filter(a => 
      a.status === 'in-progress' || a.status === 'converging'
    );
    
    const arcDistribution = new Map<string, number>();
    const recommendedDistribution = new Map<string, number>();
    
    // Calculate current distribution based on recent chapters
    activeArcs.forEach(arc => {
      const recentChapters = arc.chapters.filter(c => 
        Math.abs(c.chapterNumber - chapter) <= 2
      );
      
      const avgAdvancement = recentChapters.length > 0
        ? recentChapters.reduce((sum, c) => sum + c.advancement, 0) / recentChapters.length
        : 0;
      
      arcDistribution.set(arc.id, avgAdvancement);
    });
    
    // Calculate recommended distribution based on priority and stage
    activeArcs.forEach(arc => {
      const recommended = this.calculateRecommendedProminence(arc, chapter);
      recommendedDistribution.set(arc.id, recommended);
    });
    
    // Identify imbalances
    const imbalances: ArcImbalance[] = [];
    activeArcs.forEach(arc => {
      const current = arcDistribution.get(arc.id) || 0;
      const target = recommendedDistribution.get(arc.id) || 0;
      const difference = current - target;
      
      if (Math.abs(difference) > 0.2) {
        imbalances.push({
          arc: arc.id,
          type: difference > 0 ? 'over-coverage' : 'under-coverage',
          severity: Math.round(Math.abs(difference) * 10),
          description: `${arc.name} is ${difference > 0 ? 'over' : 'under'}-covered`,
          current,
          target
        });
      }
    });
    
    return {
      chapter,
      arcDistribution,
      recommendedDistribution,
      imbalances,
      suggestions: this.generateBalancingSuggestions(imbalances, activeArcs)
    };
  }

  /**
   * Calculate recommended prominence
   */
  private calculateRecommendedProminence(arc: NarrativeArc, chapter: number): number {
    let prominence = 0.5;
    
    // Priority affects prominence
    prominence += (arc.priority - 5) * 0.05;
    
    // Arc stage affects prominence
    const progress = arc.chapters.length / Math.max(1, arc.metadata.timelineEstimate);
    if (progress < 0.2 || progress > 0.8) {
      prominence += 0.2; // Beginning and end need more attention
    }
    
    // Convergence affects prominence
    const converging = Array.from(this.convergencePoints.values()).some((p: ConvergencePoint) => 
      p.arcs.includes(arc.id) && Math.abs(p.chapter - chapter) <= 3
    );
    if (converging) prominence += 0.3;
    
    return Math.min(1, Math.max(0.1, prominence));
  }

  /**
   * Generate balancing suggestions
   */
  private generateBalancingSuggestions(
    imbalances: ArcImbalance[],
    arcs: NarrativeArc[]
  ): BalancingSuggestion[] {
    const suggestions: BalancingSuggestion[] = [];
    
    imbalances.forEach(imbalance => {
      const arc = arcs.find(a => a.id === imbalance.arc);
      if (!arc) return;
      
      if (imbalance.type === 'over-coverage') {
        suggestions.push({
          type: 'decrease',
          arc: arc.id,
          description: `Reduce prominence of ${arc.name}`,
          method: 'Defer or compress arc events',
          expectedEffect: 'Better narrative balance'
        });
      } else {
        suggestions.push({
          type: 'increase',
          arc: arc.id,
          description: `Increase prominence of ${arc.name}`,
          method: 'Add or expand arc events',
          expectedEffect: 'Better narrative balance'
        });
      }
    });
    
    return suggestions;
  }

  /**
   * Synchronize arcs
   */
  public synchronizeArcs(chapter: number): ArcSynchronization {
    const activeArcs = Array.from(this.arcs.values()).filter(a => a.status === 'in-progress');
    
    // Find convergence points near this chapter
    const nearbyConvergences = Array.from(this.convergencePoints.values()).filter(p => 
      Math.abs(p.chapter - chapter) <= 2
    );
    
    // Create synchronized events
    const synchronizedEvents: SynchronizedEvent[] = [];
    nearbyConvergences.forEach(convergence => {
      synchronizedEvents.push({
        chapter: convergence.chapter,
        arcs: convergence.arcs,
        event: convergence.description,
        purpose: 'Arc convergence',
        coordination: 'Coordinate arc events for convergence'
      });
    });
    
    // Generate timing adjustments
    const timingAdjustments: TimingAdjustment[] = [];
    activeArcs.forEach(arc => {
      const progress = arc.chapters.length / arc.metadata.timelineEstimate;
      
      if (progress < 0.3 && chapter > arc.metadata.timelineEstimate * 0.5) {
        timingAdjustments.push({
          arc: arc.id,
          adjustment: 'accelerate',
          chapters: 2,
          reason: 'Arc is behind schedule'
        });
      } else if (progress > 0.8 && chapter < arc.metadata.timelineEstimate * 0.7) {
        timingAdjustments.push({
          arc: arc.id,
          adjustment: 'decelerate',
          chapters: 2,
          reason: 'Arc is progressing too quickly'
        });
      }
    });
    
    // Analyze pacing alignment
    const arcPaces = new Map<string, 'fast' | 'moderate' | 'slow'>();
    activeArcs.forEach(arc => {
      const recentAdvancements = arc.chapters.slice(-3).map(c => c.advancement);
      const avgAdvancement = recentAdvancements.reduce((a, b) => a + b, 0) / Math.max(1, recentAdvancements.length);
      
      if (avgAdvancement > 0.7) arcPaces.set(arc.id, 'fast');
      else if (avgAdvancement > 0.4) arcPaces.set(arc.id, 'moderate');
      else arcPaces.set(arc.id, 'slow');
    });
    
    const paceValues = Array.from(arcPaces.values());
    const uniquePaces = new Set(paceValues);
    const overallPace: ArcSynchronization['pacingAlignment']['overallPace'] = 
      uniquePaces.size === 1 ? 'synchronized' : 
      uniquePaces.size === 2 ? 'desynchronized' : 
      'conflicting';
    
    const synchronization: ArcSynchronization = {
      chapter,
      synchronizedEvents,
      timingAdjustments,
      pacingAlignment: {
        overallPace,
        arcPaces,
        recommendations: this.generatePacingRecommendations(overallPace, arcPaces)
      }
    };
    
    this.synchronization.push(synchronization);
    return synchronization;
  }

  /**
   * Generate pacing recommendations
   */
  private generatePacingRecommendations(
    overallPace: ArcSynchronization['pacingAlignment']['overallPace'],
    arcPaces: Map<string, 'fast' | 'moderate' | 'slow'>
  ): string[] {
    const recommendations: string[] = [];
    
    if (overallPace === 'conflicting') {
      recommendations.push('Consider aligning arc pacing for better narrative flow');
    }
    
    const fastArcs = Array.from(arcPaces.entries())
      .filter(([_, pace]) => pace === 'fast')
      .map(([id, _]) => id);
    
    const slowArcs = Array.from(arcPaces.entries())
      .filter(([_, pace]) => pace === 'slow')
      .map(([id, _]) => id);
    
    if (fastArcs.length > 0 && slowArcs.length > 0) {
      recommendations.push('Consider accelerating slower arcs or decelerating faster arcs');
    }
    
    return recommendations;
  }

  /**
   * Complete arc
   */
  public completeArc(arcId: string, chapter: number): void {
    const arc = this.arcs.get(arcId);
    if (arc) {
      arc.status = 'completed';
      this.addChapterToArc(arcId, chapter, 1, 'Arc completes');
      
      // Mark dependencies as satisfied
      arc.dependencies.forEach(dep => {
        if (dep.requiredArc === arcId) {
          dep.satisfied = true;
        }
      });
    }
  }

  /**
   * Resolve conflict
   */
  public resolveConflict(conflictId: string, resolutionStrategy: string): void {
    const conflict = this.conflicts.get(conflictId);
    if (conflict) {
      conflict.status = 'resolved';
      conflict.resolutionStrategy = resolutionStrategy;
    }
  }

  /**
   * Generate cross-arc narrative report
   */
  public generateNarrativeReport(): CrossArcNarrativeReport {
    const arcs = Array.from(this.arcs.values());
    
    return {
      totalArcs: arcs.length,
      activeArcs: arcs.filter(a => a.status === 'in-progress').length,
      completedArcs: arcs.filter(a => a.status === 'completed').length,
      averageArcComplexity: arcs.reduce((sum, a) => sum + a.metadata.complexity, 0) / Math.max(1, arcs.length),
      totalConnections: this.connections.size,
      totalConflicts: this.conflicts.size,
      convergencePoints: this.convergencePoints.size,
      divergencePoints: this.divergencePoints.size,
      thematicCoherence: this.calculateOverallThematicCoherence(),
      overallBalance: this.calculateOverallBalance(),
      recommendations: this.generateOverallRecommendations()
    };
  }

  /**
   * Calculate overall thematic coherence
   */
  private calculateOverallThematicCoherence(): number {
    if (this.thematicMap.themes.size === 0) return 0;
    
    let totalCoherence = 0;
    this.thematicMap.themes.forEach(theme => {
      if (theme.arcs.length > 1) {
        totalCoherence += 0.8;
      } else {
        totalCoherence += 0.5;
      }
    });
    
    return totalCoherence / this.thematicMap.themes.size;
  }

  /**
   * Calculate overall balance
   */
  private calculateOverallBalance(): number {
    const activeArcs = Array.from(this.arcs.values()).filter(a => a.status === 'in-progress');
    if (activeArcs.length === 0) return 1;
    
    // Check if arcs are roughly balanced in priority
    const avgPriority = activeArcs.reduce((sum, a) => sum + a.priority, 0) / activeArcs.length;
    const variance = activeArcs.reduce((sum, a) => sum + Math.pow(a.priority - avgPriority, 2), 0) / activeArcs.length;
    
    return Math.max(0, 1 - variance / 25); // Normalize
  }

  /**
   * Generate overall recommendations
   */
  private generateOverallRecommendations(): string[] {
    const recommendations: string[] = [];
    const report = this.generateNarrativeReport();
    
    if (report.activeArcs < 2) {
      recommendations.push('Consider adding more active arcs for richer narrative');
    }
    
    if (report.totalConnections < report.totalArcs) {
      recommendations.push('Add more connections between arcs for better integration');
    }
    
    if (report.totalConflicts > 3) {
      recommendations.push('Resolve arc conflicts to improve narrative flow');
    }
    
    if (report.convergencePoints === 0) {
      recommendations.push('Plan convergence points for dramatic impact');
    }
    
    if (report.thematicCoherence < 0.6) {
      recommendations.push('Strengthen thematic connections between arcs');
    }
    
    return recommendations;
  }

  // ===== PUBLIC API =====

  /**
   * Get arc by ID
   */
  public getArc(arcId: string): NarrativeArc | undefined {
    return this.arcs.get(arcId);
  }

  /**
   * Get all arcs
   */
  public getAllArcs(): NarrativeArc[] {
    return Array.from(this.arcs.values());
  }

  /**
   * Get arcs by status
   */
  public getArcsByStatus(status: ArcStatus): NarrativeArc[] {
    return Array.from(this.arcs.values()).filter(a => a.status === status);
  }

  /**
   * Get connections for arc
   */
  public getConnectionsForArc(arcId: string): ArcConnection[] {
    return Array.from(this.connections.values()).filter(c => 
      c.fromArc === arcId || c.toArc === arcId
    );
  }

  /**
   * Get thematic map
   */
  public getThematicMap(): CrossArcThematicMap {
    return this.thematicMap;
  }

  /**
   * Get convergence points
   */
  public getConvergencePoints(): ConvergencePoint[] {
    return Array.from(this.convergencePoints.values());
  }

  /**
   * Get divergence points
   */
  public getDivergencePoints(): DivergencePoint[] {
    return Array.from(this.divergencePoints.values());
  }

  /**
   * Get synchronization history
   */
  public getSynchronizationHistory(): ArcSynchronization[] {
    return this.synchronization;
  }

  /**
   * Clear all data
   */
  public clearAllData(): void {
    this.arcs.clear();
    this.connections.clear();
    this.dependencies.clear();
    this.conflicts.clear();
    this.convergencePoints.clear();
    this.divergencePoints.clear();
    this.thematicMap = {
      themes: new Map(),
      connections: [],
      conflicts: []
    };
    this.synchronization = [];
  }
}