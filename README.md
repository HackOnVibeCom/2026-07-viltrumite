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
<img src="https://img.shields.io/badge/HackOnVibe-Winner%20Contender-FF4785?style=flat-square"/>
<img src="https://img.shields.io/badge/License-MIT-green?style=flat-square"/>

<br/><br/>

> **LaunchMesh turns solo, low-budget mobile and web launches into collaborative, high-reach co-marketing campaigns — in minutes, not months.**
> 
> By fusing an AI GTM Copilot, an ASO Auditor, and a partner vector-matching engine, LaunchMesh gives indie founders the audience reach of an agency at a fraction of the cost.

<br/>

---

</div>

## 📺 Demo Walkthrough

<div align="center">

[![LaunchMesh Demo](https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

*▶ Click to watch the full product walkthrough — AI Matching, Growth Pacts, ASO Auditing, and the Budget Planner in action.*

</div>

---

## ✦ What is LaunchMesh?

LaunchMesh is an **AI-powered Go-To-Market (GTM) and co-marketing coordinator** custom-built for indie hackers, solo developers, and early-stage SaaS/Mobile app founders. It directly solves the two most daunting roadblocks to shipping:

1. **The Cold Start Audience Problem** — If you don't have a marketing budget or social distribution, LaunchMesh matches you with complementary, non-competing products that share your target audience, enabling automated cross-promotions.
2. **The Asset Creation Bottleneck** — Writing copy, pitch decks, and brand guidelines takes weeks. Our GTM Copilot generates contextual, production-ready launch materials across 17 distinct categories in seconds.
3. **Budget Inefficiency** — Founders often waste early capital on misaligned paid ad channels. Our new AI Launch Budget Planner models optimization splits across 14 channels, factoring in active co-marketing pacts to save real dollars.

---

## 🗺️ Architectural Workflow

Here is how LaunchMesh orchestrates app profiles, Vector AI matching, automated contract drafting, and spend optimization:

```mermaid
graph TD
    A[Founder Profile Input] --> B[ASO App Store Metadata Auditor]
    A --> C[AI App Score & Growth Analysis]
    
    C --> |Semantic Vector Similarity| D[AI Matching Engine]
    D --> |Complementary Synergies| E[AI Growth Pact Negotiator]
    E --> |Mutual Digital Signature| F[Active Growth Pacts]
    
    F --> |Cross-Promotion Traffic| G[Co-Marketing Campaign Bundles]
    F --> |Integrated CAC Savings| H[AI Launch Budget Planner]
    
    I[Budget, Category, Country & Goal] --> H
    H --> |Spend Optimization Algorithm| J[14-Channel Spent Breakdown & Expected ROI]
    
    C --> K[AI GTM Asset Copilot]
    K --> |17 Tailored Categories| L[Website, Product Hunt, PR & Ad Copy]
```

---

## 🚀 Core Platform Features

### 🤝 AI Matching Engine
Finds growth partners by indexing product capabilities, target demographics, and user behavior patterns using vector embeddings. Every match features:
- **Compatibility Score** — direct product-to-product synergy alignment.
- **Trust Score** — validated reputation scores based on active partnership histories.
- **Audience Overlap Score** — verified demographic intersection signals.

### 📜 Growth Pacts
Structured co-marketing agreements (newsletter swaps, shared banner ads, push notification trade-offs) drafted and customized by LLMs. One-click approval, live Slack notification synchronization, and automated timeline scheduling.

### 📊 AI Launch Budget Planner
Our latest premium analytics addition. Input your budget, country, product category, and launch goal, and get:
- **14-Channel Split Breakdown:** Product Hunt, Reddit ads, X, LinkedIn, Google Ads, Meta Ads, Influencers, Newsletters, Discord, Slack, Telegram, Content Marketing, Giveaways, and Referral systems.
- **Growth Pact Integration:** If you have active Growth Pacts, the engine automatically shifts budget away from paid ad networks to free partner co-marketing channels, calculation exact money saved and free users acquired.
- **Comprehensive Summary Cards:** Live indicators for Total Budget, Est. New Users, Est. Revenue, Est. Profit, Break-even point (in installs/conversions), and overall AI confidence metrics.

### ✍️ GTM Copilot (17 Asset Categories)
Generates high-converting marketing materials tailored contextually to your application profile:

| Category | Assets Generated |
|---|---|
| 🎨 **Brand Kits** | Dynamic taglines, brand voice guidelines, color psychology rationales |
| 🌐 **Website Copy** | Engaging hero headers, feature matrices, pricing plans, CTA blocks |
| 🏆 **Product Hunt** | Compelling Maker pitches, taglines, first-comment copy, QA scripts |
| 📰 **Press Outreach** | Custom journalist pitches, formal press releases, media kit summaries |
| 📱 **Social Media** | X/Twitter threads, LinkedIn professional updates, video hooks/scripts |
| 💼 **Sales Kits** | Multi-step cold outreach sequences, one-pagers, demo scripts |
| 💰 **Investor Kits** | 30-second elevator pitches, traction models, pitch deck slide outlines |
| 📚 **Support Wikis** | Help center FAQs, user onboarding walkthroughs, documentation stubs |

### ASO Metadata Auditor
Scans your App Store configuration rules in real-time to alert you of:
- ❌ **Limit Breaks:** Title, subtitle, or description character length violations.
- ⚠️ **Competitor Infringements:** Checks if competitor brand names are present, preventing immediate App Store rejection.
- 📊 **Keyword Density:** Highlights missing search terms to maximize organic discoverability.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19 + TypeScript + Vite |
| **State Management** | React Context (AppProfile, Analysis, Theme) |
| **Routing** | TanStack Router (Typesafe Navigation with Hash-scrolling) |
| **Querying** | TanStack React Query (Stale-while-revalidate Mock DB calls) |
| **Animations** | Framer Motion (Transitions & Micro-interactions) |
| **Styling** | TailwindCSS v4 + Glassmorphism system |
| **AI / LLMs** | Groq API — Llama-3-70b-instruct models |
| **CI / CD** | Cloudflare Pages (Automated builds, deploys & serverless API routes) |

---

## ⚡ Quick Start (Local Setup)

Get the project running on your local machine in under 3 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/A-VISHAL/launchmesh.git
cd launchmesh

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Open .env and add your GROQ_API_KEY and VITE_SLACK_ACCESS_TOKEN

# 4. Spin up the development server
npm run dev
```

Open your browser to `http://localhost:5173/` and take control of your Go-To-Market campaign.

---

## 🌎 Who LaunchMesh Empowers

- 🧑‍💻 **Indie Hackers:** Launch with zero marketing budget and zero social media following by bootstrapping traffic through partner circles.
- 🚀 **SaaS Founders:** Save thousands of dollars in early paid ads by identifying high-synergy, direct cross-promotion targets.
- 📱 **Mobile App Developers:** Eliminate App Store submission anxiety with real-time metadata scanning and ASO auditing.
- 🤝 **Community Organizers:** Bundle multiple launch packages together for shared promotional events.

---

## 💎 Pricing Tiers

| Plan | Price | Features Included |
|---|---|---|
| **Founder** | $29/mo | 1 Active App Profile, Unlimited matching, full GTM generation |
| **Studio** | $79/mo | Up to 5 Active App Profiles, Team collaboration, advanced analytics |
| **Scale** | Custom | Multi-app launch pipelines, dedicated LLM context, custom API webhooks |

---

## 🏆 HackOnVibe July 2026

Built for **HackOnVibe July 2026** under the hackathon theme:
> **"Effective promotion of a newly launched mobile app."**

LaunchMesh addresses this theme directly by combining organic ASO discovery audits, vector matching with cross-promotion circles, launch collateral drafting, and multi-channel budget optimization to ensure mobile app launches gain immediate traction.

---

<div align="center">

**Developed with 💜 by [A-VISHAL](https://github.com/A-VISHAL)**

*LaunchMesh — Ship together, grow together.*

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=100&section=footer" width="100%"/>

</div>
