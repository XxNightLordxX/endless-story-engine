import { UnifiedStoryEngine } from './src/services/storyEngine';

const storyEngine = new UnifiedStoryEngine({
  pacing: 10,
  tone: 'dark',
  tension: 10,
  worldLogic: true,
  characterIntelligence: 10,
  consistencyScore: 10,
  qualityThreshold: 70,
  statMergeEnabled: true,
});

const baseChapter = {
  id: 1,
  chapterNumber: 1,
  title: 'Chapter 1: The Arrival',
  content: `The package sat on his doorstep like a question without an answer.

Kael stared at it from his apartment doorway, the morning light casting long shadows across the worn welcome mat. The box was plain—no logos, no return address, nothing but his name handwritten in neat, deliberate strokes. He hadn't ordered anything. He couldn't afford to order anything. Not with the medical bills that piled up like autumn leaves in October.

He glanced down the hallway. Empty. The flickering fluorescent light buzzed overhead, a sound that had become background noise to his life in this building. His neighbors were at work, or asleep, or living their lives somewhere far from this corridor of aging apartments and forgotten dreams.

The headset was heavier than he expected. He turned it over in his hands, noting the sleek black design, the almost organic curves. It looked expensive—more expensive than anything he'd ever owned. The visor gleamed with an inner light, subtle but persistent, like a heartbeat made visible.

"Who sent you?" he whispered.

No answer. Just the distant hum of the city outside, the faint murmur of traffic, and somewhere, always, the memory of machines beeping in a hospital room.

He should throw it away. He should report it. He should do a hundred sensible things that sensible people do when mysterious packages arrive unbidden at their door.

But Kael hadn't felt sensible in two years. Not since the accident. Not since the long nights by Yuna's bedside, watching her chest rise and fall in rhythm with machines that had become her lungs, her heart, her everything.

He brought the headset inside.

The manual, if you could call it that, was a single card with four words: LOG IN. FIND YOURSELF.

That was it. No instructions, no warranty information, no customer service hotline. Just an invitation and a challenge.

He sat on the edge of his mattress—the only furniture in his bedroom besides a small nightstand—and stared at the device. His phone buzzed with a text from the hospital. His daily reminder. Visiting hours were in three hours.

"I'll be there," he said aloud, as if Yuna could hear him. "I'll be there. I just need to... figure this out first."

The headset fit perfectly. Almost too perfectly. As if it had been made specifically for his skull, his face, his eyes. When he pulled it on, the world didn't just go dark—it dissolved, replaced by a void that felt infinite and intimate at the same time.

Then came the light.

Brilliant. Overwhelming. The color of sunrise and moonlight combined, of blood and starfire and things that had no names in the waking world.

And a voice—neither male nor female, neither young nor old—that spoke directly into his mind:

"Welcome to Eclipsis Online, Traveler. Your journey begins now."

The world materialized around him. Not a character creation screen. Not a tutorial. Just... a room. Stone walls lit by torches. An ornate mirror reflecting a figure that was him, but also wasn't him. It wore his face, but the eyes...

The eyes were different. They held something ancient. Something hungry.

He tried to speak, to ask what was happening, but the voice returned:

"Your class has been assigned. Your fate has been written. Your bloodline... awakens."

Red text appeared before his eyes, floating in the air like smoke:

**CLASS: Vampire Progenitor**
**STATUS: Forbidden**
**BLOODLINE: Awakening**

He didn't know what any of it meant. He didn't know why his heart was pounding or why the air tasted like iron and copper and something else—something that made his teeth ache and his vision sharpen until he could see every crack in the stone walls, every grain of dust floating in the torchlight.

He only knew that nothing would ever be the same.`,
  wordCount: 1247,
  world: 'real' as const,
  createdAt: new Date().toISOString(),
  publishedAt: new Date().toISOString(),
  summary: 'Kael receives a mysterious VR headset and discovers a forbidden class awaiting him.',
  characters: ['Kael', 'Yuna'],
  locations: ["Kael's Apartment", 'Hospital', 'Eclipsis Online - Tutorial Castle'],
};

async function testChapter2() {
  console.log('\n========================================');
  console.log('TESTING CHAPTER 2 GENERATION');
  console.log('========================================\n');
  
  const characters = [{
    id: 'char-0',
    name: 'Kael',
    role: 'protagonist' as const,
    backstory: 'A young man who received a mysterious VR headset',
    motivations: ['Save Yuna', 'Survive'],
    relationships: [],
    currentLocation: 'tutorial-castle',
    isAlive: true,
  }, {
    id: 'char-1',
    name: 'Yuna',
    role: 'supporting' as const,
    backstory: 'Kael\'s sister in a coma',
    motivations: ['Recovery'],
    relationships: [],
    currentLocation: 'hospital',
    isAlive: true,
  }];

  const location = {
    id: 'tutorial-castle',
    name: 'Tutorial Castle',
    description: 'An ancient castle in Eclipsis Online where Kael awakens',
    world: 'vr' as const,
    region: 'Tutorial Zone',
    landmarks: ['Stone Walls', 'Ornate Mirror', 'Torches'],
  };

  console.log('Calling generateChapter with:');
  console.log('- chapterNumber: 2');
  console.log('- world: vr');
  console.log('- characters:', characters.map(c => c.name).join(', '));
  console.log('- location:', location.name);
  console.log('\nGenerating...\n');

  const result = await storyEngine.generateChapter({
    chapterNumber: 2,
    world: 'vr',
    characters,
    location,
    previousChapter: baseChapter,
  });

  console.log('========================================');
  console.log('CHAPTER 2 RESULT');
  console.log('========================================\n');
  console.log('TITLE:', result.chapter.title);
  console.log('WORLD:', result.chapter.world);
  console.log('WORD COUNT:', result.chapter.content?.split(/\s+/).length || 0);
  console.log('\n--- CONTENT ---\n');
  console.log(result.chapter.content);
  console.log('\n--- END CONTENT ---\n');
  console.log('METRICS:', JSON.stringify(result.metrics, null, 2));
  
  if (result.chapter.systemScreen) {
    console.log('\n--- SYSTEM SCREEN ---\n');
    console.log(result.chapter.systemScreen);
  }
}

testChapter2().catch(console.error);