import { v4 as uuidv4 } from 'uuid';
import { webSearchIntegration } from './WebSearchIntegration';
import type { WebSearchResult, TechnicalSearchResult, LiterarySearchResult } from './WebSearchIntegration';

/**
 * Symbolic Logic & Motif Tracking System
 * 
 * This system identifies, tracks, and weaves symbolic elements throughout the narrative.
 * It manages motifs, patterns, themes, and their evolution across the story.
 * 
 * Enhanced with real-time web search for literary symbolism databases,
 * motif usage in classic literature, and archetype symbol meanings.
 * 
 * Core Responsibilities:
 * - Identify symbolic elements in narrative content
 * - Track motif recurrence and evolution
 * - Analyze thematic coherence and symbolic patterns
 * - Suggest motif placement and development
 * - Maintain symbolic mapping between characters, objects, events
 * - Track foreshadowing through symbolic hints
 */

// ===== TYPES & INTERFACES =====

export interface SymbolicElement {
  id: string;
  type: 'motif' | 'symbol' | 'metaphor' | 'allegory' | 'archetype' | 'recurrence';
  name: string;
  description: string;
  content: string; // The symbolic content itself
  firstAppearance: number; // Chapter number
  appearances: number[];
  associatedCharacters: string[];
  associatedObjects: string[];
  associatedThemes: string[];
  evolution: SymbolicEvolution[];
  currentMeaning: string;
  originalMeaning: string;
  significanceLevel: number; // 1-10
  frequency: number;
  variations: SymbolicVariation[];
  connections: SymbolicConnection[];
}

export interface SymbolicEvolution {
  chapter: number;
  oldMeaning: string;
  newMeaning: string;
  context: string;
  triggerEvent: string;
  transformationType: 'subtle' | 'gradual' | 'dramatic' | 'reversal' | 'deepening';
}

export interface SymbolicVariation {
  chapter: number;
  variation: string;
  context: string;
  effectOnMeaning: string;
}

export interface SymbolicConnection {
  targetElementId: string;
  connectionType: 'parallel' | 'contrast' | 'reinforcement' | 'irony' | 'echo';
  strength: number; // 0-1
  chapter: number;
  description: string;
}

export interface ThematicAnalysis {
  primaryThemes: Theme[];
  secondaryThemes: Theme[];
  themeCoherence: number; // 0-1
  themeDevelopment: ThemeDevelopment[];
  unresolvedThemes: string[];
  themeResolutions: ThemeResolution[];
}

export interface Theme {
  id: string;
  name: string;
  coreQuestion: string;
  explorationDepth: number; // 0-1
  chaptersExplored: number[];
  keyMoments: ThematicMoment[];
  currentStance: string;
  conflictPoints: ThematicConflict[];
}

export interface ThematicMoment {
  chapter: number;
  description: string;
  significance: number; // 1-10
  alignment: string; // How this moment aligns with the theme
}

export interface ThematicConflict {
  chapter: number;
  competingIdeas: string[];
  nature: 'philosophical' | 'character' | 'moral' | 'existential';
  resolution: 'resolved' | 'ongoing' | 'complicated' | 'abandoned';
}

export interface ThemeDevelopment {
  themeId: string;
  chapter: number;
  developmentType: 'introduction' | 'exploration' | 'complication' | 'deepening' | 'resolution';
  description: string;
  newInsights: string[];
  shiftingPerspectives: string[];
}

export interface ThemeResolution {
  themeId: string;
  chapter: number;
  resolutionType: 'definitive' | 'ambiguous' | 'personal' | 'societal' | 'transcendent';
  resolution: string;
  satisfaction: number; // 0-1
  implications: string[];
}

export interface SymbolicAnalysis {
  elements: SymbolicElement[];
  themes: ThematicAnalysis;
  symbolicDensity: number;
  patternCoherence: number;
  foreshadowingHints: ForeshadowingHint[];
  payoffConnections: PayoffConnection[];
  symbolicGaps: SymbolicGap[];
}

