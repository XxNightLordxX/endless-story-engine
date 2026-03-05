/**
 * DialogueIntelligenceSystem - Voice Consistency Management
 * 
 * Ensures consistent character voice and dialogue quality:
 * - Maintains character voice profiles
 * - Detects and corrects voice inconsistencies
 * - Analyzes dialogue patterns and styles
 * - Provides dialogue suggestions
 * - Tracks character speech patterns across chapters
 */

import { Chapter, Character } from '../types';
import { StoryGenerationOptions } from '../types';

interface VoiceProfile {
  characterId: string;
  characterName: string;
  speechPatterns: SpeechPattern[];
  vocabulary: VocabularyProfile;
  sentenceStructure: SentenceStructure;
  tone: ToneProfile;
  idioms: string[];
  catchphrases: string[];
  preferredTopics: string[];
  avoidedTopics: string[];
  confidenceScore: number;
  sampleDialogues: string[];
}

interface SpeechPattern {
  pattern: string;
  frequency: number;
  contexts: string[];
}

interface VocabularyProfile {
  commonWords: Map<string, number>;
  wordComplexity: number;
  formalInformal: number; // 0 = very informal, 1 = very formal
  archaic?: number;
  technical?: number;
  colloquial?: number;
}

interface SentenceStructure {
  averageLength: number;
  lengthVariance: number;
  complexSentences: number; // Percentage
  questionFrequency: number;
  exclamationFrequency: number;
  fragmentation: number; // Use of fragments
  passiveVoice: number;
}

interface ToneProfile {
  base: 'formal' | 'casual' | 'aggressive' | 'passive' | 'sarcastic' | 'sincere';
  variation: number;
  emotionColoring: Map<string, number>;
}

interface DialogueSegment {
  character: string;
  text: string;
  chapter: number;
  context: string;
  analyzed: boolean;
  voiceMatch: number;
}

interface VoiceInconsistency {
  character: string;
  type: 'vocabulary' | 'tone' | 'structure' | 'style' | 'idiom';
  severity: 'low' | 'medium' | 'high';
  location: { chapter: number; segment: number };
  description: string;
  suggestedCorrection: string;
  confidence: number;
}

export class DialogueIntelligenceSystem {
  private voiceProfiles: Map<string, VoiceProfile> = new Map();
  private dialogues: DialogueSegment[] = [];
  private inconsistencies: VoiceInconsistency[] = [];
  private currentChapter: number = 0;
  
  // Cross-system reference
  private characterGenome?: any;

  constructor() {
    this.initializeDefaultProfiles();
  }

