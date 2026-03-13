// Fully client-side API layer — all data in localStorage, AI calls direct to Anthropic.
// No backend server needed. Works on GitHub Pages.

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
  apiKey: 'ese_api_key',
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

// ─── Admin (localStorage + direct Anthropic API calls) ────────────────────────

export async function getAdminState(): Promise<AdminState> {
  const admin = read<{ lastReadChapter: number }>(KEYS.admin, { lastReadChapter: 0 });
  const chapters = read<Chapter[]>(KEYS.chapters, []);
  const users = read<StoredUser[]>(KEYS.users, []);
  const config = read<StoryConfig>(KEYS.config, DEFAULT_CONFIG);
  const apiKey = localStorage.getItem(KEYS.apiKey) || '';

  return {
    lastReadChapter: admin.lastReadChapter,
    totalChapters: chapters.length,
    maxAllowedChapters: admin.lastReadChapter + 5,
    storyConfig: config,
    totalUsers: users.length,
    apiKeyConfigured: !!apiKey,
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

  // Non-admin: just track reading
  if (userId !== ADMIN_ACCOUNT.id) {
    const users = read<StoredUser[]>(KEYS.users, []);
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.lastReadChapter = Math.max(user.lastReadChapter, chapterNumber);
      write(KEYS.users, users);
    }
    return { ok: true, generated: 0, totalChapters: read<Chapter[]>(KEYS.chapters, []).length, adminLastRead: 0 };
  }

  // Admin: update last read + auto-generate
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

  // Auto-generate chapters
  let generated = 0;
  const config = read<StoryConfig>(KEYS.config, DEFAULT_CONFIG);

  for (let i = 0; i < chaptersToGenerate; i++) {
    const currentChapters = read<Chapter[]>(KEYS.chapters, []);
    const nextNumber = currentChapters.length + 1;
    const previousChapter = currentChapters[currentChapters.length - 1] || null;
    const world: 'real' | 'vr' =
      previousChapter && previousChapter.world === 'real' ? 'vr' : 'real';

    try {
      const chapter = await callAnthropicForChapter(nextNumber, world, previousChapter, currentChapters, config);
      currentChapters.push(chapter);
      write(KEYS.chapters, currentChapters);
      generated++;
    } catch (err) {
      console.error(`Failed to generate chapter ${nextNumber}:`, err);
      break;
    }
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

export async function setApiKey(apiKey: string): Promise<{ ok: boolean }> {
  if (!apiKey) throw new Error('API key required');
  localStorage.setItem(KEYS.apiKey, apiKey);
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

    try {
      const chapter = await callAnthropicForChapter(nextNumber, world, previousChapter, currentChapters, config);
      currentChapters.push(chapter);
      write(KEYS.chapters, currentChapters);
      generated++;
    } catch (err) {
      console.error(`Failed to generate chapter ${nextNumber}:`, err);
      break;
    }
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

// ─── AI Chapter Generation (direct Anthropic API call from browser) ───────────

const STORY_BIBLE = `You are the narrative engine for "Endless Story Engine" — an infinite, serialized dark fantasy / LitRPG web novel.

CORE STORY:
- Protagonist: Kael, a young man whose sister Yuna lies in a coma after a mysterious accident
- Kael receives a VR headset and logs into "Eclipsis Online," the world's most popular VRMMORPG
- The system assigns him a forbidden class: Vampire Progenitor — a remnant of an abandoned expansion that shouldn't exist
- As Kael progresses in the VR world, his in-game powers begin bleeding into reality (stat-merging)
- His agility increases, senses sharpen, eyes adjust to darkness. Skills learned in-game affect his real body
- The line between the VR world and reality thins over time

KEY CHARACTERS:
- Kael: Protagonist. Carries grief and determination. Becomes increasingly powerful but haunted
- Yuna: Kael's sister, in a coma. May have a deeper connection to Eclipsis Online than anyone knows
- Alex: Kael's best friend, supportive but growing worried about changes in Kael
- NPCs in Eclipsis Online: Various guild leaders, merchants, quest givers, rivals, and mysterious figures

DUAL-WORLD STRUCTURE:
- Chapters alternate between "real" world (Kael's apartment, hospital, city) and "vr" world (Eclipsis Online)
- Real world chapters: Focus on Kael's daily life, hospital visits, relationships, and the growing reality bleed
- VR world chapters: Focus on quests, combat, leveling up, discovering lore, meeting NPCs, dungeon crawling
- The worlds should gradually feel more connected as the story progresses

TONE: Dark, atmospheric, emotionally grounded. Moments of hope cut with tension. The VR world feels vivid and dangerous. The real world feels lonely and desperate.

LITRPG ELEMENTS (VR chapters):
- Include system notifications, stat changes, skill unlocks, and level-ups naturally woven into the narrative
- Format system messages in **bold** or with [System] tags
- Show Kael discovering new abilities and their costs (blood essence, mana, etc.)
- Include quest updates and progression

WRITING STYLE:
- Third person limited (Kael's perspective)
- Vivid sensory details
- Short, punchy dialogue mixed with internal reflection
- End each chapter with a hook or cliffhanger
- Each chapter should feel complete yet leave the reader wanting more`;

async function callAnthropicForChapter(
  chapterNumber: number,
  world: 'real' | 'vr',
  previousChapter: Chapter | null,
  allChapters: Chapter[],
  storyConfig: StoryConfig
): Promise<Chapter> {
  const apiKey = localStorage.getItem(KEYS.apiKey);
  if (!apiKey) {
    throw new Error('Anthropic API key not configured. Set it in the admin panel.');
  }

  const lengthGuide = { short: '800-1000 words', medium: '1200-1800 words', long: '2000-3000 words' };
  const toneMap = {
    dark: 'Dark, gritty, and atmospheric. Emphasize tension and emotional weight.',
    neutral: 'Balanced between light and dark. Mix hope with challenge.',
    light: 'More hopeful and adventurous, though still grounded in the story stakes.',
  };

  let contextBlock = '';
  if (allChapters.length > 0) {
    const recentSummaries = allChapters
      .slice(-5)
      .map((ch) => `Chapter ${ch.chapterNumber} (${ch.world}): ${ch.summary}`)
      .join('\n');

    contextBlock = `
PREVIOUS CHAPTER SUMMARIES:
${recentSummaries}

MOST RECENT CHAPTER (Chapter ${previousChapter?.chapterNumber}):
Title: ${previousChapter?.title}
World: ${previousChapter?.world}
Content (last 500 chars): ...${previousChapter?.content.slice(-500)}
Characters: ${previousChapter?.characters.join(', ')}
Locations: ${previousChapter?.locations.join(', ')}
`;
  }

  const prompt = `Write Chapter ${chapterNumber} of the story.

WORLD: ${world === 'vr' ? 'VR World (Eclipsis Online)' : 'Real World'}
TARGET LENGTH: ${lengthGuide[storyConfig.chapterLength]}
TONE: ${toneMap[storyConfig.tone]}
PACING: ${storyConfig.pacing}/10 (${storyConfig.pacing <= 3 ? 'slow, contemplative' : storyConfig.pacing <= 6 ? 'moderate, building' : 'fast-paced, action-driven'})
TENSION: ${storyConfig.tension}/10 (${storyConfig.tension <= 3 ? 'low, slice-of-life' : storyConfig.tension <= 6 ? 'moderate, something brewing' : 'high, critical events'})

${storyConfig.storyPrompt ? `ADMIN STORY DIRECTION: ${storyConfig.storyPrompt}` : ''}

${contextBlock}

REQUIREMENTS:
1. Write ONLY the chapter content — no meta-commentary
2. Title the chapter as "Chapter ${chapterNumber}: [Your Title]"
3. ${world === 'vr' ? 'Include LitRPG system messages naturally in the narrative (stats, skills, notifications)' : 'Focus on real-world consequences and character development'}
4. End with a hook or cliffhanger
5. Maintain continuity with previous chapters
6. Advance the plot meaningfully

Respond in this exact JSON format:
{
  "title": "Chapter ${chapterNumber}: [Title]",
  "content": "[Full chapter content with proper paragraphs separated by double newlines]",
  "summary": "[2-3 sentence summary of key events]",
  "characters": ["list", "of", "characters", "appearing"],
  "locations": ["list", "of", "locations"]
}`;

  // Direct call to Anthropic Messages API (CORS-enabled)
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [
        { role: 'user', content: STORY_BIBLE + '\n\n' + prompt },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(err.error?.message || `Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  const textBlock = data.content?.find((block: { type: string }) => block.type === 'text');
  if (!textBlock) throw new Error('No text response from AI');

  let parsed: { title: string; content: string; summary: string; characters: string[]; locations: string[] };

  try {
    let jsonStr = textBlock.text;
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];
    const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objectMatch) jsonStr = objectMatch[0];
    parsed = JSON.parse(jsonStr);
  } catch {
    parsed = {
      title: `Chapter ${chapterNumber}: Untitled`,
      content: textBlock.text,
      summary: 'Chapter generated by AI.',
      characters: previousChapter?.characters || ['Kael'],
      locations: previousChapter?.locations || [],
    };
  }

  return {
    id: `ch-${chapterNumber}`,
    chapterNumber,
    title: parsed.title,
    content: parsed.content,
    wordCount: parsed.content.split(/\s+/).length,
    world,
    summary: parsed.summary,
    characters: parsed.characters,
    locations: parsed.locations,
    createdAt: new Date().toISOString(),
  };
}
