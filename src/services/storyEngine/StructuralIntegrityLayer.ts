/**
 * StructuralIntegrityLayer - Plot Consistency & Structural Analysis
 * 
 * Analyzes narrative structure, identifies plot holes, ensures
 * narrative coherence, and maintains story integrity.
 * 
 * Enhanced with real-time web search for story structure frameworks,
 * narrative flow analysis, and pacing techniques.
 */

import { webSearchIntegration } from './WebSearchIntegration';
import type { WebSearchResult, TechnicalSearchResult } from './WebSearchIntegration';

// ============================================================================
// INTERFACES
// ============================================================================

export interface NarrativeStructure {
  acts: NarrativeAct[];
  turningPoints: TurningPoint[];
  climaxes: ClimaxPoint[];
  resolutions: ResolutionPoint[];
  overallIntegrity: number; // 0-1
}

export interface NarrativeAct {
  number: number;
  type: 'setup' | 'confrontation' | 'resolution';
  startChapter: number;
  endChapter: number;
  purpose: string;
  keyEvents: string[];
  completeness: number; // 0-1
  issues: StructuralIssue[];
}

export interface TurningPoint {
  chapter: number;
  type: 'inciting_incident' | 'first_threshold' | 'midpoint' | 'dark_night' | 'climax';
  description: string;
  emotionalImpact: number;
  executed: boolean;
  setupComplete: boolean;
}

export interface ClimaxPoint {
  chapter: number;
  type: 'emotional' | 'action' | 'revelation' | 'transformation';
  intensity: number;
  involvedCharacters: string[];
  resolutionNeeded: string[];
  executed: boolean;
}

export interface ResolutionPoint {
  chapter: number;
  type: 'plot' | 'character' | 'theme' | 'world';
  description: string;
  satisfaction: number; // 0-1
  executed: boolean;
}

export interface StructuralIssue {
  id: string;
  type: 'plot_hole' | 'unresolved_thread' | 'pacing' | 'setup_missing' | 'payoff_missing' | 'contradiction' | 'weak_climax';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  location: string;
  suggestedFix: string;
  impact: string[];
}

export interface PlotThread {
  id: string;
  name: string;
  type: 'main' | 'subplot' | 'character' | 'mystery' | 'romance';
  introduced: number;
  lastMentioned: number;
  status: 'active' | 'dormant' | 'resolved' | 'abandoned';
  importance: number; // 0-1
  connections: string[];
  resolutionRequirements: string[];
  milestones: ThreadMilestone[];
}

export interface ThreadMilestone {
  chapter: number;
  type: 'introduction' | 'development' | 'climax' | 'resolution';
  description: string;
  executed: boolean;
}

export interface ConsistencyCheck {
  chapter: number;
  type: 'timeline' | 'character' | 'world' | 'plot' | 'logic';
  passed: boolean;
  issues: ConsistencyIssue[];
  recommendations: string[];
}

export interface ConsistencyIssue {
  type: 'contradiction' | 'gap' | 'error' | 'inconsistency';
  description: string;
  elements: string[];
  severity: 'minor' | 'moderate' | 'major';
  suggestedFix: string;
}

export interface PacingAnalysis {
  chapter: number;
  overallPace: number; // 0-1
  tensionCurve: number[];
  breathingPoints: number[];
  recommendedAdjustments: string[];
}

// ============================================================================
// STRUCTURAL INTEGRITY LAYER
// ============================================================================

export class StructuralIntegrityLayer {
  private structure: NarrativeStructure;
  private plotThreads: Map<string, PlotThread> = new Map();
  private consistencyChecks: ConsistencyCheck[] = [];
  private pacingHistory: PacingAnalysis[] = [];
  
  // Web search integration
  private structureFrameworksCache: Map<string, TechnicalSearchResult[]> = new Map();
  private pacingTechniquesCache: Map<string, WebSearchResult[]> = new Map();
  private tensionTechniquesCache: Map<string, WebSearchResult[]> = new Map();

  // Thresholds
  private readonly INTEGRITY_THRESHOLD = 0.7;
  private readonly THREAD_ABANDONMENT_THRESHOLD = 10; // chapters
  private readonly PACING_VARIANCE_THRESHOLD = 0.3;