  /**
   * Initialize default voice profiles for common character types
   */
  private initializeDefaultProfiles(): void {
    // Noble/Aristocratic character
    this.createProfile('noble', {
      speechPatterns: [
        { pattern: 'indeed', frequency: 0.8, contexts: ['agreement', 'affirmation'] },
        { pattern: 'pray tell', frequency: 0.6, contexts: ['inquiry'] },
        { pattern: 'perchance', frequency: 0.4, contexts: ['speculation'] }
      ],
      vocabulary: {
        commonWords: new Map([['indeed', 10], ['perhaps', 8], ['certainly', 7]]),
        wordComplexity: 0.8,
        formalInformal: 0.9,
        archaic: 0.7,
        technical: 0.3,
        colloquial: 0.1
      },
      sentenceStructure: {
        averageLength: 18,
        lengthVariance: 5,
        complexSentences: 0.6,
        questionFrequency: 0.15,
        exclamationFrequency: 0.05,
        fragmentation: 0.1,
        passiveVoice: 0.2
      },
      tone: {
        base: 'formal',
        variation: 0.2,
        emotionColoring: new Map([['dignity', 0.8], ['authority', 0.7]])
      },
      idioms: ['time will tell', 'in due course', 'as it were'],
      catchphrases: [],
      preferredTopics: ['politics', 'history', 'art', 'culture'],
      avoidedTopics: ['vulgarity', 'common concerns'],
      confidenceScore: 0.5,
      sampleDialogues: []
    });

    // Commoner/Worker character
    this.createProfile('commoner', {
      speechPatterns: [
        { pattern: "ain't", frequency: 0.6, contexts: ['negation'] },
        { pattern: 'reckon', frequency: 0.5, contexts: ['speculation'] },
        { pattern: 'folks', frequency: 0.4, contexts: ['address'] }
      ],
      vocabulary: {
        commonWords: new Map([["ain't", 10], ['reckon', 7], ['gonna', 8]]),
        wordComplexity: 0.3,
        formalInformal: 0.1,
        archaic: 0.1,
        technical: 0.2,
        colloquial: 0.8
      },
      sentenceStructure: {
        averageLength: 12,
        lengthVariance: 8,
        complexSentences: 0.2,
        questionFrequency: 0.2,
        exclamationFrequency: 0.15,
        fragmentation: 0.3,
        passiveVoice: 0.1
      },
      tone: {
        base: 'casual',
        variation: 0.4,
        emotionColoring: new Map([['warmth', 0.7], ['frustration', 0.5]])
      },
      idioms: ['hit the sack', 'piece of cake', 'break a leg'],
      catchphrases: [],
      preferredTopics: ['family', 'work', 'daily life'],
      avoidedTopics: ['politics', 'abstract concepts'],
      confidenceScore: 0.5,
      sampleDialogues: []
    });

    // Scholar/Intellectual character
    this.createProfile('scholar', {
      speechPatterns: [
        { pattern: 'fundamentally', frequency: 0.7, contexts: ['explanation'] },
        { pattern: 'essentially', frequency: 0.6, contexts: ['clarification'] },
        { pattern: 'consequently', frequency: 0.5, contexts: ['consequence'] }
      ],
      vocabulary: {
        commonWords: new Map([['fundamentally', 10], ['essentially', 8], ['consequently', 7]]),
        wordComplexity: 0.9,
        formalInformal: 0.7,
        archaic: 0.3,
        technical: 0.7,
        colloquial: 0.1
      },
      sentenceStructure: {
        averageLength: 22,
        lengthVariance: 6,
        complexSentences: 0.75,
        questionFrequency: 0.1,
        exclamationFrequency: 0.02,
        fragmentation: 0.05,
        passiveVoice: 0.15
      },
      tone: {
        base: 'formal',
        variation: 0.15,
        emotionColoring: new Map([['curiosity', 0.8], ['precision', 0.9]])
      },
      idioms: ['to put it another way', 'in essence', 'at its core'],
      catchphrases: [],
      preferredTopics: ['science', 'philosophy', 'knowledge', 'research'],
      avoidedTopics: ['gossip', 'trivial matters'],
      confidenceScore: 0.5,
      sampleDialogues: []
    });

    // Warrior/Soldier character
    this.createProfile('warrior', {
      speechPatterns: [
        { pattern: 'stand ready', frequency: 0.6, contexts: ['readiness'] },
        { pattern: 'hold the line', frequency: 0.5, contexts: ['command'] },
        { pattern: 'no surrender', frequency: 0.4, contexts: ['defiance'] }
      ],
      vocabulary: {
        commonWords: new Map([['honor', 10], ['duty', 9], ['victory', 8]]),
        wordComplexity: 0.5,
        formalInformal: 0.4,
        archaic: 0.2,
        technical: 0.4,
        colloquial: 0.4
      },
      sentenceStructure: {
        averageLength: 14,
        lengthVariance: 6,
        complexSentences: 0.35,
        questionFrequency: 0.05,
        exclamationFrequency: 0.2,
        fragmentation: 0.2,
        passiveVoice: 0.05
      },
      tone: {
        base: 'aggressive',
        variation: 0.3,
        emotionColoring: new Map([['determination', 0.9], ['loyalty', 0.8]])
      },
      idioms: ['hold your ground', 'steel yourself', 'face the music'],
      catchphrases: ['For honor!', 'No retreat!'],
      preferredTopics: ['combat', 'strategy', 'honor', 'duty'],
      avoidedTopics: ['weakness', 'surrender'],
      confidenceScore: 0.5,
      sampleDialogues: []
    });
  }

  /**
   * Create a voice profile
   */
  private createProfile(
    characterId: string,
    profile: Omit<VoiceProfile, 'characterId' | 'characterName' | 'confidenceScore' | 'sampleDialogues'>
  ): VoiceProfile {
    const fullProfile: VoiceProfile = {
      characterId,
      characterName: characterId,
      ...profile,
      confidenceScore: 0.5,
      sampleDialogues: []
    };

    this.voiceProfiles.set(characterId, fullProfile);
    return fullProfile;
  }

