/**
 * CharacterContinuityGenome - Character Coherence & Consistency System
 * 
 * Tracks character traits, evolution, relationships, and ensures
 * consistent character behavior across the narrative.
 * 
 * Enhanced with real-time web search for character development best practices,
 * character archetype databases, and personality consistency frameworks.
 */

import { webSearchIntegration } from './WebSearchIntegration';
import type { WebSearchResult, TechnicalSearchResult, LiterarySearchResult } from './WebSearchIntegration';

// ============================================================================
// INTERFACES
// ============================================================================

export interface CharacterGenome {
  id: string;
  name: string;
  coreTraits: CoreTrait[];
  personalityMatrix: PersonalityMatrix;
  emotionalBaseline: EmotionalBaseline;
  relationshipGenome: RelationshipGene[];
  behavioralPatterns: BehavioralPattern[];
  growthVector: GrowthVector;
  memoryGenome: MemoryGene;
  physicalGenome: PhysicalGene;
  skillGenome: SkillGene[];
  backstoryGenome: BackstoryGene;
  arcProgress: ArcProgress;
}

export interface CoreTrait {
  trait: string;
  intensity: number; // 0-1
  flexibility: number; // 0-1 (how much it can change)
  visibility: number; // 0-1 (how obvious to others)
  development: TraitDevelopment[];
}

export interface TraitDevelopment {
  chapter: number;
  change: number; // -1 to 1
  trigger: string;
  newIntensity: number;
}

export interface PersonalityMatrix {
  openness: number; // 0-1
  conscientiousness: number; // 0-1
  extraversion: number; // 0-1
  agreeableness: number; // 0-1
  neuroticism: number; // 0-1
  stability: number; // 0-1 (how stable these are)
}

export interface EmotionalBaseline {
  defaultMood: string;
  emotionalRange: number; // 0-1
  recoveryRate: number; // 0-1
  triggerThresholds: EmotionalTrigger[];
  emotionalMemory: EmotionalMemory[];
}

export interface EmotionalTrigger {
  trigger: string;
  emotion: string;
  intensity: number; // 0-1
  recoveryTime: number; // chapters
}

export interface EmotionalMemory {
  chapter: number;
  emotion: string;
  intensity: number;
  cause: string;
  resolution?: string;
}

export interface RelationshipGene {
  characterId: string;
  relationshipType: 'family' | 'friend' | 'enemy' | 'ally' | 'romantic' | 'rival' | 'neutral';
  depth: number; // 0-1
  trust: number; // -1 to 1
  respect: number; // -1 to 1
  history: RelationshipEvent[];
  currentDynamic: string;
  tensionLevel: number; // 0-1
}

export interface RelationshipEvent {
  chapter: number;
  type: 'positive' | 'negative' | 'neutral' | 'conflict' | 'bonding';
  description: string;
  trustChange: number;
  respectChange: number;
}

export interface BehavioralPattern {
  pattern: string;
  frequency: number; // 0-1
  conditions: string[]; // When this pattern manifests
  lastManifested: number; // Chapter
  consistency: number; // 0-1
}

export interface GrowthVector {
  direction: string;
  speed: number; // 0-1
  blocks: GrowthBlock[];
  accelerators: string[];
  milestones: GrowthMilestone[];
}

export interface GrowthBlock {
  block: string;
  intensity: number; // 0-1
  resolved: boolean;
  resolutionChapter?: number;
}

export interface GrowthMilestone {
  chapter: number;
  type: 'realization' | 'breakthrough' | 'setback' | 'transformation';
  description: string;
  impact: number; // 0-1
}

export interface MemoryGene {
  shortTerm: MemoryEntry[];
  longTerm: MemoryEntry[];
  traumatic: MemoryEntry[];
  significant: MemoryEntry[];
  forgetfulness: number; // 0-1
}

export interface MemoryEntry {
  chapter: number;
  content: string;
  importance: number; // 0-1
  emotionalWeight: number; // 0-1
  lastReferenced: number;
  referenceCount: number;
}

export interface PhysicalGene {
  appearance: AppearanceProfile;
  capabilities: PhysicalCapability[];
  limitations: PhysicalLimitation[];
  changes: PhysicalChange[];
}

export interface AppearanceProfile {
  height: string;
  build: string;
  hairColor: string;
  eyeColor: string;
  distinguishingFeatures: string[];
  age: number;
  apparentAge: number;
}

export interface PhysicalCapability {
  capability: string;
  level: number; // 0-1
  growth: number; // rate of improvement
}

export interface PhysicalLimitation {
  limitation: string;
  severity: number; // 0-1
  impact: string;
}

export interface PhysicalChange {
  chapter: number;
  change: string;
  reason: string;
  permanent: boolean;
}

export interface SkillGene {
  skillId: string;
  name: string;
  category: 'combat' | 'magic' | 'social' | 'technical' | 'survival' | 'knowledge';
  level: number; // 0-100
  experience: number;
  potential: number; // 0-1
  learningRate: number; // 0-1
  prerequisites: string[];
  developments: SkillDevelopment[];
}

export interface SkillDevelopment {
  chapter: number;
  experienceGained: number;
  newLevel?: number;
  trigger: string;
}

export interface BackstoryGene {
  origin: string;
  formativeEvents: FormativeEvent[];
  secrets: CharacterSecret[];
  unresolvedMysteries: string[];
  definingMoments: string[];
}

export interface FormativeEvent {
  age: number;
  event: string;
  impact: string;
  traitsAffected: string[];
}

export interface CharacterSecret {
  secret: string;
  knownBy: string[];
  chapterRevealed?: number;
  impact: string;
}

