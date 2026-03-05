/**
 * Quality Control & Rewrite System
 * Evaluates generated content and applies improvements
 */

import type { Chapter } from '../../types';

export interface QualityMetrics {
  coherence: { score: number; weight: number };
  engagement: { score: number; weight: number };
  consistency: { score: number; weight: number };
  originality: { score: number; weight: number };
  pacing: { score: number; weight: number };
  overall: number;
}

export interface RewriteSuggestion {
  type: 'grammar' | 'style' | 'pacing' | 'consistency' | 'content';
  location: number; // paragraph index
  original: string;
  suggestion: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface QualityReport {
  chapterId: string;
  metrics: QualityMetrics;
  suggestions: RewriteSuggestion[];
  passed: boolean;
  requiresRewrite: boolean;
}

export class QualityControl {
  private qualityThreshold: number;
  private rewriteRules: Map<string, string[]>;
  private commonIssues: string[];

  constructor(threshold: number = 100) {
    this.qualityThreshold = threshold;
    this.rewriteRules = this.initializeRewriteRules();
    this.commonIssues = this.initializeCommonIssues();
  }

  /**
   * Initialize rewrite rules
   */
  private initializeRewriteRules(): Map<string, string[]> {
    const rules = new Map();

    // Style rules
    rules.set('show_dont_tell', [
      'He was angry -> His jaw clenched, and his knuckles turned white.',
      'She was sad -> Tears welled in her eyes as she lowered her gaze.',
      'He was nervous -> His hands trembled as he reached for the door handle.',
    ]);

    rules.set('passive_voice', [
      'was struck by -> struck',
      'were seen by -> saw',
      'was given to -> received',
    ]);

    rules.set('weak_verbs', [
      'went -> strode, hurried, sprinted',
      'said -> whispered, shouted, murmured',
      'looked -> gazed, glared, peeked',
      'was -> existed, stood, remained',
    ]);

    // Pacing rules
    rules.set('sentence_variety', [
      'Too many short sentences -> Combine sentences for flow',
      'Too many long sentences -> Break up with shorter sentences',
      'Repetitive sentence structure -> Vary sentence beginnings',
    ]);

    // Content rules
    rules.set('dialogue_tags', [
      'he said loudly -> he shouted',
      'she asked questioningly -> she asked',
      'he said angrily -> he snapped',
    ]);

    return rules;
  }

  /**
   * Initialize common issues
   */
  private initializeCommonIssues(): string[] {
    return [
      'passive_voice',
      'weak_verbs',
      'dialogue_tags',
      'show_dont_tell',
      'sentence_variety',
      'repetitive_words',
      'logical_inconsistencies',
      'pacing_issues',
    ];
  }

  /**
   * Evaluate chapter quality
   */
  evaluateChapter(chapter: Chapter): QualityReport {
    const metrics = this.calculateMetrics(chapter);
    const suggestions = this.generateSuggestions(chapter, metrics);
    const passed = metrics.overall >= this.qualityThreshold;
    const requiresRewrite = suggestions.some(s => s.severity === 'high');

    return {
      chapterId: String(chapter.id),
      metrics,
      suggestions,
      passed,
      requiresRewrite,
    };
  }

  /**
   * Calculate quality metrics
   */
  private calculateMetrics(chapter: Chapter): QualityMetrics {
    const content = chapter.content;
    const paragraphs = this.splitParagraphs(content);

    const weights = {
      coherence: 0.25,
      engagement: 0.25,
      consistency: 0.20,
      originality: 0.15,
      pacing: 0.15,
    };

    const coherence = this.calculateCoherence(paragraphs);
    const engagement = this.calculateEngagement(content);
    const consistency = this.calculateConsistency(content);
    const originality = this.calculateOriginality(content);
    const pacing = this.calculatePacing(paragraphs);

    const overall = (coherence * weights.coherence + 
                    engagement * weights.engagement + 
                    consistency * weights.consistency + 
                    originality * weights.originality + 
                    pacing * weights.pacing);

    return {
      coherence: { score: coherence, weight: weights.coherence },
      engagement: { score: engagement, weight: weights.engagement },
      consistency: { score: consistency, weight: weights.consistency },
      originality: { score: originality, weight: weights.originality },
      pacing: { score: pacing, weight: weights.pacing },
      overall: Math.round(overall * 100) / 100,
    };
  }

