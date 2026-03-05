/**
 * CharacterContinuityGenome - Character Coherence System
 * 
 * Ensures character consistency and evolution across chapters:
 * - Tracks character traits, history, and development
 * - Maintains character relationships and interactions
 * - Detects character inconsistencies
 * - Manages character arc progression
 * - Provides character continuity validation
 */

import type { Chapter, Character, StoryState } from '../types';
import type { StoryGenerationOptions } from '../types';

interface CharacterGenome {
  characterId: string;
  name: string;
  traits: TraitSet;
  history: CharacterHistory;
  relationships: Map<string, Relationship>;
  arc: CharacterArc;
  state: CharacterState;
  development: DevelopmentTrack;
  dna: CharacterDNA;
  consistencyScore: number;
}

interface TraitSet {
  personality: PersonalityTraits;
  physical: PhysicalTraits;
  skills: SkillSet;
  values: string[];
  fears: string[];
  desires: string[];
  quirks: string[];
  speechPatterns: string[];
}

interface PersonalityTraits {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  dominantTraits: string[];
}

interface PhysicalTraits {
  appearance: Map<string, string>;
  age: number;
  species: string;
  notableFeatures: string[];
  changes: AppearanceChange[];
}

interface AppearanceChange {
  chapter: number;
  description: string;
  reason: string;
}

interface SkillSet {
  known: Map<string, SkillLevel>;
  learning: Map<string, number>;
  forgotten: string[];
}

interface SkillLevel {
  level: number;
  experience: number;
  source: string;
  lastUsed: number;
}

interface CharacterHistory {
  events: TimelineEvent[];
  decisions: DecisionRecord[];
  developmentMilestones: Milestone[];
  chapterAppearances: number[];
  keyInteractions: Interaction[];
}

interface TimelineEvent {
  chapter: number;
  type: 'appearance' | 'action' | 'decision' | 'change' | 'relationship' | 'discovery';
  description: string;
  impact: number;
  consequences: string[];
}

interface DecisionRecord {
  chapter: number;
  decision: string;
  reasoning: string;
  outcome: string;
  characterImpact: number;
}

interface Milestone {
  chapter: number;
  type: 'growth' | 'setback' | 'revelation' | 'transformation' | 'choice';
  description: string;
  before: string;
  after: string;
}

interface Interaction {
  chapter: number;
  with: string;
  type: 'dialogue' | 'conflict' | 'alliance' | 'romance' | 'betrayal' | 'support';
  outcome: string;
  impact: number;
}

interface Relationship {
  characterId: string;
  type: 'family' | 'friend' | 'enemy' | 'lover' | 'rival' | 'ally' | 'neutral';
  strength: number;
  trust: number;
  history: RelationshipEvent[];
  currentStatus: string;
  evolution: number[];
}

interface RelationshipEvent {
  chapter: number;
  event: string;
  change: number;
}

interface CharacterArc {
  type: 'hero' | 'villain' | 'growth' | 'fall' | 'redemption' | 'tragedy';
  stage: 'setup' | 'development' | 'climax' | 'resolution';
  progress: number;
  keyMoments: KeyMoment[];
  expectedResolution: number;
  satisfactionScore: number;
}

interface KeyMoment {
  chapter: number;
  type: string;
  description: string;
  significance: number;
}

interface CharacterState {
  location: string;
  condition: ConditionState;
  mood: string;
  motivation: string;
  shortTermGoals: string[];
  longTermGoals: string[];
  secrets: string[];
  knowledge: string[];
}

interface ConditionState {
  health: number;
  energy: number;
  mental: number;
  injuries: Injury[];
  conditions: string[];
}

interface Injury {
  description: string;
  chapterReceived: number;
  healingProgress: number;
  permanent: boolean;
}

interface DevelopmentTrack {
  personalityChanges: ChangeRecord[];
  skillProgression: ChangeRecord[];
  relationshipEvolution: ChangeRecord[];
  traitEvolution: Map<string, number[]>;
}

interface ChangeRecord {
  chapter: number;
  before: string;
  after: string;
  reason: string;
}

