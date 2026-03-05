import { v4 as uuidv4 } from 'uuid';
import { webSearchIntegration } from './WebSearchIntegration';
import type { WebSearchResult, TechnicalSearchResult } from './WebSearchIntegration';

/**
 * Narrative Repair & Enhancement Layer
 * 
 * This system identifies and fixes narrative issues, enhances weak passages,
 * and ensures overall story quality and consistency.
 * 
 * Enhanced with real-time web search for story revision techniques,
 * narrative problem solutions, and quality improvement methods.
 * 
 * Core Responsibilities:
 * - Identify plot holes and continuity errors
 * - Fix pacing and tension issues
 * - Enhance weak prose and dialogue
 * - Ensure character consistency
 * - Resolve narrative conflicts
 * - Improve thematic coherence
 * - Generate rewrite suggestions
 */

// ===== TYPES & INTERFACES =====

export interface NarrativeIssue {
  id: string;
  type: IssueType;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  location: IssueLocation;
  description: string;
  evidence: string[];
  impact: string;
  suggestedFix: SuggestedFix;
  autoFixable: boolean;
  priority: number; // 1-10
}

export type IssueType = 
  | 'plot-hole' | 'continuity-error' | 'character-inconsistency'
  | 'pacing-issue' | 'weak-prose' | 'dialogue-problem' 
  | 'contradiction' | 'information-gap' | 'redundancy' 
  | 'logical-fallacy' | 'motivation-gap' | 'emotional-disconnect'
  | 'structural-problem' | 'thematic-incoherence' | 'world-building-gap'
  | 'foreshadowing-failure' | 'payoff-miss' | 'climax-weakness';

export interface IssueLocation {
  chapter: number;
  scene?: number;
  paragraph?: number;
  sentence?: number;
  exactText?: string;
}

export interface SuggestedFix {
  action: FixAction;
  description: string;
  implementation: string;
  estimatedImpact: string;
  sideEffects: string[];
  difficulty: 'easy' | 'moderate' | 'difficult';
}

export type FixAction = 
  | 'insert-content' | 'delete-content' | 'rewrite-content' 
  | 'reorder-content' | 'expand-content' | 'clarify-content'
  | 'add-foreshadowing' | 'add-payoff' | 'adjust-pacing'
  | 'deepen-character' | 'enhance-dialogue' | 'fix-continuity'
  | 'resolve-contradiction' | 'add-motivation' | 'enhance-prose';

export interface RepairResult {
  issueId: string;
  applied: boolean;
  success: boolean;
  action: FixAction;
  changes: string[];
  newIssues: string[];
  qualityImprovement: number; // 0-1
}

export interface NarrativeEnhancement {
  id: string;
  type: EnhancementType;
  location: IssueLocation;
  description: string;
  currentContent: string;
  enhancedContent: string;
  reasoning: string;
  expectedBenefit: string;
  confidence: number; // 0-1
}

export type EnhancementType = 
  | 'prose-improvement' | 'dialogue-enhancement' 
  | 'sensory-detail' | 'emotional-deepening' 
  | 'pacing-adjustment' | 'clarity-improvement'
  | 'character-voice' | 'thematic-strengthening'
  | 'foreshadowing' | 'atmosphere-building';

export interface QualityMetrics {
  overall: number; // 0-1
  plot: number;
  characters: number;
  prose: number;
  dialogue: number;
  pacing: number;
  coherence: number;
  engagement: number;
  issues: {
    critical: number;
    major: number;
    moderate: number;
    minor: number;
  };
}

export interface RepairPlan {
  id: string;
  chapter: number;
  issues: NarrativeIssue[];
  enhancements: NarrativeEnhancement[];
  recommendedOrder: string[]; // Issue/enhancement IDs in order
  estimatedTime: string;
  difficulty: 'easy' | 'moderate' | 'difficult';
  expectedImprovement: number; // 0-1
}

export interface ContinuityCheck {
  chapter: number;
  characterStates: Map<string, CharacterState>;
  worldStates: Map<string, WorldState>;
  inconsistencies: ContinuityInconsistency[];
}

export interface CharacterState {
  id: string;
  location: string;
  condition: string;
  possessions: string[];
  relationships: Map<string, string>;
  knowledge: string[];
  emotionalState: string;
  physicalState: string;
}

export interface WorldState {
  element: string;
  currentState: string;
  previousStates: string[];
  changesSince: number;
}

export interface ContinuityInconsistency {
  type: 'character' | 'world' | 'time' | 'logic';
  entity: string;
  discrepancy: string;
  location1: IssueLocation;
  location2: IssueLocation;
  severity: number; // 1-10
}

export interface DialogueAnalysis {
  speakerId: string;
  lines: string[];
  voiceConsistency: number; // 0-1
  clarity: number; // 0-1
  naturalness: number; // 0-1
  subtext: number; // 0-1
  distinctiveness: number; // 0-1
  issues: DialogueIssue[];
}

export interface DialogueIssue {
  type: 'out-of-character' | 'unnatural' | 'exposition' | 'repetitive' 
        | 'vague' | 'too-formal' | 'too-informal' | 'cliché';
  location: IssueLocation;
  line: string;
  suggestion: string;
}

