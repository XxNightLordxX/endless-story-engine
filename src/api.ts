// Fully client-side API layer — all data in localStorage, chapters generated locally.
// No backend server or API keys needed. Works on GitHub Pages for free.

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
    const world: 'real' | 'vr' =
      previousChapter && previousChapter.world === 'real' ? 'vr' : 'real';

    const chapter = generateChapterContent(nextNumber, world, previousChapter, config);
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
    const world: 'real' | 'vr' =
      previousChapter && previousChapter.world === 'real' ? 'vr' : 'real';

    const chapter = generateChapterContent(nextNumber, world, previousChapter, config);
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

function generateChapterContent(
  chapterNumber: number,
  world: 'real' | 'vr',
  previousChapter: Chapter | null,
  config: StoryConfig
): Chapter {
  const level = Math.floor(chapterNumber / 2) + 1;

  if (world === 'vr') {
    return generateVRChapter(chapterNumber, level, previousChapter, config);
  }
  return generateRealChapter(chapterNumber, level, previousChapter, config);
}

function generateVRChapter(
  chapterNumber: number,
  level: number,
  previousChapter: Chapter | null,
  config: StoryConfig
): Chapter {
  const titleWord = pick(VR_TITLES);
  const title = `Chapter ${chapterNumber}: ${titleWord}`;
  const locations = pickN(VR_LOCATIONS, 2);
  const npcs = pickN(VR_NPCS, 2);
  const characters = ['Kael', ...npcs];

  // Pick system notifications based on level
  const sysNotes = pickN(SYSTEM_NOTIFICATIONS, config.tension > 5 ? 3 : 2)
    .map((fn) => fn(level));

  // Build sections
  const combatScene = pick(VR_COMBAT_SCENES)(npcs[0], locations[0]);
  const explorationScene = pick(VR_EXPLORATION_SCENES)(npcs[1] || npcs[0], locations[1] || locations[0]);
  const loreScene = config.tension > 4 ? pick(VR_LORE_SCENES)(locations[0]) : '';

  // Build pacing intro
  const intros = [
    `Kael materialized in ${locations[0]} with the taste of iron on his tongue and murder in his veins. Level ${level} had changed things. The world was sharper now, more real than real, and his hunger—the ever-present hunger—had grown teeth.`,
    `The loading screen dissolved like smoke, and ${locations[0]} assembled itself around him pixel by pixel. Except it didn't feel like pixels anymore. It felt like atoms. Like reality rebuilding itself with him at the center.`,
    `He logged in expecting the familiar disorientation, the brief vertigo of transitioning between worlds. But this time, there was no transition. One moment he was in his apartment. The next, he was standing in ${locations[0]}, and the shift had been seamless. Terrifyingly seamless.`,
    `${locations[0]} was different today. The shadows were deeper. The ambient sounds—distant combat, NPC chatter, the hum of magical infrastructure—were muted, as if the game itself was holding its breath.`,
  ];

  // Build cliffhanger ending
  const endings = [
    `As he prepared to log out, a message appeared—one he'd never seen before:\n\n**[System: Reality anchor integrity at ${Math.max(10, 80 - chapterNumber * 5)}%. Stat merge acceleration detected. Logout recommended... but not required.]**\n\nHe stared at the message. Then he dismissed it and kept playing.`,
    `The session ended with a notification that made his blood run cold:\n\n**[System: Connection to Host deepening. Bloodline synchronization: ${Math.min(100, 20 + chapterNumber * 8)}%. The Progenitor awakens.]**\n\nHe ripped off the headset. His hands were shaking. In the mirror across the room, his eyes gleamed red for just a moment before fading back to normal.\n\nOr what he still called normal.`,
    `"You're not like the others," ${npcs[0]} said, watching him with those ancient, knowing eyes. "The old Progenitors... they didn't just play the game. They became it. And the game became them."\n\n"What does that mean?"\n\n"It means you should be careful about how long you stay logged in. The line between player and program..." They smiled, and it was the saddest smile Kael had ever seen. "It's thinner than you think."`,
    `Before he could log out, the world flickered. For one impossible moment, he saw both—his apartment, overlaid on the game world, two realities occupying the same space like a double exposure.\n\nThen it was just the game again. Just the game.\n\nBut in his apartment, on his desk, a notification blinked on his phone:\n\n*"Yuna's neural patterns have changed again. Please contact Dr. Yamada at your earliest convenience."*`,
  ];

  const content = [
    pick(intros),
    '',
    sysNotes[0],
    '',
    combatScene,
    '',
    sysNotes[1] || '',
    '',
    explorationScene,
    '',
    loreScene,
    '',
    sysNotes[2] || '',
    '',
    pick(endings),
  ]
    .filter(Boolean)
    .join('\n\n');

  const summaryOptions = [
    `Kael reaches Level ${level} in Eclipsis Online, fighting through ${locations[0]} and discovering new lore about the Progenitor bloodline. His powers continue to grow, but so does the hunger.`,
    `A dangerous dungeon run through ${locations[0]} tests Kael's limits as the Vampire Progenitor class evolves. ${npcs[0]} warns him about the deepening connection between game and reality.`,
    `Kael explores ${locations[0]} and uncovers fragments of the Progenitor's forbidden history. The system warnings grow more frequent, and the boundary between worlds continues to thin.`,
  ];

  return {
    id: `ch-${chapterNumber}`,
    chapterNumber,
    title,
    content,
    wordCount: content.split(/\s+/).length,
    world: 'vr',
    summary: pick(summaryOptions),
    characters,
    locations,
    createdAt: new Date().toISOString(),
  };
}