interface CharacterDNA {
  coreIdentity: string;
  drivingForce: string;
  coreConflict: string;
  primaryFlaw: string;
  hiddenStrength: string;
  definingMoment: string;
  narrativeRole: string;
}

interface ContinuityIssue {
  characterId: string;
  type: 'trait_violation' | 'knowledge_gap' | 'relationship_inconsistency' | 'timeline_error' | 'state_mismatch';
  severity: 'low' | 'medium' | 'high';
  chapter: number;
  description: string;
  expectedValue: string;
  actualValue: string;
  suggestedFix: string;
}

export class CharacterContinuityGenome {
  private genomes: Map<string, CharacterGenome> = new Map();
  private issues: ContinuityIssue[] = [];
  private currentChapter: number = 0;

  /**
   * Register a new character with their genome
   */
  registerCharacter(
    characterId: string,
    name: string,
    options: {
      personality?: Partial<PersonalityTraits>;
      physical?: Partial<PhysicalTraits>;
      skills?: Record<string, number>;
      values?: string[];
      fears?: string[];
      desires?: string[];
      quirks?: string[];
      arcType?: CharacterArc['type'];
      dna?: Partial<CharacterDNA>;
    } = {}
  ): CharacterGenome {
    const genome: CharacterGenome = {
      characterId,
      name,
      traits: {
        personality: {
          openness: options.personality?.openness ?? 0.5,
          conscientiousness: options.personality?.conscientiousness ?? 0.5,
          extraversion: options.personality?.extraversion ?? 0.5,
          agreeableness: options.personality?.agreeableness ?? 0.5,
          neuroticism: options.personality?.neuroticism ?? 0.5,
          dominantTraits: options.personality?.dominantTraits ?? []
        },
        physical: {
          appearance: new Map(Object.entries(options.physical?.appearance ?? {})),
          age: options.physical?.age ?? 25,
          species: options.physical?.species ?? 'human',
          notableFeatures: options.physical?.notableFeatures ?? [],
          changes: []
        },
        skills: {
          known: new Map(
            Object.entries(options.skills ?? {}).map(([skill, level]) => [
              skill,
              { level, experience: 0, source: 'background', lastUsed: 0 }
            ])
          ),
          learning: new Map(),
          forgotten: []
        },
        values: options.values ?? [],
        fears: options.fears ?? [],
        desires: options.desires ?? [],
        quirks: options.quirks ?? [],
        speechPatterns: []
      },
      history: {
        events: [],
        decisions: [],
        developmentMilestones: [],
        chapterAppearances: [],
        keyInteractions: []
      },
      relationships: new Map(),
      arc: {
        type: options.arcType ?? 'growth',
        stage: 'setup',
        progress: 0,
        keyMoments: [],
        expectedResolution: 50,
        satisfactionScore: 0
      },
      state: {
        location: 'unknown',
        condition: {
          health: 100,
          energy: 100,
          mental: 100,
          injuries: [],
          conditions: []
        },
        mood: 'neutral',
        motivation: '',
        shortTermGoals: [],
        longTermGoals: [],
        secrets: [],
        knowledge: []
      },
      development: {
        personalityChanges: [],
        skillProgression: [],
        relationshipEvolution: [],
        traitEvolution: new Map()
      },
      dna: {
        coreIdentity: options.dna?.coreIdentity ?? name,
        drivingForce: options.dna?.drivingForce ?? 'survival',
        coreConflict: options.dna?.coreConflict ?? 'internal struggle',
        primaryFlaw: options.dna?.primaryFlaw ?? 'pride',
        hiddenStrength: options.dna?.hiddenStrength ?? 'resilience',
        definingMoment: options.dna?.definingMoment ?? '',
        narrativeRole: options.dna?.narrativeRole ?? 'protagonist'
      },
      consistencyScore: 100
    };

    this.genomes.set(characterId, genome);
    return genome;
  }

