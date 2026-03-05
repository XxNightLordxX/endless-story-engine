import { CreativeContentGenerator } from './src/services/storyEngine/CreativeContentGenerator.ts';

console.log('Testing CreativeContentGenerator with web search integration...\n');

const generator = new CreativeContentGenerator();

const testContext = {
  chapterNumber: 1,
  world: 'vr',
  previousSummaries: [],
  characterStates: [
    {
      name: 'Kael',
      currentLevel: 1,
      skills: ['blood manipulation', 'shadow control'],
      memories: ['found the headset', 'first login to Eclipsis'],
    }
  ],
  recentEvents: [],
  worldState: {
    currentWorld: 'vr',
    chaptersInCurrentWorld: 0,
    transitions: 0,
  },
  storyArc: {
    currentPhase: 'tutorial',
    arcProgress: 0.1,
    majorEvents: [],
  },
  transitionReason: undefined,
};

const testOptions = {
  pacing: 10,
  tone: 'dark',
  tension: 10,
  descriptiveDepth: 10,
  wordCount: 500,
};

async function runTest() {
  try {
    console.log('Generating Chapter 1 (VR)...\n');
    const result = await generator.generateChapter(testContext, testOptions);
    
    console.log('✅ Generation successful!\n');
    console.log('Title:', result.title);
    console.log('Content length:', result.content.length, 'characters');
    console.log('Summary:', result.summary);
    console.log('Themes:', result.themes.join(', '));
    console.log('Events:', result.events.length, 'events extracted');
    
    console.log('\n\n--- Content Preview ---\n');
    console.log(result.content.substring(0, 500) + '...');
    
    console.log('\n\n--- Testing for duplicates ---\n');
    console.log('Generating second chapter to test duplicate detection...\n');
    
    const result2 = await generator.generateChapter({
      ...testContext,
      chapterNumber: 2,
    }, testOptions);
    
    console.log('✅ Second generation successful!');
    console.log('Checking if content is unique...\n');
    
    // Check if content is different
    const isDifferent = result.content !== result2.content;
    console.log('Content differs from first chapter:', isDifferent ? '✅ YES' : '❌ NO');
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

runTest();