  constructor() {
    this.structure = this.initializeNarrativeStructure();
    this.initializePlotThreads();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initializeNarrativeStructure(): NarrativeStructure {
    return {
      acts: [
        {
          number: 1,
          type: 'setup',
          startChapter: 1,
          endChapter: 20,
          purpose: 'Establish world, characters, and central conflict',
          keyEvents: ['Kael awakens', 'Yuna\'s illness revealed', 'First power manifestation'],
          completeness: 0.3,
          issues: []
        },
        {
          number: 2,
          type: 'confrontation',
          startChapter: 21,
          endChapter: 60,
          purpose: 'Develop conflict, raise stakes, character growth',
          keyEvents: ['Major revelation', 'Alliance formed', 'First major defeat'],
          completeness: 0,
          issues: []
        },
        {
          number: 3,
          type: 'resolution',
          startChapter: 61,
          endChapter: 100,
          purpose: 'Resolve conflicts, character arcs, thematic conclusion',
          keyEvents: ['Final confrontation', 'Truth revealed', 'New beginning'],
          completeness: 0,
          issues: []
        }
      ],
      turningPoints: [
        { chapter: 1, type: 'inciting_incident', description: 'Kael awakens in new reality', emotionalImpact: 0.9, executed: true, setupComplete: true },
        { chapter: 5, type: 'first_threshold', description: 'Yuna\'s illness forces commitment', emotionalImpact: 0.85, executed: true, setupComplete: true },
        { chapter: 30, type: 'midpoint', description: 'Major truth changes everything', emotionalImpact: 0.95, executed: false, setupComplete: false },
        { chapter: 50, type: 'dark_night', description: 'Lowest point, all seems lost', emotionalImpact: 0.9, executed: false, setupComplete: false },
        { chapter: 80, type: 'climax', description: 'Final confrontation', emotionalImpact: 1.0, executed: false, setupComplete: false }
      ],
      climaxes: [
        { chapter: 15, type: 'action', intensity: 0.7, involvedCharacters: ['Kael', 'Eclipsis'], resolutionNeeded: ['Escape'], executed: false },
        { chapter: 45, type: 'revelation', intensity: 0.9, involvedCharacters: ['Kael', 'Yuna'], resolutionNeeded: ['Acceptance'], executed: false },
        { chapter: 80, type: 'transformation', intensity: 1.0, involvedCharacters: ['Kael', 'Yuna', 'Antagonist'], resolutionNeeded: ['Final resolution'], executed: false }
      ],
      resolutions: [],
      overallIntegrity: 0.85
    };
  }

  private initializePlotThreads(): void {
    // Main plot
    this.plotThreads.set('main_survival', {
      id: 'main_survival',
      name: 'Survival & Power Discovery',
      type: 'main',
      introduced: 1,
      lastMentioned: 1,
      status: 'active',
      importance: 1.0,
      connections: ['yuna_illness', 'progenitor_mystery'],
      resolutionRequirements: ['Power mastery', 'Threat elimination', 'Truth discovery'],
      milestones: [
        { chapter: 1, type: 'introduction', description: 'Kael awakens', executed: true },
        { chapter: 10, type: 'development', description: 'First power growth', executed: false },
        { chapter: 50, type: 'climax', description: 'Major power awakening', executed: false },
        { chapter: 80, type: 'resolution', description: 'Power mastered', executed: false }
      ]
    });

    // Yuna's illness
    this.plotThreads.set('yuna_illness', {
      id: 'yuna_illness',
      name: 'Yuna\'s Mysterious Illness',
      type: 'subplot',
      introduced: 2,
      lastMentioned: 5,
      status: 'active',
      importance: 0.9,
      connections: ['main_survival', 'progenitor_mystery'],
      resolutionRequirements: ['Discover cause', 'Find cure', 'Possible sacrifice'],
      milestones: [
        { chapter: 5, type: 'introduction', description: 'Illness revealed', executed: true },
        { chapter: 15, type: 'development', description: 'Condition worsens', executed: false },
        { chapter: 35, type: 'climax', description: 'Critical condition', executed: false },
        { chapter: 40, type: 'resolution', description: 'Cure found', executed: false }
      ]
    });

    // Progenitor mystery
    this.plotThreads.set('progenitor_mystery', {
      id: 'progenitor_mystery',
      name: 'The Progenitor Mystery',
      type: 'mystery',
      introduced: 1,
      lastMentioned: 3,
      status: 'active',
      importance: 0.85,
      connections: ['main_survival', 'yuna_illness'],
      resolutionRequirements: ['Discover truth', 'Understand heritage', 'Make choice'],
      milestones: [
        { chapter: 1, type: 'introduction', description: 'First hints', executed: true },
        { chapter: 20, type: 'development', description: 'Major clue', executed: false },
        { chapter: 50, type: 'climax', description: 'Truth revealed', executed: false },
        { chapter: 60, type: 'resolution', description: 'Heritage accepted', executed: false }
      ]
    });

    // Kael's identity
    this.plotThreads.set('kael_identity', {
      id: 'kael_identity',
      name: 'Kael\'s Identity Journey',
      type: 'character',
      introduced: 1,
      lastMentioned: 4,
      status: 'active',
      importance: 0.8,
      connections: ['main_survival', 'progenitor_mystery'],
      resolutionRequirements: ['Self-discovery', 'Acceptance', 'New purpose'],
      milestones: [
        { chapter: 3, type: 'introduction', description: 'Questions arise', executed: true },
        { chapter: 25, type: 'development', description: 'Identity crisis', executed: false },
        { chapter: 45, type: 'climax', description: 'Truth accepted', executed: false },
        { chapter: 55, type: 'resolution', description: 'New identity embraced', executed: false }
      ]
    });
  }

  // ============================================================================
  // WEB SEARCH INTEGRATION
  // ============================================================================

  /**
   * Search for story structure frameworks
   */
  async searchStructureFrameworks(
    structureType: string,
    genre: string
  ): Promise<TechnicalSearchResult[]> {
    const key = `${structureType}-${genre}`;
    if (this.structureFrameworksCache.has(key)) {
      return this.structureFrameworksCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchStoryStructure(
      structureType,
      genre
    );
    this.structureFrameworksCache.set(key, results as TechnicalSearchResult[]);
    return results as TechnicalSearchResult[];
  }

  /**
   * Research narrative flow analysis
   */
  async searchNarrativeFlow(
    flowType: string,
    genre: string
  ): Promise<WebSearchResult[]> {
    const key = `${flowType}-${genre}`;
    if (this.pacingTechniquesCache.has(key)) {
      return this.pacingTechniquesCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${flowType} narrative flow ${genre} writing`
    );
    this.pacingTechniquesCache.set(key, results);
    return results;
  }

  /**
   * Look up pacing and tension techniques
   */
  async searchPacingTechniques(
    intensity: string,
    genre: string
  ): Promise<WebSearchResult[]> {
    const key = `${intensity}-${genre}`;
    if (this.tensionTechniquesCache.has(key)) {
      return this.tensionTechniquesCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${intensity} pacing tension ${genre} fiction`
    );
    this.tensionTechniquesCache.set(key, results);
    return results;
  }

  /**
   * Clear web search cache
   */
  clearWebSearchCache(): void {
    this.structureFrameworksCache.clear();
    this.pacingTechniquesCache.clear();
    this.tensionTechniquesCache.clear();
  }

  // ============================================================================
  // STRUCTURAL ANALYSIS
  // ============================================================================

  /**
   * Analyze narrative structure for issues
   */
  analyzeStructure(): NarrativeStructure {
    // Check each act
    this.structure.acts.forEach(act => {
      act.issues = this.analyzeAct(act);
    });

    // Check turning points
    this.checkTurningPoints();

    // Check plot threads
    this.checkPlotThreads();

    // Calculate overall integrity
    this.structure.overallIntegrity = this.calculateOverallIntegrity();

    return this.structure;
  }

  private analyzeAct(act: NarrativeAct): StructuralIssue[] {
    const issues: StructuralIssue[] = [];

    // Check if act has proper setup
    if (act.keyEvents.length < 3) {
      issues.push({
        id: `act_${act.number}_sparse`,
        type: 'weak_climax',
        severity: 'minor',
        description: `Act ${act.number} has few key events`,
        location: `Chapters ${act.startChapter}-${act.endChapter}`,
        suggestedFix: 'Consider adding more significant events',
        impact: ['Pacing may feel slow']
      });
    }

    // Check completeness vs progress
    const expectedProgress = this.calculateExpectedProgress(act);
    if (act.completeness < expectedProgress - 0.2) {
      issues.push({
        id: `act_${act.number}_incomplete`,
        type: 'pacing',
        severity: 'moderate',
        description: `Act ${act.number} is behind expected progress`,
        location: `Chapters ${act.startChapter}-${act.endChapter}`,
        suggestedFix: 'Accelerate plot development or extend act duration',
        impact: ['May feel rushed later']
      });
    }

    return issues;
  }

  private calculateExpectedProgress(act: NarrativeAct): number {
    // Simplified calculation - in production would use current chapter
    return 0.3;
  }

  private checkTurningPoints(): void {
    this.structure.turningPoints.forEach(point => {
      if (!point.executed && !point.setupComplete) {
        // Check if setup should be started
        const setupNeeded = this.identifySetupNeeds(point);
        if (setupNeeded.length > 0) {
          this.addStructuralIssue({
            id: `tp_setup_${point.chapter}`,
            type: 'setup_missing',
            severity: 'moderate',
            description: `Turning point at chapter ${point.chapter} needs setup: ${setupNeeded.join(', ')}`,
            location: `Chapter ${point.chapter}`,
            suggestedFix: 'Begin planting setup elements',
            impact: ['Turning point may feel unearned']
          });
        }
      }
    });
  }

  private identifySetupNeeds(point: TurningPoint): string[] {
    const needs: string[] = [];
    
    switch (point.type) {
      case 'midpoint':
        needs.push('Rising tension', 'Character conflict development');
        break;
      case 'dark_night':
        needs.push('Stakes escalation', 'Character hope established');
        break;
      case 'climax':
        needs.push('All threads converging', 'Antagonist established');
        break;
    }

    return needs;
  }

  private addStructuralIssue(issue: StructuralIssue): void {
    // Find appropriate act to add issue
    const act = this.structure.acts.find(a => 
      issue.location.includes(`Chapter ${a.startChapter}`) || 
      a.issues.length < 3
    );
    
    if (act && !act.issues.some(i => i.id === issue.id)) {
      act.issues.push(issue);
    }
  }

  private checkPlotThreads(): void {
    const currentChapter = 5; // Simplified - would use actual current chapter

    this.plotThreads.forEach(thread => {
      const chaptersSinceMention = currentChapter - thread.lastMentioned;
      
      // Check for abandoned threads
      if (thread.status === 'active' && chaptersSinceMention > this.THREAD_ABANDONMENT_THRESHOLD) {
        this.addStructuralIssue({
          id: `thread_abandoned_${thread.id}`,
          type: 'unresolved_thread',
          severity: thread.importance > 0.7 ? 'major' : 'moderate',
          description: `Plot thread "${thread.name}" not mentioned for ${chaptersSinceMention} chapters`,
          location: `Since chapter ${thread.lastMentioned}`,
          suggestedFix: 'Add reference or development to this thread',
          impact: ['Reader may forget this thread', 'Pacing inconsistency']
        });
      }

      // Check for unexecuted milestones
      const missedMilestones = thread.milestones.filter(m => 
        m.chapter <= currentChapter && !m.executed
      );

      missedMilestones.forEach(milestone => {
        this.addStructuralIssue({
          id: `milestone_missed_${thread.id}_${milestone.chapter}`,
          type: 'pacing',
          severity: 'minor',
          description: `Missed milestone: "${milestone.description}" for thread "${thread.name}"`,
          location: `Chapter ${milestone.chapter}`,
          suggestedFix: 'Reschedule or execute milestone',
          impact: ['Thread pacing affected']
        });
      });
    });
  }

  private calculateOverallIntegrity(): number {
    let integrity = 1.0;

    // Deduct for issues
    this.structure.acts.forEach(act => {
      act.issues.forEach(issue => {
        const deduction = {
          critical: 0.15,
          major: 0.1,
          moderate: 0.05,
          minor: 0.02
        };
        integrity -= deduction[issue.severity];
      });
    });

    // Deduct for unresolved threads
    const activeThreads = Array.from(this.plotThreads.values()).filter(t => t.status === 'active');
    const unresolvedCount = activeThreads.filter(t => t.milestones.some(m => m.type === 'resolution' && !m.executed)).length;
    integrity -= unresolvedCount * 0.02;

    return Math.max(0, Math.min(1, integrity));
  }

  // ============================================================================
  // PLOT HOLE DETECTION
  // ============================================================================

  /**
   * Detect plot holes in narrative
   */
  detectPlotHoles(chapter: number, content: string): StructuralIssue[] {
    const issues: StructuralIssue[] = [];

    // Check for common plot hole patterns
    const contradictions = this.findContradictions(content);
    const gaps = this.findLogicGaps(content);
    const inconsistencies = this.findInconsistencies(content);

    issues.push(...contradictions.map(c => ({
      id: `plot_hole_${chapter}_${Date.now()}`,
      type: 'contradiction' as const,
      severity: 'major' as const,
      description: c.description,
      location: `Chapter ${chapter}`,
      suggestedFix: c.fix,
      impact: ['Narrative consistency affected']
    })));

    issues.push(...gaps.map(g => ({
      id: `plot_gap_${chapter}_${Date.now()}`,
      type: 'plot_hole' as const,
      severity: 'moderate' as const,
      description: g.description,
      location: `Chapter ${chapter}`,
      suggestedFix: g.fix,
      impact: ['Reader confusion possible']
    })));

    return issues;
  }

  private findContradictions(content: string): { description: string; fix: string }[] {
    const contradictions: { description: string; fix: string }[] = [];
    
    // Check for common contradiction patterns
    // In production, this would use more sophisticated analysis
    
    return contradictions;
  }

  private findLogicGaps(content: string): { description: string; fix: string }[] {
    const gaps: { description: string; fix: string }[] = [];
    
    // Check for common logic gap patterns
    // Characters acting without motivation
    // Events happening without cause
    // Information appearing without source

    return gaps;
  }

  private findInconsistencies(content: string): { description: string; fix: string }[] {
    const inconsistencies: { description: string; fix: string }[] = [];
    
    // Check for inconsistency patterns
    // Changed character names
    // Altered world rules
    // Timeline issues

    return inconsistencies;
  }

  // ============================================================================
  // CONSISTENCY CHECKING
  // ============================================================================

  /**
   * Run consistency check for a chapter
   */
  runConsistencyCheck(chapter: number, elements: {
    characters: string[];
    locations: string[];
    events: string[];
  }): ConsistencyCheck {
    const issues: ConsistencyIssue[] = [];

    // Check timeline consistency
    issues.push(...this.checkTimelineConsistency(chapter, elements));

    // Check character consistency
    issues.push(...this.checkCharacterConsistency(chapter, elements));

    // Check world consistency
    issues.push(...this.checkWorldConsistency(chapter, elements));

    // Check plot consistency
    issues.push(...this.checkPlotConsistency(chapter, elements));

    const passed = issues.filter(i => i.severity === 'major').length === 0;
    const recommendations = this.generateConsistencyRecommendations(issues);

    const check: ConsistencyCheck = {
      chapter,
      type: 'logic',
      passed,
      issues,
      recommendations
    };

    this.consistencyChecks.push(check);
    return check;
  }

  private checkTimelineConsistency(chapter: number, elements: { characters: string[]; locations: string[]; events: string[]; }): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    
    // Check for timeline issues
    // In production, would cross-reference with timeline data

    return issues;
  }

  private checkCharacterConsistency(chapter: number, elements: { characters: string[]; locations: string[]; events: string[]; }): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    
    // Check character presence consistency
    // Check character knowledge consistency
    // Check character ability consistency

    return issues;
  }

