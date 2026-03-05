import { v4 as uuidv4 } from 'uuid';
import { webSearchIntegration } from './WebSearchIntegration';
import type { WebSearchResult, TechnicalSearchResult, LiterarySearchResult } from './WebSearchIntegration';

/**
 * Moral & Ethical Decision Engine
 * 
 * This system provides ethical framework management and moral reasoning for characters.
 * It tracks moral dilemmas, evaluates decisions, and maintains ethical consistency.
 * 
 * Enhanced with real-time web search for ethical frameworks,
 * moral philosophy concepts, and ethical dilemma examples.
 * 
 * Core Responsibilities:
 * - Evaluate moral dilemmas and ethical choices
 * - Track character moral development
 * - Apply ethical frameworks (utilitarian, deontological, virtue ethics)
 * - Generate moral consequences and fallout
 * - Maintain ethical consistency in character behavior
 * - Analyze thematic moral questions
 */

// ===== TYPES & INTERFACES =====

export interface MoralFramework {
  id: string;
  name: string;
  type: EthicalSystem;
  principles: EthicalPrinciple[];
  priority: number; // 0-1, how strongly held
  flexibility: number; // 0-1, how willing to compromise
  origin: string; // Where this framework came from
  developmentHistory: FrameworkDevelopment[];
}

export type EthicalSystem = 
  | 'utilitarian' | 'deontological' | 'virtue-ethics' 
  | 'care-ethics' | 'divine-command' | 'egoist' 
  | 'social-contract' | 'relativist' | 'pragmatic';

export interface EthicalPrinciple {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-1, importance within framework
  exceptions: string[]; // When this principle can be violated
  hardConstraint: boolean; // Never violate?
}

export interface FrameworkDevelopment {
  chapter: number;
  event: string;
  change: string;
  trigger: string;
}

export interface MoralDilemma {
  id: string;
  chapter: number;
  situation: string;
  options: MoralOption[];
  context: string;
  stakeholders: Stakeholder[];
  urgency: number; // 1-10
  complexity: number; // 1-10
  chosenOption: string | null;
  reasoning: string;
  consequences: MoralConsequence[];
  thematicSignificance: string;
}

export interface MoralOption {
  id: string;
  description: string;
  action: string;
  ethicalAnalysis: EthicalAnalysis;
  predictedOutcomes: PredictedOutcome[];
  requiredSacrifices: string[];
  violationOf: string[]; // Principles violated
  alignment: number; // -1 to 1 (evil to good)
  characterAlignment: number; // How aligned with character's framework
}

export interface EthicalAnalysis {
  utilitarianScore: number; // -1 to 1
  deontologicalScore: number; // -1 to 1
  virtueEthicsScore: number; // -1 to 1
  careEthicsScore: number; // -1 to 1
  overallScore: number;
  conflicts: EthicalConflict[];
  reasoning: string;
}

export interface EthicalConflict {
  framework1: EthicalSystem;
  framework2: EthicalSystem;
  nature: string;
  severity: number; // 1-10
  resolution: 'unresolved' | 'framework1' | 'framework2' | 'compromise';
}

export interface PredictedOutcome {
  description: string;
  probability: number; // 0-1
  impact: number; // -10 to 10
  affected: string[]; // Characters affected
  timeframe: 'immediate' | 'short-term' | 'long-term' | 'permanent';
}

export interface Stakeholder {
  characterId: string;
  interest: string;
  vulnerability: number; // 1-10
  relationshipToDecider: string;
  moralWeight: number; // 0-1
}

export interface MoralConsequence {
  id: string;
  chapter: number;
  type: 'intended' | 'unintended' | 'ripple';
  description: string;
  severity: number; // 1-10
  affected: string[];
  wasPredicted: boolean;
  moralImplications: string;
  ongoing: boolean;
}

export interface CharacterMorality {
  characterId: string;
  alignment: MoralAlignment;
  frameworks: MoralFramework[];
  history: MoralDecision[];
  development: MoralDevelopment[];
  consistency: number; // 0-1
  reputation: MoralReputation;
  innerConflict: InnerConflict | null;
}

export interface MoralAlignment {
  axis: 'lawful-neutral-chaotic' | 'good-neutral-evil';
  position: number; // -1 to 1
  evolution: AlignmentEvolution[];
  consistency: number; // 0-1
}

export interface AlignmentEvolution {
  chapter: number;
  oldPosition: number;
  newPosition: number;
  event: string;
  reason: string;
}

export interface MoralDecision {
  id: string;
  chapter: number;
  dilemmaId: string;
  choice: string;
  reasoning: string;
  emotionalState: string;
  regret: number; // 0-1
  growth: string;
}

