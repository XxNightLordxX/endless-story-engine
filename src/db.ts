// IndexedDB storage layer — unlimited chapter storage, no 5MB localStorage cap.
// Provides async key-value operations with structured chapter indexing.

const DB_NAME = 'endless_story_engine';
const DB_VERSION = 2;

interface DBSchema {
  chapters: IDBObjectStore;
  meta: IDBObjectStore;
  bookmarks: IDBObjectStore;
  readingStats: IDBObjectStore;
  glossary: IDBObjectStore;
  codex: IDBObjectStore;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('chapters')) {
        const cs = db.createObjectStore('chapters', { keyPath: 'chapterNumber' });
        cs.createIndex('world', 'world', { unique: false });
        cs.createIndex('createdAt', 'createdAt', { unique: false });
        cs.createIndex('arcId', 'arcId', { unique: false });
      }
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('bookmarks')) {
        const bs = db.createObjectStore('bookmarks', { keyPath: 'id' });
        bs.createIndex('chapterNumber', 'chapterNumber', { unique: false });
      }
      if (!db.objectStoreNames.contains('readingStats')) {
        db.createObjectStore('readingStats', { keyPath: 'chapterNumber' });
      }
      if (!db.objectStoreNames.contains('glossary')) {
        const gs = db.createObjectStore('glossary', { keyPath: 'id' });
        gs.createIndex('type', 'type', { unique: false });
        gs.createIndex('name', 'name', { unique: false });
      }
      if (!db.objectStoreNames.contains('codex')) {
        const cx = db.createObjectStore('codex', { keyPath: 'id' });
        cx.createIndex('category', 'category', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(
  store: string,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest | void,
): Promise<unknown> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    const result = fn(s);
    if (result) {
      result.onsuccess = () => resolve(result.result);
      result.onerror = () => reject(result.error);
    }
    t.oncomplete = () => {
      if (!result) resolve(undefined);
      db.close();
    };
    t.onerror = () => {
      reject(t.error);
      db.close();
    };
  });
}

async function txAll(
  store: string,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest,
): Promise<unknown[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    const req = fn(s);
    req.onsuccess = () => resolve(req.result as unknown[]);
    req.onerror = () => reject(req.error);
    t.oncomplete = () => db.close();
    t.onerror = () => {
      reject(t.error);
      db.close();
    };
  });
}

// ─── Chapter Operations ───────────────────────────────────────────────────────

export async function putChapter(chapter: Record<string, unknown>): Promise<void> {
  await tx('chapters', 'readwrite', (s) => s.put(chapter));
}

export async function getChapter(chapterNumber: number): Promise<Record<string, unknown> | undefined> {
  return (await tx('chapters', 'readonly', (s) => s.get(chapterNumber))) as Record<string, unknown> | undefined;
}

export async function getAllChapters(): Promise<Record<string, unknown>[]> {
  return (await txAll('chapters', 'readonly', (s) => s.getAll())) as Record<string, unknown>[];
}

export async function getChapterCount(): Promise<number> {
  return (await tx('chapters', 'readonly', (s) => s.count())) as number;
}

export async function deleteChapterByNumber(chapterNumber: number): Promise<void> {
  await tx('chapters', 'readwrite', (s) => s.delete(chapterNumber));
}

export async function getChapterRange(start: number, end: number): Promise<Record<string, unknown>[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction('chapters', 'readonly');
    const s = t.objectStore('chapters');
    const range = IDBKeyRange.bound(start, end);
    const req = s.getAll(range);
    req.onsuccess = () => resolve(req.result as Record<string, unknown>[]);
    req.onerror = () => reject(req.error);
    t.oncomplete = () => db.close();
    t.onerror = () => {
      reject(t.error);
      db.close();
    };
  });
}

// ─── Meta Operations ──────────────────────────────────────────────────────────

export async function setMeta(key: string, value: unknown): Promise<void> {
  await tx('meta', 'readwrite', (s) => s.put({ key, value }));
}

export async function getMeta<T>(key: string, fallback: T): Promise<T> {
  const row = (await tx('meta', 'readonly', (s) => s.get(key))) as { key: string; value: T } | undefined;
  return row ? row.value : fallback;
}

// ─── Bookmark Operations ──────────────────────────────────────────────────────

export interface Bookmark {
  id: string;
  chapterNumber: number;
  paragraphIndex: number;
  note: string;
  color: string;
  createdAt: string;
}

export async function addBookmark(bookmark: Bookmark): Promise<void> {
  await tx('bookmarks', 'readwrite', (s) => s.put(bookmark));
}

export async function removeBookmark(id: string): Promise<void> {
  await tx('bookmarks', 'readwrite', (s) => s.delete(id));
}

export async function getAllBookmarks(): Promise<Bookmark[]> {
  return (await txAll('bookmarks', 'readonly', (s) => s.getAll())) as Bookmark[];
}

export async function getBookmarksForChapter(chapterNumber: number): Promise<Bookmark[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction('bookmarks', 'readonly');
    const s = t.objectStore('bookmarks');
    const idx = s.index('chapterNumber');
    const req = idx.getAll(chapterNumber);
    req.onsuccess = () => resolve(req.result as Bookmark[]);
    req.onerror = () => reject(req.error);
    t.oncomplete = () => db.close();
    t.onerror = () => {
      reject(t.error);
      db.close();
    };
  });
}

