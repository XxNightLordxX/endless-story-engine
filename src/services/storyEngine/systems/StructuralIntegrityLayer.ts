/**
 * StructuralIntegrityLayer - Plot Consistency System
 * 
 * Ensures plot consistency and structural integrity:
 * - Monitors plot structure and coherence
 * - Tracks plot threads and their resolution
 * - Detects structural weaknesses
 * - Maintains narrative architecture
 * - Validates story structure against established patterns
 */

import type { Chapter, StoryState } from '../types';
import type { StoryGenerationOptions } from '../types';

interface PlotStructure {
  type: StructureType;
  acts: Act[];
  plotPoints: PlotPoint[];
  threads: PlotThread[];
  hooks: Hook[];
  payoffs: Payoff[];
  structureScore: number;
}

type StructureType = 
  | 'three_act'
  | 'five_act'
  | 'hero_journey'
  | 'save_the_cat'
  | 'seven_point'
  | 'kishoutenketsu'
  | 'freytag_pyramid'
  | 'fichtean_curve';

interface Act {
  number: number;
  name: string;
  startChapter: number;
  endChapter: number | null;
  purpose: string;
  keyEvents: string[];
  completionPercentage: number;
}

interface PlotPoint {
  id: string;
  name: string;
  type: 'inciting_incident' | 'rising_action' | 'midpoint' | 'climax' | 'resolution' | 'twist' | 'revelation';
  chapter: number;
  description: string;
  impact: number;
  setup: string[];
  payoff: string[];
  resolved: boolean;
}

interface PlotThread {
  id: string;
  name: string;
  type: 'main' | 'subplot' | 'character' | 'theme';
  status: 'setup' | 'developing' | 'climax' | 'resolving' | 'resolved' | 'abandoned';
  introducedChapter: number;
  resolvedChapter: number | null;
  importance: number;
  connections: string[];
  events: ThreadEvent[];
}

interface ThreadEvent {
  chapter: number;
  event: string;
  type: 'introduction' | 'development' | 'complication' | 'resolution';
}

interface Hook {
  id: string;
  type: 'question' | 'mystery' | 'conflict' | 'promise' | 'foreshadowing';
  description: string;
  introducedChapter: number;
  resolvedChapter: number | null;
  tension: number;
  payoffId: string | null;
}

interface Payoff {
  id: string;
  hookId: string;
  chapter: number;
  description: string;
  satisfaction: number;
  unexpected: boolean;
}

interface StructuralWeakness {
  type: 'missing_element' | 'underdeveloped' | 'rushed' | 'dragging' | 'unresolved' | 'inconsistent';
  location: { act?: number; chapter?: number };
  description: string;
  severity: 'minor' | 'moderate' | 'major';
  suggestedFix: string;
}

interface StructureTemplate {
  type: StructureType;
  acts: Array<{ number: number; name: string; purpose: string; percentage: number }>;
  requiredElements: string[];
  optionalElements: string[];
  pacingGuidelines: number[];
}

export class StructuralIntegrityLayer {
  private structure: PlotStructure;
  private templates: Map<StructureType, StructureTemplate> = new Map();
  private weaknesses: StructuralWeakness[] = [];
  private currentChapter: number = 0;
  
  // Cross-system reference
  private worldSimulation?: any;

  constructor() {
    this.initializeTemplates();
    this.structure = this.createDefaultStructure('three_act');
  }

