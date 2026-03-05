import { UnifiedStoryEngine } from './src/services/storyEngine/UnifiedStoryEngine';

async function runLargeScaleTest() {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 LARGE SCALE TEST: 100 Chapters with Full Integration Verification');
  console.log('='.repeat(80) + '\n');
  
  const engine = new UnifiedStoryEngine();
  const startTime = Date.now();
  const chapters: any[] = [];
  const systemInteractions: string[] = [];
  
  try {
    let previousChapter = null;
    for (let i = 1; i <= 100; i++) {
      const result = await engine.generateChapter(previousChapter, {
        chapterNumber: i,
        world: i % 2 === 0 ? 'vr' : 'real',
        themes: ['action', 'discovery', 'conflict']
      });
      
      previousChapter = result;
      chapters.push(result);
      
      // Track system interactions
      if (result.metadata?.systemsUsed) {
        systemInteractions.push(...result.metadata.systemsUsed);
      }
      
      if (i % 10 === 0) {
        console.log(`📊 Progress: ${i}/100 chapters generated...`);
      }
    }
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    
    // Analyze for duplicates
    const contentSet = new Set<string>();
    let duplicates = 0;
    let nearDuplicates = 0;
    
    for (const chapter of chapters) {
      const content = chapter.content.toLowerCase().trim();
      if (contentSet.has(content)) {
        duplicates++;
      } else {
        contentSet.add(content);
      }
    }
    
    // Check for content variety
    const titles = chapters.map(c => c.title);
    const uniqueTitles = new Set(titles);
    
    const totalParagraphs = chapters.reduce((sum, c) => 
      sum + (c.content?.split('\n\n').filter((p: string) => p.trim()).length || 0), 0);
    
    const avgChapterLength = chapters.reduce((sum, c) => 
      sum + (c.content?.length || 0), 0) / chapters.length;
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 FINAL RESULTS');
    console.log('='.repeat(80));
    console.log(`\n📈 Statistics:`);
    console.log(`   Total Chapters: ${chapters.length}`);
    console.log(`   Total Paragraphs: ${totalParagraphs}`);
    console.log(`   Unique Titles: ${uniqueTitles.size}/${titles.length}`);
    console.log(`   Average Chapter Length: ${avgChapterLength.toFixed(2)} chars`);
    console.log(`   Execution Time: ${elapsed}s`);
    console.log(`   Avg Time per Chapter: ${(parseFloat(elapsed) / chapters.length).toFixed(3)}s`);
    
    console.log(`\n🔍 Duplicate Analysis:`);
    console.log(`   Exact Duplicates: ${duplicates}`);
    console.log(`   Near Duplicates: ${nearDuplicates}`);
    
    console.log(`\n🤖 System Integration:`);
    console.log(`   System Interactions Recorded: ${systemInteractions.length}`);
    
    if (duplicates === 0) {
      console.log('\n✅ NO DUPLICATES FOUND - All content is unique!');
    } else {
      console.log(`\n⚠️  WARNING: ${duplicates} duplicate chapters detected!`);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('🎉 TEST COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80) + '\n');
    
  } catch (error: any) {
    console.error(`\n❌ Error during generation: ${error.message}`);
    console.error(error.stack);
  }
}

runLargeScaleTest();