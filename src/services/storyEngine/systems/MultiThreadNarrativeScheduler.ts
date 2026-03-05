/**
 * MultiThreadNarrativeScheduler - Parallel Thread Management
 * 
 * Manages multiple concurrent narrative threads:
 * - Tracks and coordinates parallel storylines
 * - Balances screen time between threads
 * - Manages thread interconnections
 * - Handles thread convergence and divergence
 * - Optimizes narrative pacing across threads
 */

import type { Chapter, StoryState } from '../types';
import type { StoryGenerationOptions } from '../types';

interface NarrativeThread {
  id: string;
  name: string;
  type: 'main' | 'subplot' | 'character' | 'world' | 'theme';
  status: 'active' | 'paused' | 'completed' | 'pending';
  priority: number;
  chaptersSinceLastActive: number;
  assignedChapters: number[];
  characters: string[];
  locations: string[];
  connections: ThreadConnection[];
  tensionLevel: number;
  lastProgress: number;
  importance: number;
  expectedResolution: number;
  createdAt: number;
}

interface ThreadConnection {
  targetThreadId: string;
  type: 'convergence' | 'divergence' | 'parallel' | 'influence' | 'conflict';
  strength: number;
  expectedChapter?: number;
}

interface ThreadEvent {
  threadId: string;
  chapterNumber: number;
  eventType: 'introduced' | 'advanced' | 'paused' | 'converged' | 'diverged' | 'resolved';
  description: string;
  impact: number;
}

interface SchedulingDecision {
  activeThread: string;
  pausedThreads: string[];
  newThreads: string[];
  convergedThreads: string[];
  secondaryThreads?: string[];
  reasoning: string;
}

interface ThreadWeave {
  threads: NarrativeThread[];
  dominantThread: string;
  secondaryThreads: string[];
  weavingPattern: string;
}

export class MultiThreadNarrativeScheduler {
  private threads: Map<string, NarrativeThread> = new Map();
  private threadEvents: ThreadEvent[] = [];
  private currentChapter: number = 0;
  private threadHistory: Map<number, string[]> = new Map();
  private maxActiveThreads: number = 3;
  private minChaptersBetweenThreadSwitch: number = 2;
  
  // Cross-system references
  private arcModeling?: any;
  private structureLayer?: any;
  private crossArcEngine?: any;

  constructor(config?: { maxActiveThreads?: number; minChaptersBetweenSwitch?: number }) {
    this.maxActiveThreads = config?.maxActiveThreads ?? 3;
    this.minChaptersBetweenThreadSwitch = config?.minChaptersBetweenSwitch ?? 2;
  }

  /**
   * Register a new narrative thread
   */
  registerThread(
    id: string,
    name: string,
    type: NarrativeThread['type'],
    options: {
      priority?: number;
      characters?: string[];
      locations?: string[];
      expectedResolution?: number;
      importance?: number;
    } = {}
  ): NarrativeThread {
    const thread: NarrativeThread = {
      id,
      name,
      type,
      status: 'pending',
      priority: options.priority ?? this.getDefaultPriority(type),
      chaptersSinceLastActive: 0,
      assignedChapters: [],
      characters: options.characters ?? [],
      locations: options.locations ?? [],
      connections: [],
      tensionLevel: 0.5,
      lastProgress: 0,
      importance: options.importance ?? 0.5,
      expectedResolution: options.expectedResolution ?? 50,
      createdAt: Date.now()
    };

    this.threads.set(id, thread);
    this.recordEvent(id, 0, 'introduced', `Thread "${name}" registered`, 1);
    
    return thread;
  }

  /**
   * Get default priority based on thread type
   */
  private getDefaultPriority(type: NarrativeThread['type']): number {
    const priorities: Record<NarrativeThread['type'], number> = {
      main: 10,
      character: 7,
      subplot: 5,
      world: 3,
      theme: 2
    };
    return priorities[type];
  }

  /**
   * Connect two threads
   */
  connectThreads(
    threadId1: string,
    threadId2: string,
    connectionType: ThreadConnection['type'],
    options: { strength?: number; expectedChapter?: number } = {}
  ): void {
    const thread1 = this.threads.get(threadId1);
    const thread2 = this.threads.get(threadId2);

    if (!thread1 || !thread2) {
      console.error(`Cannot connect threads: one or both not found`);
      return;
    }

    // Add bidirectional connection
    thread1.connections.push({
      targetThreadId: threadId2,
      type: connectionType,
      strength: options.strength ?? 0.5,
      expectedChapter: options.expectedChapter
    });

    thread2.connections.push({
      targetThreadId: threadId1,
      type: this.getInverseConnectionType(connectionType),
      strength: options.strength ?? 0.5,
      expectedChapter: options.expectedChapter
    });
  }