  /**
   * Initialize structure templates
   */
  private initializeTemplates(): void {
    // Three Act Structure
    this.templates.set('three_act', {
      type: 'three_act',
      acts: [
        { number: 1, name: 'Setup', purpose: 'Introduce characters, world, and conflict', percentage: 25 },
        { number: 2, name: 'Confrontation', purpose: 'Develop conflict and raise stakes', percentage: 50 },
        { number: 3, name: 'Resolution', purpose: 'Resolve conflict and conclude story', percentage: 25 }
      ],
      requiredElements: ['inciting_incident', 'midpoint', 'climax', 'resolution'],
      optionalElements: ['twist', 'revelation'],
      pacingGuidelines: [0.1, 0.3, 0.5, 0.8, 1.0]
    });

    // Five Act Structure
    this.templates.set('five_act', {
      type: 'five_act',
      acts: [
        { number: 1, name: 'Exposition', purpose: 'Set the scene and introduce characters', percentage: 20 },
        { number: 2, name: 'Rising Action', purpose: 'Introduce conflict and complications', percentage: 20 },
        { number: 3, name: 'Climax', purpose: 'Peak of the conflict', percentage: 20 },
        { number: 4, name: 'Falling Action', purpose: 'Consequences of climax', percentage: 20 },
        { number: 5, name: 'Denouement', purpose: 'Resolution and conclusion', percentage: 20 }
      ],
      requiredElements: ['inciting_incident', 'rising_action', 'climax', 'falling_action', 'resolution'],
      optionalElements: ['twist', 'revelation'],
      pacingGuidelines: [0.1, 0.2, 0.4, 0.6, 0.8, 1.0]
    });

    // Hero's Journey
    this.templates.set('hero_journey', {
      type: 'hero_journey',
      acts: [
        { number: 1, name: 'Departure', purpose: 'Call to adventure and crossing threshold', percentage: 25 },
        { number: 2, name: 'Initiation', purpose: 'Tests, allies, enemies, and ordeal', percentage: 50 },
        { number: 3, name: 'Return', purpose: 'Return with elixir/knowledge', percentage: 25 }
      ],
      requiredElements: ['call_to_adventure', 'crossing_threshold', 'ordeal', 'reward', 'return'],
      optionalElements: ['refusal', 'mentor', 'atonement'],
      pacingGuidelines: [0.05, 0.15, 0.3, 0.5, 0.7, 0.85, 1.0]
    });

    // Save the Cat
    this.templates.set('save_the_cat', {
      type: 'save_the_cat',
      acts: [
        { number: 1, name: 'Opening', purpose: 'Setup and catalyst', percentage: 25 },
        { number: 2, name: 'Middle', purpose: 'Fun and games, bad guys close in', percentage: 50 },
        { number: 3, name: 'Ending', purpose: 'Dark night, finale, final image', percentage: 25 }
      ],
      requiredElements: ['opening_image', 'catalyst', 'break_into_two', 'midpoint', 'all_is_lost', 'break_into_three', 'finale', 'final_image'],
      optionalElements: ['debate', 'b_story', 'dark_night_of_soul'],
      pacingGuidelines: [0.02, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0]
    });

    // Seven Point Story Structure
    this.templates.set('seven_point', {
      type: 'seven_point',
      acts: [
        { number: 1, name: 'Setup', purpose: 'Introduction and hook', percentage: 15 },
        { number: 2, name: 'Reaction', purpose: 'Character reacts to inciting incident', percentage: 25 },
        { number: 3, name: 'Action', purpose: 'Character takes action', percentage: 35 },
        { number: 4, name: 'Resolution', purpose: 'Conclusion', percentage: 25 }
      ],
      requiredElements: ['hook', 'plot_turn_1', 'pinch_1', 'midpoint', 'pinch_2', 'plot_turn_2', 'resolution'],
      optionalElements: [],
      pacingGuidelines: [0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95]
    });
  }

  /**
   * Create default structure
   */
  private createDefaultStructure(type: StructureType): PlotStructure {
    const template = this.templates.get(type) || this.templates.get('three_act')!;

    return {
      type,
      acts: template.acts.map(act => ({
        number: act.number,
        name: act.name,
        startChapter: 1,
        endChapter: null,
        purpose: act.purpose,
        keyEvents: [],
        completionPercentage: 0
      })),
      plotPoints: [],
      threads: [],
      hooks: [],
      payoffs: [],
      structureScore: 100
    };
  }

  /**
   * Analyze chapter for structural integrity
   */
  async analyzeChapter(
    chapter: Chapter,
    previousChapters: Chapter[],
    storyState: StoryState
  ): Promise<{ score: number; weaknesses: StructuralWeakness[] }> {
    this.currentChapter = chapter.chapterNumber;

    // Update structure based on content
    this.updateStructure(chapter, previousChapters);

    // Check for structural weaknesses
    this.detectWeaknesses(chapter, previousChapters);

    // Calculate structure score
    const score = this.calculateStructureScore();

    return {
      score,
      weaknesses: this.weaknesses.filter(w => w.location.chapter === chapter.chapterNumber)
    };
  }

  /**
   * Update structure from chapter content
   */
  private updateStructure(chapter: Chapter, previousChapters: Chapter[]): void {
    // Extract plot points from content
    const plotPoints = this.extractPlotPoints(chapter);
    for (const point of plotPoints) {
      if (!this.structure.plotPoints.find(p => p.name === point.name)) {
        this.structure.plotPoints.push(point);
      }
    }

    // Update act progress
    this.updateActProgress(chapter.chapterNumber);

    // Update thread status
    this.updateThreads(chapter, previousChapters);

    // Check for hooks and payoffs
    this.analyzeHooksAndPayoffs(chapter);
  }

