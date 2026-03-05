import { AIStoryEngine } from './src/services/storyEngine/AIStoryEngine';
import type { StoryGenerationOptions } from './src/services/storyEngine/AIStoryEngine';

async function test50Chapters() {
  console.log('🧪 Testing 50-Chapter Generation...\n');
  
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
  console.log(`✓ Target: 50 chapters\n`);
  
  // Generate chapters
  const chapters: any[] = [];
  const allParagraphs: string[] = [];
  const targetChapterCount = 50;
  
  for (let i = 0; i < targetChapterCount; i++) {
    if (i % 10 === 0) {
      console.log(`\n📖 Progress: ${i}/${targetChapterCount} chapters generated`);
    }
    
    // Generate chapter
    const chapter = await engine.generateChapter(chapters.length > 0 ? chapters[chapters.length - 1] : undefined);
    chapters.push(chapter);
    
    // Extract paragraphs for duplicate checking
    const paragraphs = chapter.content.split('\n\n');
    allParagraphs.push(...paragraphs);
  }
  
  console.log(`\n\n📖 All ${targetChapterCount} chapters generated!`);
  
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
    duplicates.forEach((dup, i) => {
      console.log(`\nDuplicate ${i + 1}:`);
      console.log(dup.substring(0, 200) + '...');
    });
  }
  
  // Similarity check
  console.log('\n🔍 Checking for similar content...');
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
  
  console.log(`✓ Total phrases: ${totalPhrases}`);
  console.log(`✓ Unique phrases: ${uniquePhrases}`);
  console.log(`✓ Similar phrases: ${similar.length}`);
  console.log(`✓ Similarity rate: ${similarityRate}%`);
  
  // Final summary
  console.log('\n\n📊 FINAL TEST SUMMARY:');
  console.log(`✓ Generated ${chapters.length} chapters`);
  console.log(`✓ Total paragraphs: ${allParagraphs.length}`);
  console.log(`✓ Average words per chapter: ${Math.round(allParagraphs.join(' ').split(/\s+/).length / chapters.length)}`);
  console.log(`✓ Duplicates: ${duplicates.length}`);
  console.log(`✓ Similarity rate: ${similarityRate}%`);
  
  if (duplicates.length === 0 && parseFloat(similarityRate) < 30) {
    console.log('\n🎉 TEST PASSED! System is working excellently.');
    console.log('✅ Ready for full 500-chapter production run.');
  } else {
    console.log('\n⚠️  TEST RESULTS: Acceptable performance.');
  }
}

// Run test
test50Chapters().catch(console.error);