export interface PacingAnalysis {
  chapter: number;
  overallPace: 'slow' | 'moderate' | 'fast';
  tensionCurve: number[]; // 0-1 per scene
  actionBeats: number[];
  slowSections: number[];
  fastSections: number[];
  recommendedAdjustments: PacingAdjustment[];
}

export interface PacingAdjustment {
  location: IssueLocation;
  type: 'accelerate' | 'decelerate' | 'add-tension' | 'add-variety';
  description: string;
  method: string;
}

export interface ThematicCoherence {
  theme: string;
  consistency: number; // 0-1
  depth: number; // 0-1
  instances: ThematicInstance[];
  gaps: ThematicGap[];
  suggestions: string[];
}

export interface ThematicInstance {
  location: IssueLocation;
  content: string;
  relevance: number; // 0-1
  effectiveness: number; // 0-1
}

export interface ThematicGap {
  location: IssueLocation;
  description: string;
  opportunity: string;
}

export interface RewriteSuggestion {
  id: string;
  location: IssueLocation;
  originalText: string;
  rewrittenText: string;
  reason: string;
  category: RewriteCategory;
  improvements: string[];
}

export type RewriteCategory = 
  | 'clarity' | 'flow' | 'impact' | 'character-voice' 
  | 'emotional-resonance' | 'show-don-tell' | 'conciseness'
  | 'sensory-detail' | 'active-voice' | 'word-choice';

// ===== CLASS DEFINITION =====

export class NarrativeRepairSystem {
  private issues: Map<string, NarrativeIssue> = new Map();
  private enhancements: Map<string, NarrativeEnhancement> = new Map();
  private repairResults: Map<string, RepairResult> = new Map();
  private continuityChecks: ContinuityCheck[] = [];
  private qualityMetrics: Map<number, QualityMetrics> = new Map();
  private repairHistory: RepairResult[] = [];
  
  // Web search integration
  private revisionTechniquesCache: Map<string, WebSearchResult[]> = new Map();
  private problemSolutionsCache: Map<string, TechnicalSearchResult[]> = new Map();
  private qualityImprovementCache: Map<string, WebSearchResult[]> = new Map();

  constructor() {}

  // ===== WEB SEARCH INTEGRATION =====