// ─── Reading Stats Operations ─────────────────────────────────────────────────

export interface ReadingStat {
  chapterNumber: number;
  startedAt: string;
  finishedAt: string | null;
  timeSpentMs: number;
  wordsRead: number;
  scrollDepth: number;
}

export async function putReadingStat(stat: ReadingStat): Promise<void> {
  await tx('readingStats', 'readwrite', (s) => s.put(stat));
}

export async function getReadingStat(chapterNumber: number): Promise<ReadingStat | undefined> {
  return (await tx('readingStats', 'readonly', (s) => s.get(chapterNumber))) as ReadingStat | undefined;
}

export async function getAllReadingStats(): Promise<ReadingStat[]> {
  return (await txAll('readingStats', 'readonly', (s) => s.getAll())) as ReadingStat[];
}

// ─── Glossary Operations ──────────────────────────────────────────────────────

export interface GlossaryEntry {
  id: string;
  type: 'character' | 'location' | 'faction' | 'item' | 'skill' | 'concept';
  name: string;
  description: string;
  firstAppearance: number;
  lastAppearance: number;
  appearances: number[];
  relationships: { targetId: string; type: string }[];
  tags: string[];
  imageHint: string;
}

export async function putGlossaryEntry(entry: GlossaryEntry): Promise<void> {
  await tx('glossary', 'readwrite', (s) => s.put(entry));
}

export async function getGlossaryEntry(id: string): Promise<GlossaryEntry | undefined> {
  return (await tx('glossary', 'readonly', (s) => s.get(id))) as GlossaryEntry | undefined;
}

export async function getAllGlossaryEntries(): Promise<GlossaryEntry[]> {
  return (await txAll('glossary', 'readonly', (s) => s.getAll())) as GlossaryEntry[];
}

export async function getGlossaryByType(type: string): Promise<GlossaryEntry[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction('glossary', 'readonly');
    const s = t.objectStore('glossary');
    const idx = s.index('type');
    const req = idx.getAll(type);
    req.onsuccess = () => resolve(req.result as GlossaryEntry[]);
    req.onerror = () => reject(req.error);
    t.oncomplete = () => db.close();
    t.onerror = () => {
      reject(t.error);
      db.close();
    };
  });
}

// ─── Codex Operations ─────────────────────────────────────────────────────────

export interface CodexEntry {
  id: string;
  category: 'lore' | 'history' | 'system' | 'faction' | 'magic' | 'technology' | 'prophecy';
  title: string;
  content: string;
  discovered: number;
  relatedEntries: string[];
  spoilerLevel: number;
}

export async function putCodexEntry(entry: CodexEntry): Promise<void> {
  await tx('codex', 'readwrite', (s) => s.put(entry));
}

export async function getCodexEntry(id: string): Promise<CodexEntry | undefined> {
  return (await tx('codex', 'readonly', (s) => s.get(id))) as CodexEntry | undefined;
}

export async function getAllCodexEntries(): Promise<CodexEntry[]> {
  return (await txAll('codex', 'readonly', (s) => s.getAll())) as CodexEntry[];
}

export async function getCodexByCategory(category: string): Promise<CodexEntry[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction('codex', 'readonly');
    const s = t.objectStore('codex');
    const idx = s.index('category');
    const req = idx.getAll(category);
    req.onsuccess = () => resolve(req.result as CodexEntry[]);
    req.onerror = () => reject(req.error);
    t.oncomplete = () => db.close();
    t.onerror = () => {
      reject(t.error);
      db.close();
    };
  });
}

// ─── Migration from localStorage ──────────────────────────────────────────────

export async function migrateFromLocalStorage(): Promise<boolean> {
  const migrated = await getMeta<boolean>('migrated_v2', false);
  if (migrated) return false;

  try {
    const raw = localStorage.getItem('ese_chapters');
    if (raw) {
      const chapters = JSON.parse(raw) as Record<string, unknown>[];
      for (const ch of chapters) {
        await putChapter(ch);
      }
    }
    await setMeta('migrated_v2', true);
    return true;
  } catch {
    return false;
  }
}

// ─── Bulk Operations ──────────────────────────────────────────────────────────

export async function clearAllData(): Promise<void> {
  const db = await openDB();
  const stores = ['chapters', 'meta', 'bookmarks', 'readingStats', 'glossary', 'codex'];
  return new Promise((resolve, reject) => {
    const t = db.transaction(stores, 'readwrite');
    for (const name of stores) {
      t.objectStore(name).clear();
    }
    t.oncomplete = () => {
      db.close();
      resolve();
    };
    t.onerror = () => {
      db.close();
      reject(t.error);
    };
  });
}

export async function getStorageStats(): Promise<{
  totalChapters: number;
  totalBookmarks: number;
  totalGlossary: number;
  totalCodex: number;
  estimatedSizeMB: number;
}> {
  const chapters = await getChapterCount();
  const bookmarks = await getAllBookmarks();
  const glossary = await getAllGlossaryEntries();
  const codex = await getAllCodexEntries();

  // Rough size estimate
  const allChapters = await getAllChapters();
  const jsonSize = JSON.stringify(allChapters).length;

  return {
    totalChapters: chapters,
    totalBookmarks: bookmarks.length,
    totalGlossary: glossary.length,
    totalCodex: codex.length,
    estimatedSizeMB: Math.round((jsonSize / 1024 / 1024) * 100) / 100,
  };
}
