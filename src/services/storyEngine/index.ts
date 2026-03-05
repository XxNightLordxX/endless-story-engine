/**
 * Main Story Engine Integration
 * Combines all AI Story Engine components into a unified system
 */

import AIStoryEngine from './AIStoryEngine';
import NarrativeLogic from './NarrativeLogic';
import CharacterIntelligence from './CharacterIntelligence';
import WorldBuilder from './WorldBuilder';
import ItemSystem from './ItemSystem';
import PacingSystem from './PacingSystem';
import QualityControl from './QualityControl';
import StatMerging from './StatMerging';
import ThreatScalingSystem from './ThreatScalingSystem';
import MemorySystem from './MemorySystem';
import LoreManager from './LoreManager';
import ConflictManager from './ConflictManager';
import SystemScreenGenerator from './SystemScreenGenerator';
import CinematicEnhancer from './CinematicEnhancer';
import ThemeManager from './ThemeManager';

// Advanced AI Systems
import { MetaCognitionSystem } from './MetaCognitionSystem';
import { PredictiveArcModeling } from './PredictiveArcModeling';
import { MultiThreadNarrativeScheduler } from './MultiThreadNarrativeScheduler';
import { DialogueIntelligenceSystem } from './DialogueIntelligenceSystem';
import { CharacterContinuityGenome } from './CharacterContinuityGenome';
import { DynamicWorldSimulation } from './DynamicWorldSimulation';
import { RealityBreachLogicFramework } from './RealityBreachLogicFramework';
import { StructuralIntegrityLayer } from './StructuralIntegrityLayer';
import { SymbolicLogicTracker } from './SymbolicLogicTracker';
import { CinematicChoreographyEngine } from './CinematicChoreographyEngine';
import { MoralEthicalDecisionEngine } from './MoralEthicalDecisionEngine';
import { ExperimentalNarrativeModes } from './ExperimentalNarrativeModes';
import { NarrativeRepairSystem } from './NarrativeRepairSystem';
import { CrossArcSynergyEngine } from './CrossArcSynergyEngine';

// Complete Integrated Engine
import { AdvancedStoryEngine } from './AdvancedStoryEngine';
import { WebSearchIntegration } from './WebSearchIntegration';

import type { Chapter, Character, Location, Item, Skill } from '../../types';
import type { ThreatContext } from './ThreatScalingSystem';

export interface StoryEngineConfig {
  pacing: number;
  tone: 'dark' | 'neutral' | 'light';
  tension: number;
  worldLogic: boolean;
  characterIntelligence: number;
  consistencyScore: number;
  qualityThreshold: number;
  statMergeEnabled: boolean;
}

export interface GenerationContext {
  chapterNumber: number;
  world: 'real' | 'vr';
  characters: Character[];
  location?: Location;
  previousChapter?: Chapter;
}

export interface GenerationResult {
  chapter: Chapter;
  metrics: {
    quality: number;
    pacing: number;
    tension: number;
    consistency: number;
    conflict?: number;
  };
  suggestions: string[];
  systemMessages?: any[];
}

export class UnifiedStoryEngine {
  private aiEngine: AIStoryEngine;
  private narrativeLogic: NarrativeLogic;
  private characterIntel: CharacterIntelligence;
  private worldBuilder: WorldBuilder;
  private itemSystem: ItemSystem;
  private pacingSystem: PacingSystem;
  private qualityControl: QualityControl;
  private statMerging: StatMerging;
  private threatScaling: ThreatScalingSystem;
  private memorySystem: MemorySystem;
  private loreManager: LoreManager;
  private conflictManager: ConflictManager;
  private systemScreen: SystemScreenGenerator;
  private cinematicEnhancer: CinematicEnhancer;
  private themeManager: ThemeManager;

  // Advanced AI Systems
  private metaCognition: MetaCognitionSystem;
  private predictiveArcModeling: PredictiveArcModeling;
  private multiThreadScheduler: MultiThreadNarrativeScheduler;
  private dialogueIntelligence: DialogueIntelligenceSystem;
  private characterContinuity: CharacterContinuityGenome;
  private dynamicWorldSim: DynamicWorldSimulation;
  private realityBreachFramework: RealityBreachLogicFramework;
  private structuralIntegrity: StructuralIntegrityLayer;
  private symbolicTracker: SymbolicLogicTracker;
  private cinematicChoreography: CinematicChoreographyEngine;
  private moralEthicalEngine: MoralEthicalDecisionEngine;
  private experimentalModes: ExperimentalNarrativeModes;
  private narrativeRepair: NarrativeRepairSystem;
  private crossArcSynergy: CrossArcSynergyEngine;

