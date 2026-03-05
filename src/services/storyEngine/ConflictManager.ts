/**
 * ConflictManager - Manages layered conflicts in the narrative
 * 
 * Handles three types of conflicts:
 * 1. External - Physical threats, enemies, environmental dangers
 * 2. Internal - Emotional struggles, moral dilemmas, character growth
 * 3. Interpersonal - Relationships, trust, social dynamics
 * 
 * Ensures every scene has meaningful tension and stakes.
 */

export interface Conflict {
  id: string;
  type: 'external' | 'internal' | 'interpersonal';
  category: string;
  description: string;
  intensity: number; // 1-10
  status: 'building' | 'active' | 'escalating' | 'resolving' | 'resolved';
  involvedCharacters: string[];
  chapterIntroduced: number;
  chapterResolved?: number;
  consequences: string[];
  resolutionPath?: string;
  tension: number; // Current tension level
}

export interface SceneConflict {
  primary: Conflict;
  secondary?: Conflict;
  tensionPoints: string[];
  unresolved: string[];
  stakes: string;
}

export interface ConflictLayer {
  external: Conflict[];
  internal: Conflict[];
  interpersonal: Conflict[];
}

export class ConflictManager {
  private conflicts: Map<string, Conflict> = new Map();
  private currentChapter: number = 1;
  private conflictHistory: Conflict[][] = [];

  constructor() {
    this.initializeCoreConflicts();
  }

  /**
   * Initialize core story conflicts
   */
  private initializeCoreConflicts(): void {
    // External Conflicts
    this.addConflict({
      id: 'eclipsis_survival',
      type: 'external',
      category: 'survival',
      description: 'Survive the dangerous VR world of Eclipsis',
      intensity: 8,
      status: 'active',
      involvedCharacters: ['Kael'],
      chapterIntroduced: 1,
      consequences: ['Death means permanent stat loss', 'Failure affects real world'],
      tension: 7,
    });

    this.addConflict({
      id: 'yuna_illness',
      type: 'external',
      category: 'family',
      description: 'Find a cure for Yuna\'s mysterious illness',
      intensity: 9,
      status: 'active',
      involvedCharacters: ['Kael', 'Yuna'],
      chapterIntroduced: 1,
      consequences: ['Yuna\'s condition may worsen', 'Limited time to find solution'],
      tension: 8,
    });

    // Internal Conflicts
    this.addConflict({
      id: 'kael_identity',
      type: 'internal',
      category: 'identity',
      description: 'Kael struggles with his Progenitor identity and responsibilities',
      intensity: 7,
      status: 'building',
      involvedCharacters: ['Kael'],
      chapterIntroduced: 1,
      consequences: ['Affects decision-making', 'Influences relationships'],
      tension: 5,
    });

    this.addConflict({
      id: 'dual_existence',
      type: 'internal',
      category: 'psychological',
      description: 'Balancing life between VR and reality, questioning what\'s real',
      intensity: 6,
      status: 'active',
      involvedCharacters: ['Kael'],
      chapterIntroduced: 2,
      consequences: ['Mental strain', 'Sync level effects'],
      tension: 5,
    });

    // Interpersonal Conflicts
    this.addConflict({
      id: 'kael_alex_trust',
      type: 'interpersonal',
      category: 'friendship',
      description: 'Maintaining trust with Alex while hiding the truth about Eclipsis',
      intensity: 5,
      status: 'building',
      involvedCharacters: ['Kael', 'Alex'],
      chapterIntroduced: 2,
      consequences: ['Strained friendship', 'Potential betrayal'],
      tension: 4,
    });

    this.addConflict({
      id: 'vampire_politics',
      type: 'interpersonal',
      category: 'political',
      description: 'Navigating vampire clan politics while hiding Progenitor status',
      intensity: 6,
      status: 'active',
      involvedCharacters: ['Kael', 'Elder Dracul'],
      chapterIntroduced: 5,
      consequences: ['Potential allies or enemies', 'Information leaks'],
      tension: 6,
    });
  }

  /**
   * Add a new conflict
   */
  addConflict(conflict: Conflict): void {
    this.conflicts.set(conflict.id, conflict);
  }

  /**
   * Get conflict by ID
   */
  getConflict(id: string): Conflict | undefined {
    return this.conflicts.get(id);
  }