  /**
   * Extract plot points from chapter
   */
  private extractPlotPoints(chapter: Chapter): PlotPoint[] {
    const points: PlotPoint[] = [];
    const content = chapter.content.toLowerCase();

    // Inciting incident indicators
    if (/\b(began|started|changed everything|everything changed|turning point|call to adventure)\b/i.test(content)) {
      points.push({
        id: `inciting_${chapter.chapterNumber}`,
        name: 'Inciting Incident',
        type: 'inciting_incident',
        chapter: chapter.chapterNumber,
        description: 'Events set the main plot in motion',
        impact: 0.8,
        setup: [],
        payoff: [],
        resolved: false
      });
    }

    // Climax indicators
    if (/\b(climax|peak|final confrontation|ultimate battle|showdown)\b/i.test(content)) {
      points.push({
        id: `climax_${chapter.chapterNumber}`,
        name: 'Climax',
        type: 'climax',
        chapter: chapter.chapterNumber,
        description: 'The peak of dramatic tension',
        impact: 1.0,
        setup: [],
        payoff: [],
        resolved: false
      });
    }

    // Midpoint indicators
    if (/\b(midpoint|halfway|turning point|major revelation|everything changes)\b/i.test(content)) {
      points.push({
        id: `midpoint_${chapter.chapterNumber}`,
        name: 'Midpoint',
        type: 'midpoint',
        chapter: chapter.chapterNumber,
        description: 'Major shift in story direction',
        impact: 0.7,
        setup: [],
        payoff: [],
        resolved: false
      });
    }

    // Twist indicators
    if (/\b(twist|unexpected|surprise|shocking|never saw it coming)\b/i.test(content)) {
      points.push({
        id: `twist_${chapter.chapterNumber}`,
        name: 'Plot Twist',
        type: 'twist',
        chapter: chapter.chapterNumber,
        description: 'Unexpected turn of events',
        impact: 0.6,
        setup: [],
        payoff: [],
        resolved: false
      });
    }

    // Revelation indicators
    if (/\b(reveal|revealed|discovered|secret|truth|finally understood)\b/i.test(content)) {
      points.push({
        id: `revelation_${chapter.chapterNumber}`,
        name: 'Revelation',
        type: 'revelation',
        chapter: chapter.chapterNumber,
        description: 'Important truth revealed',
        impact: 0.5,
        setup: [],
        payoff: [],
        resolved: false
      });
    }

    return points;
  }

  /**
   * Update act progress
   */
  private updateActProgress(currentChapter: number): void {
    const template = this.templates.get(this.structure.type);
    if (!template) return;

    let cumulativePercentage = 0;
    for (const act of this.structure.acts) {
      act.startChapter = Math.max(1, Math.floor(cumulativePercentage / 100 * currentChapter));
      cumulativePercentage += template.acts[act.number - 1]?.percentage || 25;
      act.endChapter = Math.floor(cumulativePercentage / 100 * currentChapter);
      
      // Calculate completion
      if (currentChapter >= (act.endChapter || Infinity)) {
        act.completionPercentage = 100;
      } else if (currentChapter >= act.startChapter) {
        const actLength = (act.endChapter || currentChapter) - act.startChapter + 1;
        const progress = currentChapter - act.startChapter + 1;
        act.completionPercentage = Math.floor(progress / actLength * 100);
      }
    }
  }

  /**
   * Update plot threads
   */
  private updateThreads(chapter: Chapter, previousChapters: Chapter[]): void {
    const content = chapter.content;

    // Detect new threads
    const newThreads = this.detectNewThreads(content, chapter.chapterNumber);
    for (const thread of newThreads) {
      if (!this.structure.threads.find(t => t.name === thread.name)) {
        this.structure.threads.push(thread);
      }
    }

    // Update existing threads
    for (const thread of this.structure.threads) {
      if (this.isThreadReferenced(thread, content)) {
        thread.status = this.determineThreadStatus(thread, chapter.chapterNumber);
        thread.events.push({
          chapter: chapter.chapterNumber,
          event: `Thread referenced in chapter ${chapter.chapterNumber}`,
          type: 'development'
        });
      }
    }
  }

