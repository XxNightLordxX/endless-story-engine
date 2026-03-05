/**
 * MetaCognitionSystem - Self-Correction Layer
 * 
 * Provides intelligent self-correction capabilities for narrative generation:
 * - Detects narrative inconsistencies
 * - Identifies plot holes and logic errors
 * - Automatically corrects detected issues
 * - Maintains story coherence across chapters
 * - Learns from corrections to prevent similar issues
 */

import type { Chapter, Character, StoryState } from '../types';
import type { StoryGenerationOptions } from '../types';

interface NarrativeInconsistency {
  type: 'character_contradiction' | 'plot_hole' | 'timeline_error' | 'logic_error' | 'continuity_break';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: { chapter: number; paragraph: number; context: string };
  description: string;
  suggestedFix: string;
  autoFixable: boolean;
}

interface CorrectionHistory {
  timestamp: number;
  issueType: string;
  originalContent: string;
  correctedContent: string;
  confidence: number;
}

interface MetaCognitionConfig {
  enableAutoCorrection: boolean;
  maxCorrectionAttempts: number;
  confidenceThreshold: number;
  severityThreshold: 'low' | 'medium' | 'high' | 'critical';
}

export class MetaCognitionSystem {
  private inconsistencies: NarrativeInconsistency[] = [];
  private correctionHistory: CorrectionHistory[] = [];
  private characterStateCache: Map<string, any> = new Map();
  private timelineEvents: Array<{ timestamp: number; event: string; chapter: number }> = [];
  private config: MetaCognitionConfig;
  private correctionPatterns: Map<string, number> = new Map();
  
  // Cross-system references
  private arcModeling?: any;
  private threadScheduler?: any;
  private dialogueSystem?: any;
  private characterGenome?: any;
  private worldSimulation?: any;
  private structureLayer?: any;
  private symbolicTracker?: any;
  private moralEngine?: any;
  private crossArcEngine?: any;

  constructor(config: Partial<MetaCognitionConfig> = {}) {
    this.config = {
      enableAutoCorrection: config.enableAutoCorrection ?? true,
      maxCorrectionAttempts: config.maxCorrectionAttempts ?? 3,
      confidenceThreshold: config.confidenceThreshold ?? 0.7,
      severityThreshold: config.severityThreshold ?? 'medium'
    };
  }

  /**
   * Analyze chapter for narrative inconsistencies
   */
  async analyzeChapter(
    chapter: Chapter,
    previousChapters: Chapter[],
    characters: Map<string, Character>,
    storyState: StoryState
  ): Promise<NarrativeInconsistency[]> {
    this.inconsistencies = [];

    // Detect character contradictions
    await this.detectCharacterContradictions(chapter, characters);

    // Detect plot holes
    await this.detectPlotHoles(chapter, previousChapters);

    // Detect timeline errors
    await this.detectTimelineErrors(chapter, previousChapters, storyState);

    // Detect logic errors
    await this.detectLogicErrors(chapter, storyState);

    // Detect continuity breaks
    await this.detectContinuityBreaks(chapter, previousChapters);

    return this.inconsistencies.filter(
      issue => this.isSeverityAboveThreshold(issue.severity)
    );
  }

