/**
 * RealityBreachLogicFramework - Meta-Narrative Breach System
 * 
 * Manages meta-narrative breaches and reality distortions:
 * - Detects and manages reality breaks
 * - Controls narrative paradoxes
 * - Manages fourth-wall interactions
 * - Handles dimension/world crossing
 * - Tracks narrative consistency violations
 */

import type { Chapter, StoryState } from '../types';
import type { StoryGenerationOptions } from '../types';

interface RealityBreach {
  id: string;
  type: BreachType;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  location: string;
  chapter: number;
  description: string;
  consequences: string[];
  resolution: Resolution | null;
  status: 'active' | 'contained' | 'resolved' | 'spreading';
  impactRadius: number;
  affectedElements: string[];
  probability: number;
}

type BreachType = 
  | 'fourth_wall_break'
  | 'timeline_paradox'
  | 'dimensional_rift'
  | 'narrative_discontinuity'
  | 'character_violation'
  | 'causality_break'
  | 'memory_inconsistency'
  | 'plot_contradiction'
  | 'genre_bleed'
  | 'meta_reference';

interface Resolution {
  method: string;
  chapter: number;
  cost: string;
  sideEffects: string[];
}

interface RealityLayer {
  name: string;
  stability: number;
  permeability: number;
  rules: RealityRule[];
  violations: Violation[];
}

interface RealityRule {
  id: string;
  name: string;
  description: string;
  enforceability: 'strict' | 'flexible' | 'optional';
  violations: number;
  exceptions: string[];
}

interface Violation {
  chapter: number;
  rule: string;
  context: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  resolved: boolean;
}

interface Paradox {
  id: string;
  type: 'bootstrap' | 'predestination' | 'grandfather' | 'ontological';
  description: string;
  involvedEvents: string[];
  resolved: boolean;
  resolutionMethod?: string;
}

interface DimensionalState {
  currentDimension: string;
  accessibleDimensions: string[];
  barriers: DimensionalBarrier[];
  anchors: DimensionalAnchor[];
  crossings: DimensionalCrossing[];
}

interface DimensionalBarrier {
  between: [string, string];
  strength: number;
  permeability: number;
  breaches: number;
}

interface DimensionalAnchor {
  location: string;
  dimension: string;
  stability: number;
  purpose: string;
}

interface DimensionalCrossing {
  from: string;
  to: string;
  method: string;
  chapter: number;
  consequences: string[];
}

interface NarrativeConsistencyReport {
  chapter: number;
  consistencyScore: number;
  breaches: RealityBreach[];
  paradoxes: Paradox[];
  recommendations: string[];
}

export class RealityBreachLogicFramework {
  private breaches: Map<string, RealityBreach> = new Map();
  private layers: Map<string, RealityLayer> = new Map();
  private paradoxes: Paradox[] = [];
  private dimensionalState: DimensionalState;
  private violationHistory: Violation[] = [];
  private currentChapter: number = 0;

  constructor() {
    this.dimensionalState = this.initializeDimensionalState();
    this.initializeRealityLayers();
  }

  /**
   * Initialize dimensional state
   */
  private initializeDimensionalState(): DimensionalState {
    return {
      currentDimension: 'prime',
      accessibleDimensions: ['prime'],
      barriers: [],
      anchors: [],
      crossings: []
    };
  }

