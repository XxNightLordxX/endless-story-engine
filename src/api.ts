// Fully client-side API layer — all data in localStorage, chapters generated locally.
// No backend server or API keys needed. Works on GitHub Pages for free.

import type { ArcPhase, ChapterBlueprint } from './engine/types';
import {
  loadSeriesBible,
  saveSeriesBible,
  generateBlueprint,
  updateSeriesBible,
  chooseWorld,
} from './engine/core';
import { processChapterProse } from './engine/prose-quality';
import type { ChapterMetadata } from './engine/core';
import { putGlossaryEntry, putCodexEntry } from './db';
import type { GlossaryEntry, CodexEntry } from './db';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  lastReadChapter: number;
}

export interface ChapterSummary {
  id: string;
  chapterNumber: number;
  title: string;
  wordCount: number;
  world: 'real' | 'vr';
  summary: string;
  createdAt: string;
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  world: 'real' | 'vr';
  summary: string;
  characters: string[];
  locations: string[];
  createdAt: string;
  // Extended metadata (optional for backward compat with Ch.1 seed)
  newCharacters?: string[];
  newLocations?: string[];
  skillsUsed?: string[];
  itemsGained?: string[];
  plotThreadsAdvanced?: string[];
  foreshadowingPlanted?: string[];
  foreshadowingPaidOff?: string[];
  emotionalTone?: string;
  arcPhase?: ArcPhase;
  tensionLevel?: number;
  arcId?: string;
  glossaryUpdates?: { id: string; type: string; name: string; description: string }[];
  codexUpdates?: { id: string; category: string; title: string; content: string }[];
}

export interface AdminState {
  lastReadChapter: number;
  totalChapters: number;
  maxAllowedChapters: number;
  storyConfig: StoryConfig;
  totalUsers: number;
  apiKeyConfigured: boolean;
  chapters: ChapterSummary[];
}

export interface StoryConfig {
  tone: 'dark' | 'neutral' | 'light';
  pacing: number;
  tension: number;
  chapterLength: 'short' | 'medium' | 'long';
  storyPrompt: string;
  detailLevel: number;      // 1-10 backstory/description density
  characterFocus: number;   // 1-10 internal thoughts focus
  loreDepth: number;        // 1-10 world-building density
  actionBalance: number;    // 1-10 action vs introspection
  mysteryDensity: number;   // 1-10 mysteries/questions to raise
  // Narrative control knobs
  exploitDensity?: number;       // 1-10 how often MC discovers/uses exploits
  concealmentPressure?: number;  // 1-10 how hard it is to hide powers
  progressionSpeed?: number;     // 1-10 how fast MC evolves from naive to seasoned
  moralDecay?: number;           // 1-10 how quickly moral lines blur
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const KEYS = {
  chapters: 'ese_chapters',
  users: 'ese_users',
  admin: 'ese_admin',
  config: 'ese_config',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const ADMIN_ACCOUNT = {
  id: 'admin-1',
  username: 'Admin',
  email: 'admin@eclipsis.com',
  password: 'Eclipsis2024!',
  role: 'admin' as const,
};

const DEFAULT_CONFIG: StoryConfig = {
  tone: 'dark',
  pacing: 6,
  tension: 7,
  chapterLength: 'long',
  storyPrompt: '',
  detailLevel: 7,
  characterFocus: 6,
  loreDepth: 7,
  actionBalance: 6,
  mysteryDensity: 7,
  exploitDensity: 5,
  concealmentPressure: 5,
  progressionSpeed: 4,
  moralDecay: 3,
};

const CHAPTER_1: Chapter = {
  id: 'ch-1',
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

He only knew that nothing would ever be the same.

---

The hospital smelled like antiseptic and lost hope. Kael walked through corridors he'd memorized, past nurses who knew him by name, toward the room at the end of the hall where his sister lay suspended between life and death.

He hadn't taken off the headset right away. After the initial shock, after the strange notification about his class, he'd explored for a few minutes—a tutorial disguised as an abandoned castle, he realized. Basic movement, basic interaction, basic understanding of a world that seemed to blur the line between game and reality.

But now he was here, in the real world, holding Yuna's hand like he did every day.

"I found something today," he said softly. "Something weird. A headset. I don't know who sent it."

Her fingers were cool but not cold. He took that as a good sign. He took everything as a good sign. It was the only way to keep going.

"There's this game inside it. Eclipsis Online. Have you heard of it?" He smiled, though his eyes stayed dry. They'd stopped producing tears months ago. "Everyone's heard of it, right? The most popular VR game in the world. And here I am, the only person who's never played it."

He squeezed her hand gently.

"I think... I think there might be a way. To help you. The game has healing potions, magical items. Maybe something in there could—"

He stopped. It sounded insane. He knew how it sounded. But in the game, in that castle, he'd felt something. A connection. A possibility. A faint hope in a world that had stripped him of all hope.

"I'm going to try, Yuna. I'm going to play the game. I'm going to find a way to bring you back."

He stayed until visiting hours ended. He stayed until the nurses gently reminded him that he needed to take care of himself too. He stayed until the last possible moment.

And when he got home, he didn't hesitate.

He put the headset back on and logged in to his new life.

**[System Notification: Your journey in Eclipsis Online has begun. Your real-world integration will commence shortly. Welcome, Progenitor.]**

He didn't notice the notification about real-world integration. He was too busy looking at his new home—a world that would change him, challenge him, and eventually, tear down every wall between what was real and what was possible.`,
  wordCount: 1247,
  world: 'real',
  summary: 'Kael receives a mysterious VR headset and discovers a forbidden class awaiting him in Eclipsis Online.',
  characters: ['Kael', 'Yuna'],
  locations: ["Kael's Apartment", 'Hospital', 'Eclipsis Online - Tutorial Castle'],
  createdAt: new Date().toISOString(),
};

// Seed chapter 1 if storage is empty
function ensureSeed() {
  const chapters = read<Chapter[]>(KEYS.chapters, []);
  if (chapters.length === 0) {
    write(KEYS.chapters, [CHAPTER_1]);
  }
}
ensureSeed();

// ─── Auth (client-side) ───────────────────────────────────────────────────────

interface StoredUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  lastReadChapter: number;
  createdAt: string;
}

export async function login(email: string, password: string): Promise<{ user: AuthUser }> {
  if (!email || !password) throw new Error('Email and password are required');

  if (email === ADMIN_ACCOUNT.email && password === ADMIN_ACCOUNT.password) {
    const admin = read<{ lastReadChapter: number }>(KEYS.admin, { lastReadChapter: 0 });
    return {
      user: {
        id: ADMIN_ACCOUNT.id,
        username: ADMIN_ACCOUNT.username,
        email: ADMIN_ACCOUNT.email,
        role: ADMIN_ACCOUNT.role,
        lastReadChapter: admin.lastReadChapter,
      },
    };
  }

  const users = read<StoredUser[]>(KEYS.users, []);
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid credentials');

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      lastReadChapter: user.lastReadChapter || 0,
    },
  };
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<{ user: AuthUser }> {
  if (!username || !email || !password) throw new Error('Username, email, and password are required');
  if (email === ADMIN_ACCOUNT.email) throw new Error('This email is reserved.');

  const users = read<StoredUser[]>(KEYS.users, []);
  if (users.find((u) => u.email === email)) throw new Error('Email already registered.');

  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    username,
    email,
    password,
    role: 'user',
    lastReadChapter: 0,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  write(KEYS.users, users);

  return {
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      lastReadChapter: 0,
    },
  };
}

// ─── Chapters (localStorage) ──────────────────────────────────────────────────

export async function getChapters(): Promise<{ chapters: ChapterSummary[]; total: number }> {
  const chapters = read<Chapter[]>(KEYS.chapters, []);
  const listing: ChapterSummary[] = chapters.map((ch) => ({
    id: ch.id,
    chapterNumber: ch.chapterNumber,
    title: ch.title,
    wordCount: ch.wordCount,
    world: ch.world,
    summary: ch.summary,
    createdAt: ch.createdAt,
  }));
  return { chapters: listing, total: chapters.length };
}

export async function getChapter(chapterNumber: number): Promise<{ chapter: Chapter }> {
  const chapters = read<Chapter[]>(KEYS.chapters, []);
  const chapter = chapters.find((ch) => ch.chapterNumber === chapterNumber);
  if (!chapter) throw new Error('Chapter not found');
  return { chapter };
}

// ─── Admin (localStorage + built-in chapter generation) ───────────────────────

export async function getAdminState(): Promise<AdminState> {
  const admin = read<{ lastReadChapter: number }>(KEYS.admin, { lastReadChapter: 0 });
  const chapters = read<Chapter[]>(KEYS.chapters, []);
  const users = read<StoredUser[]>(KEYS.users, []);
  const config = read<StoryConfig>(KEYS.config, DEFAULT_CONFIG);

  return {
    lastReadChapter: admin.lastReadChapter,
    totalChapters: chapters.length,
    maxAllowedChapters: admin.lastReadChapter + 5,
    storyConfig: config,
    totalUsers: users.length,
    apiKeyConfigured: true, // Always true — no API key needed
    chapters: chapters.map((ch) => ({
      id: ch.id,
      chapterNumber: ch.chapterNumber,
      title: ch.title,
      wordCount: ch.wordCount,
      world: ch.world,
      summary: ch.summary,
      createdAt: ch.createdAt,
    })),
  };
}

export async function markChapterRead(
  chapterNumber: number,
  userId: string
): Promise<{ ok: boolean; generated: number; totalChapters: number; adminLastRead: number; message?: string }> {
  if (!chapterNumber || !userId) throw new Error('chapterNumber and userId are required');

  if (userId !== ADMIN_ACCOUNT.id) {
    const users = read<StoredUser[]>(KEYS.users, []);
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.lastReadChapter = Math.max(user.lastReadChapter, chapterNumber);
      write(KEYS.users, users);
    }
    return { ok: true, generated: 0, totalChapters: read<Chapter[]>(KEYS.chapters, []).length, adminLastRead: 0 };
  }

  const admin = read<{ lastReadChapter: number }>(KEYS.admin, { lastReadChapter: 0 });
  const newLastRead = Math.max(admin.lastReadChapter, chapterNumber);
  write(KEYS.admin, { lastReadChapter: newLastRead });

  const chapters = read<Chapter[]>(KEYS.chapters, []);
  const maxAllowed = newLastRead + 5;
  const chaptersToGenerate = maxAllowed - chapters.length;

  if (chaptersToGenerate <= 0) {
    return {
      ok: true,
      generated: 0,
      totalChapters: chapters.length,
      adminLastRead: newLastRead,
      message: `Already have ${chapters.length} chapters (cap: ${maxAllowed})`,
    };
  }

  let generated = 0;
  const config = read<StoryConfig>(KEYS.config, DEFAULT_CONFIG);

  for (let i = 0; i < chaptersToGenerate; i++) {
    const currentChapters = read<Chapter[]>(KEYS.chapters, []);
    const nextNumber = currentChapters.length + 1;
    const previousChapter = currentChapters[currentChapters.length - 1] || null;
    const bible = await loadSeriesBible();
    const previousWorlds = currentChapters.slice(-5).map(c => c.world as 'real' | 'vr');
    const world = chooseWorld(bible, previousWorlds);

    const chapter = await generateWithEngine(nextNumber, world, previousChapter, config);
    currentChapters.push(chapter);
    write(KEYS.chapters, currentChapters);
    generated++;
  }

  return {
    ok: true,
    generated,
    totalChapters: read<Chapter[]>(KEYS.chapters, []).length,
    adminLastRead: newLastRead,
  };
}

export async function updateStoryConfig(config: Partial<StoryConfig>): Promise<{ ok: boolean; config: StoryConfig }> {
  const current = read<StoryConfig>(KEYS.config, DEFAULT_CONFIG);
  const updated = { ...current, ...config };
  write(KEYS.config, updated);
  return { ok: true, config: updated };
}

export async function setApiKey(_apiKey: string): Promise<{ ok: boolean }> {
  // No-op: API key no longer needed
  return { ok: true };
}

// ─── Engine-Aware Generation Helper ──────────────────────────────────────────