export interface MoralDevelopment {
  chapter: number;
  type: 'deepening' | 'questioning' | 'transformation' | 'hardening' | 'softening';
  description: string;
  trigger: string;
  newPerspective: string;
}

export interface MoralReputation {
  self: number; // -1 to 1, how they see themselves
  perceived: Map<string, number>; // Character -> their perception
  actual: number; // Based on actions
  discrepancy: number; // Gap between self and actual
}

export interface InnerConflict {
  type: 'framework-clash' | 'belief-action' | 'past-present' | 'individual-community';
  description: string;
  intensity: number; // 1-10
  resolution: 'unresolved' | 'resolved' | 'suppressed' | 'transformed';
  chapter: number;
}

export interface EthicalTheme {
  id: string;
  name: string;
  question: string;
  chaptersExplored: number[];
  positions: EthicalPosition[];
  dominantView: string;
  resolution: string | null;
}

export interface EthicalPosition {
  characterId: string;
  position: string;
  reasoning: string;
  flexibility: number; // 0-1
}

export interface MoralEvent {
  id: string;
  chapter: number;
  type: MoralEventType;
  description: string;
  participants: string[];
  ethicalImplications: string[];
  thematicTags: string[];
  significance: number; // 1-10
}

export type MoralEventType = 
  | 'dilemma' | 'sacrifice' | 'betrayal' | 'redemption' 
  | 'moral-choice' | 'consequence' | 'revelation' | 'test';

export interface EthicalEvaluation {
  id: string;
  dilemmaId: string;
  characterId: string;
  analysis: string;
  recommendation: string;
  confidence: number; // 0-1
  considerations: string[];
  warnings: string[];
}

// ===== CLASS DEFINITION =====

export class MoralEthicalDecisionEngine {
  private characterMoralities: Map<string, CharacterMorality> = new Map();
  private dilemmas: Map<string, MoralDilemma> = new Map();
  private ethicalThemes: Map<string, EthicalTheme> = new Map();
  private moralEvents: MoralEvent[] = [];
  private globalConsequences: MoralConsequence[] = [];
  
  // Web search integration
  private ethicalFrameworksCache: Map<string, WebSearchResult[]> = new Map();
  private moralPhilosophyCache: Map<string, WebSearchResult[]> = new Map();
  private ethicalDilemmasCache: Map<string, LiterarySearchResult[]> = new Map();

  constructor() {}

  // ===== WEB SEARCH INTEGRATION =====

