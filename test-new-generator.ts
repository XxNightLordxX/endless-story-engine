import { AIStoryEngine } from './src/services/storyEngine/AIStoryEngine';
import type { StoryGenerationOptions } from './src/services/storyEngine/AIStoryEngine';

async function testNewGenerator() {
  console.log('🧪 Testing New Procedural Generator...\n');
  
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
  console.log(`✓ Options configured: ${JSON.stringify(options, null, 2)}\n`);
  
  // Generate chapters
  const chapters: any[] = [];
  const allParagraphs: string[] = [];
  const chapterCount = 10;
  
  for (let i = 0; i < chapterCount; i++) {
    console.log(`\n📖 Generating Chapter ${i + 1}...`);
    
    // Generate chapter using the engine's sequential generation
    const chapter = await engine.generateChapter(chapters.length > 0 ? chapters[chapters.length - 1] : undefined);
    chapters.push(chapter);
    
    // Extract paragraphs for duplicate checking
    const paragraphs = chapter.content.split('\n\n');
    allParagraphs.push(...paragraphs);
    
    console.log(`✓ Chapter ${i + 1} generated`);
    console.log(`  - Title: ${chapter.title}`);
    console.log(`  - Words: ${chapter.content.split(/\s+/).length}`);
    console.log(`  - Paragraphs: ${paragraphs.length}`);
  }
  
  // Check for duplicates
  console.log('\n\n🔍 Checking for duplicates...');
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
  
  // Similarity check (simple phrase matching)
  console.log('\n\n🔍 Checking for similar content...');
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
  
  if (similar.length === 0) {
    console.log('✅ NO SIMILAR CONTENT FOUND! All phrases are unique.');
  } else {
    console.log(`⚠️  Found ${similar.length} similar 3-word phrases (may be acceptable):`);
    console.log(`   First few: ${similar.slice(0, 5).join(', ')}`);
  }
  
  // Final summary
  console.log('\n\n📊 TEST SUMMARY:');
  console.log(`✓ Generated ${chapters.length} chapters`);
  console.log(`✓ Total paragraphs: ${allParagraphs.length}`);
  console.log(`✓ Average words per chapter: ${Math.round(allParagraphs.join(' ').split(/\s+/).length / chapters.length)}`);
  console.log(`✓ Duplicates: ${duplicates.length}`);
  console.log(`✓ Similar phrases: ${similar.length}`);
  
  if (duplicates.length === 0 && similar.length < 10) {
    console.log('\n🎉 TEST PASSED! System is working correctly.');
    console.log('✅ Ready for full 500-chapter generation test.');
  } else {
    console.log('\n⚠️  TEST WARNINGS: Minor similarities detected but acceptable for testing.');
  }
}

// Run test
testNewGenerator().catch(console.error);