<div align="center">

<!-- Animated Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=200&section=header&text=LaunchMesh&fontSize=80&fontAlignY=35&animation=fadeIn&fontColor=ffffff&desc=AI-Powered%20GTM%20%26%20Co-Marketing%20Network&descAlignY=58&descSize=20" width="100%"/>

<br/>

<!-- Badges Row 1 -->
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
<img src="https://img.shields.io/badge/Groq-FF6B35?style=for-the-badge&logo=groq&logoColor=white"/>

<br/><br/>

<!-- Badges Row 2 -->
<img src="https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white"/>
<img src="https://img.shields.io/badge/LLM-Llama--3%20(Groq)-blueviolet?style=flat-square"/>
<img src="https://img.shields.io/badge/HackOnVibe-July%202026-FF4785?style=flat-square"/>
<img src="https://img.shields.io/badge/License-MIT-green?style=flat-square"/>

<br/><br/>

> **Turn your solo launch into a collective, high-reach campaign — in minutes, not months.**
> 
> LaunchMesh merges an AI GTM copilot with a live co-marketing partner network so indie founders ship smarter, not harder.

<br/>

---

</div>

## 📺 Demo

<div align="center">

[![LaunchMesh Demo](https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

*▶ Click to watch the full walkthrough — AI matching, Growth Pacts, and GTM asset generation in action*

</div>

---

## ✦ What is LaunchMesh?

LaunchMesh is an **AI-powered Go-To-Market and co-marketing coordinator** built for indie hackers, solo developers, and early-stage startups. It solves the two hardest parts of launching:

1. **You don't have an audience yet** — so LaunchMesh matches you with non-competing apps that share your users, forming a live cross-promotion network.
2. **Creating launch assets takes forever** — so the AI GTM Copilot generates 17 categories of marketing copy, brand kits, and pitch decks in seconds.

---

## 🗺️ Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                       LaunchMesh                        │
│                                                         │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────┐  │
│  │  AI Matching │   │  Growth Pact │   │ Campaign   │  │
│  │    Engine    │──▶│    Builder   │──▶│  Bundles   │  │
│  └──────┬───────┘   └──────────────┘   └────────────┘  │
│         │                                               │
│         ▼                                               │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────┐  │
│  │  GTM Copilot │   │  ASO Auditor │   │  Slack     │  │
│  │  (17 assets) │   │  (metadata)  │   │  Sync      │  │
│  └──────────────┘   └──────────────┘   └────────────┘  │
│                                                         │
│         Powered by Groq · Llama-3 · Cloudflare Pages   │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Core Features

### 🤝 AI Matching Engine
Connects you with non-competing, complementary apps using **semantic user behavior patterns** — not just simple tag matching. Every match comes with:
- **Compatibility Score** — product synergy fit
- **Trust Score** — verified creator reputation
- **Audience Overlap Score** — shared user demographic signals

### 📜 Growth Pacts
Structured co-marketing agreements (newsletter swaps, in-app banners, push notifications) negotiated and drafted by AI. One-click signing, live Slack sync. No lawyers. No back-and-forth.

### 🎯 AI Campaign Bundles
Groups of complementary apps launch *together* under a themed campaign (e.g., *"Back To School Ultimate Pack"*), pooling audiences for a shared splash.

### ✍️ GTM Copilot — 17 Asset Categories

| Category | Assets Generated |
|---|---|
| 🎨 **Brand Kits** | Taglines, voice guides, color rationale |
| 🌐 **Website Copy** | Hero, features, pricing, CTA sections |
| 🏆 **Product Hunt** | Maker comments, taglines, first-comment scripts |
| 📰 **Press Outreach** | Journalist pitches, press releases, media kits |
| 📱 **Social Media** | Twitter threads, LinkedIn posts, short-form video scripts |
| 💼 **Sales Kits** | Cold email sequences, one-pagers, demo scripts |
| 💰 **Investor Kits** | Elevator pitches, traction narratives, deck bullet points |
| 📚 **Support Wikis** | FAQ docs, onboarding flows, help center stubs |

*...and 9 more categories, all generated with Groq Llama-3 in seconds.*

### 🔍 ASO Metadata Auditor
Automatically scans your App Store metadata for:
- ❌ Character limit violations
- ⚠️ Competitor brand name usage (instant rejection risk)
- 📊 Keyword density and discoverability gaps

---

## ⚡ Quick Start

```bash
# Clone the repo
git clone https://github.com/A-VISHAL/launchmesh.git
cd launchmesh

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GROQ_API_KEY to .env.local

# Run the dev server
npm run dev
```

Open `http://localhost:5173` and start matching.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | TailwindCSS |
| **AI / LLM** | Groq API — Llama-3 models |
| **Serverless** | Cloudflare Workers (API routes) |
| **CI/CD** | Cloudflare Pages (auto-deploy on `main`) |
| **Matching** | Semantic vector embeddings |

---

## 🌎 Who Is This For?

| Persona | Pain LaunchMesh Solves |
|---|---|
| 🧑‍💻 **Indie Hacker** | No time for manual outreach, no marketing budget |
| 🚀 **Early SaaS Founder** | Need traction before paid ads make sense |
| 📱 **Mobile App Builder** | App Store rejection anxiety, ASO gaps |
| 🌐 **Product Hunt Launcher** | Want collective reach, not a solo shout into the void |

---

## ⚔️ How We're Different

```
LaunchMesh vs. the alternatives
─────────────────────────────────────────────────────────
✅  vs. ChatGPT / Jasper     →  We have a live partner network, not just text
✅  vs. Notion templates      →  We have automated intelligence + active matching
✅  vs. Manual Twitter DMs    →  We have trust scores, AI drafting, one-click pacts
✅  vs. Marketing agencies    →  We cost $29/mo, not $5,000/mo
```

---

## 💎 Pricing

| Plan | Price | For |
|---|---|---|
| **Founder** | $29/mo | Solo builders, 1 active app |
| **Studio** | $79/mo | Small teams, up to 5 apps |
| **Scale** | Custom | High-volume launch pipelines |

*Full GTM asset generation + partner matching included on every plan.*

---

## 🏆 HackOnVibe July 2026

This project was built for **HackOnVibe July 2026** under the theme: *"Effective promotion of a newly launched mobile app."*

- 📦 **Deployment**: Pushing to `main` triggers automatic Cloudflare Pages builds
- 📊 **Results**: Posted on [DoraHacks](https://dorahacks.io/) after the judging period
- 💬 **Updates**: Watch Discord announcements for the exact results date

---

## 🤝 Contributing

PRs are welcome. To contribute:

```bash
# Fork the repo, then:
git checkout -b feat/your-feature-name
# Make your changes
git commit -m "feat: describe your change"
git push origin feat/your-feature-name
# Open a Pull Request
```

Please keep PRs focused and describe the problem they solve.

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.

---

<div align="center">

**Built with 💜 by [A-VISHAL](https://github.com/A-VISHAL)**

*LaunchMesh — because every founder deserves a launch that lands.*

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=100&section=footer" width="100%"/>

</div>