  /**
   * Update character from chapter content
   */
  async updateFromChapter(
    chapter: Chapter,
    characters: Map<string, Character>
  ): Promise<ContinuityIssue[]> {
    this.currentChapter = chapter.chapterNumber;

    // Extract character mentions and actions
    const mentions = this.extractCharacterMentions(chapter.content);

    for (const mention of mentions) {
      const genome = this.genomes.get(mention.characterId);
      if (!genome) continue;

      // Update chapter appearance
      genome.history.chapterAppearances.push(chapter.chapterNumber);

      // Update state
      this.updateCharacterState(genome, mention, chapter.content);

      // Check for inconsistencies
      this.checkConsistency(genome, mention, chapter.chapterNumber);

      // Update arc progress
      this.updateArcProgress(genome, chapter.chapterNumber);
    }

    // Update relationships
    await this.updateRelationships(chapter, characters);

    return this.issues.filter(issue => issue.chapter === chapter.chapterNumber);
  }

  /**
   * Extract character mentions from content
   */
  private extractCharacterMentions(content: string): Array<{
    characterId: string;
    name: string;
    actions: string[];
    dialogue: string[];
    emotions: string[];
  }> {
    const mentions: Array<{
      characterId: string;
      name: string;
      actions: string[];
      dialogue: string[];
      emotions: string[];
    }> = [];

    for (const [id, genome] of this.genomes) {
      const namePattern = new RegExp(genome.name, 'gi');
      const matches = content.match(namePattern);

      if (matches) {
        mentions.push({
          characterId: id,
          name: genome.name,
          actions: this.extractActions(content, genome.name),
          dialogue: this.extractDialogue(content, genome.name),
          emotions: this.extractEmotions(content, genome.name)
        });
      }
    }

    return mentions;
  }

  /**
   * Extract actions for a character
   */
  private extractActions(content: string, characterName: string): string[] {
    const actions: string[] = [];
    const actionPattern = new RegExp(`${characterName}\\s+([^.!?]+)`, 'gi');
    let match;

    while ((match = actionPattern.exec(content)) !== null) {
      if (match[1] && match[1].length < 100) {
        actions.push(match[1].trim());
      }
    }

    return actions;
  }

  /**
   * Extract dialogue for a character
   */
  private extractDialogue(content: string, characterName: string): string[] {
    const dialogue: string[] = [];
    const dialoguePattern = new RegExp(`${characterName}[^"]*"([^"]+)"`, 'gi');
    let match;

    while ((match = dialoguePattern.exec(content)) !== null) {
      if (match[1]) {
        dialogue.push(match[1]);
      }
    }

    return dialogue;
  }

  /**
   * Extract emotions for a character
   */
  private extractEmotions(content: string, characterName: string): string[] {
    const emotions: string[] = [];
    const emotionWords = ['felt', 'felt like', 'experienced', 'overwhelmed with'];
    
    for (const emotion of emotionWords) {
      const pattern = new RegExp(`${characterName}\\s+${emotion}\\s+([^.!?]+)`, 'gi');
      const match = pattern.exec(content);
      if (match && match[1]) {
        emotions.push(match[1].trim());
      }
    }

    return emotions;
  }

  /**
   * Update character state from mention
   */
  private updateCharacterState(
    genome: CharacterGenome,
    mention: { characterId: string; name: string; actions: string[]; dialogue: string[]; emotions: string[] },
    content: string
  ): void {
    // Update location
    const location = this.inferLocation(content, mention.name);
    if (location) {
      genome.state.location = location;
    }

    // Update mood from emotions
    if (mention.emotions.length > 0) {
      genome.state.mood = mention.emotions[0];
    }

    // Update knowledge from actions
    for (const action of mention.actions) {
      this.updateKnowledge(genome, action);
    }

    // Record event
    genome.history.events.push({
      chapter: this.currentChapter,
      type: 'action',
      description: mention.actions.slice(0, 3).join('; '),
      impact: mention.actions.length > 3 ? 0.5 : 0.2,
      consequences: []
    });
  }