  /**
   * Analyze dialogue in a chapter
   */
  async analyzeChapterDialogue(
    chapter: Chapter,
    characters: Map<string, Character>
  ): Promise<VoiceInconsistency[]> {
    this.currentChapter = chapter.chapterNumber;

    // Extract dialogue segments
    const segments = this.extractDialogueSegments(chapter.content);

    // Analyze each segment
    for (const segment of segments) {
      await this.analyzeDialogueSegment(segment, characters);
    }

    return this.inconsistencies.filter(inc => inc.location.chapter === chapter.chapterNumber);
  }

  /**
   * Extract dialogue segments from chapter content
   */
  private extractDialogueSegments(content: string): DialogueSegment[] {
    const segments: DialogueSegment[] = [];
    const dialoguePattern = /"([^"]+)"/g;
    let match;

    while ((match = dialoguePattern.exec(content)) !== null) {
      segments.push({
        character: this.identifySpeaker(match[1], content.substring(0, match.index)),
        text: match[1],
        chapter: this.currentChapter,
        context: this.extractContext(content, match.index, 100),
        analyzed: false,
        voiceMatch: 0
      });
    }

    return segments;
  }

  /**
   * Identify speaker from context
   */
  private identifySpeaker(dialogue: string, precedingText: string): string {
    // Look for character names in preceding text
    const characterPattern = /([A-Z][a-z]+)\s+(?:said|asked|replied|whispered|shouted|murmured)/g;
    const match = characterPattern.exec(precedingText.slice(-200));

    if (match) {
      return match[1];
    }

    // Try to identify from dialogue patterns
    const characterIds = Array.from(this.voiceProfiles.keys());
    if (characterIds.length > 0) {
      return characterIds[Math.floor(Math.random() * characterIds.length)];
    }

    return 'unknown';
  }

  /**
   * Extract context around dialogue
   */
  private extractContext(content: string, index: number, length: number): string {
    const start = Math.max(0, index - length);
    const end = Math.min(content.length, index + dialogue.length + length);
    return content.substring(start, end);
  }

  /**
   * Analyze a dialogue segment
   */
  private async analyzeDialogueSegment(
    segment: DialogueSegment,
    characters: Map<string, Character>
  ): Promise<void> {
    const profile = this.voiceProfiles.get(segment.character);

    if (!profile) {
      // Create basic profile for unknown character
      this.createBasicProfile(segment.character);
      return;
    }

    // Calculate voice match
    segment.voiceMatch = this.calculateVoiceMatch(segment.text, profile);
    segment.analyzed = true;

    // Check for inconsistencies
    this.checkVoiceConsistency(segment, profile);

    // Update profile with new dialogue
    this.updateVoiceProfile(profile, segment);

    // Store dialogue
    this.dialogues.push(segment);
  }

  /**
   * Calculate voice match score
   */
  private calculateVoiceMatch(dialogue: string, profile: VoiceProfile): number {
    let totalScore = 0;
    let weightSum = 0;

    // Vocabulary match
    const vocabScore = this.calculateVocabularyMatch(dialogue, profile.vocabulary);
    totalScore += vocabScore * 0.3;
    weightSum += 0.3;

    // Sentence structure match
    const structureScore = this.calculateStructureMatch(dialogue, profile.sentenceStructure);
    totalScore += structureScore * 0.25;
    weightSum += 0.25;

    // Tone match
    const toneScore = this.calculateToneMatch(dialogue, profile.tone);
    totalScore += toneScore * 0.25;
    weightSum += 0.25;

    // Speech pattern match
    const patternScore = this.calculatePatternMatch(dialogue, profile.speechPatterns);
    totalScore += patternScore * 0.2;
    weightSum += 0.2;

    return weightSum > 0 ? totalScore / weightSum : 0.5;
  }

  /**
   * Calculate vocabulary match
   */
  private calculateVocabularyMatch(dialogue: string, profile: VocabularyProfile): number {
    const words = dialogue.toLowerCase().split(/\s+/);
    let matches = 0;
    let total = 0;

    for (const [word, frequency] of profile.commonWords) {
      if (dialogue.toLowerCase().includes(word)) {
        matches += frequency;
      }
      total += frequency;
    }

    // Check formal/informal level
    const formalIndicators = ['indeed', 'certainly', 'perhaps', 'consequently'];
    const informalIndicators = ["ain't", 'gonna', 'wanna', 'kinda'];
    
    const formalCount = formalIndicators.filter(w => dialogue.toLowerCase().includes(w)).length;
    const informalCount = informalIndicators.filter(w => dialogue.toLowerCase().includes(w)).length;

    const dialogueFormality = formalCount / (formalCount + informalCount + 1);
    const formalityMatch = 1 - Math.abs(dialogueFormality - profile.formalInformal);

    const vocabMatch = total > 0 ? matches / total : 0.5;
    return (vocabMatch + formalityMatch) / 2;
  }

  /**
   * Calculate sentence structure match
   */
  private calculateStructureMatch(dialogue: string, profile: SentenceStructure): number {
    const sentences = dialogue.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0.5;

    // Calculate average length
    const avgLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
    const lengthMatch = 1 - Math.min(Math.abs(avgLength - profile.averageLength) / 10, 1);

    // Calculate question frequency
    const questionCount = dialogue.split('?').length - 1;
    const questionFreq = questionCount / sentences.length;
    const questionMatch = 1 - Math.min(Math.abs(questionFreq - profile.questionFrequency) * 2, 1);

    // Calculate exclamation frequency
    const exclamationCount = dialogue.split('!').length - 1;
    const exclamationFreq = exclamationCount / sentences.length;
    const exclamationMatch = 1 - Math.min(Math.abs(exclamationFreq - profile.exclamationFrequency) * 2, 1);

    return (lengthMatch + questionMatch + exclamationMatch) / 3;
  }

  /**
   * Calculate tone match
   */
  private calculateToneMatch(dialogue: string, profile: ToneProfile): number {
    const toneIndicators: Map<string, string[]> = new Map([
      ['formal', ['indeed', 'certainly', 'perhaps', 'consequently', 'fundamentally']],
      ['casual', ["ain't", 'gonna', 'wanna', 'yeah', 'nah']],
      ['aggressive', ['stand ready', 'no surrender', 'fight', 'attack']],
      ['passive', ['perhaps', 'maybe', 'consider', 'might']],
      ['sarcastic', ['oh really', 'sure', 'interesting']],
      ['sincere', ['honestly', 'truly', 'really', 'believe']]
    ]);

    const lowerDialogue = dialogue.toLowerCase();
    let maxMatches = 0;
    let baseToneScore = 0;

    for (const [tone, indicators] of toneIndicators) {
      const matches = indicators.filter(i => lowerDialogue.includes(i)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
      }
      if (tone === profile.base) {
        baseToneScore = matches;
      }
    }

    return maxMatches > 0 ? baseToneScore / maxMatches : 0.5;
  }

  /**
   * Calculate speech pattern match
   */
  private calculatePatternMatch(dialogue: string, patterns: SpeechPattern[]): number {
    if (patterns.length === 0) return 0.5;

    let matches = 0;
    for (const pattern of patterns) {
      if (dialogue.toLowerCase().includes(pattern.pattern.toLowerCase())) {
        matches += pattern.frequency;
      }
    }

    return Math.min(matches / patterns.length, 1);
  }

  /**
   * Check for voice consistency
   */
  private checkVoiceConsistency(segment: DialogueSegment, profile: VoiceProfile): void {
    const threshold = 0.5; // Voice match threshold

    if (segment.voiceMatch < threshold) {
      const inconsistencyType = this.identifyInconsistencyType(segment, profile);
      const severity = this.calculateInconsistencySeverity(segment.voiceMatch);

      this.inconsistencies.push({
        character: segment.character,
        type: inconsistencyType,
        severity,
        location: { chapter: segment.chapter, segment: this.dialogues.length + 1 },
        description: `Voice mismatch for ${segment.character}: ${segment.text.substring(0, 50)}...`,
        suggestedCorrection: this.suggestCorrection(segment, profile, inconsistencyType),
        confidence: 1 - segment.voiceMatch
      });
    }
  }

  /**
   * Identify type of inconsistency
   */
  private identifyInconsistencyType(segment: DialogueSegment, profile: VoiceProfile): VoiceInconsistency['type'] {
    const dialogue = segment.text.toLowerCase();

    // Check vocabulary
    const hasFormal = ['indeed', 'certainly', 'perhaps'].some(w => dialogue.includes(w));
    const hasInformal = ["ain't", 'gonna', 'wanna'].some(w => dialogue.includes(w));

    if (profile.vocabulary.formalInformal > 0.7 && hasInformal) {
      return 'vocabulary';
    }
    if (profile.vocabulary.formalInformal < 0.3 && hasFormal) {
      return 'vocabulary';
    }

    // Check structure
    const avgWords = segment.text.split(/\s+/).length;
    if (Math.abs(avgWords - profile.sentenceStructure.averageLength) > 10) {
      return 'structure';
    }

    // Check for idioms
    const hasIdiom = profile.idioms.some(i => dialogue.includes(i.toLowerCase()));
    if (!hasIdiom && profile.speechPatterns.length > 0) {
      return 'idiom';
    }

    return 'tone';
  }

  /**
   * Calculate inconsistency severity
   */
  private calculateInconsistencySeverity(voiceMatch: number): VoiceInconsistency['severity'] {
    if (voiceMatch < 0.2) return 'high';
    if (voiceMatch < 0.35) return 'medium';
    return 'low';
  }

  /**
   * Suggest correction for inconsistency
   */
  private suggestCorrection(
    segment: DialogueSegment,
    profile: VoiceProfile,
    type: VoiceInconsistency['type']
  ): string {
    const suggestions: Record<VoiceInconsistency['type'], string> = {
      vocabulary: `Adjust vocabulary to match ${profile.characterName}'s established speech pattern`,
      tone: `Modify tone to align with ${profile.characterName}'s character voice`,
      structure: `Restructure sentences to match typical length and complexity`,
      style: `Apply ${profile.characterName}'s stylistic preferences`,
      idiom: `Consider adding characteristic idioms or speech patterns`
    };

    return suggestions[type] || 'Review dialogue for voice consistency';
  }

  /**
   * Update voice profile with new dialogue
   */
  private updateVoiceProfile(profile: VoiceProfile, segment: DialogueSegment): void {
    // Add to sample dialogues
    profile.sampleDialogues.push(segment.text);

    // Limit sample size
    if (profile.sampleDialogues.length > 20) {
      profile.sampleDialogues.shift();
    }

    // Extract and add new speech patterns
    const newPatterns = this.extractSpeechPatterns(segment.text);
    for (const pattern of newPatterns) {
      const existing = profile.speechPatterns.find(p => p.pattern === pattern.pattern);
      if (existing) {
        existing.frequency = (existing.frequency + pattern.frequency) / 2;
      } else {
        profile.speechPatterns.push(pattern);
      }
    }

    // Update confidence score
    profile.confidenceScore = Math.min(profile.confidenceScore + 0.05, 1.0);
  }

  /**
   * Extract speech patterns from dialogue
   */
  private extractSpeechPatterns(dialogue: string): SpeechPattern[] {
    const patterns: SpeechPattern[] = [];
    const words = dialogue.split(/\s+/);

    // Look for repeated phrases
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = words.slice(i, i + 3).join(' ');
      if (phrase.length > 5 && /[A-Z]/.test(phrase[0])) {
        patterns.push({
          pattern: phrase,
          frequency: 0.3,
          contexts: ['general']
        });
      }
    }

    return patterns;
  }

  /**
   * Create basic profile for unknown character
   */
  private createBasicProfile(characterId: string): void {
    this.createProfile(characterId, {
      speechPatterns: [],
      vocabulary: {
        commonWords: new Map(),
        wordComplexity: 0.5,
        formalInformal: 0.5
      },
      sentenceStructure: {
        averageLength: 15,
        lengthVariance: 7,
        complexSentences: 0.4,
        questionFrequency: 0.15,
        exclamationFrequency: 0.1,
        fragmentation: 0.15,
        passiveVoice: 0.1
      },
      tone: {
        base: 'casual',
        variation: 0.3,
        emotionColoring: new Map()
      },
      idioms: [],
      catchphrases: [],
      preferredTopics: [],
      avoidedTopics: []
    });
  }

  /**
   * Get voice match for a character
   */
  getVoiceMatch(characterId: string): number {
    const profile = this.voiceProfiles.get(characterId);
    if (!profile) return 0.5;
    return profile.confidenceScore;
  }

  /**
   * Get all inconsistencies
   */
  getInconsistencies(): VoiceInconsistency[] {
    return [...this.inconsistencies];
  }

  /**
   * Get inconsistencies for a specific character
   */
  getCharacterInconsistencies(characterId: string): VoiceInconsistency[] {
    return this.inconsistencies.filter(inc => inc.character === characterId);
  }

  /**
   * Generate dialogue suggestion for a character
   */
  generateDialogueSuggestion(characterId: string, context: string): string {
    const profile = this.voiceProfiles.get(characterId);
    if (!profile) {
      return this.generateGenericDialogue(context);
    }

    // Build dialogue based on profile
    const dialogue = this.buildDialogueFromProfile(profile, context);
    return dialogue;
  }

  /**
   * Build dialogue from voice profile
   */
  private buildDialogueFromProfile(profile: VoiceProfile, context: string): string {
    // Select appropriate speech patterns
    const pattern = this.selectSpeechPattern(profile);

    // Apply sentence structure
    const structure = this.applySentenceStructure(profile);

    // Combine into dialogue
    let dialogue = `${pattern} ${structure}`;

    // Adjust tone
    dialogue = this.adjustTone(dialogue, profile);

    return dialogue.trim();
  }

  /**
   * Select speech pattern for dialogue
   */
  private selectSpeechPattern(profile: VoiceProfile): string {
    if (profile.speechPatterns.length > 0) {
      const random = Math.random();
      let cumulative = 0;
      for (const pattern of profile.speechPatterns) {
        cumulative += pattern.frequency;
        if (random <= cumulative) {
          return pattern.pattern;
        }
      }
    }

    // Fallback patterns
    const fallbacks = [
      'I understand',
      'Tell me more',
      'Interesting',
      'I see'
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  /**
   * Apply sentence structure
   */
  private applySentenceStructure(profile: VoiceProfile): string {
    const structures = [
      'that makes sense',
      'we should consider',
      'I believe',
      'perhaps we should',
      'it seems to me'
    ];

    return structures[Math.floor(Math.random() * structures.length)];
  }

  /**
   * Adjust tone based on profile
   */
  private adjustTone(dialogue: string, profile: ToneProfile): string {
    if (profile.base === 'formal') {
      return dialogue.charAt(0).toUpperCase() + dialogue.slice(1) + '.';
    }
    return dialogue;
  }

  /**
   * Generate generic dialogue
   */
  private generateGenericDialogue(context: string): string {
    const genericResponses = [
      'I understand what you\'re saying.',
      'That\'s interesting.',
      'Tell me more about it.',
      'I see your point.',
      'Let me think about that.'
    ];

    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  }

  /**
   * Export voice profiles
   */
  exportProfiles(): VoiceProfile[] {
    return Array.from(this.voiceProfiles.values());
  }

  /**
   * Import voice profiles
   */
  importProfiles(profiles: VoiceProfile[]): void {
    for (const profile of profiles) {
      this.voiceProfiles.set(profile.characterId, profile);
    }
  }

  /**
   * Reset system
   */
  reset(): void {
    this.voiceProfiles.clear();
    this.dialogues = [];
    this.inconsistencies = [];
    this.currentChapter = 0;
    this.initializeDefaultProfiles();
  }
  /**
   * Set character genome reference for dialogue intelligence
   */
  setCharacterGenome(characterGenome: any): void {
    this.characterGenome = characterGenome;
  }

  /**
   * Get system status including cross-system connectivity
   */
  getSystemStatus(): {
    profilesCount: number;
    dialoguesCount: number;
    inconsistenciesCount: number;
    connectedSystems: string[];
  } {
    const connectedSystems: string[] = [];
    if (this.characterGenome) connectedSystems.push('characterGenome');

    return {
      profilesCount: this.voiceProfiles.size,
      dialoguesCount: this.dialogues.length,
      inconsistenciesCount: this.inconsistencies.length,
      connectedSystems
    };
  }
}
