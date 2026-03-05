/**
 * DialogueIntelligenceSystem - Voice Consistency & Dialogue Analysis
 * 
 * Analyzes dialogue for voice consistency, tracks character speech patterns,
 * evaluates subtext depth, and maintains dialogue quality standards.
 * 
 * Enhanced with real-time web search for authentic dialogue patterns,
 * regional speech patterns, and character voice examples.
 */

import { webSearchIntegration } from './WebSearchIntegration';
import type { WebSearchResult, TechnicalSearchResult } from './WebSearchIntegration';

// ============================================================================
// INTERFACES
// ============================================================================

export interface CharacterVoiceProfile {
  characterId: string;
  name: string;
  speechPatterns: SpeechPattern[];
  vocabularyLevel: number; // 0-1
  sentenceStructure: SentenceStyle;
  emotionalRange: EmotionalProfile;
  commonPhrases: string[];
  fillerWords: string[];
  speechRate: number; // words per minute
  subtextDepth: number; // 0-1
  formality: number; // 0-1 (0 = casual, 1 = formal)
  regionalMarkers: string[];
  idiosyncrasies: CharacterIdiosyncrasy[];
}

export interface SpeechPattern {
  pattern: string;
  frequency: number; // 0-1
  context: string[];
  examples: string[];
}

export interface SentenceStyle {
  averageLength: number; // words per sentence
  variance: number; // variance in sentence length
  prefersShort: boolean;
  prefersLong: boolean;
  rhetoricalQuestions: boolean;
  fragments: boolean;
}

export interface EmotionalProfile {
  expressiveness: number; // 0-1
  emotionalVocabulary: string[];
  angerTriggers: string[];
  sadnessIndicators: string[];
  happinessIndicators: string[];
  sarcasmFrequency: number; // 0-1
}

export interface CharacterIdiosyncrasy {
  type: 'stutter' | 'catchphrase' | 'metaphor' | 'title_usage' | 'repetition' | 'gestures';
  pattern: string;
  frequency: number; // 0-1
  examples: string[];
}

export interface DialogueAnalysis {
  speakerId: string;
  text: string;
  voiceMatch: number; // 0-1
  naturalness: number; // 0-1
  subtextScore: number; // 0-1
  emotionalResonance: number; // 0-1
  characterConsistency: number; // 0-1
  issues: DialogueIssue[];
  improvements: string[];
  metrics: DialogueMetrics;
}

export interface DialogueMetrics {
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  uniqueWords: number;
  vocabularyRichness: number;
  punctuationPatterns: PunctuationPattern[];
  questionRatio: number;
  exclamationRatio: number;
  pauseIndicators: number;
}

export interface PunctuationPattern {
  punctuation: string;
  count: number;
  frequency: number;
}

export interface DialogueIssue {
  type: 'voice_inconsistency' | 'unnatural' | 'flat' | 'ooc' | 'repetitive' | 'pacing' | 'subtext' | 'length';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  location: string;
  suggestion?: string;
}

export interface SubtextAnalysis {
  surfaceMeaning: string;
  impliedMeaning: string[];
  emotionalSubtext: string;
  powerDynamic: string;
  tension: number; // 0-1
  hiddenAgenda: string;
}

export interface ConversationFlow {
  participants: string[];
  turnCount: number;
  flowPattern: 'balanced' | 'dominated' | 'interrupting' | 'silent' | 'passive';
  energy: number; // 0-1
  tension: number; // 0-1
  progression: ConversationStage[];
}

export interface ConversationStage {
  speaker: string;
  type: 'opening' | 'development' | 'conflict' | 'resolution' | 'transition';
  emotionalShift: string;
  purpose: string;
}

// ============================================================================
// DIALOGUE INTELLIGENCE SYSTEM
// ============================================================================

export class DialogueIntelligenceSystem {
  private voiceProfiles: Map<string, CharacterVoiceProfile> = new Map();
  private dialogueHistory: DialogueAnalysis[] = [];
  
  // Web search integration
  private dialoguePatternsCache: Map<string, WebSearchResult[]> = new Map();
  private speechPatternsCache: Map<string, TechnicalSearchResult[]> = new Map();
  private regionalDialectsCache: Map<string, WebSearchResult[]> = new Map();
  private conversationStructureCache: Map<string, WebSearchResult[]> = new Map();
  private conversationHistory: Map<string, ConversationFlow[]> = new Map();
  
  // Quality thresholds
  private readonly VOICE_MATCH_THRESHOLD = 0.7;
  private readonly NATURALNESS_THRESHOLD = 0.65;
  private readonly SUBTEXT_THRESHOLD = 0.5;

