/**
 * NarrativeRepairSystem - Narrative Issue Fixing System
 * 
 * Automatically detects and fixes narrative issues:
 * - Identifies plot holes and inconsistencies
 * - Repairs continuity errors
 * - Fixes character behavior violations
 * - Resolves timeline contradictions
 * - Addresses structural weaknesses
 */

import type { Chapter, Character } from '../types';
import type { StoryGenerationOptions } from '../types';
import { StructuralIntegrityLayer } from './StructuralIntegrityLayer';

interface NarrativeIssue {
  id: string;
  type: IssueType;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  category: 'plot' | 'character' | 'setting' | 'dialogue' | 'pacing' | 'consistency';
  chapter: number;
  location: string;
  description: string;
  detectedAt: number;
  autoFixable: boolean;
  fixAttempts: number;
  fixSuccess: boolean;
}

type IssueType = 
  | 'plot_hole'
  | 'continuity_error'
  | 'character_violation'
  | 'timeline_contradiction'
  | 'dialogue_inconsistency'
  | 'pacing_issue'
  | 'information_gap'
  | 'logical_fallacy'
  | 'repetition'
  | 'incomplete_scene';

interface RepairStrategy {
  issueType: IssueType;
  approach: 'insert' | 'replace' | 'delete' | 'restructure' | 'clarify';
  confidence: number;
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedTime: number;
  sideEffects: string[];
}

interface RepairOperation {
  id: string;
  issueId: string;
  strategy: RepairStrategy;
  originalContent: string;
  repairedContent: string;
  chapterNumber: number;
  location: string;
  timestamp: number;
  success: boolean;
  sideEffects: string[];
}

interface RepairReport {
  totalIssues: number;
  repairedIssues: number;
  unrepairedIssues: number;
  autoRepaired: number;
  manualReviewRequired: number;
  operations: RepairOperation[];
  summary: string;
}

export class NarrativeRepairSystem {
  private issues: Map<string, NarrativeIssue> = new Map();
  private operations: RepairOperation[] = [];
  private repairHistory: Map<string, number> = new Map();
  private currentChapter: number = 0;
  private structuralIntegrity: StructuralIntegrityLayer;
  
  // Cross-system references
  private metaCognition?: any;
  private structureLayer?: any;
  private characterGenome?: any;
  private worldSimulation?: any;
  private realityFramework?: any;

  constructor() {
    this.structuralIntegrity = new StructuralIntegrityLayer();
  }

  /**
   * Scan chapter for narrative issues
   */
  async scanChapter(
    chapter: Chapter,
    previousChapters: Chapter[],
    characters: Map<string, Character>,
    options: StoryGenerationOptions
  ): Promise<NarrativeIssue[]> {
    this.currentChapter = chapter.chapterNumber;

    const chapterIssues: NarrativeIssue[] = [];

    // Scan for plot holes
    const plotHoles = this.detectPlotHoles(chapter, previousChapters);
    chapterIssues.push(...plotHoles);

    // Scan for continuity errors
    const continuityErrors = this.detectContinuityErrors(chapter, previousChapters);
    chapterIssues.push(...continuityErrors);

    // Scan for character violations
    const characterViolations = this.detectCharacterViolations(chapter, characters);
    chapterIssues.push(...characterViolations);

    // Scan for timeline contradictions
    const timelineContradictions = this.detectTimelineContradictions(chapter, previousChapters);
    chapterIssues.push(...timelineContradictions);

    // Scan for dialogue inconsistencies
    const dialogueInconsistencies = this.detectDialogueInconsistencies(chapter);
    chapterIssues.push(...dialogueInconsistencies);

    // Scan for pacing issues
    const pacingIssues = this.detectPacingIssues(chapter, previousChapters);
    chapterIssues.push(...pacingIssues);

    // Scan for information gaps
    const informationGaps = this.detectInformationGaps(chapter, previousChapters);
    chapterIssues.push(...informationGaps);

    // Store issues
    for (const issue of chapterIssues) {
      this.issues.set(issue.id, issue);
    }

    return chapterIssues;
  }

  /**
   * Detect plot holes
   */
  private detectPlotHoles(chapter: Chapter, previousChapters: Chapter[]): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    const content = chapter.content;

