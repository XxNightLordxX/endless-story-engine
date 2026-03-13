import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const CHAPTERS_FILE = path.join(DATA_DIR, 'chapters.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

export interface StoredChapter {
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

export interface StoredUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  lastReadChapter: number;
  createdAt: string;
}

export interface AdminState {
  lastReadChapter: number;
}

export interface StoryConfig {
  tone: 'dark' | 'neutral' | 'light';
  pacing: number; // 1-10
  tension: number; // 1-10
  chapterLength: 'short' | 'medium' | 'long'; // ~800, ~1500, ~2500 words
  storyPrompt: string; // Custom story context/instructions
}

const DEFAULT_STORY_CONFIG: StoryConfig = {
  tone: 'dark',
  pacing: 6,
  tension: 7,
  chapterLength: 'long',
  storyPrompt: '',
};

// The seed chapter content
const CHAPTER_1: StoredChapter = {
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

export class Storage {
  constructor() {
    this.ensureDataDir();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Seed chapter 1 if no chapters exist
    if (!fs.existsSync(CHAPTERS_FILE)) {
      this.writeJSON(CHAPTERS_FILE, [CHAPTER_1]);
    }

    if (!fs.existsSync(USERS_FILE)) {
      this.writeJSON(USERS_FILE, []);
    }

    if (!fs.existsSync(ADMIN_FILE)) {
      this.writeJSON(ADMIN_FILE, { lastReadChapter: 0 });
    }

    if (!fs.existsSync(CONFIG_FILE)) {
      this.writeJSON(CONFIG_FILE, DEFAULT_STORY_CONFIG);
    }
  }

  private readJSON<T>(file: string): T {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  }

  private writeJSON(file: string, data: unknown) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }

  // ─── Chapters ──────────────────────────────────────────────────────────────

  getChapters(): StoredChapter[] {
    return this.readJSON<StoredChapter[]>(CHAPTERS_FILE);
  }

  addChapter(chapter: StoredChapter) {
    const chapters = this.getChapters();
    chapters.push(chapter);
    this.writeJSON(CHAPTERS_FILE, chapters);
  }

  deleteChapter(chapterNumber: number) {
    let chapters = this.getChapters();
    chapters = chapters.filter((ch) => ch.chapterNumber !== chapterNumber);
    this.writeJSON(CHAPTERS_FILE, chapters);
  }

  // ─── Users ─────────────────────────────────────────────────────────────────

  getUsers(): StoredUser[] {
    return this.readJSON<StoredUser[]>(USERS_FILE);
  }

  addUser(user: StoredUser) {
    const users = this.getUsers();
    users.push(user);
    this.writeJSON(USERS_FILE, users);
  }

  updateUserLastRead(userId: string, chapterNumber: number) {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.lastReadChapter = Math.max(user.lastReadChapter, chapterNumber);
      this.writeJSON(USERS_FILE, users);
    }
  }

  // ─── Admin ─────────────────────────────────────────────────────────────────

  getAdminState(): AdminState {
    return this.readJSON<AdminState>(ADMIN_FILE);
  }

  updateAdminLastRead(chapterNumber: number) {
    const state = this.getAdminState();
    state.lastReadChapter = chapterNumber;
    this.writeJSON(ADMIN_FILE, state);
  }

  // ─── Config ────────────────────────────────────────────────────────────────

  getStoryConfig(): StoryConfig {
    return this.readJSON<StoryConfig>(CONFIG_FILE);
  }

  updateStoryConfig(updates: Partial<StoryConfig>) {
    const config = this.getStoryConfig();
    Object.assign(config, updates);
    this.writeJSON(CONFIG_FILE, config);
  }
}
