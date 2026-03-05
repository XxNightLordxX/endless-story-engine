/**
 * Character Intelligence & Realism System
 * Manages character behavior, motivation, and development
 */

import type { Character, CharacterStat } from '../../types';

export interface CharacterMotivation {
  primary: string;
  secondary: string[];
  hidden: string | null;
  strength: number; // 1-10
}

export interface CharacterRelationship {
  character1: string;
  character2: string;
  type: 'family' | 'friend' | 'ally' | 'rival' | 'enemy' | 'romantic' | 'professional';
  strength: number; // 0-100
  trust: number; // 0-100
  history: string[];
}

export interface CharacterArc {
  characterId: string;
  type: 'growth' | 'fall' | 'flat' | 'redemption';
  currentStage: number; // 1-5
  milestones: string[];
  transformation: {
    from: string;
    to: string;
  };
}

export interface CharacterBehavior {
  decisionStyle: 'rational' | 'emotional' | 'impulsive' | 'calculated' | 'defensive';
  communicationStyle: 'direct' | 'subtle' | 'manipulative' | 'honest' | 'evasive';
  conflictApproach: 'aggressive' | 'diplomatic' | 'avoidant' | 'strategic' | 'defensive';
  stressResponse: 'fight' | 'flight' | 'freeze' | 'compromise' | 'delegate';
}

export class CharacterIntelligence {
  private motivations: Map<string, CharacterMotivation>;
  private relationships: Map<string, CharacterRelationship>;
  private arcs: Map<string, CharacterArc>;
  private behaviors: Map<string, CharacterBehavior>;
  private characterHistory: Map<string, string[]>;
  private consistencyScore: Map<string, number>;

  constructor() {
    this.motivations = new Map();
    this.relationships = new Map();
    this.arcs = new Map();
    this.behaviors = new Map();
    this.characterHistory = new Map();
    this.consistencyScore = new Map();
    this.initializeCharacterData();
  }

  /**
   * Initialize character data for Kael and main cast
   */
  private initializeCharacterData(): void {
    // Kael (Protagonist)
    this.motivations.set('Kael', {
      primary: 'Save sister Yuna from mysterious coma',
      secondary: [
        'Understand the VR world connection',
        'Protect those close to him',
        'Uncover the truth behind the system',
      ],
      hidden: 'Fear of being responsible for Yuna\'s condition',
      strength: 9,
    });

    this.behaviors.set('Kael', {
      decisionStyle: 'calculated',
      communicationStyle: 'direct',
      conflictApproach: 'strategic',
      stressResponse: 'fight',
    });

    this.arcs.set('Kael', {
      characterId: 'Kael',
      type: 'growth',
      currentStage: 1,
      milestones: [
        'Accepts the VR world as real',
        'Discovers his own power',
        'Confronts his guilt',
        'Makes the ultimate choice',
        'Transforms into protector',
      ],
      transformation: {
        from: 'Reluctant, guilt-ridden brother',
        to: 'Confident, powerful guardian',
      },
    });

    // Yuna (Sister)
    this.motivations.set('Yuna', {
      primary: 'Guide Kael from within the VR world',
      secondary: [
        'Maintain connection to reality',
        'Help other trapped souls',
      ],
      hidden: 'Knows more about the system than she reveals',
      strength: 8,
    });

    this.behaviors.set('Yuna', {
      decisionStyle: 'emotional',
      communicationStyle: 'subtle',
      conflictApproach: 'diplomatic',
      stressResponse: 'compromise',
    });

    // Alex (Best friend/ally)
    this.motivations.set('Alex', {
      primary: 'Support Kael through the crisis',
      secondary: [
        'Prove himself as more than a sidekick',
        'Protect his own secrets',
      ],
      hidden: null,
      strength: 6,
    });

    this.behaviors.set('Alex', {
      decisionStyle: 'impulsive',
      communicationStyle: 'honest',
      conflictApproach: 'aggressive',
      stressResponse: 'fight',
    });

    // Initialize relationships
    this.relationships.set('Kael-Yuna', {
      character1: 'Kael',
      character2: 'Yuna',
      type: 'family',
      strength: 95,
      trust: 100,
      history: [
        'Yuna fell into coma before the story begins',
        'Kael visits her daily in the hospital',
        'Their bond transcends the VR barrier',
      ],
    });

    this.relationships.set('Kael-Alex', {
      character1: 'Kael',
      character2: 'Alex',
      type: 'friend',
      strength: 75,
      trust: 70,
      history: [
        'Childhood friends',
        'Alex introduced Kael to VR gaming',
        'Alex supports Kael through Yuna\'s situation',
      ],
    });
  }