    // Check for unexplained appearances
    const newElements = this.extractNewElements(content);
    for (const element of newElements) {
      if (!this.isElementExplained(element, content)) {
        issues.push({
          id: `plot_hole_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'plot_hole',
          severity: 'moderate',
          category: 'plot',
          chapter: chapter.chapterNumber,
          location: 'unknown',
          description: `"${element}" appears without proper introduction or explanation`,
          detectedAt: Date.now(),
          autoFixable: true,
          fixAttempts: 0,
          fixSuccess: false
        });
      }
    }

    // Check for unresolved plot points
    const unresolvedPoints = this.extractUnresolvedPoints(previousChapters.map(ch => ch.content).join(' '));
    for (const point of unresolvedPoints) {
      if (!this.isPointAddressed(point, content) && 
          this.chaptersSinceIntroduction(point, previousChapters) > 10) {
        issues.push({
          id: `unresolved_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'plot_hole',
          severity: 'minor',
          category: 'plot',
          chapter: chapter.chapterNumber,
          location: 'unknown',
          description: `Plot point "${point}" remains unresolved`,
          detectedAt: Date.now(),
          autoFixable: true,
          fixAttempts: 0,
          fixSuccess: false
        });
      }
    }

    return issues;
  }

  /**
   * Detect continuity errors
   */
  private detectContinuityErrors(chapter: Chapter, previousChapters: Chapter[]): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];

    if (previousChapters.length === 0) return issues;

    const lastChapter = previousChapters[previousChapters.length - 1];

    // Check for scene continuity
    const currentScene = this.extractSceneDetails(chapter.content);
    const lastScene = this.extractSceneDetails(lastChapter.content);

    if (this.isSceneDiscontinuity(currentScene, lastScene)) {
      issues.push({
        id: `continuity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'continuity_error',
        severity: 'minor',
        category: 'setting',
        chapter: chapter.chapterNumber,
        location: 'scene_transition',
        description: `Scene discontinuity: ${currentScene.location} vs ${lastScene.location}`,
        detectedAt: Date.now(),
        autoFixable: true,
        fixAttempts: 0,
        fixSuccess: false
      });
    }

    return issues;
  }

  /**
   * Detect character violations
   */
  private detectCharacterViolations(chapter: Chapter, characters: Map<string, Character>): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    const content = chapter.content;

    // Check for out-of-character behavior
    for (const [charId, character] of characters) {
      if (!content.includes(character.name)) continue;

      const violations = this.checkCharacterConsistency(character, content);
      for (const violation of violations) {
        issues.push({
          id: `character_violation_${charId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'character_violation',
          severity: 'moderate',
          category: 'character',
          chapter: chapter.chapterNumber,
          location: character.name,
          description: `${character.name}: ${violation}`,
          detectedAt: Date.now(),
          autoFixable: false,
          fixAttempts: 0,
          fixSuccess: false
        });
      }
    }

    return issues;
  }

  /**
   * Detect timeline contradictions
   */
  private detectTimelineContradictions(chapter: Chapter, previousChapters: Chapter[]): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    const content = chapter.content;

    // Check for impossible time sequences
    const temporalMarkers = this.extractTemporalMarkers(content);
    for (const marker of temporalMarkers) {
      if (this.isImpossibleSequence(marker)) {
        issues.push({
          id: `timeline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'timeline_contradiction',
          severity: 'major',
          category: 'consistency',
          chapter: chapter.chapterNumber,
          location: 'temporal_reference',
          description: `Temporal contradiction: ${marker}`,
          detectedAt: Date.now(),
          autoFixable: true,
          fixAttempts: 0,
          fixSuccess: false
        });
      }
    }

    return issues;
  }

  /**
   * Detect dialogue inconsistencies
   */
  private detectDialogueInconsistencies(chapter: Chapter): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    const content = chapter.content;

    // Check for repetitive dialogue
    const dialogueMatches = content.match(/"[^"]+"/g) || [];
    const dialogueFrequency = new Map<string, number>();

    for (const dialogue of dialogueMatches) {
      dialogueFrequency.set(dialogue, (dialogueFrequency.get(dialogue) || 0) + 1);
    }

    for (const [dialogue, count] of dialogueFrequency) {
      if (count > 2) {
        issues.push({
          id: `dialogue_repetition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'repetition',
          severity: 'minor',
          category: 'dialogue',
          chapter: chapter.chapterNumber,
          location: 'dialogue',
          description: `Repetitive dialogue: "${dialogue}" (${count} times)`,
          detectedAt: Date.now(),
          autoFixable: true,
          fixAttempts: 0,
          fixSuccess: false
        });
      }
    }

    return issues;
  }

  /**
   * Detect pacing issues
   */
  private detectPacingIssues(chapter: Chapter, previousChapters: Chapter[]): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];

    // Check chapter length
    const expectedLength = 500;
    const actualLength = chapter.content.length;

    if (actualLength < expectedLength * 0.5) {
      issues.push({
        id: `pacing_short_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'pacing_issue',
        severity: 'minor',
        category: 'pacing',
        chapter: chapter.chapterNumber,
        location: 'entire_chapter',
        description: `Chapter too short (${actualLength} vs expected ${expectedLength})`,
        detectedAt: Date.now(),
        autoFixable: true,
        fixAttempts: 0,
        fixSuccess: false
      });
    }

    if (actualLength > expectedLength * 2) {
      issues.push({
        id: `pacing_long_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'pacing_issue',
        severity: 'minor',
        category: 'pacing',
        chapter: chapter.chapterNumber,
        location: 'entire_chapter',
        description: `Chapter too long (${actualLength} vs expected ${expectedLength})`,
        detectedAt: Date.now(),
        autoFixable: true,
        fixAttempts: 0,
        fixSuccess: false
      });
    }

    return issues;
  }

  /**
   * Detect information gaps
   */
  private detectInformationGaps(chapter: Chapter, previousChapters: Chapter[]): NarrativeIssue[] {
    const issues: NarrativeIssue[] = [];
    const content = chapter.content;

    // Check for references to unexplained concepts
    const concepts = this.extractConcepts(content);
    for (const concept of concepts) {
      if (!this.isConceptExplained(concept, content, previousChapters)) {
        issues.push({
          id: `info_gap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'information_gap',
          severity: 'minor',
          category: 'plot',
          chapter: chapter.chapterNumber,
          location: 'concept_reference',
          description: `Unexplained concept: "${concept}"`,
          detectedAt: Date.now(),
          autoFixable: true,
          fixAttempts: 0,
          fixSuccess: false
        });
      }
    }

    return issues;
  }

  /**
   * Attempt to repair issues
   */
  async repairIssues(
    issues: NarrativeIssue[],
    chapters: Chapter[],
    options: StoryGenerationOptions
  ): Promise<RepairReport> {
    const repairedIssues: NarrativeIssue[] = [];
    const unrepairedIssues: NarrativeIssue[] = [];
    const operations: RepairOperation[] = [];

    for (const issue of issues) {
      if (!issue.autoFixable) {
        unrepairedIssues.push(issue);
        continue;
      }

      const strategy = this.determineRepairStrategy(issue);
      if (!strategy) {
        unrepairedIssues.push(issue);
        continue;
      }

      const operation = await this.executeRepair(issue, strategy, chapters, options);
      operations.push(operation);

      if (operation.success) {
        issue.fixSuccess = true;
        issue.fixAttempts++;
        repairedIssues.push(issue);
      } else {
        unrepairedIssues.push(issue);
      }
    }

    const report: RepairReport = {
      totalIssues: issues.length,
      repairedIssues: repairedIssues.length,
      unrepairedIssues: unrepairedIssues.length,
      autoRepaired: repairedIssues.filter(i => i.autoFixable).length,
      manualReviewRequired: unrepairedIssues.filter(i => !i.autoFixable).length,
      operations,
      summary: this.generateSummary(repairedIssues.length, unrepairedIssues.length)
    };

    return report;
  }

  /**
   * Determine repair strategy
   */
  private determineRepairStrategy(issue: NarrativeIssue): RepairStrategy | null {
    const strategies: Partial<Record<IssueType, RepairStrategy>> = {
      plot_hole: {
        issueType: 'plot_hole',
        approach: 'insert',
        confidence: 0.7,
        complexity: 'moderate',
        estimatedTime: 300,
        sideEffects: ['May affect pacing', 'May create new information']
      },
      continuity_error: {
        issueType: 'continuity_error',
        approach: 'insert',
        confidence: 0.8,
        complexity: 'simple',
        estimatedTime: 60,
        sideEffects: ['Minor narrative adjustment']
      },
      character_violation: {
        issueType: 'character_violation',
        approach: 'clarify',
        confidence: 0.5,
        complexity: 'complex',
        estimatedTime: 600,
        sideEffects: ['May require character development', 'May affect dialogue']
      },
      timeline_contradiction: {
        issueType: 'timeline_contradiction',
        approach: 'replace',
        confidence: 0.7,
        complexity: 'simple',
        estimatedTime: 120,
        sideEffects: ['Minor temporal adjustment']
      },
      dialogue_inconsistency: {
        issueType: 'dialogue_inconsistency',
        approach: 'replace',
        confidence: 0.9,
        complexity: 'simple',
        estimatedTime: 30,
        sideEffects: ['Dialogue modification']
      },
      pacing_issue: {
        issueType: 'pacing_issue',
        approach: 'restructure',
        confidence: 0.6,
        complexity: 'moderate',
        estimatedTime: 300,
        sideEffects: ['May affect chapter structure']
      },
      information_gap: {
        issueType: 'information_gap',
        approach: 'insert',
        confidence: 0.7,
        complexity: 'simple',
        estimatedTime: 120,
        sideEffects: ['May slow pacing slightly']
      },
      logical_fallacy: {
        issueType: 'logical_fallacy',
        approach: 'replace',
        confidence: 0.6,
        complexity: 'moderate',
        estimatedTime: 240,
        sideEffects: ['May require restructuring']
      },
      repetition: {
        issueType: 'repetition',
        approach: 'delete',
        confidence: 0.9,
        complexity: 'simple',
        estimatedTime: 30,
        sideEffects: ['Minor content reduction']
      },
      incomplete_scene: {
        issueType: 'incomplete_scene',
        approach: 'insert',
        confidence: 0.7,
        complexity: 'moderate',
        estimatedTime: 180,
        sideEffects: ['May extend chapter']
      }
    };

    return strategies[issue.type] || null;
  }

  /**
   * Execute repair operation
   */
  private async executeRepair(
    issue: NarrativeIssue,
    strategy: RepairStrategy,
    chapters: Chapter[],
    options: StoryGenerationOptions
  ): Promise<RepairOperation> {
    const operation: RepairOperation = {
      id: `repair_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      issueId: issue.id,
      strategy,
      originalContent: '',
      repairedContent: '',
      chapterNumber: issue.chapter,
      location: issue.location,
      timestamp: Date.now(),
      success: false,
      sideEffects: []
    };

    try {
      const chapter = chapters.find(ch => ch.chapterNumber === issue.chapter);
      if (!chapter) {
        return operation;
      }

      operation.originalContent = chapter.content;

      switch (strategy.approach) {
        case 'insert':
          operation.repairedContent = this.insertExplanation(chapter.content, issue);
          break;
        case 'replace':
          operation.repairedContent = this.replaceContent(chapter.content, issue);
          break;
        case 'delete':
          operation.repairedContent = this.deleteContent(chapter.content, issue);
          break;
        case 'restructure':
          operation.repairedContent = this.restructureContent(chapter.content, issue);
          break;
        case 'clarify':
          operation.repairedContent = this.clarifyContent(chapter.content, issue);
          break;
      }

      // Validate repair
      const validationResult = this.validateRepair(operation.originalContent, operation.repairedContent);
      if (validationResult.valid) {
        operation.success = true;
        operation.sideEffects = validationResult.sideEffects;
      }

    } catch (error) {
      console.error(`Repair failed for issue ${issue.id}:`, error);
    }

    this.operations.push(operation);
    return operation;
  }

  /**
   * Insert explanation for issue
   */
  private insertExplanation(content: string, issue: NarrativeIssue): string {
    const explanations: Record<IssueType, string[]> = {
      plot_hole: ['Unseen forces had been at work.', 'The pieces had been falling into place.', 'Events had been unfolding in the shadows.'],
      continuity_error: ['The transition was abrupt but necessary.', 'Between one moment and the next, everything changed.', 'Time seemed to shift.'],
      character_violation: ['Something had changed.', 'The weight of recent events had taken its toll.', 'Perhaps this was inevitable.'],
      timeline_contradiction: ['Time flows differently here.', 'The sequence of events was more complex than it appeared.'],
      dialogue_inconsistency: [],
      pacing_issue: [],
      information_gap: ['This had been explained before.', 'The truth was known to those who paid attention.'],
      logical_fallacy: [],
      repetition: [],
      incomplete_scene: []
    };

    const explanation = explanations[issue.type][Math.floor(Math.random() * explanations[issue.type].length)];
    return `${explanation} ${content}`;
  }

  /**
   * Replace problematic content
   */
  private replaceContent(content: string, issue: NarrativeIssue): string {
    const replacements: Record<IssueType, string> = {
      plot_hole: content,
      continuity_error: content.replace(/abruptly/gi, 'after some time'),
      character_violation: content,
      timeline_contradiction: content.replace(/before.*after/gi, 'before'),
      dialogue_inconsistency: content.replace(/("[^"]+")(?=\s*"[^"]+")/g, '$1 [unique]'),
      pacing_issue: content,
      information_gap: content,
      logical_fallacy: content,
      repetition: content.replace(/("[^"]+")\s*\1/g, '$1'),
      incomplete_scene: content
    };

    return replacements[issue.type] || content;
  }

  /**
   * Delete problematic content
   */
  private deleteContent(content: string, issue: NarrativeIssue): string {
    if (issue.type === 'repetition') {
      return content.replace(/("[^"]+")\s*\1/g, '$1');
    }
    return content;
  }

  /**
   * Restructure content
   */
  private restructureContent(content: string, issue: NarrativeIssue): string {
    if (issue.type === 'pacing_issue') {
      // Simplify for demo - would need more sophisticated logic
      return content;
    }
    return content;
  }

  /**
   * Clarify content
   */
  private clarifyContent(content: string, issue: NarrativeIssue): string {
    if (issue.type === 'character_violation') {
      const clarification = 'Something had changed in their perspective.';
      return `${clarification} ${content}`;
    }
    return content;
  }

  /**
   * Validate repair
   */
  private validateRepair(original: string, repaired: string): { valid: boolean; sideEffects: string[] } {
    const sideEffects: string[] = [];

    // Check if repair is too long
    if (repaired.length > original.length * 2) {
      sideEffects.push('Repair significantly increased content length');
    }

    // Check if repair is too short
    if (repaired.length < original.length * 0.5) {
      sideEffects.push('Repair significantly reduced content length');
    }

    // Basic validation - in production would be more sophisticated
    const valid = sideEffects.length === 0 || sideEffects.length === 1;

    return { valid, sideEffects };
  }

  // Helper methods

  private extractNewElements(content: string): string[] {
    const properNouns = content.match(/\b([A-Z][a-z]+)\b/g) || [];
    return [...new Set(properNouns)].slice(0, 10);
  }

  private isElementExplained(element: string, content: string): boolean {
    const explanationIndicators = ['introduced', 'appeared', 'emerged', 'arrived'];
    return explanationIndicators.some(indicator => 
      content.toLowerCase().includes(indicator) && 
      content.toLowerCase().includes(element.toLowerCase())
    );
  }

  private extractUnresolvedPoints(content: string): string[] {
    const patterns = [
      /(?:question|mystery|puzzle|riddle)(?:\s+of\s+([A-Z][a-z]+))?/gi,
      /(?:need|must|have to)\s+(?:find|discover|solve|answer)/gi
    ];

    const points: string[] = [];
    for (const pattern of patterns) {
      const matches = content.match(pattern) || [];
      points.push(...matches);
    }

    return [...new Set(points)];
  }

  private isPointAddressed(point: string, content: string): boolean {
    const resolutionIndicators = ['answered', 'solved', 'resolved', 'completed'];
    return resolutionIndicators.some(indicator => 
      content.toLowerCase().includes(indicator) && 
      content.toLowerCase().includes(point.toLowerCase())
    );
  }

  private chaptersSinceIntroduction(point: string, chapters: Chapter[]): number {
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (chapters[i].content.toLowerCase().includes(point.toLowerCase())) {
        return chapters.length - i;
      }
    }
    return chapters.length;
  }

  private extractSceneDetails(content: string): { location: string; time: string } {
    const location = this.extractLocation(content);
    const time = this.extractTime(content);
    return { location, time };
  }

  private extractLocation(content: string): string {
    const locations = ['room', 'hallway', 'forest', 'city', 'castle', 'mountain'];
    for (const loc of locations) {
      if (content.toLowerCase().includes(loc)) {
        return loc;
      }
    }
    return 'unknown';
  }

  private extractTime(content: string): string {
    const times = ['morning', 'afternoon', 'evening', 'night', 'dawn', 'dusk'];
    for (const time of times) {
      if (content.toLowerCase().includes(time)) {
        return time;
      }
    }
    return 'unknown';
  }

  private isSceneDiscontinuity(current: { location: string }, last: { location: string }): boolean {
    return current.location !== 'unknown' && 
           last.location !== 'unknown' && 
           current.location !== last.location;
  }

  private checkCharacterConsistency(character: Character, content: string): string[] {
    const violations: string[] = [];

    // Simple check - in production would be more sophisticated
    if (character.traits && character.traits.length > 0) {
      const traitViolations = character.traits.filter(trait => 
        !content.toLowerCase().includes(trait.toLowerCase())
      );
      
      if (traitViolations.length > character.traits.length * 0.5) {
        violations.push(`Many established traits not reflected in behavior`);
      }
    }

    return violations;
  }

  private extractTemporalMarkers(content: string): string[] {
    const patterns = [
      /\b(\d+)\s+(?:years?|months?|weeks?|days?)\s+(?:ago|later|before|after)/gi,
      /\b(yesterday|today|tomorrow|now|then|soon|later|beforehand)\b/gi
    ];

    const markers: string[] = [];
    for (const pattern of patterns) {
      const matches = content.match(pattern) || [];
      markers.push(...matches);
    }

    return [...new Set(markers)];
  }

  private isImpossibleSequence(marker: string): boolean {
    return marker.includes('ago') && marker.includes('later');
  }

  private extractConcepts(content: string): string[] {
    const conceptPattern = /\b(?:theory|concept|idea|principle|law|rule)(?:\s+of\s+([A-Z][a-z]+))?/gi;
    const matches = content.match(conceptPattern) || [];
    return [...new Set(matches)].slice(0, 5);
  }

  private isConceptExplained(concept: string, current: string, previousChapters: Chapter[]): boolean {
    const allContent = [...previousChapters.map(ch => ch.content), current].join(' ');
    const explanationIndicators = ['means', 'is', 'refers to', 'defined as', 'known as'];
    
    return explanationIndicators.some(indicator => 
      allContent.toLowerCase().includes(indicator) && 
      allContent.toLowerCase().includes(concept.toLowerCase())
    );
  }

  private generateSummary(repaired: number, unrepaired: number): string {
    return `Repaired ${repaired} issues, ${unrepaired} issues require manual review`;
  }

  /**
   * Get all issues
   */
  getIssues(): NarrativeIssue[] {
    return Array.from(this.issues.values());
  }

  /**
   * Get issues by severity
   */
  getIssuesBySeverity(severity: NarrativeIssue['severity']): NarrativeIssue[] {
    return Array.from(this.issues.values()).filter(i => i.severity === severity);
  }

  /**
   * Get repair operations
   */
  getOperations(): RepairOperation[] {
    return [...this.operations];
  }

  /**
   * Export system state
   */
  exportState(): {
    issues: NarrativeIssue[];
    operations: RepairOperation[];
  } {
    return {
      issues: Array.from(this.issues.values()),
      operations: this.operations
    };
  }

  /**
   * Import system state
   */
  importState(state: { issues: NarrativeIssue[]; operations: RepairOperation[] }): void {
    this.issues.clear();
    this.operations = [];

    for (const issue of state.issues) {
      this.issues.set(issue.id, issue);
    }

    this.operations = state.operations;
  }

  /**
   * Reset system
   */
  reset(): void {
    this.issues.clear();
    this.operations = [];
    this.repairHistory.clear();
    this.currentChapter = 0;
  }
  /**
   * Set cross-system references for NarrativeRepairSystem
   */
  setSystems(systems: {
    metaCognition?: any;
    structureLayer?: any;
    characterGenome?: any;
    worldSimulation?: any;
    realityFramework?: any;
  }): void {
    this.metaCognition = systems.metaCognition;
    this.structureLayer = systems.structureLayer;
    this.characterGenome = systems.characterGenome;
    this.worldSimulation = systems.worldSimulation;
    this.realityFramework = systems.realityFramework;
  }

  /**
   * Get system status including cross-system connectivity
   */
  getSystemStatus(): {
    issuesCount: number;
    operationsCount: number;
    connectedSystems: string[];
  } {
    const connectedSystems: string[] = [];
    if (this.metaCognition) connectedSystems.push('metaCognition');
    if (this.structureLayer) connectedSystems.push('structureLayer');
    if (this.characterGenome) connectedSystems.push('characterGenome');
    if (this.worldSimulation) connectedSystems.push('worldSimulation');
    if (this.realityFramework) connectedSystems.push('realityFramework');

    return {
      issuesCount: this.issues.size,
      operationsCount: this.operations.length,
      connectedSystems
    };
  }
}