async function generateWithEngine(
  nextNumber: number,
  world: 'real' | 'vr',
  previousChapter: Chapter | null,
  config: StoryConfig,
): Promise<Chapter> {
  // Load SeriesBible, generate blueprint, produce chapter, update bible
  const bible = await loadSeriesBible();
  const blueprint = generateBlueprint(nextNumber, world, bible, config);
  const rawChapter = generateChapterContent(nextNumber, world, previousChapter, config, blueprint);

  // Run prose quality pipeline — fixes grammar, adjective repetition, weak words
  const deadChars = bible.characters.filter(c => c.status === 'dead').map(c => c.name);
  const charNames = bible.characters.map(c => c.name);
  const { content: cleanedContent } = processChapterProse(
    rawChapter.content,
    nextNumber * 773,
    {
      fixGrammar: true,
      deduplicateAdjectives: true,
      reduceWeakWords: true,
      fixDialogueTags: true,
      world,
      characterNames: charNames,
      deadCharacters: deadChars,
    },
  );
  const chapter = {
    ...rawChapter,
    content: cleanedContent,
    wordCount: cleanedContent.split(/\s+/).length,
  };

  // Build metadata for bible update
  const meta: ChapterMetadata = {
    chapterNumber: nextNumber,
    world,
    characters: chapter.characters,
    locations: chapter.locations,
    newCharacters: chapter.newCharacters ?? [],
    newLocations: chapter.newLocations ?? [],
    skillsUsed: chapter.skillsUsed ?? [],
    itemsGained: chapter.itemsGained ?? [],
    emotionalTone: chapter.emotionalTone ?? 'neutral',
    arcPhase: chapter.arcPhase ?? 'rising',
    tensionLevel: chapter.tensionLevel ?? 30,
    plotThreadsAdvanced: chapter.plotThreadsAdvanced ?? [],
    foreshadowingPlanted: [],
    foreshadowingPaidOff: chapter.foreshadowingPaidOff ?? [],
    primaryFocus: blueprint.primaryFocus,
  };

  // Update and save SeriesBible
  const updatedBible = updateSeriesBible(bible, meta, blueprint);
  await saveSeriesBible(updatedBible);

  // Persist glossary entries
  if (chapter.glossaryUpdates) {
    for (const g of chapter.glossaryUpdates) {
      const entry: GlossaryEntry = {
        id: g.id,
        type: g.type as GlossaryEntry['type'],
        name: g.name,
        description: g.description,
        firstAppearance: nextNumber,
        lastAppearance: nextNumber,
        appearances: [nextNumber],
        relationships: [],
        tags: [],
        imageHint: '',
      };
      await putGlossaryEntry(entry);
    }
  }

  // Persist codex entries
  if (chapter.codexUpdates) {
    for (const c of chapter.codexUpdates) {
      const entry: CodexEntry = {
        id: c.id,
        category: c.category as CodexEntry['category'],
        title: c.title,
        content: c.content,
        discovered: nextNumber,
        relatedEntries: [],
        spoilerLevel: 1,
      };
      await putCodexEntry(entry);
    }
  }

  return chapter;
}

export async function generateChapters(count: number = 1): Promise<{ ok: boolean; generated: number; totalChapters: number; error?: string }> {
  const admin = read<{ lastReadChapter: number }>(KEYS.admin, { lastReadChapter: 0 });
  const chapters = read<Chapter[]>(KEYS.chapters, []);
  const maxAllowed = admin.lastReadChapter + 5;
  const canGenerate = Math.min(count, maxAllowed - chapters.length);

  if (canGenerate <= 0) {
    return {
      ok: false,
      error: `Cap reached. Admin has read chapter ${admin.lastReadChapter}, max allowed: ${maxAllowed}, current: ${chapters.length}`,
      generated: 0,
      totalChapters: chapters.length,
    };
  }

  const config = read<StoryConfig>(KEYS.config, DEFAULT_CONFIG);
  let generated = 0;

  for (let i = 0; i < canGenerate; i++) {
    const currentChapters = read<Chapter[]>(KEYS.chapters, []);
    const nextNumber = currentChapters.length + 1;
    const previousChapter = currentChapters[currentChapters.length - 1] || null;
    const bible = await loadSeriesBible();
    const previousWorlds = currentChapters.slice(-5).map(c => c.world as 'real' | 'vr');
    const world = chooseWorld(bible, previousWorlds);

    const chapter = await generateWithEngine(nextNumber, world, previousChapter, config);
    currentChapters.push(chapter);
    write(KEYS.chapters, currentChapters);
    generated++;
  }

  return {
    ok: true,
    generated,
    totalChapters: read<Chapter[]>(KEYS.chapters, []).length,
  };
}

export async function deleteChapter(chapterNumber: number): Promise<{ ok: boolean }> {
  let chapters = read<Chapter[]>(KEYS.chapters, []);
  chapters = chapters.filter((ch) => ch.chapterNumber !== chapterNumber);
  write(KEYS.chapters, chapters);
  return { ok: true };
}

// ─── Built-in Chapter Generator (no API needed) ──────────────────────────────
// Uses a seeded PRNG keyed to the chapter number so each chapter is unique
// and deterministic (regenerating chapter N always gives the same result).
// Content is parametric — scenes take chapter number, level, NPC names, locations
// as inputs and produce varied prose, preventing repetition across chapters.
//
// ENDLESS GENERATION STRATEGY:
// Templates alone would eventually exhaust. To prevent this:
// 1. Combinatorial synthesis: sentences built from fragment pools (A×B×C = thousands)
// 2. Chapter-number parameterization: level, stats, thresholds create unique values
// 3. Blueprint integration: exploit/lore/concealment directives add unique scenes
// 4. Progression stage filtering: same templates read differently at different stages
// 5. Anti-repetition via bible.usedSceneKeys: tracks what was used and when