  /**
   * Initialize reality layers with rules
   */
  private initializeRealityLayers(): void {
    // Narrative Layer
    this.layers.set('narrative', {
      name: 'Narrative Layer',
      stability: 1.0,
      permeability: 0.1,
      rules: [
        {
          id: 'cause_effect',
          name: 'Cause and Effect',
          description: 'Events must have causes',
          enforceability: 'strict',
          violations: 0,
          exceptions: []
        },
        {
          id: 'character_consistency',
          name: 'Character Consistency',
          description: 'Characters maintain established traits',
          enforceability: 'strict',
          violations: 0,
          exceptions: ['character_development', 'transformation']
        },
        {
          id: 'timeline_continuity',
          name: 'Timeline Continuity',
          description: 'Events occur in logical temporal order',
          enforceability: 'strict',
          violations: 0,
          exceptions: ['flashback', 'prophecy', 'time_travel']
        }
      ],
      violations: []
    });

    // Character Layer
    this.layers.set('character', {
      name: 'Character Layer',
      stability: 1.0,
      permeability: 0.05,
      rules: [
        {
          id: 'memory_continuity',
          name: 'Memory Continuity',
          description: 'Characters remember their experiences',
          enforceability: 'strict',
          violations: 0,
          exceptions: ['amnesia', 'memory_alteration']
        },
        {
          id: 'knowledge_bounds',
          name: 'Knowledge Bounds',
          description: 'Characters only know what they have learned',
          enforceability: 'flexible',
          violations: 0,
          exceptions: ['intuition', 'revelation', 'psychic_ability']
        }
      ],
      violations: []
    });

    // World Layer
    this.layers.set('world', {
      name: 'World Layer',
      stability: 1.0,
      permeability: 0.2,
      rules: [
        {
          id: 'physics_consistency',
          name: 'Physics Consistency',
          description: 'World physics remain consistent',
          enforceability: 'flexible',
          violations: 0,
          exceptions: ['magic', 'supernatural', 'divine_intervention']
        },
        {
          id: 'spatial_logic',
          name: 'Spatial Logic',
          description: 'Locations maintain relative positions',
          enforceability: 'strict',
          violations: 0,
          exceptions: ['teleportation', 'dimensional_shift']
        }
      ],
      violations: []
    });

    // Meta Layer
    this.layers.set('meta', {
      name: 'Meta Layer',
      stability: 1.0,
      permeability: 0.0,
      rules: [
        {
          id: 'fourth_wall',
          name: 'Fourth Wall',
          description: 'Characters do not acknowledge they are in a story',
          enforceability: 'strict',
          violations: 0,
          exceptions: ['meta_fiction', 'comedy', 'breaking_character']
        }
      ],
      violations: []
    });
  }

  /**
   * Scan chapter for reality breaches
   */
  async scanChapter(
    chapter: Chapter,
    previousChapters: Chapter[],
    storyState: StoryState
  ): Promise<NarrativeConsistencyReport> {
    this.currentChapter = chapter.chapterNumber;

    const breaches: RealityBreach[] = [];
    const paradoxes: Paradox[] = [];

    // Scan for fourth wall breaks
    const fourthWallBreaches = this.detectFourthWallBreaks(chapter);
    breaches.push(...fourthWallBreaches);

    // Scan for timeline paradoxes
    const timelineParadoxes = this.detectTimelineParadoxes(chapter, previousChapters);
    paradoxes.push(...timelineParadoxes);

    // Scan for character violations
    const characterBreaches = this.detectCharacterViolations(chapter, previousChapters);
    breaches.push(...characterBreaches);

    // Scan for causality breaks
    const causalityBreaches = this.detectCausalityBreaks(chapter, previousChapters);
    breaches.push(...causalityBreaches);

    // Scan for dimensional inconsistencies
    const dimensionalBreaches = this.detectDimensionalInconsistencies(chapter);
    breaches.push(...dimensionalBreaches);

    // Update layer stability
    this.updateLayerStability(breaches);

    // Store breaches
    for (const breach of breaches) {
      this.breaches.set(breach.id, breach);
    }

    // Store paradoxes
    this.paradoxes.push(...paradoxes);

    // Calculate consistency score
    const consistencyScore = this.calculateConsistencyScore(breaches, paradoxes);

    // Generate recommendations
    const recommendations = this.generateRecommendations(breaches, paradoxes);

    return {
      chapter: chapter.chapterNumber,
      consistencyScore,
      breaches,
      paradoxes,
      recommendations
    };
  }