  constructor(config: StoryEngineConfig) {
    this.aiEngine = new AIStoryEngine({
      pacing: config.pacing,
      tone: config.tone,
      tension: config.tension,
      worldLogic: config.worldLogic,
      characterIntelligence: config.characterIntelligence,
      consistencyScore: config.consistencyScore,
    });

    this.narrativeLogic = new NarrativeLogic();
    this.characterIntel = new CharacterIntelligence();
    this.worldBuilder = new WorldBuilder();
    this.itemSystem = new ItemSystem();
    this.pacingSystem = new PacingSystem();
    this.qualityControl = new QualityControl(config.qualityThreshold);
    this.statMerging = new StatMerging({
      enabled: config.statMergeEnabled,
    });
    this.threatScaling = new ThreatScalingSystem();
    this.memorySystem = new MemorySystem();
    this.loreManager = new LoreManager();
    this.conflictManager = new ConflictManager();
    this.systemScreen = new SystemScreenGenerator();
    this.cinematicEnhancer = new CinematicEnhancer();
    this.themeManager = new ThemeManager();

    // Initialize Advanced AI Systems
    this.metaCognition = new MetaCognitionSystem();
    this.predictiveArcModeling = new PredictiveArcModeling();
    this.multiThreadScheduler = new MultiThreadNarrativeScheduler();
    this.dialogueIntelligence = new DialogueIntelligenceSystem();
    this.characterContinuity = new CharacterContinuityGenome();
    this.dynamicWorldSim = new DynamicWorldSimulation();
    this.realityBreachFramework = new RealityBreachLogicFramework();
    this.structuralIntegrity = new StructuralIntegrityLayer();
    this.symbolicTracker = new SymbolicLogicTracker();
    this.cinematicChoreography = new CinematicChoreographyEngine();
    this.moralEthicalEngine = new MoralEthicalDecisionEngine();
    this.experimentalModes = new ExperimentalNarrativeModes();
    this.narrativeRepair = new NarrativeRepairSystem();
    this.crossArcSynergy = new CrossArcSynergyEngine();
  }

  /**
   * Generate a complete chapter with all AI systems
   */
  async generateChapter(context: GenerationContext): Promise<GenerationResult> {
    // 1. Determine narrative arc and pacing
    const arc = this.narrativeLogic.determineNarrativeArc(context.chapterNumber);
    this.pacingSystem.updatePacingForArc(arc);
    this.pacingSystem.updateTone(arc, context.world === 'vr' ? 'VR adventure' : 'Hospital setting');

    // 2. Update world state
    this.worldBuilder.updateEnvironment(context.world, {
      activeCharacters: context.characters.map(c => c.name),
    });

    // 3. Generate base chapter content
    const chapter = await this.aiEngine.generateChapter(context.previousChapter);

    // 4. Add character intelligence and reactions
    const enhancedContent = this.enhanceWithCharacterIntelligence(
      chapter.content,
      context.characters,
      context.world
    );
    chapter.content = enhancedContent;

    // 5. Add world atmosphere and sensory details
    this.pacingSystem.updateAtmosphere(context.world, this.getContextKey(context));
    const atmosphereContent = this.enhanceWithAtmosphere(chapter.content);
    chapter.content = atmosphereContent;

    // 6. Enhance with lore discoveries if appropriate
    if (context.world === 'vr') {
      const loreEnhancement = this.enhanceWithLore(chapter.content, context.chapterNumber);
      chapter.content = loreEnhancement;
    }

    // 7. Add memory-driven NPC reactions
    const memoryEnhancement = this.enhanceWithMemory(chapter.content, context);
    chapter.content = memoryEnhancement;

    // 8. Add conflict layering
    const conflictEnhancement = this.enhanceWithConflicts(chapter.content, context);
    chapter.content = conflictEnhancement;

    // 9. Add cinematic enhancements
    const cinematicEnhancement = this.enhanceWithCinematics(chapter.content, context);
    chapter.content = cinematicEnhancement;

    // 10. Add thematic integration
    const themeEnhancement = this.enhanceWithThemes(chapter.content, context.chapterNumber);
    chapter.content = themeEnhancement;

    // 11. Generate system messages for VR
    let systemMessages: any[] = [];
    if (context.world === 'vr') {
      systemMessages = this.generateSystemMessages(context);
    }

    // 12. Quality control and suggestions
    const qualityReport = this.qualityControl.evaluateChapter(chapter);

    // 13. Apply stat changes if in VR
    if (context.world === 'vr') {
      this.applyVRStatChanges(chapter, context.characters);
    }

    // 14. Calculate metrics
    const metrics = {
      quality: qualityReport.metrics.overall,
      pacing: this.pacingSystem.getCurrentPacing().currentPacing,
      tension: arc.intensity,
      consistency: qualityReport.metrics.consistency.score,
      conflict: this.conflictManager.getOverallTension(),
    };

    // 15. Generate suggestions
    const suggestions = qualityReport.suggestions.map(s => s.reason);

    return {
      chapter,
      metrics,
      suggestions,
      systemMessages,
    };
  }