  /**
   * Detect new plot threads
   */
  private detectNewThreads(content: string, chapterNumber: number): PlotThread[] {
    const threads: PlotThread[] = [];

    // Main plot indicators
    if (/\b(quest|mission|journey|adventure|goal)\b/i.test(content)) {
      threads.push({
        id: `main_${chapterNumber}`,
        name: 'Main Quest',
        type: 'main',
        status: 'setup',
        introducedChapter: chapterNumber,
        resolvedChapter: null,
        importance: 1.0,
        connections: [],
        events: []
      });
    }

    // Subplot indicators
    if (/\b(subplot|side story|meanwhile|elsewhere)\b/i.test(content)) {
      threads.push({
        id: `subplot_${chapterNumber}`,
        name: 'Subplot',
        type: 'subplot',
        status: 'setup',
        introducedChapter: chapterNumber,
        resolvedChapter: null,
        importance: 0.5,
        connections: [],
        events: []
      });
    }

    return threads;
  }

  /**
   * Check if thread is referenced
   */
  private isThreadReferenced(thread: PlotThread, content: string): boolean {
    const keywords: Record<PlotThread['type'], string[]> = {
      main: ['quest', 'mission', 'journey', 'goal', 'adventure'],
      subplot: ['meanwhile', 'elsewhere', 'subplot', 'side'],
      character: ['said', 'thought', 'felt', 'decided'],
      theme: ['meaning', 'lesson', 'truth', 'moral']
    };

    return keywords[thread.type].some(keyword => 
      content.toLowerCase().includes(keyword)
    );
  }

  /**
   * Determine thread status
   */
  private determineThreadStatus(thread: PlotThread, currentChapter: number): PlotThread['status'] {
    const chaptersSinceIntro = currentChapter - thread.introducedChapter;

    if (chaptersSinceIntro < 3) return 'setup';
    if (chaptersSinceIntro < 10) return 'developing';
    if (chaptersSinceIntro < 15) return 'climax';
    if (chaptersSinceIntro < 20) return 'resolving';
    return 'resolved';
  }

  /**
   * Analyze hooks and payoffs
   */
  private analyzeHooksAndPayoffs(chapter: Chapter): void {
    const content = chapter.content.toLowerCase();

    // Detect hooks (questions, mysteries, promises)
    if (/\b\?/.test(content) || /\b(mystery|secret|question|wonder|curious)\b/i.test(content)) {
      this.structure.hooks.push({
        id: `hook_${Date.now()}`,
        type: 'question',
        description: 'Unanswered question or mystery introduced',
        introducedChapter: chapter.chapterNumber,
        resolvedChapter: null,
        tension: 0.5,
        payoffId: null
      });
    }

    // Detect payoffs (answers, revelations)
    if (/\b(answer|revealed|truth|finally|at last)\b/i.test(content)) {
      const unresolvedHooks = this.structure.hooks.filter(h => !h.payoffId);
      if (unresolvedHooks.length > 0) {
        const hook = unresolvedHooks[0];
        hook.resolvedChapter = chapter.chapterNumber;
        this.structure.payoffs.push({
          id: `payoff_${Date.now()}`,
          hookId: hook.id,
          chapter: chapter.chapterNumber,
          description: 'Hook resolved',
          satisfaction: 0.8,
          unexpected: false
        });
      }
    }
  }

  /**
   * Detect structural weaknesses
   */
  private detectWeaknesses(chapter: Chapter, previousChapters: Chapter[]): void {
    const template = this.templates.get(this.structure.type);
    if (!template) return;

    // Check for missing required elements
    const requiredElements = template.requiredElements;
    const presentElements = this.structure.plotPoints.map(p => p.type);

    for (const required of requiredElements) {
      if (!presentElements.includes(required as PlotPoint['type'])) {
        const expectedChapter = Math.floor(
          previousChapters.length * 
          (template.pacingGuidelines[requiredElements.indexOf(required)] || 0.5)
        );

        if (chapter.chapterNumber > expectedChapter + 5) {
          this.weaknesses.push({
            type: 'missing_element',
            location: { chapter: chapter.chapterNumber },
            description: `Missing required plot element: ${required}`,
            severity: 'major',
            suggestedFix: `Add ${required} in upcoming chapters or revise structure`
          });
        }
      }
    }

    // Check for unresolved threads
    for (const thread of this.structure.threads) {
      if (thread.status === 'developing' && 
          chapter.chapterNumber - thread.introducedChapter > 20) {
        this.weaknesses.push({
          type: 'unresolved',
          location: { chapter: chapter.chapterNumber },
          description: `Thread "${thread.name}" has been developing for too long`,
          severity: 'moderate',
          suggestedFix: 'Advance thread toward climax or resolution'
        });
      }
    }

    // Check for hook/payoff balance
    const unresolvedHooks = this.structure.hooks.filter(h => !h.payoffId);
    if (unresolvedHooks.length > 5) {
      this.weaknesses.push({
        type: 'unresolved',
        location: { chapter: chapter.chapterNumber },
        description: `Too many unresolved hooks (${unresolvedHooks.length})`,
        severity: 'moderate',
        suggestedFix: 'Resolve some hooks before introducing new ones'
      });
    }

    // Check pacing
    const expectedProgress = chapter.chapterNumber / 50; // Assuming 50 chapters
    const actualProgress = this.structure.acts.reduce((sum, act) => 
      sum + act.completionPercentage / 100, 0) / this.structure.acts.length;

    if (Math.abs(expectedProgress - actualProgress) > 0.2) {
      this.weaknesses.push({
        type: actualProgress > expectedProgress ? 'rushed' : 'dragging',
        location: { chapter: chapter.chapterNumber },
        description: `Story pacing is ${actualProgress > expectedProgress ? 'too fast' : 'too slow'}`,
        severity: 'minor',
        suggestedFix: `Adjust pacing by ${actualProgress > expectedProgress ? 'expanding' : 'condensing'} scenes`
      });
    }
  }

