/**
 * Narrative Logic & Flow Control System
 * Manages story structure, pacing, and narrative coherence
 */

import type { Chapter, Character } from '../../types';

export interface NarrativeArc {
  type: 'setup' | 'rising_action' | 'climax' | 'falling_action' | 'resolution';
  intensity: number;
  purpose: string;
  emotionalWeight: number;
}

export interface ScenePurpose {
  primary: string;
  secondary: string[];
  conflictLevel: number;
  characterDevelopment: string[];
  plotAdvancement: number; // 0-100
  emotionalStakes: number; // 0-100
}

export class NarrativeLogic {
  private currentArc: NarrativeArc;
  private sceneHistory: ScenePurpose[];
  private foreshadowingQueue: Map<string, number>; // event -> chapter number
  private payoffQueue: Map<string, boolean>; // event -> paid off

  constructor() {
    this.currentArc = {
      type: 'setup',
      intensity: 3,
      purpose: 'Establish protagonist and initial conflict',
      emotionalWeight: 2,
    };
    this.sceneHistory = [];
    this.foreshadowingQueue = new Map();
    this.payoffQueue = new Map();
  }

  /**
   * Determine the current narrative arc based on chapter number and story state
   */
  determineNarrativeArc(chapterNumber: number, totalChapters: number = 100): NarrativeArc {
    const progress = chapterNumber / totalChapters;

    if (progress < 0.1) {
      return {
        type: 'setup',
        intensity: 3,
        purpose: 'Establish world, characters, and initial conflict',
        emotionalWeight: 2,
      };
    } else if (progress < 0.5) {
      return {
        type: 'rising_action',
        intensity: Math.min(8, 3 + progress * 10),
        purpose: 'Build tension, develop conflicts, introduce complications',
        emotionalWeight: 4 + progress * 6,
      };
    } else if (progress < 0.7) {
      return {
        type: 'climax',
        intensity: 9 + Math.random() * 1,
        purpose: 'Confront central conflict, highest tension point',
        emotionalWeight: 9 + Math.random(),
      };
    } else if (progress < 0.9) {
      return {
        type: 'falling_action',
        intensity: Math.max(3, 8 - (progress - 0.7) * 25),
        purpose: 'Resolve conflicts, show consequences',
        emotionalWeight: Math.max(3, 9 - (progress - 0.7) * 30),
      };
    } else {
      return {
        type: 'resolution',
        intensity: 2,
        purpose: 'Provide closure, show transformed world',
        emotionalWeight: 4,
      };
    }
  }

  /**
   * Determine the purpose of the current scene
   */
  determineScenePurpose(
    chapterNumber: number,
    sceneIndex: number,
    totalScenes: number,
    characters: Character[]
  ): ScenePurpose {
    const arc = this.determineNarrativeArc(chapterNumber);
    const primaryPurposes = {
      setup: ['introduce character', 'establish setting', 'plant inciting incident', 'reveal motivation'],
      rising_action: ['escalate conflict', 'develop character', 'reveal information', 'raise stakes'],
      climax: ['confront antagonist', 'make crucial choice', 'reveal truth', 'achieve transformation'],
      falling_action: ['resolve subplots', 'show consequences', 'character reflection', 'tie loose ends'],
      resolution: ['provide closure', 'show growth', 'establish new normal', ' thematic resolution'],
    };

    const primary = primaryPurposes[arc.type][Math.floor(Math.random() * primaryPurposes[arc.type].length)];
    const secondary = this.generateSecondaryPurposes(arc.type, characters);

    return {
      primary,
      secondary,
      conflictLevel: arc.intensity,
      characterDevelopment: characters
        .filter(c => Math.random() > 0.3)
        .map(c => `${c.name}: ${this.selectDevelopmentFocus(c)}`),
      plotAdvancement: Math.min(100, arc.intensity * 10 + Math.random() * 20),
      emotionalStakes: Math.min(100, arc.emotionalWeight * 10),
    };
  }

  /**
   * Generate secondary purposes for a scene
   */
  private generateSecondaryPurposes(arcType: string, characters: Character[]): string[] {
    const purposes = [
      'build tension',
      'establish mood',
      'reveal backstory',
      'advance subplot',
      'develop relationship',
      'foreshadow future',
      'create contrast',
      'deepen theme',
    ];

    const selected: string[] = [];
    const count = 1 + Math.floor(Math.random() * 2);

    for (let i = 0; i < count; i++) {
      const purpose = purposes[Math.floor(Math.random() * purposes.length)];
      if (!selected.includes(purpose)) {
        selected.push(purpose);
      }
    }

    return selected;
  }