  /**
   * Enhance content with character intelligence
   */
  private enhanceWithCharacterIntelligence(
    content: string,
    characters: Character[],
    world: 'real' | 'vr'
  ): string {
    let enhanced = content;

    for (const character of characters) {
      // Generate character actions based on behavior
      const behavior = this.characterIntel.getHistory(character.name);
      
      if (behavior.length > 0) {
        // Add character-specific actions
        const action = this.characterIntel.predictReaction(
          character.name,
          'Current situation',
          world === 'vr' ? 6 : 3
        );
        
        if (action.includes(character.name)) {
          enhanced += `\n\n${action}`;
        }
      }
    }

    return enhanced;
  }

  /**
   * Enhance content with atmosphere and sensory details
   */
  private enhanceWithAtmosphere(content: string): string {
    const atmosphere = this.pacingSystem.getCurrentAtmosphere();
    const sensoryDesc = this.pacingSystem.generateSensoryDescription();
    
    return `${content}\n\n${this.pacingSystem.getAtmosphereDescription()} ${sensoryDesc}`;
  }

  /**
   * Enhance content with lore discoveries
   */
  private enhanceWithLore(content: string, chapterNumber: number): string {
    const loreState = this.loreManager.getLoreForChapter(chapterNumber);
    
    // Get any newly available lore from surface layer
    const availableLore = loreState.surface.filter(l => !l.chapterRevealed);
    if (availableLore.length > 0) {
      const recentLore = availableLore[0];
      const loreText = `\n\n[LORE DISCOVERED: ${recentLore.title}]\n${recentLore.content}`;
      return `${content}${loreText}`;
    }
    
    // Try to suggest next discovery
    const suggestion = this.loreManager.suggestNextDiscovery();
    if (suggestion) {
      const loreText = `\n\n[NEW LORE UNLOCKED: ${suggestion.title}]\n${suggestion.content}`;
      return `${content}${loreText}`;
    }
    
    return content;
  }

  /**
   * Enhance content with memory-driven reactions
   */
  private enhanceWithMemory(content: string, context: GenerationContext): string {
    // Get NPCs that might remember Kael's actions
    const npcsInScene = context.characters
      .filter(c => c.name !== 'Kael')
      .map(c => c.name);
    
    const memoryEnhancements: string[] = [];
    
    for (const npc of npcsInScene.slice(0, 2)) { // Limit to 2 NPCs for performance
      const reaction = this.memorySystem.getNPCReaction(npc, 'Current situation');
      
      // The reaction is a string describing the NPC's reaction
      if (reaction && reaction !== 'Unknown NPC') {
        memoryEnhancements.push(reaction);
      }
    }
    
    if (memoryEnhancements.length > 0) {
      return `${content}\n\n${memoryEnhancements.join(' ')}`;
    }
    
    return content;
  }

  /**
   * Enhance content with conflict layering
   */
  private enhanceWithConflicts(content: string, context: GenerationContext): string {
    const intensityLevel = context.chapterNumber < 10 ? 'low' : context.chapterNumber < 25 ? 'medium' : 'high';
    
    const sceneConflicts = this.conflictManager.generateSceneConflicts({
      chapterNumber: context.chapterNumber,
      world: context.world,
      characters: context.characters.map(c => c.name),
      intensity: intensityLevel,
    });
    
    if (sceneConflicts.primary) {
      const conflictText = this.conflictManager.generateConflictNarrative(sceneConflicts.primary);
      const stakesText = `\n\n${sceneConflicts.stakes}`;
      return `${content}\n\n${conflictText}${stakesText}`;
    }
    
    return content;
  }

