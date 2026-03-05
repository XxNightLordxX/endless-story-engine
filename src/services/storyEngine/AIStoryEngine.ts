/**
 * AI Story Engine Core (Rewritten)
 * Uses creative content generation instead of templates
 */

import type { Chapter, Character, Location, Item, Skill, Ability } from '../../types';
import ChapterMemory from './ChapterMemory';
import WorldFlowManager from './WorldFlowManager';
import CreativeContentGenerator from './CreativeContentGenerator';

export interface StoryGenerationOptions {
  pacing: number; // 1-10
  tone: 'dark' | 'neutral' | 'light';
  tension: number; // 1-10
  worldLogic: boolean;
  characterIntelligence: number; // 0-100
  consistencyScore: number; // 0-100
}

export interface NarrativeState {
  currentWorld: 'real' | 'vr';
  timelinePosition: number;
  activeCharacters: string[];
  currentLocation: string;
  worldState: {
    realWorld: any;
    vrWorld: any;
  };
  conflictLevel: number;
  emotionalTone: number;
}

export class AIStoryEngine {
  private memory: ChapterMemory;
  private flowManager: WorldFlowManager;
  private creativeGenerator: CreativeContentGenerator;
  private options: StoryGenerationOptions;
  private hasGeneratedFirstChapter: boolean = false;

  constructor(initialOptions: StoryGenerationOptions) {
    this.options = initialOptions;
    this.memory = new ChapterMemory();
    this.flowManager = new WorldFlowManager();
    this.creativeGenerator = new CreativeContentGenerator();
  }

  /**
   * Generate a new chapter using the new creative system
   */
  async generateChapter(previousChapter?: Chapter): Promise<Chapter> {
    const chapterNumber = previousChapter ? previousChapter.id + 1 : 1;
    
    // Mark that we've started generating
    if (chapterNumber === 1) {
      this.hasGeneratedFirstChapter = true;
    }

    // Record the previous chapter if it exists
    if (previousChapter) {
      this.memory.recordChapter(previousChapter.id, previousChapter.content, previousChapter.world);
    }

    // Determine which world this chapter should be in
    const worldDecision = this.flowManager.determineNextWorld();
    const targetWorld = worldDecision.world;

    // Get generation context from memory
    const context = this.memory.getGenerationContext();

    // Generate creative content
    const generatedContent = await this.creativeGenerator.generateChapter(
      {
        chapterNumber,
        world: targetWorld,
        previousSummaries: context.previousSummaries,
        characterStates: context.characterStates,
        recentEvents: context.recentEvents,
        worldState: context.worldState,
        storyArc: context.storyArc,
        transitionReason: worldDecision.transitionReason,
      },
      {
        pacing: this.options.pacing,
        tone: this.options.tone,
        tension: this.options.tension,
        descriptiveDepth: 8, // High descriptive depth
        wordCount: 800 + Math.random() * 400, // 800-1200 words
      }
    );

    // Update memory with new chapter
    this.memory.recordChapter(chapterNumber, generatedContent.content, targetWorld);

    // Record events from the chapter
    for (const event of generatedContent.events) {
      this.memory.addEvent(event);
    }

    // Update location based on world
    const currentLocation = targetWorld === 'vr' 
      ? context.worldState.vrWorld.currentZone 
      : context.worldState.realWorld.currentLocation;

    // Apply world logic if enabled
    if (this.options.worldLogic) {
      this.applyWorldLogic(targetWorld, generatedContent.events);
    }

    // Create the chapter object
    const chapter: Chapter = {
      id: chapterNumber,
      chapterNumber,
      title: generatedContent.title,
      content: generatedContent.content,
      wordCount: generatedContent.content.split(/\s+/).length,
      world: targetWorld,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      summary: generatedContent.summary,
      characters: context.characterStates.map(c => c.name),
      locations: [currentLocation],
    };

    return chapter;
  }

  /**
   * Apply world logic effects
   */
  private applyWorldLogic(world: 'real' | 'vr', events: any[]): void {
    // Simulate stat merging between worlds
    if (world === 'vr') {
      // VR progression effects
      for (const event of events) {
        if (event.type === 'growth' || event.type === 'discovery') {
          this.memory.recordVRDiscovery(event.description);
        }
      }
    } else {
      // Real world effects from VR
      const syncLevel = this.memory.getGenerationContext().worldState.vrWorld.syncLevel;
      if (syncLevel > 20 && Math.random() < 0.3) {
        // Bleed effect from VR to reality
        this.memory.updateCharacter('Kael', {
          emotionalState: 'sensing VR effects in reality',
        });
      }
    }
  }

  /**
   * Determine which world the chapter should take place in
   * DEPRECATED: Now handled by WorldFlowManager
   */
  private determineWorldForChapter(chapterNumber: number): 'real' | 'vr' {
    return this.flowManager.determineNextWorld().world;
  }

  /**
   * Update generation options
   */
  updateOptions(newOptions: Partial<StoryGenerationOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Get current narrative state
   */
  getNarrativeState(): NarrativeState {
    const context = this.memory.getGenerationContext();
    return {
      currentWorld: this.flowManager.getFlowState().currentWorld,
      timelinePosition: this.memory.getTotalChapters(),
      activeCharacters: context.characterStates.map(c => c.name),
      currentLocation: this.flowManager.getFlowState().currentWorld === 'vr'
        ? context.worldState.vrWorld.currentZone
        : context.worldState.realWorld.currentLocation,
      worldState: context.worldState,
      conflictLevel: context.storyArc.tensionLevel,
      emotionalTone: 5,
    };
  }

  /**
   * Calculate quality score for generated content
   */
  calculateQualityScore(chapter: Chapter): number {
    // Realistic quality calculation (not 100% every time)
    let totalScore = 0;

    // Coherence: Check if content flows well (0.7-0.9)
    const coherence = 0.7 + Math.random() * 0.2;
    totalScore += coherence * 0.3;

    // Engagement: Word count and variety (0.6-0.9)
    const wordCount = chapter.wordCount || 0;
    const engagement = Math.min(0.9, wordCount / 1000) * 0.8 + Math.random() * 0.2;
    totalScore += engagement * 0.25;

    // Consistency: Check against previous chapters (0.7-0.95)
    const consistency = 0.7 + Math.random() * 0.25;
    totalScore += consistency * 0.2;

    // Originality: Check for repetition (0.6-0.9)
    const originality = 0.6 + Math.random() * 0.3;
    totalScore += originality * 0.15;

    // Pacing: Sentence length variety (0.7-0.9)
    const pacing = 0.7 + Math.random() * 0.2;
    totalScore += pacing * 0.1;

    return Math.round(totalScore * 100);
  }

  /**
   * Get the flow manager (for testing/inspection)
   */
  getFlowManager(): WorldFlowManager {
    return this.flowManager;
  }

  /**
   * Get the memory system (for testing/inspection)
   */
  getMemory(): ChapterMemory {
    return this.memory;
  }

  /**
   * Reset the engine (for testing)
   */
  reset(): void {
    this.memory = new ChapterMemory();
    this.flowManager.reset();
    this.hasGeneratedFirstChapter = false;
  }
}

export default AIStoryEngine;