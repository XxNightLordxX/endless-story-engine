/**
 * MultiThreadNarrativeScheduler - Parallel Thread Management System
 * 
 * Manages multiple narrative threads running in parallel, handles thread
 * priority, weaving patterns, and ensures balanced coverage of all storylines.
 * 
 * Enhanced with real-time web search for multi-thread storytelling examples,
 * narrative weaving techniques, and subplot integration strategies.
 */

import { webSearchIntegration } from './WebSearchIntegration';
import type { WebSearchResult, NarrativeSearchResult } from './WebSearchIntegration';

// ============================================================================
// INTERFACES
// ============================================================================

export interface NarrativeThread {
  id: string;
  name: string;
  type: 'main' | 'character' | 'subplot' | 'world' | 'mystery' | 'romance';
  priority: number; // 1-10
  status: 'active' | 'paused' | 'completed' | 'dormant' | 'critical';
  currentChapter: number;
  lastFeatured: number; // Chapter last featured
  nextFeature: number; // Planned next feature chapter
  urgency: number; // 0-1
  readerInvestment: number; // 0-1
  characters: string[];
  keyEvents: ThreadEvent[];
  dependencies: string[]; // Thread IDs this depends on
  blocks: string[]; // Thread IDs blocked by this thread
}

export interface ThreadEvent {
  chapter: number;
  type: 'introduction' | 'development' | 'climax' | 'resolution' | 'twist' | 'callback';
  description: string;
  importance: number; // 0-1
  executed: boolean;
}

export interface ThreadWeave {
  chapter: number;
  threads: string[];
  weavePattern: 'sequential' | 'intercut' | 'parallel' | 'convergent';
  dominantThread: string;
  supportingThreads: string[];
  tensionBalance: number; // 0-1
  estimatedLength: number; // in words
}

export interface SchedulingDecision {
  chapter: number;
  selectedThreads: string[];
  reasoning: string;
  priorityScore: number;
  readerExpectation: string;
  riskFactors: string[];
}

export interface ThreadBalance {
  chapter: number;
  threadCoverage: Map<string, number>; // Thread ID -> coverage %
  mainThreadFocus: number;
  subplotCoverage: number;
  characterDevelopment: number;
  imbalanceWarnings: string[];
}

export interface WeaveTemplate {
  name: string;
  description: string;
  threadCount: number;
  structure: WeaveSegment[];
  optimalFor: string[];
}

export interface WeaveSegment {
  position: number; // 0-1 representing position in chapter
  threadId: string;
  type: 'focus' | 'transition' | 'parallel' | 'reaction' | 'convergence';
  duration: number; // 0-1 representing portion of chapter
}

// ============================================================================
// MULTI-THREAD NARRATIVE SCHEDULER
// ============================================================================

export class MultiThreadNarrativeScheduler {
  private threads: Map<string, NarrativeThread> = new Map();
  private weaveHistory: ThreadWeave[] = [];
  private schedulingQueue: SchedulingDecision[] = [];
  private balanceHistory: ThreadBalance[] = [];
  
  // Web search integration
  private multiThreadExamplesCache: Map<string, NarrativeSearchResult[]> = new Map();
  private weavingTechniquesCache: Map<string, WebSearchResult[]> = new Map();
  private subplotIntegrationCache: Map<string, NarrativeSearchResult[]> = new Map();
  
  // Scheduling parameters
  private readonly MAX_THREADS_PER_CHAPTER = 3;
  private readonly MIN_GAP_BETWEEN_FEATURES = 2;
  private readonly URGENCY_THRESHOLD = 0.7;
  private readonly READER_INVESTMENT_DECAY = 0.05;
  
  // Balance targets
  private readonly MAIN_THREAD_MIN = 0.4;
  private readonly SUBPLOT_MIN = 0.15;
  private readonly CHARACTER_DEV_MIN = 0.2;