export interface ForeshadowingHint {
  id: string;
  chapter: number;
  content: string;
  suggestedPayoff: string;
  payoffProbability: number;
  symbolicMarker: string;
  intensity: number; // 1-10
}

export interface PayoffConnection {
  foreshadowingId: string;
  chapter: number;
  fulfillment: string;
  satisfaction: number; // 0-1
  explicitness: 'explicit' | 'implicit' | 'subtle' | 'transformative';
}

export interface SymbolicGap {
  type: 'unfulfilled-foreshadowing' | 'abandoned-motif' | 'inconsistent-symbol' | 'missed-connection';
  chapter: number;
  description: string;
  severity: number; // 1-10
  suggestion: string;
}

export interface MotifPlacement {
  motif: SymbolicElement;
  suggestedPlacement: {
    chapter: number;
    context: string;
    method: 'direct' | 'subtle' | 'echo' | 'contrast';
    description: string;
  }[];
  reasoning: string;
  expectedEffect: string;
}

export interface SymbolicMapping {
  characterSymbols: Map<string, string[]>; // Character -> symbols associated
  objectSymbols: Map<string, string[]>; // Object -> symbolic meanings
  eventSymbols: Map<string, string[]>; // Event -> symbolic significance
  colorPalette: Map<string, string>; // Color -> symbolic meaning
  numberSystem: Map<number, string>; // Number -> symbolic meaning
}

// ===== CLASS DEFINITION =====

export class SymbolicLogicTracker {
  private elements: Map<string, SymbolicElement> = new Map();
  private themes: Map<string, Theme> = new Map();
  private foreshadowingHints: Map<string, ForeshadowingHint> = new Map();
  private payoffConnections: PayoffConnection[] = [];
  private symbolicMapping: SymbolicMapping;
  private analysisHistory: SymbolicAnalysis[] = [];
  
  // Web search integration
  private symbolismCache: Map<string, LiterarySearchResult[]> = new Map();
  private motifUsageCache: Map<string, WebSearchResult[]> = new Map();
  private archetypeMeaningsCache: Map<string, TechnicalSearchResult[]> = new Map();

  constructor() {
    this.symbolicMapping = {
      characterSymbols: new Map(),
      objectSymbols: new Map(),
      eventSymbols: new Map(),
      colorPalette: new Map(),
      numberSystem: new Map()
    };
  }

  // ===== WEB SEARCH INTEGRATION =====

