<div align="center">

<img src="https://github.com/antonzipperle/CuraConnect/blob/main/CuraConnectHZ.png" width="600">

<a></a>
    
**A platform connecting seniors with young helpers for everyday tasks**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![Groq](https://img.shields.io/badge/Groq-Whisper_·_LLaMA-F55036?logo=groq&logoColor=white)](https://groq.com)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

*Developed for [Jugend Gründet 2025/26](https://www.jugend-gruendet.de/) — ranked **31st out of ~1,500 teams***

🔗 **[Live Demo](https://curaconnect-dma9.onrender.com)**

</div>

---

## The Problem

Germany has over 5.7 million people in need of care, most of them living at home. They need help with everyday things like carrying groceries, setting up a router or mowing the lawn. But professional services are expensive and inflexible, and family isn't always nearby.

At the same time, millions of students want flexible income without fixed shifts or long-term contracts.

CuraConnect bridges this gap: a mobile-first marketplace where seniors post small tasks and verified student helpers apply.

---
## User flow

<div align="center">

| Stage | Senior | Student | Status |
|:---:|:---:|:---:|:---:|
| **Register** | Choose role, set location & needs | Choose role, set skills | — |
| **Create job** | Manual form · AI chat · image scan | — | `offen` |
| **Apply** | — | Browse feed, apply | `offen` |
| **Match** | Review applicants, confirm pick | Await selection | `vergeben` |
| **Escrow** | Payment locked automatically | Notified funds secured | `vergeben` |
| **Complete** | Confirm task done | Mark job as done | `zu_bestätigen` |
| **Payout** | — | CuraCoins credited, fee deducted | `erledigt` |
| **Review** | Rate student | Rate senior | `erledigt` |

</div>


## Architecture

```
curaconnect/
├── src/
│   ├── App.tsx                  # Root orchestrator — state, handlers, view routing
│   ├── api.ts                   # HTTP client — all fetch() calls in one place
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Global styles
│   ├── types/
│   │   └── index.ts             # Shared TypeScript interfaces (AppUser, Job, ViewType)
│   ├── assets/
│   │   └── curaconnect-logo.png
│   └── components/
│       ├── LandingView.tsx      # Home screen
│       ├── AuthViews.tsx        # Login + register
│       ├── Onboarding.tsx       # First-run setup flow
│       ├── SeniorDashboard.tsx  # Job creation + applicant management
│       ├── ProfileModal.tsx     # Edit name, bio, avatar
│       ├── RatingModal.tsx      # Post-job review flow
│       ├── CuraPilot.tsx        # Floating AI chat widget
│       └── CuraConnectLogo.tsx
├── server/
│   └── index.ts                 # Express — REST API + SQLite + Groq/Gemini proxy
├── curaconnect.db               # SQLite database (auto-created on first run)
├── vite.config.ts
├── package.json
└── .env.example                 # Required env vars (API keys)
```
---

## AI pipeline

```
User input
│
├── Text / voice (CuraPilot)
│   ├── Voice → MediaRecorder API → base64 audio
│   │   └── Groq Whisper → transcribed text
│   └── Text prompt
│       └── Groq LLaMA → JSON { updatedFields, messageToUser }
│           └── Auto-fills job form (title, category, date, location, reward)
│
└── Image (job creation)
    └── User uploads photo
        └── Gemini Vision → JSON { title, category, reward }
            └── Auto-fills job form
```

## Business model

CuraConnect takes a 10% platform fee on each completed job. Additional revenue streams include Cura+ (€60/year subscription for priority matching) and local business advertising.

---

## Context

We developed CuraConnect, a Start-Up developed for **Jugend Gründet 2025/26**, a national entrepreneurship competition (~1,500 teams). The Start/Up placed **31st out of approximately 1,500 teams**.

This repository is my first prototype of the future website for CuraConnect, which I created using Google AI Studio. It combines traditional plattform features with AI implementations that make usage for Seniors easier.

---

## Team

This repository was built by Anton Zipperle as part of the CuraConnect team's entry for Jugend Gründet 2025/26 at Hebel-Gymnasium Schwetzingen.

<div align="center">
    
| Role | Name |
|:---:|:---:|
| **Developer** | Anton Zipperle |
| **Start-up team** | Anton Zipperle · Lena Goschmann · Teresa Schulz · Atakan Tink · Nicolas Stefanski |

<div/>

---

## Live demo

🔗 [curaconnect-dma9.onrender.com](https://curaconnect-dma9.onrender.com)

> The app is hosted on Render's free tier. If the page takes 30–60 seconds to load, the instance is spinning up, please wait a moment.

---

## AI-Assisted Programming with: 
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
