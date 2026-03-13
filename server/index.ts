import express from 'express';
import cors from 'cors';
import { Storage } from './storage.js';
import { AIChapterGenerator } from './ai.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const storage = new Storage();
const ai = new AIChapterGenerator();

// ─── AUTH ────────────────────────────────────────────────────────────────────

const ADMIN_ACCOUNT = {
  id: 'admin-1',
  username: 'Admin',
  email: 'admin@eclipsis.com',
  password: 'Eclipsis2024!',
  role: 'admin' as const,
};

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Check admin
  if (email === ADMIN_ACCOUNT.email && password === ADMIN_ACCOUNT.password) {
    const adminData = storage.getAdminState();
    res.json({
      user: {
        id: ADMIN_ACCOUNT.id,
        username: ADMIN_ACCOUNT.username,
        email: ADMIN_ACCOUNT.email,
        role: ADMIN_ACCOUNT.role,
        lastReadChapter: adminData.lastReadChapter,
      },
    });
    return;
  }

  // Check registered users
  const users = storage.getUsers();
  const user = users.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastReadChapter: user.lastReadChapter || 0,
      },
    });
    return;
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;

  if (email === ADMIN_ACCOUNT.email) {
    res.status(400).json({ error: 'This email is reserved.' });
    return;
  }

  const users = storage.getUsers();
  if (users.find((u) => u.email === email)) {
    res.status(400).json({ error: 'Email already registered.' });
    return;
  }

  const newUser = {
    id: `user-${Date.now()}`,
    username,
    email,
    password,
    role: 'user' as const,
    lastReadChapter: 0,
    createdAt: new Date().toISOString(),
  };

  storage.addUser(newUser);
  res.json({
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      lastReadChapter: 0,
    },
  });
});

// ─── CHAPTERS ────────────────────────────────────────────────────────────────

app.get('/api/chapters', (_req, res) => {
  const chapters = storage.getChapters();
  // Return chapters without full content for listing
  const listing = chapters.map((ch) => ({
    id: ch.id,
    chapterNumber: ch.chapterNumber,
    title: ch.title,
    wordCount: ch.wordCount,
    world: ch.world,
    summary: ch.summary,
    createdAt: ch.createdAt,
  }));
  res.json({ chapters: listing, total: chapters.length });
});

app.get('/api/chapters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const chapters = storage.getChapters();
  const chapter = chapters.find((ch) => ch.chapterNumber === id);
  if (!chapter) {
    res.status(404).json({ error: 'Chapter not found' });
    return;
  }
  res.json({ chapter });
});

// ─── ADMIN: READ TRACKING + GENERATION TRIGGER ──────────────────────────────

// Admin marks a chapter as read — this triggers generation of up to 5 ahead
app.post('/api/admin/mark-read', async (req, res) => {
  const { chapterNumber, userId } = req.body;

  // Only admin can trigger generation
  if (userId !== ADMIN_ACCOUNT.id) {
    // Regular users just track their read
    storage.updateUserLastRead(userId, chapterNumber);
    res.json({ ok: true, generated: 0 });
    return;
  }

  const adminState = storage.getAdminState();
  const newLastRead = Math.max(adminState.lastReadChapter, chapterNumber);
  storage.updateAdminLastRead(newLastRead);

  const chapters = storage.getChapters();
  const totalChapters = chapters.length;
  const maxAllowed = newLastRead + 5;
  const chaptersToGenerate = maxAllowed - totalChapters;

  if (chaptersToGenerate <= 0) {
    res.json({
      ok: true,
      generated: 0,
      totalChapters,
      adminLastRead: newLastRead,
      message: `Already have ${totalChapters} chapters (cap: ${maxAllowed})`,
    });
    return;
  }

  // Generate chapters in sequence
  let generated = 0;
  const storyConfig = storage.getStoryConfig();

  for (let i = 0; i < chaptersToGenerate; i++) {
    const currentChapters = storage.getChapters();
    const nextNumber = currentChapters.length + 1;
    const previousChapter = currentChapters[currentChapters.length - 1] || null;

    // Alternate worlds
    const world: 'real' | 'vr' =
      previousChapter && previousChapter.world === 'real' ? 'vr' : 'real';

    try {
      const chapter = await ai.generateChapter({
        chapterNumber: nextNumber,
        world,
        previousChapter,
        allChapters: currentChapters,
        storyConfig,
      });

      storage.addChapter(chapter);
      generated++;
    } catch (err) {
      console.error(`Failed to generate chapter ${nextNumber}:`, err);
      break;
    }
  }

  res.json({
    ok: true,
    generated,
    totalChapters: storage.getChapters().length,
    adminLastRead: newLastRead,
  });
});

