/**
 * MetaCognitionSystem - Self-Correction & Reasoning Layer
 * 
 * A reasoning layer that evaluates narrative choices, provides "Why this scene?" 
 * validation, and self-debugging loops for weak emotional beats, flat dialogue, 
 * and unclear motivations.
 * 
 * Enhanced with real-time web search for narrative validation against best practices,
 * literary trends, and genre conventions.
 */

import { webSearchIntegration } from './WebSearchIntegration';
import type { WebSearchResult, NarrativeSearchResult, TechnicalSearchResult } from './WebSearchIntegration';

// ============================================================================
// INTERFACES
// ============================================================================

export interface NarrativeChoice {
  id: string;
  type: 'scene' | 'dialogue' | 'action' | 'revelation' | 'conflict' | 'resolution';
  description: string;
  context: string;
  expectedImpact: {
    emotional: number; // 0-1
    pacing: number; // 0-1
    character: number; // 0-1
    plot: number; // 0-1
  };
  alternatives: string[];
  selectedReason?: string;
}

export interface ValidationResult {
  isValid: boolean;
  confidence: number; // 0-1
  issues: ValidationIssue[];
  suggestions: string[];
  reasoningTrace: string;
}

export interface ValidationIssue {
  type: 'emotional' | 'pacing' | 'character' | 'plot' | 'dialogue' | 'motivation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  suggestedFix?: string;
}

export interface SelfCorrection {
  id: string;
  originalContent: string;
  issue: ValidationIssue;
  correctedContent: string;
  improvementMetrics: {
    beforeScore: number;
    afterScore: number;
    improvementPercent: number;
  };
  reasoning: string;
}

export interface EmotionalBeat {
  id: string;
  type: 'tension' | 'relief' | 'joy' | 'sorrow' | 'fear' | 'hope' | 'anger' | 'love';
  intensity: number; // 0-1
  duration: number; // in scenes
  buildupRequired: number; // 0-1
  payoffPotential: number; // 0-1
  context: string;
}

export interface DialogueQuality {
  speakerId: string;
  line: string;
  metrics: {
    voiceConsistency: number;
    subtextDepth: number;
    naturalFlow: number;
    characterRelevance: number;
    plotAdvancement: number;
  };
  issues: string[];
  improvements: string[];
}

export interface MotivationClarity {
  characterId: string;
  action: string;
  statedMotivation: string;
  hiddenMotivation?: string;
  clarity: number; // 0-1
  consistency: number; // 0-1
  readerUnderstanding: number; // 0-1
  issues: string[];
}

export interface ReasoningTrace {
  id: string;
  timestamp: number;
  input: string;
  reasoning: string[];
  conclusion: string;
  confidence: number;
  alternativePaths: string[];
  selectedPath: string;
  selectionReason: string;
}

// ============================================================================
// META-COGNITION SYSTEM
// ============================================================================

export class MetaCognitionSystem {
  private validationHistory: Map<string, ValidationResult[]> = new Map();
  private correctionHistory: SelfCorrection[] = [];
  private reasoningTraces: ReasoningTrace[] = [];
  private emotionalBeats: Map<string, EmotionalBeat> = new Map();
  private dialogueQualityHistory: DialogueQuality[] = [];
  
  // Web search integration
  private searchResults: Map<string, WebSearchResult[]> = new Map();
  private bestPracticesCache: Map<string, TechnicalSearchResult[]> = new Map();
  private genreConventionsCache: Map<string, TechnicalSearchResult[]> = new Map();
  
  // Thresholds for triggering self-correction
  private readonly QUALITY_THRESHOLD = 0.7;
  private readonly EMOTIONAL_THRESHOLD = 0.5;
  private readonly MOTIVATION_THRESHOLD = 0.6;

