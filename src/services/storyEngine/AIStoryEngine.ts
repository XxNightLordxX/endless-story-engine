import type { Chapter, Character, Location } from '../../types';

export interface StoryEngineConfig {
  pacing: number;
  tone: 'dark' | 'neutral' | 'light';
  tension: number;
  worldLogic: boolean;
  characterIntelligence: number;
  consistencyScore: number;
  qualityThreshold: number;
  statMergeEnabled: boolean;
}

export interface GeneratedChapter {
  chapter: Chapter;
  metrics: {
    quality: number;
    pacing: number;
    tension: number;
    consistency: number;
    conflict: number;
  };
  systemScreen?: string;
}

export interface GenerateChapterOptions {
  chapterNumber: number;
  world: 'real' | 'vr';
  characters: Character[];
  location: Location;
  previousChapter: Chapter;
}

/**
 * AI Story Engine - Complete Rewrite
 * 
 * Core Principles:
 * 1. Web search provides VOCABULARY only, never full snippets
 * 2. Stories are character-driven with actions and dialogue
 * 3. System screens are integrated INTO narrative for VR chapters
 * 4. No meta-commentary (camera, atmosphere descriptions)
 * 5. Each chapter advances the plot with meaningful events
 */

export class AIStoryEngine {
  private config: StoryEngineConfig;
  private vocabularyCache: Map<string, string[]> = new Map();
  private plotMemory: Map<string, any[]> = new Map();

  constructor(config: Partial<StoryEngineConfig> = {}) {
    this.config = {
      pacing: config.pacing || 10,
      tone: config.tone || 'dark',
      tension: config.tension || 10,
      worldLogic: config.worldLogic !== false,
      characterIntelligence: config.characterIntelligence || 10,
      consistencyScore: config.consistencyScore || 10,
      qualityThreshold: config.qualityThreshold || 70,
      statMergeEnabled: config.statMergeEnabled !== false,
    };
  }

  /**
   * Generate a complete chapter with narrative flow
   */
  async generateChapter(options: GenerateChapterOptions): Promise<GeneratedChapter> {
    const { chapterNumber, world, characters, location, previousChapter } = options;

    // 1. Gather vocabulary from web search (for inspiration only)
    const vocabulary = await this.gatherVocabulary(world, location, chapterNumber);

    // 2. Determine plot progression for this chapter
    const plotPoint = this.determinePlotPoint(chapterNumber, world, previousChapter);

    // 3. Build scene structure
    const sceneStructure = this.buildSceneStructure(plotPoint, world, location, characters);

    // 4. Generate narrative paragraphs
    const content = this.generateNarrative(sceneStructure, vocabulary, characters, location, world);

    // 5. Generate title
    const title = this.generateTitle(chapterNumber, world, plotPoint);

    // 6. Extract system screen (VR chapters only, integrated into narrative)
    const systemScreen = world === 'vr' ? this.extractSystemScreen(content) : undefined;

    // 7. Calculate metrics
    const metrics = this.calculateMetrics(content, previousChapter);

    return {
      chapter: {
        id: chapterNumber,
        chapterNumber,
        title,
        content,
        wordCount: content.split(/\s+/).length,
        world,
        createdAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        summary: this.generateSummary(plotPoint),
        characters: characters.map(c => c.name),
        locations: [location.name],
      },
      metrics,
      systemScreen,
    };
  }

