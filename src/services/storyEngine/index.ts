/**
 * Story Engine - Clean Entry Point
 * 
 * This exports the UnifiedStoryEngine which handles all chapter generation.
 * No more complex system stacking - just clean, focused story generation.
 */

import type { Chapter, Character, Location } from '../../types';
import { UnifiedStoryEngine } from './UnifiedStoryEngine';

// Re-export types
export type { Chapter, Character, Location };

// Export the main engine
export { UnifiedStoryEngine };

// Export types from UnifiedStoryEngine
export type { StoryEngineConfig, GeneratedChapter, GenerateChapterOptions } from './UnifiedStoryEngine';

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
}

// Default export for convenience
export default UnifiedStoryEngine;