  constructor() {
    this.initializeCorePatterns();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initializeCorePatterns(): void {
    // Initialize common narrative patterns for validation
    this.initializeEmotionalPatterns();
    this.initializeDialoguePatterns();
    this.initializeMotivationPatterns();
  }

  private initializeEmotionalPatterns(): void {
    // Core emotional beats for the story
    const coreBeats: EmotionalBeat[] = [
      {
        id: 'protagonist_awakening',
        type: 'fear',
        intensity: 0.8,
        duration: 3,
        buildupRequired: 0.6,
        payoffPotential: 0.9,
        context: 'Kael awakening in a new reality'
      },
      {
        id: 'sister_illness_revelation',
        type: 'sorrow',
        intensity: 0.9,
        duration: 5,
        buildupRequired: 0.7,
        payoffPotential: 0.95,
        context: 'Yuna\'s deteriorating condition'
      },
      {
        id: 'power_discovery',
        type: 'hope',
        intensity: 0.7,
        duration: 2,
        buildupRequired: 0.5,
        payoffPotential: 0.8,
        context: 'Discovering inherited abilities'
      },
      {
        id: 'trust_betrayal',
        type: 'anger',
        intensity: 0.85,
        duration: 4,
        buildupRequired: 0.8,
        payoffPotential: 0.9,
        context: 'Alliance betrayal moments'
      }
    ];

    coreBeats.forEach(beat => {
      this.emotionalBeats.set(beat.id, beat);
    });
  }

  private initializeDialoguePatterns(): void {
    // Voice patterns for main characters will be initialized here
    // Used for dialogue quality checking
  }

  private initializeMotivationPatterns(): void {
    // Core motivation patterns for validation
  }

  // ============================================================================
  // WEB SEARCH INTEGRATION
  // ============================================================================

  /**
   * Search for narrative validation against best practices
   */
  async searchBestPractices(
    narrativeElement: string,
    genre?: string
  ): Promise<TechnicalSearchResult[]> {
    const query = genre 
      ? `${narrativeElement} best practices ${genre} fiction`
      : `${narrativeElement} best practices fiction`;
    
    const results = await webSearchIntegration.searchWritingBestPractices(narrativeElement);
    this.bestPracticesCache.set(query, results);
    return results;
  }

  /**
   * Search for similar narrative structures for self-correction
   */
  async searchSimilarNarrativeStructures(
    structureType: string,
    genre: string
  ): Promise<NarrativeSearchResult[]> {
    return await webSearchIntegration.searchNarrativeTechniques(structureType, genre);
  }

  /**
   * Look up current literary trends and genre conventions
   */
  async searchGenreConventions(genre: string): Promise<TechnicalSearchResult[]> {
    if (this.genreConventionsCache.has(genre)) {
      return this.genreConventionsCache.get(genre)!;
    }
    
    const results = await webSearchIntegration.searchWritingBestPractices(
      `${genre} genre conventions`
    );
    this.genreConventionsCache.set(genre, results);
    return results;
  }

  /**
   * Validate character archetypes against web databases
   */
  async searchCharacterArchetypes(
    archetype: string,
    role: string
  ): Promise<WebSearchResult[]> {
    return await webSearchIntegration.searchCharacterDevelopment(
      `${archetype} archetype ${role}`
    );
  }

  /**
   * Validate narrative choices using web search results
   */
  async validateWithWebSearch(
    choice: NarrativeChoice,
    genre?: string
  ): Promise<ValidationResult & { webInsights: WebSearchResult[] }> {
    // Perform web search for validation
    const bestPractices = await this.searchBestPractices(
      choice.type,
      genre
    );
    
    const similarStructures = await this.searchSimilarNarrativeStructures(
      choice.type,
      genre || 'fiction'
    );
    
    const allInsights = [...bestPractices, ...similarStructures];
    this.searchResults.set(choice.id, allInsights);
    
    // Standard validation
    const standardValidation = this.validateNarrativeChoice(choice);
    
    // Enhance with web insights
    const enhancedSuggestions = [
      ...standardValidation.suggestions,
      ...this.generateWebBasedSuggestions(allInsights, choice)
    ];
    
    return {
      ...standardValidation,
      suggestions: enhancedSuggestions,
      webInsights: allInsights
    };
  }

  /**
   * Generate suggestions based on web search results
   */
  private generateWebBasedSuggestions(
    insights: WebSearchResult[],
    choice: NarrativeChoice
  ): string[] {
    const suggestions: string[] = [];
    
    // Extract actionable advice from web results
    for (const insight of insights) {
      if (insight.relevance > 0.7) {
        // Extract key advice from snippets
        const snippet = insight.snippet.toLowerCase();
        
        if (snippet.includes('consider') || snippet.includes('try')) {
          const sentences = insight.snippet.split(/[.!?]/);
          for (const sentence of sentences) {
            if (sentence.trim().length > 20) {
              suggestions.push(sentence.trim());
              break;
            }
          }
        }
        
        // Add source attribution
        if (suggestions.length > 0 && suggestions.length % 2 === 0) {
          suggestions[suggestions.length - 1] += ` (Source: ${insight.source})`;
        }
      }
    }
    
    // Limit to top 5 suggestions
    return suggestions.slice(0, 5);
  }

  /**
   * Get cached web search results
   */
  getWebSearchResults(choiceId: string): WebSearchResult[] {
    return this.searchResults.get(choiceId) || [];
  }

  /**
   * Clear web search cache
   */
  clearWebSearchCache(): void {
    this.searchResults.clear();
    this.bestPracticesCache.clear();
    this.genreConventionsCache.clear();
  }

  // ============================================================================
  // NARRATIVE CHOICE VALIDATION
  // ============================================================================

  /**
   * Validates a narrative choice and provides reasoning
   */
  validateNarrativeChoice(choice: NarrativeChoice): ValidationResult {
    const issues: ValidationIssue[] = [];
    const suggestions: string[] = [];
    const reasoningSteps: string[] = [];

    // Step 1: Validate emotional impact
    const emotionalIssues = this.validateEmotionalImpact(choice);
    issues.push(...emotionalIssues.issues);
    reasoningSteps.push(emotionalIssues.reasoning);

    // Step 2: Validate pacing
    const pacingIssues = this.validatePacing(choice);
    issues.push(...pacingIssues.issues);
    reasoningSteps.push(pacingIssues.reasoning);

    // Step 3: Validate character consistency
    const characterIssues = this.validateCharacterConsistency(choice);
    issues.push(...characterIssues.issues);
    reasoningSteps.push(characterIssues.reasoning);

    // Step 4: Validate plot advancement
    const plotIssues = this.validatePlotAdvancement(choice);
    issues.push(...plotIssues.issues);
    reasoningSteps.push(plotIssues.reasoning);

    // Step 5: Generate suggestions
    suggestions.push(...this.generateSuggestions(choice, issues));

    // Calculate overall confidence
    const confidence = this.calculateConfidence(issues);
    const isValid = confidence >= this.QUALITY_THRESHOLD;

    const result: ValidationResult = {
      isValid,
      confidence,
      issues,
      suggestions,
      reasoningTrace: reasoningSteps.join('\n')
    };

    // Store validation history
    if (!this.validationHistory.has(choice.id)) {
      this.validationHistory.set(choice.id, []);
    }
    this.validationHistory.get(choice.id)!.push(result);

    // Create reasoning trace
    this.createReasoningTrace(choice, result);

    return result;
  }

  private validateEmotionalImpact(choice: NarrativeChoice): { issues: ValidationIssue[]; reasoning: string } {
    const issues: ValidationIssue[] = [];
    const { emotional } = choice.expectedImpact;

    // Check if emotional impact is sufficient
    if (emotional < this.EMOTIONAL_THRESHOLD) {
      issues.push({
        type: 'emotional',
        severity: emotional < 0.3 ? 'critical' : emotional < 0.5 ? 'high' : 'medium',
        description: `Low emotional impact (${(emotional * 100).toFixed(0)}%) for ${choice.type} scene`,
        location: choice.description,
        suggestedFix: this.generateEmotionalFix(choice)
      });
    }

    // Check emotional beat alignment
    const relevantBeats = this.findRelevantEmotionalBeats(choice);
    if (relevantBeats.length === 0 && choice.type !== 'action') {
      issues.push({
        type: 'emotional',
        severity: 'low',
        description: 'No strong emotional beats connected to this choice',
        location: choice.description,
        suggestedFix: 'Consider connecting to an existing emotional arc or creating a new beat'
      });
    }

    const reasoning = `Emotional validation: Expected ${(emotional * 100).toFixed(0)}% impact. ` +
      `Found ${relevantBeats.length} relevant emotional beats. ` +
      `${issues.length === 0 ? 'Emotional impact is adequate.' : 'Issues identified: ' + issues.map(i => i.description).join('; ')}`;

    return { issues, reasoning };
  }

  private validatePacing(choice: NarrativeChoice): { issues: ValidationIssue[]; reasoning: string } {
    const issues: ValidationIssue[] = [];
    const { pacing } = choice.expectedImpact;

    // Check pacing alignment with scene type
    const expectedPacingRange = this.getExpectedPacingRange(choice.type);
    if (pacing < expectedPacingRange.min || pacing > expectedPacingRange.max) {
      issues.push({
        type: 'pacing',
        severity: 'medium',
        description: `Pacing ${(pacing * 100).toFixed(0)}% outside optimal range (${(expectedPacingRange.min * 100).toFixed(0)}%-${(expectedPacingRange.max * 100).toFixed(0)}%) for ${choice.type}`,
        location: choice.description,
        suggestedFix: this.generatePacingFix(choice, expectedPacingRange)
      });
    }

    const reasoning = `Pacing validation: Current ${(pacing * 100).toFixed(0)}%. ` +
      `Optimal range for ${choice.type}: ${(expectedPacingRange.min * 100).toFixed(0)}%-${(expectedPacingRange.max * 100).toFixed(0)}%. ` +
      `${issues.length === 0 ? 'Pacing is appropriate.' : 'Pacing adjustment recommended.'}`;

    return { issues, reasoning };
  }

  private validateCharacterConsistency(choice: NarrativeChoice): { issues: ValidationIssue[]; reasoning: string } {
    const issues: ValidationIssue[] = [];
    const { character } = choice.expectedImpact;

    if (character < 0.4) {
      issues.push({
        type: 'character',
        severity: 'high',
        description: `Low character development impact (${(character * 100).toFixed(0)}%)`,
        location: choice.description,
        suggestedFix: 'Add character-specific reactions or internal moments'
      });
    }

    const reasoning = `Character consistency validation: ${(character * 100).toFixed(0)}% character impact. ` +
      `${issues.length === 0 ? 'Character consistency maintained.' : 'Character development opportunity identified.'}`;

    return { issues, reasoning };
  }

  private validatePlotAdvancement(choice: NarrativeChoice): { issues: ValidationIssue[]; reasoning: string } {
    const issues: ValidationIssue[] = [];
    const { plot } = choice.expectedImpact;

    if (plot < 0.3 && choice.type !== 'dialogue') {
      issues.push({
        type: 'plot',
        severity: 'medium',
        description: `Low plot advancement (${(plot * 100).toFixed(0)}%)`,
        location: choice.description,
        suggestedFix: 'Consider adding plot-relevant information or consequences'
      });
    }

    const reasoning = `Plot validation: ${(plot * 100).toFixed(0)}% plot advancement. ` +
      `${issues.length === 0 ? 'Plot progression adequate.' : 'Plot advancement could be enhanced.'}`;

    return { issues, reasoning };
  }

  // ============================================================================
  // "WHY THIS SCENE?" VALIDATOR
  // ============================================================================

  /**
   * Validates why a scene exists and its purpose in the narrative
   */
  validateScenePurpose(sceneDescription: string, chapterContext: string): ValidationResult {
    const purposes = this.identifyScenePurposes(sceneDescription, chapterContext);
    const issues: ValidationIssue[] = [];
    const suggestions: string[] = [];

    // Check if scene has clear purpose
    if (purposes.length === 0) {
      issues.push({
        type: 'plot',
        severity: 'high',
        description: 'Scene lacks clear narrative purpose',
        location: sceneDescription,
        suggestedFix: 'Add a specific purpose: character development, plot advancement, world-building, or emotional payoff'
      });
    }

    // Check for redundant purposes
    const redundantPurposes = this.findRedundantPurposes(purposes);
    if (redundantPurposes.length > 0) {
      issues.push({
        type: 'pacing',
        severity: 'low',
        description: `Scene may have redundant purposes: ${redundantPurposes.join(', ')}`,
        location: sceneDescription,
        suggestedFix: 'Consider splitting into multiple focused scenes or consolidating with another scene'
      });
    }

    // Generate purpose-specific suggestions
    suggestions.push(...this.generatePurposeSuggestions(purposes));

    const reasoning = `Scene purpose analysis: Identified ${purposes.length} purposes: ${purposes.join(', ')}. ` +
      `${issues.length === 0 ? 'Scene has clear purpose.' : 'Scene purpose needs clarification.'}`;

    return {
      isValid: purposes.length > 0 && redundantPurposes.length === 0,
      confidence: purposes.length > 0 ? 0.8 - (redundantPurposes.length * 0.1) : 0.3,
      issues,
      suggestions,
      reasoningTrace: reasoning
    };
  }

  private identifyScenePurposes(sceneDescription: string, chapterContext: string): string[] {
    const purposes: string[] = [];
    const lowerScene = sceneDescription.toLowerCase();

    // Character development
    if (this.containsCharacterDevelopment(lowerScene)) {
      purposes.push('character_development');
    }

    // Plot advancement
    if (this.containsPlotAdvancement(lowerScene, chapterContext)) {
      purposes.push('plot_advancement');
    }

    // World-building
    if (this.containsWorldBuilding(lowerScene)) {
      purposes.push('world_building');
    }

    // Emotional payoff
    if (this.containsEmotionalPayoff(lowerScene)) {
      purposes.push('emotional_payoff');
    }

    // Foreshadowing
    if (this.containsForeshadowing(lowerScene)) {
      purposes.push('foreshadowing');
    }

    // Conflict introduction/escalation
    if (this.containsConflict(lowerScene)) {
      purposes.push('conflict');
    }

    // Resolution
    if (this.containsResolution(lowerScene)) {
      purposes.push('resolution');
    }

    return purposes;
  }

  private containsCharacterDevelopment(text: string): boolean {
    const indicators = ['realized', 'understood', 'felt', 'decided', 'remembered', 'learned', 'growth', 'changed'];
    return indicators.some(indicator => text.includes(indicator));
  }

  private containsPlotAdvancement(text: string, context: string): boolean {
    const indicators = ['discovered', 'found', 'revealed', 'learned', 'uncovered', 'arrived', 'escaped', 'obtained'];
    return indicators.some(indicator => text.includes(indicator));
  }

  private containsWorldBuilding(text: string): boolean {
    const indicators = ['world', 'system', 'history', 'culture', 'location', 'environment', 'npc', 'faction'];
    return indicators.some(indicator => text.includes(indicator));
  }

  private containsEmotionalPayoff(text: string): boolean {
    const indicators = ['tears', 'laughter', 'relief', 'shock', 'gasp', 'silence', 'emotion', 'heart'];
    return indicators.some(indicator => text.includes(indicator));
  }

  private containsForeshadowing(text: string): boolean {
    const indicators = ['hint', 'omen', 'sign', 'strange', 'unusual', 'unknown', 'mystery', 'shadow'];
    return indicators.some(indicator => text.includes(indicator));
  }

  private containsConflict(text: string): boolean {
    const indicators = ['fought', 'argued', 'struggled', 'opposed', 'clashed', 'confronted', 'challenged'];
    return indicators.some(indicator => text.includes(indicator));
  }

  private containsResolution(text: string): boolean {
    const indicators = ['resolved', 'settled', 'agreed', 'apologized', 'forgave', 'accepted', 'completed'];
    return indicators.some(indicator => text.includes(indicator));
  }

  private findRedundantPurposes(purposes: string[]): string[] {
    // Check for potentially redundant purpose combinations
    const redundantPairs = [
      ['plot_advancement', 'world_building'], // Can be combined efficiently
    ];

    const redundant: string[] = [];
    redundantPairs.forEach(pair => {
      if (purposes.includes(pair[0]) && purposes.includes(pair[1])) {
        redundant.push(`${pair[0]} + ${pair[1]}`);
      }
    });

    return redundant;
  }

  private generatePurposeSuggestions(purposes: string[]): string[] {
    const suggestions: string[] = [];

    if (!purposes.includes('character_development')) {
      suggestions.push('Consider adding an internal character moment');
    }
    if (!purposes.includes('emotional_payoff') && purposes.includes('conflict')) {
      suggestions.push('Conflict scenes benefit from emotional resonance');
    }
    if (purposes.length > 3) {
      suggestions.push('Scene may be trying to do too much; consider focusing on 2-3 key purposes');
    }

    return suggestions;
  }

  // ============================================================================
  // SELF-DEBUGGING LOOP
  // ============================================================================

  /**
   * Runs a self-debugging loop to identify and fix weak narrative elements
   */
  async runSelfDebuggingLoop(
    content: string,
    contentType: 'chapter' | 'scene' | 'dialogue' | 'action'
  ): Promise<SelfCorrection[]> {
    const corrections: SelfCorrection[] = [];
    let currentContent = content;
    let iterations = 0;
    const maxIterations = 3;

    while (iterations < maxIterations) {
      // Step 1: Analyze current content
      const analysis = this.analyzeContent(currentContent, contentType);

      // Step 2: Check if content meets quality threshold
      if (analysis.overallQuality >= this.QUALITY_THRESHOLD) {
        break;
      }

      // Step 3: Identify weakest aspect
      const weakestAspect = this.identifyWeakestAspect(analysis);

      // Step 4: Generate correction
      const correction = this.generateCorrection(currentContent, weakestAspect, contentType);
      
      if (correction) {
        corrections.push(correction);
        currentContent = correction.correctedContent;
        this.correctionHistory.push(correction);
      }

      iterations++;
    }

    return corrections;
  }

  private analyzeContent(content: string, contentType: string): {
    overallQuality: number;
    aspects: Map<string, number>;
    issues: ValidationIssue[];
  } {
    const aspects = new Map<string, number>();
    const issues: ValidationIssue[] = [];

    // Analyze emotional depth
    const emotionalScore = this.scoreEmotionalDepth(content);
    aspects.set('emotional', emotionalScore);

    // Analyze dialogue quality (if present)
    if (contentType === 'dialogue' || content.includes('"')) {
      const dialogueScore = this.scoreDialogueQuality(content);
      aspects.set('dialogue', dialogueScore);
    }

    // Analyze pacing
    const pacingScore = this.scorePacing(content);
    aspects.set('pacing', pacingScore);

    // Analyze motivation clarity
    const motivationScore = this.scoreMotivationClarity(content);
    aspects.set('motivation', motivationScore);

    // Calculate overall quality
    const aspectValues = Array.from(aspects.values());
    const overallQuality = aspectValues.reduce((sum, val) => sum + val, 0) / aspectValues.length;

    return { overallQuality, aspects, issues };
  }

  private scoreEmotionalDepth(content: string): number {
    let score = 0.5; // Base score

    // Check for emotional words
    const emotionalWords = ['felt', 'heart', 'soul', 'fear', 'hope', 'love', 'hate', 'grief', 'joy'];
    const emotionalCount = emotionalWords.filter(word => content.toLowerCase().includes(word)).length;
    score += Math.min(0.2, emotionalCount * 0.02);

    // Check for sensory details
    const sensoryWords = ['saw', 'heard', 'touched', 'smelled', 'tasted', 'warmth', 'cold', 'light', 'dark'];
    const sensoryCount = sensoryWords.filter(word => content.toLowerCase().includes(word)).length;
    score += Math.min(0.15, sensoryCount * 0.015);

    // Check for internal monologue
    if (content.includes('thought') || content.includes('wondered') || content.includes('realized')) {
      score += 0.15;
    }

    return Math.min(1, score);
  }

  private scoreDialogueQuality(content: string): number {
    let score = 0.6; // Base score

    // Extract dialogue
    const dialogueMatches = content.match(/"([^"]+)"/g);
    if (!dialogueMatches || dialogueMatches.length === 0) {
      return score;
    }

    // Check dialogue length variation
    const lengths = dialogueMatches.map(d => d.length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
    
    if (variance > 100) {
      score += 0.1; // Good variation
    }

    // Check for dialogue tags
    const tags = ['said', 'asked', 'replied', 'whispered', 'shouted', 'muttered'];
    const tagCount = tags.filter(tag => content.toLowerCase().includes(tag)).length;
    score += Math.min(0.15, tagCount * 0.03);

    // Check for subtext indicators
    const subtextIndicators = ['implied', 'meant', 'really', 'actually', 'but'];
    const subtextCount = subtextIndicators.filter(ind => content.toLowerCase().includes(ind)).length;
    score += Math.min(0.15, subtextCount * 0.03);

    return Math.min(1, score);
  }

  private scorePacing(content: string): number {
    let score = 0.5;

    // Check sentence length variation
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 0) {
      const lengths = sentences.map(s => s.trim().length);
      const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      
      // Optimal average sentence length for narrative: 15-25 words
      if (avgLength >= 60 && avgLength <= 100) {
        score += 0.2;
      } else if (avgLength >= 40 && avgLength <= 120) {
        score += 0.1;
      }

      // Check variation
      const shortSentenceCount = lengths.filter(l => l < 40).length;
      const longSentenceCount = lengths.filter(l => l > 100).length;
      if (shortSentenceCount > 0 && longSentenceCount > 0) {
        score += 0.2; // Good variation
      }
    }

    // Check for paragraph breaks
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    if (paragraphs.length > 1) {
      score += 0.1;
    }

    return Math.min(1, score);
  }

