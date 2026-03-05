/**
 * Chapter Memory System
 * Tracks story progression, events, characters, and world state for continuity
 */

export interface ChapterEvent {
  type: 'discovery' | 'battle' | 'dialogue' | 'revelation' | 'transition' | 'growth';
  description: string;
  chapterNumber: number;
  world: 'real' | 'vr';
  characters: string[];
  consequences: string[];
}

export interface CharacterProgress {
  name: string;
  currentLevel: number;
  skills: string[];
  relationships: Map<string, number>;
  memories: string[];
  currentGoals: string[];
  emotionalState: string;
  lastAppearance: number;
}

export interface WorldProgress {
  vrWorld: {
    zonesExplored: string[];
    bossesDefeated: string[];
    skillsAcquired: string[];
    itemsCollected: string[];
    currentZone: string;
    systemDiscoveries: string[];
    syncLevel: number;
  };
  realWorld: {
    daysPassed: number;
    hospitalVisits: number;
    importantEvents: string[];
    currentLocation: string;
  };
}

export interface StoryArc {
  currentPhase: 'introduction' | 'rising_action' | 'complication' | 'climax' | 'resolution';
  mainQuest: string;
  subQuests: string[];
  tensionLevel: number;
  chaptersInCurrentPhase: number;
}

export class ChapterMemory {
  private events: ChapterEvent[] = [];
  private characters: Map<string, CharacterProgress> = new Map();
  private worldProgress: WorldProgress;
  private storyArc: StoryArc;
  private chapterSummaries: Map<number, string> = new Map();
  private totalChapters: number = 0;

  constructor() {
    this.worldProgress = {
      vrWorld: {
        zonesExplored: ['Tutorial Castle'],
        bossesDefeated: [],
        skillsAcquired: ['Basic Vampire Sight', 'Blood Sense'],
        itemsCollected: [],
        currentZone: 'Tutorial Zone',
        systemDiscoveries: ['Class: Vampire Progenitor', 'World has day/night cycle'],
        syncLevel: 5,
      },
      realWorld: {
        daysPassed: 1,
        hospitalVisits: 1,
        importantEvents: ['Received mysterious headset', 'Yuna in coma'],
        currentLocation: 'Apartment',
      },
    };

    this.storyArc = {
      currentPhase: 'introduction',
      mainQuest: 'Find a way to save Yuna using the game',
      subQuests: ['Understand the Vampire Progenitor class', 'Explore Eclipsis Online'],
      tensionLevel: 3,
      chaptersInCurrentPhase: 0,
    };

    // Initialize main character
    this.characters.set('Kael', {
      name: 'Kael',
      currentLevel: 1,
      skills: ['Vampire Sight', 'Blood Sense'],
      relationships: new Map([['Yuna', 100]]),
      memories: ['Sister in coma for 2 years', 'Received mysterious VR headset', 'Awakened as Vampire Progenitor'],
      currentGoals: ['Save Yuna', 'Understand this power', 'Explore Eclipsis Online'],
      emotionalState: 'determined but grieving',
      lastAppearance: 0,
    });

    this.characters.set('Yuna', {
      name: 'Yuna',
      currentLevel: 0,
      skills: [],
      relationships: new Map([['Kael', 100]]),
      memories: [],
      currentGoals: [],
      emotionalState: 'unconscious',
      lastAppearance: 0,
    });
  }

  /**
   * Record a new chapter and its events
   */
  recordChapter(chapterNumber: number, content: string, world: 'real' | 'vr'): void {
    this.totalChapters = chapterNumber;
    
    // Extract and store summary
    const summary = this.extractSummary(content);
    this.chapterSummaries.set(chapterNumber, summary);

    // Update story arc
    this.updateStoryArc(chapterNumber);

    // Update world progress
    if (world === 'vr') {
      this.worldProgress.vrWorld.syncLevel = Math.min(100, this.worldProgress.vrWorld.syncLevel + 2);
    } else {
      this.worldProgress.realWorld.daysPassed++;
    }
  }

  /**
   * Get context for generating the next chapter
   */
  getGenerationContext(): {
    recentEvents: ChapterEvent[];
    characterStates: CharacterProgress[];
    worldState: WorldProgress;
    storyArc: StoryArc;
    previousSummaries: string[];
  } {
    const recentEvents = this.events.slice(-5);
    const activeCharacters = Array.from(this.characters.values())
      .filter(c => c.lastAppearance >= this.totalChapters - 3);
    const previousSummaries = this.getRecentSummaries(3);

    return {
      recentEvents,
      characterStates: activeCharacters,
      worldState: this.worldProgress,
      storyArc: this.storyArc,
      previousSummaries,
    };
  }

  /**
   * Add an event to the story
   */
  addEvent(event: ChapterEvent): void {
    this.events.push(event);
    
    // Update character last appearance
    for (const charName of event.characters) {
      const char = this.characters.get(charName);
      if (char) {
        char.lastAppearance = event.chapterNumber;
      }
    }
  }