export interface ArcProgress {
  currentArc: string;
  progress: number; // 0-1
  stage: 'setup' | 'development' | 'crisis' | 'climax' | 'resolution';
  keyMoments: ArcMoment[];
  projectedResolution: number; // chapter
}

export interface ArcMoment {
  chapter: number;
  type: 'decision' | 'revelation' | 'confrontation' | 'growth' | 'setback';
  description: string;
  significance: number; // 0-1
}

export interface ContinuityCheck {
  characterId: string;
  chapter: number;
  checks: ContinuityIssue[];
  overallConsistency: number; // 0-1
  recommendations: string[];
}

export interface ContinuityIssue {
  type: 'trait_violation' | 'memory_inconsistency' | 'relationship_mismatch' | 'behavioral_off' | 'skill_discrepancy' | 'physical_inconsistency';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  expectedValue: string;
  actualValue: string;
  suggestion: string;
}

// ============================================================================
// CHARACTER CONTINUITY GENOME SYSTEM
// ============================================================================

export class CharacterContinuityGenome {
  private genomes: Map<string, CharacterGenome> = new Map();
  private continuityChecks: Map<string, ContinuityCheck[]> = new Map();
  
  // Web search integration
  private developmentBestPracticesCache: Map<string, TechnicalSearchResult[]> = new Map();
  private archetypeDatabaseCache: Map<string, LiterarySearchResult[]> = new Map();
  private personalityFrameworksCache: Map<string, WebSearchResult[]> = new Map();
  private relationshipPatternsCache: Map<string, WebSearchResult[]> = new Map();
  
  // Consistency thresholds
  private readonly CONSISTENCY_THRESHOLD = 0.8;
  private readonly TRAIT_FLEXIBILITY_THRESHOLD = 0.3;
  private readonly MEMORY_IMPORTANCE_THRESHOLD = 0.6;