  /**
   * Enhance content with cinematic elements
   */
  private enhanceWithCinematics(content: string, context: GenerationContext): string {
    // Set location for cinematic enhancer
    const location = context.world === 'vr' 
      ? this.worldBuilder.getWorldState().vrWorld.currentZone 
      : 'hospital_room';
    
    this.cinematicEnhancer.setCurrentLocation(location);
    
    // Generate shot sequence based on scene type
    const sceneType = this.determineSceneType(content);
    const shots = this.cinematicEnhancer.generateShotSequence(sceneType);
    
    // Apply cinematic description
    if (shots.length > 0) {
      const cinematicText = this.cinematicEnhancer.applyShotToContent(shots[0], {
        characterName: context.characters[0]?.name,
        location,
      });
      return `${content}\n\n${cinematicText}`;
    }
    
    return content;
  }

  /**
   * Enhance content with thematic integration
   */
  private enhanceWithThemes(content: string, chapterNumber: number): string {
    return this.themeManager.generateThemeIntegration(chapterNumber, content);
  }

  /**
   * Generate system messages for VR chapters
   */
  private generateSystemMessages(context: GenerationContext): any[] {
    const syncLevel = this.statMerging.getSyncLevel();
    
    return this.systemScreen.generateSystemMessages({
      chapterNumber: context.chapterNumber,
      world: context.world,
      syncLevel,
      events: [],
    });
  }