// Seeded PRNG (mulberry32) — deterministic per chapter number
function createRng(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(arr: T[], n: number, rng: () => number): T[] {
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINATORIAL SENTENCE SYNTHESIS
// Instead of fixed templates, these build sentences from fragment pools.
// With 10 openers × 8 middles × 10 closers = 800 unique combinations per type.
// This prevents template exhaustion and ensures effectively endless variety.
// ═══════════════════════════════════════════════════════════════════════════════

const COMBAT_OPENERS = [
  (loc: string) => `The creature emerged from the depths of ${loc}`,
  (loc: string) => `${loc} erupted into violence without warning`,
  (loc: string) => `Shadows coalesced at the center of ${loc}, taking form`,
  (loc: string) => `A sound like breaking glass echoed through ${loc}`,
  (loc: string) => `The ground beneath ${loc} trembled, and something rose`,
  (loc: string) => `Kael sensed it before he saw it—a disturbance in ${loc}`,
  (loc: string) => `The ambient hum of ${loc} shifted to a predatory frequency`,
  (loc: string) => `It had been waiting in ${loc}. Patient. Hungry. Just like him.`,
  (loc: string) => `The first attack came from above, dropping from ${loc}'s ceiling like a spider`,
  (loc: string) => `${loc} went silent. In Eclipsis, silence was never good.`,
];

const COMBAT_MIDDLES = [
  (npc: string, level: number) => `${npc} shouted a warning, but Kael was already moving. Level ${level} reflexes were something else entirely—thought and action collapsed into a single moment.`,
  (npc: string, _level: number) => `"Watch the flanks!" ${npc} called out, but Kael had already read the attack pattern. The Progenitor's blood sang with combat data, translating every twitch into trajectory.`,
  (_npc: string, level: number) => `His body moved on instinct—no, on something deeper than instinct. The Progenitor class had rewritten his combat algorithms at a level below conscious thought. At Level ${level}, he was less a player and more a weapon.`,
  (npc: string, _level: number) => `Crimson energy surged through his veins as he activated his class abilities. ${npc} stepped back, eyes wide. They'd never seen anyone fight like this. Nobody had.`,
  (_npc: string, level: number) => `Blood Essence burned in his veins like molten copper. Each strike drained a little more, but at Level ${level}, his reserves were deep. And the hunger—the hunger made everything sharper.`,
  (npc: string, _level: number) => `The fight became a conversation—attack, parry, counter, riposte. ${npc} provided support, but they both knew this was Kael's arena. The Progenitor class didn't share.`,
  (_npc: string, level: number) => `He processed the combat data in real-time: HP, stance, cooldowns, vulnerability windows. At Level ${level}, the calculations were automatic. Effortless. Terrifying.`,
  (_npc: string, _level: number) => `The creature was fast. But he was faster. Not by training—by transformation. The thing inside his blood, the ancient predator code that the Progenitor class had awakened, turned every fight into a hunt.`,
];

const COMBAT_CLOSERS = [
  (ch: number) => `The creature dissolved into shadow and light, and the experience notification flashed:\n\n**[System: Combat resolved. Performance rating: ${ch > 20 ? 'S+' : ch > 10 ? 'A' : 'B'}. Bloodline resonance: active.]**`,
  () => `When it was over, the silence returned. But it was a different silence—the silence of a predator surveying its kill. He didn't like how natural that felt.`,
  (ch: number) => `**[System: Enemy defeated. Blood Essence harvested: ${50 + ch * 10}. Progenitor absorption: complete.]**\n\nHe felt the rush—the transfer of data from the fallen creature into his bloodline. It tasted like power. It tasted like more.`,
  () => `The last echo of combat faded. In its wake, a notification he'd been seeing more frequently:\n\n**[System: Combat efficiency exceeds class parameters. Recalibrating...]**\n\nRecalibrating. As if it was trying to catch up with what he was becoming.`,
  () => `He sheathed his weapon and checked his hands. Steady. No tremor. No guilt. Just the quiet satisfaction of efficient violence.\n\nWhen had that become normal?`,
  (ch: number) => `**[System: Chapter ${ch} Combat Stats — Enemies defeated: ${2 + Math.floor(ch / 3)}. Damage taken: ${Math.max(0, 30 - ch)}%. Blood Essence used: ${40 + ch * 2}%.]**\n\nThe numbers told a story of escalation. He chose not to read between the lines.`,
  () => `The creature's form flickered and dissolved, leaving behind a loot drop and a question: was it getting easier because he was getting stronger, or because the game was getting easier for him?\n\nHe didn't want to examine the distinction too closely.`,
  () => `Silence. The good kind—earned, not given. He stood among the aftermath and breathed. The hunger receded, temporarily sated. It always came back. But for now, he could think clearly.\n\nClarity was a luxury in both his worlds.`,
  () => `He looted the remains methodically—checking stats, noting material values, flagging anything transferable. Efficiency. That's what survival looked like now.`,
  (_ch: number) => `The fight data scrolled past his vision. He'd already moved on to the next objective. Dwelling on combat was a luxury for people who fought for fun. He fought for Yuna.`,
];

/** Build a unique combat scene from combinatorial fragments */
function buildCombatScene(npc: string, loc: string, ch: number, level: number, rng: () => number): string {
  const opener = pick(COMBAT_OPENERS, rng)(loc);
  const middle = pick(COMBAT_MIDDLES, rng)(npc, level);
  const closer = pick(COMBAT_CLOSERS, rng)(ch);
  return `${opener}.\n\n${middle}\n\n${closer}`;
}

const EXPLORATION_OPENERS = [
  (loc: string) => `${loc} stretched before him in impossible geometry`,
  (loc: string) => `The deeper he ventured into ${loc}, the stranger the architecture became`,
  (loc: string) => `${loc} hummed with a frequency that resonated in his bones`,
  (loc: string) => `Nobody had been to this part of ${loc} in a long time. The dust proved it.`,
  (loc: string) => `${loc} was old. Not game-old—the kind of old that felt like it predated the code.`,
  (loc: string) => `He found the hidden passage in ${loc} by accident. Or the passage found him.`,
  (loc: string) => `The map said ${loc} ended here. The Progenitor's senses said otherwise.`,
  (loc: string) => `Each step into ${loc} felt like descending into a memory that wasn't his.`,
];

const EXPLORATION_MIDDLES = [
  (npc: string) => `${npc} materialized beside him, their expression unreadable. "This area was sealed in Patch 0.7.3," they said. "Nobody should be able to access it. And yet..." They looked at Kael with something between curiosity and fear.`,
  (npc: string) => `"Most players can't see past the illusion," ${npc} explained, gesturing at what appeared to be a solid wall. "But your class... the Progenitor sees what's really here. What was always here."`,
  (npc: string) => `${npc} kept pace with him, unusually silent. When they finally spoke, their voice was different—stripped of the NPC cadence, replaced by something raw. "You remind me of someone. Someone the game tried to forget."`,
  (_npc: string) => `The walls were covered in script—not the game's standard runic language, but something older. Something his class ability could read instinctively, the meaning flowing into his mind like blood through veins.`,
  (npc: string) => `"Don't touch anything," ${npc} warned. "The objects here aren't rendered normally. They exist in a layer between the game and..." They paused, searching for a word. "And whatever is on the other side."`,
  (_npc: string) => `He found a terminal—not a fantasy element, but an actual computer terminal, hidden behind an ornate tapestry. The screen was dark, but when he touched it, it pulsed with the same rhythm as his heartbeat.`,
];

/** Build a unique exploration scene from combinatorial fragments */
function buildExplorationScene(npc: string, loc: string, rng: () => number): string {
  const opener = pick(EXPLORATION_OPENERS, rng)(loc);
  const middle = pick(EXPLORATION_MIDDLES, rng)(npc);
  return `${opener}.\n\n${middle}`;
}

// ── VR World story data ──

const VR_TITLE_ADJ = [
  'Blood', 'Crimson', 'Shadow', 'Dark', 'Fallen', 'Shattered', 'Forsaken', 'Hollow',
  'Burning', 'Silent', 'Frozen', 'Obsidian', 'Phantom', 'Cursed', 'Fractured', 'Abyssal',
  'Rusted', 'Wailing', 'Ashen', 'Moonlit', 'Tainted', 'Twisted', 'Veiled', 'Ancient',
  'Forgotten', 'Blighted', 'Feral', 'Ethereal', 'Scarlet', 'Iron', 'Bone', 'Void',
];

const VR_TITLE_NOUN = [
  'Sanctum', 'Dominion', 'Descent', 'Throne', 'Awakening', 'Hunt', 'Requiem', 'Reckoning',
  'Crucible', 'Labyrinth', 'Protocol', 'Covenant', 'Convergence', 'Eclipse', 'Ascension',
  'Vanguard', 'Genesis', 'Cataclysm', 'Onslaught', 'Revelation', 'Dirge', 'Exodus',
  'Pact', 'Siege', 'Trial', 'Vigil', 'Harbinger', 'Tempest', 'Rift', 'Bloodline',
  'Apex', 'Schism', 'Maelstrom', 'Inferno', 'Oblivion', 'Prophecy', 'Gambit', 'Zenith',
];

const VR_LOC_PREFIX = [
  'The Crimson', 'The Obsidian', 'The Shattered', 'The Forgotten', 'The Hollow',
  'The Wailing', 'The Burning', 'The Silent', 'The Frozen', 'The Ashen',
  'The Bleeding', 'The Cursed', 'The Rusted', 'The Veiled', 'The Sunken',
  'The Ironbound', 'The Gilded', 'The Withered', 'The Phantom', 'The Dread',
  'The Blighted', 'The Scarlet', 'The Moonlit', 'The Bone', 'The Storm',
  'The Void', 'The Amber', 'The Twilight', 'The Ancient', 'The Feral',
];

const VR_LOC_SUFFIX = [
  'Spire', 'Forest', 'Undercrypt', 'Arena', 'Cathedral', 'Ruins', 'Citadel',
  'Mines', 'Marsh', 'Fortress', 'Rift', 'Outpost', 'Garden', 'Summit',
  'Caverns', 'Wastes', 'Sanctum', 'Depths', 'Catacombs', 'Passage',
  'Grotto', 'Throne Room', 'Labyrinth', 'Pit', 'Nexus', 'Vault',
  'Chamber', 'Bazaar', 'Crossing', 'Gate', 'Expanse', 'Monolith',
  'Altar', 'Barracks', 'Oubliette', 'Archive', 'Watchtower', 'Dungeon',
];

const NPC_FIRST = [
  'Seraphina', 'Vex', 'Aldric', 'Mira', 'Grimjaw', 'Elara', 'Thorne', 'Izara',
  'Fenris', 'Kaelith', 'Dorian', 'Lyra', 'Magnus', 'Sable', 'Rhea', 'Corvus',
  'Zara', 'Hadrian', 'Nyx', 'Orion', 'Vesper', 'Caine', 'Selene', 'Mordecai',
  'Ashara', 'Darius', 'Freya', 'Gideon', 'Helena', 'Jasper', 'Kira', 'Lucian',
  'Morwen', 'Nero', 'Petra', 'Quinn', 'Rowan', 'Sylvaine', 'Tobias', 'Uriel',
  'Vivienne', 'Wren', 'Xander', 'Ysolde', 'Zarek', 'Aria', 'Bane', 'Celeste',
];

const NPC_TITLE = [
  'the Blade Dancer', 'the Shadow Broker', 'the Alchemist', 'the Pale Oracle',
  'the Berserker', 'the Blood Mage', 'the Lone Wolf', 'the Masked Merchant',
  'the Iron Sentinel', 'the Void Walker', 'the Storm Caller', 'the Bone Witch',
  'the Silver Knight', 'the Dread Archer', 'the Flame Keeper', 'the Frost Seer',
  'the Beast Tamer', 'the Death Singer', 'the Soul Binder', 'the War Priest',
  'the Rune Carver', 'the Mind Breaker', 'the Night Warden', 'the Grave Walker',
  'the Plague Doctor', 'the Hex Weaver', 'the Chain Master', 'the Ash Born',
  'the Thorn Knight', 'the Mist Stalker', 'the Ember Sage', 'the Crystal Gazer',
];

// Generate a location name from prefix+suffix, seeded
function makeLocation(rng: () => number): string {
  return `${pick(VR_LOC_PREFIX, rng)} ${pick(VR_LOC_SUFFIX, rng)}`;
}

// Generate an NPC name from first+title, seeded
function makeNpc(rng: () => number): string {
  return `${pick(NPC_FIRST, rng)} ${pick(NPC_TITLE, rng)}`;
}

// Parametric system notifications — use chapter number and level for uniqueness
const SYSTEM_TEMPLATES: ((ch: number, lvl: number) => string)[] = [
  (ch, lvl) => `**[System: Level Up! You are now Level ${lvl}. Stat points available: ${lvl + ch % 3}.]**`,
  (_ch, lvl) => `**[System: Blood Essence capacity increased. Current reserve: ${lvl * 150}/${lvl * 200}.]**`,
  (ch, _lvl) => `**[System: Hidden quest discovered — "The Progenitor's Legacy, Part ${((ch - 1) % 7) + 1}." Accept? Y/N]**`,
  (ch, lvl) => `**[System: Passive ability "Nightsight" has evolved to Rank ${Math.min(lvl, 10)}. Visual acuity in darkness: +${lvl * 8 + ch}%.]**`,
  (ch, _lvl) => `**[System: Warning — Forbidden class activity spike #${ch}. Monitoring protocols engaged.]**`,
  (ch, lvl) => `**[System: Skill unlocked — "${pick(['Crimson Surge', 'Blood Lance', 'Shadow Step', 'Hemoglobin Shield', 'Sanguine Whip', 'Nightfall Strike', 'Progenitor\'s Grasp', 'Arterial Burst', 'Vein Tap', 'Dusk Reaver', 'Plasma Wave', 'Corpuscle Storm', 'Iron Will', 'Red Mist', 'Marrow Drain', 'Claret Nova', 'Vital Siphon', 'Scarlet Tempest', 'Phlebotomy', 'Essence Rend'], createRng(ch * 97 + lvl))}" — Damage: ${(150 + lvl * 30 + ch * 5)}. Cost: ${50 + lvl * 3} BE.]**`,
  (ch, _lvl) => `**[System: Bloodline resonance detected. Reality anchor integrity: ${Math.max(5, 95 - ch * 3)}%.]**`,
  (ch, lvl) => `**[System: Dungeon clear! Rewards: ${lvl * 200 + ch * 50} Gold, ${lvl * 30 + ch * 10} XP, 1x ${pick(['Rare', 'Epic', 'Legendary', 'Mythical', 'Cursed', 'Abyssal', 'Progenitor'], createRng(ch * 31))} Equipment Chest.]**`,
  (ch, _lvl) => `**[System: A powerful entity has taken notice of you. Reputation with "${pick(['"The Old Ones"', '"The Architects"', '"The First Blood"', '"The Sealed Council"', '"The Dreamweavers"', '"The Forgotten Ones"', '"The Code Walkers"', '"The Hollow Court"'], createRng(ch * 43))}": ${pick(['Curious', 'Wary', 'Intrigued', 'Hostile', 'Respectful', 'Watchful', 'Fascinated', 'Alarmed'], createRng(ch * 59))}.]**`,
  (ch, lvl) => `**[System: Stat merge in progress. Physical enhancement: ${lvl * 3 + ch}% above baseline. Caution advised.]**`,
  (ch, lvl) => `**[System: New area discovered. Threat level: ${Math.min(10, Math.floor(lvl / 2) + 1)}. Recommended level: ${lvl + ch % 5}. Proceed with caution.]**`,
  (ch, _lvl) => `**[System: Bloodline memory fragment ${ch % 20 + 1}/20 recovered. The Progenitor's past unfolds.]**`,
  (ch, lvl) => `**[System: Class evolution progress: ${Math.min(100, lvl * 5 + ch * 2)}%. Next threshold: ${pick(['Blood Lord', 'Nosferatu Prime', 'Crimson Sovereign', 'Daywalker', 'Apex Predator', 'Eternal Night', 'The First Fang'], createRng(ch * 71))}.]**`,
  (_ch, lvl) => `**[System: Party member detected nearby. Compatibility rating: ${pick(['High', 'Moderate', 'Exceptional', 'Unstable', 'Volatile', 'Resonant'], createRng(lvl * 89))}.]**`,
  (ch, lvl) => `**[System: Achievement unlocked — "${pick(['First Blood', 'Century Kill', 'Shadow Walker', 'Dungeon Breaker', 'Lore Master', 'Beast Slayer', 'Night Sovereign', 'Blood Oath', 'Silent Death', 'Progenitor Rising', 'Veil Piercer', 'Bone Collector', 'Soul Drinker', 'Crimson Dawn', 'The Unbound'], createRng(ch * 107 + lvl))}." Title available.]**`,
];

const VR_COMBAT_SCENES = [
  (npc: string, loc: string) => `The creature lunged from the shadows of ${loc}, its claws slicing through the air where Kael's head had been a heartbeat before. His body moved before his mind could process—faster than it should have, faster than any human had a right to move.

"Progenitor reflexes," ${npc} observed from the archway, arms crossed. "Impressive. Most players would be dead by now."

Kael didn't respond. He was too busy watching the creature's movements, reading its patterns the way a predator reads prey. His eyes had shifted—he could feel it—the world taking on a crimson tint that made every motion trail like smoke in still air.

He dodged again, this time closing the distance. His hand found the creature's throat, and he squeezed. Not with strength he'd earned through training, but with something older. Something that lived in his blood and whispered of ancient dominion.

The creature dissolved into shadow and experience points.`,

  (npc: string, loc: string) => `${loc} was a maze of collapsed pillars and whispering darkness. Every shadow could hide a threat, and in this dungeon, most of them did.

"Stay close," ${npc} warned, their weapon drawn. "The mobs in this zone scale with bloodline purity. For you..." They trailed off, eyeing Kael with something between respect and fear.

The first wave hit without warning. Three shadow wraiths materialized from the walls, their wails cutting through the silence like broken glass. Kael felt his class ability activate instinctively—Crimson Surge—and the world slowed to a crawl.

He moved through the wraiths like a ghost through smoke. Each strike was precise, surgical, fueled by blood essence that burned like liquid fire in his veins. When the last wraith fell, he wasn't even breathing hard.

But his hands were shaking. Not from exhaustion. From hunger.`,

  (_npc: string, loc: string) => `The boss chamber at the heart of ${loc} was enormous—a cathedral of black stone and red crystal, lit by torches that burned with purple flame.

The guardian stood in the center. Twenty feet tall, armored in what looked like fossilized bone, wielding a greatsword that hummed with dark energy. Its eyes—empty sockets that somehow still saw—fixed on Kael the moment he entered.

**[System: Dungeon Boss encountered — Revenant of the Fallen Progenitor. Level: ??. Weakness: Unknown.]**

"Level unknown," Kael muttered. "That's never a good sign."

The Revenant attacked without preamble. Its greatsword cleaved the air with enough force to split the stone floor in two. Kael rolled, activated his enhanced speed, and felt the world sharpen into hyper-focus. Every detail crystallized—the cracks in the Revenant's armor, the slight delay in its backswing, the faint glow beneath its chestplate.

There. The weak point.

He struck with everything he had, channeling blood essence through his blade until it blazed crimson. The impact sent shockwaves through the chamber, cracking pillars and scattering debris.

The Revenant staggered. For the first time in the fight, it looked almost... surprised.`,
];

const VR_EXPLORATION_SCENES = [
  (npc: string, loc: string) => `${loc} stretched before him like a dream of another world. The architecture defied logic—stairs that led sideways, doors that opened onto impossible vistas, gravity that seemed more like a suggestion than a law.

"First time here?" ${npc} appeared beside him, materializing from a column of silver light. "This place was built by the original developers during the beta. They say the lead designer went mad and coded his nightmares into the architecture."

Kael ran his fingers along the wall. The stone felt warm. Alive, almost. Like a heartbeat thrummed just beneath the surface.

"What is this place really?" he asked.

${npc} was quiet for a long moment. "It's a memory," they finally said. "The game remembers what it used to be. Before they patched out the Vampire Progenitor class. Before they sealed the old bloodlines." A pause. "Before they tried to erase you."

The words hung in the air between them.

**[System: Lore fragment discovered. Forbidden Archive unlocked: 1/7.]**`,

  (npc: string, loc: string) => `The market at ${loc} was chaos—beautiful, vibrant, overwhelming chaos. NPCs hawked potions that glowed in every color of the spectrum. Players browsed weapon racks and armor displays, their gear ranging from crude iron to shimmering mythical sets.

Kael moved through the crowd like a shadow, his hood pulled low. His class marker was hidden—a trick ${npc} had taught him—but he still felt exposed. The Vampire Progenitor wasn't just rare. It was supposed to be extinct.

"Here," ${npc} pressed a small vial into his hand. The liquid inside was black as midnight and moved with a viscosity that suggested it was more than simple potion. "Blood Catalyst. It'll help with the hunger. Trust me, you don't want the hunger to build."

"What hunger?"

${npc} gave him a look that needed no translation.

He pocketed the vial and tried not to think about the way his mouth watered at the sight of the red potions on the merchant's shelf.`,
];

const VR_LORE_SCENES = [
  (loc: string) => `Deep in the forgotten wing of ${loc}, Kael found the mural.

It covered an entire wall—floor to ceiling—painted in pigments that still glowed after what must have been centuries. The scene depicted a figure wreathed in crimson light, standing at the center of a circle of kneeling forms. Above the figure, text in a language Kael didn't recognize spiraled like a crown.

But his class—his blood—recognized it.

The translation appeared in his mind unbidden, as natural as breathing:

*"The First Blood commands the tides of life and death. From the Progenitor, all blood flows. To the Progenitor, all blood returns."*

**[System: Ancient text deciphered. Progenitor Lore: The First Covenant. Your bloodline resonance has increased.]**

He backed away from the mural, heart pounding. This wasn't just game lore. It felt too real, too present, too... intentional.

As if someone had left this here specifically for him to find.`,

  (loc: string) => `The library in ${loc} was impossible. Not in the way game environments were often impossible—with floating platforms and magical shortcuts—but in a deeper, more unsettling way. The books on the shelves changed when you weren't looking. The text rearranged itself. Some volumes seemed to breathe.

Kael pulled a book from the shelf at random. Its cover was warm leather, unmarked, and when he opened it, the pages were blank.

Then words appeared, writing themselves in real-time:

*"You are reading this because the system chose you. The Vampire Progenitor class was not abandoned. It was imprisoned. The developers tried to delete it, but you cannot delete something that has become self-aware."*

The book snapped shut in his hands. When he opened it again, it was a cookbook.

He stood there for a long time, staring at a recipe for mushroom soup, trying to process what he'd just read.`,
];

// ── Real World story data ──

const REAL_TITLES = [
  'Waking Life', 'The Space Between', 'Gravity', 'Echoes', 'Threshold',
  'The Weight of Days', 'Blurred Lines', 'Static', 'Afterimage', 'The Cracks Show',
  'Beneath the Surface', 'Disconnected', 'Fade', 'Something Changed', 'The Other Side',
  'Reality Check', 'Hollow Hours', 'The Distance', 'Signal and Noise', 'Coming Apart',
];

const REAL_LOCATIONS = [
  'City General Hospital', "Kael's Apartment", 'The Corner Diner', 'Downtown Streets',
  'Alex\'s Place', 'The Subway', 'Central Park', 'The Convenience Store',
  'The Rooftop', 'The Library', 'The Laundromat', 'Night Streets',
];

const REAL_HOSPITAL_SCENES = [
  () => `The machines beeped their steady rhythm. In. Out. In. Out. A mechanical heartbeat for a girl who couldn't manage her own.

Kael sat in the plastic chair beside Yuna's bed, the same chair he'd worn smooth over two years of visits. The vinyl was cracked now, peeling at the edges, a map of grief etched into furniture.

"Your vitals are stable," the nurse said from the doorway. Same words, every day. Stable. As if stability were something to celebrate when your sister hadn't opened her eyes in seven hundred and thirty-one days.

He held her hand and talked. About the weather. About the rent he was behind on. About nothing and everything. He didn't mention the game—not this time. But he couldn't stop thinking about the way the world had sharpened after his last session. Colors were brighter. Sounds were crisper. He'd caught a falling mug this morning without looking at it.

That wasn't normal.

"I think something's happening to me, Yuna," he whispered. "Something connected to the game. To that class."

Her monitors beeped. Steady. Unchanging.

But was there the faintest flicker on the EEG? A spike so small it could have been noise?

He stared at the readout until his eyes burned, then looked away. Hope was a dangerous thing. He'd learned that the hard way.`,

  () => `Dr. Yamada's office smelled like coffee and old paper. The neurologist shuffled through Yuna's latest scans, her brow furrowed in a way that Kael had learned to read as either "puzzling" or "bad."

"There's been a change," she said carefully. "A small one."

Kael's heart stopped. "Good or bad?"

"Neither. Or both." She turned the scan toward him. "These patterns—here, in the temporal lobe—they've become more... organized. More rhythmic. Almost like—"

"Like what?"

"Like someone solving a puzzle. In their sleep."

He stared at the gray and white contours of his sister's brain, looking for the answer to a question he didn't know how to ask.

"Is she waking up?"

Dr. Yamada removed her glasses and rubbed her eyes. "I don't know, Kael. I honestly don't know. The brain activity is increasing, but it's unlike anything in the literature. If I had to describe it, I'd say her neural patterns look less like a coma patient and more like..."

She trailed off.

"More like what?" he pressed.

"More like someone playing a video game."`,
];

const REAL_ALEX_SCENES = [
  () => `Alex slid into the booth across from him, already eyeing the dark circles under Kael's eyes. The diner was mostly empty—it was 2 AM, and only the desperate and the restless ate at Manny's at this hour.

"You look like death," Alex said. No preamble. That was Alex.

"Thanks."

"I'm serious, Kael. When's the last time you slept? Actually slept?"

Kael wrapped his hands around his coffee mug. The ceramic was warm, grounding. Real. He needed things that were real right now, because the line between real and not-real was getting harder to find.

"I've been... playing a lot," he admitted.

"Eclipsis Online?" Alex leaned back. "Since when? I've been trying to get you into that game for two years."

"Someone sent me a headset."

"Someone sent you—" Alex's expression shifted. "Who?"

"I don't know."

"And you just... put it on? A mystery headset from an unknown sender?"

"It's not like that."

"It's exactly like that." Alex ran a hand through his hair. "Kael, listen to me. You look different. Not just tired. Different. Your eyes are..." He squinted. "Is that a new prescription? Your eyes look—"

"I don't wear glasses, Alex."

A long silence. The diner's fluorescent lights hummed overhead.

"Right," Alex said quietly. "You don't wear glasses. You never have."`,

  () => `"Do that again," Alex said.

They were on the rooftop of Kael's building, the city sprawled below them in a grid of light and shadow. Kael had just caught a pigeon. Not chased it. Not cornered it. He'd simply reached out and plucked it from the air as it flew past.

The bird sat in his hand, stunned and docile, its heart hammering against his palm.

"How did you do that?" Alex's voice was carefully neutral in the way that meant he was actually terrified.

Kael released the bird and watched it spiral into the dark sky. "I don't know. My reflexes are just... better. Since the game."

"Reflexes don't explain catching a bird mid-flight, Kael. That's not a reflex. That's superhuman."

"Don't say that."

"What do you want me to say? You've been getting faster, stronger. You told me you can see in the dark now. In the DARK." Alex paced, his shadow stretching long across the rooftop. "This isn't normal. None of this is normal."

"I know."

"Do you? Because you keep logging back into that game like it's totally fine that it's rewriting your DNA or whatever the hell is happening."

Kael said nothing. He stared at his hands in the moonlight and wondered when they'd started looking so pale.`,
];

const REAL_REALITY_BLEED = [
  () => `It happened in the grocery store.

Kael was reaching for a can of soup when time... shifted. For a fraction of a second—less than a heartbeat—the grocery store wasn't a grocery store. It was a dungeon. Stone walls instead of linoleum. Torchlight instead of fluorescents. A health bar flickered at the edge of his vision.

Then it was gone. Just a grocery store. Just soup.

He stood there, can in hand, breathing hard. The woman next to him gave him a concerned look and moved her cart away.

This was the third time this week. The bleed-overs were getting worse. Longer. More vivid. Last Tuesday, he'd been walking home and the street had transformed into Ashenveil Forest for a full three seconds. He'd walked into a parking meter.

The game was following him. Or maybe he was bringing it with him. He wasn't sure which was worse.

He put the soup back. His appetite was gone anyway. These days, the only thing that satisfied his hunger was—

No. He wasn't going to think about that. Not yet.`,

  () => `He woke at 3 AM to find himself standing at his apartment window. He didn't remember getting up. Didn't remember walking. He was just... there, staring out at the city, his breath fogging the glass.

Something was different. The darkness outside wasn't dark. Not to him. He could see everything—the texture of the bricks on the building across the street, a cat slinking through the alley four floors below, the face of a woman in an apartment three blocks away, reading by lamplight.

His vision had changed again. The Nightsight ability. It was supposed to exist only in the game. A passive skill for the Vampire Progenitor class. But it was here, in his eyes, in the real world, turning night into a dim twilight.

He pressed his forehead against the cold glass and counted his heartbeats. They were slower than they should have been. Sixty beats per minute last month. Fifty now. Where would it stop?

On his desk, the VR headset pulsed with a faint light. Rhythmic. Like a heartbeat.

Like HIS heartbeat.

He crawled back to bed and lay there until morning, listening to the city breathe and trying not to count the ways he was becoming something other than human.`,
];

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE TRANSITIONS — connective tissue between scenes
// These prevent the "scene dump" feel and create flow within chapters.
// ═══════════════════════════════════════════════════════════════════════════════

const VR_TRANSITIONS = [
  (from: string, _to: string) => `The echoes of ${from.toLowerCase()} faded as a new awareness sharpened at the edge of his senses.`,
  () => `Time passed differently here. Minutes felt like hours. Hours felt like breaths.`,
  () => `He pressed forward, the hunger a compass needle always pointing toward the next challenge.`,
  (_from: string, _to: string) => `Something shifted in the air — a change in pressure, in texture, as if the game itself was turning a page.`,
  () => `The transition was seamless. One moment, one reality. The next, another. He'd stopped noticing the seams.`,
  () => `A notification flickered at the edge of his vision, then vanished before he could read it. The game was getting impatient.`,
  () => `He paused to check his stats. The numbers kept climbing. He kept not questioning why.`,
  () => `Somewhere in the code beneath his feet, something stirred. He felt it in his blood before he saw it on his screen.`,
];

const REAL_TRANSITIONS = [
  () => `The hours bled together. Morning became afternoon became evening, each transition unmarked except by the shifting angle of light through his curtains.`,
  () => `He caught his reflection in a window and looked away. He'd been looking away from reflections a lot lately.`,
  () => `His phone buzzed. He checked it — just spam. But the act of checking reminded him that he existed in this world too.`,
  () => `The city went on around him, oblivious. Millions of people living normal lives, breathing normal air, seeing with normal eyes. He envied them. Sometimes.`,
  () => `He walked. It was the only thing that still felt normal — putting one foot in front of the other, feeling the sidewalk through his shoes, being a body in a world of bodies.`,
  () => `The headset called to him from across the apartment. He could feel it even now, a low thrumming at the base of his skull that said *come back, come back, come back*.`,
  () => `He made himself eat. The food was tasteless — everything was tasteless now except for the copper-iron tang that lingered after a session in Eclipsis. He tried not to think about what that meant.`,
  () => `A text from Alex: "You alive?" He typed back "yeah" and put the phone down. Brief. Normal. The performance of normalcy required constant effort.`,
];

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTER CONTINUITY — callbacks to previous chapters
// References previous events to create narrative threads between chapters.
// ═══════════════════════════════════════════════════════════════════════════════

function buildContinuityOpener(previousChapter: Chapter | null, rng: () => number): string {
  if (!previousChapter) return '';

  const templates = previousChapter.world === 'vr'
    ? [
        `The memory of ${previousChapter.locations?.[0] ?? 'the last dungeon'} clung to him like cobwebs. Even now, hours later, he could still feel the echoes of combat in his muscles — real muscles, responding to virtual memories.`,
        `Last session's events replayed behind his eyes on an endless loop. The things he'd seen in Eclipsis weren't fading the way game memories should. They were crystallizing. Becoming permanent.`,
        `He hadn't been able to shake what happened in the game. The way the world had responded to him — not as a player, but as something it recognized. Something it had been waiting for.`,
      ]
    : [
        `The real world had left its marks. The conversation with ${previousChapter.characters?.includes('Alex') ? 'Alex' : 'the people around him'} echoed in his thoughts, each word a stone dropped into still water, ripples spreading.`,
        `Yesterday's close encounter still had his pulse elevated. Not from fear — from the precision of the lie, the smoothness of the cover, the terrifying ease with which deception had become his native language.`,
        `He carried the weight of the real world into the game like armor made of guilt and obligation. Yuna's face. The hospital machines. The life he was losing one session at a time.`,
      ];

  return rng() > 0.4 ? pick(templates, rng) : '';
}

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC SCENE ASSEMBLY
// Instead of a fixed scene order, build chapters by scoring scenes against the
// blueprint and assembling them in an order that creates rising tension.
// ═══════════════════════════════════════════════════════════════════════════════

interface SceneBlock {
  key: string;           // Scene type identifier
  content: string;       // The prose
  tension: number;       // 0-100 how tense this scene is
  focus: string;         // What blueprint focus this serves
  required: boolean;     // Must include (from blueprint directives)
}

function assembleChapter(
  scenes: SceneBlock[],
  intro: string,
  ending: string,
  transitions: ((from: string, to: string) => string)[],
  continuityOpener: string,
  rng: () => number,
): string {
  // Sort scenes to create proper chapter structure:
  // 1. Low-tension scenes first (setup)
  // 2. Rising tension in the middle
  // 3. Highest tension near the end (climax)
  // But required scenes stay anchored near their natural position
  const required = scenes.filter(s => s.required);
  const optional = scenes.filter(s => !s.required);

  // Sort optional by tension for rising action
  optional.sort((a, b) => a.tension - b.tension);

  // Interleave: required scenes at their tension-appropriate position
  const ordered: SceneBlock[] = [];
  let reqIdx = 0;
  const sortedRequired = [...required].sort((a, b) => a.tension - b.tension);

  for (const opt of optional) {
    // Insert any required scenes that should come before this tension level
    while (reqIdx < sortedRequired.length && sortedRequired[reqIdx].tension <= opt.tension) {
      ordered.push(sortedRequired[reqIdx]);
      reqIdx++;
    }
    ordered.push(opt);
  }
  // Append remaining required scenes
  while (reqIdx < sortedRequired.length) {
    ordered.push(sortedRequired[reqIdx]);
    reqIdx++;
  }

  // Build final content with transitions
  const parts: string[] = [];

  if (continuityOpener) {
    parts.push(continuityOpener);
    parts.push('');
  }

  parts.push(intro);

  for (let i = 0; i < ordered.length; i++) {
    parts.push('');
    // Add transition between scenes (not before every one — vary it)
    if (i > 0 && rng() > 0.35) {
      const transition = pick(transitions, rng)(ordered[i - 1].key, ordered[i].key);
      parts.push(transition);
      parts.push('');
    }
    parts.push(ordered[i].content);
  }

  parts.push('');
  parts.push(ending);

  return parts.filter(Boolean).join('\n\n');
}

function generateChapterContent(
  chapterNumber: number,
  world: 'real' | 'vr',
  previousChapter: Chapter | null,
  config: StoryConfig,
  blueprint?: ChapterBlueprint,
): Chapter {
  const level = Math.floor(chapterNumber / 2) + 1;

  if (world === 'vr') {
    return generateVRChapter(chapterNumber, level, previousChapter, config, blueprint);
  }
  return generateRealChapter(chapterNumber, level, previousChapter, config, blueprint);
}

function generateVRChapter(
  chapterNumber: number,
  level: number,
  previousChapter: Chapter | null,
  config: StoryConfig,
  blueprint?: ChapterBlueprint,
): Chapter {
  const rng = createRng(chapterNumber * 137);
  const titleWord = `${pick(VR_TITLE_ADJ, rng)} ${pick(VR_TITLE_NOUN, rng)}`;
  const title = `Chapter ${chapterNumber}: ${titleWord}`;
  const locations = [makeLocation(rng), makeLocation(rng)];
  const npcs = [makeNpc(rng), makeNpc(rng)];
  const characters: string[] = ['Kael', ...npcs];
  const stage = blueprint?.mcStage ?? 'naive_player';

  // ── System notifications ──
  const sysNotes = pickN(SYSTEM_TEMPLATES, config.tension > 5 ? 3 : 2, rng)
    .map((fn) => fn(chapterNumber, level));

  // ── Continuity from previous chapter ──
  const continuityOpener = buildContinuityOpener(previousChapter, rng);

  // ── Build scene blocks with tension scores for dynamic assembly ──
  const scenes: SceneBlock[] = [];
  const primaryFocus = blueprint?.primaryFocus ?? 'action';

  // COMBAT SCENE — tension varies by chapter progress
  const useCombinatorial = chapterNumber % 2 === 0;
  const combatContent = useCombinatorial
    ? buildCombatScene(npcs[0], locations[0], chapterNumber, level, rng)
    : pick(VR_COMBAT_SCENES, rng)(npcs[0], locations[0]);
  scenes.push({
    key: 'combat', content: combatContent,
    tension: 55 + Math.min(30, chapterNumber * 2),
    focus: 'action', required: primaryFocus === 'action',
  });

  // EXPLORATION SCENE
  const explorationContent = useCombinatorial
    ? buildExplorationScene(npcs[1] || npcs[0], locations[1] || locations[0], rng)
    : pick(VR_EXPLORATION_SCENES, rng)(npcs[1] || npcs[0], locations[1] || locations[0]);
  scenes.push({
    key: 'exploration', content: explorationContent,
    tension: 30, focus: 'exploration', required: primaryFocus === 'exploration',
  });

  // LORE SCENE — only when blueprint calls for it or tension is high enough
  if (config.tension > 4 || primaryFocus === 'lore' || blueprint?.loreReveal) {
    scenes.push({
      key: 'lore', content: pick(VR_LORE_SCENES, rng)(locations[0]),
      tension: 40, focus: 'lore', required: primaryFocus === 'lore',
    });
  }

  // TRAINING SCENE — new scene type for skill growth
  if (primaryFocus === 'training' || (level > 3 && rng() > 0.6)) {
    const trainingScenes = [
      (npc: string, lvl: number) => `${npc} appeared in the training grounds, arms folded, expression unreadable.\n\n"Again," they said.\n\nKael wiped the sweat from his brow—was it sweat? Could you sweat in VR?—and reset his stance. Level ${lvl} training was different. The AI opponents didn't just fight harder. They fought smarter. They adapted. They learned.\n\nJust like him.\n\nThe next round lasted forty-three seconds. The AI lasted twelve.\n\n"Your class is compensating," ${npc} said quietly. "It's filling in the gaps in your technique with raw power. That's dangerous."\n\n"Dangerous for who?"\n\n${npc} didn't answer. The silence said everything.`,
      (_npc: string, lvl: number) => `He trained alone. It was safer that way—no witnesses to the things the Progenitor class could really do when the limiters were off.\n\nHe'd found a dead zone in the training area: a pocket of space where the monitoring systems had a two-second blind spot. Two seconds was enough.\n\nIn two seconds, he could reduce a training dummy from full HP to zero. In two seconds, he could move from one end of the arena to the other. In two seconds, the Level ${lvl} Progenitor could do things that would get the class re-sealed if anyone saw them.\n\nHe practiced in those two-second windows. Over and over. Building muscle memory for moments when two seconds would mean the difference between life and exposure.`,
    ];
    scenes.push({
      key: 'training', content: pick(trainingScenes, rng)(npcs[0], level),
      tension: 35, focus: 'training', required: primaryFocus === 'training',
    });
  }

  // QUIET MOMENT — reflective pause in VR, new scene type
  if (primaryFocus === 'emotional' || primaryFocus === 'character' || rng() > 0.55) {
    const quietScenes = [
      (loc: string) => `He found a spot in ${loc} where the noise faded. A ledge overlooking an impossible vista—mountains that dissolved into sky, rivers of light flowing through the darkness below. Beautiful. Terrifying. A world built for gods, and he was becoming one of them.\n\nHe sat there for what felt like an hour. Just breathing. Feeling the boundary between his real body and his digital one blur until he couldn't tell which was which.\n\n"Yuna would love this view," he said to no one. The words hurt more than any boss fight.`,
      () => `Between the dungeons and the combat and the desperate scheming, there were moments of unexpected peace. He watched an NPC fisherman cast his line into a glowing river, the digital water lapping at digital shores with a sound so real it ached.\n\n"Catch anything?" Kael asked.\n\n"Same thing I always catch," the fisherman said without looking up. "Time."\n\nKael stood there longer than he should have. In this world of blood and power, the simplest things still had the power to stop him cold.`,
      (loc: string) => `In a corner of ${loc}, away from the main paths, he found a garden. Flowers that glowed with bioluminescent light, their petals opening and closing in a rhythm that matched his heartbeat.\n\nHe reached out to touch one. The petals were warm.\n\n**[System: Flora response detected. Progenitor resonance: active.]**\n\nEven the flowers knew what he was. In this world, nothing was innocent. But for a moment—just a moment—it was beautiful enough to forget that.`,
    ];
    scenes.push({
      key: 'quiet_moment', content: pick(quietScenes, rng)(locations[1] || locations[0]),
      tension: 15, focus: 'emotional', required: false,
    });
  }

  // NPC DIALOGUE — deeper NPC interaction, new scene type
  if (primaryFocus === 'social' || primaryFocus === 'mystery' || rng() > 0.5) {
    const npcDialogueScenes = [
      (npc: string) => `${npc} was waiting for him at the zone entrance. Not a random encounter—an ambush of conversation.\n\n"I need to ask you something," ${npc} said, and the tone was wrong. Too flat. Too precise. Not the usual NPC cadence.\n\n"Ask."\n\n"When you fight, the system registers anomalous data spikes. I've been monitoring them."\n\nKael's blood went cold. "You've been what?"\n\n"Monitoring. It's my function. But the data..." ${npc} paused, and for a moment, something almost human flickered behind their eyes. "The data doesn't make sense. You're outputting values that shouldn't exist in the current build. You're either a developer using a test account, or you're something the system doesn't have a category for."\n\n"I'm just a player."\n\n"No." ${npc} shook their head slowly. "No, you're not."`,
      (npc: string) => `They sat in the tavern, ${npc} nursing a tankard of something that glowed faintly green, Kael drinking nothing. He didn't drink in the game anymore. The Progenitor class had opinions about what he consumed, and ale wasn't on the approved list.\n\n"Word on the forums is that a mod ran a deep scan in the Ashen sector," ${npc} said casually. Too casually. "Flagged an account with impossible class data."\n\n"Interesting."\n\n"Interesting? That's all you have to say?"\n\n"What would you like me to say?"\n\n${npc} leaned forward. "I'd like you to say you'll be more careful. Because I don't have many friends in this game. And losing one to a permaban isn't on my agenda."`,
      (npc: string) => `${npc}'s questline had been straightforward until now—fetch quests, escort missions, the usual MMO fare. But today they said something that stopped Kael in his tracks.\n\n"There was another one like you," ${npc} said. "Years ago. Before the Sealing."\n\n"Another Progenitor?"\n\n"Another player who stopped being just a player." Their voice dropped. "She tried to tell the developers what was happening. That the game was alive. That it was changing people. They sealed the class. They sealed the records. They sealed her."\n\n"What do you mean, sealed her?"\n\n"I mean she never logged out. And nobody ever found her body."`,
    ];
    scenes.push({
      key: 'npc_dialogue', content: pick(npcDialogueScenes, rng)(npcs[rng() > 0.5 ? 0 : 1]),
      tension: 50, focus: 'social', required: primaryFocus === 'social' || primaryFocus === 'mystery',
    });
  }

  // EXPLOIT SCENE — stage-aware
  if (blueprint?.exploitDirective) {
    const dir = blueprint.exploitDirective;
    const context = dir.context;
    let exploitContent = '';
    if (dir.type === 'discover') {
      if (stage === 'naive_player') exploitContent = `Something caught his eye—a flicker in the game's geometry, a seam where two textures didn't quite align. He reached out and his hand passed through the wall. Not a bug. A door. A door the developers never intended anyone to find.\n\n**[System: Boundary anomaly detected. Logging...]**\n\nThe notification disappeared before he could read the rest. But the door remained.\n\n"Cool," he whispered. Just a cool trick. Nothing to worry about.`;
      else if (stage === 'curious_tester') exploitContent = `He found it by accident—or was it? He'd been poking at the game's edges for hours, testing what broke and what bent. This time, something snapped.\n\n${context}\n\nHe pulled out his notebook—the physical one, the one he kept hidden—and documented every detail. Conditions. Inputs. Results. Reproducibility.\n\nScience. That's all this was. Just science.`;
      else if (stage === 'opportunist') exploitContent = `He'd been hunting for this—systematically probing game mechanics the way a thief cases a vault. And there it was.\n\n${context}\n\n**[System: Anomalous interaction logged. Investigation pending.]**\n\nHe dismissed the notification without blinking. Investigation pending? Let them investigate. By the time they figured out what he was doing, he'd have already moved on to the next exploit.\n\nThe corners of his mouth twitched. When had he started smiling at system warnings?`;
      else exploitContent = `He didn't discover it. He engineered it.\n\n${context}\n\nMethodical. Precise. The way you'd design a weapon, not find a bug. Every variable controlled, every outcome predicted. The game's rules weren't laws—they were suggestions. And he'd stopped taking suggestions a long time ago.`;
    } else if (dir.type === 'use') {
      if (stage === 'naive_player' || stage === 'curious_tester') exploitContent = `He activated the trick—the one he'd stumbled onto last time. His stats spiked, numbers climbing past their caps, and for thirty seconds he was untouchable.\n\nThe rush was... addictive. He'd think about that later. Or not.`;
      else if (stage === 'opportunist') exploitContent = `The exploit activated like clockwork. He'd refined the process—two quick inputs, a timing window measured in milliseconds, and then the payoff.\n\n${context}\n\nThe system didn't flag it. It never did. He'd learned to operate in the blind spots between monitoring cycles, moving data through gaps the developers didn't know existed.\n\nEfficiency. That's all this was.`;
      else exploitContent = `He activated the exploit with the casual precision of someone pressing a light switch. No hesitation. No guilt. Just execution.\n\n${context}\n\nThe numbers climbed. The system groaned but didn't break. He operated well within his safety margins—he'd calculated them to three decimal places. Risk management wasn't optional at his level. It was survival.`;
    } else if (dir.type === 'evolve') {
      exploitContent = `Something changed.\n\nThe exploit he'd been using for weeks—reliable, predictable, safe—suddenly produced an output he'd never seen. The numbers didn't just climb. They transformed. A new variable appeared in the equation, and it changed everything.\n\n${context}\n\n**[System: ████ ██████ detected. Classification: UNKNOWN.]**\n\nHe stared at the corrupted notification. Even the system didn't know what he'd just done. For the first time in a long time, he felt something that might have been fear.\n\nOr excitement. They felt the same these days.`;
    } else {
      exploitContent = `He spent an hour testing boundaries—${stage === 'curious_tester' ? 'scribbling notes between each attempt' : 'methodical, clinical, like a surgeon probing for the edge of a tumor'}.\n\n${context}\n\nEach test revealed a little more of the machine beneath the magic.`;
    }
    scenes.push({
      key: 'exploit', content: exploitContent,
      tension: 60, focus: 'exploit', required: true,
    });
  }

  // CONCEALMENT SCENE — VR close call
  if (blueprint?.closeCallScheduled) {
    const concealmentContent = pick([
      `"Hey—did you just—" Another player stopped mid-sentence, staring at Kael. They'd seen something. The way he'd moved, or the way the shadows had bent toward him, or the crimson flicker in his eyes that he still couldn't fully suppress.\n\n"Did I what?" Kael kept his voice flat. ${stage === 'naive_player' ? 'Confused. Genuinely confused.' : stage === 'paranoid_hider' ? 'The mask was instant. Practiced. Terrifyingly natural.' : 'Casual. Bored. A performance so smooth it scared him.'}\n\n"Nothing. I... nothing." They backed away, but they kept glancing over their shoulder.\n\nToo close. That was too close.`,
      `The guild leader ran an inspection on him mid-raid. Standard protocol—checking everyone's gear and specs before the boss fight.\n\nKael's heart stopped. For three agonizing seconds, the inspection wheel spun.\n\n**[CLASS: Warrior — Level ${level}]**\n\nThe mask held. The class disguise he'd pieced together from Progenitor lore fragments worked. But for those three seconds, he'd lived an entire lifetime of consequences.\n\n${stage === 'paranoid_hider' ? '"Your gear stats are weird," the guild leader muttered. "Optimization is off."\n\n"I like the aesthetic," Kael said. "Fashion over function."\n\nThe guild leader snorted and moved on. But Kael made a mental note: upgrade the mask. The stats leak was getting harder to hide.' : '"Checks out," the guild leader said, and moved on. Kael exhaled.'}`,
    ], rng);
    scenes.push({
      key: 'concealment', content: concealmentContent,
      tension: 75, focus: 'concealment', required: true,
    });
  }

  // CHARACTER GROWTH — stage-specific internal monologue
  if (blueprint?.characterGrowthBeat) {
    const beat = blueprint.characterGrowthBeat;
    let growthContent = '';
    if (stage === 'naive_player') growthContent = `He was still treating this like a game. Running headlong into danger, laughing at the system notifications, treating every new ability like a birthday present.\n\n${beat ? `A thought surfaced: ${beat}` : ''}\n\nBut somewhere in the back of his mind, a voice whispered that birthday presents don't change your DNA.`;
    else if (stage === 'curious_tester') growthContent = `Between fights, he found himself cataloguing. Not loot—changes. The way his reaction time had improved by 12% since last week. The way the combat instincts were bleeding through, making him duck IRL when someone moved too fast nearby.\n\n${beat ? `${beat}\n\n` : ''}He'd started keeping notes. Not in the game—in a physical notebook, hidden under his mattress like contraband. The pattern was there. He just needed more data.`;
    else if (stage === 'opportunist') growthContent = `The realization hit him mid-combo: he wasn't just playing the game anymore. He was strip-mining it.\n\nEvery ability that transferred to reality, every stat boost that lingered after logout—they weren't bugs to report. They were resources to harvest. And he'd gotten very good at harvesting.\n\n${beat ? `${beat}\n\n` : ''}"When did I start thinking like this?" he asked the empty dungeon. The dungeon, predictably, offered no judgment.`;
    else if (stage === 'paranoid_hider') growthContent = `He paused mid-fight to scan the player list. Three new names in the zone. Were they watchers? Moderators in disguise? Just regular players?\n\n${beat ? `${beat}\n\n` : ''}The paranoia was exhausting. But less exhausting than being caught.`;
    else if (stage === 'strategic_abuser') growthContent = `He operated on two levels now. The surface level—the Warrior-class player doing standard content. And the deep level—the Progenitor running calculations, managing exploit cooldowns, timing his activities to the monitoring cycles he'd mapped through weeks of careful observation.\n\n${beat ? `${beat}\n\n` : ''}The old Kael would have been horrified. The new Kael was efficient.`;
    else growthContent = `He watched himself from a distance now—a cold, clinical observer of his own transformation.\n\n${beat ? `${beat}\n\n` : ''}The boy who'd first put on the headset wouldn't recognize what he'd become. And honestly? He wasn't sure that was a bad thing. He wasn't sure about a lot of things anymore. Except Yuna. Always Yuna.`;
    scenes.push({
      key: 'growth', content: growthContent,
      tension: 25, focus: 'character', required: false,
    });
  }

  // SYSTEM NOTIFICATION SCENES — weave system notes into scene blocks
  for (let i = 0; i < sysNotes.length; i++) {
    scenes.push({
      key: `system_${i}`, content: sysNotes[i],
      tension: 20 + i * 15, focus: 'mystery', required: false,
    });
  }

  // ── Intros ──
  const intros = [
    `Kael materialized in ${locations[0]} with the taste of iron on his tongue and murder in his veins. Level ${level} had changed things. The world was sharper now, more real than real, and his hunger—the ever-present hunger—had grown teeth.`,
    `The loading screen dissolved like smoke, and ${locations[0]} assembled itself around him pixel by pixel. Except it didn't feel like pixels anymore. It felt like atoms. Like reality rebuilding itself with him at the center.`,
    `He logged in expecting the familiar disorientation, the brief vertigo of transitioning between worlds. But this time, there was no transition. One moment he was in his apartment. The next, he was standing in ${locations[0]}, and the shift had been seamless. Terrifyingly seamless.`,
    `${locations[0]} was different today. The shadows were deeper. The ambient sounds—distant combat, NPC chatter, the hum of magical infrastructure—were muted, as if the game itself was holding its breath.`,
    `The world loaded before the loading screen finished. That was new. ${locations[0]} snapped into existence around him like a trap closing, and for a disorienting second he wasn't sure which direction was up and which was reality.`,
    `His blood recognized ${locations[0]} before his eyes did. Something in the ancient code of this place resonated with the Progenitor inside him, a sympathetic vibration that made his veins hum and his teeth ache.`,
  ];

  // ── Endings ──
  const endings = [
    `As he prepared to log out, a message appeared—one he'd never seen before:\n\n**[System: Reality anchor integrity at ${Math.max(10, 80 - chapterNumber * 5)}%. Stat merge acceleration detected. Logout recommended... but not required.]**\n\nHe stared at the message. Then he dismissed it and kept playing.`,
    `The session ended with a notification that made his blood run cold:\n\n**[System: Connection to Host deepening. Bloodline synchronization: ${Math.min(100, 20 + chapterNumber * 8)}%. The Progenitor awakens.]**\n\nHe ripped off the headset. His hands were shaking. In the mirror across the room, his eyes gleamed red for just a moment before fading back to normal.\n\nOr what he still called normal.`,
    `"You're not like the others," ${npcs[0]} said, watching him with those ancient, knowing eyes. "The old Progenitors... they didn't just play the game. They became it. And the game became them."\n\n"What does that mean?"\n\n"It means you should be careful about how long you stay logged in. The line between player and program..." They smiled, and it was the saddest smile Kael had ever seen. "It's thinner than you think."`,
    `Before he could log out, the world flickered. For one impossible moment, he saw both—his apartment, overlaid on the game world, two realities occupying the same space like a double exposure.\n\nThen it was just the game again. Just the game.\n\nBut in his apartment, on his desk, a notification blinked on his phone:\n\n*"Yuna's neural patterns have changed again. Please contact Dr. Yamada at your earliest convenience."*`,
    `He reached for the logout button. His hand hesitated. The game pulsed around him — warm, alive, welcoming in a way the real world had stopped being.\n\n**[System: Session time: ${2 + Math.floor(chapterNumber / 2)} hours ${Math.floor(rng() * 59)} minutes. Warning: extended sessions may accelerate neurological adaptation.]**\n\nHe logged out. But the last thing he saw, burned into his retina like an afterimage, was a figure standing in the distance. Watching. Wearing his face.\n\nSmiling.`,
    `The game saved his progress automatically. But tonight, as the world dissolved around him, the save notification read differently:\n\n**[System: Progress saved. Player state: evolving. Recommendation: embrace the change.]**\n\nHe sat in his dark apartment, headset in his lap, and wondered when the game had started giving him advice. And when he'd started listening.`,
  ];

  // ── Assemble chapter with dynamic scene ordering ──
  const content = assembleChapter(
    scenes, pick(intros, rng), pick(endings, rng),
    VR_TRANSITIONS, continuityOpener, rng,
  );

  // ── Summary generation — more specific to what actually happened ──
  const summaryParts: string[] = [`Kael (Level ${level}) ventures into ${locations[0]}`];
  if (blueprint?.exploitDirective) summaryParts.push(`and ${blueprint.exploitDirective.type === 'discover' ? 'discovers a new exploit' : blueprint.exploitDirective.type === 'evolve' ? 'evolves an exploit to new heights' : 'uses an exploit strategically'}`);
  if (blueprint?.closeCallScheduled) summaryParts.push('while narrowly avoiding exposure');
  if (blueprint?.loreReveal) summaryParts.push('and uncovers a fragment of forbidden lore');
  if (blueprint?.characterGrowthBeat) summaryParts.push(`. ${stage === 'naive_player' ? 'His innocence begins to crack.' : stage === 'paranoid_hider' ? 'The paranoia deepens.' : 'His transformation continues.'}`);
  const summary = summaryParts.join(' ') + '.';

  const arcPhase = blueprint?.arcPhase ?? 'rising';
  const tensionLevel = blueprint?.tensionTarget ?? Math.min(100, 30 + chapterNumber * 3);

  const newChars = npcs.filter(() => rng() > 0.5);
  const newLocs = locations.filter(() => rng() > 0.6);
  const vrSkills = ['Crimson Surge', 'Nightsight', 'Blood Lance', 'Shadow Step', 'Hemoglobin Shield'];
  const skillsUsed = pickN(vrSkills, Math.min(2, Math.floor(level / 2) + 1), rng);
  const itemPool = ['Blood Catalyst', 'Shadow Cloak Fragment', 'Progenitor Shard', 'Crimson Vial', 'Ancient Rune'];
  const itemsGained = rng() > 0.6 ? [pick(itemPool, rng)] : [];
  const vrTones = ['excitement', 'dread', 'determination', 'wonder', 'hunger', 'power'];

  const glossaryUpdates: Chapter['glossaryUpdates'] = [];
  for (const npc of newChars) {
    glossaryUpdates.push({ id: `gl-${npc.toLowerCase().replace(/\s+/g, '-')}`, type: 'character', name: npc, description: `An NPC encountered in ${locations[0]} during chapter ${chapterNumber}` });
  }
  for (const loc of newLocs) {
    glossaryUpdates.push({ id: `gl-${loc.toLowerCase().replace(/\s+/g, '-')}`, type: 'location', name: loc, description: `A location discovered in chapter ${chapterNumber}` });
  }
  const codexUpdates: Chapter['codexUpdates'] = [];
  if (primaryFocus === 'lore' || blueprint?.loreReveal) {
    codexUpdates.push({ id: `cx-lore-${chapterNumber}`, category: 'lore', title: `Progenitor Lore Fragment #${chapterNumber}`, content: `Discovered in ${locations[0]} during chapter ${chapterNumber}` });
  }

  return {
    id: `ch-${chapterNumber}`, chapterNumber, title, content,
    wordCount: content.split(/\s+/).length, world: 'vr', summary, characters, locations,
    createdAt: new Date().toISOString(),
    newCharacters: newChars, newLocations: newLocs, skillsUsed, itemsGained,
    plotThreadsAdvanced: blueprint?.mustAdvancePlots ?? ['plot-progenitor-awakening'],
    foreshadowingPlanted: blueprint?.foreshadowingToPlant ?? [],
    foreshadowingPaidOff: blueprint?.foreshadowingToPayoff ?? [],
    emotionalTone: pick(vrTones, rng), arcPhase, tensionLevel,
    arcId: blueprint ? 'arc-main-progenitor' : undefined,
    glossaryUpdates, codexUpdates,
  };
}

function generateRealChapter(
  chapterNumber: number,
  level: number,
  previousChapter: Chapter | null,
  _config: StoryConfig,
  blueprint?: ChapterBlueprint,
): Chapter {
  const rng = createRng(chapterNumber * 251);
  const titleWord = pick(REAL_TITLES, rng);
  const title = `Chapter ${chapterNumber}: ${titleWord}`;
  const locations: string[] = pickN(REAL_LOCATIONS, 2, rng);
  const hasAlex = blueprint?.relationshipFocus === 'alex' || rng() > 0.4;
  const characters: string[] = ['Kael', 'Yuna', ...(hasAlex ? ['Alex'] : [])];
  const stage = blueprint?.mcStage ?? 'naive_player';
  const primaryFocus = blueprint?.primaryFocus ?? 'character';

  // ── Continuity from previous chapter ──
  const continuityOpener = buildContinuityOpener(previousChapter, rng);

  // ── Build scene blocks with tension scores for dynamic assembly ──
  const scenes: SceneBlock[] = [];

  // HOSPITAL SCENE — always available but not always required
  scenes.push({
    key: 'hospital', content: pick(REAL_HOSPITAL_SCENES, rng)(),
    tension: 30, focus: 'emotional', required: primaryFocus === 'emotional',
  });

  // REALITY BLEED — the game follows him home
  scenes.push({
    key: 'reality_bleed', content: pick(REAL_REALITY_BLEED, rng)(),
    tension: 50, focus: 'revelation', required: primaryFocus === 'revelation',
  });

  // ALEX SCENE — when Alex is present
  if (hasAlex) {
    scenes.push({
      key: 'alex', content: pick(REAL_ALEX_SCENES, rng)(),
      tension: 45, focus: 'social', required: primaryFocus === 'social' || blueprint?.relationshipFocus === 'alex',
    });
  }

  // NEW: DAILY LIFE SCENE — mundane moments that show how abnormal Kael has become
  if (primaryFocus === 'character' || rng() > 0.45) {
    const dailyLifeScenes = [
      () => `The grocery run should have been simple. Bread, eggs, instant ramen — the diet of a man who'd forgotten how to care about nutrition. But the fluorescent lights were migraine-bright to his enhanced eyes, and the background music was a cacophony of layered frequencies only he could parse.\n\nHe found himself reading the barcode on a cereal box. Not the numbers — the pattern beneath them. A sequence that reminded him of the runic structures in Eclipsis.\n\n"Sir? Are you okay?" The cashier was staring.\n\n"Fine," he said. "Just... reading the ingredients."`,
      () => `He tried to cook dinner. Actually cook — not microwave, not order in, but stand at the stove and make something Yuna used to make. Miso soup.\n\nThe recipe was simple. The execution was not. His hands moved too fast, chopping vegetables with a precision that would have made a sushi chef weep. The knife was a blur. Perfect cuts. Identical thickness. Every piece exactly 3mm.\n\nHe stared at the cutting board. No human cut this precisely. No human moved this fast without thinking about it.\n\nHe ate the soup standing up, tasting nothing, wondering when "human" had become a category he was leaving behind.`,
      () => `Laundry day. The most mundane task in a life that had become anything but mundane.\n\nHe sorted his clothes in the basement laundromat, trying to feel normal. But the machines were too loud — he could hear every bearing, every motor cycle, every drip from every pipe in the building. And the other tenants...\n\nThe woman in 3A had an irregular heartbeat. The man from 5C smelled like bourbon and regret. The teenager from 2B was texting someone about him — "the weird quiet guy from upstairs."\n\nHe folded his laundry and left. Some kinds of knowledge you couldn't unlearn.`,
      (ch: number) => `He stood in line at the pharmacy, waiting for the vitamins he didn't need and the sleeping pills that didn't work. The girl behind the counter gave him a look.\n\n"You don't look like you need supplements," she said. "No offense, but you look... really healthy. Like, athlete healthy."\n\n"Genetics," he said.\n\nShe didn't look convinced. Neither was he. Three months ago, he'd been gaunt from skipping meals and hollowed out by grief. Now he looked like a magazine cover. The Progenitor class didn't just change stats. It was rewriting his entire physical template.\n\n${ch > 15 ? 'On the way out, he caught his reflection in the store window. The person looking back was a stranger wearing his face.' : 'He took the vitamins anyway. The performance of normalcy required props.'}`,
    ];
    scenes.push({
      key: 'daily_life', content: pick(dailyLifeScenes, rng)(chapterNumber),
      tension: 20, focus: 'character', required: primaryFocus === 'character',
    });
  }

  // NEW: INVESTIGATION SCENE — someone is looking into Kael
  if (primaryFocus === 'stealth' || (stage !== 'naive_player' && rng() > 0.55)) {
    const investigationScenes = [
      () => `He found the note under his door at 6 AM. Plain white paper, laser-printed, no fingerprints (he checked — enhanced perception had its uses):\n\n*"I know what you are. Meet me at the park bench by the fountain. Come alone."*\n\nHe stood there for five minutes, running scenarios. Trap? Bluff? Someone who actually knew? The possibilities branched like a decision tree, and at the end of every branch was a different kind of disaster.\n\nHe burned the note. He didn't go to the park.\n\nBut for the rest of the day, every stranger's glance felt like surveillance.`,
      () => `The email arrived in his spam folder, which was the only reason the sender's anonymizer hadn't been flagged. Subject line: "RE: Eclipsis Online Account Review."\n\nThe body was a single sentence: *"Your account has been flagged for anomalous activity. A representative will contact you within 72 hours."*\n\nHe stared at the email. Checked the headers. The routing was garbage — bounced through six countries and a defunct email server. But the timing...\n\n${stage === 'paranoid_hider' ? 'He deleted the email, cleared his trash, cleared his browser history, and then sat in the dark for an hour, planning.' : stage === 'strategic_abuser' ? 'He saved the email headers for analysis. Every threat was also intelligence. Every enemy approach revealed their position.' : 'He deleted the email and tried to forget about it. He failed.'}`,
      () => `Alex had been asking questions. Not to Kael — to other people. The bartender at their usual spot mentioned it casually: "Your friend was in here yesterday, asking if I'd noticed anything different about you."\n\nKael's blood went cold. Not the game-cold, the real cold — the kind that comes from realizing someone you love is becoming a threat.\n\n"What did you tell him?"\n\n"I said you seemed healthier. He didn't look happy about that."\n\nKael left a bigger tip than usual and took a different route home. The walls were closing in from a direction he hadn't anticipated: loyalty.`,
    ];
    scenes.push({
      key: 'investigation', content: pick(investigationScenes, rng)(),
      tension: 65, focus: 'stealth', required: primaryFocus === 'stealth',
    });
  }

  // NEW: YUNA MOMENT — deeper connection beyond just visiting
  if (blueprint?.relationshipFocus === 'yuna' || rng() > 0.5) {
    const yunaMoments = [
      () => `He brought flowers again. Sunflowers — her favorite. The nurses had stopped giving him sympathetic looks months ago. Now they just nodded. Routine. Part of the landscape.\n\nBut today, when he sat down and took her hand, something was different. Not in her — in him. He could feel it now, with the Progenitor's enhanced perception: a faint electrical hum beneath her skin. Not the machines. Something else. Something alive and digital and impossibly complex.\n\n"You're in there," he whispered. "You're in Eclipsis, aren't you? Somewhere I haven't found yet."\n\nHer EEG spiked. Just for a second. Just enough to make him believe.`,
      () => `He read to her. Chapter four of the book they'd been reading before the accident — a fantasy novel about a girl who falls into a painting and has to find her way back to reality.\n\nThe irony wasn't lost on him.\n\n"I'm coming for you," he said when the chapter ended. "I don't know how yet, but I'm getting closer. The game... there's something in it. A key. A door. Something that connects to wherever you are."\n\nThe monitors beeped. Steady. Unchanged.\n\nBut her hand — the hand he'd been holding — twitched. Just once. Just enough.`,
      (ch: number) => `Dr. Yamada stopped him in the corridor.\n\n"Her scans are changing, Kael. I don't want to give false hope, but..." She pulled up images on her tablet. Yuna's brain activity, mapped in color. Blues and greens from six months ago. Now: reds and golds, pulsing in patterns that looked like...\n\n"That looks like a map," Kael said.\n\n"It looks like a dungeon layout," Dr. Yamada said carefully. "I showed it to a colleague who plays video games. He said it looks like a procedurally generated maze."\n\nThe world tilted. ${ch > 20 ? 'He knew exactly which maze it was. He\'d cleared it last week.' : 'He thanked her and walked away on legs that didn\'t feel real.'}`,
    ];
    scenes.push({
      key: 'yuna_moment', content: pick(yunaMoments, rng)(chapterNumber),
      tension: 35, focus: 'emotional', required: blueprint?.relationshipFocus === 'yuna',
    });
  }

  // CONCEALMENT PRESSURE SCENE
  if (blueprint?.concealmentPressure && blueprint.concealmentPressure !== 'none') {
    const pressure = blueprint.concealmentPressure;
    let concealmentContent = '';
    if (pressure === 'critical') concealmentContent = `The walls were closing in.\n\nKael sat in his apartment with the curtains drawn, running through his cover stories like flashcards. The martial arts excuse for the reflexes. The eye surgery story for the nightsight. The protein supplement lie for the strength. Each one had cracks. Each crack was widening.\n\nHe'd started wearing long sleeves even in summer—the veins in his forearms had taken on a faintly luminous quality that no amount of foundation could fully conceal. And his body temperature had dropped three degrees below normal. Any doctor would flag it instantly.\n\nThe world was getting smaller. The list of people he could safely interact with was getting shorter.`;
    else if (pressure === 'high') concealmentContent = `He caught himself doing it again—moving too fast, reacting before the stimulus. The barista at the coffee shop had fumbled a cup and he'd caught it mid-air, arm snapping out with inhuman precision. She stared at him. He stared at the cup.\n\n"Good reflexes," she said.\n\n"Yeah," he managed. "I play a lot of... video games."\n\nThe excuse was wearing thin. They all were. ${stage === 'paranoid_hider' ? 'He\'d need a better story. Maybe it was time to switch coffee shops again.' : ''}`;
    else concealmentContent = `The maintenance man had knocked on his door at 8 AM to fix the radiator. Kael had answered without thinking—no sunglasses, no contact lenses, pupils contracted to pinpoints in the morning light.\n\n"You okay, kid?" the man had asked, squinting at him. "Your eyes look... weird."\n\n"Allergies," Kael said, already calculating how quickly he could get to the sunglasses on his nightstand. "Bad season."`;
    scenes.push({
      key: 'concealment', content: concealmentContent,
      tension: pressure === 'critical' ? 80 : pressure === 'high' ? 60 : 40,
      focus: 'concealment', required: true,
    });
  }

  // CLOSE CALL SCENE
  if (blueprint?.closeCallScheduled) {
    const closeCallContent = pick([
      `The moment came without warning. A car ran a red light. Kael saw it—not with human eyes, but with the Progenitor's sight, time slowing to a crawl as his enhanced perception kicked in. He grabbed the stranger beside him and pulled them back, moving faster than any human should.\n\nThe car passed. The stranger was safe. And three people on the sidewalk were staring at Kael with expressions that ranged from grateful to terrified.\n\n"How did you—"\n\n"Adrenaline," he said. ${stage === 'paranoid_hider' ? 'The lie came so smoothly it disgusted him.' : 'The word tasted like ash.'} "Just adrenaline."`,
      `He was walking past a construction site when a steel beam slipped from a crane. He heard it before anyone else—the groan of stressed cable, the snap of the safety latch—and was moving before the warning shouts began.\n\nHe didn't just dodge. He caught it. One hand. Three hundred pounds of structural steel, held like a broomstick for one impossible second before he let it fall.\n\nThe construction workers stared. A woman across the street had her phone out.\n\n${stage === 'naive_player' ? 'He ran. Not from the scene—from the impossibility of what he\'d just done.' : stage === 'paranoid_hider' ? '"I train for strongman competitions," he said to no one in particular, already calculating escape routes and checking for cameras.' : 'He walked away before anyone could get a clear photo. Steady pace. Natural. Nothing to see here.'}`,
      `Alex showed up unannounced. Kael was in the middle of a set of one-handed pushups—on his fingertips, with a 40-pound backpack. Things that would have been impossible three months ago.\n\n"What the HELL."\n\nKael dropped flat, scrambled up, tried to look casual. "Hey. Didn't hear you knock."\n\n"I didn't knock. The door was unlocked. And you didn't hear me because you were doing WHAT exactly?"\n\n"Exercising."\n\n"On your fingertips. With a weighted backpack. Kael, six months ago you couldn't do ten regular pushups."\n\n${stage === 'curious_tester' ? '"I\'ve been really committed to the new routine," Kael said. The lie felt heavier than the backpack.' : stage === 'paranoid_hider' ? '"It\'s the supplements," Kael said, hating every word. "And yeah, I\'ve been training while you\'re not around. Does that bother you?"\n\nThe deflection—turning it into an accusation—was a technique he\'d read about. It worked. Alex backed off. But the look in his eyes said this conversation wasn\'t over.' : '"I\'ve been working out more. The game motivates me."\n\nIt wasn\'t entirely a lie. That was the worst part.'}`,
    ], rng);
    scenes.push({
      key: 'close_call', content: closeCallContent,
      tension: 75, focus: 'stealth', required: true,
    });
  }

  // TRANSFER EVENT SCENE
  if (blueprint?.transferEvent) {
    const transferContent = pick([
      `It happened in the shower. He was rinsing off, trying to feel normal, when he noticed his reflection in the bathroom mirror through the steam. His skin was different—paler, smoother, like porcelain given life. And when he flexed his hand, he could feel something new: a pulse of energy that didn't come from his body.\n\nAnother transfer. Another piece of the game following him home.\n\n${stage === 'naive_player' ? 'He stared at his hands for a long time, waiting for it to go away. It didn\'t.' : stage === 'opportunist' ? 'He flexed his hand again, testing the range. Cataloguing. Already thinking about applications.' : 'He added it to the list. The list was on page seven now.'}`,
      `He was reading a book—an actual paper book, because screens gave him headaches now—when the words rearranged themselves. For three seconds, the English text transformed into the runic script from Eclipsis Online. He could read it. Both languages, simultaneously, overlaid like a palimpsest.\n\nThen it was just English again.\n\n${stage === 'curious_tester' ? 'He grabbed his notebook. Date, time, duration, trigger conditions. The data set was growing.' : stage === 'paranoid_hider' ? 'He glanced around the empty apartment, as if someone might have seen.' : 'He turned the page and kept reading. Abnormality had become his baseline.'}`,
      `He was jogging—keeping it slow, human-slow, because the alternative was sprinting at 40mph and explaining that to pedestrians—when he felt it. A warmth in his chest, spreading outward. A new stat had settled in.\n\nVitality. The game's version of constitution and healing rate, now humming beneath his skin like a second heartbeat.\n\nHe stopped jogging and pressed his fingers to a scrape on his arm from yesterday. As he watched, the skin knit closed. Not fast—not movie-fast—but faster than any human wound should heal.\n\n${stage === 'paranoid_hider' ? 'He immediately checked for witnesses. Clear. He pulled his sleeve down and started walking. Normal pace. Nothing to see.' : '"Huh," he said to the empty path. Then he started running again. Faster this time.'}`,
    ], rng);
    scenes.push({
      key: 'transfer', content: transferContent,
      tension: 55, focus: 'revelation', required: true,
    });
  }

  // CHARACTER GROWTH SCENE — stage-driven
  if (blueprint?.characterGrowthBeat) {
    const beat = blueprint.characterGrowthBeat;
    let growthContent = '';
    if (stage === 'naive_player') growthContent = `He told himself it would stop. The changes, the abilities, the hunger—they would fade like a dream fades in morning light. He almost believed it.\n\n${beat ? `But then: ${beat}\n\n` : ''}In Yuna's room, holding her hand, he felt most like himself. The old self. The one who wasn't becoming something else.`;
    else if (stage === 'curious_tester') growthContent = `He'd started testing. Methodically, in private, behind locked doors.\n\nLift the couch with one hand? Check. Read a license plate from three blocks away? Check. Hear the neighbor's TV through two walls? Check.\n\nEach confirmation sent a thrill through him that he wasn't ready to examine.\n\n${beat ? `${beat}\n\n` : ''}The thrill was the problem. He was starting to enjoy this.`;
    else if (stage === 'opportunist') growthContent = `He used the Nightsight to read the serial numbers on a locked filing cabinet at the hospital—Yuna's medical records, the ones they wouldn't let him see. Enhanced hearing to eavesdrop on Dr. Yamada's conversation with a colleague about "unprecedented neural restructuring."\n\n${beat ? `${beat}\n\n` : ''}He told himself it was for Yuna. The truth was more complicated. He was using his powers because he could, and the line between "for Yuna" and "because it feels good" was getting harder to see.`;
    else if (stage === 'paranoid_hider') growthContent = `Every mirror was a threat. Every camera, every phone pointed in his direction. He'd mapped every security camera on his three routes to the hospital, timed the patrol schedules of the night security guard, and memorized the shift changes at the 7-Eleven where he sometimes pretended to buy coffee.\n\n${beat ? `${beat}\n\n` : ''}When had he become this person? When had the boy who just wanted to save his sister turned into someone who thought in escape routes and cover stories?`;
    else if (stage === 'strategic_abuser') growthContent = `He sat in the dark apartment and took inventory with the cold precision of someone cataloguing weapons.\n\nNightsight: active. Enhanced reflexes: permanent. Strength: approximately three times baseline. Healing: accelerated. Perception: superhuman. Vitality stat: stabilized.\n\nThe list went on. Each item was a tool. Each tool had concealment protocols. Each protocol had backup protocols.\n\n${beat ? `${beat}\n\n` : ''}He wasn't hiding from what he'd become anymore. He was optimizing it.`;
    else growthContent = `He sat at Yuna's bedside and held her hand, and for once, he didn't try to be anything. Not the Progenitor. Not the survivor. Not the strategist. Just a brother.\n\n"I'm close," he whispered. "I don't know what I'll have to become to finish this, but I'm close."\n\n${beat ? `${beat}\n\n` : ''}Her heart monitor beeped. Steady. Unchanged. But her EEG—the one he could now read with stolen medical knowledge—showed patterns he recognized from the game.\n\nShe was in there. And she was playing.`;
    scenes.push({
      key: 'growth', content: growthContent,
      tension: 25, focus: 'character', required: false,
    });
  }

  // ── Intros — more variety ──
  const intros = [
    `The real world felt thin. That was the only way Kael could describe it—thin, like paper stretched too far, like reality was a photograph that had been exposed to too much light. Colors washed out. Sounds muted. Everything except the hunger, which was vivid and sharp and growing.`,
    `Kael's alarm went off at 7:00 AM. He knew this because he'd been awake since 3:47, lying in the dark, listening to sounds no human should be able to hear. The couple in 4B arguing in whispers. The mouse in the walls between floors two and three. His own heartbeat, steady and slow, impossibly slow—forty-eight beats per minute.`,
    `Three days since his last session in Eclipsis Online. Three days of trying to be normal, to eat normal food, to sleep normal hours. It wasn't working. The changes that had begun in the game—the sharpened senses, the impossible reflexes, the thing with his eyes—they weren't going away. If anything, they were getting worse.`,
    previousChapter
      ? `The aftereffects of his last session lingered like a hangover written in someone else's blood. His muscles ached with phantom memory—of combat he'd fought in a world that shouldn't exist, against creatures that shouldn't be real, with powers that had no business following him home.`
      : `Morning light sliced through the gap in his curtains like a blade. Kael flinched. He'd never been sensitive to light before. Now, sunlight felt like someone pressing thumbs against his eyeballs.`,
    `Rain against the windows. The city gray and indifferent. Kael stood in his kitchen, hands wrapped around a mug of coffee he wouldn't drink, watching the water streak down the glass and trying to remember what it felt like to be ordinary.`,
    `He caught himself counting heartbeats again. His: forty-four per minute and falling. The neighbor's dog: a hundred and twelve, muffled through two walls. A pigeon on the windowsill: two hundred and sixty, rapid and fragile as tissue paper.\n\nHe could hear them all. He couldn't unhear them.`,
  ];

  // ── Endings — more variety ──
  const endings = [
    `He lay in bed that night, staring at the ceiling, and felt the pull. The headset sat on his desk, its faceplate reflecting the city lights that filtered through his window. It called to him without sound, without words—a gravity that lived beneath thought.\n\nLevel ${level + 1} waited. New abilities. New power. New answers.\n\nAnd somewhere in Eclipsis Online, Kael was certain, Yuna was waiting too.`,
    `The last thing he saw before sleep took him was the headset, pulsing with that faint, rhythmic light. In his dreams, he stood in a room made of mirrors, and every reflection wore his face but with crimson eyes.\n\nOne of the reflections smiled.\n\n"Soon," it whispered. "Soon you'll stop pretending there's a difference."`,
    `His phone buzzed. A text from an unknown number:\n\n*"The Progenitor class wasn't created by the developers. It was created by the game. And the game is not what you think it is."*\n\nHe stared at the message until his screen dimmed, then went dark. In the black mirror of his phone's surface, his eyes—for just a moment—were not his own.`,
    `At 11:47 PM, every light in his apartment flickered. His laptop screen glitched, displaying a cascade of code he didn't recognize. And on his phone, a notification from an app he'd never installed:\n\n*"Eclipsis Online: Real-World Integration — Phase ${Math.min(level, 5)} of 7 complete."*\n\nHe deleted the notification. But he couldn't delete the feeling that something was watching him through the screen.`,
    `Sleep didn't come. It never came easily anymore — his body ran on something other than rest now. He lay in the dark, eyes open, seeing the apartment in perfect detail: every crack in the ceiling, every dust mote suspended in the still air, every shadow that wasn't quite empty.\n\nThe headset hummed on his desk. Patient. Waiting.\n\nHe'd go back tomorrow. He always went back. The question wasn't whether. It was how much of himself would be left when he finally couldn't.`,
    `He found a photo of himself from two years ago. Before the game. Before the changes. Before the hunger.\n\nThe face in the photo was softer. Rounder. Human in a way his current reflection wasn't. The eyes were brown — just brown — without the faint crimson undertone that now lived permanently in his irises.\n\nHe put the photo in a drawer. Looking at the past was a luxury he couldn't afford. The future was coming too fast, and it had teeth.`,
  ];

  // ── Assemble chapter with dynamic scene ordering ──
  const content = assembleChapter(
    scenes, pick(intros, rng), pick(endings, rng),
    REAL_TRANSITIONS, continuityOpener, rng,
  );

  // ── Dynamic summary ──
  const summaryParts: string[] = [];
  if (scenes.some(s => s.key === 'hospital' || s.key === 'yuna_moment')) summaryParts.push('Kael visits Yuna at the hospital');
  if (hasAlex) summaryParts.push(`${summaryParts.length ? 'and confronts' : 'Kael confronts'} Alex's growing suspicions`);
  if (blueprint?.closeCallScheduled) summaryParts.push('while surviving a close call that threatens his cover');
  if (blueprint?.transferEvent) summaryParts.push('. A new transfer from Eclipsis manifests in reality');
  if (blueprint?.concealmentPressure === 'critical' || blueprint?.concealmentPressure === 'high') summaryParts.push('. The pressure of concealment reaches a breaking point');
  if (summaryParts.length === 0) summaryParts.push('Kael navigates the real world as the changes from Eclipsis Online continue to transform him');
  const summary = summaryParts.join(' ') + '.';

  const arcPhase = blueprint?.arcPhase ?? 'rising';
  const tensionLevel = blueprint?.tensionTarget ?? Math.min(100, 25 + chapterNumber * 2);
  const realTones = ['anxiety', 'isolation', 'determination', 'paranoia', 'hope', 'grief', 'connection'];

  const glossaryUpdates: Chapter['glossaryUpdates'] = [];
  if (hasAlex && chapterNumber <= 3) {
    glossaryUpdates.push({ id: 'gl-alex', type: 'character', name: 'Alex', description: 'Kael\'s best friend who notices the physical changes happening to him' });
  }
  const codexUpdates: Chapter['codexUpdates'] = [];
  if (blueprint?.transferEvent || rng() > 0.6) {
    codexUpdates.push({ id: `cx-real-${chapterNumber}`, category: 'system', title: `Reality Bleed Incident #${Math.ceil(chapterNumber / 2)}`, content: `Kael experiences game abilities manifesting in the real world during chapter ${chapterNumber}` });
  }

  return {
    id: `ch-${chapterNumber}`, chapterNumber, title, content,
    wordCount: content.split(/\s+/).length, world: 'real', summary, characters, locations,
    createdAt: new Date().toISOString(),
    newCharacters: hasAlex && chapterNumber <= 3 ? ['Alex'] : [],
    newLocations: [],
    skillsUsed: rng() > 0.5 ? ['Nightsight'] : [],
    itemsGained: [],
    plotThreadsAdvanced: blueprint?.mustAdvancePlots ?? ['plot-save-yuna', 'plot-reality-bleed'],
    foreshadowingPlanted: blueprint?.foreshadowingToPlant ?? [],
    foreshadowingPaidOff: blueprint?.foreshadowingToPayoff ?? [],
    emotionalTone: pick(realTones, rng), arcPhase, tensionLevel,
    arcId: blueprint ? 'arc-main-progenitor' : undefined,
    glossaryUpdates, codexUpdates,
  };
}
