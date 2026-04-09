<div align="center">
# CuraConnect

**A platform connecting seniors with young helpers for everyday tasks**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)](https://sqlite.org)
[![Groq](https://img.shields.io/badge/Groq-LPU_Inference-F55036?logo=groq&logoColor=white)](https://groq.com)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

*Developed for [Jugend Gründet 2025/26](https://www.jugend-gruendet.de/) — ranked **31st out of ~1,500 teams***

🔗 **[Live Demo](https://curaconnect-dma9.onrender.com)**

</div>

---

## The Problem

Germany has over 5.7 million people in need of care, most of them living at home. They need help with everyday things — carrying groceries, setting up a router, mowing the lawn — but professional services are expensive and inflexible, and family isn't always nearby.

At the same time, millions of students want flexible income without fixed shifts or long-term contracts.

CuraConnect bridges this gap: a mobile-first marketplace where seniors post small tasks and verified student helpers apply.

---

## Features

- **Two-sided marketplace** — Seniors post tasks (Garten, Haushalt, Technik, Einkauf, Sonstiges); students browse and apply
- **AI job creation** — Seniors describe their need by voice or text; Gemini 2.0 Flash extracts details and fills the form automatically
- **Image recognition** — Upload a photo of the problem; AI suggests a title, category, and fair price
- **CuraPilot chatbot** — Floating assistant that answers questions about the platform in natural language
- **CuraCoins** — Internal reward currency; students earn coins on completion, redeemable for local vouchers
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

## Business Model

CuraConnect takes a **10% platform fee** on each completed job. Additional revenue streams include **Cura+** (€60/year subscription for priority matching and no ads) and local business advertising. Year-3 projections place the platform at self-sustaining scale.

---

## Context

CuraConnect was originally built for **Jugend Gründet 2025/26**, a national entrepreneurship competition (~1,500 teams). The prototype placed **31st out of approximately 1,500 teams**.

This repository is the refactored version: components split from a monolithic 2,000-line file, a persistent SQLite backend added, and the Gemini integration moved server-side to eliminate API key exposure in the browser.

---

## Team

**Anton Zipperle and HelpMate**
Hebel-Gymnasium Schwetzingen — Jugend Gründet 2026

---

## Vibe-Coded with: 
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
