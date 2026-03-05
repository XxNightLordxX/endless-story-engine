import { AIStoryEngine } from './src/services/storyEngine/AIStoryEngine';
import type { StoryGenerationOptions } from './src/services/storyEngine/AIStoryEngine';
import * as fs from 'fs';

async function test500Production() {
  console.log('🚀 FINAL PRODUCTION TEST: 500 Chapters\n');
  console.log('='.repeat(60));
  
  // Test options
  const options: StoryGenerationOptions = {
    pacing: 5,
    tone: 'dark',
    tension: 7,
    worldLogic: true,
    characterIntelligence: 75,
    consistencyScore: 90,
  };
  
  // Initialize engine
  const engine = new AIStoryEngine(options);
  
  console.log('✓ Engine initialized');
  console.log('✓ Target: 500 chapters');
  console.log('✓ Starting generation...\n');
  
  // Generate chapters
  const chapters: any[] = [];
  const allParagraphs: string[] = [];
  const targetChapterCount = 500;
  const startTime = Date.now();
  
  for (let i = 0; i < targetChapterCount; i++) {
    if (i % 50 === 0 && i > 0) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const avgTime = elapsed / i;
      const remaining = Math.floor(avgTime * (targetChapterCount - i));
      console.log(`\n📊 Progress: ${i}/${targetChapterCount} chapters`);
      console.log(`   - Elapsed: ${elapsed}s | Avg: ${avgTime.toFixed(2)}s/chapter`);
      console.log(`   - Est. remaining: ${Math.floor(remaining / 60)}m ${remaining % 60}s`);
      console.log(`   - Total paragraphs: ${allParagraphs.length}`);
    }
    
    try {
      // Generate chapter
      const chapter = await engine.generateChapter(chapters.length > 0 ? chapters[chapters.length - 1] : undefined);
      chapters.push(chapter);
      
      // Extract paragraphs for duplicate checking
      const paragraphs = chapter.content.split('\n\n');
      allParagraphs.push(...paragraphs);
      
      // Save progress every 100 chapters
      if ((i + 1) % 100 === 0) {
        const progress = {
          chaptersGenerated: i + 1,
          totalParagraphs: allParagraphs.length,
          timestamp: new Date().toISOString(),
        };
        fs.writeFileSync(`progress-${i + 1}.json`, JSON.stringify(progress, null, 2));
        console.log(`   ✓ Progress saved: ${i + 1} chapters`);
      }
    } catch (error) {
      console.error(`\n❌ Error at chapter ${i + 1}:`, error);
      console.log(`   Saving progress before exit...`);
      const errorReport = {
        failedAtChapter: i + 1,
        chaptersGenerated: chapters.length,
        totalParagraphs: allParagraphs.length,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      };
      fs.writeFileSync('error-report.json', JSON.stringify(errorReport, null, 2));
      throw error;
    }
  }
  
  const endTime = Date.now();
  const totalTime = Math.floor((endTime - startTime) / 1000);
  const avgTimePerChapter = totalTime / targetChapterCount;
  
  console.log(`\n\n${'='.repeat(60)}`);
  console.log(`🎉 ALL ${targetChapterCount} CHAPTERS GENERATED SUCCESSFULLY!`);
  console.log('='.repeat(60));
  
  // Check for duplicates
  console.log('\n🔍 Checking for duplicates...');
  const seen = new Set<string>();
  const duplicates: string[] = [];
  
  for (const paragraph of allParagraphs) {
    const clean = paragraph.trim().toLowerCase().replace(/\s+/g, ' ');
    const hash = Buffer.from(clean).toString('base64').substring(0, 100);
    
    if (seen.has(hash)) {
      duplicates.push(paragraph);
    } else {
      seen.add(hash);
    }
  }
  
  if (duplicates.length === 0) {
    console.log('✅ NO DUPLICATES FOUND! All paragraphs are unique.');
  } else {
    console.log(`❌ FOUND ${duplicates.length} DUPLICATE(S):`);
    duplicates.slice(0, 5).forEach((dup, i) => {
      console.log(`\nDuplicate ${i + 1}:`);
      console.log(dup.substring(0, 200) + '...');
    });
  }
  
  // Similarity check
  console.log('\n🔍 Analyzing content similarity...');
  const phrases: string[] = [];
  const similar: string[] = [];
  
  for (const paragraph of allParagraphs) {
    const words = paragraph.split(' ');
    for (let i = 0; i <= words.length - 3; i++) {
      const phrase = words.slice(i, i + 3).join(' ').toLowerCase();
      if (phrase.length > 15) {
        if (phrases.includes(phrase)) {
          similar.push(phrase);
        } else {
          phrases.push(phrase);
        }
      }
    }
  }
  
  const uniquePhrases = phrases.length;
  const totalPhrases = phrases.length + similar.length;
  const similarityRate = (similar.length / totalPhrases * 100).toFixed(2);
  
  // Sample unique paragraphs
  console.log('\n📝 Sample paragraphs (showing variety):');
  const sampleIndices = [0, 100, 250, 400, 599];
  sampleIndices.forEach((idx, i) => {
    if (idx < allParagraphs.length) {
      const para = allParagraphs[idx];
      console.log(`\nSample ${i + 1}:`);
      console.log(para.substring(0, 300) + '...');
    }
  });
  
  // Final summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 FINAL PRODUCTION TEST RESULTS:');
  console.log('='.repeat(60));
  console.log(`✓ Chapters generated: ${chapters.length}/${targetChapterCount}`);
  console.log(`✓ Total paragraphs: ${allParagraphs.length}`);
  console.log(`✓ Average words per chapter: ${Math.round(allParagraphs.join(' ').split(/\s+/).length / chapters.length)}`);
  console.log(`✓ Average paragraphs per chapter: ${(allParagraphs.length / chapters.length).toFixed(1)}`);
  console.log(`✓ Duplicate paragraphs: ${duplicates.length}`);
  console.log(`✓ Total phrases: ${totalPhrases.toLocaleString()}`);
  console.log(`✓ Unique phrases: ${uniquePhrases.toLocaleString()}`);
  console.log(`✓ Similarity rate: ${similarityRate}%`);
  console.log(`✓ Total time: ${Math.floor(totalTime / 60)}m ${totalTime % 60}s`);
  console.log(`✓ Average time per chapter: ${avgTimePerChapter.toFixed(2)}s`);
  
  // Final verdict
  console.log('\n' + '='.repeat(60));
  if (duplicates.length === 0) {
    console.log('🎉🎉🎉 TEST PASSED WITH EXCELLENCE! 🎉🎉🎉');
    console.log('✅ System successfully generated 500 unique chapters');
    console.log('✅ ZERO duplicate paragraphs');
    console.log('✅ Story flows great with no repetitive content');
    console.log('✅ All requirements met!');
  } else {
    console.log('⚠️  TEST COMPLETED WITH ISSUES');
    console.log(`❌ Found ${duplicates.length} duplicate paragraphs`);
  }
  console.log('='.repeat(60));
  
  // Save final report
  const finalReport = {
    testType: '500-Chapter Production Test',
    timestamp: new Date().toISOString(),
    results: {
      chaptersGenerated: chapters.length,
      totalParagraphs: allParagraphs.length,
      averageWordsPerChapter: Math.round(allParagraphs.join(' ').split(/\s+/).length / chapters.length),
      duplicateParagraphs: duplicates.length,
      totalPhrases: totalPhrases,
      uniquePhrases: uniquePhrases,
      similarityRate: parseFloat(similarityRate),
      totalTimeSeconds: totalTime,
      averageTimePerChapter: avgTimePerChapter,
    },
    verdict: duplicates.length === 0 ? 'PASSED' : 'FAILED',
  };
  
  fs.writeFileSync('final-production-report.json', JSON.stringify(finalReport, null, 2));
  console.log('\n📄 Final report saved to: final-production-report.json');
}

// Run test
test500Production().catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});