  private checkWorldConsistency(chapter: number, elements: { characters: string[]; locations: string[]; events: string[]; }): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    
    // Check world rules consistency
    // Check location consistency
    // Check system rules consistency

    return issues;
  }

  private checkPlotConsistency(chapter: number, elements: { characters: string[]; locations: string[]; events: string[]; }): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    
    // Check plot thread consistency
    // Check event causality
    // Check information flow

    return issues;
  }

  private generateConsistencyRecommendations(issues: ConsistencyIssue[]): string[] {
    return issues.map(i => i.suggestedFix).filter(Boolean);
  }

  // ============================================================================
  // PACING ANALYSIS
  // ============================================================================

  /**
   * Analyze pacing for a chapter
   */
  analyzePacing(chapter: number, content: string): PacingAnalysis {
    const tensionCurve = this.calculateTensionCurve(content);
    const overallPace = this.calculateOverallPace(tensionCurve);
    const breathingPoints = this.identifyBreathingPoints(content);
    const recommendedAdjustments = this.generatePacingRecommendations(overallPace, tensionCurve);

    const analysis: PacingAnalysis = {
      chapter,
      overallPace,
      tensionCurve,
      breathingPoints,
      recommendedAdjustments
    };

    this.pacingHistory.push(analysis);
    return analysis;
  }

  private calculateTensionCurve(content: string): number[] {
    // Simplified tension calculation
    // In production, would use NLP and semantic analysis
    const paragraphs = content.split('\n\n');
    return paragraphs.map((_, i) => 0.5 + Math.sin(i * 0.5) * 0.3);
  }

  private calculateOverallPace(tensionCurve: number[]): number {
    if (tensionCurve.length === 0) return 0.5;
    return tensionCurve.reduce((sum, t) => sum + t, 0) / tensionCurve.length;
  }

  private identifyBreathingPoints(content: string): number[] {
    // Find moments of lower tension
    // Dialogue-heavy sections, reflection moments
    const breathingPoints: number[] = [];
    
    const paragraphs = content.split('\n\n');
    paragraphs.forEach((p, i) => {
      if (p.includes('"') && p.length < 200) {
        breathingPoints.push(i);
      }
    });

    return breathingPoints;
  }

  private generatePacingRecommendations(overallPace: number, tensionCurve: number[]): string[] {
    const recommendations: string[] = [];

    if (overallPace > 0.8) {
      recommendations.push('Pace is very fast - consider adding breathing room');
    }
    if (overallPace < 0.4) {
      recommendations.push('Pace is slow - consider adding tension or action');
    }

    const variance = this.calculateVariance(tensionCurve);
    if (variance < this.PACING_VARIANCE_THRESHOLD) {
      recommendations.push('Tension curve is flat - add more variation');
    }

    return recommendations;
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Get narrative structure
   */
  getNarrativeStructure(): NarrativeStructure {
    return { ...this.structure };
  }

  /**
   * Get plot threads
   */
  getPlotThreads(): PlotThread[] {
    return Array.from(this.plotThreads.values());
  }

  /**
   * Update thread status
   */
  updateThreadStatus(threadId: string, status: PlotThread['status'], chapter: number): void {
    const thread = this.plotThreads.get(threadId);
    if (thread) {
      thread.status = status;
      thread.lastMentioned = chapter;
    }
  }

  /**
   * Execute thread milestone
   */
  executeMilestone(threadId: string, milestoneChapter: number): void {
    const thread = this.plotThreads.get(threadId);
    if (thread) {
      const milestone = thread.milestones.find(m => m.chapter === milestoneChapter);
      if (milestone) {
        milestone.executed = true;
      }
    }
  }

  /**
   * Get consistency checks
   */
  getConsistencyChecks(): ConsistencyCheck[] {
    return [...this.consistencyChecks];
  }

  /**
   * Get pacing history
   */
  getPacingHistory(): PacingAnalysis[] {
    return [...this.pacingHistory];
  }

  /**
   * Generate integrity report
   */
  generateIntegrityReport(): {
    overallIntegrity: number;
    activeIssues: StructuralIssue[];
    unresolvedThreads: PlotThread[];
    recommendations: string[];
  } {
    const issues = this.structure.acts.flatMap(a => a.issues);
    const unresolvedThreads = Array.from(this.plotThreads.values())
      .filter(t => t.status === 'active');

    const recommendations: string[] = [];
    
    if (this.structure.overallIntegrity < this.INTEGRITY_THRESHOLD) {
      recommendations.push('Overall integrity below threshold - review structural issues');
    }

    issues.filter(i => i.severity === 'major' || i.severity === 'critical')
      .forEach(i => recommendations.push(i.suggestedFix));

    return {
      overallIntegrity: this.structure.overallIntegrity,
      activeIssues: issues,
      unresolvedThreads,
      recommendations: [...new Set(recommendations)]
    };
  }
}

export default StructuralIntegrityLayer;