  /**
   * Search for literary symbolism databases
   */
  async searchSymbolicMeanings(
    symbol: string,
    context: string
  ): Promise<WebSearchResult[]> {
    const key = `${symbol}-${context}`;
    if (this.symbolismCache.has(key)) {
      return this.symbolismCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchSymbolicMeanings(
      symbol,
      context
    );
    this.symbolismCache.set(key, results as LiterarySearchResult[]);
    return results;
  }

  /**
   * Research motif usage in classic literature
   */
  async searchMotifUsage(
    motif: string,
    genre: string
  ): Promise<WebSearchResult[]> {
    const key = `${motif}-${genre}`;
    if (this.motifUsageCache.has(key)) {
      return this.motifUsageCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchLiteraryExamples(
      `${motif} motif`,
      genre
    );
    this.motifUsageCache.set(key, results);
    return results;
  }

  /**
   * Look up archetype symbol meanings
   */
  async searchArchetypeMeanings(
    archetype: string,
    symbolType: string
  ): Promise<TechnicalSearchResult[]> {
    const key = `${archetype}-${symbolType}`;
    if (this.archetypeMeaningsCache.has(key)) {
      return this.archetypeMeaningsCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchWritingBestPractices(
      `${archetype} ${symbolType} archetype symbolism`
    );
    this.archetypeMeaningsCache.set(key, results);
    return results;
  }

  /**
   * Clear web search cache
   */
  clearWebSearchCache(): void {
    this.symbolismCache.clear();
    this.motifUsageCache.clear();
    this.archetypeMeaningsCache.clear();
  }

  // ===== CORE FUNCTIONALITY =====

  /**
   * Analyze narrative content for symbolic elements
   */
  public analyzeSymbolicContent(content: string, chapter: number): SymbolicAnalysis {
    const elements = this.extractSymbolicElements(content, chapter);
    const themes = this.analyzeThemes(content, chapter);
    const hints = this.extractForeshadowingHints(content, chapter);
    
    this.updateElementAppearances(elements, chapter);
    this.processNewElements(elements, chapter);
    this.processForeshadowingHints(hints);
    
    const analysis: SymbolicAnalysis = {
      elements: Array.from(this.elements.values()),
      themes,
      symbolicDensity: this.calculateSymbolicDensity(content, elements.length),
      patternCoherence: this.calculatePatternCoherence(),
      foreshadowingHints: Array.from(this.foreshadowingHints.values()),
      payoffConnections: this.payoffConnections,
      symbolicGaps: this.identifySymbolicGaps(chapter)
    };
    
    this.analysisHistory.push(analysis);
    return analysis;
  }

  /**
   * Extract symbolic elements from content
   */
  private extractSymbolicElements(content: string, chapter: number): SymbolicElement[] {
    const elements: SymbolicElement[] = [];
    const patterns = this.identifySymbolicPatterns(content);
    
    patterns.forEach(pattern => {
      const element: SymbolicElement = {
        id: uuidv4(),
        type: this.classifySymbolicType(pattern),
        name: this.extractSymbolicName(pattern),
        description: this.generateSymbolicDescription(pattern),
        content: pattern.content,
        firstAppearance: chapter,
        appearances: [chapter],
        associatedCharacters: pattern.characters || [],
        associatedObjects: pattern.objects || [],
        associatedThemes: pattern.themes || [],
        evolution: [],
        currentMeaning: pattern.initialMeaning || '',
        originalMeaning: pattern.initialMeaning || '',
        significanceLevel: pattern.significance || 5,
        frequency: 1,
        variations: [],
        connections: []
      };
      
      elements.push(element);
    });
    
    return elements;
  }

  /**
   * Identify symbolic patterns in content
   */
  private identifySymbolicPatterns(content: string): any[] {
    const patterns: any[] = [];
    
    // Pattern 1: Recurring imagery/objects
    const recurringPatterns = this.findRecurringPatterns(content);
    patterns.push(...recurringPatterns);
    
    // Pattern 2: Color symbolism
    const colorPatterns = this.findColorPatterns(content);
    patterns.push(...colorPatterns);
    
    // Pattern 3: Numerical patterns
    const numberPatterns = this.findNumberPatterns(content);
    patterns.push(...numberPatterns);
    
    // Pattern 4: Metaphorical language
    const metaphorPatterns = this.findMetaphorPatterns(content);
    patterns.push(...metaphorPatterns);
    
    // Pattern 5: Archetypal situations
    const archetypalPatterns = this.findArchetypalPatterns(content);
    patterns.push(...archetypalPatterns);
    
    return patterns;
  }

  /**
   * Find recurring patterns in content
   */
  private findRecurringPatterns(content: string): any[] {
    const patterns: any[] = [];
    const words = content.split(/\s+/);
    const wordFrequency = new Map<string, number>();
    
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 4) {
        wordFrequency.set(cleanWord, (wordFrequency.get(cleanWord) || 0) + 1);
      }
    });
    
    wordFrequency.forEach((frequency, word) => {
      if (frequency >= 3) {
        patterns.push({
          type: 'recurrence',
          content: word,
          frequency,
          initialMeaning: this.assessSymbolicMeaning(word, frequency),
          significance: Math.min(10, frequency + 2)
        });
      }
    });
    
    return patterns;
  }

  /**
   * Find color patterns in content
   */
  private findColorPatterns(content: string): any[] {
    const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'gold', 'silver', 
                   'crimson', 'emerald', 'sapphire', 'amber', 'obsidian', 'ivory'];
    const patterns: any[] = [];
    
