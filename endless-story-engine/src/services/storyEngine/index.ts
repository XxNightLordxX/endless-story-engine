/**
 * Story Engine - Complete System Exports
 * 
 * Exports the UnifiedStoryEngine with all 27+ enhancement systems integrated.
 * All enhancement systems are also exported for direct access if needed.
 */

import type { Chapter, Character, Location } from '../../types';
import { UnifiedStoryEngine } from './UnifiedStoryEngine';

// Import and export all Core Systems
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

// Import and export all Advanced AI Systems
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

// Re-export types from main types file
export type { Chapter, Character, Location } from '../../types';

// Export types from UnifiedStoryEngine
export type { 
  StoryEngineConfig, 
  GeneratedChapter, 
  GenerateChapterOptions 
} from './UnifiedStoryEngine';

// Export the main UnifiedStoryEngine (integrates all 27+ systems)
export { UnifiedStoryEngine };

// Export all Core Systems (15 systems)
export { AIStoryEngine };
export { NarrativeLogic };
export { CharacterIntelligence };
export { WorldBuilder };
export { ItemSystem };
export { PacingSystem };
export { QualityControl };
export { StatMerging };
export { ThreatScalingSystem };
export { MemorySystem };
export { LoreManager };
export { ConflictManager };
export { SystemScreenGenerator };
export { CinematicEnhancer };
export { ThemeManager };

// Export all Advanced AI Systems (13+ systems)
export { MetaCognitionSystem };
export { PredictiveArcModeling };
export { MultiThreadNarrativeScheduler };
export { DialogueIntelligenceSystem };
export { CharacterContinuityGenome };
export { DynamicWorldSimulation };
export { RealityBreachLogicFramework };
export { StructuralIntegrityLayer };
export { SymbolicLogicTracker };
export { CinematicChoreographyEngine };
export { MoralEthicalDecisionEngine };
export { ExperimentalNarrativeModes };
export { NarrativeRepairSystem };
export { CrossArcSynergyEngine };

// GenerationResult type for backward compatibility
export interface GenerationResult {
  chapter: Chapter;
  metrics: {
    quality: number;
    pacing: number;
    tension: number;
    consistency: number;
    conflict?: number;
  };
  suggestions?: string[];
  systemMessages?: any[];
  systemScreen?: string;
  enhancementLog?: string[];
}

// Default export for convenience
export default UnifiedStoryEngine;