  /**
   * Select character development focus
   */
  private selectDevelopmentFocus(character: Character): string {
    const focuses = [
      'internal conflict',
      'relationship growth',
      'skill mastery',
      'moral choice',
      'emotional breakthrough',
      'personal sacrifice',
      'hidden depth',
      'overcoming fear',
    ];

    return focuses[Math.floor(Math.random() * focuses.length)];
  }

  /**
   * Add foreshadowing element
   */
  addForeshadowing(event: string, payoffChapter: number): void {
    this.foreshadowingQueue.set(event, payoffChapter);
  }

  /**
   * Check if any foreshadowing should be paid off
   */
  getPayoffEvents(currentChapter: number): string[] {
    const payoffs: string[] = [];

    for (const [event, chapter] of this.foreshadowingQueue.entries()) {
      if (chapter <= currentChapter && !this.payoffQueue.get(event)) {
        payoffs.push(event);
        this.payoffQueue.set(event, true);
      }
    }

    return payoffs;
  }

  /**
   * Add micro-tension to scene
   */
  addMicroTension(baseContent: string, tensionLevel: number): string {
    const tensionElements = [
      'time pressure',
      'uncertain outcome',
      'conflicting goals',
      'hidden information',
      'moral dilemma',
      'personal stakes',
      'resource scarcity',
    ];

    if (tensionLevel > 5) {
      const element = tensionElements[Math.floor(Math.random() * tensionElements.length)];
      return `${baseContent}\n\nMicro-tension: The situation is complicated by ${element}, raising the stakes.`;
    }

    return baseContent;
  }

  /**
   * Generate scene structure
   */
  generateSceneStructure(purpose: ScenePurpose): string[] {
    const structure = [];

    // Opening
    structure.push({
      type: 'opening',
      description: 'Establish scene setting and immediate situation',
      length: 'short-medium',
    });

    // Rising action
    if (purpose.conflictLevel > 3) {
      structure.push({
        type: 'rising_action',
        description: 'Build toward conflict or revelation',
        length: 'medium',
      });
    }

    // Turn point / conflict
    structure.push({
      type: 'turn_point',
      description: purpose.primary,
      length: 'medium',
    });

    // Reaction / consequence
    if (purpose.emotionalStakes > 5) {
      structure.push({
        type: 'reaction',
        description: 'Character response to turn point',
        length: 'short-medium',
      });
    }

    // Closing / hook
    structure.push({
      type: 'closing',
      description: 'Scene resolution with forward momentum',
      length: 'short',
    });

    return structure.map(s => `[${s.type}: ${s.description}]`);
  }

  /**
   * Evaluate narrative momentum
   */
  evaluateNarrativeomentum(scenes: ScenePurpose[]): number {
    if (scenes.length === 0) return 0;

    let momentum = 0;
    let previousAdvancement = 50;

    for (const scene of scenes) {
      const advancementChange = scene.plotAdvancement - previousAdvancement;
      momentum += advancementChange * 0.1;
      previousAdvancement = scene.plotAdvancement;
    }

    return Math.min(100, Math.max(0, momentum * 10 + 50));
  }

  /**
   * Generate chapter arc structure
   */
  generateChapterArc(sceneCount: number, arcType: string): { [key: number]: string } {
    const arc: { [key: number]: string } = {};

    switch (arcType) {
      case 'setup':
        arc[0] = 'hook';
        arc[sceneCount - 1] = 'initial_conflict';
        break;
      case 'rising_action':
        arc[0] = 'midpoint_start';
        arc[Math.floor(sceneCount / 2)] = 'complication';
        arc[sceneCount - 1] = 'escalation';
        break;
      case 'climax':
        arc[0] = 'buildup';
        arc[Math.floor(sceneCount / 2)] = 'confrontation';
        arc[sceneCount - 1] = 'turning_point';
        break;
      case 'falling_action':
        arc[0] = 'aftermath';
        arc[sceneCount - 1] = 'resolution_begin';
        break;
      case 'resolution':
        arc[0] = 'closure';
        arc[sceneCount - 1] = 'new_state';
        break;
    }

    return arc;
  }

  /**
   * Get scene history for analysis
   */
  getSceneHistory(): ScenePurpose[] {
    return [...this.sceneHistory];
  }

  /**
   * Update narrative arc
   */
  updateNarrativeArc(arc: NarrativeArc): void {
    this.currentArc = arc;
  }

  /**
   * Get current arc
   */
  getCurrentArc(): NarrativeArc {
    return { ...this.currentArc };
  }
}

export default NarrativeLogic;