import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '10mb' }));

// ── Simple JSON file-based storage (no native deps, works everywhere) ─────────
const DATA_PATH = process.env.DATA_PATH || path.join(__dirname, '..', 'data.json');

interface DB {
  users: any[];
  jobs: any[];
}

function readDB(): DB {
  try {
    if (fs.existsSync(DATA_PATH)) {
      return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    }
  } catch {}
  return { users: [], jobs: [] };
}

function writeDB(data: DB) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Warning: could not write data file, running in-memory only:', e);
  }
}

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED_USERS = [
  { id: 'senior1', name: 'Maria', email: 'maria@test.de', password: 'password', role: 'senior', bio: 'Ich liebe Gartenarbeit und backe gerne Kuchen.', rating: 4.8, reviewCount: 12, joinedDate: 'Seit Jan 2024', curaCoins: 0, avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg', skills: [], verified: false, availability: [], needs: [], preference: 'change_ok', curaPlus: false },
  { id: 'student1', name: 'Lukas', email: 'lukas@test.de', password: 'password', role: 'student', bio: 'Student der Informatik. Helfe gerne bei Technik-Problemen.', rating: 4.9, reviewCount: 24, joinedDate: 'Seit Okt 2023', curaCoins: 150, avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg', skills: ['Technik', 'Haushalt'], verified: true, availability: ['Nachmittags', 'Wochenende'], needs: [], preference: 'change_ok', curaPlus: false },
  { id: 'senior2', name: 'Heinz', email: 'heinz@test.de', password: 'password', role: 'senior', bio: 'Technik ist nicht so meins, aber ich erzähle gerne Geschichten.', rating: 5.0, reviewCount: 3, joinedDate: 'Seit Feb 2024', curaCoins: 0, avatarUrl: 'https://randomuser.me/api/portraits/men/78.jpg', skills: [], verified: false, availability: [], needs: [], preference: 'change_ok', curaPlus: false },
  { id: 'senior3', name: 'Gertrud', email: 'gertrud@test.de', password: 'password', role: 'senior', bio: 'Suche ab und zu Hilfe beim Einkaufen.', rating: 4.5, reviewCount: 8, joinedDate: 'Seit März 2024', curaCoins: 0, avatarUrl: 'https://randomuser.me/api/portraits/women/79.jpg', skills: [], verified: false, availability: [], needs: [], preference: 'change_ok', curaPlus: false },
  { id: 'senior4', name: 'Werner', email: 'werner@test.de', password: 'password', role: 'senior', bio: 'Brauche Hilfe bei schweren Dingen.', rating: 4.9, reviewCount: 5, joinedDate: 'Seit April 2024', curaCoins: 0, avatarUrl: 'https://randomuser.me/api/portraits/men/66.jpg', skills: [], verified: false, availability: [], needs: [], preference: 'change_ok', curaPlus: false },
];

const SEED_JOBS = [
  { id: '1', title: 'Rasen mähen im Vorgarten', category: 'Garten', date: 'Morgen, 14:00', location: 'München, Schwabing', reward: 15, status: 'offen', creatorId: 'senior2', assigneeId: null, applicants: [], paymentMethod: 'Kreditkarte', seniorRated: false, studentRated: false },
  { id: '2', title: 'WLAN am Fernseher einrichten', category: 'Technik', date: 'Heute, 16:00', location: 'München, Maxvorstadt', reward: 20, status: 'vergeben', creatorId: 'senior3', assigneeId: 'student1', applicants: ['student1'], paymentMethod: 'SEPA Lastschrift', seniorRated: false, studentRated: false },
  { id: '3', title: 'Schweren Einkauf tragen', category: 'Einkauf', date: 'Freitag, 10:00', location: 'München, Bogenhausen', reward: 10, status: 'offen', creatorId: 'senior4', assigneeId: null, applicants: [], paymentMethod: 'Rechnung', seniorRated: false, studentRated: false },
  { id: '4', title: 'Fenster putzen', category: 'Haushalt', date: 'Samstag, 09:00', location: 'München, Haidhausen', reward: 25, status: 'offen', creatorId: 'senior1', assigneeId: null, applicants: [], paymentMethod: 'Bar', seniorRated: false, studentRated: false },
  { id: '5', title: 'Smartphone erklären', category: 'Technik', date: 'Montag, 15:00', location: 'München, Sendling', reward: 15, status: 'offen', creatorId: 'senior2', assigneeId: null, applicants: [], paymentMethod: 'Kreditkarte', seniorRated: false, studentRated: false },
  { id: '6', title: 'Begleitung zum Arzt', category: 'Sonstiges', date: 'Mittwoch, 08:30', location: 'München, Giesing', reward: 20, status: 'offen', creatorId: 'senior3', assigneeId: null, applicants: [], paymentMethod: 'SEPA Lastschrift', seniorRated: false, studentRated: false },
  { id: '7', title: 'Hecke schneiden', category: 'Garten', date: 'Donnerstag, 11:00', location: 'München, Pasing', reward: 30, status: 'offen', creatorId: 'senior4', assigneeId: null, applicants: [], paymentMethod: 'Rechnung', seniorRated: false, studentRated: false },
];

// Init DB with seed data if empty
const db = readDB();
if (db.users.length === 0) {
  db.users = SEED_USERS;
  db.jobs = SEED_JOBS;
  writeDB(db);
  console.log('✅ Database seeded with demo data');
}

// ── Auth routes ───────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'E-Mail oder Passwort falsch.' });
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, avatarUrl } = req.body;
  const db = readDB();
  if (db.users.find((u) => u.email === email)) {
    return res.status(409).json({ error: 'Diese E-Mail wird bereits verwendet.' });
  }
  const newUser = {
    id: Date.now().toString(),
    name, email, password, role,
    avatarUrl: avatarUrl || null,
    joinedDate: 'Heute',
    curaCoins: 0,
    rating: 0,
    reviewCount: 0,
    verified: false,
    curaPlus: false,
    bio: '',
    skills: [],
    availability: [],
    needs: [],
    preference: 'change_ok',
  };
  db.users.push(newUser);
  writeDB(db);
  const { password: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

// ── User routes ───────────────────────────────────────────────────────────────
app.get('/api/users', (_req, res) => {
  const db = readDB();
  res.json(db.users.map(({ password: _, ...u }) => u));
});

app.patch('/api/users/:id', (req, res) => {
  const db = readDB();
  const idx = db.users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  db.users[idx] = { ...db.users[idx], ...req.body };
  writeDB(db);
  const { password: _, ...safeUser } = db.users[idx];
  res.json(safeUser);
});

// ── Job routes ────────────────────────────────────────────────────────────────
app.get('/api/jobs', (_req, res) => {
  const db = readDB();
  res.json([...db.jobs].reverse());
});

app.post('/api/jobs', (req, res) => {
  const db = readDB();
  const newJob = {
    id: Date.now().toString(),
    ...req.body,
    status: 'offen',
    applicants: [],
    seniorRated: false,
    studentRated: false,
  };
  db.jobs.push(newJob);
  writeDB(db);
  res.status(201).json(newJob);
});

app.patch('/api/jobs/:id', (req, res) => {
  const db = readDB();
  const idx = db.jobs.findIndex((j) => j.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Job not found' });
  db.jobs[idx] = { ...db.jobs[idx], ...req.body };
  writeDB(db);
  res.json(db.jobs[idx]);
});

// ── Gemini proxy ──────────────────────────────────────────────────────────────
app.post('/api/ai/chat', async (req, res) => {
  const { prompt, responseFormat } = req.body;
  const apiKey = process.env.CuraPilotAPIKey || process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const messages: any[] = [{ role: 'user', content: prompt }];
    if (responseFormat === 'json') {
      messages.unshift({ role: 'system', content: 'Antworte ausschließlich mit validem JSON, ohne Markdown-Codeblöcke oder sonstigen Text.' });
    }

    const body = {
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages,
      ...(responseFormat === 'json' ? { response_format: { type: 'json_object' } } : {}),
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json() as any;
    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.status(500).json({ error: data.error?.message || 'Groq API error' });
    }
    res.json({ text: data.choices?.[0]?.message?.content || '' });
  } catch (err) {
    console.error('Groq proxy error:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

app.post('/api/ai/image', async (req, res) => {
  const { imageData, mimeType, prompt } = req.body;
  const apiKey = process.env.CuraPilotAPIKey || process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    // Use llama-3.2-11b-vision-preview which supports images on Groq
    const body = {
      model: 'llama-3.2-11b-vision-preview',
      max_tokens: 512,
      response_format: { type: 'json_object' },
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageData}` } },
          { type: 'text', text: prompt + ' Antworte nur mit JSON.' },
        ],
      }],
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json() as any;
    if (!response.ok) return res.status(500).json({ error: data.error?.message || 'Groq API error' });
    res.json({ text: data.choices?.[0]?.message?.content || '{}' });
  } catch (err) {
    console.error('Groq image proxy error:', err);
    res.status(500).json({ error: 'AI image request failed' });
  }
});
// ── Static frontend ───────────────────────────────────────────────────────────
const DIST = path.join(__dirname, '..', 'dist');
app.use(express.static(DIST));
app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 CuraConnect running on port ${PORT}`));
