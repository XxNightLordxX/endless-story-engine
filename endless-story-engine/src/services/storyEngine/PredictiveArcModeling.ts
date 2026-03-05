/**
 * PredictiveArcModeling - Arc Prediction & Forecasting System
 * 
 * Simulates thousands of possible narrative futures, predicts reader
 * engagement curves, identifies arc collision points, and suggests
 * optimal chapter cliffhangers.
 * 
 * Enhanced with real-time web search for story arc patterns, trending
 * narrative structures, and pacing research.
 */

import { webSearchIntegration } from './WebSearchIntegration';
import type { WebSearchResult, NarrativeSearchResult, LiterarySearchResult } from './WebSearchIntegration';

// ============================================================================
// INTERFACES
// ============================================================================

export interface NarrativeArc {
  id: string;
  name: string;
  type: 'main' | 'character' | 'subplot' | 'romance' | 'mystery' | 'conflict';
  startChapter: number;
  projectedEndChapter: number;
  currentProgress: number; // 0-1
  intensityCurve: number[]; // Intensity per chapter
  keyBeats: ArcBeat[];
  dependencies: string[]; // IDs of dependent arcs
  status: 'building' | 'climaxing' | 'resolving' | 'dormant' | 'complete';
}

export interface ArcBeat {
  chapter: number;
  type: 'setup' | 'complication' | 'crisis' | 'climax' | 'resolution' | 'twist';
  description: string;
  emotionalImpact: number;
  plotImpact: number;
  executed: boolean;
}

export interface ArcSimulation {
  id: string;
  arcId: string;
  timeline: SimulationTimeline[];
  outcome: 'success' | 'failure' | 'bittersweet' | 'ambiguous';
  readerEngagement: number[];
  collisionPoints: CollisionPoint[];
  recommendations: string[];
}

export interface SimulationTimeline {
  chapter: number;
  events: string[];
  emotionalIntensity: number;
  plotProgress: number;
  characterDevelopment: number;
  readerTension: number;
}

export interface CollisionPoint {
  chapter: number;
  arcs: string[];
  type: 'reinforcing' | 'conflicting' | 'overwhelming' | 'underwhelming';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  suggestedResolution: string;
}

export interface EngagementCurve {
  chapter: number;
  predicted: number;
  optimal: number;
  variance: number;
  factors: string[];
}

export interface CliffhangerSuggestion {
  chapter: number;
  type: 'danger' | 'revelation' | 'choice' | 'arrival' | 'departure' | 'death' | 'transformation';
  description: string;
  effectiveness: number;
  setupRequirements: string[];
  payoffChapter: number;
  emotionalImpact: number;
}

export interface ArcPrediction {
  arcId: string;
  currentChapter: number;
  predictedProgression: ProgressionPoint[];
  risks: ArcRisk[];
  opportunities: ArcOpportunity[];
  recommendedActions: string[];
}

export interface ProgressionPoint {
  chapter: number;
  predictedProgress: number;
  predictedIntensity: number;
  keyEvent: string;
  confidence: number;
}

export interface ArcRisk {
  type: 'pacing' | 'engagement' | 'consistency' | 'collision' | 'resolution';
  probability: number;
  impact: number;
  description: string;
  mitigation: string;
}

export interface ArcOpportunity {
  type: 'enhancement' | 'twist' | 'crossover' | 'deepening' | 'acceleration';
  chapter: number;
  description: string;
  benefit: string;
  requirements: string[];
}

// ============================================================================
// PREDICTIVE ARC MODELING SYSTEM
// ============================================================================

export class PredictiveArcModeling {
  private arcs: Map<string, NarrativeArc> = new Map();
  private simulations: Map<string, ArcSimulation[]> = new Map();
  private engagementHistory: EngagementCurve[] = [];
  private cliffhangerSuggestions: CliffhangerSuggestion[] = [];
  
  // Web search integration
  private arcPatternsCache: Map<string, NarrativeSearchResult[]> = new Map();
  private pacingResearchCache: Map<string, WebSearchResult[]> = new Map();
  private trendingStructuresCache: Map<string, LiterarySearchResult[]> = new Map();
  
  // Simulation parameters
  private readonly SIMULATION_COUNT = 100;
  private readonly FORECAST_HORIZON = 20; // chapters ahead
  
  // Engagement thresholds
  private readonly MIN_ENGAGEMENT = 0.4;
  private readonly OPTIMAL_ENGAGEMENT = 0.75;
  private readonly MAX_TENSION_PER_CHAPTER = 0.9;

