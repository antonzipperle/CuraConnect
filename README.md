<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# CuraConnect

**A platform connecting seniors with young helpers for everyday tasks**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)](https://sqlite.org)
[![Gemini](https://img.shields.io/badge/Gemini_AI-2.0_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

*Developed for [Jugend Gründet 2025/26](https://www.jugend-gruendet.de/) — ranked **31st out of ~1,500 teams***

</div>

---

## The Problem

Elderly people frequently need help with everyday tasks — grocery runs, garden work, tech support — but lack a reliable way to find it. Students want to earn money and contribute to their community but have no easy channel to offer their help.

CuraConnect bridges this gap: a mobile-first marketplace where seniors post tasks and verified student helpers apply.

---

## Features

- **Two-sided marketplace** — Seniors post tasks (Garten, Haushalt, Technik, Einkauf, Sonstiges); students browse and apply
- **AI job creation** — Seniors describe their need by voice or text; Gemini 2.0 Flash extracts details and fills the form automatically
- **Image recognition** — Upload a photo of the problem; AI suggests a title, category, and fair price
- **CuraPilot chatbot** — Floating assistant that answers questions about the platform in natural language
- **CuraCoins** — Internal reward currency; students earn coins on completion, redeemable for vouchers
- **Gamification** — Streak system, badges, and hero levels to keep helpers engaged
- **Persistent data** — Full SQLite backend; jobs, users, and ratings survive page refresh
- **Secure AI proxy** — Gemini API key never reaches the browser; all AI calls route through Express
- **Onboarding flow** — Role-specific setup for both seniors and students after registration

---

## Architecture

```
curaconnect/
├── src/
│   ├── App.tsx                  # Root orchestrator: state, handlers, view routing
│   ├── api.ts                   # HTTP client: all fetch() calls in one place
│   ├── types/index.ts           # Shared TypeScript interfaces
│   └── components/
│       ├── LandingView.tsx
│       ├── AuthViews.tsx        # Login + Register
│       ├── SeniorDashboard.tsx  # Job creation, applicant management
│       ├── ProfileModal.tsx
│       ├── RatingModal.tsx
│       ├── CuraPilot.tsx        # Floating AI chat widget
│       ├── CuraConnectLogo.tsx
│       └── Onboarding.tsx
├── server/
│   └── index.ts                 # Express: REST API + SQLite + Gemini proxy
└── curaconnect.db               # SQLite database (auto-created on first run)
```

**Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4

**Backend:** Express 4 + better-sqlite3 + Gemini 2.0 Flash (server-side proxy)

In development, Vite proxies `/api/*` to Express on port 3001. In production, Express serves the compiled Vite build as static files from a single process.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Gemini API key](https://aistudio.google.com/app/apikey) (free tier is sufficient)

### Installation

```bash
git clone https://github.com/antonzipperle/CuraConnect.git
cd CuraConnect
npm install
```

### Configuration

```bash
cp .env.example .env.local
# Edit .env.local and set GEMINI_API_KEY=your_key_here
```

### Running locally

Open two terminals:

```bash
# Terminal 1 — backend (port 3001)
npm run dev:server

# Terminal 2 — frontend (port 3000, proxies /api to backend)
npm run dev
```

Visit `http://localhost:3000`

### Demo accounts

| Role    | Email           | Password |
|---------|-----------------|----------|
| Senior  | maria@test.de   | password |
| Student | lukas@test.de   | password |

---

## Deployment on Render

**Web Service (full-stack — recommended):**

| Field | Value |
|-------|-------|
| Build Command | `npm install && npm run build` |
| Start Command | `npm run start` |
| Environment Variable | `GEMINI_API_KEY=your_key` |

**Static Site (frontend only, no AI):**

| Field | Value |
|-------|-------|
| Build Command | `npm run build` |
| Publish Directory | `dist` |

---

## Job Lifecycle

```
Senior creates job
    → Students apply
    → Senior selects helper
    → Helper completes task
    → Senior confirms + rates
    → CuraCoins awarded to helper
```

## AI Pipeline

```
User input (text / voice / image)
    ↓
POST /api/ai/chat  or  /api/ai/image
    ↓
Express server  [GEMINI_API_KEY stays here]
    ↓
Gemini 2.0 Flash
    ↓
Structured JSON  →  form auto-filled
```

---

## Context

CuraConnect was originally built for **Jugend Gründet 2025/26**, a national entrepreneurship competition. The prototype placed **31st out of approximately 1,500 teams**.

This repository is the refactored version: components split from a monolithic 2,000-line file, a persistent SQLite backend added, and the Gemini integration moved server-side to eliminate API key exposure in the browser.

---

## License

MIT