  /**
   * Calculate structure score
   */
  private calculateStructureScore(): number {
    let score = 100;

    // Deduct for weaknesses
    for (const weakness of this.weaknesses) {
      const deduction = weakness.severity === 'major' ? 15 : 
                       weakness.severity === 'moderate' ? 10 : 5;
      score -= deduction;
    }

    // Bonus for completed acts
    const completedActs = this.structure.acts.filter(a => a.completionPercentage === 100).length;
    score += completedActs * 2;

    // Bonus for resolved hooks
    const resolvedHooks = this.structure.payoffs.length;
    score += resolvedHooks;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get current structure
   */
  getStructure(): PlotStructure {
    return { ...this.structure };
  }

  /**
   * Get all weaknesses
   */
  getWeaknesses(): StructuralWeakness[] {
    return [...this.weaknesses];
  }

  /**
   * Get structure recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const template = this.templates.get(this.structure.type);

    if (!template) return recommendations;

    // Check for missing elements
    const presentElements = this.structure.plotPoints.map(p => p.type);
    for (const required of template.requiredElements) {
      if (!presentElements.includes(required as PlotPoint['type'])) {
        recommendations.push(`Add ${required} to the story`);
      }
    }

    // Check thread status
    for (const thread of this.structure.threads) {
      if (thread.status === 'setup' && this.currentChapter - thread.introducedChapter > 5) {
        recommendations.push(`Develop "${thread.name}" thread`);
      }
      if (thread.status === 'developing' && this.currentChapter - thread.introducedChapter > 15) {
        recommendations.push(`Move "${thread.name}" thread toward resolution`);
      }
    }

    // Check hooks
    const unresolvedHooks = this.structure.hooks.filter(h => !h.payoffId);
    if (unresolvedHooks.length > 3) {
      recommendations.push('Resolve some unresolved plot hooks');
    }

    return recommendations;
  }

  /**
   * Set structure type
   */
  setStructureType(type: StructureType): void {
    this.structure = this.createDefaultStructure(type);
  }

  /**
   * Export structure
   */
  exportStructure(): PlotStructure {
    return JSON.parse(JSON.stringify(this.structure));
  }

  /**
   * Import structure
   */
  importStructure(structure: PlotStructure): void {
    this.structure = JSON.parse(JSON.stringify(structure));
  }

  /**
   * Reset system
   */
  reset(): void {
    this.structure = this.createDefaultStructure('three_act');
    this.weaknesses = [];
    this.currentChapter = 0;
  }
  /**
   * Set world simulation reference for structural integrity layer
   */
  setWorldSimulation(worldSimulation: any): void {
    this.worldSimulation = worldSimulation;
  }

  /**
   * Get system status including cross-system connectivity
   */
  getSystemStatus(): {
    currentStructure: string;
    weaknessesCount: number;
    currentChapter: number;
    connectedSystems: string[];
  } {
    const connectedSystems: string[] = [];
    if (this.worldSimulation) connectedSystems.push('worldSimulation');

    return {
      currentStructure: this.structure.type,
      weaknessesCount: this.weaknesses.length,
      currentChapter: this.currentChapter,
      connectedSystems
    };
  }
}