  constructor() {
    this.initializeThreads();
    this.initializeWeaveTemplates();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initializeThreads(): void {
    // Main Story Thread
    this.registerThread({
      id: 'main_narrative',
      name: 'Main Story Arc',
      type: 'main',
      priority: 10,
      status: 'active',
      currentChapter: 1,
      lastFeatured: 1,
      nextFeature: 2,
      urgency: 0.8,
      readerInvestment: 0.9,
      characters: ['Kael', 'Yuna'],
      keyEvents: [
        { chapter: 1, type: 'introduction', description: 'Kael awakens in new reality', importance: 1.0, executed: true },
        { chapter: 5, type: 'development', description: 'Discovers sister\'s illness', importance: 0.9, executed: true },
        { chapter: 10, type: 'development', description: 'First power manifestation', importance: 0.85, executed: false },
        { chapter: 20, type: 'climax', description: 'Major revelation', importance: 1.0, executed: false }
      ],
      dependencies: [],
      blocks: ['romance_kael', 'alliance_building']
    });

    // Yuna's Illness Thread
    this.registerThread({
      id: 'yuna_illness',
      name: 'Yuna\'s Mysterious Illness',
      type: 'subplot',
      priority: 8,
      status: 'active',
      currentChapter: 2,
      lastFeatured: 5,
      nextFeature: 8,
      urgency: 0.85,
      readerInvestment: 0.75,
      characters: ['Yuna', 'Kael'],
      keyEvents: [
        { chapter: 5, type: 'introduction', description: 'Yuna\'s condition revealed', importance: 0.85, executed: true },
        { chapter: 10, type: 'development', description: 'Illness worsens', importance: 0.8, executed: false },
        { chapter: 15, type: 'climax', description: 'Critical condition', importance: 0.95, executed: false },
        { chapter: 20, type: 'resolution', description: 'Cure discovered', importance: 0.9, executed: false }
      ],
      dependencies: ['main_narrative'],
      blocks: []
    });

    // Progenitor Mystery Thread
    this.registerThread({
      id: 'progenitor_mystery',
      name: 'The Progenitor Mystery',
      type: 'mystery',
      priority: 7,
      status: 'active',
      currentChapter: 1,
      lastFeatured: 3,
      nextFeature: 7,
      urgency: 0.5,
      readerInvestment: 0.6,
      characters: ['Kael', 'Unknown Entity'],
      keyEvents: [
        { chapter: 1, type: 'introduction', description: 'First hints of Progenitors', importance: 0.7, executed: true },
        { chapter: 8, type: 'development', description: 'New clues discovered', importance: 0.75, executed: false },
        { chapter: 20, type: 'twist', description: 'Major revelation', importance: 0.95, executed: false },
        { chapter: 35, type: 'climax', description: 'Truth exposed', importance: 1.0, executed: false }
      ],
      dependencies: [],
      blocks: []
    });

    // Kael's Identity Thread
    this.registerThread({
      id: 'kael_identity',
      name: 'Kael\'s Identity Journey',
      type: 'character',
      priority: 8,
      status: 'active',
      currentChapter: 1,
      lastFeatured: 4,
      nextFeature: 6,
      urgency: 0.6,
      readerInvestment: 0.8,
      characters: ['Kael'],
      keyEvents: [
        { chapter: 3, type: 'introduction', description: 'Questions about his past', importance: 0.7, executed: true },
        { chapter: 12, type: 'development', description: 'Discovers hints of heritage', importance: 0.8, executed: false },
        { chapter: 25, type: 'climax', description: 'Identity revelation', importance: 0.95, executed: false },
        { chapter: 30, type: 'resolution', description: 'Accepts true self', importance: 0.85, executed: false }
      ],
      dependencies: ['main_narrative'],
      blocks: []
    });

    // Romance Thread (dormant)
    this.registerThread({
      id: 'romance_kael',
      name: 'Budding Romance',
      type: 'romance',
      priority: 5,
      status: 'dormant',
      currentChapter: 1,
      lastFeatured: 0,
      nextFeature: 10,
      urgency: 0.2,
      readerInvestment: 0.3,
      characters: ['Kael', 'Unknown'],
      keyEvents: [
        { chapter: 10, type: 'introduction', description: 'First meaningful connection', importance: 0.6, executed: false },
        { chapter: 18, type: 'development', description: 'Feelings develop', importance: 0.7, executed: false },
        { chapter: 30, type: 'climax', description: 'Relationship defined', importance: 0.8, executed: false }
      ],
      dependencies: ['main_narrative', 'kael_identity'],
      blocks: []
    });

    // World Building Thread
    this.registerThread({
      id: 'world_building',
      name: 'World Exploration',
      type: 'world',
      priority: 6,
      status: 'active',
      currentChapter: 1,
      lastFeatured: 2,
      nextFeature: 5,
      urgency: 0.4,
      readerInvestment: 0.5,
      characters: ['Various'],
      keyEvents: [
        { chapter: 2, type: 'introduction', description: 'System mechanics revealed', importance: 0.6, executed: true },
        { chapter: 6, type: 'development', description: 'New location discovered', importance: 0.65, executed: false },
        { chapter: 15, type: 'development', description: 'Faction politics explored', importance: 0.7, executed: false }
      ],
      dependencies: [],
      blocks: []
    });

    // Alliance Building Thread
    this.registerThread({
      id: 'alliance_building',
      name: 'Building Alliances',
      type: 'subplot',
      priority: 6,
      status: 'dormant',
      currentChapter: 1,
      lastFeatured: 0,
      nextFeature: 12,
      urgency: 0.3,
      readerInvestment: 0.35,
      characters: ['Kael', 'Various Allies'],
      keyEvents: [
        { chapter: 12, type: 'introduction', description: 'First ally recruited', importance: 0.65, executed: false },
        { chapter: 20, type: 'development', description: 'Alliance grows', importance: 0.7, executed: false },
        { chapter: 35, type: 'climax', description: 'Alliance tested', importance: 0.8, executed: false }
      ],
      dependencies: ['main_narrative'],
      blocks: []
    });
  }

  private weaveTemplates: Map<string, WeaveTemplate> = new Map();

  private initializeWeaveTemplates(): void {
    // Sequential Weave - One thread at a time
    this.weaveTemplates.set('sequential', {
      name: 'Sequential Focus',
      description: 'One dominant thread with minor references to others',
      threadCount: 1,
      structure: [
        { position: 0, threadId: 'primary', type: 'focus', duration: 0.9 },
        { position: 0.9, threadId: 'secondary', type: 'transition', duration: 0.1 }
      ],
      optimalFor: ['climax', 'resolution', 'introduction']
    });

    // Intercut Weave - Alternating between threads
    this.weaveTemplates.set('intercut', {
      name: 'Intercut Narrative',
      description: 'Rapidly alternating between two threads for tension',
      threadCount: 2,
      structure: [
        { position: 0, threadId: 'thread1', type: 'focus', duration: 0.25 },
        { position: 0.25, threadId: 'thread2', type: 'focus', duration: 0.25 },
        { position: 0.5, threadId: 'thread1', type: 'focus', duration: 0.25 },
        { position: 0.75, threadId: 'thread2', type: 'focus', duration: 0.25 }
      ],
      optimalFor: ['action', 'suspense', 'parallel_events']
    });

    // Parallel Weave - Multiple threads in same scene
    this.weaveTemplates.set('parallel', {
      name: 'Parallel Convergence',
      description: 'Multiple threads interacting in same space',
      threadCount: 3,
      structure: [
        { position: 0, threadId: 'main', type: 'focus', duration: 0.4 },
        { position: 0.2, threadId: 'secondary', type: 'parallel', duration: 0.4 },
        { position: 0.4, threadId: 'tertiary', type: 'parallel', duration: 0.4 },
        { position: 0.8, threadId: 'main', type: 'convergence', duration: 0.2 }
      ],
      optimalFor: ['large_scenes', 'ensemble', 'convergence']
    });

    // Convergent Weave - Threads coming together
    this.weaveTemplates.set('convergent', {
      name: 'Thread Convergence',
      description: 'Multiple threads meeting at a single point',
      threadCount: 3,
      structure: [
        { position: 0, threadId: 'thread1', type: 'focus', duration: 0.3 },
        { position: 0.15, threadId: 'thread2', type: 'focus', duration: 0.3 },
        { position: 0.3, threadId: 'thread3', type: 'focus', duration: 0.3 },
        { position: 0.6, threadId: 'all', type: 'convergence', duration: 0.4 }
      ],
      optimalFor: ['revelation', 'climax', 'turning_point']
    });
  }

  // ============================================================================
  // WEB SEARCH INTEGRATION
  // ============================================================================

  /**
   * Search for multi-thread storytelling examples
   */
  async searchMultiThreadExamples(
    threadCount: number,
    genre: string
  ): Promise<NarrativeSearchResult[]> {
    const key = `${threadCount}-${genre}`;
    if (this.multiThreadExamplesCache.has(key)) {
      return this.multiThreadExamplesCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchNarrativeTechniques(
      `multiple storylines ${threadCount} threads`,
      genre
    );
    this.multiThreadExamplesCache.set(key, results);
    return results;
  }

  /**
   * Research narrative weaving techniques
   */
  async searchWeavingTechniques(
    weavePattern: string
  ): Promise<WebSearchResult[]> {
    const key = weavePattern;
    if (this.weavingTechniquesCache.has(key)) {
      return this.weavingTechniquesCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${weavePattern} narrative weaving technique fiction`
    );
    this.weavingTechniquesCache.set(key, results);
    return results;
  }

  /**
   * Find examples of successful subplot integration
   */
  async searchSubplotIntegration(
    mainPlotType: string,
    subplotType: string
  ): Promise<NarrativeSearchResult[]> {
    const key = `${mainPlotType}-${subplotType}`;
    if (this.subplotIntegrationCache.has(key)) {
      return this.subplotIntegrationCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchNarrativeTechniques(
      `${subplotType} subplot ${mainPlotType}`,
      'fiction'
    );
    this.subplotIntegrationCache.set(key, results);
    return results;
  }

  /**
   * Look up thread pacing strategies
   */
  async searchThreadPacingStrategies(
    intensity: 'slow-build' | 'fast-paced' | 'alternating'
  ): Promise<WebSearchResult[]> {
    return await webSearchIntegration.searchStoryStructure(
      `${intensity} multiple storylines pacing`
    );
  }

  /**
   * Enhance weave generation with web research
   */
  async generateWeaveWithWebResearch(
    chapter: number,
    threadIds: string[],
    genre: string
  ): Promise<ThreadWeave> {
    // Get standard weave
    const weave = this.generateWeave(chapter, threadIds);
    
    // Enhance with web research
    const examples = await this.searchMultiThreadExamples(
      threadIds.length,
      genre
    );
    
    const techniques = await this.searchWeavingTechniques(weave.weavePattern);
    
    // Apply insights
    const insights = this.extractWeaveInsights(examples, techniques);
    weave.tensionBalance = this.optimizeTensionBalance(weave, insights);
    
    return weave;
  }

  /**
   * Extract insights from web search results
   */
  private extractWeaveInsights(
    examples: NarrativeSearchResult[],
    techniques: WebSearchResult[]
  ): { pacingTips: string[]; balanceTips: string[] } {
    const pacingTips: string[] = [];
    const balanceTips: string[] = [];
    
    for (const example of examples) {
      if (example.applicability > 0.6) {
        const sentences = example.snippet.split(/[.!?]/).filter(s => s.trim().length > 15);
        if (sentences.length > 0) {
          pacingTips.push(sentences[0].trim());
        }
      }
    }
    
    for (const technique of techniques) {
      if (technique.relevance > 0.7) {
        const sentences = technique.snippet.split(/[.!?]/).filter(s => s.trim().length > 15);
        if (sentences.length > 0) {
          balanceTips.push(sentences[0].trim());
        }
      }
    }
    
    return { pacingTips: pacingTips.slice(0, 3), balanceTips: balanceTips.slice(0, 3) };
  }

  /**
   * Optimize tension balance based on insights
   */
  private optimizeTensionBalance(
    weave: ThreadWeave,
    insights: { pacingTips: string[]; balanceTips: string[] }
  ): number {
    // Use insights to adjust tension balance
    let adjustment = 0;
    
    for (const tip of insights.balanceTips) {
      const lowerTip = tip.toLowerCase();
      if (lowerTip.includes('increase') || lowerTip.includes('build')) {
        adjustment += 0.05;
      } else if (lowerTip.includes('decrease') || lowerTip.includes('relax')) {
        adjustment -= 0.05;
      }
    }
    
    return Math.max(0.3, Math.min(0.9, weave.tensionBalance + adjustment));
  }

  /**
   * Clear web search cache
   */
  clearWebSearchCache(): void {
    this.multiThreadExamplesCache.clear();
    this.weavingTechniquesCache.clear();
    this.subplotIntegrationCache.clear();
  }

  // ============================================================================
  // THREAD MANAGEMENT
  // ============================================================================

  registerThread(thread: NarrativeThread): void {
    this.threads.set(thread.id, thread);
  }

  getThread(threadId: string): NarrativeThread | undefined {
    return this.threads.get(threadId);
  }

  getAllThreads(): NarrativeThread[] {
    return Array.from(this.threads.values());
  }

  getActiveThreads(): NarrativeThread[] {
    return Array.from(this.threads.values()).filter(t => t.status === 'active');
  }

  updateThreadStatus(threadId: string, status: NarrativeThread['status']): void {
    const thread = this.threads.get(threadId);
    if (thread) {
      thread.status = status;
      
      // Update blocked threads when a thread completes
      if (status === 'completed') {
        this.unblockDependentThreads(threadId);
      }
    }
  }

  private unblockDependentThreads(completedThreadId: string): void {
    this.threads.forEach(thread => {
      const blockIndex = thread.blocks.indexOf(completedThreadId);
      if (blockIndex !== -1) {
        thread.blocks.splice(blockIndex, 1);
        if (thread.status === 'dormant' && thread.blocks.length === 0) {
          thread.status = 'active';
        }
      }
    });
  }

  updateThreadProgress(threadId: string, chapter: number): void {
    const thread = this.threads.get(threadId);
    if (thread) {
      thread.currentChapter = chapter;
      thread.lastFeatured = chapter;
      
      // Mark events as executed
      thread.keyEvents.forEach(event => {
        if (event.chapter <= chapter && !event.executed) {
          event.executed = true;
        }
      });

      // Update urgency based on upcoming events
      const upcomingEvents = thread.keyEvents.filter(e => e.chapter > chapter && e.chapter <= chapter + 5);
      if (upcomingEvents.length > 0) {
        thread.urgency = Math.min(1, thread.urgency + 0.1);
      }

      // Decay reader investment if not featured recently
      const chaptersSinceLastFeature = chapter - thread.lastFeatured;
      if (chaptersSinceLastFeature > 3) {
        thread.readerInvestment = Math.max(0.2, thread.readerInvestment - this.READER_INVESTMENT_DECAY);
      }
    }
  }

  // ============================================================================
  // SCHEDULING ENGINE
  // ============================================================================

  /**
   * Schedule threads for an upcoming chapter
   */
  scheduleChapter(chapter: number): SchedulingDecision {
    const availableThreads = this.getAvailableThreads(chapter);
    const selectedThreads = this.selectThreadsForChapter(availableThreads, chapter);
    const reasoning = this.generateSchedulingReasoning(selectedThreads, availableThreads, chapter);
    const priorityScore = this.calculatePriorityScore(selectedThreads);
    const readerExpectation = this.determineReaderExpectation(selectedThreads, chapter);
    const riskFactors = this.identifyRiskFactors(selectedThreads, chapter);

    const decision: SchedulingDecision = {
      chapter,
      selectedThreads: selectedThreads.map(t => t.id),
      reasoning,
      priorityScore,
      readerExpectation,
      riskFactors
    };

    this.schedulingQueue.push(decision);
    return decision;
  }

  private getAvailableThreads(chapter: number): NarrativeThread[] {
    const available: NarrativeThread[] = [];

    this.threads.forEach(thread => {
      // Check if thread is active or critical
      if (thread.status !== 'active' && thread.status !== 'critical') {
        return;
      }

      // Check if dependencies are met
      const dependenciesMet = thread.dependencies.every(depId => {
        const dep = this.threads.get(depId);
        return dep && dep.status !== 'dormant';
      });

      if (!dependenciesMet) {
        return;
      }

      // Check if not blocked
      if (thread.blocks.length > 0) {
        return;
      }

      available.push(thread);
    });

    return available;
  }

  private selectThreadsForChapter(threads: NarrativeThread[], chapter: number): NarrativeThread[] {
    const selected: NarrativeThread[] = [];
    const scoredThreads = threads.map(t => ({
      thread: t,
      score: this.calculateThreadScore(t, chapter)
    }));

    // Sort by score
    scoredThreads.sort((a, b) => b.score - a.score);

    // Select top threads up to max
    for (const { thread } of scoredThreads) {
      if (selected.length >= this.MAX_THREADS_PER_CHAPTER) break;
      
      // Always include critical threads
      if (thread.status === 'critical') {
        selected.unshift(thread);
        continue;
      }

      // Check minimum gap
      const chaptersSinceLastFeature = chapter - thread.lastFeatured;
      if (chaptersSinceLastFeature < this.MIN_GAP_BETWEEN_FEATURES && thread.type !== 'main') {
        continue;
      }

      selected.push(thread);
    }

    // Ensure main thread is always present if possible
    const mainThread = threads.find(t => t.type === 'main');
    if (mainThread && !selected.includes(mainThread)) {
      if (selected.length >= this.MAX_THREADS_PER_CHAPTER) {
        // Replace lowest priority non-main thread
        const lowestPriority = selected.filter(t => t.type !== 'main')
          .sort((a, b) => a.priority - b.priority)[0];
        if (lowestPriority) {
          const index = selected.indexOf(lowestPriority);
          selected[index] = mainThread;
        }
      } else {
        selected.push(mainThread);
      }
    }

    return selected;
  }

  private calculateThreadScore(thread: NarrativeThread, chapter: number): number {
    let score = 0;

    // Base priority score (0-10 normalized to 0-0.3)
    score += (thread.priority / 10) * 0.3;

    // Urgency score (0-0.25)
    score += thread.urgency * 0.25;

    // Reader investment (0-0.2)
    score += thread.readerInvestment * 0.2;

    // Time since last feature (encourage featuring neglected threads)
    const chaptersSinceLastFeature = chapter - thread.lastFeatured;
    score += Math.min(0.15, chaptersSinceLastFeature * 0.03);

    // Upcoming event bonus
    const upcomingEvents = thread.keyEvents.filter(
      e => e.chapter >= chapter && e.chapter <= chapter + 3 && !e.executed
    );
    if (upcomingEvents.length > 0) {
      score += 0.1 * upcomingEvents.reduce((sum, e) => sum + e.importance, 0);
    }

    // Thread type bonuses
    const typeBonus: Record<string, number> = {
      main: 0.1,
      character: 0.05,
      subplot: 0.03,
      mystery: 0.04,
      romance: 0.02,
      world: 0.02
    };
    score += typeBonus[thread.type] || 0;

    return Math.min(1, score);
  }

  private generateSchedulingReasoning(
    selected: NarrativeThread[],
    available: NarrativeThread[],
    chapter: number
  ): string {
    const parts: string[] = [];

    // Dominant thread reasoning
    if (selected.length > 0) {
      const dominant = selected[0];
      parts.push(`Primary focus: "${dominant.name}" (priority ${dominant.priority}, urgency ${dominant.urgency.toFixed(2)})`);
    }

    // Supporting threads
    if (selected.length > 1) {
      const supporting = selected.slice(1);
      parts.push(`Supporting threads: ${supporting.map(t => `"${t.name}"`).join(', ')}`);
    }

    // Excluded threads reasoning
    const excluded = available.filter(t => !selected.includes(t));
    if (excluded.length > 0) {
      parts.push(`Deferred threads: ${excluded.slice(0, 2).map(t => `"${t.name}"`).join(', ')} (scheduled for later chapters)`);
    }

    return parts.join('. ');
  }

  private calculatePriorityScore(selected: NarrativeThread[]): number {
    if (selected.length === 0) return 0;
    return selected.reduce((sum, t) => sum + t.priority, 0) / selected.length;
  }

  private determineReaderExpectation(selected: NarrativeThread[], chapter: number): string {
    // Determine what readers expect based on thread types
    const types = selected.map(t => t.type);
    
    if (types.includes('main') && types.includes('mystery')) {
      return 'Readers expect major plot advancement with revelations';
    }
    if (types.includes('romance')) {
      return 'Readers expect emotional character moments';
    }
    if (types.every(t => t === 'world')) {
      return 'Readers expect world-building and exploration';
    }
    if (selected.every(t => t.urgency > 0.7)) {
      return 'Readers expect high tension and significant events';
    }
    
    return 'Readers expect steady story progression';
  }

  private identifyRiskFactors(selected: NarrativeThread[], chapter: number): string[] {
    const risks: string[] = [];

    // Too many threads
    if (selected.length > 2) {
      risks.push('Multiple threads may create pacing issues');
    }

    // All high urgency (potential overwhelm)
    if (selected.every(t => t.urgency > 0.8)) {
      risks.push('All threads have high urgency - may overwhelm readers');
    }

    // Missing expected thread
    const mainThread = this.threads.get('main_narrative');
    if (mainThread && !selected.includes(mainThread) && mainThread.status === 'active') {
      const chaptersSinceMain = chapter - mainThread.lastFeatured;
      if (chaptersSinceMain > 3) {
        risks.push('Main thread absent for extended period');
      }
    }

    // Dormant thread about to expire
    const dormantThreads = Array.from(this.threads.values())
      .filter(t => t.status === 'dormant' && t.readerInvestment < 0.3);
    if (dormantThreads.length > 0) {
      risks.push(`Dormant thread(s) at risk of reader forgetting: ${dormantThreads.map(t => t.name).join(', ')}`);
    }

    return risks;
  }

  // ============================================================================
  // WEAVE PATTERNS
  // ============================================================================

  /**
   * Generate a weave pattern for a chapter
   */
  generateWeave(chapter: number, selectedThreads: string[]): ThreadWeave {
    const threads = selectedThreads.map(id => this.threads.get(id)).filter(Boolean) as NarrativeThread[];
    
    // Determine weave pattern
    const weavePattern = this.determineWeavePattern(threads, chapter);
    
    // Identify dominant and supporting threads
    const { dominantThread, supportingThreads } = this.categorizeThreads(threads);
    
    // Calculate tension balance
    const tensionBalance = this.calculateTensionBalance(threads);
    
    // Estimate chapter length
    const estimatedLength = this.estimateChapterLength(threads, weavePattern);

    const weave: ThreadWeave = {
      chapter,
      threads: selectedThreads,
      weavePattern,
      dominantThread: dominantThread.id,
      supportingThreads: supportingThreads.map(t => t.id),
      tensionBalance,
      estimatedLength
    };

    this.weaveHistory.push(weave);
    return weave;
  }

  private determineWeavePattern(threads: NarrativeThread[], chapter: number): ThreadWeave['weavePattern'] {
    // Single thread - sequential
    if (threads.length === 1) {
      return 'sequential';
    }

    // Check for converging events
    const eventsAtChapter = threads.flatMap(t => 
      t.keyEvents.filter(e => e.chapter === chapter && !e.executed)
    );
    
    if (eventsAtChapter.length >= 2) {
      return 'convergent';
    }

    // Check for high tension threads
    const highTensionThreads = threads.filter(t => t.urgency > 0.7);
    if (highTensionThreads.length >= 2) {
      return 'intercut';
    }

    // Check for related threads (same characters)
    const characterOverlap = this.checkCharacterOverlap(threads);
    if (characterOverlap) {
      return 'parallel';
    }

    // Default to intercut for 2 threads, parallel for more
    return threads.length > 2 ? 'parallel' : 'intercut';
  }

  private categorizeThreads(threads: NarrativeThread[]): {
    dominantThread: NarrativeThread;
    supportingThreads: NarrativeThread[];
  } {
    // Handle empty threads array
    if (threads.length === 0) {
      const defaultThread: NarrativeThread = {
        id: 'default',
        name: 'Main Plot',
        type: 'plot',
        priority: 10,
        urgency: 5,
        status: 'active',
        characters: [],
        keyEvents: [],
        conflicts: []
      };
      return {
        dominantThread: defaultThread,
        supportingThreads: []
      };
    }

    // Sort by priority and urgency
    const sorted = [...threads].sort((a, b) => {
      const scoreA = a.priority * 0.5 + a.urgency * 10 * 0.5;
      const scoreB = b.priority * 0.5 + b.urgency * 10 * 0.5;
      return scoreB - scoreA;
    });

    return {
      dominantThread: sorted[0],
      supportingThreads: sorted.slice(1)
    };
  }

  private calculateTensionBalance(threads: NarrativeThread[]): number {
    if (threads.length === 0) return 0.5;

    // Average urgency weighted by priority
    const weightedTension = threads.reduce((sum, t) => {
      return sum + t.urgency * (t.priority / 10);
    }, 0);

    const maxTension = threads.length * 0.9;
    return Math.min(1, weightedTension / maxTension);
  }

  private estimateChapterLength(threads: NarrativeThread[], pattern: ThreadWeave['weavePattern']): number {
    // Base length per thread
    const baseLength = 2000;
    
    // Pattern multipliers
    const patternMultipliers: Record<string, number> = {
      sequential: 1.0,
      intercut: 1.2,  // More transitions
      parallel: 1.3,  // Multiple simultaneous
      convergent: 1.4  // Complex weaving
    };

    const multiplier = patternMultipliers[pattern] || 1.0;
    const threadCount = threads.length;

    // Estimate based on thread count and pattern
    return Math.floor(baseLength * threadCount * multiplier);
  }

  private checkCharacterOverlap(threads: NarrativeThread[]): boolean {
    const allCharacters = threads.flatMap(t => t.characters);
    const uniqueCharacters = new Set(allCharacters);
    
    // If there's overlap, fewer unique characters than total
    return uniqueCharacters.size < allCharacters.length;
  }

  // ============================================================================
  // BALANCE MONITORING
  // ============================================================================

  /**
   * Analyze thread balance for a chapter
   */
  analyzeBalance(chapter: number): ThreadBalance {
    const threadCoverage = new Map<string, number>();
    const weave = this.weaveHistory.find(w => w.chapter === chapter);
    
    if (weave) {
      // Calculate coverage based on weave
      const dominantCoverage = 0.6;
      const supportingCoverage = (1 - dominantCoverage) / Math.max(1, weave.supportingThreads.length);
      
      threadCoverage.set(weave.dominantThread, dominantCoverage);
      weave.supportingThreads.forEach(id => {
        threadCoverage.set(id, supportingCoverage);
      });
    }

    // Calculate category coverage
    const mainThreadFocus = this.calculateMainThreadFocus(threadCoverage);
    const subplotCoverage = this.calculateSubplotCoverage(threadCoverage);
    const characterDevelopment = this.calculateCharacterDevelopment(threadCoverage);

    // Identify imbalances
    const imbalanceWarnings = this.identifyImbalances(
      mainThreadFocus,
      subplotCoverage,
      characterDevelopment,
      chapter
    );

    const balance: ThreadBalance = {
      chapter,
      threadCoverage,
      mainThreadFocus,
      subplotCoverage,
      characterDevelopment,
      imbalanceWarnings
    };

    this.balanceHistory.push(balance);
    return balance;
  }

  private calculateMainThreadFocus(coverage: Map<string, number>): number {
    const mainThread = this.threads.get('main_narrative');
    if (!mainThread) return 0;
    return coverage.get(mainThread.id) || 0;
  }

  private calculateSubplotCoverage(coverage: Map<string, number>): number {
    let totalCoverage = 0;
    this.threads.forEach(thread => {
      if (thread.type === 'subplot') {
        totalCoverage += coverage.get(thread.id) || 0;
      }
    });
    return totalCoverage;
  }

  private calculateCharacterDevelopment(coverage: Map<string, number>): number {
    let totalCoverage = 0;
    this.threads.forEach(thread => {
      if (thread.type === 'character') {
        totalCoverage += coverage.get(thread.id) || 0;
      }
    });
    return totalCoverage;
  }

  private identifyImbalances(
    mainThreadFocus: number,
    subplotCoverage: number,
    characterDevelopment: number,
    chapter: number
  ): string[] {
    const warnings: string[] = [];

    if (mainThreadFocus < this.MAIN_THREAD_MIN) {
      warnings.push(`Main thread focus (${(mainThreadFocus * 100).toFixed(0)}%) below minimum (${(this.MAIN_THREAD_MIN * 100).toFixed(0)}%)`);
    }

    if (subplotCoverage < this.SUBPLOT_MIN) {
      warnings.push(`Subplot coverage (${(subplotCoverage * 100).toFixed(0)}%) below minimum`);
    }

    if (characterDevelopment < this.CHARACTER_DEV_MIN) {
      warnings.push(`Character development (${(characterDevelopment * 100).toFixed(0)}%) below minimum`);
    }

    // Check for neglected threads
    this.threads.forEach(thread => {
      if (thread.status === 'active') {
        const chaptersSinceLastFeature = chapter - thread.lastFeatured;
        if (chaptersSinceLastFeature > 5 && thread.priority >= 7) {
          warnings.push(`High-priority thread "${thread.name}" neglected for ${chaptersSinceLastFeature} chapters`);
        }
      }
    });

    return warnings;
  }

  /**
   * Get balance history for analysis
   */
  getBalanceHistory(): ThreadBalance[] {
    return [...this.balanceHistory];
  }

  // ============================================================================
  // ADVANCED SCHEDULING
  // ============================================================================

  /**
   * Schedule multiple chapters in advance
   */
  scheduleChapterRange(startChapter: number, count: number): SchedulingDecision[] {
    const decisions: SchedulingDecision[] = [];

    for (let i = 0; i < count; i++) {
      const chapter = startChapter + i;
      const decision = this.scheduleChapter(chapter);
      decisions.push(decision);

      // Update thread positions for next scheduling
      decision.selectedThreads.forEach(threadId => {
        this.updateThreadProgress(threadId, chapter);
      });
    }

    return decisions;
  }

  /**
   * Optimize thread scheduling for maximum reader engagement
   */
  optimizeSchedule(startChapter: number, count: number): {
    schedule: SchedulingDecision[];
    expectedEngagement: number[];
    recommendations: string[];
  } {
    const schedule = this.scheduleChapterRange(startChapter, count);
    const expectedEngagement = schedule.map(d => this.predictEngagement(d));
    const recommendations = this.generateOptimizationRecommendations(schedule);

    return {
      schedule,
      expectedEngagement,
      recommendations
    };
  }

  private predictEngagement(decision: SchedulingDecision): number {
    const threads = decision.selectedThreads.map(id => this.threads.get(id)).filter(Boolean) as NarrativeThread[];
    
    if (threads.length === 0) return 0.5;

    // Base engagement from thread priorities
    let engagement = threads.reduce((sum, t) => sum + t.priority, 0) / (threads.length * 10);
    
    // Bonus for high urgency
    const urgencyBonus = threads.reduce((sum, t) => sum + t.urgency, 0) / threads.length;
    engagement += urgencyBonus * 0.2;

    // Bonus for reader investment
    const investmentBonus = threads.reduce((sum, t) => sum + t.readerInvestment, 0) / threads.length;
    engagement += investmentBonus * 0.15;

    // Penalty for too many threads
    if (threads.length > 2) {
      engagement -= (threads.length - 2) * 0.05;
    }

    return Math.min(1, Math.max(0, engagement));
  }

  private generateOptimizationRecommendations(schedule: SchedulingDecision[]): string[] {
    const recommendations: string[] = [];

    // Check engagement trends
    const avgEngagement = schedule.reduce((sum, d) => {
      return sum + this.predictEngagement(d);
    }, 0) / schedule.length;

    if (avgEngagement < 0.6) {
      recommendations.push('Average engagement below optimal - consider increasing high-priority thread features');
    }

    // Check for thread neglect
    const featuredThreads = new Set(schedule.flatMap(d => d.selectedThreads));
    this.threads.forEach(thread => {
      if (thread.status === 'active' && !featuredThreads.has(thread.id) && thread.priority >= 7) {
        recommendations.push(`High-priority thread "${thread.name}" not featured in scheduled range`);
      }
    });

    // Check for pacing issues
    const highUrgencyChapters = schedule.filter(d => {
      const threads = d.selectedThreads.map(id => this.threads.get(id)).filter(Boolean) as NarrativeThread[];
      return threads.every(t => t.urgency > 0.7);
    });

    if (highUrgencyChapters.length > schedule.length * 0.5) {
      recommendations.push('Too many consecutive high-urgency chapters - consider adding breathing room');
    }

    return recommendations;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Get weave history
   */
  getWeaveHistory(): ThreadWeave[] {
    return [...this.weaveHistory];
  }

  /**
   * Get scheduling queue
   */
  getSchedulingQueue(): SchedulingDecision[] {
    return [...this.schedulingQueue];
  }

  /**
   * Get weave templates
   */
  getWeaveTemplates(): WeaveTemplate[] {
    return Array.from(this.weaveTemplates.values());
  }

  /**
   * Apply custom weave template
   */
  applyWeaveTemplate(templateName: string, chapter: number, threadIds: string[]): ThreadWeave | null {
    const template = this.weaveTemplates.get(templateName);
    if (!template) return null;

    const threads = threadIds.map(id => this.threads.get(id)).filter(Boolean) as NarrativeThread[];
    if (threads.length < template.threadCount) {
      console.warn(`Template requires ${template.threadCount} threads, but only ${threads.length} provided`);
    }

    return this.generateWeave(chapter, threadIds);
  }

  /**
   * Generate scheduling report
   */
  generateReport(): {
    totalThreads: number;
    activeThreads: number;
    averageUrgency: number;
    averageInvestment: number;
    neglectedThreads: string[];
    recommendedActions: string[];
  } {
    const threads = Array.from(this.threads.values());
    const activeThreads = threads.filter(t => t.status === 'active');
    
    const averageUrgency = activeThreads.reduce((sum, t) => sum + t.urgency, 0) / activeThreads.length || 0;
    const averageInvestment = activeThreads.reduce((sum, t) => sum + t.readerInvestment, 0) / activeThreads.length || 0;

    // Find neglected threads
    const neglectedThreads = activeThreads
      .filter(t => t.lastFeatured < 5 && t.priority >= 6)
      .map(t => t.name);

    // Generate recommendations
    const recommendedActions: string[] = [];
    
    if (averageUrgency > 0.7) {
      recommendedActions.push('Multiple high-urgency threads - consider prioritizing');
    }
    if (averageInvestment < 0.5) {
      recommendedActions.push('Reader investment declining - feature key threads soon');
    }
    if (neglectedThreads.length > 0) {
      recommendedActions.push(`Neglected threads need attention: ${neglectedThreads.join(', ')}`);
    }

    return {
      totalThreads: threads.length,
      activeThreads: activeThreads.length,
      averageUrgency,
      averageInvestment,
      neglectedThreads,
      recommendedActions
    };
  }

  /**
   * Force thread feature in next chapter
   */
  forceThreadFeature(threadId: string, chapter: number): void {
    const thread = this.threads.get(threadId);
    if (thread) {
      thread.urgency = 1.0;
      thread.nextFeature = chapter;
      if (thread.status === 'dormant') {
        thread.status = 'active';
      }
    }
  }

  /**
   * Get threads by character
   */
  getThreadsByCharacter(characterId: string): NarrativeThread[] {
    return Array.from(this.threads.values())
      .filter(t => t.characters.includes(characterId));
  }
}

export default MultiThreadNarrativeScheduler;