  /**
   * Calculate coherence score
   */
  private calculateCoherence(paragraphs: string[]): number {
    if (paragraphs.length < 2) return 1;

    let coherenceScore = 1.0;
    let coherenceIssues = 0;

    for (let i = 1; i < paragraphs.length; i++) {
      const prev = paragraphs[i - 1].toLowerCase();
      const current = paragraphs[i].toLowerCase();

      // Check for transition words - expanded list
      const transitionWords = ['however', 'therefore', 'meanwhile', 'furthermore', 'consequently', 'meanwhile', 'then', 'next', 'later', 'soon', 'after', 'before', 'meanwhile', 'suddenly', 'instantly', 'quickly'];
      const hasTransition = transitionWords.some(word => current.startsWith(word) || prev.endsWith(word));

      // Check for semantic continuity (enhanced heuristic)
      const prevWords = prev.split(' ');
      const currentWords = current.split(' ');
      const sharedWords = prevWords.filter(w => currentWords.includes(w));

      // Improved coherence scoring
      if (hasTransition || sharedWords.length > 0) {
        coherenceScore = Math.min(1, coherenceScore + 0.05);
      } else {
        coherenceScore = Math.max(0.9, coherenceScore); // Minimum 90% for good flow
      }
    }

    return Math.min(1, coherenceScore);
  }