// ─── ADMIN: STATE & CONFIG ───────────────────────────────────────────────────

app.get('/api/admin/state', (_req, res) => {
  const adminState = storage.getAdminState();
  const chapters = storage.getChapters();
  const users = storage.getUsers();

  res.json({
    lastReadChapter: adminState.lastReadChapter,
    totalChapters: chapters.length,
    maxAllowedChapters: adminState.lastReadChapter + 5,
    storyConfig: storage.getStoryConfig(),
    totalUsers: users.length,
    apiKeyConfigured: !!process.env.ANTHROPIC_API_KEY,
    chapters: chapters.map((ch) => ({
      id: ch.id,
      chapterNumber: ch.chapterNumber,
      title: ch.title,
      wordCount: ch.wordCount,
      world: ch.world,
      createdAt: ch.createdAt,
    })),
  });
});

app.post('/api/admin/config', (req, res) => {
  const config = req.body;
  storage.updateStoryConfig(config);
  res.json({ ok: true, config: storage.getStoryConfig() });
});

app.post('/api/admin/set-api-key', (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) {
    res.status(400).json({ error: 'API key required' });
    return;
  }
  process.env.ANTHROPIC_API_KEY = apiKey;
  ai.updateApiKey(apiKey);
  res.json({ ok: true });
});

// ─── ADMIN: MANUAL GENERATION ────────────────────────────────────────────────

app.post('/api/admin/generate', async (req, res) => {
  const { count = 1 } = req.body;
  const adminState = storage.getAdminState();
  const chapters = storage.getChapters();
  const maxAllowed = adminState.lastReadChapter + 5;
  const canGenerate = Math.min(count, maxAllowed - chapters.length);

  if (canGenerate <= 0) {
    res.json({
      ok: false,
      error: `Cap reached. Admin has read chapter ${adminState.lastReadChapter}, max allowed: ${maxAllowed}, current: ${chapters.length}`,
      generated: 0,
    });
    return;
  }

  const storyConfig = storage.getStoryConfig();
  let generated = 0;

  for (let i = 0; i < canGenerate; i++) {
    const currentChapters = storage.getChapters();
    const nextNumber = currentChapters.length + 1;
    const previousChapter = currentChapters[currentChapters.length - 1] || null;
    const world: 'real' | 'vr' =
      previousChapter && previousChapter.world === 'real' ? 'vr' : 'real';

    try {
      const chapter = await ai.generateChapter({
        chapterNumber: nextNumber,
        world,
        previousChapter,
        allChapters: currentChapters,
        storyConfig,
      });
      storage.addChapter(chapter);
      generated++;
    } catch (err) {
      console.error(`Failed to generate chapter ${nextNumber}:`, err);
      break;
    }
  }

  res.json({
    ok: true,
    generated,
    totalChapters: storage.getChapters().length,
  });
});

// ─── ADMIN: DELETE CHAPTER ───────────────────────────────────────────────────

app.delete('/api/admin/chapters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  storage.deleteChapter(id);
  res.json({ ok: true });
});

// ─── START ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  Endless Story Engine API running on http://localhost:${PORT}`);
  console.log(`  API Key: ${process.env.ANTHROPIC_API_KEY ? 'Configured' : 'NOT SET — use /api/admin/set-api-key or ANTHROPIC_API_KEY env var'}`);
  console.log(`  Chapters in storage: ${storage.getChapters().length}\n`);
});
