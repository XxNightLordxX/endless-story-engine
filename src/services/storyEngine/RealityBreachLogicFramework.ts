/**
 * RealityBreachLogicFramework - Meta-Narrative & Reality Breach System
 * 
 * Handles moments when the narrative acknowledges its own fictionality,
 * manages reality breaches, and creates controlled meta-narrative moments.
 * 
 * Enhanced with real-time web search for meta-fiction examples,
 * fourth wall techniques, and experimental narrative structures.
 */

import { webSearchIntegration } from './WebSearchIntegration';
import type { WebSearchResult, TechnicalSearchResult, LiterarySearchResult } from './WebSearchIntegration';

// ============================================================================
// INTERFACES
// ============================================================================

export interface RealityBreach {
  id: string;
  type: 'glitch' | 'revelation' | 'crossover' | 'echo' | 'shatter' | 'merge';
  chapter: number;
  trigger: string;
  manifestations: BreachManifestation[];
  intensity: number; // 0-1
  duration: number; // chapters
  resolved: boolean;
  consequences: string[];
  readerAwareness: number; // 0-1
}

export interface BreachManifestation {
  type: 'visual' | 'auditory' | 'memory' | 'system' | 'character' | 'world';
  description: string;
  impact: string;
  characterReactions: Map<string, string>;
}

export interface MetaNarrativeLayer {
  layer: 'surface' | 'hidden' | 'deep' | 'core';
  revealed: boolean;
  content: string;
  hints: string[];
  revealConditions: string[];
  readerDiscovery: number; // 0-1
}

export interface SystemRevelation {
  id: string;
  type: 'truth' | 'hint' | 'misdirect' | 'confirmation' | 'mystery';
  content: string;
  chapter: number;
  impact: RevelationImpact;
  characterAwareness: Map<string, number>; // character -> awareness level
  foreshadowing: string[];
}

export interface RevelationImpact {
  worldUnderstanding: number; // -1 to 1
  characterTrust: number; // -1 to 1
  narrativeTension: number; // -1 to 1
  readerEngagement: number; // -1 to 1
}

export interface ProgenitorTruth {
  id: string;
  truth: string;
  layer: number; // 1-5
  discovered: boolean;
  discoveredBy?: string;
  implications: string[];
  connectedMysteries: string[];
}

export interface RealityLayer {
  id: string;
  name: string;
  type: 'physical' | 'system' | 'progenitor' | 'void' | 'dream';
  stability: number; // 0-1
  interactions: string[];
  rules: RealityRule[];
  inhabitants: string[];
}

export interface RealityRule {
  rule: string;
  enforcement: number; // 0-1
  exceptions: string[];
  consequences: string;
}

export interface GlitchPattern {
  id: string;
  pattern: string;
  type: 'visual' | 'memory' | 'time' | 'identity' | 'causality';
  frequency: number; // 0-1
  detectability: number; // 0-1
  triggers: string[];
  responses: string[];
}

// ============================================================================
// REALITY BREACH LOGIC FRAMEWORK
// ============================================================================

export class RealityBreachLogicFramework {
  private breaches: Map<string, RealityBreach> = new Map();
  private metaLayers: MetaNarrativeLayer[] = [];
  private revelations: SystemRevelation[] = [];
  private progenitorTruths: ProgenitorTruth[] = [];
  private realityLayers: Map<string, RealityLayer> = new Map();
  private glitchPatterns: Map<string, GlitchPattern> = new Map();
  private breachHistory: RealityBreach[] = [];
  
  // Web search integration
  private metaFictionCache: Map<string, LiterarySearchResult[]> = new Map();
  private fourthWallCache: Map<string, WebSearchResult[]> = new Map();
  private experimentalNarrativeCache: Map<string, WebSearchResult[]> = new Map();
  private philosophicalConceptsCache: Map<string, TechnicalSearchResult[]> = new Map();