  /**
   * Get all active conflicts
   */
  getActiveConflicts(): ConflictLayer {
    const layer: ConflictLayer = {
      external: [],
      internal: [],
      interpersonal: [],
    };

    this.conflicts.forEach((conflict) => {
      if (conflict.status !== 'resolved') {
        layer[conflict.type].push(conflict);
      }
    });

    return layer;
  }

  /**
   * Generate conflict set for current scene/chapter
   */
  generateSceneConflicts(context: {
    chapterNumber: number;
    world: 'real' | 'vr';
    characters: string[];
    intensity: 'low' | 'medium' | 'high';
  }): SceneConflict {
    const activeConflicts = this.getActiveConflicts();
    const availableConflicts: Conflict[] = [];

    // Collect relevant conflicts
    [...activeConflicts.external, ...activeConflicts.internal, ...activeConflicts.interpersonal]
      .forEach((conflict) => {
        // Check if any involved characters are in the scene
        const hasCharacter = conflict.involvedCharacters.some((c) =>
          context.characters.includes(c)
        );
        
        // VR conflicts are more relevant in VR world
        const isWorldRelevant =
          conflict.type === 'internal' ||
          (context.world === 'vr' && conflict.id.includes('eclipsis')) ||
          (context.world === 'real' && conflict.id.includes('yuna'));

        if (hasCharacter || isWorldRelevant) {
          availableConflicts.push(conflict);
        }
      });

    // Sort by intensity
    availableConflicts.sort((a, b) => b.intensity - a.intensity);

    // Select primary and secondary conflicts based on intensity setting
    const intensityThreshold = context.intensity === 'high' ? 7 : context.intensity === 'medium' ? 5 : 3;
    const highIntensityConflicts = availableConflicts.filter((c) => c.intensity >= intensityThreshold);

    const primary = highIntensityConflicts[0] || availableConflicts[0];
    const secondary = availableConflicts.find((c) => c.id !== primary?.id && c.type !== primary?.type);

    // Generate tension points
    const tensionPoints = this.generateTensionPoints(primary, context);
    const unresolved = this.getUnresolvedElements(primary);

    return {
      primary: primary || this.createDefaultConflict(context),
      secondary,
      tensionPoints,
      unresolved,
      stakes: this.calculateStakes(primary, context),
    };
  }

  /**
   * Generate tension points for a conflict
   */
  private generateTensionPoints(conflict: Conflict | undefined, context: { world: 'real' | 'vr'; intensity: string }): string[] {
    if (!conflict) return [];

    const points: string[] = [];

    switch (conflict.type) {
      case 'external':
        if (conflict.category === 'survival') {
          points.push('The environment shifts unpredictably');
          points.push('A new threat emerges from the shadows');
          points.push('Resources or time are running out');
        } else if (conflict.category === 'family') {
          points.push('Hope seems distant, but not impossible');
          points.push('New information changes the stakes');
          points.push('The weight of responsibility grows heavier');
        }
        break;

      case 'internal':
        if (conflict.category === 'identity') {
          points.push('Questions about purpose and destiny arise');
          points.push('Past decisions haunt the present');
          points.push('The weight of expectations becomes overwhelming');
        } else if (conflict.category === 'psychological') {
          points.push('Reality blurs at the edges');
          points.push('Doubts creep in about what\'s real');
          points.push('The cost of power becomes clearer');
        }
        break;

      case 'interpersonal':
        if (conflict.category === 'friendship') {
          points.push('Trust is tested by secrets');
          points.push('Words are weighed carefully, but meanings are unclear');
          points.push('The distance between friends grows');
        } else if (conflict.category === 'political') {
          points.push('Hidden agendas lurk behind friendly faces');
          points.push('A wrong move could mean betrayal');
          points.push('Alliances shift like sand');
        }
        break;
    }

    return points.slice(0, context.intensity === 'high' ? 3 : context.intensity === 'medium' ? 2 : 1);
  }

  /**
   * Get unresolved elements of a conflict
   */
  private getUnresolvedElements(conflict: Conflict | undefined): string[] {
    if (!conflict) return [];

    return conflict.consequences.filter(() => Math.random() > 0.5);
  }