  /**
   * Infer location from content
   */
  private inferLocation(content: string, characterName: string): string | null {
    const locationPatterns = [
      /(?:at|in|near|inside)\s+(?:the\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g
    ];

    for (const pattern of locationPatterns) {
      const match = pattern.exec(content);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Update character knowledge
   */
  private updateKnowledge(genome: CharacterGenome, action: string): void {
    const knowledgeIndicators = ['learned', 'discovered', 'realized', 'understood', 'found'];
    
    for (const indicator of knowledgeIndicators) {
      if (action.toLowerCase().includes(indicator)) {
        const knowledge = action.substring(action.toLowerCase().indexOf(indicator) + indicator.length).trim();
        if (!genome.state.knowledge.includes(knowledge)) {
          genome.state.knowledge.push(knowledge);
        }
      }
    }
  }

  /**
   * Check for consistency issues
   */
  private checkConsistency(
    genome: CharacterGenome,
    mention: { characterId: string; name: string; actions: string[]; dialogue: string[]; emotions: string[] },
    chapterNumber: number
  ): void {
    // Check trait violations
    this.checkTraitViolations(genome, mention, chapterNumber);

    // Check knowledge gaps
    this.checkKnowledgeGaps(genome, mention, chapterNumber);

    // Check state consistency
    this.checkStateConsistency(genome, mention, chapterNumber);

    // Update consistency score
    this.updateConsistencyScore(genome);
  }

  /**
   * Check for trait violations
   */
  private checkTraitViolations(
    genome: CharacterGenome,
    mention: { characterId: string; name: string; actions: string[]; dialogue: string[]; emotions: string[] },
    chapterNumber: number
  ): void {
    // Check if actions contradict values
    for (const action of mention.actions) {
      for (const fear of genome.traits.fears) {
        if (action.toLowerCase().includes(fear.toLowerCase()) && 
            !this.isJustifiedAction(genome, action, 'fear')) {
          this.issues.push({
            characterId: genome.characterId,
            type: 'trait_violation',
            severity: 'medium',
            chapter: chapterNumber,
            description: `Character ${genome.name} acted against their fear of ${fear}`,
            expectedValue: `Avoidance of ${fear} or justified action`,
            actualValue: action,
            suggestedFix: `Add context explaining why ${genome.name} confronts their fear`
          });
        }
      }
    }

    // Check personality consistency
    const actionTone = this.analyzeActionTone(mention.actions);
    const personalityMismatch = this.calculatePersonalityMismatch(actionTone, genome.traits.personality);
    
    if (personalityMismatch > 0.3) {
      this.issues.push({
        characterId: genome.characterId,
        type: 'trait_violation',
        severity: 'low',
        chapter: chapterNumber,
        description: `${genome.name}'s behavior seems inconsistent with their personality`,
        expectedValue: `Behavior aligned with ${genome.traits.personality.dominantTraits.join(', ')}`,
        actualValue: actionTone,
        suggestedFix: 'Provide character development context or adjust behavior'
      });
    }
  }

  /**
   * Check if action is justified
   */
  private isJustifiedAction(genome: CharacterGenome, action: string, type: string): boolean {
    // Check for justification markers in recent history
    const recentEvents = genome.history.events.slice(-5);
    return recentEvents.some(event => 
      event.consequences.some(c => c.toLowerCase().includes(action.toLowerCase()))
    );
  }

  /**
   * Analyze tone of actions
   */
  private analyzeActionTone(actions: string[]): string {
    const tones: string[] = [];
    const toneWords: Record<string, string[]> = {
      aggressive: ['attacked', 'shouted', 'fought', 'charged', 'confronted'],
      passive: ['waited', 'observed', 'avoided', 'hesitated'],
      friendly: ['helped', 'smiled', 'supported', 'encouraged'],
      hostile: ['insulted', 'threatened', 'mocked', 'sabotaged'],
      neutral: ['walked', 'said', 'looked', 'went']
    };

    for (const action of actions) {
      for (const [tone, words] of Object.entries(toneWords)) {
        if (words.some(w => action.toLowerCase().includes(w))) {
          tones.push(tone);
        }
      }
    }

    // Return most common tone
    if (tones.length === 0) return 'neutral';
    
    const counts = new Map<string, number>();
    for (const tone of tones) {
      counts.set(tone, (counts.get(tone) || 0) + 1);
    }
    
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }

  /**
   * Calculate personality mismatch
   */
  private calculatePersonalityMismatch(actionTone: string, personality: PersonalityTraits): number {
    const tonePersonalityMap: Record<string, Partial<PersonalityTraits>> = {
      aggressive: { agreeableness: 0.3, neuroticism: 0.6 },
      passive: { extraversion: 0.3, agreeableness: 0.6 },
      friendly: { agreeableness: 0.7, extraversion: 0.6 },
      hostile: { agreeableness: 0.2, neuroticism: 0.7 },
      neutral: {}
    };

    const expected = tonePersonalityMap[actionTone] || {};
    let mismatch = 0;
    let count = 0;

    for (const [trait, value] of Object.entries(expected)) {
      const actualValue = personality[trait as keyof PersonalityTraits];
      if (typeof actualValue === 'number') {
        mismatch += Math.abs(actualValue - (value as number));
        count++;
      }
    }

    return count > 0 ? mismatch / count : 0;
  }

  /**
   * Check for knowledge gaps
   */
  private checkKnowledgeGaps(
    genome: CharacterGenome,
    mention: { characterId: string; name: string; actions: string[]; dialogue: string[]; emotions: string[] },
    chapterNumber: number
  ): void {
    // Check if character references knowledge they shouldn't have
    for (const dialogue of mention.dialogue) {
      const secretsReferenced = genome.state.secrets.filter(s => 
        dialogue.toLowerCase().includes(s.toLowerCase())
      );

      // Character shouldn't reference their own secrets casually
      if (secretsReferenced.length > 0) {
        this.issues.push({
          characterId: genome.characterId,
          type: 'knowledge_gap',
          severity: 'low',
          chapter: chapterNumber,
          description: `${genome.name} casually references information that should be secret`,
          expectedValue: 'Guarded or secretive behavior',
          actualValue: `Open reference to: ${secretsReferenced.join(', ')}`,
          suggestedFix: 'Add context for why character reveals this secret'
        });
      }
    }
  }

  /**
   * Check state consistency
   */
  private checkStateConsistency(
    genome: CharacterGenome,
    mention: { characterId: string; name: string; actions: string[]; dialogue: string[]; emotions: string[] },
    chapterNumber: number
  ): void {
    // Check condition vs actions
    if (genome.state.condition.health < 30) {
      const strenuousActions = mention.actions.filter(a => 
        ['ran', 'fought', 'climbed', 'swam', 'attacked'].some(w => a.toLowerCase().includes(w))
      );

      if (strenuousActions.length > 0) {
        this.issues.push({
          characterId: genome.characterId,
          type: 'state_mismatch',
          severity: 'high',
          chapter: chapterNumber,
          description: `${genome.name} performs strenuous actions despite low health (${genome.state.condition.health}%)`,
          expectedValue: 'Limited activity or rest',
          actualValue: `Actions: ${strenuousActions.join(', ')}`,
          suggestedFix: 'Add difficulty/negative consequences or improve health first'
        });
      }
    }

    // Check injuries
    for (const injury of genome.state.condition.injuries) {
      if (injury.healingProgress < 100 && !injury.permanent) {
        const injuryImpact = this.calculateInjuryImpact(injury);
        if (injuryImpact > 0.5 && mention.actions.length > 5) {
          this.issues.push({
            characterId: genome.characterId,
            type: 'state_mismatch',
            severity: 'medium',
            chapter: chapterNumber,
            description: `${genome.name} acts as if uninjured despite: ${injury.description}`,
            expectedValue: 'Impeded or modified behavior',
            actualValue: 'Normal activity',
            suggestedFix: 'Account for injury impact on actions'
          });
        }
      }
    }
  }

  /**
   * Calculate injury impact
   */
  private calculateInjuryImpact(injury: Injury): number {
    const severityIndicators = ['severe', 'critical', 'major', 'serious'];
    return severityIndicators.some(s => injury.description.toLowerCase().includes(s)) ? 0.8 : 0.4;
  }

  /**
   * Update consistency score
   */
  private updateConsistencyScore(genome: CharacterGenome): void {
    const recentIssues = this.issues.filter(
      issue => issue.characterId === genome.characterId && 
      issue.chapter >= this.currentChapter - 5
    );

    const severityWeights = { low: 1, medium: 3, high: 5 };
    const totalPenalty = recentIssues.reduce(
      (sum, issue) => sum + severityWeights[issue.severity],
      0
    );

    genome.consistencyScore = Math.max(0, 100 - totalPenalty * 2);
  }

  /**
   * Update arc progress
   */
  private updateArcProgress(genome: CharacterGenome, chapterNumber: number): void {
    // Calculate progress based on events and milestones
    const eventCount = genome.history.events.length;
    const milestoneCount = genome.history.developmentMilestones.length;

    const arcProgress = Math.min(eventCount / 10 + milestoneCount * 0.1, 1);

    genome.arc.progress = arcProgress;

    // Update stage
    if (arcProgress < 0.25) {
      genome.arc.stage = 'setup';
    } else if (arcProgress < 0.5) {
      genome.arc.stage = 'development';
    } else if (arcProgress < 0.75) {
      genome.arc.stage = 'climax';
    } else {
      genome.arc.stage = 'resolution';
    }

    // Update satisfaction score
    const issues = this.issues.filter(i => i.characterId === genome.characterId);
    genome.arc.satisfactionScore = Math.max(0, 100 - issues.length * 5);
  }

  /**
   * Update relationships from chapter
   */
  private async updateRelationships(
    chapter: Chapter,
    characters: Map<string, Character>
  ): Promise<void> {
    const content = chapter.content;

    // Extract character pairs and their interactions
    const characterList = Array.from(this.genomes.keys());
    
    for (let i = 0; i < characterList.length; i++) {
      for (let j = i + 1; j < characterList.length; j++) {
        const char1 = this.genomes.get(characterList[i])!;
        const char2 = this.genomes.get(characterList[j])!;

        // Check if both appear in chapter
        if (content.includes(char1.name) && content.includes(char2.name)) {
          this.updateRelationshipFromInteraction(char1, char2, content, chapter.chapterNumber);
        }
      }
    }
  }

  /**
   * Update relationship from interaction
   */
  private updateRelationshipFromInteraction(
    char1: CharacterGenome,
    char2: CharacterGenome,
    content: string,
    chapterNumber: number
  ): void {
    // Get or create relationship
    let relationship = char1.relationships.get(char2.characterId);
    if (!relationship) {
      relationship = {
        characterId: char2.characterId,
        type: 'neutral',
        strength: 0.5,
        trust: 0.5,
        history: [],
        currentStatus: 'acquaintance',
        evolution: [0.5]
      };
      char1.relationships.set(char2.characterId, relationship);
    }

    // Analyze interaction
    const interactionType = this.determineInteractionType(content, char1.name, char2.name);
    const impact = this.calculateInteractionImpact(interactionType);

    // Update relationship
    relationship.strength = Math.max(0, Math.min(1, relationship.strength + impact.strength));
    relationship.trust = Math.max(0, Math.min(1, relationship.trust + impact.trust));
    relationship.type = interactionType.relationshipType;
    relationship.history.push({
      chapter: chapterNumber,
      event: interactionType.description,
      change: impact.strength
    });
    relationship.evolution.push(relationship.strength);

    // Record in history
    char1.history.keyInteractions.push({
      chapter: chapterNumber,
      with: char2.name,
      type: interactionType.type,
      outcome: interactionType.description,
      impact: impact.strength
    });
  }

  /**
   * Determine interaction type
   */
  private determineInteractionType(
    content: string,
    char1Name: string,
    char2Name: string
  ): { type: Interaction['type']; description: string; relationshipType: Relationship['type'] } {
    const interactionPatterns = [
      { pattern: /fought|attacked|argued|confronted/i, type: 'conflict' as const, relationshipType: 'enemy' as const },
      { pattern: /helped|supported|protected|saved/i, type: 'support' as const, relationshipType: 'ally' as const },
      { pattern: /kissed|loved|embraced|romanced/i, type: 'romance' as const, relationshipType: 'lover' as const },
      { pattern: /betrayed|deceived|tricked|stabbed/i, type: 'betrayal' as const, relationshipType: 'enemy' as const },
      { pattern: /agreed|aligned|teamed|partnered/i, type: 'alliance' as const, relationshipType: 'ally' as const }
    ];

    // Find context around both character names
    const bothNamesPattern = new RegExp(`${char1Name}[^.]*${char2Name}|${char2Name}[^.]*${char1Name}`, 'gi');
    const matches = content.match(bothNamesPattern) || [];
    const context = matches.join(' ');

    for (const { pattern, type, relationshipType } of interactionPatterns) {
      if (pattern.test(context)) {
        return {
          type,
          description: `${char1Name} ${type} with ${char2Name}`,
          relationshipType
        };
      }
    }

    return {
      type: 'dialogue',
      description: `${char1Name} interacted with ${char2Name}`,
      relationshipType: 'neutral'
    };
  }

  /**
   * Calculate interaction impact
   */
  private calculateInteractionImpact(interactionType: { type: Interaction['type']; description: string; relationshipType: Relationship['type'] }): { strength: number; trust: number } {
    const impacts: Record<Interaction['type'], { strength: number; trust: number }> = {
      dialogue: { strength: 0.05, trust: 0.05 },
      conflict: { strength: -0.1, trust: -0.15 },
      alliance: { strength: 0.15, trust: 0.1 },
      romance: { strength: 0.2, trust: 0.15 },
      betrayal: { strength: -0.2, trust: -0.3 },
      support: { strength: 0.1, trust: 0.15 }
    };

    return impacts[interactionType.type] || { strength: 0, trust: 0 };
  }

  /**
   * Get character genome
   */
  getGenome(characterId: string): CharacterGenome | undefined {
    return this.genomes.get(characterId);
  }

  /**
   * Get all genomes
   */
  getAllGenomes(): CharacterGenome[] {
    return Array.from(this.genomes.values());
  }

  /**
   * Get all issues
   */
  getIssues(): ContinuityIssue[] {
    return [...this.issues];
  }

  /**
   * Get issues for specific character
   */
  getCharacterIssues(characterId: string): ContinuityIssue[] {
    return this.issues.filter(issue => issue.characterId === characterId);
  }

  /**
   * Get relationship between characters
   */
  getRelationship(char1Id: string, char2Id: string): Relationship | undefined {
    const genome = this.genomes.get(char1Id);
    return genome?.relationships.get(char2Id);
  }

  /**
   * Get character arc progress
   */
  getArcProgress(characterId: string): number {
    return this.genomes.get(characterId)?.arc.progress ?? 0;
  }

  /**
   * Validate character action
   */
  validateAction(characterId: string, action: string): { valid: boolean; issues: string[] } {
    const genome = this.genomes.get(characterId);
    if (!genome) {
      return { valid: false, issues: ['Character not found'] };
    }

    const issues: string[] = [];

    // Check against fears
    for (const fear of genome.traits.fears) {
      if (action.toLowerCase().includes(fear.toLowerCase())) {
        issues.push(`Action conflicts with fear of ${fear}`);
      }
    }

    // Check against condition
    if (genome.state.condition.health < 30) {
      const strenuousWords = ['run', 'fight', 'climb', 'attack'];
      if (strenuousWords.some(w => action.toLowerCase().includes(w))) {
        issues.push(`Character has low health (${genome.state.condition.health}%)`);
      }
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * Export all genomes
   */
  exportGenomes(): CharacterGenome[] {
    return Array.from(this.genomes.values());
  }

  /**
   * Import genomes
   */
  importGenomes(genomes: CharacterGenome[]): void {
    for (const genome of genomes) {
      this.genomes.set(genome.characterId, genome);
    }
  }

  /**
   * Reset system
   */
  reset(): void {
    this.genomes.clear();
    this.issues = [];
    this.currentChapter = 0;
  }
}