/**
 * PredictiveArcModeling - Arc Prediction System
 * 
 * Provides intelligent arc prediction capabilities:
 * - Predicts future narrative arcs based on current story state
 * - Identifies optimal plot progression paths
 * - Analyzes narrative tension and pacing
 * - Suggests upcoming events and developments
 * - Tracks arc satisfaction and fulfillment
 */

import type { Chapter, StoryState } from '../types';
import type { StoryGenerationOptions } from '../types';

interface NarrativeArc {
  id: string;
  type: 'character' | 'plot' | 'theme' | 'relationship' | 'world';
  name: string;
  description: string;
  status: 'introduction' | 'rising_action' | 'climax' | 'falling_action' | 'resolution';
  progress: number;
  predictedBeats: ArcBeat[];
  satisfactionScore: number;
  chapterIntroduced: number;
  estimatedCompletion: number;
}

interface ArcBeat {
  sequence: number;
  type: 'setup' | 'complication' | 'climax' | 'denouement' | 'resolution';
  description: string;
  predictedChapter: number;
  fulfillment: number;
  actualChapter?: number;
  content?: string;
}

interface ArcPrediction {
  arcId: string;
  confidence: number;
  predictedProgression: string[];
  recommendedNextBeats: ArcBeat[];
  predictedTensionCurve: number[];
  predictedCompletion: number;
  alternativePaths: string[];
}

interface ArcModel {
  type: string;
  pattern: string[];
  duration: { min: number; max: number; optimal: number };
  tensionProfile: number[];
  requiredBeats: string[];
  optionalBeats: string[];
}

export class PredictiveArcModeling {
  private arcs: Map<string, NarrativeArc> = new Map();
  private arcModels: Map<string, ArcModel> = new Map();
  private predictions: Map<string, ArcPrediction> = new Map();
  private tensionHistory: Map<number, number> = new Map();
  private currentChapter: number = 0;
  
  // Cross-system references
  private characterGenome?: any;
  private worldSimulation?: any;
  private crossArcEngine?: any;

  constructor() {
    this.initializeArcModels();
  }

  /**
   * Initialize predefined arc models
   */
  private initializeArcModels(): void {
    this.arcModels.set('hero_journey', {
      type: 'character',
      pattern: [
        'call_to_adventure',
        'refusal',
        'meeting_mentor',
        'crossing_threshold',
        'tests_allies_enemies',
        'approach',
        'ordeal',
        'reward',
        'road_back',
        'resurrection',
        'return'
      ],
      duration: { min: 11, max: 22, optimal: 15 },
      tensionProfile: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.9, 0.7, 0.6, 0.8, 0.3],
      requiredBeats: ['call_to_adventure', 'ordeal', 'reward', 'return'],
      optionalBeats: ['refusal', 'meeting_mentor', 'resurrection']
    });