  /**
   * Update character progression
   */
  updateCharacter(name: string, updates: Partial<CharacterProgress>): void {
    const char = this.characters.get(name);
    if (char) {
      Object.assign(char, updates);
    }
  }

  /**
   * Add a memory to a character
   */
  addCharacterMemory(name: string, memory: string): void {
    const char = this.characters.get(name);
    if (char) {
      char.memories.push(memory);
      if (char.memories.length > 20) {
        char.memories = char.memories.slice(-15);
      }
    }
  }

  /**
   * Record VR world discovery
   */
  recordVRDiscovery(discovery: string): void {
    this.worldProgress.vrWorld.systemDiscoveries.push(discovery);
  }

  /**
   * Record skill acquisition
   */
  recordSkillAcquisition(skill: string): void {
    this.worldProgress.vrWorld.skillsAcquired.push(skill);
    
    const kael = this.characters.get('Kael');
    if (kael && !kael.skills.includes(skill)) {
      kael.skills.push(skill);
      kael.currentLevel = Math.min(100, kael.currentLevel + 1);
    }
  }

  /**
   * Get recent chapter summaries for continuity
   */
  private getRecentSummaries(count: number): string[] {
    const summaries: string[] = [];
    for (let i = this.totalChapters; i > Math.max(0, this.totalChapters - count); i--) {
      const summary = this.chapterSummaries.get(i);
      if (summary) {
        summaries.unshift(summary);
      }
    }
    return summaries;
  }

  /**
   * Extract a summary from chapter content
   */
  private extractSummary(content: string): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const keySentences = sentences.slice(0, 3).join('. ');
    return keySentences.length > 200 ? keySentences.substring(0, 200) + '...' : keySentences;
  }

  /**
   * Update story arc based on chapter progress
   */
  private updateStoryArc(chapterNumber: number): void {
    this.storyArc.chaptersInCurrentPhase++;

    // Phase transitions based on narrative structure
    if (chapterNumber >= 30) {
      this.storyArc.currentPhase = 'resolution';
      this.storyArc.tensionLevel = 5;
    } else if (chapterNumber >= 20) {
      this.storyArc.currentPhase = 'climax';
      this.storyArc.tensionLevel = 10;
    } else if (chapterNumber >= 10) {
      this.storyArc.currentPhase = 'complication';
      this.storyArc.tensionLevel = 7;
    } else if (chapterNumber >= 3) {
      this.storyArc.currentPhase = 'rising_action';
      this.storyArc.tensionLevel = 5;
    }

    // Update subquests based on discoveries
    if (this.storyArc.currentPhase === 'rising_action') {
      if (!this.storyArc.subQuests.includes('Discover the truth about Eclipsis')) {
        this.storyArc.subQuests.push('Discover the truth about Eclipsis');
      }
    }
  }

  /**
   * Get the next phase in story progression
   */
  getNextStoryBeat(): string {
    const phase = this.storyArc.currentPhase;
    const discoveries = this.worldProgress.vrWorld.systemDiscoveries;
    
    switch (phase) {
      case 'introduction':
        return 'Continue exploring the VR world and discovering vampire abilities';
      case 'rising_action':
        return 'Face first real challenge and uncover deeper mysteries';
      case 'complication':
        return 'Confront a major obstacle that threatens the main quest';
      case 'climax':
        return 'The pivotal confrontation that determines everything';
      case 'resolution':
        return 'Deal with the aftermath and set up future adventures';
      default:
        return 'Continue the adventure';
    }
  }

  /**
   * Get total chapters generated
   */
  getTotalChapters(): number {
    return this.totalChapters;
  }

  /**
   * Export memory state for persistence
   */
  exportState(): {
    events: ChapterEvent[];
    characters: Array<{ name: string } & Omit<CharacterProgress, 'relationships'>>;
    worldProgress: WorldProgress;
    storyArc: StoryArc;
    totalChapters: number;
  } {
    const charactersArray = Array.from(this.characters.entries()).map(([name, char]) => ({
      name,
      currentLevel: char.currentLevel,
      skills: char.skills,
      memories: char.memories,
      currentGoals: char.currentGoals,
      emotionalState: char.emotionalState,
      lastAppearance: char.lastAppearance,
    }));

    return {
      events: this.events,
      characters: charactersArray,
      worldProgress: this.worldProgress,
      storyArc: this.storyArc,
      totalChapters: this.totalChapters,
    };
  }

  /**
   * Import memory state
   */
  importState(state: {
    events?: ChapterEvent[];
    worldProgress?: WorldProgress;
    storyArc?: StoryArc;
    totalChapters?: number;
  }): void {
    if (state.events) this.events = state.events;
    if (state.worldProgress) this.worldProgress = state.worldProgress;
    if (state.storyArc) this.storyArc = state.storyArc;
    if (state.totalChapters) this.totalChapters = state.totalChapters;
  }
}

export default ChapterMemory;