  /**
   * Get character motivation for decision making
   */
  getMotivation(characterName: string): CharacterMotivation | null {
    return this.motivations.get(characterName) || null;
  }

  /**
   * Determine how a character would react to a situation
   */
  predictReaction(characterName: string, situation: string, stressLevel: number): string {
    const behavior = this.behaviors.get(characterName);
    const motivation = this.motivations.get(characterName);

    if (!behavior || !motivation) {
      return 'Unknown character - cannot predict reaction';
    }

    const decisionStyle = behavior.decisionStyle;
    const stressResponse = behavior.stressResponse;
    const primaryMotivation = motivation.primary;

    let reaction = '';

    if (stressLevel > 7) {
      // High stress - use stress response
      switch (stressResponse) {
        case 'fight':
          reaction = `${characterName} confronts the situation directly, driven by ${primaryMotivation.toLowerCase()}.`;
          break;
        case 'flight':
          reaction = `${characterName} seeks to withdraw and reassess, protecting ${primaryMotivation.toLowerCase()}.`;
          break;
        case 'freeze':
          reaction = `${characterName} hesitates, weighing the impact on ${primaryMotivation.toLowerCase()}.`;
          break;
        case 'compromise':
          reaction = `${characterName} seeks a middle ground while maintaining focus on ${primaryMotivation.toLowerCase()}.`;
          break;
        case 'delegate':
          reaction = `${characterName} seeks help from others to address the situation.`;
          break;
      }
    } else {
      // Normal stress - use decision style
      switch (decisionStyle) {
        case 'rational':
          reaction = `${characterName} analyzes the situation logically before acting.`;
          break;
        case 'emotional':
          reaction = `${characterName} responds based on feelings and personal connections.`;
          break;
        case 'impulsive':
          reaction = `${characterName} acts quickly on instinct.`;
          break;
        case 'calculated':
          reaction = `${characterName} considers multiple options before choosing the best path.`;
          break;
        case 'defensive':
          reaction = `${characterName} protects themselves while assessing the situation.`;
          break;
      }
    }

    return reaction;
  }

  /**
   * Generate dialogue that matches character's voice
   */
  generateDialogue(characterName: string, topic: string, emotionalContext: string): string {
    const behavior = this.behaviors.get(characterName);
    const motivation = this.motivations.get(characterName);

    if (!behavior || !motivation) {
      return `"..."`; // Silent/unknown character
    }

    const templates = {
      direct: [
        `"I need to be clear about this: ${topic}.`,
        `"Let me say this straight. ${topic}.`,
        `"There's no point in hiding it. ${topic}.`,
      ],
      subtle: [
        `"I wonder if you've considered... ${topic}.`,
        `"Perhaps there's more to ${topic} than meets the eye."`,
        `"Some things are better left unsaid, but... ${topic}."`,
      ],
      manipulative: [
        `"You know what they say about ${topic}..."`,
        `"Wouldn't you agree that ${topic}?"`,
        `"I'm only suggesting this for your benefit..."`,
      ],
      honest: [
        `"I'll tell you the truth: ${topic}.`,
        `"Honestly, I think ${topic}.`,
        `"No point in lying - ${topic}."`,
      ],
      evasive: [
        `"That's... an interesting question about ${topic}."`,
        `"Let's focus on what matters right now."`,
        `"I'd rather not discuss that at the moment."`,
      ],
    };

    const styleTemplates = templates[behavior.communicationStyle];
    return styleTemplates[Math.floor(Math.random() * styleTemplates.length)];
  }

  /**
   * Update relationship between two characters
   */
  updateRelationship(char1: string, char2: string, change: number, context: string): void {
    const key = `${char1}-${char2}`;
    const reverseKey = `${char2}-${char1}`;
    const relationship = this.relationships.get(key) || this.relationships.get(reverseKey);

    if (relationship) {
      relationship.strength = Math.max(0, Math.min(100, relationship.strength + change));
      relationship.trust = Math.max(0, Math.min(100, relationship.trust + (change > 0 ? Math.floor(change / 2) : change)));
      relationship.history.push(context);
    } else {
      // Create new relationship
      this.relationships.set(key, {
        character1: char1,
        character2: char2,
        type: 'ally',
        strength: 50 + change,
        trust: 50 + Math.floor(change / 2),
        history: [context],
      });
    }
  }