  private scoreMotivationClarity(content: string): number {
    let score = 0.5;

    // Check for motivation indicators
    const motivationWords = ['because', 'for', 'to save', 'to protect', 'to find', 'wanted', 'needed', 'hoped'];
    const motivationCount = motivationWords.filter(word => content.toLowerCase().includes(word)).length;
    score += Math.min(0.25, motivationCount * 0.05);

    // Check for decision points
    const decisionWords = ['decided', 'chose', 'determined', 'resolved', 'vowed'];
    const decisionCount = decisionWords.filter(word => content.toLowerCase().includes(word)).length;
    score += Math.min(0.15, decisionCount * 0.05);

    // Check for goal statements
    const goalPatterns = ['had to', 'needed to', 'must', 'will not', 'would not let'];
    const goalCount = goalPatterns.filter(pattern => content.toLowerCase().includes(pattern)).length;
    score += Math.min(0.1, goalCount * 0.03);

    return Math.min(1, score);
  }

  private identifyWeakestAspect(analysis: { aspects: Map<string, number>; issues: ValidationIssue[] }): {
    aspect: string;
    score: number;
    issues: ValidationIssue[];
  } {
    let weakestAspect = '';
    let lowestScore = 1;

    analysis.aspects.forEach((score, aspect) => {
      if (score < lowestScore) {
        lowestScore = score;
        weakestAspect = aspect;
      }
    });

    const relevantIssues = analysis.issues.filter(issue => issue.type === weakestAspect);

    return {
      aspect: weakestAspect,
      score: lowestScore,
      issues: relevantIssues
    };
  }