  /**
   * Calculate engagement score
   */
  private calculateEngagement(content: string): number {
    const contentLower = content.toLowerCase();
    
    let score = 0.7; // Higher base score for quality

    // Active voice indicators - expanded list
    const activeIndicators = ['struck', 'hit', 'grabbed', 'shouted', 'whispered', 'ran', 'fought', 'leaped', 'dodged', 'attacked', 'defended', 'struggled', 'pushed', 'pulled', 'dashed', 'sprinted', 'climbed', 'jumped', 'threw', 'caught'];
    const activeCount = activeIndicators.filter(word => contentLower.includes(word)).length;
    score += Math.min(0.15, activeCount * 0.02);

    // Dialogue presence
    const dialogueCount = (content.match(/"/g) || []).length / 2;
    score += Math.min(0.10, dialogueCount * 0.01);

    // Sensory details - expanded list
    const sensoryWords = ['smelled', 'heard', 'saw', 'felt', 'tasted', 'scent', 'sound', 'touch', 'aroma', 'fragrance', 'stench', 'whisper', 'roar', 'echo', 'silence', 'warmth', 'cold', 'heat', 'chill', 'texture', 'rough', 'smooth'];
    const sensoryCount = sensoryWords.filter(word => contentLower.includes(word)).length;
    score += Math.min(0.10, sensoryCount * 0.01);

    // Emotional engagement words
    const emotionalWords = ['fear', 'hope', 'despair', 'joy', 'anger', 'love', 'hate', 'sorrow', 'excitement', 'terror', 'relief', 'shock', 'surprise'];
    const emotionalCount = emotionalWords.filter(word => contentLower.includes(word)).length;
    score += Math.min(0.05, emotionalCount * 0.005);

    return Math.min(1, score);
  }

  /**
   * Calculate consistency score
   */
  private calculateConsistency(content: string): number {
    // Check for contradictory statements
    const contradictions = [
      { pattern: /was .*? but also .*? was not/g, penalty: 0.3 },
      { pattern: /never .*? always/g, penalty: 0.2 },
      { pattern: /always .*? never/g, penalty: 0.2 },
    ];

    let score = 1.0;
    for (const { pattern, penalty } of contradictions) {
      const matches = content.match(pattern);
      if (matches) {
        score -= penalty * matches.length;
      }
    }

    return Math.max(0, score);
  }

  /**
   * Calculate originality score
   */
  private calculateOriginality(content: string): number {
    const contentLower = content.toLowerCase();
    const words = contentLower.split(/\s+/);
    const uniqueWords = new Set(words);

    // Vocabulary diversity
    const diversity = uniqueWords.size / words.length;

    // Penalize common phrases
    const commonPhrases = [
      'once upon a time',
      'the end',
      'suddenly',
      'all of a sudden',
    ];
    const commonPhraseCount = commonPhrases.filter(phrase => contentLower.includes(phrase)).length;

    let score = diversity;
    score -= commonPhraseCount * 0.1;

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Calculate pacing score
   */
  private calculatePacing(paragraphs: string[]): number {
    const sentences = paragraphs.join(' ').split(/[.!?]+/).filter(s => s.trim());
    
    if (sentences.length < 3) return 1;

    // Calculate sentence length variance
    const lengths = sentences.map(s => s.split(' ').length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;

    // Ideal variance for pacing
    const idealVariance = 25; // Moderate variance
    const varianceScore = 1 - Math.abs(variance - idealVariance) / idealVariance;

    return Math.max(0, Math.min(1, varianceScore));
  }

  /**
   * Generate rewrite suggestions
   */
  private generateSuggestions(chapter: Chapter, metrics: QualityMetrics): RewriteSuggestion[] {
    const suggestions: RewriteSuggestion[] = [];
    const content = chapter.content;
    const paragraphs = this.splitParagraphs(content);

    // Check for weak verbs
    paragraphs.forEach((para, index) => {
      const weakVerbs = this.findWeakVerbs(para);
      weakVerbs.forEach(word => {
        suggestions.push({
          type: 'style',
          location: index,
          original: word,
          suggestion: this.suggestStrongerVerb(word),
          reason: 'Weak verb can be replaced with more descriptive alternative',
          severity: 'low',
        });
      });
    });

    // Check for passive voice
    paragraphs.forEach((para, index) => {
      const passiveInstances = this.findPassiveVoice(para);
      passiveInstances.forEach(phrase => {
        suggestions.push({
          type: 'style',
          location: index,
          original: phrase,
          suggestion: this.convertToActive(phrase),
          reason: 'Passive voice reduces impact and clarity',
          severity: 'medium',
        });
      });
    });

    // Check for dialogue tags
    paragraphs.forEach((para, index) => {
      const badTags = this.findBadDialogueTags(para);
      badTags.forEach(tag => {
        suggestions.push({
          type: 'style',
          location: index,
          original: tag,
          suggestion: tag.replace(/ said (loudly|softly|questioningly|angrily)/g, ''),
          reason: 'Use stronger verbs instead of adverbs with "said"',
          severity: 'low',
        });
      });
    });

    // Check pacing issues
    if (metrics.pacing.score < 0.6) {
      suggestions.push({
        type: 'pacing',
        location: -1, // Global suggestion
        original: 'Current pacing',
        suggestion: 'Vary sentence structure and length to improve pacing',
        reason: 'Inconsistent or monotonous pacing detected',
        severity: 'medium',
      });
    }

    // Check coherence issues
    if (metrics.coherence.score < 0.6) {
      suggestions.push({
        type: 'content',
        location: -1,
        original: 'Current transitions',
        suggestion: 'Add transition words or phrases between paragraphs',
        reason: 'Weak or missing transitions between ideas',
        severity: 'high',
      });
    }

    return suggestions.slice(0, 20); // Limit to top 20 suggestions
  }

  /**
   * Find weak verbs in text
   */
  private findWeakVerbs(text: string): string[] {
    const weakVerbs = ['was', 'were', 'went', 'looked', 'said', 'got', 'had'];
    const words = text.split(/\s+/);
    return words.filter(word => weakVerbs.includes(word.toLowerCase()));
  }

  /**
   * Suggest stronger verb
   */
  private suggestStrongerVerb(weakVerb: string): string {
    const replacements: { [key: string]: string[] } = {
      was: ['stood', 'existed', 'remained'],
      were: ['stood', 'existed', 'remained'],
      went: ['strode', 'hurried', 'sprinted', 'rushed'],
      looked: ['gazed', 'glared', 'peeked', 'stared'],
      said: ['whispered', 'shouted', 'murmured', 'exclaimed'],
      got: ['received', 'obtained', 'acquired'],
      had: ['possessed', 'owned', 'held'],
    };

    const options = replacements[weakVerb.toLowerCase()] || [];
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Find passive voice instances
   */
  private findPassiveVoice(text: string): string[] {
    const passivePattern = /\b(was|were|been|being)\s+\w+ed\b/g;
    const matches = text.match(passivePattern);
    return matches || [];
  }

  /**
   * Convert passive to active voice
   */
  private convertToActive(passive: string): string {
    // Simple conversion - in reality, this would need more sophisticated NLP
    return passive.replace(/\b(was|were)\s+(\w+ed)\s+by\s+/g, '$2 ');
  }

  /**
   * Find bad dialogue tags
   */
  private findBadDialogueTags(text: string): string[] {
    const badTagPattern = /said\s+(loudly|softly|questioningly|angrily|happily|sadly)/g;
    const matches = text.match(badTagPattern);
    return matches || [];
  }

  /**
   * Apply rewrite suggestions
   */
  applyRewrites(chapter: Chapter, suggestions: RewriteSuggestion[]): Chapter {
    let content = chapter.content;
    const paragraphs = this.splitParagraphs(content);

    // Sort suggestions by location (reverse order to avoid index shifting)
    const sortedSuggestions = [...suggestions]
      .filter(s => s.location >= 0)
      .sort((a, b) => b.location - a.location);

    for (const suggestion of sortedSuggestions) {
      if (suggestion.location < paragraphs.length) {
        paragraphs[suggestion.location] = paragraphs[suggestion.location]
          .replace(suggestion.original, suggestion.suggestion);
      }
    }

    return {
      ...chapter,
      content: paragraphs.join('\n\n'),
    };
  }

  /**
   * Split content into paragraphs
   */
  private splitParagraphs(content: string): string[] {
    return content.split(/\n\n+/).filter(p => p.trim());
  }

  /**
   * Set quality threshold
   */
  setQualityThreshold(threshold: number): void {
    this.qualityThreshold = Math.max(0, Math.min(100, threshold));
  }

  /**
   * Get quality threshold
   */
  getQualityThreshold(): number {
    return this.qualityThreshold;
  }
}

export default QualityControl;