  /**
   * Get inverse connection type for bidirectional linking
   */
  private getInverseConnectionType(type: ThreadConnection['type']): ThreadConnection['type'] {
    const inverses: Record<ThreadConnection['type'], ThreadConnection['type']> = {
      convergence: 'convergence',
      divergence: 'divergence',
      parallel: 'parallel',
      influence: 'influence',
      conflict: 'conflict'
    };
    return inverses[type];
  }

  /**
   * Schedule threads for the next chapter
   */
  scheduleNextChapter(
    chapterNumber: number,
    storyState: StoryState,
    chapters: Chapter[]
  ): SchedulingDecision {
    this.currentChapter = chapterNumber;

    // Update thread states
    this.updateThreadStates(chapters);

    // Calculate thread scores
    const threadScores = this.calculateThreadScores();

    // Determine active threads
    const decision = this.makeSchedulingDecision(threadScores, chapterNumber);

    // Record history
    this.threadHistory.set(chapterNumber, [decision.activeThread, ...decision.secondaryThreads]);

    return decision;
  }

  /**
   * Update thread states based on story progress
   */
  private updateThreadStates(chapters: Chapter[]): void {
    const recentContent = chapters.slice(-5).map(ch => ch.content).join(' ');

    for (const [id, thread] of this.threads) {
      // Check if thread was active recently
      const wasActiveRecently = this.wasThreadActiveRecently(id, chapters.length);
      
      if (wasActiveRecently) {
        thread.chaptersSinceLastActive = 0;
      } else {
        thread.chaptersSinceLastActive++;
      }

      // Check for thread completion
      if (this.checkThreadCompletion(thread, recentContent)) {
        thread.status = 'completed';
        this.recordEvent(id, this.currentChapter, 'resolved', `Thread "${thread.name}" completed`, 1);
      }

      // Update tension level
      thread.tensionLevel = this.calculateThreadTension(thread, chapters);
    }
  }

