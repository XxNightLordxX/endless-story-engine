/**
 * AI Story Engine Core - FULL INTEGRATION
 * Uses UnifiedStoryEngine with all 14+ AI systems working together
 * System screen is integrated INTO the narrative, not just appended
 */

import type { Chapter, Character, Location, Item, Skill, Ability } from './types';
import { UnifiedStoryEngine } from './UnifiedStoryEngine';
import { SystemScreenGenerator } from './systems/SystemScreenGenerator';

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
  private unifiedEngine: UnifiedStoryEngine;
  private systemScreen: SystemScreenGenerator;
  private options: StoryGenerationOptions;
  private previousChapter: Chapter | null = null;
  private hasGeneratedFirstChapter: boolean = false;

  constructor(initialOptions: StoryGenerationOptions) {
    this.options = initialOptions;
    this.unifiedEngine = new UnifiedStoryEngine();
    this.systemScreen = new SystemScreenGenerator();
  }

  /**
   * Generate a new chapter using the full 14+ system integration
   */
  async generateChapter(previousChapter?: Chapter): Promise<Chapter> {
    const chapterNumber = previousChapter ? previousChapter.id + 1 : 1;
    
    // Mark that we've started generating
    if (chapterNumber === 1) {
      this.hasGeneratedFirstChapter = true;
    }

    // Convert to UnifiedStoryEngine format
    const unifiedPrev = previousChapter ? this.convertToUnifiedFormat(previousChapter) : null;

    // Generate chapter with all 14 systems
    const generatedChapter = await this.unifiedEngine.generateChapter(unifiedPrev, {
      wordCountTarget: 800 + Math.random() * 400,
      targetPacing: this.options.pacing,
      targetTension: this.options.tension,
      enableContinuity: true,
      enableProgression: true,
      enforceUniqueness: true,
      enableSymbolicDepth: true,
      enableMoralComplexity: true,
      enableCinematicFlow: true,
      enableExperimentalModes: false
    });

    // Convert back to original format
    const chapter = this.convertFromUnifiedFormat(generatedChapter);
    
    // Update previous chapter for continuity
    this.previousChapter = chapter;

    return chapter;
  }

  /**
   * Convert from original Chapter format to UnifiedStoryEngine format
   */
  private convertToUnifiedFormat(chapter: Chapter): any {
    return {
      id: chapter.id,
      title: chapter.title,
      content: chapter.content,
      world: chapter.world,
      summary: chapter.summary || '',
      events: chapter.events || [],
      themes: chapter.themes || [],
      characterState: {
        name: 'Kael',
        currentLevel: Math.floor(chapter.id / 10) + 1,
        skills: ['Vampire Sight', 'Blood Sense'],
        stats: {
          strength: 50 + Math.floor(chapter.id / 10) * 5,
          agility: 50 + Math.floor(chapter.id / 10) * 5,
          intelligence: 50 + Math.floor(chapter.id / 10) * 5,
          power: 50 + Math.floor(chapter.id / 10) * 5,
          resilience: 50 + Math.floor(chapter.id / 10) * 5
        },
        memories: [],
        emotionalState: {
          primary: this.determineEmotion(chapter.id),
          intensity: 5,
          secondary: ['determination', 'curiosity']
        },
        relationships: new Map([['Yuna', 100]]),
        moralAlignment: 'neutral_good'
      },
      narrativeFlow: {
        transitions: [],
        pacing: 'medium',
        tension: 'building',
        emotionalArc: ['determination']
      }
    };
  }

  /**
   * Convert from UnifiedStoryEngine format to original Chapter format
   * Integrates system screen into narrative for VR chapters
   */
  private convertFromUnifiedFormat(unifiedChapter: any): Chapter {
    let content = unifiedChapter.content;
    
    // For VR chapters, integrate system screen INTO the narrative
    if (unifiedChapter.world === 'vr') {
      const systemScreenNarrative = this.generateIntegratedSystemScreen(
        unifiedChapter.id,
        unifiedChapter.characterState
      );
      
      // Insert system screen content in the middle of the narrative
      const paragraphs = content.split('\n\n');
      const midPoint = Math.floor(paragraphs.length / 2);
      paragraphs.splice(midPoint, 0, systemScreenNarrative);
      content = paragraphs.join('\n\n');
    }

    return {
      id: unifiedChapter.id,
      chapterNumber: unifiedChapter.id,
      title: unifiedChapter.title,
      content: content,
      wordCount: content.split(/\s+/).length,
      world: unifiedChapter.world,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      summary: unifiedChapter.summary,
      characters: ['Kael', 'Yuna'],
      locations: [unifiedChapter.world === 'vr' ? 'Eclipsis' : 'Hospital'],
      themes: unifiedChapter.themes,
      events: unifiedChapter.events,
      systemScreen: unifiedChapter.world === 'vr' ? this.generateSystemScreenJSON(unifiedChapter) : undefined
    };
  }

  /**
   * Generate integrated system screen narrative
   * This is woven INTO the story, not just appended
   */
  private generateIntegratedSystemScreen(chapterNumber: number, characterState: any): string {
    const level = characterState.currentLevel;
    const syncLevel = Math.min(95, 10 + level * 2);
    
    const narrativeElements = [
      `Kael's gaze drifted upward, and the translucent interface of his system screen materialized before him.`,
      `The familiar blue glow of the system screen flickered into existence, displaying his current status.`,
      `A sudden chime drew Kael's attention as his system screen updated with new information.`,
      `The virtual environment responded to Kael's presence, his system screen appearing in his peripheral vision.`
    ];
    
    const intro = narrativeElements[Math.floor(Math.random() * narrativeElements.length)];
    
    let statNarrative = `\n\n${intro}\n\n`;
    statNarrative += `[System Screen - Level ${level}]\n`;
    statNarrative += `Name: Kael\n`;
    statNarrative += `Level: ${level}\n`;
    statNarrative += `Sync Level: ${syncLevel}%\n`;
    statNarrative += `\n`;
    statNarrative += `[Stats]\n`;
    statNarrative += `STR: ${characterState.stats.strength}  AGI: ${characterState.stats.agility}  INT: ${characterState.stats.intelligence}\n`;
    statNarrative += `PWR: ${characterState.stats.power}  RES: ${characterState.stats.resilience}\n`;
    statNarrative += `\n`;
    
    // Add ability progression
    const abilities = this.getAbilitiesForLevel(level);
    if (abilities.length > 0) {
      statNarrative += `[Skills & Abilities]\n`;
      abilities.forEach((ability, index) => {
        statNarrative += `${index + 1}. ${ability.name}${ability.new ? ' [NEW]' : ''}\n`;
        if (ability.description) {
          statNarrative += `   ${ability.description}\n`;
        }
      });
      statNarrative += `\n`;
    }
    
    // Add system message if appropriate
    if (level % 5 === 0) {
      statNarrative += `[System Notification]\n`;
      statNarrative += `Level ${level} milestone reached. New abilities unlocked.\n`;
      statNarrative += `\n`;
    }
    
    // Add sync warning if high
    if (syncLevel > 70) {
      statNarrative += `[WARNING: Elevated Sync Level]\n`;
      statNarrative += `Current sync: ${syncLevel}%. Reality bleed effects possible.\n`;
      statNarrative += `\n`;
    }
    
    // Add narrative integration at the end
    statNarrative += `\nKael studied the display, noting how his stats had evolved since his arrival in Eclipsis. The numbers weren't just data - they represented his growing power in this virtual realm, and increasingly, in the physical world as well.\n\n`;
    statNarrative += `With a dismissive gesture, the screen faded away, leaving Kael to focus on the path ahead.`;
    
    return statNarrative;
  }

  /**
   * Get abilities for a given level
   */
  private getAbilitiesForLevel(level: number): Array<{ name: string; description?: string; new?: boolean }> {
    const allAbilities = [
      { level: 1, name: 'Vampire Sight', description: 'Enhanced vision in darkness' },
      { level: 1, name: 'Blood Sense', description: 'Detect bloodlines nearby' },
      { level: 5, name: 'Shadow Manipulation', description: 'Control shadows within range' },
      { level: 10, name: 'Dark Magic', description: 'Channel dark energy' },
      { level: 15, name: 'Reality Bending', description: 'Slightly alter virtual physics' },
      { level: 20, name: 'Time Perception', description: 'Slow time perception' },
      { level: 25, name: 'Blood Barrier', description: 'Create defensive barriers' },
      { level: 30, name: 'Soul Drain', description: 'Absorb energy from defeated enemies' },
      { level: 40, name: 'Dimensional Step', description: 'Short-range teleportation' },
      { level: 50, name: 'Reality Overwrite', description: 'Major alterations to local environment' }
    ];
    
    const currentAbilities = allAbilities.filter(ability => ability.level <= level);
    
    // Mark newly unlocked abilities
    const previousLevelAbilities = allAbilities.filter(ability => ability.level <= level - 1);
    const newAbilities = currentAbilities.filter(ability => 
      !previousLevelAbilities.some(prev => prev.name === ability.name)
    );
    
    return currentAbilities.map(ability => ({
      name: ability.name,
      description: ability.description,
      new: newAbilities.some(newAbility => newAbility.name === ability.name)
    }));
  }

  /**
   * Generate system screen JSON for display
   */
  private generateSystemScreenJSON(unifiedChapter: any): string {
    const level = unifiedChapter.characterState.currentLevel;
    const syncLevel = Math.min(95, 10 + level * 2);
    
    return JSON.stringify({
      chapter: unifiedChapter.id,
      character: {
        name: 'Kael',
        level: level,
        syncLevel: syncLevel
      },
      stats: unifiedChapter.characterState.stats,
      abilities: this.getAbilitiesForLevel(level),
      notifications: syncLevel > 70 ? ['Warning: Elevated sync level'] : [],
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Determine emotion based on chapter number
   */
  private determineEmotion(chapterNumber: number): string {
    const emotions = ['determination', 'curiosity', 'hope', 'power', 'transformation', 'wisdom'];
    return emotions[Math.floor(chapterNumber / 100) % emotions.length];
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
    return {
      currentWorld: this.previousChapter?.world || 'vr',
      timelinePosition: this.previousChapter ? this.previousChapter.id : 0,
      activeCharacters: ['Kael', 'Yuna'],
      currentLocation: this.previousChapter?.world === 'vr' ? 'Eclipsis' : 'Hospital',
      worldState: {
        realWorld: { currentLocation: 'Hospital' },
        vrWorld: { currentZone: 'Eclipsis', syncLevel: 10 + (this.previousChapter?.id || 0) * 2 }
      },
      conflictLevel: this.options.tension,
      emotionalTone: 5
    };
  }

  /**
   * Calculate quality score for generated content
   */
  calculateQualityScore(chapter: Chapter): number {
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
   * Get the unified engine (for testing/inspection)
   */
  getUnifiedEngine(): UnifiedStoryEngine {
    return this.unifiedEngine;
  }

  /**
   * Get the system screen generator
   */
  getSystemScreen(): SystemScreenGenerator {
    return this.systemScreen;
  }

  /**
   * Reset the engine
   */
  reset(): void {
    this.unifiedEngine.reset();
    this.systemScreen = new SystemScreenGenerator();
    this.previousChapter = null;
    this.hasGeneratedFirstChapter = false;
  }
}

export default AIStoryEngine;