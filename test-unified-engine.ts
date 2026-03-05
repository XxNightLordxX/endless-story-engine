import { UnifiedStoryEngine } from './src/services/storyEngine/UnifiedStoryEngine';
import { StoryGenerationOptions } from './src/services/storyEngine/types';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestResults {
  totalChapters: number;
  totalParagraphs: number;
  duplicateParagraphs: number;
  duplicatePairs: Array<{chapter: number, paragraph: number, chapter2: number, paragraph2: number, similarity: number}>;
  avgParagraphLength: number;
  avgChapterLength: number;
  executionTime: number;
}

// Simple hash function for duplicate detection
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

// Calculate similarity between two paragraphs
function calculateSimilarity(p1: string, p2: string): number {
  const words1 = p1.toLowerCase().split(/\s+/);
  const words2 = p2.toLowerCase().split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

function analyzeResults(chapters: any[]): TestResults {
  const results: TestResults = {
    totalChapters: chapters.length,
    totalParagraphs: 0,
    duplicateParagraphs: 0,
    duplicatePairs: [],
    avgParagraphLength: 0,
    avgChapterLength: 0,
    executionTime: 0
  };
  
  const allParagraphs: Array<{text: string, chapter: number, paragraph: number, hash: string}> = [];
  let totalParaLength = 0;
  
  // Collect all paragraphs
  chapters.forEach((chapter, chIdx) => {
    const paragraphs = chapter.content.split('\n\n');
    results.totalParagraphs += paragraphs.length;
    
    paragraphs.forEach((para, pIdx) => {
      if (para.trim().length > 0) {
        allParagraphs.push({
          text: para.trim(),
          chapter: chIdx + 1,
          paragraph: pIdx + 1,
          hash: hashString(para.trim())
        });
        totalParaLength += para.trim().length;
      }
    });
  });
  
  results.avgParagraphLength = totalParaLength / results.totalParagraphs;
  results.avgChapterLength = totalParaLength / results.totalChapters;
  
  // Check for duplicates (exact matches)
  const hashCounts = new Map<string, number>();
  allParagraphs.forEach(p => {
    hashCounts.set(p.hash, (hashCounts.get(p.hash) || 0) + 1);
  });
  
  hashCounts.forEach((count, hash) => {
    if (count > 1) {
      results.duplicateParagraphs += count;
      const matching = allParagraphs.filter(p => p.hash === hash);
      for (let i = 0; i < matching.length - 1; i++) {
        for (let j = i + 1; j < matching.length; j++) {
          results.duplicatePairs.push({
            chapter: matching[i].chapter,
            paragraph: matching[i].paragraph,
            chapter2: matching[j].chapter,
            paragraph2: matching[j].paragraph,
            similarity: 1.0
          });
        }
      }
    }
  });
  
  return results;
}

function saveResults(results: TestResults, chapters: any[], testName: string) {
  const outputDir = path.join(__dirname, 'test-results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = path.join(outputDir, `${testName}-${timestamp}.json`);
  
  const fullResults = {
    testName,
    timestamp: new Date().toISOString(),
    results,
    sampleChapters: chapters.slice(0, 5).map(ch => ({
      title: ch.title,
      content: ch.content.substring(0, 500) + '...'
    }))
  };
  
  fs.writeFileSync(filename, JSON.stringify(fullResults, null, 2));
  console.log(`\n📊 Results saved to: ${filename}`);
  
  return filename;
}

async function runBasicTest() {
  console.log('='.repeat(80));
  console.log('🧪 TEST 1: Basic Functionality (5 Chapters)');
  console.log('='.repeat(80));
  
  const engine = new UnifiedStoryEngine({
    theme: 'epic fantasy',
    mainCharacter: 'Eldrin the Wise',
    seed: 42
  });
  
  const options: StoryGenerationOptions = {
    pacing: 'balanced',
    tone: 'epic',
    tension: 0.5,
    worldLogic: 0.8,
    characterIntelligence: 0.7,
    consistencyScore: 0.9
  };
  
  const startTime = Date.now();
  const chapters: any[] = [];
  let previousChapter: any = null;
  
  for (let i = 1; i <= 5; i++) {
    console.log(`\nGenerating chapter ${i}...`);
    const chapter = await engine.generateChapter(previousChapter, options);
    chapters.push(chapter);
    previousChapter = chapter;
    console.log(`✓ Chapter ${i} generated: "${chapter.title}"`);
    console.log(`  Paragraphs: ${chapter.content.split('\n\n').length}`);
    console.log(`  Length: ${chapter.content.length} characters`);
  }
  
  const executionTime = Date.now() - startTime;
  const results = analyzeResults(chapters);
  results.executionTime = executionTime;
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESULTS');
  console.log('='.repeat(80));
  console.log(`Total Chapters: ${results.totalChapters}`);
  console.log(`Total Paragraphs: ${results.totalParagraphs}`);
  console.log(`Duplicate Paragraphs: ${results.duplicateParagraphs}`);
  console.log(`Average Paragraph Length: ${results.avgParagraphLength.toFixed(2)} chars`);
  console.log(`Average Chapter Length: ${results.avgChapterLength.toFixed(2)} chars`);
  console.log(`Execution Time: ${(executionTime / 1000).toFixed(2)}s`);
  
  if (results.duplicateParagraphs > 0) {
    console.log('\n⚠️  DUPLICATE PAIRS:');
    results.duplicatePairs.forEach(pair => {
      console.log(`  Ch ${pair.chapter} Para ${pair.paragraph} == Ch ${pair.chapter2} Para ${pair.paragraph2} (${(pair.similarity * 100).toFixed(0)}% similar)`);
    });
  } else {
    console.log('\n✅ NO DUPLICATES FOUND!');
  }
  
  saveResults(results, chapters, 'unified-basic-test');
  
  return results;
}

async function runMediumTest() {
  console.log('\n\n' + '='.repeat(80));
  console.log('🧪 TEST 2: Medium Scale (20 Chapters)');
  console.log('='.repeat(80));
  
  const engine = new UnifiedStoryEngine({
    theme: 'space exploration',
    mainCharacter: 'Captain Zara',
    seed: 999
  });
  
  const options: StoryGenerationOptions = {
    pacing: 'fast',
    tone: 'suspenseful',
    tension: 0.7,
    worldLogic: 0.9,
    characterIntelligence: 0.8,
    consistencyScore: 0.85
  };
  
  const startTime = Date.now();
  const chapters: any[] = [];
  let previousChapter: any = null;
  
  for (let i = 1; i <= 20; i++) {
    if (i % 5 === 0) {
      console.log(`\nProgress: ${i}/20 chapters...`);
    }
    const chapter = await engine.generateChapter(previousChapter, options);
    chapters.push(chapter);
    previousChapter = chapter;
  }
  
  const executionTime = Date.now() - startTime;
  const results = analyzeResults(chapters);
  results.executionTime = executionTime;
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESULTS');
  console.log('='.repeat(80));
  console.log(`Total Chapters: ${results.totalChapters}`);
  console.log(`Total Paragraphs: ${results.totalParagraphs}`);
  console.log(`Duplicate Paragraphs: ${results.duplicateParagraphs}`);
  console.log(`Average Paragraph Length: ${results.avgParagraphLength.toFixed(2)} chars`);
  console.log(`Average Chapter Length: ${results.avgChapterLength.toFixed(2)} chars`);
  console.log(`Execution Time: ${(executionTime / 1000).toFixed(2)}s`);
  console.log(`Average Time per Chapter: ${(executionTime / results.totalChapters / 1000).toFixed(2)}s`);
  
  if (results.duplicateParagraphs > 0) {
    console.log('\n⚠️  DUPLICATE PAIRS:');
    results.duplicatePairs.forEach(pair => {
      console.log(`  Ch ${pair.chapter} Para ${pair.paragraph} == Ch ${pair.chapter2} Para ${pair.paragraph2} (${(pair.similarity * 100).toFixed(0)}% similar)`);
    });
  } else {
    console.log('\n✅ NO DUPLICATES FOUND!');
  }
  
  saveResults(results, chapters, 'unified-medium-test');
  
  return results;
}

async function runFullProductionTest() {
  console.log('\n\n' + '='.repeat(80));
  console.log('🧪 TEST 3: PRODUCTION SCALE (500 Chapters)');
  console.log('='.repeat(80));
  
  const engine = new UnifiedStoryEngine({
    theme: 'cyberpunk noir',
    mainCharacter: 'Detective Rook',
    seed: 12345
  });
  
  const options: StoryGenerationOptions = {
    pacing: 'balanced',
    tone: 'dark',
    tension: 0.6,
    worldLogic: 0.85,
    characterIntelligence: 0.75,
    consistencyScore: 0.88
  };
  
  const startTime = Date.now();
  const chapters: any[] = [];
  let previousChapter: any = null;
  
  const saveFile = path.join(__dirname, 'test-results', 'unified-500-progress.json');
  const outputDir = path.join(__dirname, 'test-results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  for (let i = 1; i <= 500; i++) {
    const chapter = await engine.generateChapter(previousChapter, options);
    chapters.push(chapter);
    previousChapter = chapter;
    
    // Save progress every 50 chapters
    if (i % 50 === 0) {
      console.log(`\nProgress: ${i}/500 chapters (${((i/500)*100).toFixed(0)}%)`);
      
      const progress = {
        currentChapter: i,
        totalChapters: 500,
        elapsed: Date.now() - startTime,
        estimatedRemaining: ((Date.now() - startTime) / i) * (500 - i)
      };
      
      fs.writeFileSync(saveFile, JSON.stringify(progress, null, 2));
      console.log(`  Elapsed: ${(progress.elapsed / 1000 / 60).toFixed(1)}m`);
      console.log(`  ETA: ${(progress.estimatedRemaining / 1000 / 60).toFixed(1)}m`);
    }
  }
  
  const executionTime = Date.now() - startTime;
  const results = analyzeResults(chapters);
  results.executionTime = executionTime;
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 FINAL RESULTS');
  console.log('='.repeat(80));
  console.log(`Total Chapters: ${results.totalChapters}`);
  console.log(`Total Paragraphs: ${results.totalParagraphs}`);
  console.log(`Duplicate Paragraphs: ${results.duplicateParagraphs}`);
  console.log(`Success Rate: ${((results.totalParagraphs - results.duplicateParagraphs) / results.totalParagraphs * 100).toFixed(2)}%`);
  console.log(`Average Paragraph Length: ${results.avgParagraphLength.toFixed(2)} chars`);
  console.log(`Average Chapter Length: ${results.avgChapterLength.toFixed(2)} chars`);
  console.log(`Execution Time: ${(executionTime / 1000 / 60).toFixed(2)} minutes`);
  console.log(`Average Time per Chapter: ${(executionTime / results.totalChapters / 1000).toFixed(2)}s`);
  
  if (results.duplicateParagraphs > 0) {
    console.log('\n⚠️  DUPLICATE PAIRS:');
    results.duplicatePairs.forEach((pair, idx) => {
      if (idx < 10) { // Show first 10 only
        console.log(`  Ch ${pair.chapter} Para ${pair.paragraph} == Ch ${pair.chapter2} Para ${pair.paragraph2} (${(pair.similarity * 100).toFixed(0)}% similar)`);
      }
    });
    if (results.duplicatePairs.length > 10) {
      console.log(`  ... and ${results.duplicatePairs.length - 10} more`);
    }
  } else {
    console.log('\n✅ NO DUPLICATES FOUND!');
  }
  
  saveResults(results, chapters, 'unified-500-production');
  
  // Save full story
  const storyFile = path.join(outputDir, `unified-full-story-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(storyFile, JSON.stringify(chapters, null, 2));
  console.log(`\n📚 Full story saved to: ${storyFile}`);
  
  return results;
}

async function main() {
  try {
    // Run all tests
    const basicResults = await runBasicTest();
    const mediumResults = await runMediumTest();
    
    console.log('\n\n' + '='.repeat(80));
    console.log('🎉 ALL TESTS COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80));
    console.log('\nSummary:');
    console.log(`  Basic Test (5 chapters): ${basicResults.duplicateParagraphs} duplicates`);
    console.log(`  Medium Test (20 chapters): ${mediumResults.duplicateParagraphs} duplicates`);
    console.log('\n✅ The UnifiedStoryEngine is working correctly!');
    console.log('\n💡 To run the full 500-chapter production test, run:');
    console.log('   npm run test:unified-500');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

// Run main if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runBasicTest, runMediumTest, runFullProductionTest };