  /**
   * Detect fourth wall breaks
   */
  private detectFourthWallBreaks(chapter: Chapter): RealityBreach[] {
    const breaches: RealityBreach[] = [];
    const content = chapter.content.toLowerCase();

    // Check for meta references
    const metaPatterns = [
      /in (?:this|the) (?:story|book|novel|tale)/gi,
      /as (?:the|a) (?:reader|audience|viewer)/gi,
      /author|writer|narrator/gi,
      /breaking (?:the )?(?:fourth wall|character)/gi,
      /in (?:real )?life/gi,
      /this (?:chapter|scene|part)/gi
    ];

    for (const pattern of metaPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        for (const match of matches) {
          breaches.push({
            id: `fourth_wall_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'fourth_wall_break',
            severity: 'minor',
            location: `Chapter ${chapter.chapterNumber}`,
            chapter: chapter.chapterNumber,
            description: `Fourth wall break detected: "${match}"`,
            consequences: ['Reduced narrative immersion', 'Meta-narrative awareness'],
            resolution: null,
            status: 'active',
            impactRadius: 0.2,
            affectedElements: ['narrative_layer'],
            probability: 0.9
          });
        }
      }
    }

    return breaches;
  }

  /**
   * Detect timeline paradoxes
   */
  private detectTimelineParadoxes(chapter: Chapter, previousChapters: Chapter[]): Paradox[] {
    const paradoxes: Paradox[] = [];
    const content = chapter.content.toLowerCase();

    // Look for temporal inconsistencies
    const temporalPatterns = [
      /already (?:did|done|happened)/gi,
      /before (?:this|now|today)/gi,
      /after (?:yesterday|the future|tomorrow)/gi,
      /going to have (?:been|done)/gi
    ];

    // Check for time travel references
    if (/time travel|temporal|timeline|paradox/gi.test(content)) {
      // Analyze for bootstrap paradoxes
      if (/always knew|destiny|fate|prophecy/gi.test(content)) {
        paradoxes.push({
          id: `paradox_${Date.now()}_bootstrap`,
          type: 'bootstrap',
          description: 'Potential bootstrap paradox: character possesses knowledge they could not have obtained',
          involvedEvents: [`Chapter ${chapter.chapterNumber}`],
          resolved: false
        });
      }

      // Analyze for predestination paradoxes
      if (/must happen|cannot change|destined|inevitable/gi.test(content)) {
        paradoxes.push({
          id: `paradox_${Date.now()}_predestination`,
          type: 'predestination',
          description: 'Potential predestination paradox: events are predetermined',
          involvedEvents: [`Chapter ${chapter.chapterNumber}`],
          resolved: false
        });
      }
    }

    // Check for grandfather paradoxes
    if (/prevent|change|alter|undo/gi.test(content) && /past|history|before/gi.test(content)) {
      paradoxes.push({
        id: `paradox_${Date.now()}_grandfather`,
        type: 'grandfather',
        description: 'Potential grandfather paradox: character may prevent their own existence',
        involvedEvents: [`Chapter ${chapter.chapterNumber}`],
        resolved: false
      });
    }

    return paradoxes;
  }

  /**
   * Detect character violations
   */
  private detectCharacterViolations(chapter: Chapter, previousChapters: Chapter[]): RealityBreach[] {
    const breaches: RealityBreach[] = [];

    // Check for knowledge violations
    // (Character knowing something they couldn't have learned)
    if (previousChapters.length > 0) {
      const knownInfo = previousChapters.map(ch => ch.content).join(' ');
      const currentContent = chapter.content;

      // Simple check: look for "knew" without context
      const knowledgePattern = /(\w+) knew (?:that |about )?(\w+)/gi;
      let match;
      while ((match = knowledgePattern.exec(currentContent)) !== null) {
        const character = match[1];
        const knowledge = match[2];
        
        // Check if this knowledge was previously established
        if (!knownInfo.toLowerCase().includes(knowledge.toLowerCase())) {
          breaches.push({
            id: `knowledge_violation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'memory_inconsistency',
            severity: 'moderate',
            location: `Chapter ${chapter.chapterNumber}`,
            chapter: chapter.chapterNumber,
            description: `${character} knows about ${knowledge} without prior exposure`,
            consequences: ['Knowledge continuity break', 'Reduced trust in narrative'],
            resolution: null,
            status: 'active',
            impactRadius: 0.3,
            affectedElements: ['character_layer'],
            probability: 0.7
          });
        }
      }
    }