  /**
   * Calculate stakes for a scene
   */
  private calculateStakes(conflict: Conflict | undefined, context: { chapterNumber: number }): string {
    if (!conflict) return 'The outcome matters.';

    const stakesTemplates = {
      external: [
        'Failure could mean death—or worse, losing everything.',
        'The danger is real, and the consequences are permanent.',
        'Survival isn\'t guaranteed, and retreat isn\'t an option.',
      ],
      internal: [
        'The real battle is within, and the cost of losing is the self.',
        'Every choice shapes who Kael becomes.',
        'The weight of the decision could break or forge him.',
      ],
      interpersonal: [
        'Trust, once broken, may never fully heal.',
        'Relationships hang in the balance.',
        'The wrong words could change everything between them.',
      ],
    };

    const templates = stakesTemplates[conflict.type];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Create a default conflict when none are available
   */
  private createDefaultConflict(context: { chapterNumber: number; world: 'real' | 'vr' }): Conflict {
    return {
      id: 'default_tension',
      type: 'external',
      category: 'general',
      description: 'An unexpected challenge arises',
      intensity: 5,
      status: 'active',
      involvedCharacters: ['Kael'],
      chapterIntroduced: context.chapterNumber,
      consequences: ['The situation requires attention'],
      tension: 5,
    };
  }

  /**
   * Escalate a conflict
   */
  escalateConflict(conflictId: string): Conflict | null {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) return null;

    if (conflict.status === 'building') {
      conflict.status = 'active';
    } else if (conflict.status === 'active') {
      conflict.status = 'escalating';
      conflict.intensity = Math.min(10, conflict.intensity + 1);
      conflict.tension = Math.min(10, conflict.tension + 2);
    }

    return conflict;
  }

  /**
   * Resolve a conflict
   */
  resolveConflict(conflictId: string, resolution: string, chapter: number): Conflict | null {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) return null;

    conflict.status = 'resolved';
    conflict.resolutionPath = resolution;
    conflict.chapterResolved = chapter;
    conflict.tension = 0;

    // Record in history
    this.conflictHistory.push([conflict]);

    return conflict;
  }

  /**
   * Update conflict based on chapter events
   */
  updateConflictForChapter(conflictId: string, event: string): void {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) return;

    // Add event to consequences
    if (!conflict.consequences.includes(event)) {
      conflict.consequences.push(event);
    }

    // Adjust tension based on event
    if (event.includes('success') || event.includes('victory')) {
      conflict.tension = Math.max(1, conflict.tension - 1);
    } else if (event.includes('failure') || event.includes('defeat')) {
      conflict.tension = Math.min(10, conflict.tension + 1);
    }
  }

  /**
   * Generate conflict description for narrative
   */
  generateConflictNarrative(conflict: Conflict): string {
    const typeDescriptions = {
      external: 'The world itself seems to conspire against success.',
      internal: 'The battle within rages as fiercely as any external threat.',
      interpersonal: 'The complexity of human connection creates its own challenges.',
    };

    return `${conflict.description}. ${typeDescriptions[conflict.type]} ` +
           `Intensity: ${conflict.intensity}/10. Status: ${conflict.status}.`;
  }

  /**
   * Get conflict tension level for pacing
   */
  getOverallTension(): number {
    const activeConflicts = this.getActiveConflicts();
    let totalTension = 0;
    let count = 0;

    [activeConflicts.external, activeConflicts.internal, activeConflicts.interpersonal]
      .forEach((conflicts) => {
        conflicts.forEach((c) => {
          totalTension += c.tension;
          count++;
        });
      });

    return count > 0 ? Math.round(totalTension / count) : 0;
  }

  /**
   * Check if any conflict needs resolution
   */
  getConflictsNeedingResolution(): Conflict[] {
    const needsResolution: Conflict[] = [];

    this.conflicts.forEach((conflict) => {
      if (conflict.status === 'escalating' && conflict.tension >= 8) {
        needsResolution.push(conflict);
      }
    });

    return needsResolution;
  }

  /**
   * Export conflict state
   */
  exportState(): any {
    return {
      conflicts: Array.from(this.conflicts.entries()),
      history: this.conflictHistory,
    };
  }

  /**
   * Import conflict state
   */
  importState(state: any): void {
    if (state.conflicts) {
      this.conflicts = new Map(state.conflicts);
    }
    if (state.history) {
      this.conflictHistory = state.history;
    }
  }
}

export default ConflictManager;