function generateRealChapter(
  chapterNumber: number,
  level: number,
  previousChapter: Chapter | null,
  _config: StoryConfig
): Chapter {
  const titleWord = pick(REAL_TITLES);
  const title = `Chapter ${chapterNumber}: ${titleWord}`;
  const locations = pickN(REAL_LOCATIONS, 2);
  const hasAlex = Math.random() > 0.4;
  const characters = ['Kael', 'Yuna', ...(hasAlex ? ['Alex'] : [])];

  const hospitalScene = pick(REAL_HOSPITAL_SCENES)();
  const realityBleed = pick(REAL_REALITY_BLEED)();
  const alexScene = hasAlex ? pick(REAL_ALEX_SCENES)() : '';

  const intros = [
    `The real world felt thin. That was the only way Kael could describe it—thin, like paper stretched too far, like reality was a photograph that had been exposed to too much light. Colors washed out. Sounds muted. Everything except the hunger, which was vivid and sharp and growing.`,
    `Kael's alarm went off at 7:00 AM. He knew this because he'd been awake since 3:47, lying in the dark, listening to sounds no human should be able to hear. The couple in 4B arguing in whispers. The mouse in the walls between floors two and three. His own heartbeat, steady and slow, impossibly slow—forty-eight beats per minute.`,
    `Three days since his last session in Eclipsis Online. Three days of trying to be normal, to eat normal food, to sleep normal hours. It wasn't working. The changes that had begun in the game—the sharpened senses, the impossible reflexes, the thing with his eyes—they weren't going away. If anything, they were getting worse.`,
    previousChapter
      ? `The aftereffects of his last session lingered like a hangover written in someone else's blood. His muscles ached with phantom memory—of combat he'd fought in a world that shouldn't exist, against creatures that shouldn't be real, with powers that had no business following him home.`
      : `Morning light sliced through the gap in his curtains like a blade. Kael flinched. He'd never been sensitive to light before. Now, sunlight felt like someone pressing thumbs against his eyeballs.`,
  ];

  const endings = [
    `He lay in bed that night, staring at the ceiling, and felt the pull. The headset sat on his desk, its faceplate reflecting the city lights that filtered through his window. It called to him without sound, without words—a gravity that lived beneath thought.\n\nLevel ${level + 1} waited. New abilities. New power. New answers.\n\nAnd somewhere in Eclipsis Online, Kael was certain, Yuna was waiting too.`,
    `The last thing he saw before sleep took him was the headset, pulsing with that faint, rhythmic light. In his dreams, he stood in a room made of mirrors, and every reflection wore his face but with crimson eyes.\n\nOne of the reflections smiled.\n\n"Soon," it whispered. "Soon you'll stop pretending there's a difference."`,
    `His phone buzzed. A text from an unknown number:\n\n*"The Progenitor class wasn't created by the developers. It was created by the game. And the game is not what you think it is."*\n\nHe stared at the message until his screen dimmed, then went dark. In the black mirror of his phone's surface, his eyes—for just a moment—were not his own.`,
    `At 11:47 PM, every light in his apartment flickered. His laptop screen glitched, displaying a cascade of code he didn't recognize. And on his phone, a notification from an app he'd never installed:\n\n*"Eclipsis Online: Real-World Integration — Phase ${Math.min(level, 5)} of 7 complete."*\n\nHe deleted the notification. But he couldn't delete the feeling that something was watching him through the screen.`,
  ];

  const content = [
    pick(intros),
    '',
    hospitalScene,
    '',
    alexScene,
    '',
    realityBleed,
    '',
    pick(endings),
  ]
    .filter(Boolean)
    .join('\n\n');

  const summaryOptions = [
    `Kael visits Yuna at the hospital and notices changes in her brain activity. The stat-merge effects from Eclipsis Online continue to manifest in reality, growing harder to hide.`,
    `The line between the VR world and reality continues to blur as Kael deals with the physical changes the Progenitor class is causing. ${hasAlex ? 'Alex grows increasingly worried about the changes in his friend.' : 'Kael struggles with isolation.'}`,
    `Real-world consequences of Kael's time in Eclipsis Online become impossible to ignore. His senses sharpen, his body changes, and the hunger grows. ${hasAlex ? 'A tense conversation with Alex raises questions neither can answer.' : 'Yuna\'s condition shows unexpected changes.'}`,
  ];

  return {
    id: `ch-${chapterNumber}`,
    chapterNumber,
    title,
    content,
    wordCount: content.split(/\s+/).length,
    world: 'real',
    summary: pick(summaryOptions),
    characters,
    locations,
    createdAt: new Date().toISOString(),
  };
}