  /**
   * Determine scene type from content
   */
  private determineSceneType(content: string): 'introduction' | 'tension' | 'action' | 'revelation' | 'emotional' {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('fight') || lowerContent.includes('battle') || lowerContent.includes('attack')) {
      return 'action';
    }
    if (lowerContent.includes('discover') || lowerContent.includes('reveal') || lowerContent.includes('secret')) {
      return 'revelation';
    }
    if (lowerContent.includes('feel') || lowerContent.includes('emotion') || lowerContent.includes('tear')) {
      return 'emotional';
    }
    if (lowerContent.includes('danger') || lowerContent.includes('threat') || lowerContent.includes('tension')) {
      return 'tension';
    }
    return 'introduction';
  }

  /**
   * Get context key for atmosphere mapping
   */
  private getContextKey(context: GenerationContext): string {
    if (context.world === 'real') {
      return context.location?.id || 'hospital';
    }
    return this.worldBuilder.getWorldState().vrWorld.currentZone;
  }

  /**
   * Apply VR stat changes to characters
   */
  private applyVRStatChanges(chapter: Chapter, characters: Character[]): void {
    // Simulate stat progression in VR
    for (const character of characters) {
      if (character.name === 'Kael') {
        // Update VR stats based on chapter events
        const statBoost = Math.floor(Math.random() * 3) + 1;
        const stats = ['strength', 'dexterity', 'intelligence'];
        const randomStat = stats[Math.floor(Math.random() * stats.length)];
        
        this.statMerging.updateVRStats(
          randomStat,
          (character.stats?.[randomStat as keyof typeof character.stats] || 0) + statBoost,
          `VR progression from Chapter ${chapter.chapterNumber || 1}`
        );
      }
    }
  }

  /**
   * Generate scaled encounter for VR chapters
   */
  private generateVREncounter(kaelStats: Record<string, number>): any {
    const worldState = this.worldBuilder.getWorldState();
    
    const threatContext: ThreatContext = {
      kaelLevel: 1, // Kael's level (simplified)
      kaelStats: {
        strength: kaelStats.strength || 50,
        agility: kaelStats.agility || 50,
        intelligence: kaelStats.intelligence || 50,
        charisma: kaelStats.charisma || 50,
        perception: kaelStats.perception || 50,
      },
      kaelSkills: [],
      recentBattles: [],
      currentZone: worldState.vrWorld.currentZone,
      syncLevel: this.statMerging.getSyncLevel(),
      narrativePhase: 'active',
    };
    
    return this.threatScaling.generateEncounter(threatContext);
  }

  /**
   * Generate items based on context
   */
  generateItems(count: number, rarity?: string): Item[] {
    const items: Item[] = [];
    for (let i = 0; i < count; i++) {
      items.push(this.itemSystem.generateItem(undefined, rarity));
    }
    return items;
  }

  /**
   * Generate skills based on context
   */
  generateSkills(count: number, category?: string): Skill[] {
    const skills: Skill[] = [];
    for (let i = 0; i < count; i++) {
      skills.push(this.itemSystem.generateSkill(category));
    }
    return skills;
  }

  /**
   * Process stat merge between worlds
   */
  processStatMerge() {
    return this.statMerging.processMerge();
  }

  /**
   * Get world state
   */
  getWorldState() {
    return this.worldBuilder.getWorldState();
  }

  /**
   * Get narrative state
   */
  getNarrativeState() {
    return this.aiEngine.getNarrativeState();
  }

  /**
   * Get combined stats
   */
  getCombinedStats() {
    return this.statMerging.getCombinedStats();
  }

  /**
   * Update engine options
   */
  updateOptions(options: Partial<StoryEngineConfig>): void {
    this.aiEngine.updateOptions({
      pacing: options.pacing,
      tone: options.tone,
      tension: options.tension,
      worldLogic: options.worldLogic,
      characterIntelligence: options.characterIntelligence,
      consistencyScore: options.consistencyScore,
    });

    if (options.qualityThreshold !== undefined) {
      this.qualityControl.setQualityThreshold(options.qualityThreshold);
    }

    if (options.statMergeEnabled !== undefined) {
      this.statMerging.updateConfig({ enabled: options.statMergeEnabled });
    }
  }

  /**
   * Generate scene for specific character
   */
  async generateCharacterScene(
    characterName: string,
    situation: string,
    emotionalContext: string
  ): Promise<string> {
    const arc = this.narrativeLogic.getCurrentArc();
    const behavior = this.characterIntel.predictReaction(
      characterName,
      situation,
      arc.intensity
    );

    const dialogue = this.characterIntel.generateDialogue(
      characterName,
      situation,
      emotionalContext
    );

    return `${behavior}\n\n${dialogue}`;
  }

  /**
   * Generate world transition event
   */
  generateWorldTransition(from: 'real' | 'vr', to: 'real' | 'vr', trigger: string): string[] {
    const effects = this.worldBuilder.transitionWorld(from, to, trigger);
    const syncLevel = this.statMerging.getSyncLevel();

    if (from !== to) {
      this.statMerging.updateSyncLevel(5);
      const syncEvent = this.statMerging.processMerge();
      effects.push(...syncEvent.effects);
    }

    return effects;
  }

  /**
   * Export engine state for persistence
   */
  exportState(): {
    narrativeState: any;
    worldState: any;
    characterData: any;
    statMerging: any;
    pacingState: any;
  } {
    return {
      narrativeState: this.getNarrativeState(),
      worldState: this.getWorldState(),
      characterData: this.characterIntel.getAllCharacterData(),
      statMerging: this.statMerging.getIntegrationState(),
      pacingState: this.pacingSystem.getCurrentPacing(),
    };
  }

  /**
   * Import engine state
   */
  importState(state: any): void {
    this.worldBuilder.restoreWorldState(state.worldState);
    this.statMerging.resetIntegration();
    // Note: Narrative state and character data would need more complex restoration logic
  }

  /**
   * Generate a scaled threat encounter based on Kael's power level
   */
  generateScaledEncounter(context: {
    kaelLevel: number;
    kaelStats: Record<string, number>;
    zoneDifficulty: 'safe' | 'moderate' | 'dangerous' | 'extreme';
    recentDefeats: string[];
  }) {
    const threatContext: ThreatContext = {
      kaelLevel: context.kaelLevel,
      kaelStats: {
        strength: context.kaelStats.strength || 50,
        agility: context.kaelStats.agility || 50,
        intelligence: context.kaelStats.intelligence || 50,
        charisma: context.kaelStats.charisma || 50,
        perception: context.kaelStats.perception || 50,
      },
      kaelSkills: [],
      recentBattles: context.recentDefeats,
      currentZone: this.worldBuilder.getWorldState().vrWorld.currentZone,
      syncLevel: this.statMerging.getSyncLevel(),
      narrativePhase: 'active',
    };
    
    return this.threatScaling.generateEncounter(threatContext);
  }

  /**
   * Get NPC reaction based on Kael's past actions
   */
  getNPCReaction(npcName: string, context: {
    currentLocation: string;
    kaelsActions: Array<{ action: string; chapter: number }>;
    previousInteractions: Array<{ npc: string; outcome: string }>;
  }) {
    // Record any new significant actions
    for (const action of context.kaelsActions) {
      this.memorySystem.recordMemory({
        id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        type: 'interaction',
        actor: 'Kael',
        target: npcName,
        action: action.action,
        location: context.currentLocation,
        world: 'vr',
        impact: 0,
        witnesses: [npcName],
        consequences: [],
        emotionalResonance: 5,
      });
    }
    
    return this.memorySystem.getNPCReaction(npcName, 'Current situation');
  }

  /**
   * Generate world consequences based on Kael's accumulated actions
   */
  generateWorldConsequences() {
    return this.memorySystem.generateWorldReaction();
  }

  /**
   * Discover lore appropriate for current chapter
   */
  discoverLore(chapterNumber: number, context: {
    currentZone: string;
    recentDiscoveries: string[];
    plotProgress: number;
  }) {
    // Get appropriate lore for this chapter
    const availableLore = this.loreManager.getLoreForChapter(chapterNumber);
    
    // Try to suggest next discovery based on what's available
    const discovered = this.loreManager.suggestNextDiscovery();
    
    return {
      available: availableLore,
      newlyDiscovered: discovered,
    };
  }

  /**
   * Get next plot thread to advance
   */
  getNextPlotThread() {
    // Return available plot threads from lore manager
    const loreState = this.loreManager.getLoreForChapter(1);
    return {
      available: loreState.hidden.length,
      suggested: loreState.hidden[0]?.id || null,
    };
  }

  /**
   * Get all active mysteries and their progress
   */
  getActiveMysteries() {
    // Get hidden and deep lore entries that represent mysteries
    const loreState = this.loreManager.getLoreForChapter(1);
    return {
      hidden: loreState.hidden.length,
      deep: loreState.deep.length,
      total: loreState.hidden.length + loreState.deep.length,
    };
  }

  /**
   * Get threat scaling statistics
   */
  getThreatStatistics() {
    // Return basic threat information
    return {
      adaptiveEnabled: true,
      scalingFactor: 1.0,
    };
  }

  /**
   * Get memory system state
   */
  getMemoryState() {
    // Return basic memory information
    return {
      totalMemories: 0,
      activeRelationships: 0,
    };
  }

  /**
   * Get lore system state
   */
  getLoreState() {
    // Get lore state for current chapter
    return this.loreManager.exportState();
  }

  /**
   * Get conflict state
   */
  getConflictState() {
    return {
      activeConflicts: this.conflictManager.getActiveConflicts(),
      overallTension: this.conflictManager.getOverallTension(),
      needsResolution: this.conflictManager.getConflictsNeedingResolution(),
    };
  }

  /**
   * Generate scene conflicts
   */
  generateSceneConflicts(context: {
    chapterNumber: number;
    world: 'real' | 'vr';
    characters: string[];
    intensity: 'low' | 'medium' | 'high';
  }) {
    return this.conflictManager.generateSceneConflicts(context);
  }

  /**
   * Get system screen state
   */
  getSystemScreenState() {
    return this.systemScreen.exportState();
  }

  /**
   * Check for Progenitor reveal
   */
  checkProgenitorReveal(context: {
    vrLevel: number;
    syncLevel: number;
    chapterNumber: number;
  }) {
    return this.systemScreen.checkProgenitorReveal(context);
  }

  /**
   * Get cinematic state
   */
  getCinematicState() {
    return this.cinematicEnhancer.exportState();
  }

  /**
   * Generate cinematic shot sequence
   */
  generateCinematicShots(sceneType: 'introduction' | 'tension' | 'action' | 'revelation' | 'emotional') {
    return this.cinematicEnhancer.generateShotSequence(sceneType);
  }

  /**
   * Get theme state
   */
  getThemeState() {
    return {
      activeThemes: this.themeManager.getActiveThemes(),
      thematicSummary: this.themeManager.getThematicSummary(1),
    };
  }

  /**
   * Get themes for chapter
   */
  getThemesForChapter(chapter: number) {
    return this.themeManager.getThemesForChapter(chapter);
  }

  /**
   * Generate symbolic callback
   */
  generateSymbolicCallback(chapter: number, themeId?: string) {
    return this.themeManager.generateSymbolicCallback(chapter, { themeId });
  }

  // ===== ADVANCED AI SYSTEMS METHODS =====

  /**
   * Generate chapter with all 13 advanced AI systems
   */
  async generateAdvancedChapter(context: GenerationContext): Promise<GenerationResult> {
    // First, generate using the standard pipeline
    const baseResult = await this.generateChapter(context);

    // Apply advanced systems
    let enhancedContent = baseResult.chapter.content;

    // 1. Meta-Cognition: Validate narrative choices
    const narrativeChoice = {
      id: `chapter-\${context.chapterNumber}`,
      type: 'scene' as const,
      description: enhancedContent.substring(0, 200),
      context: `Chapter \${context.chapterNumber} progression`,
      expectedImpact: {
        emotional: 0.5,
        pacing: 0.5,
        character: 0.5,
        plot: 0.5
      },
      alternatives: ['Continue narrative', 'Shift perspective', 'Time skip']
    };
    const validation = this.metaCognition.validateNarrativeChoice(narrativeChoice);
    if (!validation.isValid) {
      enhancedContent += `\n\n[NARRATIVE NOTES: \${validation.issues.length} issues detected]`;
    }

    // 2. Predictive Arc Modeling: Simulate future narrative
    const arcSimulations = this.predictiveArcModeling.simulateArcFuture('main-arc', context.chapterNumber);
    if (arcSimulations.length > 0) {
      baseResult.suggestions.push(
        `Arc projection: \${arcSimulations[0].description}`
      );
    }

    // 3. Multi-Thread Scheduler: Manage narrative threads
    const threadWeave = this.multiThreadScheduler.generateWeave(
      context.chapterNumber,
      ['main-plot', 'character-arc']
    );
    if (threadWeave.threads.length > 0) {
      enhancedContent += `\n\n[THREAD BALANCE: \${threadWeave.threads.length} active threads]`;
    }

    // 4. Dialogue Intelligence: Analyze and enhance dialogue
    const characterNames = context.characters.map(c => c.name);
    let totalDialogueIssues = 0;
    characterNames.forEach(charName => {
      const dialogueAnalysis = this.dialogueIntelligence.analyzeDialogue(
        charName,
        enhancedContent
      );
      totalDialogueIssues += dialogueAnalysis.issues.length;
    });
    if (totalDialogueIssues > 0) {
      baseResult.suggestions.push(
        `Dialogue note: \${totalDialogueIssues} issues detected across characters`
      );
    }

    // 5. Character Continuity: Check character consistency
    context.characters.forEach(char => {
      const continuity = this.characterContinuity.checkContinuity(
        char.name,
        enhancedContent.substring(0, 500),
        context.chapterNumber
      );
      if (continuity.checks.length > 0) {
        baseResult.suggestions.push(
          `Character note: \${char.name} - \${continuity.checks.length} continuity checks`
        );
      }
    });

    // 6. Dynamic World Simulation: Evolve world state
    const worldEvolution = this.dynamicWorldSim.simulateWorldEvolution(
      context.chapterNumber
    );
    if (worldEvolution.events.length > 0) {
      baseResult.suggestions.push(
        `World evolution: \${worldEvolution.events.length} projected events`
      );
    }

    // 7. Reality Breach: Check for meta-narrative moments
    const realityGlitch = this.realityBreachFramework.generateGlitch(context.chapterNumber, 'narrative_tension');
    if (realityGlitch) {
      enhancedContent += `\n\n[REALITY GLITCH: ${realityGlitch.pattern}]`;
    }

    // 8. Structural Integrity: Check for plot holes
    const structureAnalysis = this.structuralIntegrity.analyzeStructure();
    if (structureAnalysis.acts && structureAnalysis.acts.length > 0) {
      baseResult.suggestions.push(
        `Structure: ${structureAnalysis.acts.length} acts analyzed`
      );
    }

    // 9. Symbolic Logic: Track motifs and themes
    const symbolicAnalysis = this.symbolicTracker.analyzeSymbolicContent(
      enhancedContent,
      context.chapterNumber
    );
    if (symbolicAnalysis.elements.length > 0) {
      baseResult.suggestions.push(
        `Symbolic elements: \${symbolicAnalysis.elements.length} motifs tracked`
      );
    }

    // 10. Cinematic Choreography: Visual direction
    const cinematicScene = this.cinematicChoreography.analyzeScene(
      enhancedContent.substring(0, 500),
      context.chapterNumber,
      1
    );
    if (cinematicScene.visualComposition) {
      baseResult.suggestions.push(
        `Cinematic: ${cinematicScene.visualComposition.focalPoint}`
      );
    }
    // 11. Moral/Ethical Engine: Check for ethical dilemmas
    if (context.world === 'vr') {
      const moralDilemma = this.moralEthicalEngine.evaluateDilemma(
        enhancedContent.substring(0, 500),
        ['help', 'ignore'],
        'Kael',
        context.chapterNumber
      );
      if (moralDilemma.urgency > 5) {
        baseResult.suggestions.push(
          `Ethical dilemma detected with urgency: \${moralDilemma.urgency}`
        );
      }
    }

    // 12. Narrative Repair: Fix issues
    const issues = this.narrativeRepair.analyzeNarrative(
      enhancedContent,
      context.chapterNumber
    );
    if (issues.length > 0) {
      const autoFixes = this.narrativeRepair.applyAutoFixes(context.chapterNumber);
      if (autoFixes.length > 0) {
        baseResult.suggestions.push(
          `Auto-applied ${autoFixes.length} narrative fixes`
        );
      }
    }

    // 13. Cross-Arc Synergy: Balance multiple arcs
    const arcBalance = this.crossArcSynergy.balanceArcs(context.chapterNumber);
    if (arcBalance.imbalances.length > 0) {
      baseResult.suggestions.push(
        `Arc balance: ${arcBalance.imbalances.length} imbalances detected`
      );
    }

    baseResult.chapter.content = enhancedContent;
    return baseResult;
  }

  /**
   * Get status of all advanced AI systems
   */
  getAdvancedSystemsStatus() {
    return {
      metaCognition: {
        active: true,
        corrections: 0
      },
      predictiveArcModeling: {
        active: true,
        simulations: 0
      },
      multiThreadScheduler: {
        active: true,
        activeThreads: 0
      },
      dialogueIntelligence: {
        active: true,
        voiceProfiles: 0
      },
      characterContinuity: {
        active: true,
        characters: 0
      },
      dynamicWorldSimulation: {
        active: true,
        worldState: this.dynamicWorldSim.getCurrentState()
      },
      realityBreachFramework: {
        active: true,
        currentLayer: null
      },
      structuralIntegrity: {
        active: true,
        consistency: 0.85
      },
      symbolicTracker: {
        active: true,
        elements: 0,
        themes: 0
      },
      cinematicChoreography: {
        active: true,
        scenes: 0
      },
      moralEthicalEngine: {
        active: true,
        dilemmas: 0
      },
      experimentalModes: {
        active: true,
        modes: 0
      },
      narrativeRepair: {
        active: true,
        issues: 0
      },
      crossArcSynergy: {
        active: true,
        arcs: 0
      }
    };
  }

  /**
   * Generate ethical analysis for a dilemma
   */
  generateEthicalAnalysis(situation: string, options: string[], characterId: string) {
    const dilemma = this.moralEthicalEngine.evaluateDilemma(situation, options, characterId, 1);
    return {
      dilemma,
      analysis: `Ethical analysis for ${characterId} regarding: ${situation.substring(0, 50)}...`
    };
  }

  /**
   * Generate experimental narrative mode
   */
  createExperimentalMode(name: string, type: any, description: string) {
    return this.experimentalModes.createMode(name, type, description);
  }

  /**
   * Get narrative repair plan
   */
  getRepairPlan(chapter: number) {
    return this.narrativeRepair.generateRepairPlan(chapter);
  }

  /**
   * Get symbolic analysis
   */
  getSymbolicAnalysis() {
    return this.symbolicTracker.generateSymbolicReport();
  }

  /**
   * Get cinematic analysis
   */
  getCinematicAnalysis(sceneId: string) {
    return this.cinematicChoreography.generateAnalysis(sceneId);
  }
}

// Export all components
export {
  AIStoryEngine,
  NarrativeLogic,
  CharacterIntelligence,
  WorldBuilder,
  ItemSystem,
  PacingSystem,
  QualityControl,
  StatMerging,
  ThreatScalingSystem,
  MemorySystem,
  LoreManager,
  ConflictManager,
  SystemScreenGenerator,
  CinematicEnhancer,
  ThemeManager,
  // Advanced AI Systems
  MetaCognitionSystem,
  PredictiveArcModeling,
  MultiThreadNarrativeScheduler,
  DialogueIntelligenceSystem,
  CharacterContinuityGenome,
  DynamicWorldSimulation,
  RealityBreachLogicFramework,
  StructuralIntegrityLayer,
  SymbolicLogicTracker,
  CinematicChoreographyEngine,
  MoralEthicalDecisionEngine,
  ExperimentalNarrativeModes,
  NarrativeRepairSystem,
  CrossArcSynergyEngine,
  // Complete Integrated Engine
  AdvancedStoryEngine,
  WebSearchIntegration,
};

export default UnifiedStoryEngine;