  constructor() {
    this.initializeVoiceProfiles();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initializeVoiceProfiles(): void {
    // Kael's Voice Profile
    this.createVoiceProfile({
      characterId: 'kael',
      name: 'Kael',
      speechPatterns: [
        { pattern: '...', frequency: 0.15, context: ['uncertainty', 'hesitation'], examples: ['I don\'t know...', 'It\'s just...'] },
        { pattern: 'Wait,', frequency: 0.12, context: ['realization', 'interruption'], examples: ['Wait, you mean...'] },
        { pattern: 'Actually,', frequency: 0.1, context: ['correction', 'clarification'], examples: ['Actually, I think...'] }
      ],
      vocabularyLevel: 0.65,
      sentenceStructure: {
        averageLength: 14,
        variance: 6,
        prefersShort: true,
        prefersLong: false,
        rhetoricalQuestions: true,
        fragments: true
      },
      emotionalRange: {
        expressiveness: 0.6,
        emotionalVocabulary: ['worried', 'confused', 'scared', 'hopeful', 'determined'],
        angerTriggers: ['threats to family', 'betrayal', 'injustice'],
        sadnessIndicators: ['lowered voice', 'pauses', 'hedging'],
        happinessIndicators: ['enthusiastic tone', 'quicker speech'],
        sarcasmFrequency: 0.2
      },
      commonPhrases: ['I need to...', 'Let me think', 'What if', 'Maybe we could'],
      fillerWords: ['um', 'uh', 'well', 'like', 'kind of'],
      speechRate: 140,
      subtextDepth: 0.55,
      formality: 0.4,
      regionalMarkers: [],
      idiosyncrasies: [
        { type: 'repetition', pattern: 'Repeats words when uncertain', frequency: 0.2, examples: ['I... I don\'t...', 'It\'s... it\'s...'] },
        { type: 'gestures', pattern: 'Touches temple when thinking', frequency: 0.15, examples: [] }
      ]
    });

    // Yuna's Voice Profile
    this.createVoiceProfile({
      characterId: 'yuna',
      name: 'Yuna',
      speechPatterns: [
        { pattern: 'Kael,', frequency: 0.2, context: ['addressing brother'], examples: ['Kael, listen...', 'Kael, I\'m fine'] },
        { pattern: 'Don\'t worry', frequency: 0.15, context: ['reassurance'], examples: ['Don\'t worry about me'] },
        { pattern: 'I\'m fine', frequency: 0.18, context: ['deflection', 'hiding pain'], examples: ['I\'m fine, really'] }
      ],
      vocabularyLevel: 0.7,
      sentenceStructure: {
        averageLength: 12,
        variance: 4,
        prefersShort: true,
        prefersLong: false,
        rhetoricalQuestions: false,
        fragments: true
      },
      emotionalRange: {
        expressiveness: 0.5,
        emotionalVocabulary: ['tired', 'weak', 'fine', 'okay', 'worried'],
        angerTriggers: ['being protected', 'loss of autonomy'],
        sadnessIndicators: ['whisper', 'monotone', 'short answers'],
        happinessIndicators: ['smile in voice', 'lighter tone'],
        sarcasmFrequency: 0.3
      },
      commonPhrases: ['I\'m fine', 'It\'s nothing', 'Don\'t worry', 'Just tired'],
      fillerWords: ['just', 'really', 'actually', 'kind of'],
      speechRate: 130,
      subtextDepth: 0.7,
      formality: 0.5,
      regionalMarkers: [],
      idiosyncrasies: [
        { type: 'catchphrase', pattern: 'Deflects with "I\'m fine"', frequency: 0.25, examples: ['I\'m fine', 'It\'s nothing'] },
        { type: 'repetition', pattern: 'Uses "just" to minimize', frequency: 0.2, examples: ['Just a headache', 'Just tired'] }
      ]
    });

    // System Voice Profile
    this.createVoiceProfile({
      characterId: 'system',
      name: 'System Interface',
      speechPatterns: [
        { pattern: 'Alert:', frequency: 0.3, context: ['notifications'], examples: ['Alert: New ability unlocked'] },
        { pattern: 'Confirm', frequency: 0.25, context: ['confirmations'], examples: ['Confirm action?'] },
        { pattern: 'Error', frequency: 0.2, context: ['errors'], examples: ['Error: Insufficient resources'] }
      ],
      vocabularyLevel: 0.8,
      sentenceStructure: {
        averageLength: 8,
        variance: 3,
        prefersShort: true,
        prefersLong: false,
        rhetoricalQuestions: false,
        fragments: true
      },
      emotionalRange: {
        expressiveness: 0.1,
        emotionalVocabulary: [],
        angerTriggers: [],
        sadnessIndicators: [],
        happinessIndicators: [],
        sarcasmFrequency: 0
      },
      commonPhrases: ['Processing', 'Complete', 'Failed', 'Warning'],
      fillerWords: [],
      speechRate: 100,
      subtextDepth: 0.0,
      formality: 1.0,
      regionalMarkers: [],
      idiosyncrasies: []
    });

    // Mystery Entity Voice Profile
    this.createVoiceProfile({
      characterId: 'mystery_entity',
      name: 'Unknown Entity',
      speechPatterns: [
        { pattern: 'You believe...', frequency: 0.2, context: ['challenging perceptions'], examples: ['You believe you understand...'] },
        { pattern: 'The truth is...', frequency: 0.15, context: ['revelations'], examples: ['The truth is more complex'] },
        { pattern: 'Perhaps', frequency: 0.18, context: ['suggestions', 'mystical statements'], examples: ['Perhaps you are ready...'] }
      ],
      vocabularyLevel: 0.9,
      sentenceStructure: {
        averageLength: 18,
        variance: 8,
        prefersShort: false,
        prefersLong: true,
        rhetoricalQuestions: true,
        fragments: false
      },
      emotionalRange: {
        expressiveness: 0.4,
        emotionalVocabulary: ['destiny', 'purpose', 'truth', 'illusion', 'awakening'],
        angerTriggers: ['resistance', 'denial'],
        sadnessIndicators: ['regretful tone', 'weary voice'],
        happinessIndicators: ['approval', 'satisfaction'],
        sarcasmFrequency: 0.35
      },
      commonPhrases: ['Do you see?', 'Consider this', 'The cost is...', 'Destiny awaits'],
      fillerWords: [],
      speechRate: 110,
      subtextDepth: 0.9,
      formality: 0.8,
      regionalMarkers: ['archaic', 'formal'],
      idiosyncrasies: [
        { type: 'metaphor', pattern: 'Uses mystical metaphors', frequency: 0.25, examples: ['The curtain falls...', 'The shadows whisper...'] },
        { type: 'repetition', pattern: 'Echoes concepts', frequency: 0.15, examples: ['Truth... truth is what you make it'] }
      ]
    });
  }

  private createVoiceProfile(profile: CharacterVoiceProfile): void {
    this.voiceProfiles.set(profile.characterId, profile);
  }

  // ============================================================================
  // WEB SEARCH INTEGRATION
  // ============================================================================

  /**
   * Search for authentic dialogue patterns
   */
  async searchDialoguePatterns(
    dialogueType: string,
    genre?: string
  ): Promise<WebSearchResult[]> {
    const key = `${dialogueType}-${genre || 'general'}`;
    if (this.dialoguePatternsCache.has(key)) {
      return this.dialoguePatternsCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchDialoguePatterns(
      dialogueType,
      genre
    );
    this.dialoguePatternsCache.set(key, results);
    return results;
  }

  /**
   * Research regional speech patterns and dialects
   */
  async searchRegionalDialects(
    region: string,
    timePeriod?: string
  ): Promise<WebSearchResult[]> {
    const key = `${region}-${timePeriod || 'modern'}`;
    if (this.regionalDialectsCache.has(key)) {
      return this.regionalDialectsCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${region} dialect speech patterns ${timePeriod || 'modern'} fiction writing`
    );
    this.regionalDialectsCache.set(key, results);
    return results;
  }

  /**
   * Find character voice examples
   */
  async searchCharacterVoiceExamples(
    characterArchetype: string,
    personality: string
  ): Promise<TechnicalSearchResult[]> {
    const key = `${characterArchetype}-${personality}`;
    if (this.speechPatternsCache.has(key)) {
      return this.speechPatternsCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchWritingBestPractices(
      `${characterArchetype} character voice ${personality}`
    );
    this.speechPatternsCache.set(key, results);
    return results;
  }

  /**
   * Look up natural conversation structures
   */
  async searchConversationStructures(
    conversationType: string
  ): Promise<WebSearchResult[]> {
    const key = conversationType;
    if (this.conversationStructureCache.has(key)) {
      return this.conversationStructureCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${conversationType} conversation structure dialogue writing`
    );
    this.conversationStructureCache.set(key, results);
    return results;
  }

  /**
   * Enhance dialogue with web research
   */
  async analyzeDialogueWithWebResearch(
    speakerId: string,
    text: string,
    context?: string,
    genre?: string
  ): Promise<DialogueAnalysis & { webInsights: WebSearchResult[] }> {
    // Standard analysis
    const standardAnalysis = this.analyzeDialogue(speakerId, text, context);
    
    // Get web research
    const profile = this.voiceProfiles.get(speakerId);
    const archetype = profile?.characterId || 'protagonist';
    
    const patterns = await this.searchDialoguePatterns(
      text.includes('?') ? 'question' : 'statement',
      genre
    );
    
    const voiceExamples = await this.searchCharacterVoiceExamples(
      archetype,
      'dynamic'
    );
    
    const allInsights = [...patterns, ...voiceExamples];
    
    // Enhance suggestions with web insights
    const enhancedSuggestions = [...standardAnalysis.improvements];
    for (const insight of allInsights) {
      if (insight.relevance > 0.7) {
        const sentences = insight.snippet.split(/[.!?]/).filter(s => s.trim().length > 10);
        if (sentences.length > 0) {
          enhancedSuggestions.push(sentences[0].trim());
        }
      }
    }
    
    return {
      ...standardAnalysis,
      improvements: enhancedSuggestions,
      webInsights: allInsights
    };
  }

  /**
   * Get speech pattern suggestions from web
   */
  async getSpeechPatternSuggestions(
    characterId: string,
    emotion: string
  ): Promise<string[]> {
    const results = await this.searchDialoguePatterns(
      `${emotion} dialogue`,
      'fiction'
    );
    
    const suggestions: string[] = [];
    for (const result of results) {
      if (result.relevance > 0.6) {
        const matches = result.snippet.match(/["']([^"']+)["']/g);
        if (matches) {
          suggestions.push(...matches.map(m => m.replace(/["']/g, '')));
        }
      }
    }
    
    return suggestions.slice(0, 5);
  }

  /**
   * Clear web search cache
   */
  clearWebSearchCache(): void {
    this.dialoguePatternsCache.clear();
    this.speechPatternsCache.clear();
    this.regionalDialectsCache.clear();
    this.conversationStructureCache.clear();
  }

  // ============================================================================
  // VOICE PROFILE MANAGEMENT
  // ============================================================================

  getVoiceProfile(characterId: string): CharacterVoiceProfile | undefined {
    return this.voiceProfiles.get(characterId);
  }

  setVoiceProfile(profile: CharacterVoiceProfile): void {
    this.voiceProfiles.set(profile.characterId, profile);
  }

  getAllVoiceProfiles(): CharacterVoiceProfile[] {
    return Array.from(this.voiceProfiles.values());
  }

  updateVoiceProfile(characterId: string, updates: Partial<CharacterVoiceProfile>): void {
    const profile = this.voiceProfiles.get(characterId);
    if (profile) {
      Object.assign(profile, updates);
    }
  }

  // ============================================================================
  // DIALOGUE ANALYSIS
  // ============================================================================

  /**
   * Analyze a line of dialogue
   */
  analyzeDialogue(speakerId: string, text: string, context?: string): DialogueAnalysis {
    const profile = this.voiceProfiles.get(speakerId);
    
    if (!profile) {
      return this.createDefaultAnalysis(speakerId, text);
    }

    const metrics = this.calculateDialogueMetrics(text);
    const voiceMatch = this.calculateVoiceMatch(text, profile);
    const naturalness = this.calculateNaturalness(text, profile);
    const subtextScore = this.analyzeSubtext(text, profile);
    const emotionalResonance = this.calculateEmotionalResonance(text, profile);
    const characterConsistency = this.calculateCharacterConsistency(text, profile);
    
    const issues = this.identifyDialogueIssues(
      text, 
      profile, 
      { voiceMatch, naturalness, subtextScore, emotionalResonance, characterConsistency },
      metrics,
      context
    );
    
    const improvements = this.generateImprovements(issues, text, profile);

    const analysis: DialogueAnalysis = {
      speakerId,
      text,
      voiceMatch,
      naturalness,
      subtextScore,
      emotionalResonance,
      characterConsistency,
      issues,
      improvements,
      metrics
    };

    this.dialogueHistory.push(analysis);
    return analysis;
  }

  private calculateDialogueMetrics(text: string): DialogueMetrics {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const punctuation = text.match(/[.,!?;:]/g) || [];
    
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const punctuationCounts: Record<string, number> = {};
    punctuation.forEach(p => {
      punctuationCounts[p] = (punctuationCounts[p] || 0) + 1;
    });

    const punctuationPatterns: PunctuationPattern[] = Object.entries(punctuationCounts).map(([punct, count]) => ({
      punctuation: punct,
      count,
      frequency: count / punctuation.length
    }));

    const questionMarks = (text.match(/\?/g) || []).length;
    const exclamationMarks = (text.match(/!/g) || []).length;
    const pauseIndicators = (text.match(/\.{3,}|—/g) || []).length;

    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      avgSentenceLength: sentences.length > 0 ? words.length / sentences.length : 0,
      uniqueWords: uniqueWords.size,
      vocabularyRichness: words.length > 0 ? uniqueWords.size / words.length : 0,
      punctuationPatterns,
      questionRatio: sentences.length > 0 ? questionMarks / sentences.length : 0,
      exclamationRatio: sentences.length > 0 ? exclamationMarks / sentences.length : 0,
      pauseIndicators
    };
  }

  private calculateVoiceMatch(text: string, profile: CharacterVoiceProfile): number {
    let matchScore = 0.5;

    // Check sentence length match
    const metrics = this.calculateDialogueMetrics(text);
    const lengthDiff = Math.abs(metrics.avgSentenceLength - profile.sentenceStructure.averageLength);
    matchScore += Math.max(0, 0.2 - (lengthDiff / 20));

    // Check for characteristic patterns
    profile.speechPatterns.forEach(pattern => {
      if (text.includes(pattern.pattern)) {
        matchScore += 0.1 * pattern.frequency;
      }
    });

    // Check vocabulary level
    const textVocabulary = this.estimateVocabularyLevel(text);
    matchScore += Math.max(0, 0.15 - Math.abs(textVocabulary - profile.vocabularyLevel) * 0.3);

    // Check formality
    const textFormality = this.estimateFormality(text);
    matchScore += Math.max(0, 0.15 - Math.abs(textFormality - profile.formality) * 0.3);

    // Check for common phrases
    profile.commonPhrases.forEach(phrase => {
      if (text.toLowerCase().includes(phrase.toLowerCase())) {
        matchScore += 0.05;
      }
    });

    return Math.min(1, matchScore);
  }

  private calculateNaturalness(text: string, profile: CharacterVoiceProfile): number {
    let naturalness = 0.6;

    // Check for unnatural elements
    const metrics = this.calculateDialogueMetrics(text);

    // Penalize very long sentences (unless character prefers long)
    if (!profile.sentenceStructure.prefersLong && metrics.avgSentenceLength > 25) {
      naturalness -= 0.2;
    }

    // Penalize very short sentences (unless character prefers short)
    if (!profile.sentenceStructure.prefersShort && metrics.avgSentenceLength < 6) {
      naturalness -= 0.15;
    }

    // Reward contractions (more natural in speech)
    if (text.match(/[A-Z][a-z]*n't|[A-Z][a-z]*'[lrvds]/)) {
      naturalness += 0.1;
    }

    // Penalize excessive fillers
    const fillerCount = profile.fillerWords.filter(f => 
      text.toLowerCase().includes(f.toLowerCase())
    ).length;
    naturalness -= Math.min(0.2, fillerCount * 0.05);

    // Check for idiosyncrasies
    profile.idiosyncrasies.forEach((idio: CharacterIdiosyncrasy) => {
      if (this.checkIdiosyncrasy(text, idio)) {
        naturalness += 0.05 * idio.frequency;
      }
    });

    return Math.max(0, Math.min(1, naturalness));
  }

  private analyzeSubtext(text: string, profile: CharacterVoiceProfile): number {
    let subtextScore = 0.3;

    // Check for subtext indicators
    const subtextIndicators = [
      '...', '—', 'but', 'if only', 'suppose', 'perhaps',
      'maybe', 'actually', 'really', 'supposed to'
    ];
    
    subtextIndicators.forEach(indicator => {
      if (text.toLowerCase().includes(indicator)) {
        subtextScore += 0.08;
      }
    });

    // Check for rhetorical questions (often have subtext)
    if (profile.sentenceStructure.rhetoricalQuestions && text.includes('?')) {
      subtextScore += 0.1;
    }

    // Check for hedging (indicates hidden meaning)
    const hedgingWords = ['kind of', 'sort of', 'maybe', 'might', 'could be'];
    const hasHedging = hedgingWords.some(h => text.toLowerCase().includes(h));
    if (hasHedging) {
      subtextScore += 0.1;
    }

    // Check for double meanings
    if (this.hasDoubleMeaning(text, profile)) {
      subtextScore += 0.15;
    }

    return Math.min(1, subtextScore);
  }

  private calculateEmotionalResonance(text: string, profile: CharacterVoiceProfile): number {
    let resonance = 0.4;

    // Check for emotional vocabulary
    profile.emotionalRange.emotionalVocabulary.forEach(word => {
      if (text.toLowerCase().includes(word.toLowerCase())) {
        resonance += 0.1;
      }
    });

    // Check for emotional indicators
    if (profile.emotionalRange.angerTriggers.some(t => text.toLowerCase().includes(t.toLowerCase()))) {
      resonance += 0.15;
    }
    if (profile.emotionalRange.sadnessIndicators.some(i => text.toLowerCase().includes(i.toLowerCase()))) {
      resonance += 0.15;
    }
    if (profile.emotionalRange.happinessIndicators.some(i => text.toLowerCase().includes(i.toLowerCase()))) {
      resonance += 0.15;
    }

    // Check for emphasis (exclamation, italics, etc.)
    const hasEmphasis = text.includes('!') || text.includes('**') || text.includes('_');
    if (hasEmphasis) {
      resonance += 0.1;
    }

    return Math.min(1, resonance);
  }

  private calculateCharacterConsistency(text: string, profile: CharacterVoiceProfile): number {
    let consistency = 0.5;

    // Check if text matches character's typical speech patterns
    const patternMatches = profile.speechPatterns.filter(p => 
      text.includes(p.pattern)
    ).length;
    consistency += Math.min(0.2, patternMatches * 0.07);

    // Check if formality matches
    const textFormality = this.estimateFormality(text);
    const formalityMatch = 1 - Math.abs(textFormality - profile.formality);
    consistency += formalityMatch * 0.15;

    // Check if emotional expression matches
    const textEmotion = this.estimateEmotionalExpression(text);
    const emotionMatch = 1 - Math.abs(textEmotion - profile.emotionalRange.expressiveness);
    consistency += emotionMatch * 0.15;

    return Math.min(1, consistency);
  }

  private identifyDialogueIssues(
    text: string,
    profile: CharacterVoiceProfile,
    scores: { voiceMatch: number; naturalness: number; subtextScore: number; emotionalResonance: number; characterConsistency: number; },
    metrics: DialogueMetrics,
    context?: string
  ): DialogueIssue[] {
    const issues: DialogueIssue[] = [];

    // Voice consistency issues
    if (scores.voiceMatch < this.VOICE_MATCH_THRESHOLD) {
      issues.push({
        type: 'voice_inconsistency',
        severity: scores.voiceMatch < 0.4 ? 'critical' : 'major',
        description: `Voice mismatch detected (${(scores.voiceMatch * 100).toFixed(0)}% match)`,
        location: 'Full dialogue line',
        suggestion: this.generateVoiceConsistencySuggestion(text, profile)
      });
    }

    // Naturalness issues
    if (scores.naturalness < this.NATURALNESS_THRESHOLD) {
      issues.push({
        type: 'unnatural',
        severity: 'moderate',
        description: `Dialogue feels unnatural (${(scores.naturalness * 100).toFixed(0)}% naturalness)`,
        location: 'Full dialogue line',
        suggestion: 'Add contractions, vary sentence length, include speech fillers'
      });
    }

    // Flat dialogue
    if (scores.emotionalResonance < 0.4) {
      issues.push({
        type: 'flat',
        severity: 'minor',
        description: 'Dialogue lacks emotional resonance',
        location: 'Emotional impact',
        suggestion: 'Add emotional vocabulary or physical reactions'
      });
    }

    // Out of character
    if (scores.characterConsistency < 0.5) {
      issues.push({
        type: 'ooc',
        severity: 'major',
        description: 'Dialogue appears out of character',
        location: 'Character consistency',
        suggestion: 'Review character voice profile for consistent speech patterns'
      });
    }

    // Length issues
    if (metrics.wordCount > 50) {
      issues.push({
        type: 'length',
        severity: 'minor',
        description: 'Dialogue line is excessively long',
        location: 'Line length',
        suggestion: 'Consider splitting into multiple shorter lines'
      });
    }

    if (metrics.wordCount < 3) {
      issues.push({
        type: 'length',
        severity: 'minor',
        description: 'Dialogue line is too short',
        location: 'Line length',
        suggestion: 'Consider expanding for better communication'
      });
    }

    return issues;
  }

  private generateImprovements(issues: DialogueIssue[], text: string, profile: CharacterVoiceProfile): string[] {
    const improvements: string[] = [];

    issues.forEach(issue => {
      if (issue.suggestion) {
        improvements.push(issue.suggestion);
      }
    });

    // Add character-specific improvements
    if (profile.sentenceStructure.prefersShort) {
      improvements.push('Use shorter, more direct sentences');
    }
    if (profile.subtextDepth > 0.7) {
      improvements.push('Add implied meaning beneath surface dialogue');
    }
    if (profile.commonPhrases.length > 0) {
      improvements.push(`Consider using characteristic phrases: ${profile.commonPhrases.slice(0, 2).join(', ')}`);
    }

    return [...new Set(improvements)]; // Remove duplicates
  }

  // ============================================================================
  // SUBTEXT ANALYSIS
  // ============================================================================

  /**
   * Analyze subtext in dialogue
   */
  analyzeSubtextInDialogue(text: string, speakerId: string, context?: string): SubtextAnalysis {
    const profile = this.voiceProfiles.get(speakerId);
    const surfaceMeaning = this.extractSurfaceMeaning(text);
    const impliedMeaning = this.extractImpliedMeaning(text, profile, context);
    const emotionalSubtext = this.extractEmotionalSubtext(text, profile);
    const powerDynamic = this.determinePowerDynamic(text, speakerId);
    const tension = this.calculateTension(text, profile);
    const hiddenAgenda = this.inferHiddenAgenda(text, profile, context);

    return {
      surfaceMeaning,
      impliedMeaning,
      emotionalSubtext,
      powerDynamic,
      tension,
      hiddenAgenda
    };
  }

  private extractSurfaceMeaning(text: string): string {
    // Simple extraction of literal meaning
    return text.trim();
  }

  private extractImpliedMeaning(text: string, profile?: CharacterVoiceProfile, context?: string): string[] {
    const implied: string[] = [];

    // Look for common subtext patterns
    if (text.toLowerCase().includes('i\'m fine')) {
      implied.push('Speaker may be hiding problems or distress');
    }
    if (text.toLowerCase().includes('don\'t worry')) {
      implied.push('Speaker may be trying to conceal concerns');
    }
    if (text.includes('?')) {
      implied.push('Speaker may be seeking information or testing assumptions');
    }
    if (text.includes('...')) {
      implied.push('Speaker may be hesitating or withholding information');
    }

    // Character-specific implied meanings
    if (profile) {
      if (profile.characterId === 'yuna' && text.toLowerCase().includes('i\'m fine')) {
        implied.push('Yuna may be deflecting to avoid worrying others');
      }
      if (profile.characterId === 'kael' && text.includes('...')) {
        implied.push('Kael may be uncertain or struggling with understanding');
      }
    }

    return implied.length > 0 ? implied : ['No strong implied meaning detected'];
  }

  private extractEmotionalSubtext(text: string, profile?: CharacterVoiceProfile): string {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('never mind') || lowerText.includes('forget it')) {
      return 'Speaker is giving up or hiding disappointment';
    }
    if (lowerText.includes('actually')) {
      return 'Speaker may be correcting or challenging assumptions';
    }
    if (lowerText.includes('maybe') || lowerText.includes('perhaps')) {
      return 'Speaker may be uncertain or being deliberately vague';
    }

    return 'Neutral emotional tone';
  }

  private determinePowerDynamic(text: string, speakerId: string): string {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('please') || lowerText.includes('could you') || lowerText.includes('would you')) {
      return 'Speaker is in a lower or requesting position';
    }
    if (lowerText.includes('do this') || lowerText.includes('i need') || lowerText.includes('make sure')) {
      return 'Speaker is in a commanding or higher position';
    }
    if (lowerText.includes('we should') || lowerText.includes('let\'s')) {
      return 'Speaker is proposing collaboration or partnership';
    }

    return 'Neutral power dynamic';
  }

  private calculateTension(text: string, profile?: CharacterVoiceProfile): number {
    let tension = 0.3;

    // Tension indicators
    const tensionIndicators = [
      'but', 'however', 'although', 'nevertheless',
      'wait', 'actually', 'stop', 'listen',
      '...', '!', '?'
    ];

    tensionIndicators.forEach(indicator => {
      if (text.toLowerCase().includes(indicator)) {
        tension += 0.08;
      }
    });

    // Character-specific tension
    if (profile) {
      if (profile.subtextDepth > 0.3) {
        tension += 0.1;
      }
    }

    return Math.min(1, tension);
  }

  private inferHiddenAgenda(text: string, profile?: CharacterVoiceProfile, context?: string): string {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('i\'m fine') || lowerText.includes('it\'s nothing')) {
      return 'Speaker may be concealing problems or deflecting concern';
    }
    if (lowerText.includes('are you sure') || lowerText.includes('really')) {
      return 'Speaker may be doubting or seeking confirmation';
    }
    if (lowerText.includes('don\'t worry')) {
      return 'Speaker may be trying to protect others or hide truth';
    }

    return 'No clear hidden agenda detected';
  }

  // ============================================================================
  // CONVERSATION ANALYSIS
  // ============================================================================

  /**
   * Analyze conversation flow between multiple speakers
   */
  analyzeConversationFlow(dialogueLines: { speakerId: string; text: string; }[]): ConversationFlow {
    const participants = [...new Set(dialogueLines.map(d => d.speakerId))];
    const turnCount = dialogueLines.length;
    
    // Analyze turn distribution
    const turnDistribution = participants.map(speaker => ({
      speaker,
      turns: dialogueLines.filter(d => d.speakerId === speaker).length
    }));
    
    const dominantSpeaker = turnDistribution.sort((a, b) => b.turns - a.turns)[0];
    const isDominated = dominantSpeaker.turns > turnCount * 0.6;
    
    const flowPattern: ConversationFlow['flowPattern'] = isDominated
      ? 'dominated'
      : turnDistribution.every(t => t.turns === turnDistribution[0].turns)
        ? 'balanced'
        : 'passive';

    // Calculate energy
    const energy = this.calculateConversationEnergy(dialogueLines);
    
    // Calculate tension
    const tension = this.calculateConversationTension(dialogueLines);
    
    // Analyze progression
    const progression = this.analyzeConversationProgression(dialogueLines);

    const flow: ConversationFlow = {
      participants,
      turnCount,
      flowPattern,
      energy,
      tension,
      progression
    };

    // Store conversation history
    const key = participants.sort().join('-');
    if (!this.conversationHistory.has(key)) {
      this.conversationHistory.set(key, []);
    }
    this.conversationHistory.get(key)!.push(flow);

    return flow;
  }

  private calculateConversationEnergy(dialogueLines: { speakerId: string; text: string; }[]): number {
    let energy = 0.5;

    dialogueLines.forEach(line => {
      const analysis = this.analyzeDialogue(line.speakerId, line.text);
      energy += (analysis.emotionalResonance - 0.5) * 0.1;
      if (line.text.includes('!')) {
        energy += 0.05;
      }
    });

    return Math.max(0, Math.min(1, energy / dialogueLines.length));
  }

  private calculateConversationTension(dialogueLines: { speakerId: string; text: string; }[]): number {
    let tension = 0.3;

    dialogueLines.forEach(line => {
      const profile = this.voiceProfiles.get(line.speakerId);
      if (profile) {
        tension += this.calculateTension(line.text, profile);
      }
    });

    return Math.min(1, tension / dialogueLines.length);
  }

  private analyzeConversationProgression(dialogueLines: { speakerId: string; text: string; }[]): ConversationStage[] {
    const stages: ConversationStage[] = [];
    const stagesCount = Math.min(dialogueLines.length, 5);
    const segmentSize = Math.ceil(dialogueLines.length / stagesCount);

    for (let i = 0; i < stagesCount; i++) {
      const segment = dialogueLines.slice(i * segmentSize, (i + 1) * segmentSize);
      const speaker = segment[Math.floor(segment.length / 2)].speakerId;
      
      let type: ConversationStage['type'] = 'development';
      if (i === 0) type = 'opening';
      else if (i === stagesCount - 1) type = 'resolution';

      stages.push({
        speaker,
        type,
        emotionalShift: 'Moderate shift',
        purpose: 'Advancing conversation'
      });
    }

    return stages;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private estimateVocabularyLevel(text: string): number {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const longWords = words.filter(w => w.length > 6).length;
    
    if (words.length === 0) return 0.5;
    return Math.min(1, longWords / words.length + 0.3);
  }

  private estimateFormality(text: string): number {
    let formality = 0.5;

    // Formal indicators
    const formalIndicators = ['please', 'would you', 'could you', 'may I', 'sir', 'ma\'am', 'regarding'];
    formality += formalIndicators.filter(i => text.toLowerCase().includes(i)).length * 0.1;

    // Informal indicators
    const informalIndicators = ['gonna', 'wanna', 'gotta', 'kinda', 'sorta', 'yeah', 'nah', 'cuz'];
    formality -= informalIndicators.filter(i => text.toLowerCase().includes(i)).length * 0.15;

    // Contractions reduce formality
    if (text.match(/[A-Z][a-z]*n't/)) {
      formality -= 0.1;
    }

    return Math.max(0, Math.min(1, formality));
  }

  private estimateEmotionalExpression(text: string): number {
    let expression = 0.3;

    const emotionalWords = ['love', 'hate', 'fear', 'happy', 'sad', 'angry', 'worried', 'excited'];
    expression += emotionalWords.filter(w => text.toLowerCase().includes(w)).length * 0.1;

    if (text.includes('!')) expression += 0.1;
    if (text.includes('...')) expression += 0.1;

    return Math.min(1, expression);
  }

  private checkIdiosyncrasy(text: string, idio: CharacterIdiosyncrasy): boolean {
    switch (idio.type) {
      case 'stutter':
        return /(\w+)\s+\1/.test(text);
      case 'catchphrase':
        return text.toLowerCase().includes(idio.pattern.toLowerCase());
      case 'metaphor':
        return text.includes('like') || text.includes('as if');
      case 'repetition':
        return this.hasRepetition(text);
      default:
        return false;
    }
  }

  private hasRepetition(text: string): boolean {
    const words = text.toLowerCase().split(/\s+/);
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i] === words[i + 1]) {
        return true;
      }
    }
    return false;
  }

  private hasDoubleMeaning(text: string, profile: CharacterVoiceProfile): boolean {
    // Check for words that can have double meanings
    const ambiguousWords = ['fine', 'interesting', 'sure', 'right', 'okay'];
    return ambiguousWords.some(word => text.toLowerCase().includes(word));
  }

  private createDefaultAnalysis(speakerId: string, text: string): DialogueAnalysis {
    const metrics = this.calculateDialogueMetrics(text);
    
    return {
      speakerId,
      text,
      voiceMatch: 0.5,
      naturalness: 0.5,
      subtextScore: 0.3,
      emotionalResonance: 0.4,
      characterConsistency: 0.5,
      issues: [],
      improvements: ['Consider creating a voice profile for this character'],
      metrics
    };
  }

  private generateVoiceConsistencySuggestion(text: string, profile: CharacterVoiceProfile): string {
    const suggestions: string[] = [];

    if (profile.commonPhrases.length > 0) {
      suggestions.push(`Use characteristic phrases: ${profile.commonPhrases[0]}`);
    }
    if (profile.speechPatterns.length > 0) {
      suggestions.push(`Add speech pattern: ${profile.speechPatterns[0].pattern}`);
    }
    if (profile.sentenceStructure.prefersShort) {
      suggestions.push('Use shorter sentences');
    }

    return suggestions.join('. ') || 'Review character voice profile';
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Get dialogue history
   */
  getDialogueHistory(): DialogueAnalysis[] {
    return [...this.dialogueHistory];
  }

  /**
   * Get conversation history
   */
  getConversationHistory(participants: string[]): ConversationFlow[] {
    const key = participants.sort().join('-');
    return this.conversationHistory.get(key) || [];
  }

  /**
   * Generate dialogue suggestion for a character
   */
  generateDialogue(speakerId: string, context: string, emotion?: string): string {
    const profile = this.voiceProfiles.get(speakerId);
    if (!profile) {
      return `[Create dialogue for ${speakerId} in context: ${context}]`;
    }

    // This is a placeholder - in production, this would use AI generation
    const suggestions: string[] = [];
    
    if (profile.commonPhrases.length > 0) {
      suggestions.push(profile.commonPhrases[Math.floor(Math.random() * profile.commonPhrases.length)]);
    }
    
    if (emotion === 'uncertainty' && profile.speechPatterns.some(p => p.context.includes('uncertainty'))) {
      const pattern = profile.speechPatterns.find(p => p.context.includes('uncertainty'));
      if (pattern) suggestions.push(pattern.pattern);
    }

    return suggestions.join(' ') || `[Generate dialogue with ${profile.name}'s voice profile]`;
  }

  /**
   * Get voice consistency report
   */
  generateVoiceConsistencyReport(): {
    totalCharacters: number;
    averageVoiceMatch: number;
    consistencyIssues: number;
    charactersNeedingAttention: string[];
    recommendations: string[];
  } {
    const analyses = this.dialogueHistory;
    
    if (analyses.length === 0) {
      return {
        totalCharacters: this.voiceProfiles.size,
        averageVoiceMatch: 0,
        consistencyIssues: 0,
        charactersNeedingAttention: [],
        recommendations: ['Generate dialogue to establish voice consistency baseline']
      };
    }

    const averageVoiceMatch = analyses.reduce((sum, a) => sum + a.voiceMatch, 0) / analyses.length;
    const consistencyIssues = analyses.reduce((sum, a) => sum + a.issues.filter(i => i.type === 'voice_inconsistency').length, 0);

    // Find characters with low voice match
    const characterMatches = new Map<string, number[]>();
    analyses.forEach(a => {
      if (!characterMatches.has(a.speakerId)) {
        characterMatches.set(a.speakerId, []);
      }
      characterMatches.get(a.speakerId)!.push(a.voiceMatch);
    });

    const charactersNeedingAttention = Array.from(characterMatches.entries())
      .filter(([_, scores]) => scores.reduce((sum, s) => sum + s, 0) / scores.length < 0.7)
      .map(([id, _]) => id);

    const recommendations: string[] = [];
    if (averageVoiceMatch < 0.7) {
      recommendations.push('Overall voice consistency below threshold - review dialogue');
    }
    if (charactersNeedingAttention.length > 0) {
      recommendations.push(`Characters needing attention: ${charactersNeedingAttention.join(', ')}`);
    }

    return {
      totalCharacters: this.voiceProfiles.size,
      averageVoiceMatch,
      consistencyIssues,
      charactersNeedingAttention,
      recommendations
    };
  }
}

export default DialogueIntelligenceSystem;