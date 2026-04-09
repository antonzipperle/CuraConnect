/**
 * api.ts — all HTTP calls to the backend
 * Gemini is never called from the browser; requests go through /api/ai/*
 */

const BASE = '';

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (email: string, password: string) =>
  req<any>('POST', '/api/auth/login', { email, password });

export const register = (name: string, email: string, password: string, role: string, avatarUrl?: string) =>
  req<any>('POST', '/api/auth/register', { name, email, password, role, avatarUrl });

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers = () => req<any[]>('GET', '/api/users');
export const updateUser = (id: string, data: Record<string, unknown>) =>
  req<any>('PATCH', `/api/users/${id}`, data);

// ── Jobs ──────────────────────────────────────────────────────────────────────
export const getJobs = () => req<any[]>('GET', '/api/jobs');
export const createJob = (data: Record<string, unknown>) =>
  req<any>('POST', '/api/jobs', data);
export const updateJob = (id: string, data: Record<string, unknown>) =>
  req<any>('PATCH', `/api/jobs/${id}`, data);

// ── AI (proxy – API key never leaves the server) ──────────────────────────────
export const aiChat = (prompt: string, audioData?: string, mimeType?: string) =>
  req<{ text: string }>('POST', '/api/ai/chat', {
    prompt,
    audioData,
    mimeType,
    responseFormat: 'json',
  });

export const aiChatFree = (prompt: string) =>
  req<{ text: string }>('POST', '/api/ai/chat', { prompt });

export const aiImage = (imageData: string, mimeType: string, prompt: string) =>
  req<{ text: string }>('POST', '/api/ai/image', { imageData, mimeType, prompt });
