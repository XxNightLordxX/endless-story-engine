// API client for the Endless Story Engine backend

const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  lastReadChapter: number;
}

export async function login(email: string, password: string): Promise<{ user: AuthUser }> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<{ user: AuthUser }> {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}

// ─── Chapters ────────────────────────────────────────────────────────────────

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

export async function getChapters(): Promise<{ chapters: ChapterSummary[]; total: number }> {
  return request('/chapters');
}

export async function getChapter(chapterNumber: number): Promise<{ chapter: Chapter }> {
  return request(`/chapters/${chapterNumber}`);
}

// ─── Admin ───────────────────────────────────────────────────────────────────

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

export async function getAdminState(): Promise<AdminState> {
  return request('/admin/state');
}

export async function markChapterRead(
  chapterNumber: number,
  userId: string
): Promise<{ ok: boolean; generated: number; totalChapters: number; adminLastRead: number; message?: string }> {
  return request('/admin/mark-read', {
    method: 'POST',
    body: JSON.stringify({ chapterNumber, userId }),
  });
}

export async function updateStoryConfig(config: Partial<StoryConfig>): Promise<{ ok: boolean; config: StoryConfig }> {
  return request('/admin/config', {
    method: 'POST',
    body: JSON.stringify(config),
  });
}

export async function setApiKey(apiKey: string): Promise<{ ok: boolean }> {
  return request('/admin/set-api-key', {
    method: 'POST',
    body: JSON.stringify({ apiKey }),
  });
}

export async function generateChapters(count: number = 1): Promise<{ ok: boolean; generated: number; totalChapters: number; error?: string }> {
  return request('/admin/generate', {
    method: 'POST',
    body: JSON.stringify({ count }),
  });
}

export async function deleteChapter(chapterNumber: number): Promise<{ ok: boolean }> {
  return request(`/admin/chapters/${chapterNumber}`, {
    method: 'DELETE',
  });
}