  /**
   * Gather vocabulary from web search for creative inspiration
   * NEVER inserts full snippets into story
   */
  private async gatherVocabulary(
    world: 'real' | 'vr',
    location: Location,
    chapterNumber: number
  ): Promise<string[]> {
    const cacheKey = `${world}-${location.id}-${chapterNumber}`;
    
    if (this.vocabularyCache.has(cacheKey)) {
      return this.vocabularyCache.get(cacheKey)!;
    }

    // Determine search queries based on context
    const queries = this.generateSearchQueries(world, location, chapterNumber);
    
    // Collect vocabulary words and phrases
    const vocabulary: string[] = [];
    
    for (const query of queries) {
      try {
        const results = await this.performWebSearch(query);
        
        // Extract individual words and short phrases from results
        for (const result of results) {
          const words = this.extractWords(result);
          vocabulary.push(...words);
        }
      } catch (error) {
        console.warn(`Web search failed for query: ${query}`, error);
      }
    }

    // Cache for reuse
    this.vocabularyCache.set(cacheKey, vocabulary);
    
    return vocabulary;
  }

  /**
   * Generate contextual search queries
   */
  private generateSearchQueries(
    world: 'real' | 'vr',
    location: Location,
    chapterNumber: number
  ): string[] {
    const queries: string[] = [];

    if (world === 'vr') {
      queries.push(
        'dark fantasy atmospheric vocabulary',
        'gothic horror descriptive words',
        'vampire supernatural abilities',
        'shadow magic terminology',
        'ancient castle atmosphere'
      );
    } else {
      queries.push(
        'hospital emotional scenes',
        'coma patient visiting',
        'hope determination literature',
        'grief loss vocabulary'
      );
    }

    return queries.slice(0, 3); // Limit to 3 queries
  }