  /**
   * Get relationship status between characters
   */
  getRelationship(char1: string, char2: string): CharacterRelationship | null {
    const key = `${char1}-${char2}`;
    const reverseKey = `${char2}-${char1}`;
    return this.relationships.get(key) || this.relationships.get(reverseKey) || null;
  }

  /**
   * Advance character arc
   */
  advanceArc(characterName: string): boolean {
    const arc = this.arcs.get(characterName);
    if (!arc || arc.currentStage >= 5) return false;

    arc.currentStage++;
    return true;
  }

  /**
   * Get current stage of character arc
   */
  getArcStage(characterName: string): number {
    const arc = this.arcs.get(characterName);
    return arc ? arc.currentStage : 0;
  }

  /**
   * Get milestone for current arc stage
   */
  getCurrentMilestone(characterName: string): string | null {
    const arc = this.arcs.get(characterName);
    if (!arc || arc.currentStage > arc.milestones.length) return null;
    return arc.milestones[arc.currentStage - 1];
  }

  /**
   * Check if character action is consistent with their established traits
   */
  checkConsistency(characterName: string, action: string): { consistent: boolean; reason: string } {
    const behavior = this.behaviors.get(characterName);
    const motivation = this.motivations.get(characterName);
    const history = this.characterHistory.get(characterName) || [];

    let consistencyScore = 100;
    let reason = '';

    // Check against decision style
    if (behavior) {
      const actionLower = action.toLowerCase();
      
      // Inconsistent patterns
      const inconsistentPatterns: { [key: string]: string[] } = {
        calculated: ['impulsive', 'rash', 'without thinking'],
        impulsive: ['carefully planned', 'thoughtfully', 'after much consideration'],
        emotional: ['logically', 'without feeling', 'purely rational'],
        rational: ['emotionally', 'overwhelmed by feelings'],
        defensive: ['trusted completely', 'opened up immediately'],
      };

      const patterns = inconsistentPatterns[behavior.decisionStyle] || [];
      for (const pattern of patterns) {
        if (actionLower.includes(pattern)) {
          consistencyScore -= 20;
          reason = `Action seems ${pattern}, which is unusual for ${characterName}'s ${behavior.decisionStyle} decision style.`;
        }
      }
    }

    // Check against primary motivation
    if (motivation) {
      const actionLower = action.toLowerCase();
      const primaryLower = motivation.primary.toLowerCase();
      
      // Check if action conflicts with primary motivation
      if (actionLower.includes('abandon') || actionLower.includes('give up')) {
        if (primaryLower.includes('save') || primaryLower.includes('protect')) {
          consistencyScore -= 30;
          reason = `${characterName}'s primary motivation is "${motivation.primary}" - giving up seems inconsistent.`;
        }
      }
    }

    // Update consistency score
    const currentScore = this.consistencyScore.get(characterName) || 100;
    this.consistencyScore.set(characterName, Math.max(0, Math.min(100, currentScore * 0.9 + consistencyScore * 0.1)));

    return {
      consistent: consistencyScore >= 60,
      reason: reason || 'Action appears consistent with character traits.',
    };
  }

  /**
   * Record character action for history
   */
  recordAction(characterName: string, action: string): void {
    if (!this.characterHistory.has(characterName)) {
      this.characterHistory.set(characterName, []);
    }
    this.characterHistory.get(characterName)!.push(action);
  }

  /**
   * Get character history
   */
  getHistory(characterName: string): string[] {
    return this.characterHistory.get(characterName) || [];
  }

  /**
   * Calculate character realism score
   */
  calculateRealismScore(characterName: string): number {
    const consistency = this.consistencyScore.get(characterName) || 100;
    const arc = this.arcs.get(characterName);
    const history = this.characterHistory.get(characterName) || [];

    let score = consistency;

    // Bonus for having developed arc
    if (arc && arc.currentStage > 1) {
      score += 5;
    }

    // Bonus for having history
    if (history.length > 5) {
      score += 5;
    }

    return Math.min(100, score);
  }

  /**
   * Get all character data for serialization
   */
  getAllCharacterData(): {
    motivations: Map<string, CharacterMotivation>;
    relationships: Map<string, CharacterRelationship>;
    arcs: Map<string, CharacterArc>;
    behaviors: Map<string, CharacterBehavior>;
  } {
    return {
      motivations: new Map(this.motivations),
      relationships: new Map(this.relationships),
      arcs: new Map(this.arcs),
      behaviors: new Map(this.behaviors),
    };
  }
}

export default CharacterIntelligence;