    return breaches;
  }

  /**
   * Detect causality breaks
   */
  private detectCausalityBreaks(chapter: Chapter, previousChapters: Chapter[]): RealityBreach[] {
    const breaches: RealityBreach[] = [];
    const content = chapter.content.toLowerCase();

    // Check for cause-effect reversals
    const causalityPatterns = [
      /because.*therefore/gi, // Circular reasoning
      /before.*after/gi, // Temporal confusion
      /consequence.*cause/gi, // Reversed causality
      /result.*reason/gi // Effect before cause
    ];

    for (const pattern of causalityPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        breaches.push({
          id: `causality_break_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'causality_break',
          severity: 'major',
          location: `Chapter ${chapter.chapterNumber}`,
          chapter: chapter.chapterNumber,
          description: `Causality break detected: "${matches[0]}"`,
          consequences: ['Logical inconsistency', 'Reader confusion'],
          resolution: null,
          status: 'active',
          impactRadius: 0.4,
          affectedElements: ['narrative_layer'],
          probability: 0.8
        });
      }
    }

    // Check for events without causes
    const eventWords = ['suddenly', 'without warning', 'inexplicably', 'mysteriously'];
    for (const word of eventWords) {
      if (content.includes(word)) {
        // Check if explanation follows
        const index = content.indexOf(word);
        const followingContext = content.substring(index, Math.min(index + 200, content.length));
        
        if (!followingContext.includes('because') && !followingContext.includes('due to') && !followingContext.includes('caused by')) {
          breaches.push({
            id: `unexplained_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'causality_break',
            severity: 'minor',
            location: `Chapter ${chapter.chapterNumber}`,
            chapter: chapter.chapterNumber,
            description: `Unexplained event: "${word}"`,
            consequences: ['Potential plot hole', 'Reader confusion'],
            resolution: null,
            status: 'active',
            impactRadius: 0.2,
            affectedElements: ['narrative_layer'],
            probability: 0.6
          });
        }
      }
    }

    return breaches;
  }

  /**
   * Detect dimensional inconsistencies
   */
  private detectDimensionalInconsistencies(chapter: Chapter): RealityBreach[] {
    const breaches: RealityBreach[] = [];
    const content = chapter.content.toLowerCase();

    // Check for dimension/world shifts
    const dimensionPatterns = [
      /different (?:world|dimension|realm|reality)/gi,
      /parallel (?:universe|world|timeline)/gi,
      /another (?:place|world|reality)/gi,
      /cross(?:ed|ing) (?:over|into|through)/gi
    ];

    for (const pattern of dimensionPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        // Check if dimensional crossing is properly established
        if (!this.dimensionalState.accessibleDimensions.includes('alternate')) {
          breaches.push({
            id: `dimensional_breach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'dimensional_rift',
            severity: 'major',
            location: `Chapter ${chapter.chapterNumber}`,
            chapter: chapter.chapterNumber,
            description: `Dimensional shift without established pathway: "${matches[0]}"`,
            consequences: ['Reality destabilization', 'Narrative confusion'],
            resolution: null,
            status: 'active',
            impactRadius: 0.5,
            affectedElements: ['world_layer', 'narrative_layer'],
            probability: 0.7
          });
        }
      }
    }

    return breaches;
  }

  /**
   * Update layer stability based on breaches
   */
  private updateLayerStability(breaches: RealityBreach[]): void {
    for (const breach of breaches) {
      for (const element of breach.affectedElements) {
        const layer = this.layers.get(element.replace('_layer', ''));
        if (layer) {
          layer.stability -= breach.impactRadius * this.getSeverityMultiplier(breach.severity);
          layer.stability = Math.max(0, layer.stability);

          // Add violation
          layer.violations.push({
            chapter: breach.chapter,
            rule: 'stability',
            context: breach.description,
            severity: breach.severity,
            resolved: false
          });
        }
      }
    }
  }

  /**
   * Get severity multiplier
   */
  private getSeverityMultiplier(severity: RealityBreach['severity']): number {
    const multipliers = {
      minor: 0.1,
      moderate: 0.2,
      major: 0.3,
      critical: 0.5
    };
    return multipliers[severity];
  }

  /**
   * Calculate consistency score
   */
  private calculateConsistencyScore(breaches: RealityBreach[], paradoxes: Paradox[]): number {
    let score = 100;

    // Deduct for breaches
    for (const breach of breaches) {
      const deduction = this.getSeverityMultiplier(breach.severity) * 20;
      score -= deduction;
    }

    // Deduct for paradoxes
    for (const paradox of paradoxes) {
      if (!paradox.resolved) {
        score -= 10;
      }
    }

    return Math.max(0, score);
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(breaches: RealityBreach[], paradoxes: Paradox[]): string[] {
    const recommendations: string[] = [];

    for (const breach of breaches) {
      switch (breach.type) {
        case 'fourth_wall_break':
          recommendations.push('Consider if meta-commentary serves the narrative purpose');
          break;
        case 'causality_break':
          recommendations.push('Add cause or explanation for sudden events');
          break;
        case 'memory_inconsistency':
          recommendations.push('Establish how character gained knowledge');
          break;
        case 'dimensional_rift':
          recommendations.push('Establish dimensional crossing mechanism');
          break;
        default:
          recommendations.push('Review and address narrative inconsistency');
      }
    }

    for (const paradox of paradoxes) {
      if (!paradox.resolved) {
        recommendations.push(`Address ${paradox.type} paradox in future chapters`);
      }
    }

    return [...new Set(recommendations)];
  }

  /**
   * Resolve a breach
   */
  resolveBreach(breachId: string, method: string): { success: boolean; resolution: Resolution | null } {
    const breach = this.breaches.get(breachId);
    if (!breach) {
      return { success: false, resolution: null };
    }

    const resolution: Resolution = {
      method,
      chapter: this.currentChapter,
      cost: this.calculateResolutionCost(breach),
      sideEffects: this.generateSideEffects(breach)
    };

    breach.resolution = resolution;
    breach.status = 'resolved';

    // Update affected layer stability
    for (const element of breach.affectedElements) {
      const layer = this.layers.get(element.replace('_layer', ''));
      if (layer) {
        layer.stability = Math.min(1, layer.stability + 0.1);
      }
    }

    return { success: true, resolution };
  }

  /**
   * Calculate resolution cost
   */
  private calculateResolutionCost(breach: RealityBreach): string {
    const costs: Record<RealityBreach['severity'], string[]> = {
      minor: ['Minor narrative adjustment', 'Brief explanation'],
      moderate: ['Character reflection', 'Plot modification'],
      major: ['Major revision', 'Character development arc'],
      critical: ['Story restructuring', 'Multiple chapter edits']
    };

    return costs[breach.severity][Math.floor(Math.random() * costs[breach.severity].length)];
  }

  /**
   * Generate side effects
   */
  private generateSideEffects(breach: RealityBreach): string[] {
    const sideEffects: string[] = [];

    switch (breach.type) {
      case 'fourth_wall_break':
        sideEffects.push('Increased reader self-awareness');
        break;
      case 'timeline_paradox':
        sideEffects.push('Temporal echo effect');
        break;
      case 'dimensional_rift':
        sideEffects.push('Dimensional bleeding');
        break;
      default:
        sideEffects.push('Minor reality fluctuations');
    }

    return sideEffects;
  }

  /**
   * Get all breaches
   */
  getBreaches(): RealityBreach[] {
    return Array.from(this.breaches.values());
  }

  /**
   * Get active breaches
   */
  getActiveBreaches(): RealityBreach[] {
    return Array.from(this.breaches.values()).filter(b => b.status === 'active');
  }

  /**
   * Get paradoxes
   */
  getParadoxes(): Paradox[] {
    return [...this.paradoxes];
  }

  /**
   * Get layer status
   */
  getLayerStatus(): Map<string, RealityLayer> {
    return new Map(this.layers);
  }

  /**
   * Get dimensional state
   */
  getDimensionalState(): DimensionalState {
    return { ...this.dimensionalState };
  }

  /**
   * Export framework state
   */
  exportState(): {
    breaches: RealityBreach[];
    paradoxes: Paradox[];
    layers: Array<{ name: string; layer: RealityLayer }>;
    dimensionalState: DimensionalState;
  } {
    return {
      breaches: Array.from(this.breaches.values()),
      paradoxes: this.paradoxes,
      layers: Array.from(this.layers.entries()).map(([name, layer]) => ({ name, layer })),
      dimensionalState: this.dimensionalState
    };
  }

  /**
   * Reset framework
   */
  reset(): void {
    this.breaches.clear();
    this.paradoxes = [];
    this.violationHistory = [];
    this.dimensionalState = this.initializeDimensionalState();
    this.initializeRealityLayers();
    this.currentChapter = 0;
  }
}