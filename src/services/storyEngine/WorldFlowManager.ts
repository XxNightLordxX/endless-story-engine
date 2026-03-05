/**
 * World Flow Manager
 * Manages structured transitions between VR and real world
 * Ensures story flows in blocks: VR → Reality → VR (not random alternation)
 */

export interface FlowConfiguration {
  minVRChapters: number;
  maxVRChapters: number;
  minRealChapters: number;
  maxRealChapters: number;
}

export interface FlowState {
  currentWorld: 'real' | 'vr';
  chaptersInCurrentWorld: number;
  targetChaptersInCurrentWorld: number;
  previousWorld: 'real' | 'vr' | null;
  transitionReason: string;
}

export class WorldFlowManager {
  private flowState: FlowState;
  private config: FlowConfiguration;
  private chapterCount: number = 0;

  constructor(config?: Partial<FlowConfiguration>) {
    this.config = {
      minVRChapters: 3,
      maxVRChapters: 4,
      minRealChapters: 1,
      maxRealChapters: 2,
      ...config,
    };

    this.flowState = {
      currentWorld: 'real', // Start with real world (Chapter 1 is real)
      chaptersInCurrentWorld: 1, // Chapter 1 is already in real world
      targetChaptersInCurrentWorld: 1, // Only 1 real chapter at start
      previousWorld: null,
      transitionReason: 'Initial chapter',
    };
  }

  /**
   * Determine which world the next chapter should be in
   */
  determineNextWorld(): {
    world: 'real' | 'vr';
    shouldTransition: boolean;
    transitionReason: string;
    chaptersRemaining: number;
  } {
    this.chapterCount++;

    // Check if we need to transition
    if (this.shouldTransitionWorld()) {
      return this.transitionToNextWorld();
    }

    // Increment chapters in current world (we're staying in this world)
    this.flowState.chaptersInCurrentWorld++;

    // Stay in current world
    return {
      world: this.flowState.currentWorld,
      shouldTransition: false,
      transitionReason: this.flowState.transitionReason,
      chaptersRemaining: this.flowState.targetChaptersInCurrentWorld - this.flowState.chaptersInCurrentWorld,
    };
  }

  /**
   * Check if we should transition to the other world
   */
  private shouldTransitionWorld(): boolean {
    return this.flowState.chaptersInCurrentWorld >= this.flowState.targetChaptersInCurrentWorld;
  }

  /**
   * Transition to the next world
   */
  private transitionToNextWorld(): {
    world: 'real' | 'vr';
    shouldTransition: boolean;
    transitionReason: string;
    chaptersRemaining: number;
  } {
    const nextWorld = this.flowState.currentWorld === 'real' ? 'vr' : 'real';
    const targetCount = this.getTargetChapterCount(nextWorld);
    const transitionReason = this.generateTransitionReason(this.flowState.currentWorld, nextWorld);

    // Update flow state
    this.flowState.previousWorld = this.flowState.currentWorld;
    this.flowState.currentWorld = nextWorld;
    this.flowState.chaptersInCurrentWorld = 0;
    this.flowState.targetChaptersInCurrentWorld = targetCount;
    this.flowState.transitionReason = transitionReason;

    return {
      world: nextWorld,
      shouldTransition: true,
      transitionReason,
      chaptersRemaining: targetCount,
    };
  }

  /**
   * Get the target number of chapters for a world block
   */
  private getTargetChapterCount(world: 'real' | 'vr'): number {
    if (world === 'vr') {
      // Random number between min and max for VR chapters
      const range = this.config.maxVRChapters - this.config.minVRChapters + 1;
      return this.config.minVRChapters + Math.floor(Math.random() * range);
    } else {
      // Random number between min and max for real world chapters
      const range = this.config.maxRealChapters - this.config.minRealChapters + 1;
      return this.config.minRealChapters + Math.floor(Math.random() * range);
    }
  }

  /**
   * Generate a narrative reason for the transition
   */
  private generateTransitionReason(from: 'real' | 'vr', to: 'real' | 'vr'): string {
    const reasons = {
      'real-to-vr': [
        'Returning to Eclipsis to continue the quest',
        'New information discovered in game needs investigation',
        'System message received from the virtual world',
        'VR stats need to be leveled up for the challenge ahead',
        'Time to explore more of the vampire abilities',
      ],
      'vr-to-real': [
        'Returning to visit Yuna at the hospital',
        'A system effect is bleeding into reality',
        'Physical changes from VR becoming noticeable',
        'Need to process what was learned in the game',
        'Real-world situation requires immediate attention',
      ],
    };

    const key = `${from}-to-${to}` as keyof typeof reasons;
    const reasonList = reasons[key];
    return reasonList[Math.floor(Math.random() * reasonList.length)];
  }

  /**
   * Get the current flow state
   */
  getFlowState(): FlowState {
    return { ...this.flowState };
  }

  /**
   * Get expected flow pattern for the next few chapters
   */
  getExpectedPattern(upcoming: number = 6): Array<{
    chapterNumber: number;
    world: 'real' | 'vr';
  }> {
    const pattern: Array<{ chapterNumber: number; world: 'real' | 'vr' }> = [];
    let tempState = { ...this.flowState, chaptersInCurrentWorld: this.flowState.chaptersInCurrentWorld };
    let tempTarget = tempState.targetChaptersInCurrentWorld;

    for (let i = 1; i <= upcoming; i++) {
      const chapterNumber = this.chapterCount + i;
      
      // Check if we need to transition
      if (tempState.chaptersInCurrentWorld >= tempTarget) {
        tempState.previousWorld = tempState.currentWorld;
        tempState.currentWorld = tempState.currentWorld === 'real' ? 'vr' : 'real';
        tempState.chaptersInCurrentWorld = 0;
        tempTarget = this.getTargetChapterCount(tempState.currentWorld);
      }

      pattern.push({
        chapterNumber,
        world: tempState.currentWorld,
      });

      tempState.chaptersInCurrentWorld++;
    }

    return pattern;
  }

  /**
   * Update flow configuration
   */
  updateConfig(newConfig: Partial<FlowConfiguration>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Reset the flow manager (useful for testing)
   */
  reset(): void {
    this.chapterCount = 0;
    this.flowState = {
      currentWorld: 'real',
      chaptersInCurrentWorld: 1,
      targetChaptersInCurrentWorld: 1,
      previousWorld: null,
      transitionReason: 'Initial chapter',
    };
  }

  /**
   * Get the total number of chapters processed
   */
  getChapterCount(): number {
    return this.chapterCount;
  }
}

export default WorldFlowManager;