    this.arcModels.set('mystery', {
      type: 'plot',
      pattern: [
        'crime_discovered',
        'investigation_begins',
        'first_clue',
        'false_lead',
        'breakthrough',
        'suspect_identified',
        'confrontation',
        'resolution'
      ],
      duration: { min: 8, max: 15, optimal: 10 },
      tensionProfile: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.4],
      requiredBeats: ['crime_discovered', 'breakthrough', 'resolution'],
      optionalBeats: ['false_lead', 'suspect_identified']
    });

    this.arcModels.set('romance', {
      type: 'relationship',
      pattern: [
        'first_meeting',
        'attraction',
        'obstacle',
        'deepening_connection',
        'major_conflict',
        'separation',
        'realization',
        'reunion',
        'commitment'
      ],
      duration: { min: 9, max: 18, optimal: 12 },
      tensionProfile: [0.2, 0.3, 0.5, 0.6, 0.8, 0.9, 0.7, 0.6, 0.4],
      requiredBeats: ['first_meeting', 'major_conflict', 'commitment'],
      optionalBeats: ['separation', 'realization']
    });

    this.arcModels.set('redemption', {
      type: 'character',
      pattern: [
        'fall',
        'rock_bottom',
        'reflection',
        'opportunity',
        'struggle',
        'sacrifice',
        'redemption'
      ],
      duration: { min: 7, max: 14, optimal: 10 },
      tensionProfile: [0.7, 0.8, 0.6, 0.5, 0.7, 0.9, 0.3],
      requiredBeats: ['fall', 'rock_bottom', 'sacrifice', 'redemption'],
      optionalBeats: ['reflection', 'opportunity']
    });

    this.arcModels.set('coming_of_age', {
      type: 'character',
      pattern: [
        'innocence',
        'inciting_incident',
        'challenge',
        'failure',
        'growth',
        'revelation',
        'transformation',
        'acceptance'
      ],
      duration: { min: 8, max: 16, optimal: 11 },
      tensionProfile: [0.1, 0.3, 0.5, 0.6, 0.7, 0.8, 0.6, 0.4],
      requiredBeats: ['innocence', 'inciting_incident', 'transformation', 'acceptance'],
      optionalBeats: ['failure', 'revelation']
    });

    this.arcModels.set('revenge', {
      type: 'plot',
      pattern: [
        'wrong_suffered',
        'vow',
        'planning',
        'first_strike',
        'escalation',
        'moral_conflict',
        'climax',
        'consequences',
        'aftermath'
      ],
      duration: { min: 9, max: 18, optimal: 12 },
      tensionProfile: [0.6, 0.7, 0.8, 0.9, 0.95, 0.85, 0.9, 0.5, 0.3],
      requiredBeats: ['wrong_suffered', 'vow', 'climax', 'aftermath'],
      optionalBeats: ['moral_conflict', 'consequences']
    });

    this.arcModels.set('worldbuilding', {
      type: 'world',
      pattern: [
        'discovery',
        'exploration',
        'conflict_arises',
        'alliance_formed',
        'crisis',
        'resolution',
        'new_equilibrium'
      ],
      duration: { min: 7, max: 14, optimal: 10 },
      tensionProfile: [0.2, 0.3, 0.5, 0.6, 0.8, 0.6, 0.3],
      requiredBeats: ['discovery', 'crisis', 'resolution'],
      optionalBeats: ['alliance_formed', 'new_equilibrium']
    });
  }

  /**
   * Analyze story and create arc predictions
   */
  async analyzeStory(
    chapters: Chapter[],
    storyState: StoryState,
    options: StoryGenerationOptions
  ): Promise<NarrativeArc[]> {
    this.currentChapter = chapters.length;

    // Detect existing arcs from content
    await this.detectExistingArcs(chapters, storyState);

    // Update arc progress
    await this.updateArcProgress(chapters, storyState);

    // Generate predictions
    await this.generatePredictions(chapters, storyState);

    // Track tension
    this.trackTension(chapters, options);

    return Array.from(this.arcs.values());
  }

  /**
   * Detect existing arcs from chapter content
   */
  private async detectExistingArcs(chapters: Chapter[], storyState: StoryState): Promise<void> {
    const content = chapters.map(ch => ch.content).join(' ');

    // Check for hero journey patterns
    if (this.detectHeroJourneyPattern(content)) {
      this.createOrGetArc('hero_journey', 'character', 'Main Character Journey', chapters.length);
    }

    // Check for mystery patterns
    if (this.detectMysteryPattern(content)) {
      this.createOrGetArc('mystery', 'plot', 'Central Mystery', chapters.length);
    }

    // Check for romance patterns
    if (this.detectRomancePattern(content)) {
      this.createOrGetArc('romance', 'relationship', 'Romance Arc', chapters.length);
    }

    // Check for redemption patterns
    if (this.detectRedemptionPattern(content)) {
      this.createOrGetArc('redemption', 'character', 'Redemption Arc', chapters.length);
    }

    // Check for coming of age patterns
    if (this.detectComingOfAgePattern(content)) {
      this.createOrGetArc('coming_of_age', 'character', 'Coming of Age', chapters.length);
    }

    // Check for revenge patterns
    if (this.detectRevengePattern(content)) {
      this.createOrGetArc('revenge', 'plot', 'Revenge Arc', chapters.length);
    }
  }

  /**
   * Create or get existing arc
   */
  private createOrGetArc(
    modelType: string,
    type: NarrativeArc['type'],
    name: string,
    chapterNumber: number
  ): NarrativeArc {
    let arc = this.arcs.get(modelType);

    if (!arc) {
      const model = this.arcModels.get(modelType)!;
      arc = {
        id: modelType,
        type,
        name,
        description: `${name} narrative arc`,
        status: 'introduction',
        progress: 0,
        predictedBeats: this.generatePredictedBeats(model, chapterNumber),
        satisfactionScore: 0,
        chapterIntroduced: chapterNumber,
        estimatedCompletion: chapterNumber + model.duration.optimal
      };
      this.arcs.set(modelType, arc);
    }

    return arc;
  }

  /**
   * Generate predicted beats for an arc
   */
  private generatePredictedBeats(model: ArcModel, startChapter: number): ArcBeat[] {
    const beats: ArcBeat[] = [];
    const chapterIncrement = model.duration.optimal / model.pattern.length;

    model.pattern.forEach((patternName, index) => {
      const beatType = this.getBeatType(index, model.pattern.length);
      beats.push({
        sequence: index + 1,
        type: beatType,
        description: this.formatBeatDescription(patternName),
        predictedChapter: Math.round(startChapter + (index + 1) * chapterIncrement),
        fulfillment: 0
      });
    });

    return beats;
  }

  /**
   * Get beat type based on position in pattern
   */
  private getBeatType(index: number, totalBeats: number): ArcBeat['type'] {
    const position = index / totalBeats;
    
    if (position < 0.2) return 'setup';
    if (position < 0.5) return 'complication';
    if (position < 0.7) return 'climax';
    if (position < 0.9) return 'denouement';
    return 'resolution';
  }

  /**
   * Format beat description from pattern name
   */
  private formatBeatDescription(patternName: string): string {
    return patternName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Update arc progress based on current content
   */
  private async updateArcProgress(chapters: Chapter[], storyState: StoryState): Promise<void> {
    for (const [arcId, arc] of this.arcs) {
      const model = this.arcModels.get(arcId);
      if (!model) continue;

      // Check each beat against current content
      const currentContent = chapters.map(ch => ch.content).join(' ');

      for (const beat of arc.predictedBeats) {
        if (beat.fulfillment === 0) {
          const fulfillment = this.checkBeatFulfillment(beat, currentContent, model);
          beat.fulfillment = fulfillment;

          if (fulfillment >= 0.7) {
            beat.actualChapter = chapters.length;
          }
        }
      }

      // Calculate overall progress
      arc.progress = this.calculateArcProgress(arc.predictedBeats);

      // Update status
      arc.status = this.determineArcStatus(arc.progress);

      // Calculate satisfaction
      arc.satisfactionScore = this.calculateSatisfaction(arc, chapters.length);
    }
  }

  /**
   * Check how well a beat is fulfilled
   */
  private checkBeatFulfillment(beat: ArcBeat, content: string, model: ArcModel): number {
    const beatKeywords = this.getBeatKeywords(beat.description);
    let matches = 0;

    for (const keyword of beatKeywords) {
      if (content.toLowerCase().includes(keyword.toLowerCase())) {
        matches++;
      }
    }

    return Math.min(matches / Math.max(beatKeywords.length, 1), 1);
  }

  /**
   * Get keywords for a beat description
   */
  private getBeatKeywords(description: string): string[] {
    const keywordMap: Map<string, string[]> = new Map([
      ['Call To Adventure', ['adventure', 'call', 'summon', 'quest', 'mission', 'journey begins']],
      ['Refusal', ['refuse', 'reject', 'deny', 'hesitate', 'doubt']],
      ['Meeting Mentor', ['mentor', 'guide', 'teacher', 'wise', 'training']],
      ['Crossing Threshold', ['threshold', 'cross', 'enter', 'begin', 'step through']],
      ['Tests Allies Enemies', ['test', 'ally', 'enemy', 'challenge', 'trial']],
      ['Approach', ['approach', 'near', 'draw close', 'prepare']],
      ['Ordeal', ['ordeal', 'trial', 'battle', 'crisis', 'confrontation']],
      ['Reward', ['reward', 'prize', 'gain', 'treasure', 'victory']],
      ['Road Back', ['return', 'road back', 'journey home', 'head back']],
      ['Resurrection', ['resurrection', 'rebirth', 'transform', 'rise again']],
      ['Return', ['return', 'home', 'conclusion', 'end']],
      ['Crime Discovered', ['crime', 'discovered', 'found', 'mystery', 'investigation']],
      ['Investigation Begins', ['investigation', 'investigate', 'search', 'look into']],
      ['First Clue', ['clue', 'evidence', 'lead', 'trace', 'hint']],
      ['False Lead', ['false', 'wrong', 'mislead', 'decoy', 'red herring']],
      ['Breakthrough', ['breakthrough', 'discover', 'reveal', 'solve', 'found']],
      ['Suspect Identified', ['suspect', 'identified', 'caught', 'found']],
      ['Confrontation', ['confront', 'face', 'challenge', 'meet']],
      ['Resolution', ['resolution', 'resolved', 'solved', 'concluded', 'end']],
      ['First Meeting', ['first', 'meet', 'encounter', 'introduction']],
      ['Attraction', ['attracted', 'drawn', 'feelings', 'interested']],
      ['Obstacle', ['obstacle', 'problem', 'issue', 'barrier', 'challenge']],
      ['Deepening Connection', ['closer', 'connect', 'bond', 'relationship', 'grow']],
      ['Major Conflict', ['conflict', 'fight', 'argument', 'dispute', 'break up']],
      ['Separation', ['separate', 'apart', 'leave', 'distance']],
      ['Realization', ['realize', 'understand', 'know', 'recognize']],
      ['Reunion', ['reunite', 'together', 'reconcile', 'back together']],
      ['Commitment', ['commitment', 'promise', 'forever', 'love', 'marriage']],
      ['Fall', ['fall', 'downfall', 'decline', 'corruption', 'mistake']],
      ['Rock Bottom', ['bottom', 'lowest', 'despair', 'ruin']],
      ['Reflection', ['reflect', 'think', 'consider', 'contemplate']],
      ['Opportunity', ['opportunity', 'chance', 'hope', 'possibility']],
      ['Struggle', ['struggle', 'fight', 'try', 'effort', 'difficulty']],
      ['Sacrifice', ['sacrifice', 'give up', 'surrender', 'lose']],
      ['Redemption', ['redeemed', 'redemption', 'forgiven', 'atoned']],
      ['Innocence', ['innocent', 'young', 'naive', 'pure']],
      ['Inciting Incident', ['incident', 'event', 'happened', 'changed']],
      ['Challenge', ['challenge', 'difficult', 'hard', 'test']],
      ['Failure', ['fail', 'lose', 'defeat', 'mistake']],
      ['Growth', ['grow', 'learn', 'develop', 'mature']],
      ['Revelation', ['reveal', 'truth', 'secret', 'discovered']],
      ['Transformation', ['transform', 'change', 'become', 'evolve']],
      ['Acceptance', ['accept', 'embrace', 'adulthood', 'responsibility']],
      ['Wrong Suffered', ['wronged', 'betrayed', 'hurt', 'victim']],
      ['Vow', ['vow', 'promise', 'swear', 'oath']],
      ['Planning', ['plan', 'scheme', 'plot', 'strategize']],
      ['First Strike', ['strike', 'attack', 'first', 'initial']],
      ['Escalation', ['escalate', 'worse', 'intensify', 'increase']],
      ['Moral Conflict', ['moral', 'dilemma', 'conflicted', 'conscience']],
      ['Climax', ['climax', 'peak', 'final', 'confrontation']],
      ['Consequences', ['consequence', 'result', 'aftermath', 'fallout']],
      ['Aftermath', ['aftermath', 'end', 'over', 'done']],
      ['Discovery', ['discover', 'find', 'explore', 'new']],
      ['Exploration', ['explore', 'travel', 'journey', 'adventure']],
      ['Conflict Arises', ['conflict', 'arise', 'problem', 'issue']],
      ['Alliance Formed', ['alliance', 'ally', 'partner', 'join']],
      ['Crisis', ['crisis', 'emergency', 'disaster', 'critical']],
      ['New Equilibrium', ['new', 'balance', 'equilibrium', 'settled']]
    ]);

    return keywordMap.get(description) || [description.toLowerCase()];
  }

  /**
   * Calculate overall arc progress
   */
  private calculateArcProgress(beats: ArcBeat[]): number {
    if (beats.length === 0) return 0;
    
    const totalFulfillment = beats.reduce((sum, beat) => sum + beat.fulfillment, 0);
    return totalFulfillment / beats.length;
  }

  /**
   * Determine arc status based on progress
   */
  private determineArcStatus(progress: number): NarrativeArc['status'] {
    if (progress < 0.2) return 'introduction';
    if (progress < 0.5) return 'rising_action';
    if (progress < 0.7) return 'climax';
    if (progress < 0.9) return 'falling_action';
    return 'resolution';
  }

  /**
   * Calculate arc satisfaction score
   */
  private calculateSatisfaction(arc: NarrativeArc, currentChapter: number): number {
    const model = this.arcModels.get(arc.id);
    if (!model) return 0;

    // Check if beats are being hit at appropriate times
    let satisfaction = 0;
    let onTimeBeats = 0;

    for (const beat of arc.predictedBeats) {
      if (beat.fulfillment >= 0.7 && beat.actualChapter) {
        const timingDiff = Math.abs(beat.actualChapter - beat.predictedChapter);
        if (timingDiff <= 2) {
          onTimeBeats++;
        }
      }
    }

    const fulfilledBeats = arc.predictedBeats.filter(b => b.fulfillment >= 0.7).length;
    if (fulfilledBeats > 0) {
      satisfaction = onTimeBeats / fulfilledBeats;
    }

    return satisfaction;
  }

  /**
   * Generate predictions for future arcs
   */
  private async generatePredictions(chapters: Chapter[], storyState: StoryState): Promise<void> {
    for (const [arcId, arc] of this.arcs) {
      const model = this.arcModels.get(arcId);
      if (!model) continue;

      const prediction: ArcPrediction = {
        arcId,
        confidence: this.calculatePredictionConfidence(arc),
        predictedProgression: this.predictProgression(arc, model),
        recommendedNextBeats: this.getRecommendedNextBeats(arc),
        predictedTensionCurve: this.predictTensionCurve(arc, model),
        predictedCompletion: arc.estimatedCompletion,
        alternativePaths: this.generateAlternativePaths(arc, model)
      };

      this.predictions.set(arcId, prediction);
    }
  }

  /**
   * Calculate prediction confidence
   */
  private calculatePredictionConfidence(arc: NarrativeArc): number {
    // Confidence increases as more beats are fulfilled
    const fulfilledBeats = arc.predictedBeats.filter(b => b.fulfillment >= 0.7).length;
    const totalBeats = arc.predictedBeats.length;
    
    // Base confidence on pattern matching
    const patternMatch = fulfilledBeats / totalBeats;
    
    // Adjust for timing
    const timingBonus = arc.satisfactionScore * 0.2;
    
    return Math.min(patternMatch + timingBonus, 1.0);
  }

  /**
   * Predict progression of the arc
   */
  private predictProgression(arc: NarrativeArc, model: ArcModel): string[] {
    const progression: string[] = [];
    const currentBeatIndex = arc.predictedBeats.findIndex(b => b.fulfillment < 0.5);

    if (currentBeatIndex !== -1) {
      // Add upcoming beats
      for (let i = currentBeatIndex; i < Math.min(currentBeatIndex + 3, arc.predictedBeats.length); i++) {
        progression.push(arc.predictedBeats[i].description);
      }
    }

    return progression;
  }

  /**
   * Get recommended next beats
   */
  private getRecommendedNextBeats(arc: NarrativeArc): ArcBeat[] {
    const unfulfilledBeats = arc.predictedBeats.filter(b => b.fulfillment < 0.5);
    return unfulfilledBeats.slice(0, 3);
  }

  /**
   * Predict tension curve
   */
  private predictTensionCurve(arc: NarrativeArc, model: ArcModel): number[] {
    const modelTension = [...model.tensionProfile];
    const currentProgress = arc.progress;
    const currentIndex = Math.floor(currentProgress * modelTension.length);

    // Return tension curve from current point forward
    return modelTension.slice(currentIndex);
  }

  /**
   * Generate alternative paths
   */
  private generateAlternativePaths(arc: NarrativeArc, model: ArcModel): string[] {
    const paths: string[] = [];

    // Suggest alternative outcomes based on current state
    if (arc.progress < 0.5) {
      paths.push('Arc could take a darker turn with unexpected complications');
      paths.push('Supporting character could become pivotal to arc resolution');
    } else {
      paths.push('Subversion possible with twist ending');
      paths.push('Quick resolution possible within few chapters');
    }

    return paths;
  }

  /**
   * Track tension across chapters
   */
  private trackTension(chapters: Chapter[], options: StoryGenerationOptions): void {
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      const tension = this.calculateChapterTension(chapter, options);
      this.tensionHistory.set(i + 1, tension);
    }
  }

  /**
   * Calculate tension for a chapter
   */
  private calculateChapterTension(chapter: Chapter, options: StoryGenerationOptions): number {
    let tension = options.tension || 0.5;

    // Adjust based on content analysis
    const content = chapter.content.toLowerCase();

    // High tension indicators
    const highTensionWords = ['battle', 'fight', 'danger', 'death', 'kill', 'escape', 'crisis', 'emergency'];
    for (const word of highTensionWords) {
      if (content.includes(word)) {
        tension += 0.05;
      }
    }

    // Low tension indicators
    const lowTensionWords = ['peace', 'rest', 'calm', 'safe', 'relax', 'settled'];
    for (const word of lowTensionWords) {
      if (content.includes(word)) {
        tension -= 0.05;
      }
    }

    return Math.max(0, Math.min(1, tension));
  }

  // Pattern detection methods

  private detectHeroJourneyPattern(content: string): boolean {
    const indicators = ['quest', 'journey', 'adventure', 'hero', 'mentor', 'challenge'];
    let matches = 0;
    for (const indicator of indicators) {
      if (content.toLowerCase().includes(indicator)) matches++;
    }
    return matches >= 3;
  }

  private detectMysteryPattern(content: string): boolean {
    const indicators = ['mystery', 'clue', 'investigation', 'suspect', 'crime', 'detective', 'solve'];
    let matches = 0;
    for (const indicator of indicators) {
      if (content.toLowerCase().includes(indicator)) matches++;
    }
    return matches >= 3;
  }

  private detectRomancePattern(content: string): boolean {
    const indicators = ['love', 'romance', 'heart', 'kiss', 'passion', 'together', 'feelings'];
    let matches = 0;
    for (const indicator of indicators) {
      if (content.toLowerCase().includes(indicator)) matches++;
    }
    return matches >= 3;
  }

  private detectRedemptionPattern(content: string): boolean {
    const indicators = ['redemption', 'forgive', 'atone', 'mistake', 'second chance', 'change', 'wrong'];
    let matches = 0;
    for (const indicator of indicators) {
      if (content.toLowerCase().includes(indicator)) matches++;
    }
    return matches >= 3;
  }

  private detectComingOfAgePattern(content: string): boolean {
    const indicators = ['grow', 'learn', 'mature', 'adult', 'responsibility', 'change', 'understand'];
    let matches = 0;
    for (const indicator of indicators) {
      if (content.toLowerCase().includes(indicator)) matches++;
    }
    return matches >= 3;
  }

  private detectRevengePattern(content: string): boolean {
    const indicators = ['revenge', 'vengeance', 'avenge', 'payback', 'retribution', 'justice'];
    let matches = 0;
    for (const indicator of indicators) {
      if (content.toLowerCase().includes(indicator)) matches++;
    }
    return matches >= 3;
  }

  /**
   * Get recommended arc for next chapter
   */
  getRecommendedArc(): { arc: NarrativeArc; prediction: ArcPrediction } | null {
    let bestArc: NarrativeArc | null = null;
    let bestPrediction: ArcPrediction | null = null;
    let highestNeed = -1;

    for (const [arcId, arc] of this.arcs) {
      const prediction = this.predictions.get(arcId);
      if (!prediction) continue;

      // Calculate "need" score - arcs that haven't been advanced recently
      const needScore = this.calculateArcNeedScore(arc);
      
      if (needScore > highestNeed) {
        highestNeed = needScore;
        bestArc = arc;
        bestPrediction = prediction;
      }
    }

    if (bestArc && bestPrediction) {
      return { arc: bestArc, prediction: bestPrediction };
    }

    return null;
  }

  /**
   * Calculate how much an arc needs attention
   */
  private calculateArcNeedScore(arc: NarrativeArc): number {
    // Priority to arcs that are active but not recently advanced
    if (arc.status === 'resolution') return 0;
    
    // Calculate based on progress and status
    let score = 0;
    
    // Higher priority for arcs in rising action or climax
    if (arc.status === 'rising_action') score += 0.3;
    if (arc.status === 'climax') score += 0.5;
    
    // Factor in how long since last beat fulfillment
    const lastFulfilledBeat = [...arc.predictedBeats]
      .reverse()
      .find(b => b.fulfillment >= 0.7);
    
    if (lastFulfilledBeat) {
      const chaptersSince = this.currentChapter - (lastFulfilledBeat.actualChapter || 0);
      score += Math.min(chaptersSince * 0.1, 0.3);
    } else {
      score += 0.2; // No beats fulfilled yet
    }
    
    return score;
  }

  /**
   * Get tension curve for story
   */
  getTensionCurve(): number[] {
    const curve: number[] = [];
    for (let i = 1; i <= this.currentChapter; i++) {
      curve.push(this.tensionHistory.get(i) || 0.5);
    }
    return curve;
  }

  /**
   * Get all arcs
   */
  getAllArcs(): NarrativeArc[] {
    return Array.from(this.arcs.values());
  }

  /**
   * Get all predictions
   */
  getAllPredictions(): ArcPrediction[] {
    return Array.from(this.predictions.values());
  }

  /**
   * Export arc state
   */
  exportState(): { arcs: NarrativeArc[]; predictions: ArcPrediction[]; tensionCurve: number[] } {
    return {
      arcs: this.getAllArcs(),
      predictions: this.getAllPredictions(),
      tensionCurve: this.getTensionCurve()
    };
  }

  /**
   * Reset system
   */
  reset(): void {
    this.arcs.clear();
    this.predictions.clear();
    this.tensionHistory.clear();
    this.currentChapter = 0;
  }
  /**
   * Set cross-system dependencies for PredictiveArcModeling
   * This allows the system to consult with character, world, and arc systems
   */
  setDependencies(dependencies: {
    characterGenome?: any;
    worldSimulation?: any;
    crossArcEngine?: any;
  }): void {
    this.characterGenome = dependencies.characterGenome;
    this.worldSimulation = dependencies.worldSimulation;
    this.crossArcEngine = dependencies.crossArcEngine;
  }

  /**
   * Get system status including cross-system connectivity
   */
  getSystemStatus(): {
    activeArcs: number;
    activePredictions: number;
    connectedSystems: string[];
  } {
    const connectedSystems: string[] = [];
    if (this.characterGenome) connectedSystems.push('characterGenome');
    if (this.worldSimulation) connectedSystems.push('worldSimulation');
    if (this.crossArcEngine) connectedSystems.push('crossArcEngine');

    return {
      activeArcs: this.arcs.size,
      activePredictions: this.predictions.size,
      connectedSystems
    };
  }
}
