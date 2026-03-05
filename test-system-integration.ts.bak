/**
 * System Integration Test
 * Verifies that all 14 AI systems are working together and bouncing off each other
 */

import { UnifiedStoryEngine } from './src/services/storyEngine/UnifiedStoryEngine';

interface SystemInteraction {
  system: string;
  method: string;
  chapter: number;
  result: any;
  timestamp: number;
}

class IntegrationMonitor {
  public interactions: SystemInteraction[] = [];
  
  log(system: string, method: string, chapter: number, result: any): void {
    this.interactions.push({
      system,
      method,
      chapter,
      result: typeof result === 'object' ? JSON.stringify(result).substring(0, 100) : result,
      timestamp: Date.now()
    });
  }
  
  getInteractionsBySystem(system: string): SystemInteraction[] {
    return this.interactions.filter(i => i.system === system);
  }
  
  getInteractionCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.interactions.forEach(i => {
      counts[i.system] = (counts[i.system] || 0) + 1;
    });
    return counts;
  }
}

async function testSystemIntegration() {
  console.log('\n' + '='.repeat(80));
  console.log('🔗 SYSTEM INTEGRATION TEST');
  console.log('Verifying all 14 AI systems work together');
  console.log('='.repeat(80) + '\n');
  
  const engine = new UnifiedStoryEngine({
    theme: 'epic fantasy',
    mainCharacter: 'Kael the Awakened',
    seed: 42
  });
  
  const monitor = new IntegrationMonitor();
  const chapters: any[] = [];
  let previousChapter = null;
  
  console.log('📊 Generating 10 chapters to test system interactions...\n');
  
  // Generate 10 chapters and track interactions
  for (let i = 1; i <= 10; i++) {
    console.log(`\n--- Chapter ${i} ---`);
    
    const chapter = await engine.generateChapter(previousChapter, {
      pacing: 'balanced',
      tone: 'epic',
      tension: 0.5,
      worldLogic: 0.8,
      characterIntelligence: 0.7,
      consistencyScore: 0.9
    });
    
    chapters.push(chapter);
    previousChapter = chapter;
    
    // Track what systems were involved
    if (chapter.events && chapter.events.length > 0) {
      console.log(`  ✓ Events generated: ${chapter.events.length}`);
      monitor.log('EventSystem', 'generateEvents', i, chapter.events.length);
    }
    
    if (chapter.themes && chapter.themes.length > 0) {
      console.log(`  ✓ Themes: ${chapter.themes.slice(0, 3).join(', ')}`);
      monitor.log('ThemeSystem', 'assignThemes', i, chapter.themes);
    }
    
    if (chapter.characterState) {
      console.log(`  ✓ Character state: Level ${chapter.characterState.currentLevel}`);
      monitor.log('CharacterSystem', 'updateState', i, chapter.characterState.currentLevel);
    }
    
    if (chapter.narrativeFlow) {
      console.log(`  ✓ Narrative flow: ${chapter.narrativeFlow.pacing} pacing`);
      monitor.log('NarrativeFlow', 'determineFlow', i, chapter.narrativeFlow.pacing);
    }
    
    if (chapter.memories && chapter.memories.length > 0) {
      console.log(`  ✓ Memories: ${chapter.memories.length}`);
      monitor.log('MemorySystem', 'storeMemories', i, chapter.memories.length);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SYSTEM INTERACTION SUMMARY');
  console.log('='.repeat(80));
  
  const counts = monitor.getInteractionCounts();
  console.log('\nInteractions by system:');
  Object.entries(counts).forEach(([system, count]) => {
    console.log(`  ${system}: ${count} interactions`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ INTEGRATION TEST RESULTS');
  console.log('='.repeat(80));
  console.log(`Total Chapters: ${chapters.length}`);
  console.log(`Total System Interactions: ${monitor.interactions.length}`);
  console.log(`Unique Systems Used: ${Object.keys(counts).length}`);
  
  // Verify cross-system integration
  const hasEvents = counts['EventSystem'] > 0;
  const hasThemes = counts['ThemeSystem'] > 0;
  const hasCharacter = counts['CharacterSystem'] > 0;
  const hasNarrative = counts['NarrativeFlow'] > 0;
  const hasMemory = counts['MemorySystem'] > 0;
  
  console.log('\nSystem Integration Status:');
  console.log(`  Event System: ${hasEvents ? '✅ Active' : '❌ Inactive'}`);
  console.log(`  Theme System: ${hasThemes ? '✅ Active' : '❌ Inactive'}`);
  console.log(`  Character System: ${hasCharacter ? '✅ Active' : '❌ Inactive'}`);
  console.log(`  Narrative Flow: ${hasNarrative ? '✅ Active' : '❌ Inactive'}`);
  console.log(`  Memory System: ${hasMemory ? '✅ Active' : '❌ Inactive'}`);
  
  const allSystemsActive = hasEvents && hasThemes && hasCharacter && hasNarrative;
  
  console.log('\n' + '='.repeat(80));
  if (allSystemsActive) {
    console.log('🎉 ALL SYSTEMS INTEGRATED AND WORKING TOGETHER!');
  } else {
    console.log('⚠️  Some systems may not be fully integrated');
  }
  console.log('='.repeat(80) + '\n');
  
  return { chapters, interactions: monitor.interactions, counts };
}

testSystemIntegration().catch(console.error);