  /**
   * Search for ethical frameworks
   */
  async searchEthicalFrameworks(
    framework: string,
    scenario?: string
  ): Promise<WebSearchResult[]> {
    const key = `${framework}-${scenario || 'general'}`;
    if (this.ethicalFrameworksCache.has(key)) {
      return this.ethicalFrameworksCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchEthicalFrameworks(
      framework,
      scenario
    );
    this.ethicalFrameworksCache.set(key, results);
    return results;
  }

  /**
   * Research moral philosophy concepts
   */
  async searchMoralPhilosophy(
    concept: string,
    philosopher?: string
  ): Promise<WebSearchResult[]> {
    const key = `${concept}-${philosopher || 'general'}`;
    if (this.moralPhilosophyCache.has(key)) {
      return this.moralPhilosophyCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${philosopher ? philosopher + ' ' : ''}${concept} moral philosophy ethics`
    );
    this.moralPhilosophyCache.set(key, results);
    return results;
  }

  /**
   * Find ethical dilemma examples in literature
   */
  async searchEthicalDilemmas(
    dilemmaType: string,
    genre: string
  ): Promise<LiterarySearchResult[]> {
    const key = `${dilemmaType}-${genre}`;
    if (this.ethicalDilemmasCache.has(key)) {
      return this.ethicalDilemmasCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchLiteraryExamples(
      `${dilemmaType} moral dilemma`,
      genre
    );
    this.ethicalDilemmasCache.set(key, results);
    return results;
  }

  /**
   * Clear web search cache
   */
  clearWebSearchCache(): void {
    this.ethicalFrameworksCache.clear();
    this.moralPhilosophyCache.clear();
    this.ethicalDilemmasCache.clear();
  }

  // ===== CORE FUNCTIONALITY =====

  /**
   * Initialize character morality
   */
  public initializeCharacterMorality(
    characterId: string,
    initialAlignment: number,
    primaryFramework: EthicalSystem
  ): CharacterMorality {
    const morality: CharacterMorality = {
      characterId,
      alignment: {
        axis: 'good-neutral-evil',
        position: initialAlignment,
        evolution: [],
        consistency: 0.8
      },
      frameworks: [this.createDefaultFramework(primaryFramework)],
      history: [],
      development: [],
      consistency: 0.8,
      reputation: {
        self: initialAlignment,
        perceived: new Map(),
        actual: initialAlignment,
        discrepancy: 0
      },
      innerConflict: null
    };
    
    this.characterMoralities.set(characterId, morality);
    return morality;
  }

  /**
   * Create default framework
   */
  private createDefaultFramework(type: EthicalSystem): MoralFramework {
    const principles = this.getDefaultPrinciples(type);
    
    return {
      id: uuidv4(),
      name: this.getFrameworkName(type),
      type,
      principles,
      priority: 0.8,
      flexibility: 0.3,
      origin: 'character background',
      developmentHistory: []
    };
  }

  /**
   * Get default principles for ethical system
   */
  private getDefaultPrinciples(type: EthicalSystem): EthicalPrinciple[] {
    const principleMap: Record<EthicalSystem, EthicalPrinciple[]> = {
      'utilitarian': [
        { id: uuidv4(), name: 'Greatest Good', description: 'Maximize overall happiness and minimize suffering', weight: 1.0, exceptions: [], hardConstraint: false },
        { id: uuidv4(), name: 'Impartiality', description: 'Treat all affected parties equally', weight: 0.8, exceptions: ['close family'], hardConstraint: false },
        { id: uuidv4(), name: 'Consequence Focus', description: 'Judge actions by their outcomes', weight: 0.9, exceptions: [], hardConstraint: false }
      ],
      'deontological': [
        { id: uuidv4(), name: 'Duty', description: 'Follow moral rules regardless of consequences', weight: 1.0, exceptions: [], hardConstraint: true },
        { id: uuidv4(), name: 'Universalizability', description: 'Act only on principles you would universalize', weight: 0.9, exceptions: [], hardConstraint: true },
        { id: uuidv4(), name: 'Human Dignity', description: 'Never treat people as mere means', weight: 1.0, exceptions: [], hardConstraint: true }
      ],
      'virtue-ethics': [
        { id: uuidv4(), name: 'Character', description: 'Cultivate virtuous character traits', weight: 1.0, exceptions: [], hardConstraint: false },
        { id: uuidv4(), name: 'Practical Wisdom', description: 'Apply good judgment in context', weight: 0.9, exceptions: [], hardConstraint: false },
        { id: uuidv4(), name: 'Eudaimonia', description: 'Seek human flourishing', weight: 0.8, exceptions: [], hardConstraint: false }
      ],
      'care-ethics': [
        { id: uuidv4(), name: 'Caring', description: 'Prioritize caring relationships', weight: 1.0, exceptions: [], hardConstraint: false },
        { id: uuidv4(), name: 'Responsiveness', description: 'Respond to needs of dependents', weight: 0.9, exceptions: [], hardConstraint: false },
        { id: uuidv4(), name: 'Context', description: 'Consider context and relationships', weight: 0.8, exceptions: [], hardConstraint: false }
      ],
      'divine-command': [
        { id: uuidv4(), name: 'Divine Will', description: 'Follow divine commands', weight: 1.0, exceptions: [], hardConstraint: true },
        { id: uuidv4(), name: 'Faith', description: 'Trust in divine wisdom', weight: 0.9, exceptions: [], hardConstraint: false },
        { id: uuidv4(), name: 'Obedience', description: 'Submit to divine authority', weight: 0.8, exceptions: [], hardConstraint: false }
      ],
      'egoist': [
        { id: uuidv4(), name: 'Self-Interest', description: 'Act in own rational self-interest', weight: 1.0, exceptions: [], hardConstraint: false },
        { id: uuidv4(), name: 'Personal Flourishing', description: 'Seek own well-being and success', weight: 0.9, exceptions: [], hardConstraint: false },
        { id: uuidv4(), name: 'Rational Choice', description: 'Make rational choices for self', weight: 0.8, exceptions: [], hardConstraint: false }
      ],
      'social-contract': [
        { id: uuidv4(), name: 'Agreement', description: 'Follow agreed-upon rules', weight: 1.0, exceptions: ['contract voided'], hardConstraint: false },
        { id: uuidv4(), name: 'Reciprocity', description: 'Treat others as they treat you', weight: 0.9, exceptions: [], hardConstraint: false },
        { id: uuidv4(), name: 'Fairness', description: 'Abide by fair rules', weight: 0.8, exceptions: [], hardConstraint: false }
      ],
      'relativist': [
        { id: uuidv4(), name: 'Cultural Context', description: 'Morality depends on culture', weight: 1.0, exceptions: [], hardConstraint: false },
        { id: uuidv4(), name: 'Tolerance', description: 'Respect different moral views', weight: 0.9, exceptions: ['intolerance'], hardConstraint: false },
        { id: uuidv4(), name: 'Flexibility', description: 'Adapt to context', weight: 0.8, exceptions: [], hardConstraint: false }
      ],
      'pragmatic': [
        { id: uuidv4(), name: 'Practicality', description: 'Do what works', weight: 1.0, exceptions: [], hardConstraint: false },
        { id: uuidv4(), name: 'Consequences', description: 'Consider practical outcomes', weight: 0.9, exceptions: [], hardConstraint: false },
        { id: uuidv4(), name: 'Flexibility', description: 'Adapt methods to situation', weight: 0.8, exceptions: [], hardConstraint: false }
      ]
    };
    
    return principleMap[type];
  }

  /**
   * Get framework name
   */
  private getFrameworkName(type: EthicalSystem): string {
    const names: Record<EthicalSystem, string> = {
      'utilitarian': 'Utilitarian Ethics',
      'deontological': 'Deontological Ethics',
      'virtue-ethics': 'Virtue Ethics',
      'care-ethics': 'Ethics of Care',
      'divine-command': 'Divine Command Ethics',
      'egoist': 'Ethical Egoism',
      'social-contract': 'Social Contract Theory',
      'relativist': 'Moral Relativism',
      'pragmatic': 'Pragmatic Ethics'
    };
    
    return names[type];
  }

  /**
   * Evaluate moral dilemma
   */
  public evaluateDilemma(
    situation: string,
    options: string[],
    characterId: string,
    chapter: number
  ): MoralDilemma {
    const morality = this.characterMoralities.get(characterId);
    
    const dilemma: MoralDilemma = {
      id: uuidv4(),
      chapter,
      situation,
      options: options.map((opt, index) => this.createMoralOption(opt, morality, index)),
      context: this.extractContext(situation),
      stakeholders: this.identifyStakeholders(situation),
      urgency: this.assessUrgency(situation),
      complexity: this.assessComplexity(situation, options),
      chosenOption: null,
      reasoning: '',
      consequences: [],
      thematicSignificance: this.assessThematicSignificance(situation)
    };
    
    this.dilemmas.set(dilemma.id, dilemma);
    
    // Create moral event
    this.createMoralEvent('dilemma', situation, [characterId], chapter, dilemma.id);
    
    return dilemma;
  }

  /**
   * Create moral option
   */
  private createMoralOption(description: string, morality: CharacterMorality | undefined, index: number): MoralOption {
    const analysis = this.analyzeOptionEthically(description, morality);
    
    return {
      id: uuidv4(),
      description,
      action: this.extractAction(description),
      ethicalAnalysis: analysis,
      predictedOutcomes: this.predictOutcomes(description),
      requiredSacrifices: this.identifySacrifices(description),
      violationOf: this.identifyViolations(description, morality),
      alignment: analysis.overallScore,
      characterAlignment: this.calculateCharacterAlignment(analysis, morality)
    };
  }

  /**
   * Analyze option ethically
   */
  private analyzeOptionEthically(description: string, morality: CharacterMorality | undefined): EthicalAnalysis {
    const utilitarianScore = this.utilitarianAnalysis(description);
    const deontologicalScore = this.deontologicalAnalysis(description);
    const virtueEthicsScore = this.virtueEthicsAnalysis(description);
    const careEthicsScore = this.careEthicsAnalysis(description);
    
    const overallScore = (utilitarianScore + deontologicalScore + virtueEthicsScore + careEthicsScore) / 4;
    
    return {
      utilitarianScore,
      deontologicalScore,
      virtueEthicsScore,
      careEthicsScore,
      overallScore,
      conflicts: this.identifyEthicalConflicts(utilitarianScore, deontologicalScore, virtueEthicsScore, careEthicsScore),
      reasoning: this.generateEthicalReasoning(utilitarianScore, deontologicalScore, virtueEthicsScore, careEthicsScore)
    };
  }

  /**
   * Utilitarian analysis
   */
  private utilitarianAnalysis(description: string): number {
    const harmIndicators = /\b(kill|harm|hurt|suffer|pain|death|destroy)\b/gi;
    const benefitIndicators = /\b(save|help|protect|benefit|happiness|joy|life)\b/gi;
    
    const harmCount = (description.match(harmIndicators) || []).length;
    const benefitCount = (description.match(benefitIndicators) || []).length;
    
    const score = (benefitCount - harmCount) / Math.max(1, benefitCount + harmCount + 1);
    return Math.max(-1, Math.min(1, score));
  }

  /**
   * Deontological analysis
   */
  private deontologicalAnalysis(description: string): number {
    const dutyViolations = /\b(lie|deceive|betray|break promise|kill|steal)\b/gi;
    const dutyFulfillments = /\b(keep promise|tell truth|protect|honor|duty)\b/gi;
    
    const violations = (description.match(dutyViolations) || []).length;
    const fulfillments = (description.match(dutyFulfillments) || []).length;
    
    const score = (fulfillments - violations) / Math.max(1, fulfillments + violations + 1);
    return Math.max(-1, Math.min(1, score));
  }

  /**
   * Virtue ethics analysis
   */
  private virtueEthicsAnalysis(description: string): number {
    const virtues = /\b(courage|compassion|honesty|loyalty|wisdom|temperance|justice|generosity)\b/gi;
    const vices = /\b(cowardice|cruelty|deceit|betrayal|foolishness|excess|injustice|greed)\b/gi;
    
    const virtueCount = (description.match(virtues) || []).length;
    const viceCount = (description.match(vices) || []).length;
    
    const score = (virtueCount - viceCount) / Math.max(1, virtueCount + viceCount + 1);
    return Math.max(-1, Math.min(1, score));
  }

  /**
   * Care ethics analysis
   */
  private careEthicsAnalysis(description: string): number {
    const careIndicators = /\b(care|protect|nurture|support|love|help|comfort|empathy)\b/gi;
    const harmIndicators = /\b(abandon|neglect|hurt|ignore|indifference)\b/gi;
    
    const careCount = (description.match(careIndicators) || []).length;
    const harmCount = (description.match(harmIndicators) || []).length;
    
    const score = (careCount - harmCount) / Math.max(1, careCount + harmCount + 1);
    return Math.max(-1, Math.min(1, score));
  }

  /**
   * Identify ethical conflicts
   */
  private identifyEthicalConflicts(
    util: number,
    deont: number,
    virtue: number,
    care: number
  ): EthicalConflict[] {
    const conflicts: EthicalConflict[] = [];
    
    // Check for significant differences
    if (Math.abs(util - deont) > 0.5) {
      conflicts.push({
        framework1: 'utilitarian',
        framework2: 'deontological',
        nature: util > deont ? 'utilitarian favors action' : 'deontological opposes action',
        severity: Math.abs(util - deont) * 10,
        resolution: 'unresolved'
      });
    }
    
    if (Math.abs(util - care) > 0.5) {
      conflicts.push({
        framework1: 'utilitarian',
        framework2: 'care-ethics',
        nature: 'impersonal vs personal considerations',
        severity: Math.abs(util - care) * 10,
        resolution: 'unresolved'
      });
    }
    
    return conflicts;
  }

  /**
   * Generate ethical reasoning
   */
  private generateEthicalReasoning(util: number, deont: number, virtue: number, care: number): string {
    const assessments: string[] = [];
    
    if (util > 0.3) assessments.push('Utilitarian perspective supports this action');
    else if (util < -0.3) assessments.push('Utilitarian perspective opposes this action');
    
    if (deont > 0.3) assessments.push('Deontological ethics aligns with this choice');
    else if (deont < -0.3) assessments.push('Deontological ethics violates core principles');
    
    if (virtue > 0.3) assessments.push('Virtue ethics finds this action character-building');
    else if (virtue < -0.3) assessments.push('Virtue ethics sees this as morally corrupting');
    
    if (care > 0.3) assessments.push('Care ethics supports this compassionate choice');
    else if (care < -0.3) assessments.push('Care ethics sees this as harmful to relationships');
    
    return assessments.join('. ') || 'Ethically neutral action';
  }

  /**
   * Extract action from description
   */
  private extractAction(description: string): string {
    const match = description.match(/^(?:to\s+)?(\w+)/i);
    return match ? match[1] : 'action';
  }

  /**
   * Predict outcomes
   */
  private predictOutcomes(description: string): PredictedOutcome[] {
    const outcomes: PredictedOutcome[] = [];
    
    // Extract likely outcomes from description
    if (/\b(save|rescue)\b/i.test(description)) {
      outcomes.push({
        description: 'Lives saved',
        probability: 0.8,
        impact: 8,
        affected: ['multiple'],
        timeframe: 'immediate'
      });
    }
    
    if (/\b(kill|death)\b/i.test(description)) {
      outcomes.push({
        description: 'Death occurs',
        probability: 0.9,
        impact: -10,
        affected: ['target'],
        timeframe: 'immediate'
      });
    }
    
    if (/\b(betray|deceive)\b/i.test(description)) {
      outcomes.push({
        description: 'Trust damaged',
        probability: 0.7,
        impact: -6,
        affected: ['relationship'],
        timeframe: 'long-term'
      });
    }
    
    return outcomes;
  }

  /**
   * Identify sacrifices
   */
  private identifySacrifices(description: string): string[] {
    const sacrifices: string[] = [];
    
    if (/\b(sacrifice|give up|lose)\b/i.test(description)) {
      const match = description.match(/(?:sacrifice|give up|lose)\s+([^,.]+)/i);
      if (match) sacrifices.push(match[1].trim());
    }
    
    return sacrifices;
  }

  /**
   * Identify violations
   */
  private identifyViolations(description: string, morality: CharacterMorality | undefined): string[] {
    const violations: string[] = [];
    
    if (!morality) return violations;
    
    morality.frameworks.forEach(framework => {
      framework.principles.forEach(principle => {
        const violationPatterns = {
          'Duty': /\b(betray|abandon|fail)\b/i,
          'Greatest Good': /\b(harm|suffer|destroy)\b/i,
          'Human Dignity': /\b(torture|enslave|dehumanize)\b/i,
          'Caring': /\b(neglect|abandon|hurt)\b/i
        };
        
        const pattern = violationPatterns[principle.name as keyof typeof violationPatterns];
        if (pattern && pattern.test(description)) {
          violations.push(principle.name);
        }
      });
    });
    
    return violations;
  }

  /**
   * Calculate character alignment
   */
  private calculateCharacterAlignment(analysis: EthicalAnalysis, morality: CharacterMorality | undefined): number {
    if (!morality) return analysis.overallScore;
    
    // Weight by character's primary framework
    const primaryFramework = morality.frameworks[0]?.type;
    
    let weightedScore = analysis.overallScore;
    
    switch (primaryFramework) {
      case 'utilitarian':
        weightedScore = analysis.utilitarianScore * 0.6 + analysis.overallScore * 0.4;
        break;
      case 'deontological':
        weightedScore = analysis.deontologicalScore * 0.6 + analysis.overallScore * 0.4;
        break;
      case 'virtue-ethics':
        weightedScore = analysis.virtueEthicsScore * 0.6 + analysis.overallScore * 0.4;
        break;
      case 'care-ethics':
        weightedScore = analysis.careEthicsScore * 0.6 + analysis.overallScore * 0.4;
        break;
    }
    
    return weightedScore;
  }

  /**
   * Extract context
   */
  private extractContext(situation: string): string {
    return situation.substring(0, 200);
  }

  /**
   * Identify stakeholders
   */
  private identifyStakeholders(situation: string): Stakeholder[] {
    const stakeholders: Stakeholder[] = [];
    
    // Default stakeholders
    stakeholders.push({
      characterId: 'protagonist',
      interest: 'survival and success',
      vulnerability: 5,
      relationshipToDecider: 'self',
      moralWeight: 0.5
    });
    
    if (/\b(innocent|civilian|child)\b/i.test(situation)) {
      stakeholders.push({
        characterId: 'innocents',
        interest: 'safety and life',
        vulnerability: 9,
        relationshipToDecider: 'innocent party',
        moralWeight: 0.9
      });
    }
    
    if (/\b(enemy|villain|antagonist)\b/i.test(situation)) {
      stakeholders.push({
        characterId: 'antagonist',
        interest: 'their goals',
        vulnerability: 3,
        relationshipToDecider: 'opposition',
        moralWeight: 0.3
      });
    }
    
    return stakeholders;
  }

  /**
   * Assess urgency
   */
  private assessUrgency(situation: string): number {
    const urgencyIndicators = /\b(immediately|now|urgent|seconds|before it|too late)\b/gi;
    const matches = situation.match(urgencyIndicators);
    return matches ? Math.min(10, 5 + matches.length * 2) : 5;
  }

  /**
   * Assess complexity
   */
  private assessComplexity(situation: string, options: string[]): number {
    let complexity = options.length;
    
    if (/\b(but|however|although|despite)\b/i.test(situation)) complexity += 2;
    if (/\b(if|unless|whether)\b/i.test(situation)) complexity += 2;
    
    return Math.min(10, complexity);
  }

  /**
   * Assess thematic significance
   */
  private assessThematicSignificance(situation: string): string {
    const themes: string[] = [];
    
    if (/\b(sacrifice)\b/i.test(situation)) themes.push('sacrifice');
    if (/\b(justice|right|wrong)\b/i.test(situation)) themes.push('justice');
    if (/\b(life|death)\b/i.test(situation)) themes.push('mortality');
    if (/\b(truth|lie|honest)\b/i.test(situation)) themes.push('truth');
    if (/\b(loyalty|betray)\b/i.test(situation)) themes.push('loyalty');
    
    return themes.length > 0 ? themes.join(', ') : 'moral choice';
  }

  /**
   * Record moral decision
   */
  public recordDecision(
    dilemmaId: string,
    chosenOptionId: string,
    characterId: string,
    reasoning: string,
    chapter: number
  ): MoralDecision {
    const dilemma = this.dilemmas.get(dilemmaId);
    const morality = this.characterMoralities.get(characterId);
    
    if (!dilemma || !morality) {
      throw new Error('Dilemma or morality not found');
    }
    
    const chosenOption = dilemma.options.find(o => o.id === chosenOptionId);
    if (!chosenOption) {
      throw new Error('Option not found');
    }
    
    // Update dilemma
    dilemma.chosenOption = chosenOptionId;
    dilemma.reasoning = reasoning;
    
    // Create decision record
    const decision: MoralDecision = {
      id: uuidv4(),
      chapter,
      dilemmaId,
      choice: chosenOption.description,
      reasoning,
      emotionalState: 'determined',
      regret: 0,
      growth: ''
    };
    
    // Update character morality
    morality.history.push(decision);
    this.updateAlignment(morality, chosenOption.alignment, chapter);
    this.updateReputation(morality, chosenOption.alignment);
    
    // Generate consequences
    const consequences = this.generateConsequences(dilemma, chosenOption, chapter);
    dilemma.consequences = consequences;
    
    return decision;
  }

  /**
   * Update alignment
   */
  private updateAlignment(morality: CharacterMorality, shift: number, chapter: number): void {
    const oldPosition = morality.alignment.position;
    const newPosition = Math.max(-1, Math.min(1, oldPosition + shift * 0.1));
    
    if (Math.abs(newPosition - oldPosition) > 0.05) {
      morality.alignment.evolution.push({
        chapter,
        oldPosition,
        newPosition,
        event: 'moral decision',
        reason: 'consequence of choice'
      });
      
      morality.alignment.position = newPosition;
    }
  }

  /**
   * Update reputation
   */
  private updateReputation(morality: CharacterMorality, shift: number): void {
    morality.reputation.actual = morality.alignment.position;
    morality.reputation.discrepancy = Math.abs(morality.reputation.self - morality.reputation.actual);
  }

  /**
   * Generate consequences
   */
  private generateConsequences(dilemma: MoralDilemma, option: MoralOption, chapter: number): MoralConsequence[] {
    const consequences: MoralConsequence[] = [];
    
    // Generate intended consequences
    option.predictedOutcomes.forEach(outcome => {
      if (Math.random() < outcome.probability) {
        consequences.push({
          id: uuidv4(),
          chapter,
          type: 'intended',
          description: outcome.description,
          severity: Math.abs(outcome.impact),
          affected: outcome.affected,
          wasPredicted: true,
          moralImplications: outcome.impact > 0 ? 'positive moral impact' : 'negative moral impact',
          ongoing: outcome.timeframe === 'long-term' || outcome.timeframe === 'permanent'
        });
      }
    });
    
    // Generate unintended consequences
    if (option.violationOf.length > 0) {
      consequences.push({
        id: uuidv4(),
        chapter,
        type: 'unintended',
        description: `Violated principles: ${option.violationOf.join(', ')}`,
        severity: 5,
        affected: [dilemma.stakeholders[0]?.characterId || 'self'],
        wasPredicted: false,
        moralImplications: 'moral compromise detected',
        ongoing: true
      });
    }
    
    return consequences;
  }

  /**
   * Create moral event
   */
  private createMoralEvent(
    type: MoralEventType,
    description: string,
    participants: string[],
    chapter: number,
    relatedId?: string
  ): MoralEvent {
    const event: MoralEvent = {
      id: uuidv4(),
      chapter,
      type,
      description,
      participants,
      ethicalImplications: this.extractEthicalImplications(description),
      thematicTags: this.extractThematicTags(description),
      significance: this.assessEventSignificance(type, description)
    };
    
    this.moralEvents.push(event);
    return event;
  }

  /**
   * Extract ethical implications
   */
  private extractEthicalImplications(description: string): string[] {
    const implications: string[] = [];
    
    if (/\b(kill|death)\b/i.test(description)) implications.push('sanctity of life');
    if (/\b(lie|deceive)\b/i.test(description)) implications.push('honesty');
    if (/\b(betray)\b/i.test(description)) implications.push('loyalty');
    if (/\b(sacrifice)\b/i.test(description)) implications.push('self-interest vs others');
    
    return implications;
  }

  /**
   * Extract thematic tags
   */
  private extractThematicTags(description: string): string[] {
    const tags: string[] = [];
    
    if (/\b(power)\b/i.test(description)) tags.push('power');
    if (/\b(freedom)\b/i.test(description)) tags.push('freedom');
    if (/\b(justice)\b/i.test(description)) tags.push('justice');
    if (/\b(redemption)\b/i.test(description)) tags.push('redemption');
    
    return tags;
  }

  /**
   * Assess event significance
   */
  private assessEventSignificance(type: MoralEventType, description: string): number {
    const typeWeights: Record<MoralEventType, number> = {
      'dilemma': 7,
      'sacrifice': 9,
      'betrayal': 8,
      'redemption': 8,
      'moral-choice': 6,
      'consequence': 5,
      'revelation': 6,
      'test': 7
    };
    
    return typeWeights[type] || 5;
  }

  /**
   * Generate ethical evaluation
   */
  public generateEthicalEvaluation(dilemmaId: string, characterId: string): EthicalEvaluation {
    const dilemma = this.dilemmas.get(dilemmaId);
    const morality = this.characterMoralities.get(characterId);
    
    if (!dilemma || !morality) {
      throw new Error('Dilemma or morality not found');
    }
    
    // Find best option for character
    const bestOption = dilemma.options.reduce((best, option) => {
      return option.characterAlignment > best.characterAlignment ? option : best;
    }, dilemma.options[0]);
    
    return {
      id: uuidv4(),
      dilemmaId,
      characterId,
      analysis: this.generateComprehensiveAnalysis(dilemma, morality),
      recommendation: bestOption.description,
      confidence: Math.abs(bestOption.characterAlignment),
      considerations: this.generateConsiderations(dilemma, morality),
      warnings: this.generateWarnings(dilemma, bestOption)
    };
  }

  /**
   * Generate comprehensive analysis
   */
  private generateComprehensiveAnalysis(dilemma: MoralDilemma, morality: CharacterMorality): string {
    const parts: string[] = [];
    
    parts.push(`This dilemma involves ${dilemma.stakeholders.length} stakeholders.`);
    parts.push(`The situation has urgency level ${dilemma.urgency}/10.`);
    
    const frameworks = morality.frameworks.map(f => f.name).join(', ');
    parts.push(`The character operates from ${frameworks} framework(s).`);
    
    return parts.join(' ');
  }

  /**
   * Generate considerations
   */
  private generateConsiderations(dilemma: MoralDilemma, morality: CharacterMorality): string[] {
    const considerations: string[] = [];
    
    dilemma.options.forEach(option => {
      if (option.ethicalAnalysis.conflicts.length > 0) {
        considerations.push(`Option "${option.description}" creates ethical conflicts`);
      }
    });
    
    morality.frameworks.forEach(framework => {
      considerations.push(`Consider ${framework.name} principles`);
    });
    
    return considerations;
  }

  /**
   * Generate warnings
   */
  private generateWarnings(dilemma: MoralDilemma, option: MoralOption): string[] {
    const warnings: string[] = [];
    
    if (option.violationOf.length > 0) {
      warnings.push(`This option violates: ${option.violationOf.join(', ')}`);
    }
    
    if (option.ethicalAnalysis.overallScore < -0.5) {
      warnings.push('This option has significant negative ethical implications');
    }
    
    return warnings;
  }

  // ===== PUBLIC API =====

  /**
   * Get character morality
   */
  public getCharacterMorality(characterId: string): CharacterMorality | undefined {
    return this.characterMoralities.get(characterId);
  }

  /**
   * Get dilemma
   */
  public getDilemma(dilemmaId: string): MoralDilemma | undefined {
    return this.dilemmas.get(dilemmaId);
  }

  /**
   * Get all dilemmas
   */
  public getAllDilemmas(): MoralDilemma[] {
    return Array.from(this.dilemmas.values());
  }

  /**
   * Get moral events
   */
  public getMoralEvents(): MoralEvent[] {
    return this.moralEvents;
  }

  /**
   * Get ethical themes
   */
  public getEthicalThemes(): EthicalTheme[] {
    return Array.from(this.ethicalThemes.values());
  }

  /**
   * Get dilemmas by chapter
   */
  public getDilemmasByChapter(chapter: number): MoralDilemma[] {
    return Array.from(this.dilemmas.values()).filter(d => d.chapter === chapter);
  }

  /**
   * Get moral history for character
   */
  public getMoralHistory(characterId: string): MoralDecision[] {
    const morality = this.characterMoralities.get(characterId);
    return morality ? morality.history : [];
  }

  /**
   * Get consequences for dilemma
   */
  public getConsequences(dilemmaId: string): MoralConsequence[] {
    const dilemma = this.dilemmas.get(dilemmaId);
    return dilemma ? dilemma.consequences : [];
  }

  /**
   * Clear all data
   */
  public clearAllData(): void {
    this.characterMoralities.clear();
    this.dilemmas.clear();
    this.ethicalThemes.clear();
    this.moralEvents = [];
    this.globalConsequences = [];
  }
}