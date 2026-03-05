/**
 * MoralEthicalDecisionEngine
 * 
 * Manages moral frameworks, ethical dilemmas, and decision consequences
 * for characters and narrative. Tracks moral evolution and ethical consistency.
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface MoralFramework {
  id: string;
  name: string;
  type: EthicalFramework;
  principles: EthicalPrinciple[];
  priority: number; // Higher = more influential
  flexibility: number; // 0-1, how strictly applied
  origin: string; // Cultural, religious, personal origin
  evolution: FrameworkEvolution[];
  conflicts: ConflictRule[];
}

export type EthicalFramework = 
  | 'deontological'    // Duty-based ethics
  | 'utilitarian'      // Greatest good
  | 'virtue_ethics'    // Character-based
  | 'care_ethics'      // Relationship-based
  | 'divine_command'   // Religious obedience
  | 'natural_law'      // Natural order
  | 'social_contract'  // Societal agreement
  | 'egoism'           // Self-interest
  | 'altruism'         // Others first
  | 'relativism'       // Context-dependent
  | 'absolutism'       // Universal principles
  | 'pragmatism';      // Practical outcomes

export interface EthicalPrinciple {
  name: string;
  description: string;
  weight: number; // 0-1 importance
  exceptions: string[]; // When principle may be overridden
  applicationRules: ApplicationRule[];
}

export interface ApplicationRule {
  condition: string;
  modifies: 'weight' | 'application';
  value: number | string;
}

export interface FrameworkEvolution {
  chapter: number;
  event: string;
  changeType: 'expansion' | 'restriction' | 'shift' | 'crisis';
  description: string;
  beforeState: string;
  afterState: string;
}

export interface ConflictRule {
  principle1: string;
  principle2: string;
  resolution: 'higher_weight' | 'context' | 'character_choice' | 'external_factor';
  priority?: number;
}

// ============================================================================
// ETHICAL DILEMMA
// ============================================================================

export interface EthicalDilemma {
  id: string;
  name: string;
  description: string;
  type: DilemmaType;
  options: EthicalOption[];
  context: DilemmaContext;
  resolution?: DilemmaResolution;
  significance: number; // 0-1
  chapterIntroduced: number;
  chapterResolved?: number;
}

export type DilemmaType = 
  | 'trolley_problem'        // Sacrifice one for many
  | 'truth_vs_loyalty'       // Honesty vs commitment
  | 'individual_vs_community' // Personal vs collective
  | 'short_term_vs_long_term' // Immediate vs future
  | 'justice_vs_mercy'       // Fairness vs compassion
  | 'freedom_vs_security'    // Liberty vs safety
  | 'means_vs_ends'          // Process vs outcome
  | 'authority_vs_conscience' // Obedience vs morality
  | 'self_vs_others'         // Self-interest vs altruism
  | 'idealism_vs_pragmatism' // Principles vs practicality
  | 'tradition_vs_progress'  // Past vs future
  | 'nature_vs_nurture'      // Innate vs learned
  | 'fate_vs_free_will'      // Destiny vs choice
  | 'moral_gray';            // No clear right/wrong

export interface EthicalOption {
  id: string;
  description: string;
  action: string;
  consequences: Consequence[];
  moralWeight: MoralWeight;
  requiredSacrifice: string[];
  requiredVirtues: VirtueType[];
  violatedPrinciples: string[];
  characterAlignment: CharacterMoralAlignment;
}

export interface Consequence {
  type: 'positive' | 'negative' | 'mixed' | 'unknown';
  scope: 'individual' | 'relationship' | 'community' | 'society' | 'world';
  affected: string[]; // Characters or entities affected
  severity: number; // 0-1
  probability: number; // 0-1
  description: string;
  delayed: boolean;
  delayChapters?: number;
}

export interface MoralWeight {
  deontological: number; // -1 to 1 (wrong to right by duty)
  utilitarian: number;   // -1 to 1 (harm to benefit)
  virtue: number;        // -1 to 1 (vicious to virtuous)
  care: number;          // -1 to 1 (harmful to caring)
  overall: number;       // -1 to 1
}

export type VirtueType = 
  | 'courage'
  | 'justice'
  | 'wisdom'
  | 'temperance'
  | 'compassion'
  | 'honesty'
  | 'loyalty'
  | 'humility'
  | 'patience'
  | 'perseverance'
  | 'forgiveness'
  | 'generosity'
  | 'integrity'
  | 'respect'
  | 'responsibility';

export interface DilemmaContext {
  characters: string[];
  location: string;
  timePressure: boolean;
  informationComplete: boolean;
  emotionalIntensity: number;
  socialPressure: number;
  personalStakes: number;
  historicalPrecedent?: string;
}

export interface DilemmaResolution {
  optionChosen: string;
  reasoning: string;
  frameworkUsed: EthicalFramework;
  characterGrowth: CharacterGrowth[];
  consequencesRealized: Consequence[];
  regret: number; // 0-1
  satisfaction: number; // 0-1
}

export interface CharacterGrowth {
  characterId: string;
  aspect: 'moral_clarity' | 'empathy' | 'resolve' | 'flexibility' | 'wisdom';
  change: number; // -1 to 1
  reason: string;
}

// ============================================================================
// CHARACTER MORAL PROFILE
// ============================================================================

export interface CharacterMoralProfile {
  characterId: string;
  name: string;
  alignment: CharacterMoralAlignment;
  frameworks: MoralFramework[];
  coreValues: CoreValue[];
  moralHistory: MoralDecision[];
  growthAreas: MoralGrowthArea[];
  contradictions: MoralContradiction[];
  moralCompass: MoralCompass;
}

export type CharacterMoralAlignment = 
  | 'lawful_good'
  | 'neutral_good'
  | 'chaotic_good'
  | 'lawful_neutral'
  | 'true_neutral'
  | 'chaotic_neutral'
  | 'lawful_evil'
  | 'neutral_evil'
  | 'chaotic_evil';

export interface CoreValue {
  name: string;
  strength: number; // 0-1
  priority: number; // 1-10
  origin: 'inherent' | 'learned' | 'adopted' | 'imposed';
  tested: boolean;
  compromised: boolean;
}

export interface MoralDecision {
  chapter: number;
  dilemma: string; // Dilemma ID
  optionChosen: string;
  alignmentShift: number; // -1 to 1
  reasoning: string;
  regret: number;
}

export interface MoralGrowthArea {
  aspect: VirtueType;
  current: number; // 0-1
  potential: number; // 0-1
  developmentPath: string;
}

export interface MoralContradiction {
  value1: string;
  value2: string;
  tension: number; // 0-1
  context: string;
  resolution?: string;
}

export interface MoralCompass {
  empathy: number;
  justice: number;
  autonomy: number;
  community: number;
  tradition: number;
  progress: number;
  honesty: number;
  loyalty: number;
}

// ============================================================================
// CONSEQUENCE TRACKING
// ============================================================================

export interface MoralConsequence {
  id: string;
  sourceDecision: string; // Dilemma ID
  chapter: number;
  consequenceType: ConsequenceType;
  affectedCharacters: string[];
  description: string;
  magnitude: number; // 0-1
  intended: boolean;
  rippleEffects: RippleEffect[];
}

export type ConsequenceType = 
  | 'physical_harm'
  | 'emotional_harm'
  | 'relationship_damage'
  | 'reputation_damage'
  | 'loss_of_trust'
  | 'gain_of_trust'
  | 'relationship_growth'
  | 'personal_growth'
  | 'social_consequence'
  | 'legal_consequence'
  | 'spiritual_consequence'
  | 'reputation_enhancement';

export interface RippleEffect {
  chapter: number;
  effect: string;
  affectedCharacters: string[];
  magnitude: number;
}

// ============================================================================
// ETHICAL EVALUATION
// ============================================================================

export interface EthicalEvaluation {
  dilemma: string;
  character: string;
  options: OptionEvaluation[];
  recommendation: string;
  frameworksApplied: EthicalFramework[];
  confidence: number;
}

export interface OptionEvaluation {
  optionId: string;
  scores: Record<EthicalFramework, number>;
  overallScore: number;
  risks: string[];
  benefits: string[];
  alignmentImpact: number;
}

// ============================================================================
// MAIN ENGINE CLASS
// ============================================================================

export class MoralEthicalDecisionEngine {
  private frameworks: Map<string, MoralFramework> = new Map();
  private dilemmas: Map<string, EthicalDilemma> = new Map();
  private profiles: Map<string, CharacterMoralProfile> = new Map();
  private consequences: Map<string, MoralConsequence> = new Map();
  private decisionHistory: Map<string, MoralDecision[]> = new Map();
  
  // Cross-system reference
  private characterGenome?: any;

  constructor() {
    this.initializeDefaultFrameworks();
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  private initializeDefaultFrameworks(): void {
    // Utilitarian framework
    this.frameworks.set('utilitarian', {
      id: 'utilitarian',
      name: 'Utilitarianism',
      type: 'utilitarian',
      principles: [
        {
          name: 'Greatest Happiness Principle',
          description: 'Actions should maximize overall happiness and minimize suffering',
          weight: 1.0,
          exceptions: [],
          applicationRules: []
        },
        {
          name: 'Impartiality',
          description: 'Everyone\'s happiness counts equally',
          weight: 0.8,
          exceptions: ['personal_relationships'],
          applicationRules: []
        }
      ],
      priority: 1,
      flexibility: 0.5,
      origin: 'philosophical',
      evolution: [],
      conflicts: []
    });

    // Deontological framework
    this.frameworks.set('deontological', {
      id: 'deontological',
      name: 'Deontological Ethics',
      type: 'deontological',
      principles: [
        {
          name: 'Categorical Imperative',
          description: 'Act only on maxims that could become universal law',
          weight: 1.0,
          exceptions: [],
          applicationRules: []
        },
        {
          name: 'Respect for Persons',
          description: 'Treat humanity never as a means only, but always as an end',
          weight: 0.9,
          exceptions: [],
          applicationRules: []
        },
        {
          name: 'Duty',
          description: 'Fulfill obligations regardless of consequences',
          weight: 0.85,
          exceptions: [],
          applicationRules: []
        }
      ],
      priority: 1,
      flexibility: 0.2,
      origin: 'philosophical',
      evolution: [],
      conflicts: []
    });

    // Virtue ethics framework
    this.frameworks.set('virtue_ethics', {
      id: 'virtue_ethics',
      name: 'Virtue Ethics',
      type: 'virtue_ethics',
      principles: [
        {
          name: 'Eudaimonia',
          description: 'Act in ways that promote human flourishing',
          weight: 1.0,
          exceptions: [],
          applicationRules: []
        },
        {
          name: 'Golden Mean',
          description: 'Virtue lies between extremes of excess and deficiency',
          weight: 0.9,
          exceptions: [],
          applicationRules: []
        },
        {
          name: 'Character Development',
          description: 'Actions should cultivate virtuous character',
          weight: 0.85,
          exceptions: [],
          applicationRules: []
        }
      ],
      priority: 1,
      flexibility: 0.7,
      origin: 'philosophical',
      evolution: [],
      conflicts: []
    });

    // Care ethics framework
    this.frameworks.set('care_ethics', {
      id: 'care_ethics',
      name: 'Ethics of Care',
      type: 'care_ethics',
      principles: [
        {
          name: 'Relational Autonomy',
          description: 'Value relationships and interdependence',
          weight: 1.0,
          exceptions: [],
          applicationRules: []
        },
        {
          name: 'Responsiveness',
          description: 'Respond to the needs of others with care',
          weight: 0.9,
          exceptions: [],
          applicationRules: []
        },
        {
          name: 'Context Sensitivity',
          description: 'Consider specific circumstances and relationships',
          weight: 0.85,
          exceptions: [],
          applicationRules: []
        }
      ],
      priority: 1,
      flexibility: 0.8,
      origin: 'philosophical',
      evolution: [],
      conflicts: []
    });

    // Add conflict rules between frameworks
    this.addFrameworkConflicts();
  }

  private addFrameworkConflicts(): void {
    const utilitarian = this.frameworks.get('utilitarian')!;
    const deontological = this.frameworks.get('deontological')!;

    utilitarian.conflicts.push({
      principle1: 'Greatest Happiness Principle',
      principle2: 'Respect for Persons',
      resolution: 'context',
      priority: 1
    });

    deontological.conflicts.push({
      principle1: 'Categorical Imperative',
      principle2: 'Duty',
      resolution: 'character_choice',
      priority: 1
    });
  }

  // ==========================================================================
  // CHARACTER MORAL PROFILE MANAGEMENT
  // ==========================================================================

  createCharacterProfile(
    characterId: string,
    name: string,
    alignment: CharacterMoralAlignment,
    initialValues?: CoreValue[]
  ): CharacterMoralProfile {
    const profile: CharacterMoralProfile = {
      characterId,
      name,
      alignment,
      frameworks: [this.frameworks.get('virtue_ethics')!],
      coreValues: initialValues || this.generateDefaultValues(),
      moralHistory: [],
      growthAreas: [],
      contradictions: [],
      moralCompass: this.generateDefaultCompass()
    };

    this.profiles.set(characterId, profile);
    this.decisionHistory.set(characterId, []);

    return profile;
  }

  private generateDefaultValues(): CoreValue[] {
    return [
      { name: 'honesty', strength: 0.7, priority: 5, origin: 'learned', tested: false, compromised: false },
      { name: 'loyalty', strength: 0.7, priority: 5, origin: 'learned', tested: false, compromised: false },
      { name: 'justice', strength: 0.6, priority: 6, origin: 'inherent', tested: false, compromised: false },
      { name: 'compassion', strength: 0.6, priority: 6, origin: 'inherent', tested: false, compromised: false },
      { name: 'self-preservation', strength: 0.5, priority: 7, origin: 'inherent', tested: false, compromised: false }
    ];
  }

  private generateDefaultCompass(): MoralCompass {
    return {
      empathy: 0.6,
      justice: 0.6,
      autonomy: 0.5,
      community: 0.5,
      tradition: 0.4,
      progress: 0.4,
      honesty: 0.7,
      loyalty: 0.7
    };
  }

  updateCharacterAlignment(
    characterId: string,
    decision: MoralDecision
  ): CharacterMoralAlignment {
    const profile = this.profiles.get(characterId);
    if (!profile) {
      console.warn(`Character ${characterId} not found`);
      return 'true_neutral';
    }

    const shift = decision.alignmentShift;
    const current = profile.alignment;

    // Calculate new alignment based on shift
    const alignmentOrder: CharacterMoralAlignment[] = [
      'lawful_good', 'neutral_good', 'chaotic_good',
      'lawful_neutral', 'true_neutral', 'chaotic_neutral',
      'lawful_evil', 'neutral_evil', 'chaotic_evil'
    ];

    const currentIndex = alignmentOrder.indexOf(current);
    let newIndex = currentIndex + Math.round(shift * 2); // Each step is 0.5 shift
    newIndex = Math.max(0, Math.min(alignmentOrder.length - 1, newIndex));

    profile.alignment = alignmentOrder[newIndex];
    profile.moralHistory.push(decision);

    const history = this.decisionHistory.get(characterId) || [];
    history.push(decision);
    this.decisionHistory.set(characterId, history);

    return profile.alignment;
  }

  // ==========================================================================
  // DILEMMA MANAGEMENT
  // ==========================================================================

  createDilemma(
    name: string,
    description: string,
    type: DilemmaType,
    options: EthicalOption[],
    context: DilemmaContext,
    chapterIntroduced: number,
    significance: number = 0.5
  ): EthicalDilemma {
    const dilemma: EthicalDilemma = {
      id: `dilemma-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      type,
      options,
      context,
      significance,
      chapterIntroduced
    };

    this.dilemmas.set(dilemma.id, dilemma);
    return dilemma;
  }

  evaluateOptions(
    dilemmaId: string,
    characterId: string
  ): EthicalEvaluation {
    const dilemma = this.dilemmas.get(dilemmaId);
    const profile = this.profiles.get(characterId);

    if (!dilemma || !profile) {
      throw new Error('Dilemma or character not found');
    }

    const optionEvaluations: OptionEvaluation[] = dilemma.options.map(option => {
      return this.evaluateOptionForCharacter(option, profile);
    });

    // Determine recommendation based on character's primary framework
    const primaryFramework = profile.frameworks[0]?.type || 'virtue_ethics';
    const bestOption = optionEvaluations.reduce((best, current) => {
      const bestScore = best.scores[primaryFramework] || best.overallScore;
      const currentScore = current.scores[primaryFramework] || current.overallScore;
      return currentScore > bestScore ? current : best;
    });

    return {
      dilemma: dilemmaId,
      character: characterId,
      options: optionEvaluations,
      recommendation: bestOption.optionId,
      frameworksApplied: profile.frameworks.map(f => f.type),
      confidence: 0.7 // Base confidence
    };
  }

  private evaluateOptionForCharacter(
    option: EthicalOption,
    profile: CharacterMoralProfile
  ): OptionEvaluation {
    const scores: Record<EthicalFramework, number> = {
      'deontological': option.moralWeight.deontological,
      'utilitarian': option.moralWeight.utilitarian,
      'virtue_ethics': option.moralWeight.virtue,
      'care_ethics': option.moralWeight.care,
      'divine_command': 0,
      'natural_law': 0,
      'social_contract': 0,
      'egoism': 0,
      'altruism': 0,
      'relativism': 0,
      'absolutism': 0,
      'pragmatism': 0
    };

    // Adjust scores based on character's moral compass
    const compassAdjustment = this.calculateCompassAdjustment(option, profile.moralCompass);
    Object.keys(scores).forEach(key => {
      scores[key as EthicalFramework] += compassAdjustment;
    });

    // Calculate overall score
    const overallScore = (
      option.moralWeight.overall * 0.5 +
      option.moralWeight.virtue * 0.2 +
      option.moralWeight.utilitarian * 0.15 +
      option.moralWeight.deontological * 0.15
    );

    // Identify risks and benefits
    const risks = option.consequences
      .filter(c => c.type === 'negative')
      .map(c => c.description);
    const benefits = option.consequences
      .filter(c => c.type === 'positive')
      .map(c => c.description);

    return {
      optionId: option.id,
      scores,
      overallScore,
      risks,
      benefits,
      alignmentImpact: this.calculateAlignmentImpact(option, profile)
    };
  }

  private calculateCompassAdjustment(
    option: EthicalOption,
    compass: MoralCompass
  ): number {
    let adjustment = 0;

    option.requiredVirtues.forEach(virtue => {
      if (virtue === 'compassion') adjustment += compass.empathy * 0.1;
      if (virtue === 'justice') adjustment += compass.justice * 0.1;
      if (virtue === 'honesty') adjustment += compass.honesty * 0.1;
      if (virtue === 'loyalty') adjustment += compass.loyalty * 0.1;
    });

    return adjustment;
  }

  private calculateAlignmentImpact(
    option: EthicalOption,
    profile: CharacterMoralProfile
  ): number {
    let impact = 0;

    // Check alignment match
    const alignmentMatch = option.characterAlignment === profile.alignment ? 0.1 : 0;

    // Check value conflicts
    option.violatedPrinciples.forEach(principle => {
      const value = profile.coreValues.find(v => v.name.toLowerCase() === principle.toLowerCase());
      if (value) {
        impact -= value.strength * 0.1;
      }
    });

    return impact + alignmentMatch;
  }

  // ==========================================================================
  // RESOLUTION MANAGEMENT
  // ==========================================================================

  resolveDilemma(
    dilemmaId: string,
    optionId: string,
    reasoning: string,
    chapter: number
  ): DilemmaResolution {
    const dilemma = this.dilemmas.get(dilemmaId);
    if (!dilemma) {
      throw new Error('Dilemma not found');
    }

    const option = dilemma.options.find(o => o.id === optionId);
    if (!option) {
      throw new Error('Option not found');
    }

    const resolution: DilemmaResolution = {
      optionChosen: optionId,
      reasoning,
      frameworkUsed: this.determineFrameworkUsed(option),
      characterGrowth: [],
      consequencesRealized: option.consequences,
      regret: 0, // To be updated based on outcome
      satisfaction: 0.5
    };

    dilemma.resolution = resolution;
    dilemma.chapterResolved = chapter;

    // Create consequence records
    option.consequences.forEach(consequence => {
      this.createConsequence(dilemmaId, chapter, consequence, dilemma.context.characters);
    });

    return resolution;
  }

  private determineFrameworkUsed(option: EthicalOption): EthicalFramework {
    const weights = option.moralWeight;
    
    if (weights.deontological > weights.utilitarian && 
        weights.deontological > weights.virtue) {
      return 'deontological';
    }
    if (weights.utilitarian > weights.virtue) {
      return 'utilitarian';
    }
    return 'virtue_ethics';
  }

  // ==========================================================================
  // CONSEQUENCE MANAGEMENT
  // ==========================================================================

  private createConsequence(
    dilemmaId: string,
    chapter: number,
    consequence: Consequence,
    affectedCharacters: string[]
  ): MoralConsequence {
    const moralConsequence: MoralConsequence = {
      id: `consequence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sourceDecision: dilemmaId,
      chapter,
      consequenceType: consequence.type === 'positive' ? 'gain_of_trust' : 
                       consequence.type === 'negative' ? 'emotional_harm' : 'relationship_damage',
      affectedCharacters,
      description: consequence.description,
      magnitude: consequence.severity,
      intended: consequence.type === 'positive',
      rippleEffects: []
    };

    this.consequences.set(moralConsequence.id, moralConsequence);
    return moralConsequence;
  }

  addRippleEffect(
    consequenceId: string,
    chapter: number,
    effect: string,
    affectedCharacters: string[],
    magnitude: number
  ): void {
    const consequence = this.consequences.get(consequenceId);
    if (!consequence) {
      console.warn(`Consequence ${consequenceId} not found`);
      return;
    }

    consequence.rippleEffects.push({
      chapter,
      effect,
      affectedCharacters,
      magnitude
    });
  }

  // ==========================================================================
  // MORAL ANALYSIS
  // ==========================================================================

  analyzeCharacterMorality(characterId: string): MoralAnalysis {
    const profile = this.profiles.get(characterId);
    if (!profile) {
      return {
        alignment: 'true_neutral',
        consistency: 0,
        dominantValues: [],
        growthTrajectory: [],
        contradictions: [],
        recommendations: []
      };
    }

    const history = this.decisionHistory.get(characterId) || [];
    let consistency = 1;

    if (history.length > 1) {
      // Calculate consistency based on alignment shifts
      const shifts = history.map(d => Math.abs(d.alignmentShift));
      const avgShift = shifts.reduce((a, b) => a + b, 0) / shifts.length;
      consistency = 1 - avgShift;
    }

    const dominantValues = profile.coreValues
      .filter(v => v.strength > 0.5)
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 5);

    const recommendations: string[] = [];
    if (consistency < 0.5) {
      recommendations.push('Character shows moral inconsistency - consider establishing clearer values');
    }
    if (profile.contradictions.length > 2) {
      recommendations.push('Multiple moral contradictions exist - potential for internal conflict development');
    }
    if (profile.growthAreas.length === 0) {
      recommendations.push('No defined growth areas - consider moral development arc');
    }

    return {
      alignment: profile.alignment,
      consistency,
      dominantValues,
      growthTrajectory: profile.growthAreas,
      contradictions: profile.contradictions,
      recommendations
    };
  }

  analyzeDilemmaComplexity(dilemmaId: string): DilemmaComplexity {
    const dilemma = this.dilemmas.get(dilemmaId);
    if (!dilemma) {
      return {
        score: 0,
        factors: [],
        resolution: 'simple'
      };
    }

    let score = 0;
    const factors: string[] = [];

    // Factor: Number of equally weighted options
    const optionWeights = dilemma.options.map(o => o.moralWeight.overall);
    const weightVariance = this.calculateVariance(optionWeights);
    if (weightVariance < 0.1) {
      score += 0.3;
      factors.push('Options have similar moral weight');
    }

    // Factor: Time pressure
    if (dilemma.context.timePressure) {
      score += 0.2;
      factors.push('Time pressure adds complexity');
    }

    // Factor: Incomplete information
    if (!dilemma.context.informationComplete) {
      score += 0.2;
      factors.push('Incomplete information increases uncertainty');
    }

    // Factor: Emotional intensity
    score += dilemma.context.emotionalIntensity * 0.15;
    if (dilemma.context.emotionalIntensity > 0.7) {
      factors.push('High emotional intensity');
    }

    // Factor: Number of stakeholders
    const stakeholders = new Set(dilemma.options.flatMap(o => 
      o.consequences.flatMap(c => c.affected)
    )).size;
    score += Math.min(0.15, stakeholders * 0.03);

    const resolution: 'simple' | 'moderate' | 'complex' | 'extreme' = 
      score < 0.25 ? 'simple' :
      score < 0.5 ? 'moderate' :
      score < 0.75 ? 'complex' : 'extreme';

    return { score, factors, resolution };
  }

  private calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    return numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
  }

  // ==========================================================================
  // EXPORT / IMPORT
  // ==========================================================================

  exportState(): MoralEngineState {
    return {
      frameworks: Array.from(this.frameworks.entries()),
      dilemmas: Array.from(this.dilemmas.entries()),
      profiles: Array.from(this.profiles.entries()),
      consequences: Array.from(this.consequences.entries()),
      decisionHistory: Array.from(this.decisionHistory.entries())
    };
  }

  importState(state: MoralEngineState): void {
    this.frameworks = new Map(state.frameworks);
    this.dilemmas = new Map(state.dilemmas);
    this.profiles = new Map(state.profiles);
    this.consequences = new Map(state.consequences);
    this.decisionHistory = new Map(state.decisionHistory);
  }

  reset(): void {
    this.frameworks.clear();
    this.dilemmas.clear();
    this.profiles.clear();
    this.consequences.clear();
    this.decisionHistory.clear();
    this.initializeDefaultFrameworks();
  }

  /**
   * Set character genome reference for moral ethical decision engine
   */
  setCharacterGenome(characterGenome: any): void {
    this.characterGenome = characterGenome;
  }

  /**
   * Get system status including cross-system connectivity
   */
  getSystemStatus(): {
    frameworksCount: number;
    dilemmasCount: number;
    profilesCount: number;
    connectedSystems: string[];
  } {
    const connectedSystems: string[] = [];
    if (this.characterGenome) connectedSystems.push('characterGenome');

    return {
      frameworksCount: this.frameworks.size,
      dilemmasCount: this.dilemmas.size,
      profilesCount: this.profiles.size,
      connectedSystems
    };
  }
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface MoralAnalysis {
  alignment: CharacterMoralAlignment;
  consistency: number;
  dominantValues: CoreValue[];
  growthTrajectory: MoralGrowthArea[];
  contradictions: MoralContradiction[];
  recommendations: string[];
}

export interface DilemmaComplexity {
  score: number;
  factors: string[];
  resolution: 'simple' | 'moderate' | 'complex' | 'extreme';
}

export interface MoralEngineState {
  frameworks: [string, MoralFramework][];
  dilemmas: [string, EthicalDilemma][];
  profiles: [string, CharacterMoralProfile][];
  consequences: [string, MoralConsequence][];
  decisionHistory: [string, MoralDecision[]][];
}

export default MoralEthicalDecisionEngine;