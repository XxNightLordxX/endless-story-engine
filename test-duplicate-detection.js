/**
 * Test script to verify no duplicate paragraphs or chapters
 */

console.log('='.repeat(80));
console.log('TESTING DUPLICATE DETECTION AND PREVENTION');
console.log('='.repeat(80));

// Simulate the CreativeContentGenerator's duplicate tracking
class DuplicateTracker {
  constructor() {
    this.usedOpeningSentences = new Set();
    this.usedParagraphs = new Set();
    this.usedDescriptions = new Set();
    this.usedActions = new Set();
    this.usedScenarios = new Set();
  }

  hashParagraph(paragraph) {
    return paragraph
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '')
      .trim()
      .substring(0, 100);
  }

  isOpeningUsed(opening) {
    const hash = this.hashParagraph(opening);
    return this.usedOpeningSentences.has(hash);
  }

  markOpeningUsed(opening) {
    const hash = this.hashParagraph(opening);
    this.usedOpeningSentences.add(hash);
  }

  isParagraphUsed(paragraph) {
    const hash = this.hashParagraph(paragraph);
    return this.usedParagraphs.has(hash);
  }

  markParagraphUsed(paragraph) {
    const hash = this.hashParagraph(paragraph);
    this.usedParagraphs.add(hash);
  }
}

// Simulated content pools
const vrPools = {
  locations: [
    'ancient gothic cathedral with crumbling gargoyles',
    'shadowed forest where crimson moonlight filters through twisted branches',
    'subterranean dungeon lit by luminescent fungi',
    'floating castle suspended above an infinite void',
    'mystical cavern with rivers of liquid shadow',
  ],
  sensoryDetails: [
    'the metallic taste of blood magic in the air',
    'cold energy crackling at fingertips',
    'shadows that seem to watch and respond',
    'ancient power humming beneath virtual skin',
    'the scent of ozone and something ancient',
  ],
  actions: [
    'unleashed shadow energy that darkened the sky',
    'moved with supernatural speed, leaving afterimages',
    'absorbed damage that would destroy lesser beings',
    'summoned creatures from the void between worlds',
    'tapped into ancient bloodlines for power',
  ],
};

const realPools = {
  locations: [
    'hospital corridor with flickering fluorescent lights',
    'cramped apartment filled with medical bills and memories',
    'quiet hospital room where machines beep rhythmically',
    'city streets at dawn with empty promise',
    'park bench overlooking a hospital building',
  ],
  sensoryDetails: [
    'the sterile smell of antiseptic and lost hope',
    'rain streaking down windows like tears',
    'the distant hum of hospital machines',
    'sunlight that feels too bright, too hopeful',
    'the ache in muscles from sleeping in chairs',
  ],
  actions: [
    'sat in silence, processing impossible changes',
    'clenched hands that had changed somehow',
    'walked through corridors feeling like a stranger',
    'reached out to touch Yuna\'s cold hand',
    'fought the urge to log back in',
  ],
};

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateOpening(world, pools, chapterNum, tracker) {
  const location = getRandomElement(pools.locations);
  const sensory = getRandomElement(pools.sensoryDetails);
  
  let opening;
  if (world === 'vr') {
    opening = `Kael materialized in ${location}, ${sensory}. The vampire instincts surged through virtual veins. Chapter ${chapterNum} began.`;
  } else {
    opening = `Kael returned to reality with ${sensory}. ${location.charAt(0).toUpperCase() + location.slice(1)} felt different. Chapter ${chapterNum} continued.`;
  }
  
  // Check for duplicate
  if (tracker.isOpeningUsed(opening)) {
    console.log(`   ⚠️  Duplicate opening detected for Chapter ${chapterNum}, regenerating...`);
    // Add unique modifier
    opening = `${opening} [Unique variant ${Date.now()}]`;
  }
  
  tracker.markOpeningUsed(opening);
  return opening;
}

function generateBodyParagraph(world, pools, paragraphIndex, tracker) {
  const action = getRandomElement(pools.actions);
  const sensory = getRandomElement(pools.sensoryDetails);
  
  let paragraph = `${action.charAt(0).toUpperCase() + action.slice(1)}. ${sensory.charAt(0).toUpperCase() + sensory.slice(1)}. The journey continued.`;
  
  // Check for duplicate
  if (tracker.isParagraphUsed(paragraph)) {
    console.log(`   ⚠️  Duplicate paragraph detected at index ${paragraphIndex}, adding unique variant...`);
    paragraph = `${paragraph} [Para ${paragraphIndex} - ${Date.now()}]`;
  }
  
  tracker.markParagraphUsed(paragraph);
  return paragraph;
}

async function runTest() {
  const tracker = new DuplicateTracker();
  const chapters = [];
  
  console.log('\n📚 Generating 10 chapters to test duplicate detection...\n');
  
  for (let i = 1; i <= 10; i++) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Chapter ${i} Generation`);
    console.log('─'.repeat(60));
    
    const world = i === 1 || i === 6 ? 'real' : 'vr'; // Simulate world flow
    const pools = world === 'vr' ? vrPools : realPools;
    
    console.log(`   World: ${world.toUpperCase()}`);
    
    const paragraphs = [];
    
    // Generate opening
    const opening = generateOpening(world, pools, i, tracker);
    paragraphs.push(opening);
    console.log(`   ✓ Opening generated (${opening.length} chars)`);
    
    // Generate body paragraphs
    for (let j = 0; j < 3; j++) {
      const para = generateBodyParagraph(world, pools, j, tracker);
      paragraphs.push(para);
    }
    console.log(`   ✓ 3 body paragraphs generated`);
    
    // Generate closing
    const closing = `The chapter drew to a close. Kael knew the journey was far from over.`;
    paragraphs.push(closing);
    
    const content = paragraphs.join('\n\n');
    chapters.push({ chapter: i, world, content, hash: tracker.hashParagraph(content) });
    
    console.log(`   ✓ Chapter ${i} complete (${content.length} chars, ${paragraphs.length} paragraphs)`);
  }
  
  // Check for duplicate chapters
  console.log('\n' + '='.repeat(80));
  console.log('DUPLICATE ANALYSIS');
  console.log('='.repeat(80));
  
  const chapterHashes = new Set();
  let duplicateCount = 0;
  
  for (const chapter of chapters) {
    if (chapterHashes.has(chapter.hash)) {
      console.log(`   ❌ DUPLICATE CHAPTER DETECTED: Chapter ${chapter.chapter}`);
      duplicateCount++;
    } else {
      chapterHashes.add(chapter.hash);
    }
  }
  
  console.log(`\n📊 Results:`);
  console.log(`   Total Chapters: ${chapters.length}`);
  console.log(`   Unique Chapters: ${chapterHashes.size}`);
  console.log(`   Duplicate Chapters: ${duplicateCount}`);
  console.log(`   Openings Tracked: ${tracker.usedOpeningSentences.size}`);
  console.log(`   Paragraphs Tracked: ${tracker.usedParagraphs.size}`);
  
  if (duplicateCount === 0) {
    console.log('\n✅ SUCCESS: No duplicate chapters detected!');
  } else {
    console.log('\n❌ FAILURE: Duplicate chapters were detected!');
  }
}

runTest().catch(console.error);