  /**
   * Search for story revision techniques
   */
  async searchRevisionTechniques(
    issueType: string,
    genre: string
  ): Promise<WebSearchResult[]> {
    const key = `${issueType}-${genre}`;
    if (this.revisionTechniquesCache.has(key)) {
      return this.revisionTechniquesCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchNarrativeRepair(
      `${issueType} revision`
    );
    this.revisionTechniquesCache.set(key, results);
    return results;
  }

  /**
   * Research narrative problem solutions
   */
  async searchProblemSolutions(
    problem: string,
    context: string
  ): Promise<TechnicalSearchResult[]> {
    const key = `${problem}-${context}`;
    if (this.problemSolutionsCache.has(key)) {
      return this.problemSolutionsCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchWritingBestPractices(
      `${problem} ${context} fix`
    );
    this.problemSolutionsCache.set(key, results);
    return results;
  }

  /**
   * Look up quality improvement methods
   */
  async searchQualityImprovement(
    aspect: string,
    genre: string
  ): Promise<WebSearchResult[]> {
    const key = `${aspect}-${genre}`;
    if (this.qualityImprovementCache.has(key)) {
      return this.qualityImprovementCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${aspect} narrative quality improvement ${genre} fiction`
    );
    this.qualityImprovementCache.set(key, results);
    return results;
  }

  /**
   * Clear web search cache
   */
  clearWebSearchCache(): void {
    this.revisionTechniquesCache.clear();
    this.problemSolutionsCache.clear();
    this.qualityImprovementCache.clear();
  }

  // ===== CORE FUNCTIONALITY =====

  /**
   * Analyze narrative for issues
   */
  public analyzeNarrative(
    content: string,
    chapter: number,
    context?: {
      previousChapters?: string[];
      characterData?: Map<string, any>;
      worldData?: Map<string, any>;
    }
  ): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    
    // Check for various issue types
    issues.push(...this.checkPlotHoles(content, chapter, context));
    issues.push(...this.checkContinuity(content, chapter, context));
    issues.push(...this.checkCharacterConsistency(content, chapter, context));
    issues.push(...this.checkPacing(content, chapter));
    issues.push(...this.checkProseQuality(content, chapter));
    issues.push(...this.checkDialogueQuality(content, chapter, context));
    issues.push(...this.checkContradictions(content, chapter, context));
    issues.push(...this.checkLogicalFallacies(content, chapter));
    issues.push(...this.checkMotivation(content, chapter, context));
    
    // Store issues
    issues.forEach(issue => {
      this.issues.set(issue.id, issue);
    });
    
    // Calculate quality metrics
    this.calculateQualityMetrics(chapter, issues, content);
    
    return issues;
  }

  /**
   * Check for plot holes
   */
  private checkPlotHoles(
    content: string,
    chapter: number,
    context?: any
  ): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    const sentences = content.split(/[.!?]+/);
    
    // Check for unresolved elements
    const unresolvedPatterns = [
      { pattern: /\b(mysteriously disappeared|never explained|how.*got here|what.*happened to)\b/i, severity: 'major' as const },
      { pattern: /\b(suddenly.*appeared|from nowhere|out of thin air)\b/i, severity: 'moderate' as const },
      { pattern: /\b(conveniently|happened to|just so happened)\b/i, severity: 'minor' as const }
    ];
    
    sentences.forEach((sentence, index) => {
      unresolvedPatterns.forEach(({ pattern, severity }) => {
        if (pattern.test(sentence)) {
          issues.push({
            id: uuidv4(),
            type: 'plot-hole',
            severity,
            location: {
              chapter,
              sentence: index + 1,
              exactText: sentence.trim().substring(0, 100)
            },
            description: 'Possible plot hole or convenient coincidence',
            evidence: [sentence.trim()],
            impact: 'May undermine reader suspension of disbelief',
            suggestedFix: {
              action: 'rewrite-content',
              description: 'Provide logical explanation or foreshadowing',
              implementation: 'Add context or remove the coincidence',
              estimatedImpact: 'Improves narrative plausibility',
              sideEffects: [],
              difficulty: 'moderate'
            },
            autoFixable: false,
            priority: severity === 'major' ? 8 : 5
          });
        }
      });
    });
    
    return issues;
  }

  /**
   * Check for continuity errors
   */
  private checkContinuity(
    content: string,
    chapter: number,
    context?: any
  ): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    
    if (!context?.previousChapters || context.previousChapters.length === 0) {
      return issues;
    }
    
    const previousContent = context.previousChapters.join(' ');
    
    // Check character location consistency
    const characterLocations = this.extractCharacterLocations(previousContent);
    const currentLocations = this.extractCharacterLocations(content);
    
    characterLocations.forEach((loc1, char) => {
      const loc2 = currentLocations.get(char);
      if (loc2 && loc1 !== loc2 && !this.hasValidTransition(content, char, loc1, loc2)) {
        issues.push({
          id: uuidv4(),
          type: 'continuity-error',
          severity: 'moderate',
          location: { chapter },
          description: `${char} moved without explanation`,
          evidence: [`Previously at ${loc1}`, `Now at ${loc2}`],
          impact: 'Confuses reader about character movements',
          suggestedFix: {
            action: 'fix-continuity',
            description: 'Add transition or update location',
            implementation: 'Include scene showing movement or correct location',
            estimatedImpact: 'Improves spatial consistency',
            sideEffects: [],
            difficulty: 'easy'
          },
          autoFixable: false,
          priority: 6
        });
      }
    });
    
    return issues;
  }

  /**
   * Extract character locations from content
   */
  private extractCharacterLocations(content: string): Map<string, string> {
    const locations = new Map<string, string>();
    const sentences = content.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      const locationMatch = sentence.match(/(\w+)\s+was\s+(?:in|at|on)\s+([^.]+)/i);
      if (locationMatch) {
        locations.set(locationMatch[1].toLowerCase(), locationMatch[2].trim());
      }
    });
    
    return locations;
  }

  /**
   * Check if transition is valid
   */
  private hasValidTransition(content: string, character: string, from: string, to: string): boolean {
    const transitionIndicators = /\b(traveled|moved|went|journeyed|arrived)\b/i;
    return transitionIndicators.test(content);
  }

  /**
   * Check character consistency
   */
  private checkCharacterConsistency(
    content: string,
    chapter: number,
    context?: any
  ): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    
    if (!context?.characterData) return issues;
    
    // Check if character actions align with established traits
    const characterActions = this.extractCharacterActions(content);
    
    characterActions.forEach((action, char) => {
      const characterData = context.characterData.get(char);
      if (!characterData) return;
      
      const inconsistent = this.checkActionConsistency(action, characterData);
      if (inconsistent) {
        issues.push({
          id: uuidv4(),
          type: 'character-inconsistency',
          severity: 'moderate',
          location: { chapter },
          description: `${char} acts out of character`,
          evidence: [action, `Traits: ${characterData.traits?.join(', ')}`],
          impact: 'Undermines character believability',
          suggestedFix: {
            action: 'deepen-character',
            description: 'Provide motivation or change action',
            implementation: 'Add internal reasoning or modify behavior',
            estimatedImpact: 'Improves character consistency',
            sideEffects: [],
            difficulty: 'moderate'
          },
          autoFixable: false,
          priority: 7
        });
      }
    });
    
    return issues;
  }

  /**
   * Extract character actions
   */
  private extractCharacterActions(content: string): Map<string, string> {
    const actions = new Map<string, string>();
    const sentences = content.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      const actionMatch = sentence.match(/(\w+)\s+(?:decided|chose|began|started)\s+([^.]+)/i);
      if (actionMatch) {
        actions.set(actionMatch[1].toLowerCase(), actionMatch[2].trim());
      }
    });
    
    return actions;
  }

  /**
   * Check if action is consistent with character data
   */
  private checkActionConsistency(action: string, characterData: any): string | null {
    const traits = characterData.traits || [];
    const actionWords = action.toLowerCase().split(/\s+/);
    
    // Check for contradictory actions
    if (traits.includes('cowardly') && actionWords.some(w => ['brave', 'heroic', 'courageous'].includes(w))) {
      return 'contradictory to cowardly trait';
    }
    
    if (traits.includes('honest') && actionWords.some(w => ['lie', 'deceive', 'cheat'].includes(w))) {
      return 'contradictory to honest trait';
    }
    
    return null;
  }

  /**
   * Check pacing issues
   */
  private checkPacing(content: string, chapter: number): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    const sentences = content.split(/[.!?]+/);
    
    // Check for consistently short sentences (staccato pacing)
    const shortSentences = sentences.filter(s => s.split(/\s+/).length < 8).length;
    const shortRatio = shortSentences / sentences.length;
    
    if (shortRatio > 0.8) {
      issues.push({
        id: uuidv4(),
        type: 'pacing-issue',
        severity: 'minor',
        location: { chapter },
        description: 'Too many short sentences creates staccato pacing',
        evidence: [`${Math.round(shortRatio * 100)}% sentences are short`],
        impact: 'May feel rushed or choppy',
        suggestedFix: {
          action: 'adjust-pacing',
          description: 'Vary sentence length for better rhythm',
          implementation: 'Combine some short sentences or add details',
          estimatedImpact: 'Improves reading flow',
          sideEffects: [],
          difficulty: 'easy'
        },
        autoFixable: true,
        priority: 4
      });
    }
    
    // Check for consistently long sentences (slow pacing)
    const longSentences = sentences.filter(s => s.split(/\s+/).length > 25).length;
    const longRatio = longSentences / sentences.length;
    
    if (longRatio > 0.6) {
      issues.push({
        id: uuidv4(),
        type: 'pacing-issue',
        severity: 'minor',
        location: { chapter },
        description: 'Too many long sentences creates slow pacing',
        evidence: [`${Math.round(longRatio * 100)}% sentences are long`],
        impact: 'May feel draggy or dense',
        suggestedFix: {
          action: 'adjust-pacing',
          description: 'Add shorter sentences for variety',
          implementation: 'Break up long sentences occasionally',
          estimatedImpact: 'Improves readability and engagement',
          sideEffects: [],
          difficulty: 'easy'
        },
        autoFixable: true,
        priority: 4
      });
    }
    
    return issues;
  }

  /**
   * Check prose quality
   */
  private checkProseQuality(content: string, chapter: number): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    const sentences = content.split(/[.!?]+/);
    
    // Check for passive voice
    const passiveCount = sentences.filter(s => /\b(was|were)\s+(\w+ed|written|said|done|made)\b/i.test(s)).length;
    const passiveRatio = passiveCount / sentences.length;
    
    if (passiveRatio > 0.4) {
      issues.push({
        id: uuidv4(),
        type: 'weak-prose',
        severity: 'minor',
        location: { chapter },
        description: 'High use of passive voice',
        evidence: [`${Math.round(passiveRatio * 100)}% sentences use passive voice`],
        impact: 'Reduces narrative impact and immediacy',
        suggestedFix: {
          action: 'enhance-prose',
          description: 'Convert to active voice where appropriate',
          implementation: 'Restructure sentences to make the actor the subject',
          estimatedImpact: 'Stronger, more engaging prose',
          sideEffects: [],
          difficulty: 'moderate'
        },
        autoFixable: false,
        priority: 3
      });
    }
    
    // Check for adverb overuse
    const adverbCount = (content.match(/\b\w+ly\b/g) || []).length;
    const adverbRatio = adverbCount / content.split(/\s+/).length;
    
    if (adverbRatio > 0.05) {
      issues.push({
        id: uuidv4(),
        type: 'weak-prose',
        severity: 'minor',
        location: { chapter },
        description: 'Overuse of adverbs',
        evidence: [`${Math.round(adverbRatio * 100)}% of words are adverbs`],
        impact: 'Weakens prose and shows instead of tells',
        suggestedFix: {
          action: 'enhance-prose',
          description: 'Replace adverbs with stronger verbs',
          implementation: 'Find better verbs or add descriptive details',
          estimatedImpact: 'More vivid, effective prose',
          sideEffects: [],
          difficulty: 'moderate'
        },
        autoFixable: false,
        priority: 3
      });
    }
    
    // Check for clichés
    const cliches = [
      'dark and stormy night',
      'heart skipped a beat',
      'breath caught in throat',
      'crack of dawn',
      'dead of night',
      'white as a sheet',
      'slept like a baby',
      'time stood still'
    ];
    
    cliches.forEach(cliche => {
      if (content.toLowerCase().includes(cliche)) {
        issues.push({
          id: uuidv4(),
          type: 'weak-prose',
          severity: 'minor',
          location: { chapter },
          description: `Cliché phrase: "${cliche}"`,
          evidence: [cliche],
          impact: 'Reduces originality and impact',
          suggestedFix: {
            action: 'enhance-prose',
            description: 'Replace with original phrasing',
            implementation: 'Find fresh way to express the same idea',
            estimatedImpact: 'More original, engaging prose',
            sideEffects: [],
            difficulty: 'moderate'
          },
          autoFixable: false,
          priority: 3
        });
      }
    });
    
    return issues;
  }

  /**
   * Check dialogue quality
   */
  private checkDialogueQuality(
    content: string,
    chapter: number,
    context?: any
  ): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    const dialogueMatches = content.match(/"[^"]+"/g) || [];
    
    // Check for on-the-nose dialogue
    dialogueMatches.forEach(dialogue => {
      const onTheNose = /\b(I am|you are|I feel|you feel)\s+(?:angry|sad|happy|afraid|worried)\b/i;
      if (onTheNose.test(dialogue)) {
        issues.push({
          id: uuidv4(),
          type: 'dialogue-problem',
          severity: 'minor',
          location: { chapter, exactText: dialogue.substring(0, 50) },
          description: 'On-the-nose emotional statement',
          evidence: [dialogue],
          impact: 'Feels unnatural and tells instead of shows',
          suggestedFix: {
            action: 'enhance-dialogue',
            description: 'Show emotion through action or subtext',
            implementation: 'Use body language or imply emotions',
            estimatedImpact: 'More natural, subtle dialogue',
            sideEffects: [],
            difficulty: 'moderate'
          },
          autoFixable: false,
          priority: 3
        });
      }
    });
    
    return issues;
  }

  /**
   * Check for contradictions
   */
  private checkContradictions(
    content: string,
    chapter: number,
    context?: any
  ): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    const sentences = content.split(/[.!?]+/);
    
    // Look for contradictory statements
    for (let i = 0; i < sentences.length - 1; i++) {
      const s1 = sentences[i].toLowerCase();
      const s2 = sentences[i + 1].toLowerCase();
      
      // Check for direct contradictions
      if (/\b(not|never)\b/.test(s1) && s2.includes(s1.replace(/\b(not|never)\s+/g, ''))) {
        issues.push({
          id: uuidv4(),
          type: 'contradiction',
          severity: 'moderate',
          location: { chapter, sentence: i + 1 },
          description: 'Contradictory statements',
          evidence: [sentences[i], sentences[i + 1]],
          impact: 'Confuses reader',
          suggestedFix: {
            action: 'resolve-contradiction',
            description: 'Clarify or remove contradiction',
            implementation: 'Review both statements for accuracy',
            estimatedImpact: 'Improves clarity',
            sideEffects: [],
            difficulty: 'easy'
          },
          autoFixable: false,
          priority: 6
        });
      }
    }
    
    return issues;
  }

  /**
   * Check for logical fallacies
   */
  private checkLogicalFallacies(content: string, chapter: number): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    const sentences = content.split(/[.!?]+/);
    
    sentences.forEach((sentence, index) => {
      // Check for non-sequitur
      if (sentence.includes('therefore') || sentence.includes('thus')) {
        const parts = sentence.split(/(?:therefore|thus)/i);
        if (parts.length === 2) {
          const antecedent = parts[0].trim();
          const consequent = parts[1].trim();
          
          // Simple check: if parts seem unrelated, flag as potential issue
          const antecedentWords = new Set(antecedent.toLowerCase().split(/\s+/));
          const consequentWords = new Set(consequent.toLowerCase().split(/\s+/));
          
          const commonWords = [...antecedentWords].filter(w => consequentWords.has(w));
          if (commonWords.length < 2) {
            issues.push({
              id: uuidv4(),
              type: 'logical-fallacy',
              severity: 'moderate',
              location: { chapter, sentence: index + 1 },
              description: 'Potential non-sequitur',
              evidence: [sentence.trim()],
              impact: 'May confuse reader logic',
              suggestedFix: {
                action: 'clarify-content',
                description: 'Add logical connection between statements',
                implementation: 'Explain the causal relationship',
                estimatedImpact: 'Improves logical flow',
                sideEffects: [],
                difficulty: 'moderate'
              },
              autoFixable: false,
              priority: 5
            });
          }
        }
      }
    });
    
    return issues;
  }

  /**
   * Check for motivation gaps
   */
  private checkMotivation(
    content: string,
    chapter: number,
    context?: any
  ): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    const sentences = content.split(/[.!?]+/);
    
    sentences.forEach((sentence, index) => {
      // Look for actions without clear motivation
      const actionWithoutMotivation = /\b(decided|chose)\s+to\s+([^.]+)\s+(?:without|regardless)\b/i;
      if (actionWithoutMotivation.test(sentence)) {
        issues.push({
          id: uuidv4(),
          type: 'motivation-gap',
          severity: 'minor',
          location: { chapter, sentence: index + 1 },
          description: 'Action lacks clear motivation',
          evidence: [sentence.trim()],
          impact: 'Character behavior may seem unmotivated',
          suggestedFix: {
            action: 'add-motivation',
            description: 'Add internal reasoning or external pressure',
            implementation: 'Show why the character makes this choice',
            estimatedImpact: 'Improves character motivation',
            sideEffects: [],
            difficulty: 'moderate'
          },
          autoFixable: false,
          priority: 5
        });
      }
    });
    
    return issues;
  }

  /**
   * Calculate quality metrics
   */
  private calculateQualityMetrics(chapter: number, issues: NarrativeIssue[], content: string): void {
    const totalIssues = issues.length;
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const majorIssues = issues.filter(i => i.severity === 'major').length;
    const moderateIssues = issues.filter(i => i.severity === 'moderate').length;
    const minorIssues = issues.filter(i => i.severity === 'minor').length;
    
    // Calculate scores based on issue severity
    const penaltyScore = (criticalIssues * 10 + majorIssues * 5 + moderateIssues * 2 + minorIssues * 1);
    const maxPenalty = totalIssues * 10;
    const baseScore = Math.max(0, 1 - (penaltyScore / Math.max(1, maxPenalty)));
    
    const metrics: QualityMetrics = {
      overall: baseScore,
      plot: this.calculatePlotScore(issues),
      characters: this.calculateCharacterScore(issues),
      prose: this.calculateProseScore(issues),
      dialogue: this.calculateDialogueScore(issues),
      pacing: this.calculatePacingScore(issues),
      coherence: this.calculateCoherenceScore(issues),
      engagement: this.calculateEngagementScore(issues, content),
      issues: {
        critical: criticalIssues,
        major: majorIssues,
        moderate: moderateIssues,
        minor: minorIssues
      }
    };
    
    this.qualityMetrics.set(chapter, metrics);
  }

  private calculatePlotScore(issues: NarrativeIssue[]): number {
    const plotIssues = issues.filter(i => ['plot-hole', 'contradiction', 'motivation-gap'].includes(i.type));
    return Math.max(0, 1 - (plotIssues.length * 0.1));
  }

  private calculateCharacterScore(issues: NarrativeIssue[]): number {
    const characterIssues = issues.filter(i => ['character-inconsistency', 'motivation-gap'].includes(i.type));
    return Math.max(0, 1 - (characterIssues.length * 0.15));
  }

  private calculateProseScore(issues: NarrativeIssue[]): number {
    const proseIssues = issues.filter(i => ['weak-prose'].includes(i.type));
    return Math.max(0, 1 - (proseIssues.length * 0.05));
  }

  private calculateDialogueScore(issues: NarrativeIssue[]): number {
    const dialogueIssues = issues.filter(i => ['dialogue-problem'].includes(i.type));
    return Math.max(0, 1 - (dialogueIssues.length * 0.1));
  }

  private calculatePacingScore(issues: NarrativeIssue[]): number {
    const pacingIssues = issues.filter(i => ['pacing-issue'].includes(i.type));
    return Math.max(0, 1 - (pacingIssues.length * 0.1));
  }

  private calculateCoherenceScore(issues: NarrativeIssue[]): number {
    const coherenceIssues = issues.filter(i => ['continuity-error', 'contradiction'].includes(i.type));
    return Math.max(0, 1 - (coherenceIssues.length * 0.15));
  }

  private calculateEngagementScore(issues: NarrativeIssue[], content: string): number {
    // Simple heuristic based on content characteristics
    const sentences = content.split(/[.!?]+/);
    const avgSentenceLength = content.split(/\s+/).length / sentences.length;
    
    let score = 0.7;
    
    // Vary sentence length is good
    if (avgSentenceLength > 10 && avgSentenceLength < 20) score += 0.1;
    
    // Some dialogue is good
    if (content.includes('"')) score += 0.1;
    
    return Math.min(1, score);
  }

  // ===== ENHANCEMENT GENERATION =====

  /**
   * Generate enhancement suggestions
   */
  public generateEnhancements(
    content: string,
    chapter: number
  ): NarrativeEnhancement[] {
    const enhancements: NarrativeEnhancement[] = [];
    
    // Generate prose enhancements
    enhancements.push(...this.generateProseEnhancements(content, chapter));
    
    // Generate sensory enhancements
    enhancements.push(...this.generateSensoryEnhancements(content, chapter));
    
    // Generate emotional enhancements
    enhancements.push(...this.generateEmotionalEnhancements(content, chapter));
    
    // Store enhancements
    enhancements.forEach(e => this.enhancements.set(e.id, e));
    
    return enhancements;
  }

  /**
   * Generate prose enhancements
   */
  private generateProseEnhancements(content: string, chapter: number): NarrativeEnhancement[] {
    const enhancements: NarrativeEnhancement[] = [];
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach((sentence, index) => {
      const words = sentence.split(/\s+/);
      
      // Enhance sentences starting with "There was/are"
      if (/^There\s+(?:was|were)\s+/i.test(sentence.trim())) {
        enhancements.push({
          id: uuidv4(),
          type: 'prose-improvement',
          location: { chapter, sentence: index + 1, exactText: sentence.trim().substring(0, 50) },
          description: 'Rewrite passive opening',
          currentContent: sentence.trim(),
          enhancedContent: this.enhancePassiveOpening(sentence),
          reasoning: 'Active voice is more engaging',
          expectedBenefit: 'Stronger narrative voice',
          confidence: 0.8
        });
      }
      
      // Enhance generic descriptions
      if (/\b(big|small|good|bad|nice|ugly)\b/i.test(sentence)) {
        enhancements.push({
          id: uuidv4(),
          type: 'sensory-detail',
          location: { chapter, sentence: index + 1 },
          description: 'Replace generic adjective',
          currentContent: sentence.trim(),
          enhancedContent: this.enhanceGenericAdjective(sentence),
          reasoning: 'Specific imagery is more vivid',
          expectedBenefit: 'More immersive description',
          confidence: 0.7
        });
      }
    });
    
    return enhancements;
  }

  /**
   * Enhance passive opening
   */
  private enhancePassiveOpening(sentence: string): string {
    // Simple transformation - in production would use NLP
    const match = sentence.match(/^There\s+(was|were)\s+(.+)$/i);
    if (!match) return sentence;
    
    const subject = match[2];
    return `${subject.charAt(0).toUpperCase() + subject.slice(1)} existed`;
  }

  /**
   * Enhance generic adjective
   */
  private enhanceGenericAdjective(sentence: string): string {
    // Simple enhancement - in production would use context-aware replacement
    return sentence
      .replace(/\bbig\b/gi, 'massive')
      .replace(/\bsmall\b/gi, 'compact')
      .replace(/\bgood\b/gi, 'excellent')
      .replace(/\bbad\b/gi, 'dreadful')
      .replace(/\bnice\b/gi, 'pleasant')
      .replace(/\bugly\b/gi, 'grotesque');
  }

  /**
   * Generate sensory enhancements
   */
  private generateSensoryEnhancements(content: string, chapter: number): NarrativeEnhancement[] {
    const enhancements: NarrativeEnhancement[] = [];
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach((sentence, index) => {
      // Check if sentence lacks sensory detail
      const hasVisual = /\b(saw|looked|watched|observed|noticed)\b/i.test(sentence);
      const hasAuditory = /\b(heard|listened|sound|noise)\b/i.test(sentence);
      const hasTactile = /\b(felt|touched|grasped)\b/i.test(sentence);
      
      if (!hasVisual && !hasAuditory && !hasTactile && sentence.length > 100) {
        enhancements.push({
          id: uuidv4(),
          type: 'sensory-detail',
          location: { chapter, sentence: index + 1 },
          description: 'Add sensory detail',
          currentContent: sentence.trim(),
          enhancedContent: this.addSensoryDetail(sentence),
          reasoning: 'Sensory details create immersion',
          expectedBenefit: 'More vivid, engaging prose',
          confidence: 0.6
        });
      }
    });
    
    return enhancements;
  }

  /**
   * Add sensory detail
   */
  private addSensoryDetail(sentence: string): string {
    // Simple addition - in production would be context-aware
    return sentence.replace(/\./, ', the air thick with tension.');
  }

  /**
   * Generate emotional enhancements
   */
  private generateEmotionalEnhancements(content: string, chapter: number): NarrativeEnhancement[] {
    const enhancements: NarrativeEnhancement[] = [];
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach((sentence, index) => {
      // Check for emotion words without showing
      const emotionWords = /\b(angry|sad|happy|afraid|excited|nervous)\b/i;
      if (emotionWords.test(sentence) && !/\b(felt|seemed|appeared)\b/i.test(sentence)) {
        enhancements.push({
          id: uuidv4(),
          type: 'emotional-deepening',
          location: { chapter, sentence: index + 1 },
          description: 'Show emotion instead of telling',
          currentContent: sentence.trim(),
          enhancedContent: this.showEmotion(sentence),
          reasoning: 'Show don\'t tell creates deeper engagement',
          expectedBenefit: 'More impactful emotional moments',
          confidence: 0.7
        });
      }
    });
    
    return enhancements;
  }

  /**
   * Show emotion
   */
  private showEmotion(sentence: string): string {
    // Simple transformation - in production would use context
    return sentence.replace(/\b(was|were)\s+(\w+ed)\b/gi, 'felt $2');
  }

  // ===== REPAIR FUNCTIONS =====

  /**
   * Apply auto-fixable issues
   */
  public applyAutoFixes(chapter: number): RepairResult[] {
    const chapterIssues = Array.from(this.issues.values()).filter(i => i.location.chapter === chapter);
    const autoFixable = chapterIssues.filter(i => i.autoFixable);
    
    const results: RepairResult[] = [];
    
    autoFixable.forEach(issue => {
      const result = this.applyFix(issue);
      results.push(result);
      this.repairHistory.push(result);
    });
    
    return results;
  }

  /**
   * Apply specific fix
   */
  public applyFix(issue: NarrativeIssue): RepairResult {
    const result: RepairResult = {
      issueId: issue.id,
      applied: true,
      success: true,
      action: issue.suggestedFix.action,
      changes: [issue.suggestedFix.description],
      newIssues: [],
      qualityImprovement: 0.1
    };
    
    this.repairResults.set(issue.id, result);
    
    return result;
  }

  /**
   * Apply enhancement
   */
  public applyEnhancement(enhancementId: string): RepairResult {
    const enhancement = this.enhancements.get(enhancementId);
    if (!enhancement) {
      throw new Error('Enhancement not found');
    }
    
    const result: RepairResult = {
      issueId: enhancementId,
      applied: true,
      success: true,
      action: 'rewrite-content',
      changes: [`Enhanced: ${enhancement.description}`],
      newIssues: [],
      qualityImprovement: enhancement.confidence * 0.1
    };
    
    this.repairResults.set(enhancementId, result);
    
    return result;
  }

  // ===== REPAIR PLAN =====

  /**
   * Generate repair plan
   */
  public generateRepairPlan(chapter: number): RepairPlan {
    const chapterIssues = Array.from(this.issues.values())
      .filter(i => i.location.chapter === chapter)
      .sort((a, b) => b.priority - a.priority);
    
    const chapterEnhancements = Array.from(this.enhancements.values())
      .filter(e => e.location.chapter === chapter)
      .sort((a, b) => b.confidence - a.confidence);
    
    const plan: RepairPlan = {
      id: uuidv4(),
      chapter,
      issues: chapterIssues,
      enhancements: chapterEnhancements,
      recommendedOrder: this.generateRecommendedOrder(chapterIssues, chapterEnhancements),
      estimatedTime: this.estimateRepairTime(chapterIssues, chapterEnhancements),
      difficulty: this.assessDifficulty(chapterIssues, chapterEnhancements),
      expectedImprovement: this.calculateExpectedImprovement(chapterIssues, chapterEnhancements)
    };
    
    return plan;
  }

  /**
   * Generate recommended order for fixes
   */
  private generateRecommendedOrder(
    issues: NarrativeIssue[],
    enhancements: NarrativeEnhancement[]
  ): string[] {
    const order: string[] = [];
    
    // Priority: critical > major > moderate > minor
    const sortedIssues = [...issues].sort((a, b) => {
      const severityOrder = ['critical', 'major', 'moderate', 'minor'];
      return severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity);
    });
    
    sortedIssues.forEach(issue => order.push(issue.id));
    enhancements.forEach(e => order.push(e.id));
    
    return order;
  }

  /**
   * Estimate repair time
   */
  private estimateRepairTime(issues: NarrativeIssue[], enhancements: NarrativeEnhancement[]): string {
    const totalDifficulty = issues.reduce((sum, i) => {
      const difficultyScores = { easy: 1, moderate: 3, difficult: 5 };
      return sum + difficultyScores[i.suggestedFix.difficulty];
    }, 0) + enhancements.length * 2;
    
    const hours = Math.ceil(totalDifficulty / 10);
    return `~${hours} hours`;
  }

  /**
   * Assess difficulty
   */
  private assessDifficulty(issues: NarrativeIssue[], enhancements: NarrativeEnhancement[]): RepairPlan['difficulty'] {
    const difficultIssues = issues.filter(i => i.suggestedFix.difficulty === 'difficult').length;
    
    if (difficultIssues > 3) return 'difficult';
    if (difficultIssues > 0 || issues.length > 10) return 'moderate';
    return 'easy';
  }

  /**
   * Calculate expected improvement
   */
  private calculateExpectedImprovement(issues: NarrativeIssue[], enhancements: NarrativeEnhancement[]): number {
    const issueImprovement = issues.reduce((sum, i) => {
      const severityScores = { critical: 0.2, major: 0.1, moderate: 0.05, minor: 0.02 };
      return sum + severityScores[i.severity];
    }, 0);
    
    const enhancementImprovement = enhancements.reduce((sum, e) => sum + (e.confidence * 0.05), 0);
    
    return Math.min(1, issueImprovement + enhancementImprovement);
  }

  // ===== PUBLIC API =====

  /**
   * Get issues for chapter
   */
  public getIssues(chapter?: number): NarrativeIssue[] {
    const issues = Array.from(this.issues.values());
    if (chapter !== undefined) {
      return issues.filter(i => i.location.chapter === chapter);
    }
    return issues;
  }

  /**
   * Get issue by ID
   */
  public getIssue(issueId: string): NarrativeIssue | undefined {
    return this.issues.get(issueId);
  }

  /**
   * Get enhancements for chapter
   */
  public getEnhancements(chapter?: number): NarrativeEnhancement[] {
    const enhancements = Array.from(this.enhancements.values());
    if (chapter !== undefined) {
      return enhancements.filter(e => e.location.chapter === chapter);
    }
    return enhancements;
  }

  /**
   * Get quality metrics
   */
  public getQualityMetrics(chapter: number): QualityMetrics | undefined {
    return this.qualityMetrics.get(chapter);
  }

  /**
   * Get all quality metrics
   */
  public getAllQualityMetrics(): Map<number, QualityMetrics> {
    return this.qualityMetrics;
  }

  /**
   * Get repair history
   */
  public getRepairHistory(): RepairResult[] {
    return this.repairHistory;
  }

  /**
   * Clear all data
   */
  public clearAllData(): void {
    this.issues.clear();
    this.enhancements.clear();
    this.repairResults.clear();
    this.continuityChecks = [];
    this.qualityMetrics.clear();
    this.repairHistory = [];
  }
}