  /**
   * Check if thread was active in recent chapters
   */
  private wasThreadActiveRecently(threadId: string, currentChapter: number): boolean {
    const recentChapters = Math.max(1, currentChapter - this.minChaptersBetweenThreadSwitch);
    
    for (let ch = recentChapters; ch <= currentChapter; ch++) {
      const threadsForChapter = this.threadHistory.get(ch) || [];
      if (threadsForChapter.includes(threadId)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if thread has been completed
   */
  private checkThreadCompletion(thread: NarrativeThread, content: string): boolean {
    // Check for resolution indicators
    const resolutionIndicators = [
      'resolved', 'concluded', 'finished', 'complete',
      'ended', 'final', 'done', 'accomplished'
    ];

    const threadKeywords = [thread.name.toLowerCase(), ...thread.characters.map(c => c.toLowerCase())];
    
    for (const keyword of threadKeywords) {
      for (const indicator of resolutionIndicators) {
        const pattern = `${keyword}.*${indicator}|${indicator}.*${keyword}`;
        if (new RegExp(pattern, 'i').test(content)) {
          return true;
        }
      }
    }

    // Check if past expected resolution
    if (this.currentChapter > thread.expectedResolution + 10) {
      return true;
    }

    return false;
  }

  /**
   * Calculate tension level for a thread
   */
  private calculateThreadTension(thread: NarrativeThread, chapters: Chapter[]): number {
    let tension = thread.tensionLevel;

    // Analyze recent content for thread tension indicators
    const recentContent = chapters.slice(-3).map(ch => ch.content).join(' ').toLowerCase();
    
    // High tension indicators
    const highTension = ['crisis', 'conflict', 'danger', 'battle', 'struggle', 'confrontation'];
    for (const word of highTension) {
      if (recentContent.includes(word)) {
        tension = Math.min(tension + 0.1, 1);
      }
    }

    // Low tension indicators
    const lowTension = ['peace', 'calm', 'resolved', 'settled', 'rest'];
    for (const word of lowTension) {
      if (recentContent.includes(word)) {
        tension = Math.max(tension - 0.1, 0);
      }
    }

    return tension;
  }

  /**
   * Calculate scheduling scores for all threads
   */
  private calculateThreadScores(): Map<string, number> {
    const scores = new Map<string, number>();

    for (const [id, thread] of this.threads) {
      if (thread.status === 'completed') {
        scores.set(id, 0);
        continue;
      }

      let score = 0;

      // Base score from priority
      score += thread.priority * 10;

      // Score from importance
      score += thread.importance * 20;

      // Score from time since last active (threads that haven't been active get higher priority)
      score += Math.min(thread.chaptersSinceLastActive * 5, 30);

      // Score from tension level (high tension threads need attention)
      score += thread.tensionLevel * 15;

      // Score from type (main threads get priority)
      if (thread.type === 'main') {
        score += 25;
      }

      // Score from connections (threads that need to converge soon)
      const convergenceBonus = this.calculateConvergenceBonus(thread);
      score += convergenceBonus;

      // Penalty for threads that are paused
      if (thread.status === 'paused') {
        score -= 10;
      }

      // Bonus for threads that are active and should continue
      if (thread.status === 'active') {
        score += 5;
      }

      scores.set(id, Math.max(score, 0));
    }

    return scores;
  }

  /**
   * Calculate bonus for threads that need to converge
   */
  private calculateConvergenceBonus(thread: NarrativeThread): number {
    let bonus = 0;

    for (const connection of thread.connections) {
      if (connection.expectedChapter && connection.type === 'convergence') {
        const chaptersUntilConvergence = connection.expectedChapter - this.currentChapter;
        if (chaptersUntilConvergence <= 5 && chaptersUntilConvergence > 0) {
          bonus += (6 - chaptersUntilConvergence) * 5;
        }
      }
    }

    return bonus;
  }

  /**
   * Make scheduling decision based on scores
   */
  private makeSchedulingDecision(
    scores: Map<string, number>,
    chapterNumber: number
  ): SchedulingDecision {
    const activeThreads: string[] = [];
    const pausedThreads: string[] = [];
    const newThreads: string[] = [];
    const convergedThreads: string[] = [];

    // Sort threads by score
    const sortedThreads = [...scores.entries()]
      .filter(([id, score]) => score > 0)
      .sort((a, b) => b[1] - a[1]);

    // Select dominant thread
    let dominantThread = '';
    if (sortedThreads.length > 0) {
      dominantThread = sortedThreads[0][0];
      activeThreads.push(dominantThread);

      // Mark as active
      const thread = this.threads.get(dominantThread);
      if (thread) {
        thread.status = 'active';
        thread.assignedChapters.push(chapterNumber);
        this.recordEvent(dominantThread, chapterNumber, 'advanced', `Thread "${thread.name}" advanced`, 1);
      }
    }

    // Select secondary threads (up to maxActiveThreads - 1)
    for (let i = 1; i < Math.min(sortedThreads.length, this.maxActiveThreads); i++) {
      const threadId = sortedThreads[i][0];
      activeThreads.push(threadId);

      const thread = this.threads.get(threadId);
      if (thread) {
        thread.status = 'active';
        thread.assignedChapters.push(chapterNumber);
      }
    }

    // Check for thread convergence
    const convergence = this.checkForConvergence(activeThreads, chapterNumber);
    if (convergence) {
      convergedThreads.push(...convergence);
    }

    // Identify paused threads
    for (const [id, thread] of this.threads) {
      if (!activeThreads.includes(id) && thread.status === 'active') {
        thread.status = 'paused';
        pausedThreads.push(id);
        this.recordEvent(id, chapterNumber, 'paused', `Thread "${thread.name}" paused`, 0);
      }
    }

    // Check for new threads to introduce
    const pendingThreads = [...this.threads.entries()]
      .filter(([id, thread]) => thread.status === 'pending')
      .sort((a, b) => b[1].priority - a[1].priority);

    if (pendingThreads.length > 0 && activeThreads.length < this.maxActiveThreads) {
      const [newThreadId, newThread] = pendingThreads[0];
      newThread.status = 'active';
      newThreads.push(newThreadId);
      this.recordEvent(newThreadId, chapterNumber, 'introduced', `Thread "${newThread.name}" introduced`, 1);
    }

    // Generate reasoning
    const reasoning = this.generateReasoning(dominantThread, activeThreads, pausedThreads, scores);

    return {
      activeThread: dominantThread,
      pausedThreads,
      newThreads,
      convergedThreads,
      reasoning
    };
  }

  /**
   * Check for thread convergence opportunities
   */
  private checkForConvergence(activeThreads: string[], chapterNumber: number): string[] {
    const converging: string[] = [];

    for (const threadId of activeThreads) {
      const thread = this.threads.get(threadId);
      if (!thread) continue;

      for (const connection of thread.connections) {
        if (connection.type === 'convergence' && 
            connection.expectedChapter === chapterNumber &&
            activeThreads.includes(connection.targetThreadId)) {
          converging.push(connection.targetThreadId);
          this.recordEvent(
            threadId,
            chapterNumber,
            'converged',
            `Threads "${thread.name}" and "${this.threads.get(connection.targetThreadId)?.name}" converged`,
            1
          );
        }
      }
    }

    return converging;
  }

  /**
   * Generate reasoning for scheduling decision
   */
  private generateReasoning(
    dominantThread: string,
    activeThreads: string[],
    pausedThreads: string[],
    scores: Map<string, number>
  ): string {
    const dominant = this.threads.get(dominantThread);
    const parts: string[] = [];

    if (dominant) {
      parts.push(`Prioritizing "${dominant.name}" thread (${dominant.type} type, score: ${scores.get(dominantThread)?.toFixed(0)})`);
    }

    if (activeThreads.length > 1) {
      const secondary = activeThreads.slice(1).map(id => this.threads.get(id)?.name).filter(Boolean);
      if (secondary.length > 0) {
        parts.push(`Weaving with ${secondary.join(', ')}`);
      }
    }

    if (pausedThreads.length > 0) {
      const paused = pausedThreads.map(id => this.threads.get(id)?.name).filter(Boolean);
      parts.push(`Pausing ${paused.join(', ')}`);
    }

    return parts.join('. ') + '.';
  }

  /**
   * Record thread event
   */
  private recordEvent(
    threadId: string,
    chapterNumber: number,
    eventType: ThreadEvent['eventType'],
    description: string,
    impact: number
  ): void {
    this.threadEvents.push({
      threadId,
      chapterNumber,
      eventType,
      description,
      impact
    });
  }

  /**
   * Weave multiple threads together for a chapter
   */
  weaveThreads(chapterNumber: number): ThreadWeave {
    const decision = this.scheduleNextChapter(chapterNumber, {} as StoryState, []);

    const activeThreads = decision.activeThread
      ? [this.threads.get(decision.activeThread)!]
      : [];

    const secondaryThreads = decision.pausedThreads
      .slice(0, 2)
      .map(id => this.threads.get(id))
      .filter(Boolean) as NarrativeThread[];

    return {
      threads: [...activeThreads, ...secondaryThreads],
      dominantThread: decision.activeThread,
      secondaryThreads: decision.pausedThreads.slice(0, 2),
      weavingPattern: this.determineWeavingPattern(activeThreads, secondaryThreads)
    };
  }

  /**
   * Determine how threads should be woven together
   */
  private determineWeavingPattern(
    dominant: NarrativeThread[],
    secondary: NarrativeThread[]
  ): string {
    if (dominant.length === 0 && secondary.length === 0) {
      return 'no_threads';
    }

    if (secondary.length === 0) {
      return 'single_thread';
    }

    // Check for parallel execution
    const hasParallel = secondary.some(thread =>
      thread.connections.some(c => c.type === 'parallel')
    );

    if (hasParallel) {
      return 'parallel_weave';
    }

    // Check for conflict
    const hasConflict = secondary.some(thread =>
      thread.connections.some(c => c.type === 'conflict')
    );

    if (hasConflict) {
      return 'conflict_weave';
    }

    // Check for convergence
    const hasConvergence = secondary.some(thread =>
      thread.connections.some(c => c.type === 'convergence')
    );

    if (hasConvergence) {
      return 'convergence_weave';
    }

    return 'sequential_weave';
  }

  /**
   * Get thread balance statistics
   */
  getThreadBalance(): {
    totalThreads: number;
    activeThreads: number;
    pausedThreads: number;
    completedThreads: number;
    pendingThreads: number;
    averageScreenTime: number;
    threadDistribution: Map<string, number>;
  } {
    const stats = {
      totalThreads: this.threads.size,
      activeThreads: 0,
      pausedThreads: 0,
      completedThreads: 0,
      pendingThreads: 0,
      averageScreenTime: 0,
      threadDistribution: new Map<string, number>()
    };

    let totalChapters = 0;

    for (const [id, thread] of this.threads) {
      switch (thread.status) {
        case 'active':
          stats.activeThreads++;
          break;
        case 'paused':
          stats.pausedThreads++;
          break;
        case 'completed':
          stats.completedThreads++;
          break;
        case 'pending':
          stats.pendingThreads++;
          break;
      }

      stats.threadDistribution.set(id, thread.assignedChapters.length);
      totalChapters += thread.assignedChapters.length;
    }

    stats.averageScreenTime = this.threads.size > 0 
      ? totalChapters / this.threads.size 
      : 0;

    return stats;
  }

  /**
   * Get thread timeline
   */
  getThreadTimeline(): Array<{ chapter: number; threads: string[] }> {
    const timeline: Array<{ chapter: number; threads: string[] }> = [];

    for (let ch = 1; ch <= this.currentChapter; ch++) {
      const threads = this.threadHistory.get(ch) || [];
      timeline.push({ chapter: ch, threads });
    }

    return timeline;
  }

  /**
   * Get thread by ID
   */
  getThread(threadId: string): NarrativeThread | undefined {
    return this.threads.get(threadId);
  }

  /**
   * Get all threads
   */
  getAllThreads(): NarrativeThread[] {
    return Array.from(this.threads.values());
  }

  /**
   * Get active threads
   */
  getActiveThreads(): NarrativeThread[] {
    return Array.from(this.threads.values()).filter(t => t.status === 'active');
  }

  /**
   * Get thread events
   */
  getThreadEvents(): ThreadEvent[] {
    return [...this.threadEvents];
  }

  /**
   * Resolve a thread
   */
  resolveThread(threadId: string, chapterNumber: number): void {
    const thread = this.threads.get(threadId);
    if (thread) {
      thread.status = 'completed';
      this.recordEvent(threadId, chapterNumber, 'resolved', `Thread "${thread.name}" resolved`, 1);
    }
  }

  /**
   * Pause a thread
   */
  pauseThread(threadId: string): void {
    const thread = this.threads.get(threadId);
    if (thread) {
      thread.status = 'paused';
    }
  }

  /**
   * Resume a thread
   */
  resumeThread(threadId: string): void {
    const thread = this.threads.get(threadId);
    if (thread && thread.status === 'paused') {
      thread.status = 'active';
    }
  }

  /**
   * Export scheduler state
   */
  exportState(): {
    threads: NarrativeThread[];
    events: ThreadEvent[];
    history: Array<{ chapter: number; threads: string[] }>;
  } {
    return {
      threads: this.getAllThreads(),
      events: this.threadEvents,
      history: this.getThreadTimeline()
    };
  }

  /**
   * Import scheduler state
   */
  importState(state: {
    threads: NarrativeThread[];
    events: ThreadEvent[];
    history: Array<{ chapter: number; threads: string[] }>;
  }): void {
    this.threads.clear();
    this.threadEvents = [];
    this.threadHistory.clear();

    for (const thread of state.threads) {
      this.threads.set(thread.id, thread);
    }

    this.threadEvents = state.events;

    for (const { chapter, threads } of state.history) {
      this.threadHistory.set(chapter, threads);
    }
  }

  /**
   * Reset scheduler
   */
  reset(): void {
    this.threads.clear();
    this.threadEvents = [];
    this.threadHistory.clear();
    this.currentChapter = 0;
  }
  /**
   * Set cross-system dependencies for MultiThreadNarrativeScheduler
   */
  setDependencies(dependencies: {
    arcModeling?: any;
    structureLayer?: any;
    crossArcEngine?: any;
  }): void {
    this.arcModeling = dependencies.arcModeling;
    this.structureLayer = dependencies.structureLayer;
    this.crossArcEngine = dependencies.crossArcEngine;
  }

  /**
   * Get system status including cross-system connectivity
   */
  getSystemStatus(): {
    activeThreads: number;
    pendingThreads: number;
    completedThreads: number;
    connectedSystems: string[];
  } {
    const connectedSystems: string[] = [];
    if (this.arcModeling) connectedSystems.push('arcModeling');
    if (this.structureLayer) connectedSystems.push('structureLayer');
    if (this.crossArcEngine) connectedSystems.push('crossArcEngine');

    let activeThreads = 0;
    let pendingThreads = 0;
    let completedThreads = 0;
    
    for (const thread of this.threads.values()) {
      if (thread.status === 'active') activeThreads++;
      else if (thread.status === 'pending') pendingThreads++;
      else if (thread.status === 'resolved') completedThreads++;
    }

    return {
      activeThreads,
      pendingThreads,
      completedThreads,
      connectedSystems
    };
  }
}