  /**
   * Extract individual words from search results
   */
  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= 4) // Only meaningful words
      .slice(0, 20); // Limit words per result
  }

  /**
   * Perform web search (placeholder - integrates with actual API)
   */
  private async performWebSearch(query: string): Promise<string[]> {
    try {
      const { webSearch } = await import('../../api');
      const response = await webSearch(query, 5);
      // Handle the response structure
      if (Array.isArray(response)) {
        return response.map((r: any) => r.snippet || r.title || '');
      }
      return this.getFallbackVocabulary(query);
    } catch (error) {
      // Return fallback vocabulary if web search fails
      return this.getFallbackVocabulary(query);
    }
  }

  /**
   * Fallback vocabulary when web search fails
   */
  private getFallbackVocabulary(query: string): string[] {
    const fallbackVocab: Record<string, string[]> = {
      'dark fantasy': ['ancient', 'shadow', 'blood', 'darkness', 'ethereal', 'mist', 'ancient', 'forgotten', 'eternal', 'silent'],
      'hospital': ['sterile', 'silent', 'monitor', 'beep', 'white', 'quiet', 'hope', 'despair', 'waiting', 'mercy'],
      'vampire': ['blood', 'shadow', 'immortal', 'hunger', 'ancient', 'darkness', 'nocturnal', 'eternal', 'forbidden'],
    };

    for (const [key, words] of Object.entries(fallbackVocab)) {
      if (query.toLowerCase().includes(key)) {
        return words;
      }
    }

    return ['ancient', 'silent', 'mysterious', 'dark', 'light'];
  }

  /**
   * Determine plot point for this chapter
   */
  private determinePlotPoint(
    chapterNumber: number,
    world: 'real' | 'vr',
    previousChapter: Chapter
  ): {
    type: string;
    description: string;
    keyEvents: string[];
  } {
    // Simple plot structure based on chapter number
    if (world === 'vr') {
      const vrPlotPoints = [
        { type: 'discovery', description: 'Kael explores his new abilities', keyEvents: ['discover power', 'test ability', 'realize potential'] },
        { type: 'first_contact', description: 'Kael encounters other beings', keyEvents: ['meet NPC', 'receive quest', 'learn lore'] },
        { type: 'conflict', description: 'Kael faces first challenge', keyEvents: ['enemy appears', 'use ability', 'win/survive'] },
        { type: 'revelation', description: 'Kael learns important truth', keyEvents: ['discover secret', 'see vision', 'understand purpose'] },
      ];
      
      return vrPlotPoints[chapterNumber % vrPlotPoints.length];
    } else {
      const realPlotPoints = [
        { type: 'visit', description: 'Kael visits Yuna in hospital', keyEvents: ['arrive', 'talk to Yuna', 'hope'] },
        { type: 'struggle', description: 'Kael faces reality challenges', keyEvents: ['receive bill', 'feel绝望', 'resolve to continue'] },
        { type: 'connection', description: 'Kael feels VR affecting reality', keyEvents: ['sensation', 'realization', 'confusion'] },
      ];
      
      return realPlotPoints[chapterNumber % realPlotPoints.length];
    }
  }

  /**
   * Build scene structure
   */
  private buildSceneStructure(
    plotPoint: any,
    world: 'real' | 'vr',
    location: Location,
    characters: Character[]
  ): {
    opening: string;
    middle: string[];
    closing: string;
    systemScreen?: string;
  } {
    const protagonist = characters.find(c => c.role === 'protagonist') || characters[0];

    if (world === 'vr') {
      return {
        opening: `${protagonist.name} opens their eyes in ${location.name}. The world feels different here—more vivid, more real than reality.`,
        middle: [
          `${protagonist.name} looks at their hands, noticing the changes.`,
          `A new sensation pulses through ${protagonist.name}'s veins.`,
          `${protagonist.name} takes their first steps in this new world.`,
        ],
        closing: `${protagonist.name} stands ready, determined to find a way to save Yuna.`,
      };
    } else {
      return {
        opening: `${protagonist.name} walks into ${location.name}, the familiar weight of the situation pressing down.`,
        middle: [
          `${protagonist.name} approaches Yuna's room.`,
          `The machines beep in steady rhythm.`,
          `${protagonist.name} speaks to Yuna, sharing hope and fear.`,
        ],
        closing: `${protagonist.name} leaves with renewed determination.`,
      };
    }
  }

  /**
   * Generate narrative with proper story flow
   */
  private generateNarrative(
    sceneStructure: any,
    vocabulary: string[],
    characters: Character[],
    location: Location,
    world: 'real' | 'vr'
  ): string {
    const protagonist = characters.find(c => c.role === 'protagonist') || characters[0];
    const paragraphs: string[] = [];

    // Opening paragraph
    paragraphs.push(sceneStructure.opening);

    // Middle paragraphs - build action and dialogue
    for (let i = 0; i < sceneStructure.middle.length; i++) {
      const middlePoint = sceneStructure.middle[i];
      
      // Add descriptive details using vocabulary
      const detail = this.addDescriptiveDetail(middlePoint, vocabulary, world, location);
      paragraphs.push(detail);

      // Add dialogue for every other paragraph
      if (i % 2 === 1) {
        paragraphs.push(this.generateDialogue(protagonist, world));
      }
    }

    // Add system screen for VR chapters (integrated into narrative)
    if (world === 'vr') {
      const systemScreen = this.generateIntegratedSystemScreen(protagonist, vocabulary);
      paragraphs.push(systemScreen);
    }

    // Closing paragraph
    paragraphs.push(sceneStructure.closing);

    // Join paragraphs with proper spacing
    return paragraphs.join('\n\n');
  }

  /**
   * Add descriptive detail using vocabulary
   */
  private addDescriptiveDetail(
    baseText: string,
    vocabulary: string[],
    world: 'real' | 'vr',
    location: Location
  ): string {
    // Select a few random vocabulary words to incorporate
    const selectedWords = vocabulary
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    // Enhance the base text with descriptive details
    let enhancedText = baseText;

    // Add atmospheric details based on world
    if (world === 'vr') {
      const atmosphereWords = selectedWords.filter(w => 
        ['shadow', 'dark', 'ancient', 'mystical', 'blood'].some(keyword => w.includes(keyword))
      );
      
      if (atmosphereWords.length > 0) {
        enhancedText += ` The air shimmered with ${atmosphereWords[0]} energy.`;
      }
    }

    return enhancedText;
  }

  /**
   * Generate dialogue for character
   */
  private generateDialogue(character: Character, world: 'real' | 'vr'): string {
    const dialogues: Record<string, string[]> = {
      vr: [
        '"What is this power?"',
        '"I can feel it... the bloodline."',
        '"Yuna, I\'m coming for you."',
        '"This world... it knows me."',
      ],
      real: [
        '"I\'ll find a way, Yuna. I promise."',
        '"The game... it showed me something."',
        '"Just hang on a little longer."',
        '"I\'m not giving up on you."',
      ],
    };

    const characterDialogues = dialogues[world] || dialogues.real;
    const randomDialogue = characterDialogues[Math.floor(Math.random() * characterDialogues.length)];

    return `${character.name} speaks, their voice carrying the weight of countless days and nights. ${randomDialogue}`;
  }

  /**
   * Generate system screen integrated into narrative (VR chapters only)
   */
  private generateIntegratedSystemScreen(character: Character, vocabulary: string[]): string {
    const abilities = ['Vampire Sight', 'Blood Sense', 'Shadow Meld', 'Nocturnal Agility'];
    const unlockedAbility = abilities[Math.floor(Math.random() * abilities.length)];

    return `Before ${character.name}'s eyes, translucent text materializes in the air, glowing with ethereal light:

═════════════════════════════════════════
           CHARACTER STATUS
═════════════════════════════════════════
Name: ${character.name}
Class: Vampire Progenitor
Level: 2

[NEW] ${unlockedAbility}

Experience: 150/200
Blood Reserves: 85%
═════════════════════════════════════════

The system notification fades, but the sensation of power lingers.`;
  }

  /**
   * Generate chapter title
   */
  private generateTitle(chapterNumber: number, world: 'real' | 'vr', plotPoint: any): string {
    const vrTitles = [
      'The Awakening',
      'First Blood',
      'Shadows Rising',
      'The Revelation',
      'Blood Pact',
      'Ancient Power',
      'The Hunt Begins',
      'Path of Night',
    ];

    const realTitles = [
      'The Promise',
      'Between Worlds',
      'Echoes',
      'The Long Wait',
      'Fragments of Hope',
      'Reality Blurs',
      'The Connection',
      'Unbreakable',
    ];

    const titles = world === 'vr' ? vrTitles : realTitles;
    return `Chapter ${chapterNumber}: ${titles[chapterNumber % titles.length]}`;
  }

  /**
   * Generate chapter summary
   */
  private generateSummary(plotPoint: any): string {
    return plotPoint.description;
  }

  /**
   * Extract system screen from content (if present)
   */
  private extractSystemScreen(content: string): string {
    // Look for system screen markers in content
    const systemScreenMatch = content.match(/═════════════════════════════════════════[\s\S]*?═════════════════════════════════════════/);
    
    if (systemScreenMatch) {
      return systemScreenMatch[0];
    }

    return '';
  }

  /**
   * Calculate chapter metrics
   */
  private calculateMetrics(content: string, previousChapter: Chapter): {
    quality: number;
    pacing: number;
    tension: number;
    consistency: number;
    conflict: number;
  } {
    const wordCount = content.split(/\s+/).length;
    const paragraphCount = content.split('\n\n').length;

    // Simple metrics calculation
    const quality = Math.min(95, 70 + (wordCount / 100));
    const pacing = Math.min(10, (wordCount / paragraphCount) / 50);
    const tension = this.config.tension;
    const consistency = this.config.consistencyScore;
    const conflict = content.includes('"') ? 7 : 4; // Has dialogue = more conflict

    return {
      quality,
      pacing,
      tension,
      consistency,
      conflict,
    };
  }
}

// Re-export UnifiedStoryEngine for backward compatibility
export { UnifiedStoryEngine } from './UnifiedStoryEngine';

// Default export
export default AIStoryEngine;