  constructor() {
    this.initializeMetaLayers();
    this.initializeRealityLayers();
    this.initializeGlitchPatterns();
    this.initializeProgenitorTruths();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initializeMetaLayers(): void {
    this.metaLayers = [
      {
        layer: 'surface',
        revealed: true,
        content: 'The apparent world of the story',
        hints: [],
        revealConditions: [],
        readerDiscovery: 1.0
      },
      {
        layer: 'hidden',
        revealed: false,
        content: 'The system mechanics and their implications',
        hints: ['System messages', 'Strange occurrences', 'Inconsistencies'],
        revealConditions: ['Character questions reality', 'System malfunction'],
        readerDiscovery: 0.2
      },
      {
        layer: 'deep',
        revealed: false,
        content: 'The Progenitor civilization and their technology',
        hints: ['Ancient ruins', 'Mysterious power sources', 'Forgotten history'],
        revealConditions: ['Archaeological discovery', 'Progenitor contact'],
        readerDiscovery: 0.05
      },
      {
        layer: 'core',
        revealed: false,
        content: 'The true nature of reality itself',
        hints: ['Reality glitches', 'Dimensional echoes', 'Void encounters'],
        revealConditions: ['Reality breach event', 'Progenitor truth reveal'],
        readerDiscovery: 0.0
      }
    ];
  }

  private initializeRealityLayers(): void {
    this.realityLayers.set('physical', {
      id: 'physical',
      name: 'Physical Reality',
      type: 'physical',
      stability: 0.85,
      interactions: ['system', 'dream'],
      rules: [
        { rule: 'Conservation of mass', enforcement: 0.9, exceptions: ['System intervention', 'Progenitor tech'], consequences: 'Reality strain' },
        { rule: 'Causality', enforcement: 0.95, exceptions: ['Time anomalies'], consequences: 'Temporal paradox' }
      ],
      inhabitants: ['Humans', 'Animals', 'Flora']
    });

    this.realityLayers.set('system', {
      id: 'system',
      name: 'System Layer',
      type: 'system',
      stability: 0.7,
      interactions: ['physical', 'progenitor'],
      rules: [
        { rule: 'Stats govern ability', enforcement: 0.8, exceptions: ['Willpower override', 'Progenitor powers'], consequences: 'System instability' },
        { rule: 'Levels determine power', enforcement: 0.75, exceptions: ['Hidden potentials'], consequences: 'Balance disruption' }
      ],
      inhabitants: ['System constructs', 'NPCs', 'Dungeon entities']
    });

    this.realityLayers.set('progenitor', {
      id: 'progenitor',
      name: 'Progenitor Dimension',
      type: 'progenitor',
      stability: 0.5,
      interactions: ['system', 'void'],
      rules: [
        { rule: 'Thought shapes reality', enforcement: 0.6, exceptions: [], consequences: 'Uncontrolled manifestation' },
        { rule: 'Power requires understanding', enforcement: 0.8, exceptions: ['Bloodline inheritance'], consequences: 'Power corruption' }
      ],
      inhabitants: ['Progenitor echoes', 'Guardians', 'Lost souls']
    });

    this.realityLayers.set('void', {
      id: 'void',
      name: 'The Void',
      type: 'void',
      stability: 0.2,
      interactions: ['progenitor', 'physical'],
      rules: [
        { rule: 'Nothing persists', enforcement: 0.9, exceptions: ['Void walkers'], consequences: 'Complete erasure' }
      ],
      inhabitants: ['Void entities', 'Corrupted beings', 'Null forms']
    });
  }

  private initializeGlitchPatterns(): void {
    this.glitchPatterns.set('time_skip', {
      id: 'time_skip',
      pattern: 'Brief time discontinuity',
      type: 'time',
      frequency: 0.1,
      detectability: 0.3,
      triggers: ['System processing', 'Reality stress'],
      responses: ['Deja vu', 'Confusion', 'Lost time']
    });

    this.glitchPatterns.set('memory_echo', {
      id: 'memory_echo',
      pattern: 'False or overlapping memories',
      type: 'memory',
      frequency: 0.15,
      detectability: 0.4,
      triggers: ['Progenitor interference', 'Dimensional bleed'],
      responses: ['Questioning reality', 'Identity confusion']
    });

    this.glitchPatterns.set('visual_static', {
      id: 'visual_static',
      pattern: 'Visual distortions',
      type: 'visual',
      frequency: 0.2,
      detectability: 0.5,
      triggers: ['System malfunction', 'Power overflow'],
      responses: ['Seeing code', 'Reality fragments', 'System text visible']
    });

    this.glitchPatterns.set('identity_bleed', {
      id: 'identity_bleed',
      pattern: 'Identity confusion or overlap',
      type: 'identity',
      frequency: 0.05,
      detectability: 0.6,
      triggers: ['Progenitor awakening', 'Void contact'],
      responses: ['Acting out of character', 'Foreign thoughts', 'Memory mixing']
    });
  }

  private initializeProgenitorTruths(): void {
    this.progenitorTruths = [
      {
        id: 'truth_origin',
        truth: 'The system was created by the Progenitors as a survival mechanism',
        layer: 2,
        discovered: false,
        implications: ['Everything is designed', 'Purpose hidden', 'Control exists'],
        connectedMysteries: ['Why was it created?', 'Who controls it now?']
      },
      {
        id: 'truth_power',
        truth: 'Kael\'s power comes directly from Progenitor bloodline, not the system',
        layer: 3,
        discovered: false,
        implications: ['Bypasses system limits', 'Ancient heritage', 'Dangerous attention'],
        connectedMysteries: ['How did the bloodline survive?', 'What does it mean for Yuna?']
      },
      {
        id: 'truth_yuna',
        truth: 'Yuna\'s illness is connected to the Progenitor legacy',
        layer: 4,
        discovered: false,
        implications: ['Not a curse but a transformation', 'Power potential', 'Sacrifice required'],
        connectedMysteries: ['What will she become?', 'Is there a cure?']
      },
      {
        id: 'truth_reality',
        truth: 'The world exists in a collapsed quantum state, maintained by the system',
        layer: 5,
        discovered: false,
        implications: ['Reality is fragile', 'Multiple possibilities exist', 'Observation matters'],
        connectedMysteries: ['What happens if the system fails?', 'What was the original reality?']
      }
    ];
  }

  // ============================================================================
  // WEB SEARCH INTEGRATION
  // ============================================================================

  /**
   * Search for meta-fiction examples
   */
  async searchMetaFictionExamples(
    metaType: string,
    genre: string
  ): Promise<LiterarySearchResult[]> {
    const key = `${metaType}-${genre}`;
    if (this.metaFictionCache.has(key)) {
      return this.metaFictionCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchLiteraryExamples(
      `${metaType} meta-fiction`,
      genre
    );
    this.metaFictionCache.set(key, results);
    return results;
  }

  /**
   * Research breaking the fourth wall techniques
   */
  async searchFourthWallTechniques(
    technique: string
  ): Promise<WebSearchResult[]> {
    const key = technique;
    if (this.fourthWallCache.has(key)) {
      return this.fourthWallCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `fourth wall breaking ${technique} literature fiction`
    );
    this.fourthWallCache.set(key, results);
    return results;
  }

  /**
   * Find experimental narrative structures
   */
  async searchExperimentalStructures(
    structureType: string,
    innovation: string
  ): Promise<WebSearchResult[]> {
    const key = `${structureType}-${innovation}`;
    if (this.experimentalNarrativeCache.has(key)) {
      return this.experimentalNarrativeCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${structureType} ${innovation} experimental narrative`
    );
    this.experimentalNarrativeCache.set(key, results);
    return results;
  }

  /**
   * Look up philosophical reality concepts
   */
  async searchPhilosophicalConcepts(
    concept: string,
    philosopher?: string
  ): Promise<TechnicalSearchResult[]> {
    const key = `${concept}-${philosopher || 'general'}`;
    if (this.philosophicalConceptsCache.has(key)) {
      return this.philosophicalConceptsCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchEthicalFrameworks(
      `${philosopher ? philosopher + ' ' : ''}${concept} reality philosophy`
    );
    this.philosophicalConceptsCache.set(key, results as TechnicalSearchResult[]);
    return results as TechnicalSearchResult[];
  }

  /**
   * Get reality breach inspiration from web
   */
  async getBreachInspiration(
    breachType: RealityBreach['type']
  ): Promise<string[]> {
    const results = await this.searchMetaFictionExamples(
      breachType,
      'fiction'
    );
    
    const inspirations: string[] = [];
    for (const result of results) {
      if (result.relevance > 0.6) {
        const sentences = result.snippet.split(/[.!?]/).filter(s => s.trim().length > 15);
        if (sentences.length > 0) {
          inspirations.push(sentences[0].trim());
        }
      }
    }
    
    return inspirations.slice(0, 5);
  }

  /**
   * Clear web search cache
   */
  clearWebSearchCache(): void {
    this.metaFictionCache.clear();
    this.fourthWallCache.clear();
    this.experimentalNarrativeCache.clear();
    this.philosophicalConceptsCache.clear();
  }

  // ============================================================================
  // BREACH MANAGEMENT
  // ============================================================================

  /**
   * Create a new reality breach
   */
  createBreach(
    type: RealityBreach['type'],
    chapter: number,
    trigger: string,
    intensity: number = 0.5
  ): RealityBreach {
    const breach: RealityBreach = {
      id: `breach_${chapter}_${Date.now()}`,
      type,
      chapter,
      trigger,
      manifestations: this.generateManifestations(type, intensity),
      intensity,
      duration: this.calculateBreachDuration(type, intensity),
      resolved: false,
      consequences: [],
      readerAwareness: 0
    };

    this.breaches.set(breach.id, breach);
    this.breachHistory.push(breach);

    return breach;
  }

  private generateManifestations(type: RealityBreach['type'], intensity: number): BreachManifestation[] {
    const manifestations: BreachManifestation[] = [];

    switch (type) {
      case 'glitch':
        manifestations.push({
          type: 'visual',
          description: 'Reality flickers, showing underlying code',
          impact: 'Characters see system messages',
          characterReactions: new Map([['Kael', 'Confusion and curiosity']])
        });
        break;

      case 'revelation':
        manifestations.push({
          type: 'memory',
          description: 'Hidden truths surface in consciousness',
          impact: 'Characters remember things that shouldn\'t exist',
          characterReactions: new Map([['Kael', 'Questioning reality']])
        });
        break;

      case 'echo':
        manifestations.push({
          type: 'character',
          description: 'Alternate versions of characters appear briefly',
          impact: 'Characters encounter themselves',
          characterReactions: new Map([['Kael', 'Existential dread']])
        });
        break;

      case 'shatter':
        manifestations.push({
          type: 'world',
          description: 'Reality breaks, showing void beneath',
          impact: 'Characters witness the fabric of reality',
          characterReactions: new Map([['Kael', 'Terror and wonder']])
        });
        break;

      case 'merge':
        manifestations.push({
          type: 'system',
          description: 'Multiple realities overlap',
          impact: 'Conflicting truths exist simultaneously',
          characterReactions: new Map([['Kael', 'Overwhelmed understanding']])
        });
        break;

      case 'crossover':
        manifestations.push({
          type: 'character',
          description: 'Entities from other layers manifest',
          impact: 'Progenitor or void beings appear',
          characterReactions: new Map([['Kael', 'Recognition of something ancient']])
        });
        break;
    }

    return manifestations;
  }

  private calculateBreachDuration(type: RealityBreach['type'], intensity: number): number {
    const baseDurations: Record<RealityBreach['type'], number> = {
      glitch: 1,
      revelation: 2,
      crossover: 3,
      echo: 2,
      shatter: 4,
      merge: 5
    };

    return Math.ceil(baseDurations[type] * intensity);
  }

  /**
   * Resolve a breach
   */
  resolveBreach(breachId: string, resolution: string): void {
    const breach = this.breaches.get(breachId);
    if (breach) {
      breach.resolved = true;
      breach.consequences.push(resolution);
    }
  }

  // ============================================================================
  // REVELATION SYSTEM
  // ============================================================================

  /**
   * Create a system revelation
   */
  createRevelation(
    type: SystemRevelation['type'],
    content: string,
    chapter: number,
    foreshadowing: string[] = []
  ): SystemRevelation {
    const revelation: SystemRevelation = {
      id: `revelation_${chapter}_${Date.now()}`,
      type,
      content,
      chapter,
      impact: this.calculateRevelationImpact(type),
      characterAwareness: new Map(),
      foreshadowing
    };

    this.revelations.push(revelation);
    this.updateMetaLayers(revelation);

    return revelation;
  }

  private calculateRevelationImpact(type: SystemRevelation['type']): RevelationImpact {
    const impacts: Record<SystemRevelation['type'], RevelationImpact> = {
      truth: { worldUnderstanding: 0.5, characterTrust: 0.2, narrativeTension: 0.3, readerEngagement: 0.4 },
      hint: { worldUnderstanding: 0.1, characterTrust: 0, narrativeTension: 0.1, readerEngagement: 0.2 },
      misdirect: { worldUnderstanding: -0.1, characterTrust: -0.1, narrativeTension: 0.3, readerEngagement: 0.3 },
      confirmation: { worldUnderstanding: 0.3, characterTrust: 0.1, narrativeTension: -0.1, readerEngagement: 0.2 },
      mystery: { worldUnderstanding: 0, characterTrust: 0, narrativeTension: 0.4, readerEngagement: 0.5 }
    };

    return impacts[type];
  }

  private updateMetaLayers(revelation: SystemRevelation): void {
    // Update layer discovery based on revelation
    this.metaLayers.forEach(layer => {
      if (revelation.content.includes(layer.content) || 
          layer.hints.some(h => revelation.content.includes(h))) {
        layer.readerDiscovery = Math.min(1, layer.readerDiscovery + 0.2);
      }
    });
  }

  // ============================================================================
  // GLITCH GENERATION
  // ============================================================================

  /**
   * Generate a glitch event
   */
  generateGlitch(chapter: number, trigger: string): GlitchPattern | null {
    // Find applicable glitch patterns
    const applicableGlitches = Array.from(this.glitchPatterns.values())
      .filter(g => g.triggers.some(t => trigger.toLowerCase().includes(t.toLowerCase())));

    if (applicableGlitches.length === 0) {
      // Random glitch
      if (Math.random() < 0.05) {
        const allGlitches = Array.from(this.glitchPatterns.values());
        return allGlitches[Math.floor(Math.random() * allGlitches.length)];
      }
      return null;
    }

    // Select glitch based on frequency
    const selectedGlitch = applicableGlitches.find(g => Math.random() < g.frequency);
    return selectedGlitch || null;
  }

  /**
   * Apply glitch effects to narrative
   */
  applyGlitchEffects(glitch: GlitchPattern, characterId: string): {
    description: string;
    effects: string[];
    characterResponse: string;
  } {
    const responses = glitch.responses;
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      description: `${glitch.pattern} detected`,
      effects: this.generateGlitchEffects(glitch),
      characterResponse: selectedResponse
    };
  }

  private generateGlitchEffects(glitch: GlitchPattern): string[] {
    const effects: string[] = [];

    switch (glitch.type) {
      case 'visual':
        effects.push('Brief visual static', 'System text visible for a moment', 'Colors distort');
        break;
      case 'memory':
        effects.push('False memory surfaces', 'Memory gap appears', 'Conflicting memories');
        break;
      case 'time':
        effects.push('Time skip noticed', 'Events replay', 'Future glimpse');
        break;
      case 'identity':
        effects.push('Foreign thought intrudes', 'Moment of dissociation', 'Identity confusion');
        break;
      case 'causality':
        effects.push('Effect precedes cause', 'Impossible sequence', 'Paradox moment');
        break;
    }

    return effects;
  }

  // ============================================================================
  // TRUTH DISCOVERY
  // ============================================================================

  /**
   * Discover a Progenitor truth
   */
  discoverTruth(truthId: string, discoveredBy: string): ProgenitorTruth | null {
    const truth = this.progenitorTruths.find(t => t.id === truthId);
    
    if (!truth || truth.discovered) {
      return null;
    }

    // Check if prerequisites are met (lower layer truths discovered)
    const prerequisiteTruths = this.progenitorTruths.filter(t => t.layer < truth.layer);
    const allDiscovered = prerequisiteTruths.every(t => t.discovered);

    if (!allDiscovered && truth.layer > 1) {
      // Cannot discover higher layer without prerequisites
      return null;
    }

    truth.discovered = true;
    truth.discoveredBy = discoveredBy;

    // Create revelation for this discovery
    this.createRevelation('truth', truth.truth, 0, truth.implications);

    return truth;
  }

  /**
   * Get hints for a truth
   */
  getHintsForTruth(truthId: string): string[] {
    const truth = this.progenitorTruths.find(t => t.id === truthId);
    if (!truth) return [];

    // Generate hints based on layer and implications
    const hints: string[] = [];
    
    truth.implications.forEach(impl => {
      hints.push(`[HINT] Something suggests: ${impl}`);
    });

    truth.connectedMysteries.forEach(mystery => {
      hints.push(`[MYSTERY] Connected to: ${mystery}`);
    });

    return hints;
  }

  // ============================================================================
  // REALITY LAYER INTERACTION
  // ============================================================================

  /**
   * Get reality layer status
   */
  getLayerStatus(layerId: string): RealityLayer | undefined {
    return this.realityLayers.get(layerId);
  }

  /**
   * Check for layer interactions
   */
  checkLayerInteractions(fromLayer: string, toLayer: string): {
    possible: boolean;
    stability: number;
    risks: string[];
  } {
    const from = this.realityLayers.get(fromLayer);
    const to = this.realityLayers.get(toLayer);

    if (!from || !to) {
      return { possible: false, stability: 0, risks: ['Unknown layer'] };
    }

    const canInteract = from.interactions.includes(toLayer) || to.interactions.includes(fromLayer);
    const avgStability = (from.stability + to.stability) / 2;

    const risks: string[] = [];
    if (avgStability < 0.5) risks.push('Reality instability');
    if (to.stability < 0.3) risks.push('Layer collapse risk');
    if (from.type === 'void' || to.type === 'void') risks.push('Void corruption');

    return {
      possible: canInteract,
      stability: avgStability,
      risks
    };
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Get all breaches
   */
  getAllBreaches(): RealityBreach[] {
    return [...this.breachHistory];
  }

  /**
   * Get active breaches
   */
  getActiveBreaches(): RealityBreach[] {
    return Array.from(this.breaches.values()).filter(b => !b.resolved);
  }

  /**
   * Get all revelations
   */
  getRevelations(): SystemRevelation[] {
    return [...this.revelations];
  }

  /**
   * Get meta layer status
   */
  getMetaLayers(): MetaNarrativeLayer[] {
    return [...this.metaLayers];
  }

  /**
   * Get progenitor truths
   */
  getProgenitorTruths(): ProgenitorTruth[] {
    return [...this.progenitorTruths];
  }

  /**
   * Get discovered truths
   */
  getDiscoveredTruths(): ProgenitorTruth[] {
    return this.progenitorTruths.filter(t => t.discovered);
  }

  /**
   * Generate reality breach report
   */
  generateBreachReport(): {
    totalBreaches: number;
    activeBreaches: number;
    averageIntensity: number;
    layerStability: Map<string, number>;
    discoveredTruths: number;
    readerAwareness: number;
  } {
    const activeBreaches = this.getActiveBreaches();
    const avgIntensity = this.breachHistory.length > 0
      ? this.breachHistory.reduce((sum, b) => sum + b.intensity, 0) / this.breachHistory.length
      : 0;

    const layerStability = new Map<string, number>();
    this.realityLayers.forEach((layer, id) => {
      layerStability.set(id, layer.stability);
    });

    const discoveredTruths = this.progenitorTruths.filter(t => t.discovered).length;
    const readerAwareness = this.metaLayers.reduce((sum, l) => sum + l.readerDiscovery, 0) / this.metaLayers.length;

    return {
      totalBreaches: this.breachHistory.length,
      activeBreaches: activeBreaches.length,
      averageIntensity: avgIntensity,
      layerStability,
      discoveredTruths,
      readerAwareness
    };
  }
}

export default RealityBreachLogicFramework;