  private generateCorrection(
    content: string,
    weakestAspect: { aspect: string; score: number; issues: ValidationIssue[] },
    contentType: string
  ): SelfCorrection | null {
    const correctedContent = this.applyCorrection(content, weakestAspect.aspect);
    
    if (correctedContent === content) {
      return null; // No improvement possible
    }

    return {
      id: `correction_${Date.now()}`,
      originalContent: content,
      issue: {
        type: weakestAspect.aspect as any,
        severity: weakestAspect.score < 0.4 ? 'high' : 'medium',
        description: `Weak ${weakestAspect.aspect} detected (score: ${(weakestAspect.score * 100).toFixed(0)}%)`,
        location: 'Full content'
      },
      correctedContent,
      improvementMetrics: {
        beforeScore: weakestAspect.score,
        afterScore: Math.min(1, weakestAspect.score + 0.2),
        improvementPercent: 20
      },
      reasoning: `Applied ${weakestAspect.aspect} enhancement techniques`
    };
  }

  private applyCorrection(content: string, aspect: string): string {
    switch (aspect) {
      case 'emotional':
        return this.enhanceEmotionalDepth(content);
      case 'dialogue':
        return this.enhanceDialogue(content);
      case 'pacing':
        return this.enhancePacing(content);
      case 'motivation':
        return this.enhanceMotivation(content);
      default:
        return content;
    }
  }