  constructor() {
    this.initializeCoreArcs();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initializeCoreArcs(): void {
    // Main Story Arc
    this.addArc({
      id: 'main_survival',
      name: 'Survival & Power Discovery',
      type: 'main',
      startChapter: 1,
      projectedEndChapter: 100,
      currentProgress: 0.05,
      intensityCurve: this.generateIntensityCurve('main', 100),
      keyBeats: [
        { chapter: 1, type: 'setup', description: 'Kael awakens in new reality', emotionalImpact: 0.8, plotImpact: 1.0, executed: true },
        { chapter: 5, type: 'complication', description: 'Discovers sister\'s illness', emotionalImpact: 0.9, plotImpact: 0.8, executed: true },
        { chapter: 15, type: 'crisis', description: 'First major threat', emotionalImpact: 0.85, plotImpact: 0.9, executed: false },
        { chapter: 30, type: 'climax', description: 'Power awakening', emotionalImpact: 0.95, plotImpact: 1.0, executed: false },
        { chapter: 50, type: 'twist', description: 'Truth of the system revealed', emotionalImpact: 1.0, plotImpact: 1.0, executed: false }
      ],
      dependencies: [],
      status: 'building'
    });

    // Character Arc - Kael
    this.addArc({
      id: 'kael_identity',
      name: 'Kael\'s Identity Journey',
      type: 'character',
      startChapter: 1,
      projectedEndChapter: 80,
      currentProgress: 0.08,
      intensityCurve: this.generateIntensityCurve('character', 80),
      keyBeats: [
        { chapter: 3, type: 'setup', description: 'Kael questions his new reality', emotionalImpact: 0.7, plotImpact: 0.6, executed: true },
        { chapter: 12, type: 'complication', description: 'Discovers hints of true heritage', emotionalImpact: 0.8, plotImpact: 0.7, executed: false },
        { chapter: 25, type: 'crisis', description: 'Identity crisis moment', emotionalImpact: 0.9, plotImpact: 0.8, executed: false },
        { chapter: 45, type: 'climax', description: 'Accepts/embraces true self', emotionalImpact: 0.95, plotImpact: 0.9, executed: false },
        { chapter: 60, type: 'resolution', description: 'Identity fully realized', emotionalImpact: 0.85, plotImpact: 0.7, executed: false }
      ],
      dependencies: ['main_survival'],
      status: 'building'
    });

    // Character Arc - Yuna
    this.addArc({
      id: 'yuna_illness',
      name: 'Yuna\'s Mysterious Illness',
      type: 'subplot',
      startChapter: 2,
      projectedEndChapter: 60,
      currentProgress: 0.1,
      intensityCurve: this.generateIntensityCurve('subplot', 60),
      keyBeats: [
        { chapter: 5, type: 'setup', description: 'Yuna\'s illness introduced', emotionalImpact: 0.85, plotImpact: 0.7, executed: true },
        { chapter: 10, type: 'complication', description: 'Illness worsens', emotionalImpact: 0.9, plotImpact: 0.8, executed: false },
        { chapter: 20, type: 'crisis', description: 'Critical condition', emotionalImpact: 0.95, plotImpact: 0.85, executed: false },
        { chapter: 35, type: 'climax', description: 'Cure discovered/sacrifice required', emotionalImpact: 1.0, plotImpact: 0.9, executed: false },
        { chapter: 40, type: 'resolution', description: 'Resolution of illness arc', emotionalImpact: 0.8, plotImpact: 0.6, executed: false }
      ],
      dependencies: ['main_survival'],
      status: 'building'
    });

    // Mystery Arc
    this.addArc({
      id: 'progenitor_mystery',
      name: 'The Progenitor Mystery',
      type: 'mystery',
      startChapter: 1,
      projectedEndChapter: 100,
      currentProgress: 0.03,
      intensityCurve: this.generateIntensityCurve('mystery', 100),
      keyBeats: [
        { chapter: 1, type: 'setup', description: 'First hints of Progenitors', emotionalImpact: 0.6, plotImpact: 0.9, executed: true },
        { chapter: 8, type: 'complication', description: 'More clues discovered', emotionalImpact: 0.7, plotImpact: 0.85, executed: false },
        { chapter: 20, type: 'twist', description: 'Unexpected revelation', emotionalImpact: 0.85, plotImpact: 0.95, executed: false },
        { chapter: 50, type: 'crisis', description: 'Truth threatens everything', emotionalImpact: 0.95, plotImpact: 1.0, executed: false },
        { chapter: 80, type: 'resolution', description: 'Full truth revealed', emotionalImpact: 0.9, plotImpact: 0.95, executed: false }
      ],
      dependencies: [],
      status: 'building'
    });

    // Romance Arc (potential)
    this.addArc({
      id: 'romance_thread',
      name: 'Budding Romance',
      type: 'romance',
      startChapter: 5,
      projectedEndChapter: 70,
      currentProgress: 0.02,
      intensityCurve: this.generateIntensityCurve('romance', 70),
      keyBeats: [
        { chapter: 8, type: 'setup', description: 'First meaningful connection', emotionalImpact: 0.6, plotImpact: 0.4, executed: false },
        { chapter: 15, type: 'complication', description: 'Feelings develop but obstacles arise', emotionalImpact: 0.75, plotImpact: 0.5, executed: false },
        { chapter: 30, type: 'crisis', description: 'Major relationship test', emotionalImpact: 0.85, plotImpact: 0.6, executed: false },
        { chapter: 45, type: 'climax', description: 'Relationship defined', emotionalImpact: 0.9, plotImpact: 0.7, executed: false },
        { chapter: 55, type: 'resolution', description: 'Relationship solidified', emotionalImpact: 0.8, plotImpact: 0.5, executed: false }
      ],
      dependencies: ['kael_identity'],
      status: 'dormant'
    });
  }

  private generateIntensityCurve(type: string, length: number): number[] {
    const curve: number[] = [];
    const patterns: Record<string, (t: number) => number> = {
      main: (t) => 0.3 + 0.5 * t + 0.2 * Math.sin(t * Math.PI * 3),
      character: (t) => 0.2 + 0.4 * t + 0.4 * Math.sin(t * Math.PI * 2),
      subplot: (t) => 0.4 * Math.sin(t * Math.PI) * Math.exp(-2 * (t - 0.5) * (t - 0.5)) + 0.3 + 0.3 * t,
      mystery: (t) => 0.2 + 0.3 * t + 0.5 * Math.pow(t, 2),
      romance: (t) => 0.3 * (1 - Math.exp(-5 * t)) + 0.3 * Math.sin(t * Math.PI * 2),
      conflict: (t) => 0.5 + 0.3 * Math.sin(t * Math.PI * 4) + 0.2 * t
    };

    const pattern = patterns[type] || patterns.main;
    for (let i = 0; i < length; i++) {
      const t = i / (length - 1);
      curve.push(Math.max(0, Math.min(1, pattern(t))));
    }

    return curve;
  }

  // ============================================================================
  // WEB SEARCH INTEGRATION
  // ============================================================================

  /**
   * Search for story arc patterns in literature
   */
  async searchArcPatterns(
    arcType: string,
    genre: string
  ): Promise<NarrativeSearchResult[]> {
    const key = `${arcType}-${genre}`;
    if (this.arcPatternsCache.has(key)) {
      return this.arcPatternsCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchNarrativeTechniques(
      `${arcType} story arc pattern`,
      genre
    );
    this.arcPatternsCache.set(key, results);
    return results;
  }

  /**
   * Analyze trending narrative structures
   */
  async searchTrendingStructures(
    genre: string,
    timeframe: 'current' | 'year' | 'decade' = 'current'
  ): Promise<LiterarySearchResult[]> {
    const key = `${genre}-${timeframe}`;
    if (this.trendingStructuresCache.has(key)) {
      return this.trendingStructuresCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchLiteraryExamples(
      `popular ${timeframe === 'current' ? 'current' : timeframe} story structure`,
      genre
    );
    this.trendingStructuresCache.set(key, results);
    return results;
  }

  /**
   * Find examples of similar plot developments
   */
  async searchPlotExamples(
    plotType: string,
    emotionalTone: string
  ): Promise<LiterarySearchResult[]> {
    return await webSearchIntegration.searchLiteraryExamples(
      `${plotType} ${emotionalTone}`,
      'fiction'
    );
  }

  /**
   * Research pacing techniques in popular fiction
   */
  async searchPacingTechniques(
    genre: string,
    intensity: 'slow' | 'medium' | 'fast'
  ): Promise<WebSearchResult[]> {
    const key = `${genre}-${intensity}`;
    if (this.pacingResearchCache.has(key)) {
      return this.pacingResearchCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchStoryStructure(
      `${intensity} pacing`,
      genre
    );
    this.pacingResearchCache.set(key, results);
    return results;
  }

  /**
   * Enhance arc simulation with web research
   */
  async simulateArcWithWebResearch(
    arcId: string,
    fromChapter: number,
    genre: string
  ): Promise<ArcSimulation[]> {
    // Get standard simulation
    const simulations = this.simulateArcFuture(arcId, fromChapter);
    
    // Enhance with web research
    const arc = this.arcs.get(arcId);
    if (arc) {
      const patterns = await this.searchArcPatterns(arc.type, genre);
      const pacingTips = await this.searchPacingTechniques(genre, 'medium');
      
      // Incorporate insights into simulations
      for (const simulation of simulations) {
        simulation.recommendations.push(
          ...this.extractPacingRecommendations(pacingTips)
        );
      }
    }
    
    return simulations;
  }

  /**
   * Extract pacing recommendations from web search results
   */
  private extractPacingRecommendations(
    results: WebSearchResult[]
  ): string[] {
    const recommendations: string[] = [];
    
    for (const result of results) {
      if (result.relevance > 0.7 && result.snippet) {
        // Extract key sentences
        const sentences = result.snippet.split(/[.!?]/).filter(s => s.trim().length > 15);
        if (sentences.length > 0) {
          recommendations.push(sentences[0].trim());
        }
      }
    }
    
    return recommendations.slice(0, 3);
  }

  /**
   * Get web research for collision prevention
   */
  async researchCollisionPrevention(
    arcTypes: string[],
    genre: string
  ): Promise<NarrativeSearchResult[]> {
    const results: NarrativeSearchResult[] = [];
    
    for (const arcType of arcTypes) {
      const searchResults = await this.searchArcPatterns(arcType, genre);
      results.push(...searchResults.filter(r => r.applicability > 0.6));
    }
    
    return results;
  }

  /**
   * Clear web search cache
   */
  clearWebSearchCache(): void {
    this.arcPatternsCache.clear();
    this.pacingResearchCache.clear();
    this.trendingStructuresCache.clear();
  }

  // ============================================================================
  // ARC MANAGEMENT
  // ============================================================================

  addArc(arc: NarrativeArc): void {
    this.arcs.set(arc.id, arc);
  }

  getArc(arcId: string): NarrativeArc | undefined {
    return this.arcs.get(arcId);
  }

  getAllArcs(): NarrativeArc[] {
    return Array.from(this.arcs.values());
  }

  updateArcProgress(arcId: string, progress: number, currentChapter: number): void {
    const arc = this.arcs.get(arcId);
    if (arc) {
      arc.currentProgress = progress;
      
      // Update status based on progress
      if (progress >= 0.9) {
        arc.status = 'resolving';
      } else if (progress >= 0.7) {
        arc.status = 'climaxing';
      } else if (progress >= 0.1) {
        arc.status = 'building';
      }

      // Mark beats as executed
      arc.keyBeats.forEach(beat => {
        if (beat.chapter <= currentChapter && !beat.executed) {
          beat.executed = true;
        }
      });
    }
  }

  // ============================================================================
  // ARC SIMULATION
  // ============================================================================

  /**
   * Simulate possible futures for an arc
   */
  simulateArcFuture(arcId: string, fromChapter: number): ArcSimulation[] {
    const arc = this.arcs.get(arcId);
    if (!arc) return [];

    const simulations: ArcSimulation[] = [];

    for (let i = 0; i < this.SIMULATION_COUNT; i++) {
      const simulation = this.runSingleSimulation(arc, fromChapter, i);
      simulations.push(simulation);
    }

    // Store simulations
    if (!this.simulations.has(arcId)) {
      this.simulations.set(arcId, []);
    }
    this.simulations.get(arcId)!.push(...simulations);

    return simulations;
  }

  private runSingleSimulation(arc: NarrativeArc, fromChapter: number, seed: number): ArcSimulation {
    const timeline: SimulationTimeline[] = [];
    const collisionPoints: CollisionPoint[] = [];
    const recommendations: string[] = [];
    
    let currentIntensity = arc.intensityCurve[fromChapter] || 0.5;
    let plotProgress = arc.currentProgress;
    let readerTension = 0.5;

    // Simulate each chapter
    for (let chapter = fromChapter; chapter < fromChapter + this.FORECAST_HORIZON; chapter++) {
      // Random variation based on seed
      const variation = (Math.sin(seed * chapter) * 0.1 + Math.random() * 0.1 - 0.05);
      
      // Calculate chapter metrics
      const emotionalIntensity = Math.min(1, Math.max(0, 
        (arc.intensityCurve[chapter] || currentIntensity) + variation
      ));
      
      plotProgress = Math.min(1, plotProgress + 0.03 + variation * 0.02);
      
      // Reader tension follows emotional intensity with lag
      readerTension = readerTension * 0.7 + emotionalIntensity * 0.3;
      
      // Determine events
      const events = this.predictEventsForChapter(arc, chapter, emotionalIntensity, seed);

      timeline.push({
        chapter,
        events,
        emotionalIntensity,
        plotProgress,
        characterDevelopment: emotionalIntensity * 0.8 + variation,
        readerTension
      });

      // Check for collision with other arcs
      const collisions = this.detectCollisions(arc.id, chapter, emotionalIntensity);
      collisionPoints.push(...collisions);

      currentIntensity = emotionalIntensity;
    }

    // Determine outcome
    const outcome = this.determineOutcome(timeline);
    
    // Generate recommendations
    recommendations.push(...this.generateSimulationRecommendations(arc, timeline, collisionPoints));

    return {
      id: `sim_${arc.id}_${fromChapter}_${seed}`,
      arcId: arc.id,
      timeline,
      outcome,
      readerEngagement: timeline.map(t => t.readerTension),
      collisionPoints,
      recommendations
    };
  }

  private predictEventsForChapter(
    arc: NarrativeArc, 
    chapter: number, 
    intensity: number,
    seed: number
  ): string[] {
    const events: string[] = [];
    
    // Check for key beats
    const beat = arc.keyBeats.find(b => b.chapter === chapter);
    if (beat) {
      events.push(`KEY BEAT: ${beat.description}`);
    }

    // Predict events based on intensity and arc type
    if (intensity > 0.8) {
      events.push(this.getRandomHighIntensityEvent(arc.type, seed));
    } else if (intensity > 0.6) {
      events.push(this.getRandomMediumIntensityEvent(arc.type, seed));
    } else if (intensity > 0.4) {
      events.push(this.getRandomLowIntensityEvent(arc.type, seed));
    }

    return events;
  }

  private getRandomHighIntensityEvent(arcType: string, seed: number): string {
    const events: Record<string, string[]> = {
      main: ['Major battle', 'Critical revelation', 'Character death', 'Power awakening'],
      character: ['Identity crisis', 'Major decision', 'Character breakthrough', 'Moral dilemma'],
      subplot: ['Crisis point', 'Urgent threat', 'Time limit established', 'Sacrifice required'],
      mystery: ['Major clue found', 'False lead exposed', 'Suspect identified', 'Truth revealed'],
      romance: ['Relationship tested', 'Confession', 'Betrayal', 'Reunion'],
      conflict: ['Climax battle', 'Final confrontation', 'Decisive moment', 'Victory/defeat']
    };

    const pool = events[arcType] || events.main;
    return pool[Math.abs(seed) % pool.length];
  }

  private getRandomMediumIntensityEvent(arcType: string, seed: number): string {
    const events: Record<string, string[]> = {
      main: ['New challenge', 'Complication', 'Minor revelation', 'Ally gained/lost'],
      character: ['Character growth', 'New understanding', 'Relationship development', 'Skill improvement'],
      subplot: ['Progress made', 'New obstacle', 'Stake increase', 'Alliance formed'],
      mystery: ['Clue discovered', 'New suspect', 'Contradiction found', 'Witness questioned'],
      romance: ['Meaningful conversation', 'Growing feelings', 'Jealousy', 'Support given'],
      conflict: ['Skirmish', 'Strategy developed', 'Setback', 'Advantage gained']
    };

    const pool = events[arcType] || events.main;
    return pool[Math.abs(seed) % pool.length];
  }

  private getRandomLowIntensityEvent(arcType: string, seed: number): string {
    const events: Record<string, string[]> = {
      main: ['Planning scene', 'Information gathering', 'Recovery', 'Character moment'],
      character: ['Reflection', 'Training', 'Bonding', 'Preparation'],
      subplot: ['Background development', 'Setup scene', 'Hint dropped', 'Connection made'],
      mystery: ['Investigation', 'Research', 'Hypothesis formed', 'Lead followed'],
      romance: ['Casual interaction', 'Subtle hint', 'Shared moment', 'Growing awareness'],
      conflict: ['Tension building', 'Posturing', 'Intelligence gathering', 'Recruitment']
    };

    const pool = events[arcType] || events.main;
    return pool[Math.abs(seed) % pool.length];
  }

  // ============================================================================
  // COLLISION DETECTION
  // ============================================================================

  private detectCollisions(
    arcId: string, 
    chapter: number, 
    intensity: number
  ): CollisionPoint[] {
    const collisions: CollisionPoint[] = [];
    const arc = this.arcs.get(arcId);
    if (!arc) return collisions;

    // Check all other arcs
    this.arcs.forEach((otherArc, otherId) => {
      if (otherId === arcId) return;

      const otherIntensity = otherArc.intensityCurve[chapter] || 0.5;
      const combinedIntensity = intensity + otherIntensity;

      // Check for high-intensity collision
      if (combinedIntensity > 1.5) {
        collisions.push({
          chapter,
          arcs: [arcId, otherId],
          type: 'overwhelming',
          severity: combinedIntensity > 1.8 ? 'critical' : 'major',
          description: `High intensity collision between "${arc.name}" and "${otherArc.name}"`,
          suggestedResolution: 'Consider spacing out climactic moments or merging arcs'
        });
      } else if (combinedIntensity > 1.2) {
        collisions.push({
          chapter,
          arcs: [arcId, otherId],
          type: 'reinforcing',
          severity: 'moderate',
          description: `Reinforcing collision between "${arc.name}" and "${otherArc.name}"`,
          suggestedResolution: 'Good opportunity for crossover moment'
        });
      } else if (combinedIntensity < 0.6 && intensity > 0.5) {
        collisions.push({
          chapter,
          arcs: [arcId, otherId],
          type: 'conflicting',
          severity: 'minor',
          description: `Intensity mismatch between "${arc.name}" and "${otherArc.name}"`,
          suggestedResolution: 'Consider which arc should take precedence'
        });
      }
    });

    return collisions;
  }

  /**
   * Find all collision points across all arcs
   */
  findAllCollisionPoints(fromChapter: number, toChapter: number): CollisionPoint[] {
    const allCollisions: CollisionPoint[] = [];

    this.arcs.forEach((arc, arcId) => {
      for (let chapter = fromChapter; chapter <= toChapter; chapter++) {
        const intensity = arc.intensityCurve[chapter] || 0.5;
        const collisions = this.detectCollisions(arcId, chapter, intensity);
        allCollisions.push(...collisions);
      }
    });

    // Remove duplicates
    const uniqueCollisions = this.deduplicateCollisions(allCollisions);
    
    // Sort by chapter and severity
    return uniqueCollisions.sort((a, b) => {
      if (a.chapter !== b.chapter) return a.chapter - b.chapter;
      const severityOrder = { critical: 0, major: 1, moderate: 2, minor: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  private deduplicateCollisions(collisions: CollisionPoint[]): CollisionPoint[] {
    const seen = new Set<string>();
    return collisions.filter(c => {
      const key = `${c.chapter}_${c.arcs.sort().join('_')}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // ============================================================================
  // ENGAGEMENT PREDICTION
  // ============================================================================

  /**
   * Predict reader engagement curve for upcoming chapters
   */
  predictEngagementCurve(fromChapter: number, toChapter: number): EngagementCurve[] {
    const curve: EngagementCurve[] = [];

    for (let chapter = fromChapter; chapter <= toChapter; chapter++) {
      const factors: string[] = [];
      let predictedEngagement = 0.5;

      // Factor in all arc intensities
      this.arcs.forEach((arc, _id) => {
        const intensity = arc.intensityCurve[chapter];
        if (intensity !== undefined) {
          predictedEngagement += intensity * 0.15;
          
          if (intensity > 0.8) {
            factors.push(`${arc.name} climax`);
          } else if (intensity > 0.6) {
            factors.push(`${arc.name} buildup`);
          }
        }

        // Check for key beats
        const beat = arc.keyBeats.find(b => b.chapter === chapter);
        if (beat) {
          predictedEngagement += beat.emotionalImpact * 0.1;
          factors.push(`Key event: ${beat.description}`);
        }
      });

      // Normalize
      predictedEngagement = Math.min(1, Math.max(this.MIN_ENGAGEMENT, predictedEngagement));

      // Calculate optimal engagement
      const optimal = this.OPTIMAL_ENGAGEMENT;

      // Calculate variance from historical data
      const variance = this.calculateEngagementVariance(chapter, predictedEngagement);

      curve.push({
        chapter,
        predicted: predictedEngagement,
        optimal,
        variance,
        factors
      });
    }

    return curve;
  }

  private calculateEngagementVariance(chapter: number, predicted: number): number {
    // Calculate variance based on historical data
    if (this.engagementHistory.length < 3) {
      return 0.1; // Default variance
    }

    const recentHistory = this.engagementHistory.slice(-5);
    const avgPredicted = recentHistory.reduce((sum, e) => sum + e.predicted, 0) / recentHistory.length;
    
    return Math.abs(predicted - avgPredicted) * 0.5;
  }

  /**
   * Update engagement history with actual data
   */
  recordActualEngagement(chapter: number, actualEngagement: number): void {
    const existing = this.engagementHistory.find(e => e.chapter === chapter);
    
    if (existing) {
      existing.predicted = actualEngagement;
    } else {
      this.engagementHistory.push({
        chapter,
        predicted: actualEngagement,
        optimal: this.OPTIMAL_ENGAGEMENT,
        variance: 0,
        factors: ['Actual recorded']
      });
    }
  }

  // ============================================================================
  // CLIFFHANGER OPTIMIZATION
  // ============================================================================

  /**
   * Suggest optimal cliffhangers for upcoming chapters
   */
  suggestCliffhangers(fromChapter: number, count: number = 5): CliffhangerSuggestion[] {
    const suggestions: CliffhangerSuggestion[] = [];

    for (let chapter = fromChapter; chapter < fromChapter + count; chapter++) {
      const suggestion = this.generateCliffhangerSuggestion(chapter);
      if (suggestion) {
        suggestions.push(suggestion);
      }
    }

    // Sort by effectiveness
    suggestions.sort((a, b) => b.effectiveness - a.effectiveness);

    this.cliffhangerSuggestions = suggestions;
    return suggestions;
  }

  private generateCliffhangerSuggestion(chapter: number): CliffhangerSuggestion | null {
    // Find arcs with high intensity at this chapter
    const relevantArcs: NarrativeArc[] = [];
    
    this.arcs.forEach(arc => {
      const intensity = arc.intensityCurve[chapter];
      if (intensity && intensity > 0.6) {
        relevantArcs.push(arc);
      }
    });

    if (relevantArcs.length === 0) {
      return null;
    }

    // Determine best cliffhanger type
    const type = this.determineCliffhangerType(chapter, relevantArcs);
    const description = this.generateCliffhangerDescription(type, relevantArcs, chapter);
    const effectiveness = this.calculateCliffhangerEffectiveness(chapter, type, relevantArcs);
    const setupRequirements = this.generateSetupRequirements(type, chapter);
    const emotionalImpact = this.calculateEmotionalImpact(type, relevantArcs);

    // Find payoff chapter (typically 1-3 chapters later)
    const payoffChapter = chapter + Math.floor(Math.random() * 2) + 1;

    return {
      chapter,
      type,
      description,
      effectiveness,
      setupRequirements,
      payoffChapter,
      emotionalImpact
    };
  }

  private determineCliffhangerType(chapter: number, arcs: NarrativeArc[]): CliffhangerSuggestion['type'] {
    const types: CliffhangerSuggestion['type'][] = ['danger', 'revelation', 'choice', 'arrival', 'departure', 'death', 'transformation'];
    
    // Weight based on arc types
    const weights: Record<string, number[]> = {
      main: [0.3, 0.25, 0.15, 0.1, 0.05, 0.1, 0.05],  // danger, revelation
      character: [0.1, 0.15, 0.3, 0.1, 0.1, 0.1, 0.15], // choice, transformation
      mystery: [0.1, 0.4, 0.1, 0.1, 0.1, 0.1, 0.1],   // revelation
      romance: [0.1, 0.2, 0.25, 0.15, 0.15, 0.05, 0.1], // choice, arrival, departure
      conflict: [0.35, 0.1, 0.15, 0.15, 0.1, 0.1, 0.05], // danger
      subplot: [0.2, 0.2, 0.2, 0.15, 0.1, 0.1, 0.05]
    };

    // Average weights from relevant arcs
    const avgWeights = types.map((_, i) => {
      return arcs.reduce((sum, arc) => {
        const arcWeights = weights[arc.type] || weights.main;
        return sum + arcWeights[i];
      }, 0) / arcs.length;
    });

    // Select type based on weights
    const random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < types.length; i++) {
      cumulative += avgWeights[i];
      if (random < cumulative) {
        return types[i];
      }
    }

    return 'danger';
  }

  private generateCliffhangerDescription(
    type: CliffhangerSuggestion['type'], 
    arcs: NarrativeArc[], 
    chapter: number
  ): string {
    const arcNames = arcs.map(a => a.name).join(' and ');
    
    const descriptions: Record<CliffhangerSuggestion['type'], string> = {
      danger: `Life-threatening situation emerges at critical moment in ${arcNames}`,
      revelation: `Shocking truth about ${arcNames} is revealed`,
      choice: `Impossible choice must be made affecting ${arcNames}`,
      arrival: `Unexpected arrival changes the course of ${arcNames}`,
      departure: `Major character departure impacts ${arcNames}`,
      death: `Death of significant character in ${arcNames}`,
      transformation: `Fundamental transformation occurs in ${arcNames}`
    };

    return descriptions[type];
  }

  private calculateCliffhangerEffectiveness(
    chapter: number, 
    type: CliffhangerSuggestion['type'], 
    arcs: NarrativeArc[]
  ): number {
    let effectiveness = 0.5;

    // Factor in arc intensities
    const avgIntensity = arcs.reduce((sum, arc) => {
      return sum + (arc.intensityCurve[chapter] || 0.5);
    }, 0) / arcs.length;
    effectiveness += avgIntensity * 0.3;

    // Factor in cliffhanger type
    const typeBonus: Record<CliffhangerSuggestion['type'], number> = {
      death: 0.2,
      revelation: 0.15,
      transformation: 0.15,
      danger: 0.1,
      choice: 0.1,
      arrival: 0.08,
      departure: 0.08
    };
    effectiveness += typeBonus[type];

    // Factor in number of arcs
    effectiveness += Math.min(0.1, arcs.length * 0.03);

    return Math.min(1, effectiveness);
  }

  private generateSetupRequirements(type: CliffhangerSuggestion['type'], chapter: number): string[] {
    const requirements: Record<CliffhangerSuggestion['type'], string[]> = {
      danger: [
        `Chapter ${chapter - 2}: Establish threat presence`,
        `Chapter ${chapter - 1}: Build tension with near-miss`,
        `Chapter ${chapter}: Reveal full danger`
      ],
      revelation: [
        `Chapter ${chapter - 3}: Drop subtle hints`,
        `Chapter ${chapter - 1}: Create doubt or confusion`,
        `Chapter ${chapter}: Deliver revelation`
      ],
      choice: [
        `Chapter ${chapter - 2}: Establish stakes`,
        `Chapter ${chapter - 1}: Present options`,
        `Chapter ${chapter}: Force decision`
      ],
      arrival: [
        `Chapter ${chapter - 2}: Mention character/faction`,
        `Chapter ${chapter - 1}: Create expectation`,
        `Chapter ${chapter}: Subvert with arrival`
      ],
      departure: [
        `Chapter ${chapter - 3}: Strengthen character bond`,
        `Chapter ${chapter - 1}: Create tension/conflict`,
        `Chapter ${chapter}: Execute departure`
      ],
      death: [
        `Chapter ${chapter - 5}: Deepen character connection`,
        `Chapter ${chapter - 2}: Establish threat level`,
        `Chapter ${chapter}: Execute death scene`
      ],
      transformation: [
        `Chapter ${chapter - 3}: Show character struggle`,
        `Chapter ${chapter - 1}: Reach breaking point`,
        `Chapter ${chapter}: Show transformation`
      ]
    };

    return requirements[type];
  }

  private calculateEmotionalImpact(type: CliffhangerSuggestion['type'], arcs: NarrativeArc[]): number {
    const baseImpact: Record<CliffhangerSuggestion['type'], number> = {
      death: 0.95,
      transformation: 0.85,
      revelation: 0.8,
      choice: 0.75,
      departure: 0.7,
      danger: 0.65,
      arrival: 0.6
    };

    // Factor in arc emotional levels
    const arcEmotion = arcs.reduce((sum, arc) => {
      const beats = arc.keyBeats.filter(b => b.emotionalImpact > 0.7);
      return sum + (beats.length > 0 ? 0.1 : 0);
    }, 0);

    return Math.min(1, (baseImpact[type] || 0.6) + arcEmotion);
  }

  // ============================================================================
  // ARC PREDICTION
  // ============================================================================

  /**
   * Generate prediction for a specific arc
   */
  predictArc(arcId: string, currentChapter: number): ArcPrediction {
    const arc = this.arcs.get(arcId);
    if (!arc) {
      throw new Error(`Arc ${arcId} not found`);
    }

    const predictedProgression = this.predictProgression(arc, currentChapter);
    const risks = this.identifyRisks(arc, currentChapter);
    const opportunities = this.identifyOpportunities(arc, currentChapter);
    const recommendedActions = this.generateRecommendations(arc, risks, opportunities);

    return {
      arcId,
      currentChapter,
      predictedProgression,
      risks,
      opportunities,
      recommendedActions
    };
  }

  private predictProgression(arc: NarrativeArc, currentChapter: number): ProgressionPoint[] {
    const progression: ProgressionPoint[] = [];
    const remainingChapters = arc.projectedEndChapter - currentChapter;

    for (let i = 0; i < Math.min(10, remainingChapters); i++) {
      const chapter = currentChapter + i + 1;
      const progress = Math.min(1, arc.currentProgress + (i + 1) / remainingChapters);
      const intensity = arc.intensityCurve[chapter] || 0.5;
      
      // Find key event for this chapter
      const beat = arc.keyBeats.find(b => b.chapter === chapter);
      const keyEvent = beat ? beat.description : this.predictEvent(arc.type, intensity);

      // Calculate confidence based on distance
      const confidence = Math.max(0.5, 1 - i * 0.05);

      progression.push({
        chapter,
        predictedProgress: progress,
        predictedIntensity: intensity,
        keyEvent,
        confidence
      });
    }

    return progression;
  }

  private predictEvent(arcType: string, intensity: number): string {
    if (intensity > 0.8) return 'Climactic moment';
    if (intensity > 0.6) return 'Significant development';
    if (intensity > 0.4) return 'Steady progress';
    return 'Quiet development';
  }

  private identifyRisks(arc: NarrativeArc, currentChapter: number): ArcRisk[] {
    const risks: ArcRisk[] = [];

    // Check for pacing risks
    const avgIntensity = arc.intensityCurve.slice(currentChapter, currentChapter + 10)
      .reduce((a, b) => a + b, 0) / 10;
    
    if (avgIntensity > 0.85) {
      risks.push({
        type: 'pacing',
        probability: 0.7,
        impact: 0.6,
        description: 'Sustained high intensity may exhaust readers',
        mitigation: 'Consider adding breathing room chapters'
      });
    }

    // Check for engagement risks
    if (arc.status === 'dormant') {
      risks.push({
        type: 'engagement',
        probability: 0.5,
        impact: 0.7,
        description: 'Dormant arc may lose reader interest',
        mitigation: 'Introduce reminder or teaser elements'
      });
    }

    // Check for collision risks
    const collisions = this.detectCollisions(arc.id, currentChapter, 0.7);
    if (collisions.some(c => c.severity === 'critical' || c.severity === 'major')) {
      risks.push({
        type: 'collision',
        probability: 0.6,
        impact: 0.8,
        description: 'Major arc collision detected',
        mitigation: 'Consider restructuring arc timing'
      });
    }

    // Check for resolution risks
    const remainingBeats = arc.keyBeats.filter(b => !b.executed && b.type === 'resolution');
    if (remainingBeats.length === 0 && arc.currentProgress > 0.8) {
      risks.push({
        type: 'resolution',
        probability: 0.4,
        impact: 0.5,
        description: 'No clear resolution beat planned',
        mitigation: 'Add a satisfying resolution moment'
      });
    }

    return risks;
  }

  private identifyOpportunities(arc: NarrativeArc, currentChapter: number): ArcOpportunity[] {
    const opportunities: ArcOpportunity[] = [];

    // Check for crossover opportunities
    this.arcs.forEach((otherArc, otherId) => {
      if (otherId === arc.id) return;
      
      for (let chapter = currentChapter; chapter < currentChapter + 10; chapter++) {
        const arcIntensity = arc.intensityCurve[chapter] || 0;
        const otherIntensity = otherArc.intensityCurve[chapter] || 0;
        
        if (arcIntensity > 0.6 && otherIntensity > 0.6) {
          opportunities.push({
            type: 'crossover',
            chapter,
            description: `Crossover opportunity with "${otherArc.name}"`,
            benefit: 'Multiply emotional impact',
            requirements: ['Plan shared scene', 'Align character motivations']
          });
          break;
        }
      }
    });

    // Check for twist opportunities
    const upcomingBeats = arc.keyBeats.filter(b => b.chapter > currentChapter && b.chapter < currentChapter + 10);
    if (upcomingBeats.some(b => b.type === 'climax') && !upcomingBeats.some(b => b.type === 'twist')) {
      opportunities.push({
        type: 'twist',
        chapter: upcomingBeats.find(b => b.type === 'climax')?.chapter || currentChapter + 5,
        description: 'Opportunity to add unexpected twist before climax',
        benefit: 'Increase reader engagement and surprise',
        requirements: ['Setup misdirection', 'Plant contradictory clues']
      });
    }

    // Check for acceleration opportunity
    if (arc.status === 'building' && arc.currentProgress < 0.3) {
      opportunities.push({
        type: 'acceleration',
        chapter: currentChapter + 2,
        description: 'Arc can be accelerated with significant event',
        benefit: 'Faster reader engagement',
        requirements: ['Condense buildup', 'Combine minor beats']
      });
    }

    return opportunities;
  }

  private generateRecommendations(
    arc: NarrativeArc, 
    risks: ArcRisk[], 
    opportunities: ArcOpportunity[]
  ): string[] {
    const recommendations: string[] = [];

    // Address highest risk
    const highestRisk = risks.sort((a, b) => (b.probability * b.impact) - (a.probability * a.impact))[0];
    if (highestRisk) {
      recommendations.push(`RISK MITIGATION: ${highestRisk.mitigation}`);
    }

    // Suggest best opportunity
    const bestOpportunity = opportunities.sort((a, b) => b.chapter - a.chapter)[0];
    if (bestOpportunity) {
      recommendations.push(`OPPORTUNITY: ${bestOpportunity.description} at chapter ${bestOpportunity.chapter}`);
    }

    // Arc-specific recommendations
    if (arc.type === 'mystery' && arc.currentProgress < 0.5) {
      recommendations.push('Drop more clues to maintain reader engagement with mystery');
    }
    if (arc.type === 'romance' && arc.status === 'dormant') {
      recommendations.push('Consider reactivating romance arc with meaningful interaction');
    }

    return recommendations;
  }

  // ============================================================================
  // OUTCOME DETERMINATION
  // ============================================================================

  private determineOutcome(timeline: SimulationTimeline[]): ArcSimulation['outcome'] {
    const avgEngagement = timeline.reduce((sum, t) => sum + t.readerTension, 0) / timeline.length;
    const endProgress = timeline[timeline.length - 1]?.plotProgress || 0;
    
    if (avgEngagement > 0.75 && endProgress > 0.9) {
      return 'success';
    } else if (avgEngagement > 0.6 && endProgress > 0.8) {
      return 'bittersweet';
    } else if (avgEngagement < 0.5) {
      return 'failure';
    }
    return 'ambiguous';
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private generateSimulationRecommendations(
    arc: NarrativeArc, 
    timeline: SimulationTimeline[], 
    collisions: CollisionPoint[]
  ): string[] {
    const recommendations: string[] = [];

    // Check engagement trend
    const engagementTrend = timeline.slice(-5).map(t => t.readerTension);
    const isDeclining = engagementTrend.every((e, i) => i === 0 || e <= engagementTrend[i - 1]);
    
    if (isDeclining) {
      recommendations.push('Engagement declining - consider injecting dramatic moment');
    }

    // Address collisions
    const criticalCollisions = collisions.filter(c => c.severity === 'critical');
    if (criticalCollisions.length > 0) {
      recommendations.push(`Resolve ${criticalCollisions.length} critical arc collision(s)`);
    }

    return recommendations;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Get all simulations for an arc
   */
  getSimulations(arcId: string): ArcSimulation[] {
    return this.simulations.get(arcId) || [];
  }

  /**
   * Get cliffhanger suggestions
   */
  getCliffhangerSuggestions(): CliffhangerSuggestion[] {
    return [...this.cliffhangerSuggestions];
  }

  /**
   * Get engagement history
   */
  getEngagementHistory(): EngagementCurve[] {
    return [...this.engagementHistory];
  }

  /**
   * Generate comprehensive prediction report
   */
  generatePredictionReport(currentChapter: number): {
    arcs: ArcPrediction[];
    collisions: CollisionPoint[];
    cliffhangers: CliffhangerSuggestion[];
    engagement: EngagementCurve[];
  } {
    const arcs = Array.from(this.arcs.keys()).map(id => this.predictArc(id, currentChapter));
    const collisions = this.findAllCollisionPoints(currentChapter, currentChapter + 20);
    const cliffhangers = this.suggestCliffhangers(currentChapter, 5);
    const engagement = this.predictEngagementCurve(currentChapter, currentChapter + 10);

    return {
      arcs,
      collisions,
      cliffhangers,
      engagement
    };
  }

  /**
   * Optimize chapter sequence for maximum engagement
   */
  optimizeChapterSequence(fromChapter: number, count: number): {
    sequence: number[];
    expectedEngagement: number[];
    reasoning: string[];
  } {
    const engagement = this.predictEngagementCurve(fromChapter, fromChapter + count * 2);
    
    // Find chapters with highest predicted engagement
    const sortedByEngagement = [...engagement].sort((a, b) => b.predicted - a.predicted);
    const topChapters = sortedByEngagement.slice(0, count).map(e => e.chapter);
    
    // Sort by chapter number for sequence
    const sequence = topChapters.sort((a, b) => a - b);
    const expectedEngagement = sequence.map(ch => engagement.find(e => e.chapter === ch)?.predicted || 0.5);
    
    const reasoning = sequence.map((ch, i) => {
      const chapterEngagement = engagement.find(e => e.chapter === ch);
      return `Chapter ${ch}: Expected engagement ${(expectedEngagement[i] * 100).toFixed(0)}% - ${(chapterEngagement?.factors.join(', ') || 'steady progression')}`;
    });

    return {
      sequence,
      expectedEngagement,
      reasoning
    };
  }
}

export default PredictiveArcModeling;