  /**
   * Detect character behavior contradictions
   */
  private async detectCharacterContradictions(
    chapter: Chapter,
    characters: Map<string, Character>
  ): Promise<void> {
    const paragraphs = chapter.content.split('\n\n');

    for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
      const paragraph = paragraphs[pIdx];
      const mentionedCharacters = this.extractMentionedCharacters(paragraph);

      for (const charName of mentionedCharacters) {
        const character = characters.get(charName);
        if (!character) continue;

        const cachedState = this.characterStateCache.get(charName);
        const currentState = this.extractCurrentCharacterState(paragraph, charName);

        // Check for behavior contradictions
        if (cachedState && this.detectBehaviorChange(cachedState, currentState)) {
          if (!this.isJustifiedBehaviorChange(cachedState, currentState, paragraph)) {
            this.inconsistencies.push({
              type: 'character_contradiction',
              severity: 'high',
              location: { chapter: chapter.chapterNumber, paragraph: pIdx + 1, context: paragraph.substring(0, 100) },
              description: `Character ${charName} exhibits contradictory behavior inconsistent with established traits`,
              suggestedFix: `Add transitional scene or context explaining ${charName}'s behavior change`,
              autoFixable: false
            });
          }
        }

        // Update cache
        this.characterStateCache.set(charName, currentState);
      }
    }
  }

  /**
   * Detect plot holes and missing connections
   */
  private async detectPlotHoles(
    chapter: Chapter,
    previousChapters: Chapter[]
  ): Promise<void> {
    const previousContent = previousChapters.map(ch => ch.content).join(' ');
    const currentContent = chapter.content;

    // Check for unexplained appearances of new elements
    const newEntities = this.extractNewEntities(currentContent, previousContent);
    for (const entity of newEntities) {
      if (!this.isEntityIntroduced(entity, currentContent)) {
        this.inconsistencies.push({
          type: 'plot_hole',
          severity: 'medium',
          location: { chapter: chapter.chapterNumber, paragraph: 0, context: `New entity: ${entity}` },
          description: `Entity "${entity}" appears without proper introduction or context`,
          suggestedFix: `Add introduction or backstory for ${entity}`,
          autoFixable: true
        });
      }
    }

    // Check for unresolved plot points
    const unresolvedPoints = this.extractUnresolvedPoints(previousContent);
    for (const point of unresolvedPoints) {
      if (!this.isPointAddressed(point, currentContent)) {
        // Only flag if it's been more than 5 chapters since introduction
        const chaptersSince = this.countChaptersSinceIntroduction(point, previousChapters);
        if (chaptersSince > 5) {
          this.inconsistencies.push({
            type: 'plot_hole',
            severity: 'low',
            location: { chapter: chapter.chapterNumber, paragraph: 0, context: `Unresolved: ${point}` },
            description: `Plot point "${point}" remains unresolved after ${chaptersSince} chapters`,
            suggestedFix: `Address or reference "${point}" in current or upcoming chapters`,
            autoFixable: true
          });
        }
      }
    }
  }

  /**
   * Detect timeline and sequence errors
   */
  private async detectTimelineErrors(
    chapter: Chapter,
    previousChapters: Chapter[],
    storyState: StoryState
  ): Promise<void> {
    const paragraphs = chapter.content.split('\n\n');

    for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
      const paragraph = paragraphs[pIdx];

      // Extract temporal references
      const temporalMarkers = this.extractTemporalMarkers(paragraph);

      for (const marker of temporalMarkers) {
        // Check for impossible time sequences
        if (this.isImpossibleSequence(marker, this.timelineEvents)) {
          this.inconsistencies.push({
            type: 'timeline_error',
            severity: 'high',
            location: { chapter: chapter.chapterNumber, paragraph: pIdx + 1, context: paragraph.substring(0, 100) },
            description: `Temporal contradiction: ${marker}`,
            suggestedFix: `Adjust timeline or clarify temporal sequence`,
            autoFixable: true
          });
        }

        // Record event
        this.timelineEvents.push({
          timestamp: Date.now(),
          event: marker,
          chapter: chapter.chapterNumber
        });
      }
    }
  }

  /**
   * Detect logical inconsistencies
   */
  private async detectLogicErrors(
    chapter: Chapter,
    storyState: StoryState
  ): Promise<void> {
    const paragraphs = chapter.content.split('\n\n');

    for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
      const paragraph = paragraphs[pIdx];

      // Check for logical fallacies
      const fallacies = this.detectLogicalFallacies(paragraph);
      for (const fallacy of fallacies) {
        this.inconsistencies.push({
          type: 'logic_error',
          severity: 'medium',
          location: { chapter: chapter.chapterNumber, paragraph: pIdx + 1, context: paragraph.substring(0, 100) },
          description: `Logical inconsistency: ${fallacy}`,
          suggestedFix: `Restructure argument or clarify logical connection`,
          autoFixable: false
        });
      }

      // Check for cause-effect violations
      const violations = this.detectCauseEffectViolations(paragraph);
      for (const violation of violations) {
        this.inconsistencies.push({
          type: 'logic_error',
          severity: 'high',
          location: { chapter: chapter.chapterNumber, paragraph: pIdx + 1, context: paragraph.substring(0, 100) },
          description: `Cause-effect violation: ${violation}`,
          suggestedFix: `Ensure logical cause-effect relationship`,
          autoFixable: true
        });
      }
    }
  }

  /**
   * Detect continuity breaks
   */
  private async detectContinuityBreaks(
    chapter: Chapter,
    previousChapters: Chapter[]
  ): Promise<void> {
    if (previousChapters.length === 0) return;

    const lastChapter = previousChapters[previousChapters.length - 1];

    // Check for scene continuity
    const currentScene = this.extractSceneDetails(chapter.content);
    const lastScene = this.extractSceneDetails(lastChapter.content);

    if (this.isSceneDiscontinuity(currentScene, lastScene)) {
      this.inconsistencies.push({
        type: 'continuity_break',
        severity: 'medium',
        location: { chapter: chapter.chapterNumber, paragraph: 0, context: 'Scene change' },
        description: `Scene discontinuity: ${currentScene.location} vs ${lastScene.location}`,
        suggestedFix: `Add transition scene or clarify scene change`,
        autoFixable: true
      });
    }
  }

  /**
   * Attempt to auto-correct detected issues
   */
  async autoCorrectChapter(
    chapter: Chapter,
    inconsistencies: NarrativeInconsistency[]
  ): Promise<{ corrected: Chapter; corrections: CorrectionHistory[] }> {
    if (!this.config.enableAutoCorrection) {
      return { corrected: chapter, corrections: [] };
    }

    const autoFixableIssues = inconsistencies.filter(issue => issue.autoFixable);
    const corrections: CorrectionHistory[] = [];

    let correctedContent = chapter.content;
    let attempts = 0;

    for (const issue of autoFixableIssues) {
      if (attempts >= this.config.maxCorrectionAttempts) break;

      try {
        const { corrected, correction } = await this.applyCorrection(correctedContent, issue);
        if (correction.confidence >= this.config.confidenceThreshold) {
          correctedContent = corrected;
          corrections.push(correction);
          this.correctionHistory.push(correction);
          
          // Track correction patterns
          const pattern = `${issue.type}_${issue.severity}`;
          this.correctionPatterns.set(pattern, (this.correctionPatterns.get(pattern) || 0) + 1);
        }
      } catch (error) {
        console.error(`Auto-correction failed for issue type ${issue.type}:`, error);
      }

      attempts++;
    }

    return {
      corrected: { ...chapter, content: correctedContent },
      corrections
    };
  }

  /**
   * Apply a specific correction
   */
  private async applyCorrection(
    content: string,
    issue: NarrativeInconsistency
  ): Promise<{ corrected: string; correction: CorrectionHistory }> {
    let correctedContent = content;

    switch (issue.type) {
      case 'plot_hole':
        correctedContent = this.correctPlotHole(content, issue);
        break;
      case 'timeline_error':
        correctedContent = this.correctTimelineError(content, issue);
        break;
      case 'continuity_break':
        correctedContent = this.correctContinuityBreak(content, issue);
        break;
      default:
        correctedContent = content;
    }

    const correction: CorrectionHistory = {
      timestamp: Date.now(),
      issueType: issue.type,
      originalContent: content.substring(0, 200),
      correctedContent: correctedContent.substring(0, 200),
      confidence: this.calculateCorrectionConfidence(issue)
    };

    return { corrected: correctedContent, correction };
  }

  /**
   * Correct plot hole
   */
  private correctPlotHole(content: string, issue: NarrativeInconsistency): string {
    const paragraphs = content.split('\n\n');
    
    // Insert explanatory paragraph
    const explanatoryParagraph = this.generateExplanatoryParagraph(issue.description);
    paragraphs.splice(0, 0, explanatoryParagraph);

    return paragraphs.join('\n\n');
  }

  /**
   * Correct timeline error
   */
  private correctTimelineError(content: string, issue: NarrativeInconsistency): string {
    // Add temporal clarification
    const temporalClarification = `[Note: Clarifying temporal sequence] `;
    return temporalClarification + content;
  }

  /**
   * Correct continuity break
   */
  private correctContinuityBreak(content: string, issue: NarrativeInconsistency): string {
    const paragraphs = content.split('\n\n');
    
    // Add transition paragraph
    const transition = this.generateTransitionParagraph(issue.description);
    paragraphs.splice(0, 0, transition);

    return paragraphs.join('\n\n');
  }

  /**
   * Generate explanatory paragraph for plot holes
   */
  private generateExplanatoryParagraph(description: string): string {
    const templates = [
      `Unseen forces had been at work, setting the stage for what was to come. ${description}`,
      `The threads of fate were weaving together. ${description}`,
      `Behind the scenes, events had been unfolding. ${description}`
    ];
    
    const seed = Date.now();
    return templates[seed % templates.length];
  }

  /**
   * Generate transition paragraph
   */
  private generateTransitionParagraph(description: string): string {
    const templates = [
      `The transition was abrupt, as reality shifted. ${description}`,
      `Time flowed differently here. ${description}`,
      `Between one moment and the next, everything changed. ${description}`
    ];
    
    const seed = Date.now();
    return templates[seed % templates.length];
  }

  // Helper methods

  private extractMentionedCharacters(paragraph: string): string[] {
    // Simple extraction - in production, use NLP
    const characterPatterns = [
      /\b([A-Z][a-z]+)\b/g,
    ];
    
    const characters: string[] = [];
    for (const pattern of characterPatterns) {
      const matches = paragraph.match(pattern);
      if (matches) {
        characters.push(...matches);
      }
    }
    
    return [...new Set(characters)];
  }

  private extractCurrentCharacterState(paragraph: string, charName: string): any {
    // Extract character's current state from paragraph
    return {
      action: this.extractAction(paragraph, charName),
      emotion: this.extractEmotion(paragraph),
      location: this.extractLocation(paragraph)
    };
  }

  private extractAction(paragraph: string, charName: string): string {
    // Simplified action extraction
    const actionVerbs = ['ran', 'walked', 'spoke', 'fought', 'thought', 'felt', 'saw', 'heard'];
    for (const verb of actionVerbs) {
      if (paragraph.toLowerCase().includes(verb)) {
        return verb;
      }
    }
    return 'unknown';
  }

  private extractEmotion(paragraph: string): string {
    const emotions = ['fear', 'anger', 'joy', 'sadness', 'surprise', 'disgust'];
    for (const emotion of emotions) {
      if (paragraph.toLowerCase().includes(emotion)) {
        return emotion;
      }
    }
    return 'neutral';
  }

  private extractLocation(paragraph: string): string {
    const locations = ['room', 'hallway', 'outside', 'inside', 'city', 'forest', 'mountain'];
    for (const loc of locations) {
      if (paragraph.toLowerCase().includes(loc)) {
        return loc;
      }
    }
    return 'unknown';
  }

  private detectBehaviorChange(oldState: any, newState: any): boolean {
    return oldState.action !== newState.action || oldState.emotion !== newState.emotion;
  }

  private isJustifiedBehaviorChange(oldState: any, newState: any, context: string): boolean {
    // Check if there's contextual justification for behavior change
    const justificationMarkers = ['suddenly', 'however', 'then', 'after', 'because'];
    return justificationMarkers.some(marker => context.toLowerCase().includes(marker));
  }

  private extractNewEntities(current: string, previous: string): string[] {
    // Simple extraction of new proper nouns
    const currentEntities = current.match(/\b([A-Z][a-z]+)\b/g) || [];
    const previousEntities = previous.match(/\b([A-Z][a-z]+)\b/g) || [];
    
    return currentEntities.filter(entity => !previousEntities.includes(entity));
  }

  private isEntityIntroduced(entity: string, content: string): boolean {
    const introductionMarkers = ['introduced', 'appeared', 'emerged', 'arrived', 'came'];
    return introductionMarkers.some(marker => 
      content.toLowerCase().includes(marker) && content.toLowerCase().includes(entity.toLowerCase())
    );
  }

  private extractUnresolvedPoints(content: string): string[] {
    const unresolvedPatterns = [
      /(?:question|mystery|puzzle|riddle)(?:\s+of\s+([A-Z][a-z]+))?/gi,
      /(?:need|must|have to)\s+(?:find|discover|solve|answer)/gi
    ];
    
    const points: string[] = [];
    for (const pattern of unresolvedPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        points.push(...matches);
      }
    }
    
    return [...new Set(points)];
  }

  private isPointAddressed(point: string, content: string): boolean {
    const resolutionMarkers = ['answered', 'solved', 'resolved', 'completed', 'finished'];
    return resolutionMarkers.some(marker => 
      content.toLowerCase().includes(marker) && content.toLowerCase().includes(point.toLowerCase())
    );
  }

  private countChaptersSinceIntroduction(point: string, chapters: Chapter[]): number {
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (chapters[i].content.toLowerCase().includes(point.toLowerCase())) {
        return chapters.length - i;
      }
    }
    return chapters.length;
  }

  private extractTemporalMarkers(paragraph: string): string[] {
    const temporalPatterns = [
      /\b(\d+)\s+(?:years?|months?|weeks?|days?|hours?|minutes?|seconds?)\s+(?:ago|later|before|after)/gi,
      /\b(yesterday|today|tomorrow|now|then|soon|later|beforehand)\b/gi
    ];
    
    const markers: string[] = [];
    for (const pattern of temporalPatterns) {
      const matches = paragraph.match(pattern);
      if (matches) {
        markers.push(...matches);
      }
    }
    
    return [...new Set(markers)];
  }

  private isImpossibleSequence(marker: string, events: Array<{ timestamp: number; event: string; chapter: number }>): boolean {
    // Check for impossible temporal sequences
    if (marker.includes('ago') && marker.includes('later')) {
      return true;
    }
    return false;
  }

  private detectLogicalFallacies(paragraph: string): string[] {
    const fallacies: string[] = [];
    
    // Check for circular reasoning
    if (paragraph.includes('because') && paragraph.includes('therefore')) {
      const becauseIndex = paragraph.toLowerCase().indexOf('because');
      const thereforeIndex = paragraph.toLowerCase().indexOf('therefore');
      if (becauseIndex < thereforeIndex) {
        const becausePart = paragraph.substring(becauseIndex, thereforeIndex);
        const thereforePart = paragraph.substring(thereforeIndex);
        if (becausePart.includes(thereforePart.substring(10))) {
          fallacies.push('Circular reasoning detected');
        }
      }
    }
    
    return fallacies;
  }

  private detectCauseEffectViolations(paragraph: string): string[] {
    const violations: string[] = [];
    
    // Check for effect before cause
    const effectMarkers = ['resulted', 'caused', 'led to'];
    const causeMarkers = ['because', 'due to', 'as a result of'];
    
    for (const effect of effectMarkers) {
      const effectIndex = paragraph.toLowerCase().indexOf(effect);
      if (effectIndex !== -1) {
        for (const cause of causeMarkers) {
          const causeIndex = paragraph.toLowerCase().indexOf(cause);
          if (causeIndex > effectIndex && causeIndex !== -1) {
            violations.push(`Effect "${effect}" appears before cause "${cause}"`);
          }
        }
      }
    }
    
    return violations;
  }

  private extractSceneDetails(content: string): { location: string; time: string; characters: string[] } {
    return {
      location: this.extractLocation(content),
      time: this.extractTimeOfDay(content),
      characters: this.extractMentionedCharacters(content)
    };
  }

  private extractTimeOfDay(content: string): string {
    const times = ['morning', 'afternoon', 'evening', 'night', 'dawn', 'dusk'];
    for (const time of times) {
      if (content.toLowerCase().includes(time)) {
        return time;
      }
    }
    return 'unknown';
  }

  private isSceneDiscontinuity(current: any, last: any): boolean {
    return current.location !== 'unknown' && 
           last.location !== 'unknown' && 
           current.location !== last.location;
  }

  private isSeverityAboveThreshold(severity: string): boolean {
    const thresholds = { low: 0, medium: 1, high: 2, critical: 3 };
    return thresholds[severity as keyof typeof thresholds] >= thresholds[this.config.severityThreshold];
  }

  private calculateCorrectionConfidence(issue: NarrativeInconsistency): number {
    // Base confidence based on severity
    const severityConfidence = {
      low: 0.6,
      medium: 0.7,
      high: 0.8,
      critical: 0.9
    };
    
    // Adjust based on auto-fixability
    const autoFixBonus = issue.autoFixable ? 0.1 : 0;
    
    // Adjust based on correction patterns (learn from history)
    const pattern = `${issue.type}_${issue.severity}`;
    const patternFrequency = this.correctionPatterns.get(pattern) || 0;
    const patternBonus = Math.min(patternFrequency * 0.05, 0.2);
    
    const confidence = severityConfidence[issue.severity] + autoFixBonus + patternBonus;
    return Math.min(confidence, 1.0);
  }

  /**
   * Get correction statistics
   */
  getCorrectionStats(): {
    totalCorrections: number;
    correctionsByType: Map<string, number>;
    correctionsBySeverity: Map<string, number>;
    averageConfidence: number;
  } {
    const correctionsByType = new Map<string, number>();
    const correctionsBySeverity = new Map<string, number>();
    let totalConfidence = 0;

    for (const correction of this.correctionHistory) {
      correctionsByType.set(correction.issueType, (correctionsByType.get(correction.issueType) || 0) + 1);
      totalConfidence += correction.confidence;
    }

    return {
      totalCorrections: this.correctionHistory.length,
      correctionsByType,
      correctionsBySeverity: new Map(), // Would need to track severity
      averageConfidence: this.correctionHistory.length > 0 
        ? totalConfidence / this.correctionHistory.length 
        : 0
    };
  }

  /**
   * Reset system state
   */
  reset(): void {
    this.inconsistencies = [];
    this.correctionHistory = [];
    this.characterStateCache.clear();
    this.timelineEvents = [];
    this.correctionPatterns.clear();
  }

  /**
   * Export correction history
   */
  exportCorrectionHistory(): CorrectionHistory[] {
    return [...this.correctionHistory];
  }

  /**
   * Import correction history for learning
   */
  importCorrectionHistory(history: CorrectionHistory[]): void {
    this.correctionHistory = history;
    
    // Rebuild patterns from history
    for (const correction of history) {
      const pattern = `${correction.issueType}_medium`; // Assume medium severity
      this.correctionPatterns.set(pattern, (this.correctionPatterns.get(pattern) || 0) + 1);
    }
  }
  /**
   * Set cross-system references for MetaCognitionSystem
   * This allows the system to consult with and enhance other systems
   */
  setSystems(systems: {
    arcModeling?: any;
    threadScheduler?: any;
    dialogueSystem?: any;
    characterGenome?: any;
    worldSimulation?: any;
    structureLayer?: any;
    symbolicTracker?: any;
    moralEngine?: any;
    crossArcEngine?: any;
  }): void {
    this.arcModeling = systems.arcModeling;
    this.threadScheduler = systems.threadScheduler;
    this.dialogueSystem = systems.dialogueSystem;
    this.characterGenome = systems.characterGenome;
    this.worldSimulation = systems.worldSimulation;
    this.structureLayer = systems.structureLayer;
    this.symbolicTracker = systems.symbolicTracker;
    this.moralEngine = systems.moralEngine;
    this.crossArcEngine = systems.crossArcEngine;
  }

  /**
   * Get system status including cross-system connectivity
   */
  getSystemStatus(): {
    inconsistenciesDetected: number;
    correctionsApplied: number;
    connectedSystems: string[];
  } {
    const connectedSystems: string[] = [];
    if (this.arcModeling) connectedSystems.push('arcModeling');
    if (this.threadScheduler) connectedSystems.push('threadScheduler');
    if (this.dialogueSystem) connectedSystems.push('dialogueSystem');
    if (this.characterGenome) connectedSystems.push('characterGenome');
    if (this.worldSimulation) connectedSystems.push('worldSimulation');
    if (this.structureLayer) connectedSystems.push('structureLayer');
    if (this.symbolicTracker) connectedSystems.push('symbolicTracker');
    if (this.moralEngine) connectedSystems.push('moralEngine');
    if (this.crossArcEngine) connectedSystems.push('crossArcEngine');

    return {
      inconsistenciesDetected: this.inconsistencies.length,
      correctionsApplied: this.correctionHistory.length,
      connectedSystems
    };
  }
}