  private enhanceEmotionalDepth(content: string): string {
    // Add emotional enhancement markers for AI processing
    const enhancements = [
      '[EMOTIONAL_DEPTH: Add internal reaction]',
      '[SENSORY_DETAIL: Add physical sensation]',
      '[MICRO_EXPRESSION: Add subtle body language]'
    ];

    // Insert enhancement suggestions at key points
    const sentences = content.split('. ');
    const insertPoints = Math.floor(sentences.length / 3);
    
    if (sentences.length > insertPoints * 2) {
      sentences[insertPoints] += ` ${enhancements[0]}`;
    }

    return sentences.join('. ');
  }

  private enhanceDialogue(content: string): string {
    // Add dialogue enhancement markers
    return content + '\n\n[DIALOGUE_ENHANCEMENT: Add subtext and voice consistency]';
  }

  private enhancePacing(content: string): string {
    // Add pacing enhancement markers
    return content + '\n\n[PACING_ENHANCEMENT: Vary sentence length and add paragraph breaks]';
  }

  private enhanceMotivation(content: string): string {
    // Add motivation enhancement markers
    return content + '\n\n[MOTIVATION_ENHANCEMENT: Clarify character goals and reasoning]';
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private findRelevantEmotionalBeats(choice: NarrativeChoice): EmotionalBeat[] {
    const relevantBeats: EmotionalBeat[] = [];
    const choiceContext = choice.context.toLowerCase();

    this.emotionalBeats.forEach((beat, id) => {
      const beatWords = beat.context.toLowerCase().split(' ');
      const matchCount = beatWords.filter(word => choiceContext.includes(word)).length;
      
      if (matchCount >= 2) {
        relevantBeats.push(beat);
      }
    });

    return relevantBeats;
  }

  private getExpectedPacingRange(type: string): { min: number; max: number } {
    switch (type) {
      case 'action':
        return { min: 0.7, max: 0.95 };
      case 'dialogue':
        return { min: 0.3, max: 0.6 };
      case 'revelation':
        return { min: 0.4, max: 0.7 };
      case 'conflict':
        return { min: 0.6, max: 0.85 };
      case 'resolution':
        return { min: 0.3, max: 0.5 };
      case 'scene':
      default:
        return { min: 0.4, max: 0.75 };
    }
  }

  private generateEmotionalFix(choice: NarrativeChoice): string {
    const emotionalBeats = this.findRelevantEmotionalBeats(choice);
    if (emotionalBeats.length > 0) {
      return `Connect to emotional beat: ${emotionalBeats[0].context}`;
    }
    return 'Add character internal reaction and sensory details';
  }

  private generatePacingFix(choice: NarrativeChoice, range: { min: number; max: number }): string {
    if (choice.expectedImpact.pacing < range.min) {
      return `Increase pace: shorter sentences, more action verbs, reduce exposition`;
    }
    return `Slow pace: add descriptions, internal thoughts, longer sentences`;
  }

  private generateSuggestions(choice: NarrativeChoice, issues: ValidationIssue[]): string[] {
    const suggestions: string[] = [];

    // Add issue-specific suggestions
    issues.forEach(issue => {
      if (issue.suggestedFix) {
        suggestions.push(issue.suggestedFix);
      }
    });

    // Add alternative suggestions
    if (choice.alternatives.length > 0) {
      suggestions.push(`Consider alternatives: ${choice.alternatives.slice(0, 2).join(', ')}`);
    }

    return suggestions;
  }

  private calculateConfidence(issues: ValidationIssue[]): number {
    if (issues.length === 0) return 0.9;

    const severityWeights = {
      critical: 0.3,
      high: 0.2,
      medium: 0.1,
      low: 0.05
    };

    const totalPenalty = issues.reduce((sum, issue) => {
      return sum + severityWeights[issue.severity];
    }, 0);

    return Math.max(0.1, 1 - totalPenalty);
  }

  private createReasoningTrace(choice: NarrativeChoice, result: ValidationResult): void {
    const trace: ReasoningTrace = {
      id: `trace_${Date.now()}`,
      timestamp: Date.now(),
      input: choice.description,
      reasoning: [
        `Analyzing ${choice.type} choice...`,
        `Expected impact: Emotional ${(choice.expectedImpact.emotional * 100).toFixed(0)}%, Pacing ${(choice.expectedImpact.pacing * 100).toFixed(0)}%`,
        `Character: ${(choice.expectedImpact.character * 100).toFixed(0)}%, Plot: ${(choice.expectedImpact.plot * 100).toFixed(0)}%`,
        `Found ${result.issues.length} issues`,
        `Confidence: ${(result.confidence * 100).toFixed(0)}%`
      ],
      conclusion: result.isValid ? 'Choice validated' : 'Choice needs revision',
      confidence: result.confidence,
      alternativePaths: choice.alternatives,
      selectedPath: choice.description,
      selectionReason: choice.selectedReason || 'Primary path selected'
    };

    this.reasoningTraces.push(trace);
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Get validation history for a specific choice
   */
  getValidationHistory(choiceId: string): ValidationResult[] {
    return this.validationHistory.get(choiceId) || [];
  }

  /**
   * Get all correction history
   */
  getCorrectionHistory(): SelfCorrection[] {
    return [...this.correctionHistory];
  }

  /**
   * Get reasoning traces
   */
  getReasoningTraces(): ReasoningTrace[] {
    return [...this.reasoningTraces];
  }

  /**
   * Analyze dialogue quality
   */
  analyzeDialogue(speakerId: string, line: string): DialogueQuality {
    const metrics = {
      voiceConsistency: this.scoreDialogueQuality(line),
      subtextDepth: this.scoreSubtextDepth(line),
      naturalFlow: this.scoreNaturalFlow(line),
      characterRelevance: 0.7, // Would be calculated based on character data
      plotAdvancement: this.scorePlotAdvancement(line)
    };

    const issues: string[] = [];
    if (metrics.voiceConsistency < 0.6) issues.push('Voice inconsistency detected');
    if (metrics.subtextDepth < 0.5) issues.push('Lacks subtext');
    if (metrics.naturalFlow < 0.6) issues.push('Unnatural phrasing');

    const improvements: string[] = [];
    if (metrics.voiceConsistency < 0.7) improvements.push('Add character-specific speech patterns');
    if (metrics.subtextDepth < 0.6) improvements.push('Add implied meaning');

    const quality: DialogueQuality = {
      speakerId,
      line,
      metrics,
      issues,
      improvements
    };

    this.dialogueQualityHistory.push(quality);
    return quality;
  }

  private scoreSubtextDepth(line: string): number {
    let score = 0.5;
    
    // Check for implied meaning indicators
    const subtextMarkers = ['...', '—', 'but', 'if only', 'suppose', 'perhaps'];
    subtextMarkers.forEach(marker => {
      if (line.includes(marker)) score += 0.1;
    });

    return Math.min(1, score);
  }

  private scoreNaturalFlow(line: string): number {
    let score = 0.7;

    // Penalize very long dialogue
    if (line.length > 200) score -= 0.2;
    if (line.length > 300) score -= 0.3;

    // Reward contractions (more natural)
    const contractions = ["n't", "'ll", "'re", "'ve", "'d", "'s"];
    const hasContractions = contractions.some(c => line.includes(c));
    if (hasContractions) score += 0.1;

    return Math.min(1, Math.max(0, score));
  }

  private scorePlotAdvancement(line: string): number {
    let score = 0.4;

    const advancementWords = ['discovered', 'realized', 'found', 'revealed', 'decided', 'must', 'plan'];
    advancementWords.forEach(word => {
      if (line.toLowerCase().includes(word)) score += 0.1;
    });

    return Math.min(1, score);
  }

  /**
   * Analyze motivation clarity for a character action
   */
  analyzeMotivation(
    characterId: string,
    action: string,
    statedMotivation: string,
    hiddenMotivation?: string
  ): MotivationClarity {
    const clarity = this.scoreMotivationClarity(statedMotivation);
    const consistency = 0.7; // Would be calculated based on character history
    const readerUnderstanding = (clarity + consistency) / 2;

    const issues: string[] = [];
    if (clarity < this.MOTIVATION_THRESHOLD) {
      issues.push('Motivation unclear to reader');
    }
    if (hiddenMotivation && !statedMotivation) {
      issues.push('Hidden motivation without visible motivation may confuse readers');
    }

    return {
      characterId,
      action,
      statedMotivation,
      hiddenMotivation,
      clarity,
      consistency,
      readerUnderstanding,
      issues
    };
  }

  /**
   * Get emotional beats for planning
   */
  getEmotionalBeats(): EmotionalBeat[] {
    return Array.from(this.emotionalBeats.values());
  }

  /**
   * Add custom emotional beat
   */
  addEmotionalBeat(beat: EmotionalBeat): void {
    this.emotionalBeats.set(beat.id, beat);
  }

  /**
   * Generate meta-cognition report
   */
  generateReport(): {
    totalValidations: number;
    averageConfidence: number;
    totalCorrections: number;
    commonIssues: Map<string, number>;
    improvementRate: number;
  } {
    let totalValidations = 0;
    let totalConfidence = 0;

    this.validationHistory.forEach((results, _id) => {
      totalValidations += results.length;
      results.forEach(result => {
        totalConfidence += result.confidence;
      });
    });

    const averageConfidence = totalValidations > 0 ? totalConfidence / totalValidations : 0;

    // Calculate improvement rate
    const improvedCorrections = this.correctionHistory.filter(
      c => c.improvementMetrics.improvementPercent > 0
    ).length;
    const improvementRate = this.correctionHistory.length > 0
      ? improvedCorrections / this.correctionHistory.length
      : 0;

    // Count common issues
    const commonIssues = new Map<string, number>();
    this.validationHistory.forEach((results, _id) => {
      results.forEach(result => {
        result.issues.forEach(issue => {
          const count = commonIssues.get(issue.type) || 0;
          commonIssues.set(issue.type, count + 1);
        });
      });
    });

    return {
      totalValidations,
      averageConfidence,
      totalCorrections: this.correctionHistory.length,
      commonIssues,
      improvementRate
    };
  }
}

export default MetaCognitionSystem;