  constructor() {
    this.initializeCharacterGenomes();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initializeCharacterGenomes(): void {
    // Kael's Genome
    this.createCharacterGenome({
      id: 'kael',
      name: 'Kael',
      coreTraits: [
        {
          trait: 'Protective of Family',
          intensity: 0.95,
          flexibility: 0.2,
          visibility: 0.8,
          development: [
            { chapter: 1, change: 0, trigger: 'Initial state', newIntensity: 0.95 }
          ]
        },
        {
          trait: 'Analytical Thinker',
          intensity: 0.75,
          flexibility: 0.4,
          visibility: 0.7,
          development: [
            { chapter: 1, change: 0, trigger: 'Initial state', newIntensity: 0.75 }
          ]
        },
        {
          trait: 'Reluctant Hero',
          intensity: 0.65,
          flexibility: 0.6,
          visibility: 0.9,
          development: [
            { chapter: 1, change: 0, trigger: 'Initial state', newIntensity: 0.65 }
          ]
        },
        {
          trait: 'Self-Doubting',
          intensity: 0.6,
          flexibility: 0.7,
          visibility: 0.5,
          development: [
            { chapter: 1, change: 0, trigger: 'Initial state', newIntensity: 0.6 }
          ]
        },
        {
          trait: 'Adaptable',
          intensity: 0.7,
          flexibility: 0.5,
          visibility: 0.6,
          development: [
            { chapter: 1, change: 0, trigger: 'Initial state', newIntensity: 0.7 }
          ]
        }
      ],
      personalityMatrix: {
        openness: 0.7,
        conscientiousness: 0.65,
        extraversion: 0.4,
        agreeableness: 0.6,
        neuroticism: 0.55,
        stability: 0.6
      },
      emotionalBaseline: {
        defaultMood: 'anxious_determination',
        emotionalRange: 0.7,
        recoveryRate: 0.5,
        triggerThresholds: [
          { trigger: 'Yuna in danger', emotion: 'fear', intensity: 0.95, recoveryTime: 3 },
          { trigger: 'Being deceived', emotion: 'anger', intensity: 0.8, recoveryTime: 2 },
          { trigger: 'Success in protecting others', emotion: 'relief', intensity: 0.7, recoveryTime: 1 }
        ],
        emotionalMemory: []
      },
      relationshipGenome: [
        {
          characterId: 'yuna',
          relationshipType: 'family',
          depth: 0.95,
          trust: 0.9,
          respect: 0.85,
          history: [],
          currentDynamic: 'Protective brother dealing with sister\'s illness',
          tensionLevel: 0.7
        }
      ],
      behavioralPatterns: [
        { pattern: 'Hesitates before action', frequency: 0.7, conditions: ['uncertainty', 'high stakes'], lastManifested: 1, consistency: 0.8 },
        { pattern: 'Thinks out loud', frequency: 0.5, conditions: ['problem-solving'], lastManifested: 2, consistency: 0.7 },
        { pattern: 'Deflects personal questions', frequency: 0.6, conditions: ['emotional vulnerability'], lastManifested: 3, consistency: 0.75 }
      ],
      growthVector: {
        direction: 'From reluctance to acceptance of responsibility',
        speed: 0.4,
        blocks: [
          { block: 'Fear of failure', intensity: 0.6, resolved: false },
          { block: 'Imposter syndrome', intensity: 0.5, resolved: false }
        ],
        accelerators: ['Success experiences', 'Support from allies'],
        milestones: []
      },
      memoryGenome: {
        shortTerm: [],
        longTerm: [
          { chapter: 1, content: 'Awakened in new reality', importance: 1.0, emotionalWeight: 0.9, lastReferenced: 1, referenceCount: 1 }
        ],
        traumatic: [],
        significant: [
          { chapter: 1, content: 'Discovered sister\'s mysterious illness', importance: 0.95, emotionalWeight: 0.95, lastReferenced: 5, referenceCount: 3 }
        ],
        forgetfulness: 0.2
      },
      physicalGenome: {
        appearance: {
          height: '5\'10"',
          build: 'Lean, slightly athletic',
          hairColor: 'Dark brown',
          eyeColor: 'Brown',
          distinguishingFeatures: ['Sharp jawline', 'Tired eyes'],
          age: 19,
          apparentAge: 19
        },
        capabilities: [
          { capability: 'Endurance', level: 0.6, growth: 0.1 },
          { capability: 'Agility', level: 0.55, growth: 0.15 }
        ],
        limitations: [
          { limitation: 'Sleep deprivation', severity: 0.4, impact: 'Reduced alertness' }
        ],
        changes: []
      },
      skillGenome: [
        { skillId: 'analysis', name: 'Analytical Thinking', category: 'knowledge', level: 70, experience: 500, potential: 0.9, learningRate: 0.7, prerequisites: [], developments: [] },
        { skillId: 'progenitor_powers', name: 'Progenitor Abilities', category: 'magic', level: 5, experience: 50, potential: 1.0, learningRate: 0.3, prerequisites: [], developments: [] }
      ],
      backstoryGenome: {
        origin: 'Unknown - awakened in new reality',
        formativeEvents: [
          { age: 16, event: 'Parents disappeared under mysterious circumstances', impact: 'Deepened bond with sister', traitsAffected: ['Protective of Family', 'Self-Doubting'] }
        ],
        secrets: [
          { secret: 'True nature as Progenitor descendant', knownBy: [], impact: 'Will change everything he believes about himself' }
        ],
        unresolvedMysteries: ['What happened to his parents?', 'What is the source of his powers?'],
        definingMoments: ['Choosing to protect Yuna over escaping']
      },
      arcProgress: {
        currentArc: 'Identity and Power Discovery',
        progress: 0.1,
        stage: 'setup',
        keyMoments: [],
        projectedResolution: 50
      }
    });

    // Yuna's Genome
    this.createCharacterGenome({
      id: 'yuna',
      name: 'Yuna',
      coreTraits: [
        {
          trait: 'Independently Spirited',
          intensity: 0.8,
          flexibility: 0.3,
          visibility: 0.7,
          development: [{ chapter: 1, change: 0, trigger: 'Initial state', newIntensity: 0.8 }]
        },
        {
          trait: 'Resilient',
          intensity: 0.85,
          flexibility: 0.2,
          visibility: 0.6,
          development: [{ chapter: 1, change: 0, trigger: 'Initial state', newIntensity: 0.85 }]
        },
        {
          trait: 'Emotionally Intelligent',
          intensity: 0.75,
          flexibility: 0.4,
          visibility: 0.8,
          development: [{ chapter: 1, change: 0, trigger: 'Initial state', newIntensity: 0.75 }]
        },
        {
          trait: 'Secretive About Pain',
          intensity: 0.7,
          flexibility: 0.5,
          visibility: 0.4,
          development: [{ chapter: 1, change: 0, trigger: 'Initial state', newIntensity: 0.7 }]
        }
      ],
      personalityMatrix: {
        openness: 0.65,
        conscientiousness: 0.7,
        extraversion: 0.5,
        agreeableness: 0.75,
        neuroticism: 0.45,
        stability: 0.55
      },
      emotionalBaseline: {
        defaultMood: 'weary_optimism',
        emotionalRange: 0.6,
        recoveryRate: 0.4,
        triggerThresholds: [
          { trigger: 'Kael in danger', emotion: 'fear', intensity: 0.85, recoveryTime: 2 },
          { trigger: 'Being treated as helpless', emotion: 'frustration', intensity: 0.7, recoveryTime: 1 }
        ],
        emotionalMemory: []
      },
      relationshipGenome: [
        {
          characterId: 'kael',
          relationshipType: 'family',
          depth: 0.95,
          trust: 0.95,
          respect: 0.9,
          history: [],
          currentDynamic: 'Sister trying not to burden brother with her condition',
          tensionLevel: 0.5
        }
      ],
      behavioralPatterns: [
        { pattern: 'Deflects with "I\'m fine"', frequency: 0.75, conditions: ['pain', 'weakness'], lastManifested: 5, consistency: 0.85 },
        { pattern: 'Changes subject when worried', frequency: 0.6, conditions: ['concern about her'], lastManifested: 4, consistency: 0.7 },
        { pattern: 'Shows care through actions not words', frequency: 0.7, conditions: ['emotional moments'], lastManifested: 3, consistency: 0.8 }
      ],
      growthVector: {
        direction: 'From hiding weakness to accepting help',
        speed: 0.3,
        blocks: [
          { block: 'Guilt about burdening Kael', intensity: 0.7, resolved: false },
          { block: 'Fear of losing autonomy', intensity: 0.6, resolved: false }
        ],
        accelerators: ['Proof that accepting help isn\'t weakness'],
        milestones: []
      },
      memoryGenome: {
        shortTerm: [],
        longTerm: [],
        traumatic: [
          { chapter: 1, content: 'First symptoms of mysterious illness', importance: 0.95, emotionalWeight: 0.9, lastReferenced: 5, referenceCount: 2 }
        ],
        significant: [],
        forgetfulness: 0.25
      },
      physicalGenome: {
        appearance: {
          height: '5\'6"',
          build: 'Slender, weakened by illness',
          hairColor: 'Black',
          eyeColor: 'Dark brown',
          distinguishingFeatures: ['Pale complexion', 'Fragile appearance'],
          age: 16,
          apparentAge: 16
        },
        capabilities: [
          { capability: 'Endurance', level: 0.3, growth: -0.1 },
          { capability: 'Perception', level: 0.7, growth: 0.05 }
        ],
        limitations: [
          { limitation: 'Mysterious illness', severity: 0.8, impact: 'Progressive weakness, fatigue' }
        ],
        changes: [
          { chapter: 5, change: 'Visible weakening', reason: 'Illness progression', permanent: false }
        ]
      },
      skillGenome: [
        { skillId: 'perception', name: 'Intuitive Perception', category: 'social', level: 65, experience: 400, potential: 0.85, learningRate: 0.6, prerequisites: [], developments: [] }
      ],
      backstoryGenome: {
        origin: 'Same as Kael - their shared past is mysterious',
        formativeEvents: [
          { age: 14, event: 'Parents disappeared', impact: 'Forced to grow up quickly', traitsAffected: ['Resilient', 'Independently Spirited'] },
          { age: 15, event: 'First symptoms of illness appeared', impact: 'Changed her outlook on life', traitsAffected: ['Secretive About Pain'] }
        ],
        secrets: [
          { secret: 'The illness may be connected to something larger', knownBy: [], impact: 'Could be the key to understanding the system' }
        ],
        unresolvedMysteries: ['What is the true cause of her illness?', 'Is there a cure?'],
        definingMoments: ['Choosing to keep her condition hidden initially']
      },
      arcProgress: {
        currentArc: 'Survival and Mystery',
        progress: 0.15,
        stage: 'setup',
        keyMoments: [],
        projectedResolution: 40
      }
    });
  }

  private createCharacterGenome(genome: CharacterGenome): void {
    this.genomes.set(genome.id, genome);
  }

  // ============================================================================
  // WEB SEARCH INTEGRATION
  // ============================================================================

  /**
   * Search for character development best practices
   */
  async searchDevelopmentBestPractices(
    characterType: string,
    aspect: string
  ): Promise<TechnicalSearchResult[]> {
    const key = `${characterType}-${aspect}`;
    if (this.developmentBestPracticesCache.has(key)) {
      return this.developmentBestPracticesCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchWritingBestPractices(
      `${characterType} ${aspect} development`
    );
    this.developmentBestPracticesCache.set(key, results);
    return results;
  }

  /**
   * Research character archetype databases
   */
  async searchCharacterArchetype(
    archetype: string,
    role: string
  ): Promise<LiterarySearchResult[]> {
    const key = `${archetype}-${role}`;
    if (this.archetypeDatabaseCache.has(key)) {
      return this.archetypeDatabaseCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchLiteraryExamples(
      `${archetype} ${role} archetype`,
      'fiction'
    );
    this.archetypeDatabaseCache.set(key, results);
    return results;
  }

  /**
   * Find personality consistency frameworks
   */
  async searchPersonalityFrameworks(
    personalityType: string
  ): Promise<WebSearchResult[]> {
    const key = personalityType;
    if (this.personalityFrameworksCache.has(key)) {
      return this.personalityFrameworksCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${personalityType} personality psychology character writing`
    );
    this.personalityFrameworksCache.set(key, results);
    return results;
  }

  /**
   * Look up character relationship patterns
   */
  async searchRelationshipPatterns(
    relationshipType: string,
    dynamic: string
  ): Promise<WebSearchResult[]> {
    const key = `${relationshipType}-${dynamic}`;
    if (this.relationshipPatternsCache.has(key)) {
      return this.relationshipPatternsCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${relationshipType} relationship ${dynamic} fiction writing`
    );
    this.relationshipPatternsCache.set(key, results);
    return results;
  }

  /**
   * Validate character behavior with web research
   */
  async validateBehaviorWithWebResearch(
    characterId: string,
    action: string,
    chapter: number,
    context?: string
  ): Promise<ContinuityCheck & { webInsights: WebSearchResult[] }> {
    // Standard continuity check
    const standardCheck = this.checkContinuity(characterId, action, chapter, context);
    
    // Get web research
    const genome = this.genomes.get(characterId);
    if (genome) {
      const personalityType = genome.coreTraits[0]?.trait || 'protagonist';
      const archetypes = await this.searchCharacterArchetype(
        personalityType,
        'main character'
      );
      
      const frameworks = await this.searchPersonalityFrameworks(
        personalityType
      );
      
      const allInsights = [...archetypes, ...frameworks];
      
      // Enhance validation with insights
      const enhancedRecommendations = [...standardCheck.recommendations];
      for (const insight of allInsights) {
        if (insight.relevance > 0.7) {
          const sentences = insight.snippet.split(/[.!?]/).filter(s => s.trim().length > 15);
          if (sentences.length > 0) {
            enhancedRecommendations.push(sentences[0].trim());
          }
        }
      }
      
      return {
        ...standardCheck,
        recommendations: enhancedRecommendations.slice(0, 5),
        webInsights: allInsights
      };
    }
    
    return { ...standardCheck, webInsights: [] };
  }

  /**
   * Get character growth suggestions from web
   */
  async getGrowthSuggestions(
    characterId: string,
    currentStage: string
  ): Promise<string[]> {
    const results = await this.searchDevelopmentBestPractices(
      'character',
      `${currentStage} growth development`
    );
    
    const suggestions: string[] = [];
    for (const result of results) {
      if (result.practicalValue > 0.6) {
        const sentences = result.snippet.split(/[.!?]/).filter(s => s.trim().length > 15);
        if (sentences.length > 0) {
          suggestions.push(sentences[0].trim());
        }
      }
    }
    
    return suggestions.slice(0, 5);
  }

  /**
   * Clear web search cache
   */
  clearWebSearchCache(): void {
    this.developmentBestPracticesCache.clear();
    this.archetypeDatabaseCache.clear();
    this.personalityFrameworksCache.clear();
    this.relationshipPatternsCache.clear();
  }

  // ============================================================================
  // GENOME MANAGEMENT
  // ============================================================================

  getGenome(characterId: string): CharacterGenome | undefined {
    return this.genomes.get(characterId);
  }

  getAllGenomes(): CharacterGenome[] {
    return Array.from(this.genomes.values());
  }

  updateGenome(characterId: string, updates: Partial<CharacterGenome>): void {
    const genome = this.genomes.get(characterId);
    if (genome) {
      Object.assign(genome, updates);
    }
  }

  // ============================================================================
  // CONTINUITY CHECKING
  // ============================================================================

  /**
   * Check character continuity for an action or dialogue
   */
  checkContinuity(
    characterId: string,
    action: string,
    chapter: number,
    context?: string
  ): ContinuityCheck {
    const genome = this.genomes.get(characterId);
    const issues: ContinuityIssue[] = [];

    if (!genome) {
      return {
        characterId,
        chapter,
        checks: [],
        overallConsistency: 0,
        recommendations: [`No genome found for character: ${characterId}`]
      };
    }

    // Check trait consistency
    issues.push(...this.checkTraitConsistency(genome, action, chapter));

    // Check behavioral patterns
    issues.push(...this.checkBehavioralConsistency(genome, action, chapter));

    // Check emotional appropriateness
    issues.push(...this.checkEmotionalConsistency(genome, action, chapter));

    // Check skill capabilities
    issues.push(...this.checkSkillConsistency(genome, action, chapter));

    // Calculate overall consistency
    const overallConsistency = this.calculateOverallConsistency(issues);

    // Generate recommendations
    const recommendations = this.generateContinuityRecommendations(issues, genome);

    const check: ContinuityCheck = {
      characterId,
      chapter,
      checks: issues,
      overallConsistency,
      recommendations
    };

    // Store check
    if (!this.continuityChecks.has(characterId)) {
      this.continuityChecks.set(characterId, []);
    }
    this.continuityChecks.get(characterId)!.push(check);

    return check;
  }

  private checkTraitConsistency(genome: CharacterGenome, action: string, chapter: number): ContinuityIssue[] {
    const issues: ContinuityIssue[] = [];
    const lowerAction = action.toLowerCase();

    // Check each core trait
    genome.coreTraits.forEach(trait => {
      const expectedBehavior = this.getExpectedBehaviorForTrait(trait.trait);
      const contradicts = this.actionContradictsTrait(lowerAction, trait.trait, expectedBehavior);

      if (contradicts && trait.flexibility < this.TRAIT_FLEXIBILITY_THRESHOLD) {
        issues.push({
          type: 'trait_violation',
          severity: trait.intensity > 0.8 ? 'major' : 'moderate',
          description: `Action may contradict "${trait.trait}" trait`,
          expectedValue: `Behavior consistent with ${trait.trait}`,
          actualValue: action,
          suggestion: `Consider how this action aligns with the character's ${trait.trait} trait, or show the internal conflict`
        });
      }
    });

    return issues;
  }

  private getExpectedBehaviorForTrait(trait: string): string[] {
    const behaviors: Record<string, string[]> = {
      'Protective of Family': ['protect', 'defend', 'worry about', 'prioritize family'],
      'Analytical Thinker': ['analyze', 'consider', 'plan', 'think through'],
      'Reluctant Hero': ['hesitate', 'question', 'reluctant', 'doubt'],
      'Self-Doubting': ['doubt', 'question self', 'hesitate', 'worry'],
      'Adaptable': ['adjust', 'adapt', 'flexible', 'change approach'],
      'Independently Spirited': ['independent', 'self-reliant', 'resist help'],
      'Resilient': ['endure', 'persist', 'recover', 'bounce back'],
      'Emotionally Intelligent': ['understand', 'empathize', 'perceive', 'connect'],
      'Secretive About Pain': ['hide', 'deflect', 'minimize', 'conceal']
    };

    return behaviors[trait] || [];
  }

  private actionContradictsTrait(action: string, trait: string, expectedBehaviors: string[]): boolean {
    // Define contradictions for specific traits
    const contradictions: Record<string, string[]> = {
      'Protective of Family': ['abandon family', 'ignore danger to family', 'choose self over family'],
      'Analytical Thinker': ['act impulsively', 'rush without thinking', 'ignore logic'],
      'Reluctant Hero': ['eagerly accept hero role', 'seek glory', 'embrace destiny'],
      'Self-Doubting': ['confident without reason', 'arrogant', 'sure of success'],
      'Independently Spirited': ['depend entirely on others', 'surrender autonomy'],
      'Secretive About Pain': ['openly express pain', 'complain about symptoms', 'seek sympathy']
    };

    const traitContradictions = contradictions[trait] || [];
    return traitContradictions.some(c => action.includes(c));
  }

  private checkBehavioralConsistency(genome: CharacterGenome, action: string, chapter: number): ContinuityIssue[] {
    const issues: ContinuityIssue[] = [];
    const lowerAction = action.toLowerCase();

    genome.behavioralPatterns.forEach(pattern => {
      // Check if action should trigger this pattern
      const shouldTrigger = pattern.conditions.some(condition => 
        lowerAction.includes(condition.toLowerCase())
      );

      if (shouldTrigger) {
        // Check if pattern is manifested
        const patternManifested = this.checkPatternManifested(lowerAction, pattern.pattern);
        
        if (!patternManifested && pattern.consistency > 0.7) {
          issues.push({
            type: 'behavioral_off',
            severity: 'minor',
            description: `Expected pattern "${pattern.pattern}" not evident`,
            expectedValue: pattern.pattern,
            actualValue: 'No clear manifestation',
            suggestion: `Consider including the behavioral pattern: ${pattern.pattern}`
          });
        }
      }
    });

    return issues;
  }

  private checkPatternManifested(action: string, pattern: string): boolean {
    const lowerPattern = pattern.toLowerCase();
    // Simple check - in production would be more sophisticated
    return action.includes(lowerPattern) || 
           action.includes('hesitat') && lowerPattern.includes('hesitat') ||
           action.includes('think') && lowerPattern.includes('think');
  }

  private checkEmotionalConsistency(genome: CharacterGenome, action: string, chapter: number): ContinuityIssue[] {
    const issues: ContinuityIssue[] = [];
    const lowerAction = action.toLowerCase();

    // Check for emotional trigger violations
    genome.emotionalBaseline.triggerThresholds.forEach(trigger => {
      if (lowerAction.includes(trigger.trigger.toLowerCase())) {
        // Check if emotional response is appropriate
        const emotionalResponse = this.detectEmotionalResponse(action);
        
        if (emotionalResponse && emotionalResponse !== trigger.emotion.toLowerCase()) {
          if (trigger.intensity > 0.8) {
            issues.push({
              type: 'behavioral_off',
              severity: 'moderate',
              description: `Emotional response may not match trigger "${trigger.trigger}"`,
              expectedValue: `${trigger.emotion} response`,
              actualValue: `${emotionalResponse} response`,
              suggestion: `Strong triggers should elicit appropriate emotional responses`
            });
          }
        }
      }
    });

    return issues;
  }

  private detectEmotionalResponse(action: string): string | null {
    const emotions: Record<string, string[]> = {
      'fear': ['trembl', 'shak', 'scared', 'terrified', 'froze'],
      'anger': ['angry', 'furious', 'rage', 'snapped', 'yelled'],
      'joy': ['smile', 'laugh', 'happy', 'grinned', 'delighted'],
      'sadness': ['cried', 'tears', 'sad', 'grief', 'sorrow'],
      'relief': ['relieved', 'sighed', 'relax', 'tension released']
    };

    for (const [emotion, indicators] of Object.entries(emotions)) {
      if (indicators.some(ind => action.includes(ind))) {
        return emotion;
      }
    }

    return null;
  }

  private checkSkillConsistency(genome: CharacterGenome, action: string, chapter: number): ContinuityIssue[] {
    const issues: ContinuityIssue[] = [];
    const lowerAction = action.toLowerCase();

    // Check if action requires skills the character doesn't have
    const requiredSkills = this.identifyRequiredSkills(lowerAction);

    requiredSkills.forEach(required => {
      const matchingSkill = genome.skillGenome.find(s => 
        s.name.toLowerCase().includes(required.toLowerCase()) ||
        s.category.toLowerCase().includes(required.toLowerCase())
      );

      if (!matchingSkill) {
        // Character doesn't have this skill
        issues.push({
          type: 'skill_discrepancy',
          severity: 'minor',
          description: `Action may require skill: ${required}`,
          expectedValue: 'Character has required skill',
          actualValue: 'No matching skill found',
          suggestion: 'Consider if character should struggle or need to learn this skill'
        });
      } else if (matchingSkill.level < 30) {
        issues.push({
          type: 'skill_discrepancy',
          severity: 'minor',
          description: `Skill level may be too low: ${matchingSkill.name} (${matchingSkill.level})`,
          expectedValue: 'Higher skill level',
          actualValue: `Level ${matchingSkill.level}`,
          suggestion: 'Show character struggling or improving through practice'
        });
      }
    });

    return issues;
  }

  private identifyRequiredSkills(action: string): string[] {
    const skills: string[] = [];
    
    if (action.includes('fight') || action.includes('combat') || action.includes('attack')) {
      skills.push('combat');
    }
    if (action.includes('cast') || action.includes('magic') || action.includes('spell')) {
      skills.push('magic');
    }
    if (action.includes('persuade') || action.includes('convince') || action.includes('negotiate')) {
      skills.push('social');
    }
    if (action.includes('survive') || action.includes('hunt') || action.includes('track')) {
      skills.push('survival');
    }

    return skills;
  }

  private calculateOverallConsistency(issues: ContinuityIssue[]): number {
    if (issues.length === 0) return 1;

    const severityWeights = {
      critical: 0.4,
      major: 0.2,
      moderate: 0.1,
      minor: 0.05
    };

    const totalPenalty = issues.reduce((sum, issue) => {
      return sum + severityWeights[issue.severity];
    }, 0);

    return Math.max(0, 1 - totalPenalty);
  }

  private generateContinuityRecommendations(issues: ContinuityIssue[], genome: CharacterGenome): string[] {
    const recommendations: string[] = [];

    // Add suggestions from issues
    issues.forEach(issue => {
      if (issue.suggestion) {
        recommendations.push(issue.suggestion);
      }
    });

    // Add general recommendations based on genome state
    if (genome.arcProgress.progress < 0.3) {
      recommendations.push('Character is in early arc - consistent traits should be established');
    }

    const lowConsistencyTraits = genome.coreTraits.filter(t => t.flexibility < 0.3);
    if (lowConsistencyTraits.length > 0) {
      recommendations.push(`Core traits with low flexibility: ${lowConsistencyTraits.map(t => t.trait).join(', ')} - should remain stable`);
    }

    return [...new Set(recommendations)];
  }

  // ============================================================================
  // CHARACTER EVOLUTION
  // ============================================================================

  /**
   * Update character based on events in a chapter
   */
  evolveCharacter(characterId: string, chapter: number, events: CharacterEvent[]): void {
    const genome = this.genomes.get(characterId);
    if (!genome) return;

    events.forEach(event => {
      switch (event.type) {
        case 'trait_change':
          this.applyTraitChange(genome, event, chapter);
          break;
        case 'relationship_change':
          this.applyRelationshipChange(genome, event, chapter);
          break;
        case 'skill_gain':
          this.applySkillGain(genome, event, chapter);
          break;
        case 'emotional_event':
          this.applyEmotionalEvent(genome, event, chapter);
          break;
        case 'memory_form':
          this.applyMemoryFormation(genome, event, chapter);
          break;
        case 'growth_milestone':
          this.applyGrowthMilestone(genome, event, chapter);
          break;
      }
    });
  }

  private applyTraitChange(genome: CharacterGenome, event: CharacterEvent, chapter: number): void {
    const trait = genome.coreTraits.find(t => t.trait === event.traitName);
    const changeIntensity = event.changeIntensity ?? 0;
    if (trait && trait.flexibility >= changeIntensity) {
      const change = event.changeValue || 0;
      trait.intensity = Math.max(0, Math.min(1, trait.intensity + change));
      trait.development.push({
        chapter,
        change,
        trigger: event.trigger || 'Unknown',
        newIntensity: trait.intensity
      });
    }
  }

  private applyRelationshipChange(genome: CharacterGenome, event: CharacterEvent, chapter: number): void {
    let relationship = genome.relationshipGenome.find(r => r.characterId === event.targetCharacterId);
    
    if (!relationship && event.targetCharacterId) {
      // Create new relationship
      relationship = {
        characterId: event.targetCharacterId,
        relationshipType: event.relationshipType || 'neutral',
        depth: 0.1,
        trust: 0,
        respect: 0,
        history: [],
        currentDynamic: 'New acquaintance',
        tensionLevel: 0.3
      };
      genome.relationshipGenome.push(relationship);
    }

    if (relationship) {
      if (event.trustChange) {
        relationship.trust = Math.max(-1, Math.min(1, relationship.trust + event.trustChange));
      }
      if (event.respectChange) {
        relationship.respect = Math.max(-1, Math.min(1, relationship.respect + event.respectChange));
      }
      relationship.history.push({
        chapter,
        type: event.eventType || 'neutral',
        description: event.description || '',
        trustChange: event.trustChange || 0,
        respectChange: event.respectChange || 0
      });
    }
  }

  private applySkillGain(genome: CharacterGenome, event: CharacterEvent, chapter: number): void {
    let skill = genome.skillGenome.find(s => s.skillId === event.skillId);
    
    if (!skill && event.skillName) {
      // Create new skill
      skill = {
        skillId: event.skillId || `skill_${Date.now()}`,
        name: event.skillName,
        category: event.skillCategory || 'knowledge',
        level: 1,
        experience: 0,
        potential: 0.5,
        learningRate: 0.5,
        prerequisites: [],
        developments: []
      };
      genome.skillGenome.push(skill);
    }

    if (skill && event.experienceGained) {
      skill.experience += event.experienceGained;
      const oldLevel = skill.level;
      skill.level = Math.min(100, Math.floor(skill.experience / 10));
      
      skill.developments.push({
        chapter,
        experienceGained: event.experienceGained,
        newLevel: skill.level > oldLevel ? skill.level : undefined,
        trigger: event.trigger || 'Practice'
      });
    }
  }

  private applyEmotionalEvent(genome: CharacterGenome, event: CharacterEvent, chapter: number): void {
    genome.emotionalBaseline.emotionalMemory.push({
      chapter,
      emotion: event.emotion || 'unknown',
      intensity: event.intensity || 0.5,
      cause: event.cause || 'Unknown event',
      resolution: event.resolution
    });
  }

  private applyMemoryFormation(genome: CharacterGenome, event: CharacterEvent, chapter: number): void {
    const memory: MemoryEntry = {
      chapter,
      content: event.content || '',
      importance: event.importance || 0.5,
      emotionalWeight: event.emotionalWeight || 0.5,
      lastReferenced: chapter,
      referenceCount: 1
    };

    if (event.memoryType === 'traumatic') {
      genome.memoryGenome.traumatic.push(memory);
    } else if (event.importance && event.importance > this.MEMORY_IMPORTANCE_THRESHOLD) {
      genome.memoryGenome.significant.push(memory);
    } else if (event.memoryType === 'long_term') {
      genome.memoryGenome.longTerm.push(memory);
    } else {
      genome.memoryGenome.shortTerm.push(memory);
    }
  }

  private applyGrowthMilestone(genome: CharacterGenome, event: CharacterEvent, chapter: number): void {
    genome.growthVector.milestones.push({
      chapter,
      type: event.milestoneType || 'realization',
      description: event.description || '',
      impact: event.impact || 0.5
    });

    // Update arc progress
    if (genome.arcProgress.progress < 1) {
      genome.arcProgress.progress = Math.min(1, genome.arcProgress.progress + (event.impact || 0.1));
      // Map milestone types to arc moment types
      const milestoneToMomentType: Record<string, 'decision' | 'revelation' | 'confrontation' | 'growth' | 'setback'> = {
        'realization': 'revelation',
        'breakthrough': 'growth',
        'transformation': 'growth',
        'setback': 'setback'
      };
      
      genome.arcProgress.keyMoments.push({
        chapter,
        type: milestoneToMomentType[event.milestoneType || 'growth'] || 'growth',
        description: event.description || '',
        significance: event.impact || 0.5
      });

      // Update arc stage
      this.updateArcStage(genome);
    }
  }

  private updateArcStage(genome: CharacterGenome): void {
    const progress = genome.arcProgress.progress;
    
    if (progress < 0.25) {
      genome.arcProgress.stage = 'setup';
    } else if (progress < 0.5) {
      genome.arcProgress.stage = 'development';
    } else if (progress < 0.75) {
      genome.arcProgress.stage = 'crisis';
    } else if (progress < 0.95) {
      genome.arcProgress.stage = 'climax';
    } else {
      genome.arcProgress.stage = 'resolution';
    }
  }

  // ============================================================================
  // RELATIONSHIP TRACKING
  // ============================================================================

  /**
   * Get relationship between two characters
   */
  getRelationship(characterId: string, targetId: string): RelationshipGene | undefined {
    const genome = this.genomes.get(characterId);
    if (!genome) return undefined;
    
    return genome.relationshipGenome.find(r => r.characterId === targetId);
  }

  /**
   * Get all relationships for a character
   */
  getRelationships(characterId: string): RelationshipGene[] {
    const genome = this.genomes.get(characterId);
    if (!genome) return [];
    
    return genome.relationshipGenome;
  }

  /**
   * Check relationship dynamics for continuity
   */
  checkRelationshipContinuity(
    characterId: string,
    targetId: string,
    interaction: string,
    chapter: number
  ): ContinuityIssue[] {
    const issues: ContinuityIssue[] = [];
    const relationship = this.getRelationship(characterId, targetId);
    
    if (!relationship) {
      issues.push({
        type: 'relationship_mismatch',
        severity: 'minor',
        description: `No established relationship with ${targetId}`,
        expectedValue: 'Existing relationship',
        actualValue: 'No relationship found',
        suggestion: 'Establish relationship before this interaction'
      });
      return issues;
    }

    const lowerInteraction = interaction.toLowerCase();

    // Check trust level appropriateness
    if (lowerInteraction.includes('trust') && relationship.trust < 0.3) {
      issues.push({
        type: 'relationship_mismatch',
        severity: 'moderate',
        description: `High trust behavior with low trust relationship (${(relationship.trust * 100).toFixed(0)}%)`,
        expectedValue: 'Behavior matching trust level',
        actualValue: interaction,
        suggestion: 'Show gradual trust building or explain the trust shift'
      });
    }

    // Check for sudden intimacy
    if (lowerInteraction.includes('confide') || lowerInteraction.includes('secret')) {
      if (relationship.depth < 0.5) {
        issues.push({
          type: 'relationship_mismatch',
          severity: 'minor',
          description: `Intimate sharing with shallow relationship`,
          expectedValue: 'Deeper relationship',
          actualValue: `Depth: ${(relationship.depth * 100).toFixed(0)}%`,
          suggestion: 'Build relationship depth before intimate moments'
        });
      }
    }

    return issues;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Get continuity check history
   */
  getContinuityCheckHistory(characterId: string): ContinuityCheck[] {
    return this.continuityChecks.get(characterId) || [];
  }

  /**
   * Generate character summary report
   */
  generateCharacterReport(characterId: string): {
    genome: CharacterGenome | null;
    consistencyHistory: ContinuityCheck[];
    traitEvolution: Map<string, number[]>;
    relationshipSummary: string[];
    growthSummary: string;
    recommendations: string[];
  } {
    const genome = this.genomes.get(characterId) || null;
    const consistencyHistory = this.continuityChecks.get(characterId) || [];

    // Calculate trait evolution
    const traitEvolution = new Map<string, number[]>();
    if (genome) {
      genome.coreTraits.forEach(trait => {
        traitEvolution.set(trait.trait, trait.development.map(d => d.newIntensity));
      });
    }

    // Generate relationship summary
    const relationshipSummary: string[] = [];
    if (genome) {
      genome.relationshipGenome.forEach(rel => {
        relationshipSummary.push(
          `${rel.characterId}: ${rel.relationshipType} (Trust: ${(rel.trust * 100).toFixed(0)}%, Depth: ${(rel.depth * 100).toFixed(0)}%)`
        );
      });
    }

    // Generate growth summary
    let growthSummary = 'No growth recorded';
    if (genome && genome.growthVector.milestones.length > 0) {
      const latestMilestone = genome.growthVector.milestones[genome.growthVector.milestones.length - 1];
      growthSummary = `Latest: ${latestMilestone.description} (Chapter ${latestMilestone.chapter})`;
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (consistencyHistory.length > 0) {
      const latestCheck = consistencyHistory[consistencyHistory.length - 1];
      recommendations.push(...latestCheck.recommendations);
    }

    return {
      genome,
      consistencyHistory,
      traitEvolution,
      relationshipSummary,
      growthSummary,
      recommendations
    };
  }
}

// Interface for character events
export interface CharacterEvent {
  type: 'trait_change' | 'relationship_change' | 'skill_gain' | 'emotional_event' | 'memory_form' | 'growth_milestone';
  traitName?: string;
  changeValue?: number;
  changeIntensity?: number;
  trigger?: string;
  targetCharacterId?: string;
  relationshipType?: RelationshipGene['relationshipType'];
  trustChange?: number;
  respectChange?: number;
  eventType?: 'positive' | 'negative' | 'neutral' | 'conflict' | 'bonding';
  description?: string;
  skillId?: string;
  skillName?: string;
  skillCategory?: SkillGene['category'];
  experienceGained?: number;
  emotion?: string;
  intensity?: number;
  cause?: string;
  resolution?: string;
  content?: string;
  importance?: number;
  emotionalWeight?: number;
  memoryType?: 'short_term' | 'long_term' | 'traumatic' | 'significant';
  milestoneType?: GrowthMilestone['type'];
  impact?: number;
}

export default CharacterContinuityGenome;