    colors.forEach(color => {
      const regex = new RegExp(color, 'gi');
      const matches = content.match(regex);
      
      if (matches && matches.length >= 2) {
        const context = this.extractColorContext(content, color);
        patterns.push({
          type: 'symbol',
          content: color,
          frequency: matches.length,
          initialMeaning: this.assessColorMeaning(color, context),
          significance: Math.min(10, matches.length + 3),
          objects: context.objects
        });
        
        this.symbolicMapping.colorPalette.set(color, this.assessColorMeaning(color, context));
      }
    });
    
    return patterns;
  }

  /**
   * Find number patterns in content
   */
  private findNumberPatterns(content: string): any[] {
    const numberPatterns: any[] = [];
    const numbers = content.match(/\b\d+\b/g);
    
    if (numbers) {
      const numberFrequency = new Map<number, number>();
      numbers.forEach(num => {
        const n = parseInt(num);
        numberFrequency.set(n, (numberFrequency.get(n) || 0) + 1);
      });
      
      numberFrequency.forEach((frequency, num) => {
        if (frequency >= 2 || this.isSymbolicNumber(num)) {
          numberPatterns.push({
            type: 'symbol',
            content: num.toString(),
            frequency,
            initialMeaning: this.assessNumberMeaning(num, frequency),
            significance: this.isSymbolicNumber(num) ? 8 : Math.min(10, frequency + 2)
          });
          
          this.symbolicMapping.numberSystem.set(num, this.assessNumberMeaning(num, frequency));
        }
      });
    }
    
    return numberPatterns;
  }

  /**
   * Find metaphorical patterns
   */
  private findMetaphorPatterns(content: string): any[] {
    const metaphorPatterns: any[] = [];
    const metaphorIndicators = ['like', 'as if', 'seemed like', 'reminiscent of', 'akin to'];
    
    const sentences = content.split(/[.!?]+/);
    sentences.forEach(sentence => {
      metaphorIndicators.forEach(indicator => {
        if (sentence.toLowerCase().includes(indicator)) {
          metaphorPatterns.push({
            type: 'metaphor',
            content: sentence.trim(),
            frequency: 1,
            initialMeaning: this.interpretMetaphor(sentence),
            significance: 6
          });
        }
      });
    });
    
    return metaphorPatterns;
  }

  /**
   * Find archetypal patterns
   */
  private findArchetypalPatterns(content: string): any[] {
    const archetypalPatterns: any[] = [];
    const archetypes = [
      { name: 'journey', keywords: ['journey', 'quest', 'path', 'road'] },
      { name: 'death-rebirth', keywords: ['death', 'rebirth', 'resurrection', 'transformation'] },
      { name: 'sacrifice', keywords: ['sacrifice', 'give up', 'offer'] },
      { name: 'betrayal', keywords: ['betray', 'deceive', 'treason'] },
      { name: 'redemption', keywords: ['redeem', 'forgive', 'atone'] }
    ];
    
    archetypes.forEach(archetype => {
      const hasKeywords = archetype.keywords.some(keyword => 
        content.toLowerCase().includes(keyword)
      );
      
      if (hasKeywords) {
        archetypalPatterns.push({
          type: 'archetype',
          content: archetype.name,
          frequency: 1,
          initialMeaning: this.interpretArchetype(archetype.name, content),
          significance: 8
        });
      }
    });
    
    return archetypalPatterns;
  }

  /**
   * Classify symbolic element type
   */
  private classifySymbolicType(pattern: any): SymbolicElement['type'] {
    return pattern.type || 'motif';
  }

  /**
   * Extract symbolic name from pattern
   */
  private extractSymbolicName(pattern: any): string {
    if (typeof pattern.content === 'string') {
      return pattern.content.substring(0, 50);
    }
    return 'Unnamed Symbol';
  }

  /**
   * Generate symbolic description
   */
  private generateSymbolicDescription(pattern: any): string {
    return `Symbolic element of type ${pattern.type} appearing ${pattern.frequency} times`;
  }

  /**
   * Assess symbolic meaning of a word
   */
  private assessSymbolicMeaning(word: string, frequency: number): string {
    // Simple heuristic-based assessment
    const symbolicWords = {
      'light': 'hope, knowledge, divinity',
      'darkness': 'unknown, fear, despair',
      'water': 'cleansing, transformation, subconscious',
      'fire': 'passion, destruction, renewal',
      'blood': 'life, sacrifice, lineage',
      'mirror': 'self-reflection, truth, duality',
      'door': 'opportunity, transition, choice',
      'mask': 'identity, deception, persona',
      'shadow': 'hidden self, fear, unknown',
      'bridge': 'connection, transition, overcoming'
    };
    
    const lowerWord = word.toLowerCase();
    return (symbolicWords as Record<string, string>)[lowerWord] || 'recurring motif with developing significance';
  }

  /**
   * Extract color context
   */
  private extractColorContext(content: string, color: string): any {
    const objects: string[] = [];
    const regex = new RegExp(`\\w+\\s+${color}\\s+\\w+|${color}\\s+\\w+`, 'gi');
    const matches = content.match(regex);
    
    if (matches) {
      matches.forEach(match => {
        const words = match.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word !== color && word.length > 3) {
            objects.push(word);
          }
        });
      });
    }
    
    return { objects };
  }

  /**
   * Assess color meaning
   */
  private assessColorMeaning(color: string, context: any): string {
    const colorMeanings: any = {
      'red': 'passion, danger, violence, love',
      'blue': 'calm, sadness, truth, distance',
      'green': 'growth, nature, envy, renewal',
      'yellow': 'joy, cowardice, betrayal, hope',
      'black': 'death, mystery, power, unknown',
      'white': 'purity, innocence, death, truth',
      'gold': 'wealth, divinity, corruption, value',
      'silver': 'moon, purity, reflection, value'
    };
    
    return colorMeanings[color.toLowerCase()] || 'symbolic color';
  }

  /**
   * Check if number is symbolic
   */
  private isSymbolicNumber(num: number): boolean {
    return [3, 7, 12, 40, 666].includes(num) || num % 10 === 0;
  }

  /**
   * Assess number meaning
   */
  private assessNumberMeaning(num: number, frequency: number): string {
    const numberMeanings: any = {
      3: 'completeness, divine trinity, balance',
      7: 'perfection, spiritual completeness',
      12: 'divine government, completeness',
      40: 'trial, testing, preparation',
      666: 'imperfection, evil, opposition'
    };
    
    return numberMeanings[num] || `recurring number appearing ${frequency} times`;
  }

  /**
   * Interpret metaphor
   */
  private interpretMetaphor(sentence: string): string {
    return `metaphorical comparison suggesting deeper meaning`;
  }

  /**
   * Interpret archetype
   */
  private interpretArchetype(archetype: string, content: string): string {
    return `archetypal pattern of ${archetype} suggesting universal narrative`;
  }

  /**
   * Update element appearances
   */
  private updateElementAppearances(elements: SymbolicElement[], chapter: number): void {
    elements.forEach(element => {
      const existing = this.findOrCreateElement(element);
      existing.appearances.push(chapter);
      existing.frequency++;
    });
  }

  /**
   * Process new elements
   */
  private processNewElements(elements: SymbolicElement[], chapter: number): void {
    elements.forEach(element => {
      this.findOrCreateElement(element);
      this.updateSymbolicMapping(element);
    });
  }

  /**
   * Find or create element
   */
  private findOrCreateElement(element: SymbolicElement): SymbolicElement {
    const existing = Array.from(this.elements.values()).find(
      e => e.name === element.name && e.type === element.type
    );
    
    if (existing) {
      return existing;
    }
    
    this.elements.set(element.id, element);
    return element;
  }

  /**
   * Update symbolic mapping
   */
  private updateSymbolicMapping(element: SymbolicElement): void {
    element.associatedCharacters.forEach(char => {
      if (!this.symbolicMapping.characterSymbols.has(char)) {
        this.symbolicMapping.characterSymbols.set(char, []);
      }
      this.symbolicMapping.characterSymbols.get(char)!.push(element.name);
    });
    
    element.associatedObjects.forEach(obj => {
      if (!this.symbolicMapping.objectSymbols.has(obj)) {
        this.symbolicMapping.objectSymbols.set(obj, []);
      }
      this.symbolicMapping.objectSymbols.get(obj)!.push(element.name);
    });
  }

  /**
   * Analyze themes in content
   */
  private analyzeThemes(content: string, chapter: number): ThematicAnalysis {
    const themes = this.extractThemes(content, chapter);
    
    return {
      primaryThemes: themes.filter(t => t.explorationDepth > 0.6),
      secondaryThemes: themes.filter(t => t.explorationDepth <= 0.6),
      themeCoherence: this.calculateThemeCoherence(themes),
      themeDevelopment: this.trackThemeDevelopment(themes, chapter),
      unresolvedThemes: this.identifyUnresolvedThemes(themes),
      themeResolutions: this.identifyThemeResolutions(themes, chapter)
    };
  }

  /**
   * Extract themes from content
   */
  private extractThemes(content: string, chapter: number): Theme[] {
    const themes: Theme[] = [];
    const themeIndicators = [
      { name: 'identity', keywords: ['who am i', 'identity', 'self', 'purpose'] },
      { name: 'power', keywords: ['power', 'control', 'authority', 'dominance'] },
      { name: 'freedom', keywords: ['freedom', 'liberty', 'choice', 'autonomy'] },
      { name: 'love', keywords: ['love', 'affection', 'attachment', 'care'] },
      { name: 'sacrifice', keywords: ['sacrifice', 'give up', 'selfless', 'duty'] },
      { name: 'truth', keywords: ['truth', 'lie', 'deception', 'honesty'] },
      { name: 'mortality', keywords: ['death', 'life', 'mortality', 'immortality'] },
      { name: 'justice', keywords: ['justice', 'fair', 'right', 'wrong'] }
    ];
    
    themeIndicators.forEach(indicator => {
      const hasKeywords = indicator.keywords.some(keyword => 
        content.toLowerCase().includes(keyword)
      );
      
      if (hasKeywords) {
        const existingTheme = this.findOrCreateTheme(indicator.name, chapter);
        existingTheme.chaptersExplored.push(chapter);
        existingTheme.explorationDepth = Math.min(1, existingTheme.explorationDepth + 0.1);
        
        themes.push(existingTheme);
      }
    });
    
    return themes;
  }

  /**
   * Find or create theme
   */
  private findOrCreateTheme(name: string, chapter: number): Theme {
    const existing = Array.from(this.themes.values()).find(t => t.name === name);
    
    if (existing) {
      return existing;
    }
    
    const theme: Theme = {
      id: uuidv4(),
      name,
      coreQuestion: this.generateCoreQuestion(name),
      explorationDepth: 0,
      chaptersExplored: [chapter],
      keyMoments: [],
      currentStance: 'exploration',
      conflictPoints: []
    };
    
    this.themes.set(theme.id, theme);
    return theme;
  }

  /**
   * Generate core question for theme
   */
  private generateCoreQuestion(theme: string): string {
    const questions: any = {
      'identity': 'Who are we really, beneath our roles and masks?',
      'power': 'What is the true nature and cost of power?',
      'freedom': 'Is freedom possible, or are we always bound?',
      'love': 'Can love survive in a harsh world?',
      'sacrifice': 'What are we willing to sacrifice, and why?',
      'truth': 'Is absolute truth attainable or desirable?',
      'mortality': 'How do we confront and accept our mortality?',
      'justice': 'What does true justice look like?'
    };
    
    return questions[theme] || 'What is the deeper meaning of this theme?';
  }

  /**
   * Calculate theme coherence
   */
  private calculateThemeCoherence(themes: Theme[]): number {
    if (themes.length === 0) return 0;
    
    const averageDepth = themes.reduce((sum, t) => sum + t.explorationDepth, 0) / themes.length;
    return Math.min(1, averageDepth * 2);
  }

  /**
   * Track theme development
   */
  private trackThemeDevelopment(themes: Theme[], chapter: number): ThemeDevelopment[] {
    const developments: ThemeDevelopment[] = [];
    
    themes.forEach(theme => {
      if (theme.explorationDepth > 0.8) {
        developments.push({
          themeId: theme.id,
          chapter,
          developmentType: 'deepening',
          description: `${theme.name} theme reaches significant depth`,
          newInsights: ['complex nuance emerging'],
          shiftingPerspectives: ['evolving understanding']
        });
      } else if (theme.explorationDepth > 0.5) {
        developments.push({
          themeId: theme.id,
          chapter,
          developmentType: 'exploration',
          description: `${theme.name} theme being actively explored`,
          newInsights: ['new facets discovered'],
          shiftingPerspectives: ['expanding scope']
        });
      }
    });
    
    return developments;
  }

  /**
   * Identify unresolved themes
   */
  private identifyUnresolvedThemes(themes: Theme[]): string[] {
    return themes
      .filter(t => t.currentStance !== 'resolved')
      .map(t => t.name);
  }

  /**
   * Identify theme resolutions
   */
  private identifyThemeResolutions(themes: Theme[], chapter: number): ThemeResolution[] {
    const resolutions: ThemeResolution[] = [];
    
    themes.forEach(theme => {
      if (theme.explorationDepth >= 0.9 && theme.currentStance !== 'resolved') {
        resolutions.push({
          themeId: theme.id,
          chapter,
          resolutionType: 'ambiguous',
          resolution: `${theme.name} reaches a point of significant understanding`,
          satisfaction: 0.8,
          implications: ['personal growth', 'narrative fulfillment']
        });
        
        theme.currentStance = 'resolved';
      }
    });
    
    return resolutions;
  }

  /**
   * Extract foreshadowing hints
   */
  private extractForeshadowingHints(content: string, chapter: number): ForeshadowingHint[] {
    const hints: ForeshadowingHint[] = [];
    const foreshadowingPatterns = [
      'somehow i knew',
      'as if sensing',
      'unnoticed by others',
      'little did they know',
      'sign of things to come',
      'portent',
      'omen'
    ];
    
    foreshadowingPatterns.forEach(pattern => {
      if (content.toLowerCase().includes(pattern)) {
        const hint: ForeshadowingHint = {
          id: uuidv4(),
          chapter,
          content: this.extractHintContent(content, pattern),
          suggestedPayoff: this.suggestPayoff(content, pattern),
          payoffProbability: 0.7,
          symbolicMarker: pattern,
          intensity: 6
        };
        
        hints.push(hint);
        this.foreshadowingHints.set(hint.id, hint);
      }
    });
    
    return hints;
  }

  /**
   * Extract hint content
   */
  private extractHintContent(content: string, pattern: string): string {
    const regex = new RegExp(`.{0,100}${pattern}.{0,100}`, 'i');
    const match = content.match(regex);
    return match ? match[0] : pattern;
  }

  /**
   * Suggest payoff
   */
  private suggestPayoff(content: string, pattern: string): string {
    return `future event connected to ${pattern}`;
  }

  /**
   * Process foreshadowing hints
   */
  private processForeshadowingHints(hints: ForeshadowingHint[]): void {
    hints.forEach(hint => {
      this.foreshadowingHints.set(hint.id, hint);
    });
  }

  /**
   * Calculate symbolic density
   */
  private calculateSymbolicDensity(content: string, elementCount: number): number {
    const wordCount = content.split(/\s+/).length;
    return Math.min(1, elementCount / (wordCount / 100));
  }

  /**
   * Calculate pattern coherence
   */
  private calculatePatternCoherence(): number {
    const connections = Array.from(this.elements.values())
      .reduce((sum, e) => sum + e.connections.length, 0);
    const total = this.elements.size;
    
    if (total === 0) return 0;
    return Math.min(1, connections / (total * 2));
  }

  /**
   * Identify symbolic gaps
   */
  private identifySymbolicGaps(chapter: number): SymbolicGap[] {
    const gaps: SymbolicGap[] = [];
    
    // Check for unfulfilled foreshadowing
    this.foreshadowingHints.forEach(hint => {
      if (chapter - hint.chapter > 10) {
        gaps.push({
          type: 'unfulfilled-foreshadowing',
          chapter,
          description: `Foreshadowing from chapter ${hint.chapter} remains unfulfilled`,
          severity: 7,
          suggestion: 'Consider fulfilling this foreshadowing soon'
        });
      }
    });
    
    return gaps;
  }

  // ===== MOTIF MANAGEMENT =====

  /**
   * Suggest motif placement
   */
  public suggestMotifPlacement(motifName: string, targetChapter: number): MotifPlacement | null {
    const motif = Array.from(this.elements.values()).find(e => e.name === motifName);
    
    if (!motif) return null;
    
    const placement: MotifPlacement = {
      motif,
      suggestedPlacement: [
        {
          chapter: targetChapter,
          context: 'early in chapter',
          method: 'echo',
          description: `Subtle reference to ${motif.name} echoing earlier appearance`
        }
      ],
      reasoning: `Reinforcing ${motif.name} for thematic coherence`,
      expectedEffect: 'Strengthen thematic resonance'
    };
    
    return placement;
  }

  /**
   * Evolve symbolic element
   */
  public evolveSymbolicElement(elementId: string, newMeaning: string, chapter: number, triggerEvent: string): void {
    const element = this.elements.get(elementId);
    
    if (element) {
      const evolution: SymbolicEvolution = {
        chapter,
        oldMeaning: element.currentMeaning,
        newMeaning,
        context: triggerEvent,
        triggerEvent,
        transformationType: 'gradual'
      };
      
      element.evolution.push(evolution);
      element.currentMeaning = newMeaning;
    }
  }

  // ===== ANALYSIS & REPORTING =====

  /**
   * Generate symbolic analysis report
   */
  public generateSymbolicReport(): string {
    const report = {
      totalElements: this.elements.size,
      totalThemes: this.themes.size,
      foreshadowingHints: this.foreshadowingHints.size,
      payoffConnections: this.payoffConnections.length,
      symbolDensity: this.calculateAverageSymbolicDensity(),
      mostFrequentElements: this.getMostFrequentElements(5),
      activeThemes: this.getActiveThemes(),
      unfulfilledForeshadowing: this.getUnfulfilledForeshadowing()
    };
    
    return JSON.stringify(report, null, 2);
  }

  /**
   * Calculate average symbolic density
   */
  private calculateAverageSymbolicDensity(): number {
    if (this.analysisHistory.length === 0) return 0;
    
    return this.analysisHistory.reduce((sum, a) => sum + a.symbolicDensity, 0) / this.analysisHistory.length;
  }

  /**
   * Get most frequent elements
   */
  private getMostFrequentElements(limit: number): SymbolicElement[] {
    return Array.from(this.elements.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }

  /**
   * Get active themes
   */
  private getActiveThemes(): Theme[] {
    return Array.from(this.themes.values())
      .filter(t => t.currentStance !== 'resolved');
  }

  /**
   * Get unfulfilled foreshadowing
   */
  private getUnfulfilledForeshadowing(): ForeshadowingHint[] {
    return Array.from(this.foreshadowingHints.values())
      .filter(h => {
        const hasPayoff = this.payoffConnections.some(p => p.foreshadowingId === h.id);
        return !hasPayoff;
      });
  }

  /**
   * Get all symbolic elements
   */
  public getAllElements(): SymbolicElement[] {
    return Array.from(this.elements.values());
  }

  /**
   * Get all themes
   */
  public getAllThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Get symbolic mapping
   */
  public getSymbolicMapping(): SymbolicMapping {
    return this.symbolicMapping;
  }

  /**
   * Get analysis history
   */
  public getAnalysisHistory(): SymbolicAnalysis[] {
    return this.analysisHistory;
  }

  /**
   * Clear all data (for testing or reset)
   */
  public clearAllData(): void {
    this.elements.clear();
    this.themes.clear();
    this.foreshadowingHints.clear();
    this.payoffConnections = [];
    this.analysisHistory = [];
  }
}