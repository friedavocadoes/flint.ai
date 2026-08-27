<div align="center">

# Flint.ai — Figure out your next move.

**Career planning, ATS resume scoring & LinkedIn optimization — without the corporate fluff.**

[![Live](https://img.shields.io/badge/Live-flintai.vercel.app-black?style=for-the-badge&logo=vercel)](https://flintai.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-8-880000?style=flat-square&logo=mongodb)](https://mongoosejs.com/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5--flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Cashfree](https://img.shields.io/badge/Cashfree-Payments-00C2A8?style=flat-square)](https://www.cashfree.com/)
[![License](https://img.shields.io/badge/License-MIT-stone?style=flat-square)](#license)

[🚀 Try it live](https://flintai.vercel.app) · [💬 Report issue](https://github.com/friedavocadoes/flint.ai/issues) · [💳 Pricing](https://flintai.vercel.app/subscribe) · [📄 Docs](#table-of-contents)

</div>

---

## Table of Contents

- [What is Flint.ai?](#what-is-flintai)
- [Features](#-features)
- [SEO & Discoverability](#-seo--discoverability)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Environment](#-environment)
- [How It Works](#-how-it-works)
- [Billing — Cashfree](#-billing--cashfree)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Acknowledgements](#-acknowledgements)
- [License](#-license)

---

## What is Flint.ai?

Flint helps you answer **“what’s next?”** with tools that are practical, not preachy.

> No templates that all look the same. No 40-page PDFs. Just a score, a direction, and the next thing to do.

| Tool                   | What you get                                                   |
| ---------------------- | -------------------------------------------------------------- |
| **Career Roadmap**     | A market-aware path from where you are to where you want to be |
| **ATS Resume Checker** | 0–100 score + what’s actually worth fixing before you apply    |
| **LinkedIn Optimizer** | Headline, About & experience edits you can copy-paste          |

One free generation per tool to start. Need another? Pay per use or unlock **Premium (₹999 / year, unlimited)**.

<div align="center">

[![Check my resume](https://img.shields.io/badge/ATS_Resume_Checker-Score_my_resume-black?style=for-the-badge)](https://flintai.vercel.app/resumeAI)
[![Build roadmap](https://img.shields.io/badge/Career_Roadmap-Build_my_roadmap-stone?style=for-the-badge)](https://flintai.vercel.app/prepareAI)
[![Fix LinkedIn](https://img.shields.io/badge/LinkedIn_Optimizer-Fix_my_profile-0A66C2?style=for-the-badge)](https://flintai.vercel.app/linkedin)

</div>

---

## ✨ Features

| Area                              | Highlights                                                                                                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Career Roadmap** (`/prepareAI`) | 3-step wizard (geo → reality → target), `locationMeta` with priority countries + currency, gamified stages with XP, progress tracking (`completedStageIds/completedTaskIds`), ReactFlow interactive map |
| **ATS Resume Lab** (`/resumeAI`)  | PDF upload + live preview, role + optional JD, ATS breakdown (5 categories), keyword present/missing, page-level highlights, 30-min fix list, saved history sidebar                                     |
| **LinkedIn Lab** (`/linkedin`)    | Headline / About / experience inputs, tone selector, recruiter-search + ATS lens, keyword weaving, 15-min ship checklist, one-click copy, saved history                                                 |
| **Auth**                          | Email/password + Google OAuth (`@react-oauth/google` + `google-auth-library` verify), `UserContext` with `loading` flag to avoid redirect flash, `protectedRoute` hook                                  |
| **Profile & History**             | `/profile` + `/profile/edit` + payment history, onboarding `/hello` (nationality/role/age/gender), history gating `free → 1` then paid credits                                                          |
| **Billing**                       | Cashfree-only (no Razorpay/Stripe), modal checkout, webhook + polling verification, idempotent fulfillment, prepaid 365-day Premium, typed cancellation                                                 |
| **UX**                            | `shadcn/ui` + Tailwind 4 `stone`, `next-themes`, `sonner` toasts, `motion`, Three/Shadient hero, responsive `Sidebar` + mobile sheet                                                                    |
| **SEO & Performance**             | Route-level metadata, OG image (`next/og` edge), `sitemap.xml` + `robots.txt`, canonical URLs, Vercel Analytics, public tools crawlable, app internals noindexed                                        |

---

## 🔍 SEO & Discoverability

Flint is built to be **crawlable where it should be, private where it matters.**

| Concern                        | Handling                                                                                                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Metadata**                   | Root `layout.tsx` sets `metadataBase: https://flintai.vercel.app`, `title.template`, `description`, `keywords`, `openGraph` + `twitter` + `icons`, `robots: index,follow`                        |
| **Public landing pages**       | `/` , `/resume-ai`, `/career-roadmap`, `/linkedin-optimizer`, `/subscribe`, `/terms`, `/user-agreement` → **indexed**, each with `title`, `description`, `keywords`, `canonical` + `openGraph`   |
| **Marketing JSON-LD**          | `/resume-ai` ships `SoftwareApplication` schema (price 0) for rich results                                                                                                                       |
| **App routes (authenticated)** | `/prepareAI`, `/resumeAI`, `/linkedin` layouts → `robots: { index:false, follow:false }` — the tools themselves stay out of search, their public explainers are indexed                          |
| **Account routes**             | `/auth`, `/hello`, `/profile` → `noindex` via layout metadata                                                                                                                                    |
| **Sitemap**                    | `src/app/sitemap.ts` → `/`, `/resume-ai` (0.98), `/career-roadmap` (0.92), `/linkedin-optimizer` (0.85), `/subscribe` (0.7), `/terms` & `/user-agreement` (0.2), all `weekly`/`monthly`/`yearly` |
| **Robots**                     | `src/app/robots.ts` → `allow: /`, `disallow: [/api/, /auth, /hello, /profile]`, `sitemap: /sitemap.xml`                                                                                          |
| **OG Image**                   | `src/app/opengraph-image.tsx` (edge runtime, `ImageResponse` 1200×630, gradient) → referenced by every `openGraph.images` entry                                                                  |
| **Analytics**                  | `@vercel/analytics` → `<Analytics />` in root layout (site-wide, privacy-friendly)                                                                                                               |
| **Canonical discipline**       | Every public page declares `alternates.canonical` to avoid duplicate URL issues                                                                                                                  |
| **Accessibility**              | Semantic headings, `aria-label` on icon links, focus rings via Tailwind `ring` token, dark/light via `next-themes`                                                                               |

> **Result:** Landing pages rank for `ATS resume checker`, `career roadmap`, `career path planner`, `LinkedIn optimizer` etc., while user data & app state never leaks to crawlers.

---

## 🧰 Tech Stack

| Layer            | Choice                                                                       | Why                                               |
| ---------------- | ---------------------------------------------------------------------------- | ------------------------------------------------- |
| **Frontend**     | Next 16 (App Router) · React 19 · TypeScript                                 | RSC + file-based routing + layouts for SEO        |
| **Styling**      | Tailwind 4 · `tw-animate-css` · shadcn/ui                                    | Stone palette, `xs` tokens, composable primitives |
| **AI**           | `@google/genai` (Gemini 2.5-flash) + Groq emergency fallback + `jsonrepair`  | Structured JSON, fast + resilient                 |
| **3D / Motion**  | `three` + `@react-three/fiber` + `@shadergradient/react` + `motion`          | Hero shader, spring animations                    |
| **State & Data** | `UserContext` (localStorage + loading) · `axios` · `react-hook-form` + `zod` | Minimal, cache-aware                              |
| **Backend**      | Express 5 · Mongoose 8 · Node 20+ · ESM only                                 | Thin, typed-ish, deployable anywhere              |
| **DB**           | MongoDB (Mongoose)                                                           | Pathway + history + billing collections           |
| **Auth**         | `@react-oauth/google` + `google-auth-library`                                | Client credential → server `verifyIdToken`        |
| **Payments**     | Cashfree PG (JS v3)                                                          | Sole provider, sandbox→production toggle          |
| **Analytics**    | `@vercel/analytics`                                                          | Zero-config page/view tracking                    |
| **DX**           | ESLint 9 + `eslint-config-next` · TypeScript 5 · `next/font` (Outfit)        | Fast lint, no build-blocking TS                   |

---

## 🏗 Architecture

```
flint.ai/
├── src/                         # Next 16 App Router
│   ├── app/
│   │   ├── page.tsx             # ShaderGradient hero (crawlable)
│   │   ├── layout.tsx           # Global metadata + Analytics + Navbar/Footer
│   │   ├── opengraph-image.tsx  # Edge OG 1200×630
│   │   ├── sitemap.ts / robots.ts
│   │   ├── resume-ai/           # Public SEO landing  ─┐
│   │   ├── career-roadmap/      # Public SEO landing   ├─ indexed
│   │   ├── linkedin-optimizer/  # Public SEO landing  ─┘
│   │   ├── prepareAI/           # App (noindex, SidebarProvider)
│   │   ├── resumeAI/            # App (noindex)
│   │   ├── linkedin/            # App (noindex)
│   │   ├── subscribe/           # Pricing (indexed)
│   │   ├── profile/ hello/ auth/# Account (noindex)
│   │   ├── lib/ { geminiPrompt.ts, ai/groqFallback.ts, locationMeta.ts }
│   │   └── api/ { gemini, resume, linkedin }
│   ├── components/              # promptForm 3-step, ResumeForm, LinkedinForm, dashboards, cashfreePayButton, Navbar/Footer
│   ├── context/ userContext.tsx # localStorage auth + loading flag
│   ├── hooks/ { protectedRoute, useUserInfo, use-mobile }
│   ├── content/ { routes.js, countries.json, roles.json }
│   └── types/
└── backend/                     # Express 5 + Mongoose 8 (ESM)
    ├── app.js                   # CORS + raw webhook + route mounts
    ├── models/ { User, Pathway, ResumeReview, LinkedinReview, BillingPayment, BillingSubscription }
    ├── routes/ { auth, pathway, resumeHistory, linkedinHistory, cashfree }
    ├── controllers/ + services/cashfree.js + utils/chatEntitlement.js + config/billing.js
    └── .env.example (not committed)
```

**Request flow (brief):** Browser → Next API (`/api/gemini|resume|linkedin`) → prompt builder + Gemini (fallback Groq if needed) → normalized JSON → backend Express (`/api/pathway|resumeHistory|linkedinHistory`) → Mongo.

---

## ⚡ Quick Start

### Prerequisites

- Node 20+ · MongoDB (Atlas or local) · Google Cloud OAuth client · Cashfree account (sandbox is fine)

### 1 — Clone & install

```bash
git clone https://github.com/friedavocadoes/flint.ai.git
cd flint.ai
npm install
cd backend && npm install && cd ..
```

### 2 — Configure env

**Frontend** — `/.env`

```env
NEXT_PUBLIC_BACKEND=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_web_client_id
NEXT_PUBLIC_CASHFREE_ENV=sandbox
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key        # emergency fallback only
# optional: GROQ_FALLBACK_MODEL=openai/gpt-oss-20b
```

**Backend** — `/backend/.env`

```env
MONGO_URI=mongodb+srv://...
PORT=5000
FRONTEND_URL=http://localhost:3000
BACKEND_PUBLIC_URL=http://localhost:5000   # used for Cashfree notify_url
GOOGLE_CLIENT_ID=your_google_web_client_id
CASHFREE_ENV=sandbox            # or production
CASHFREE_APP_ID=...
CASHFREE_SECRET_KEY=...
PRICE_PREPARE_AI_CHAT=49
PRICE_RESUME_AI_CHAT=49
PRICE_LINKEDIN_CHAT=29
PRICE_PREMIUM_YEAR=999
```

### 3 — Run

```bash
# frontend (root)
npm run dev        # http://localhost:3000

# backend (separate terminal)
cd backend
npm run dev        # http://localhost:5000  (nodemon)
```

### 4 — Verify

```bash
npm run lint
npm run build
cd backend && node --check app.js
```

> **Local webhooks:** `ngrok http 5000` → set `BACKEND_PUBLIC_URL` to the HTTPS URL and point Cashfree dashboard webhook to `/api/cashfree/webhook`.

---

## 🔐 Environment

| Variable                                   | Where             | Purpose                                               |
| ------------------------------------------ | ----------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_BACKEND`                      | frontend          | Express base URL                                      |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`             | frontend          | Google OAuth                                          |
| `GOOGLE_CLIENT_ID`                         | backend           | `verifyIdToken`                                       |
| `GEMINI_API_KEY`                           | frontend (server) | Gemini 2.5-flash                                      |
| `GROQ_API_KEY`                             | frontend (server) | Fallback provider                                     |
| `NEXT_PUBLIC_CASHFREE_ENV`                 | frontend          | `sandbox` / `production` switch for JS SDK            |
| `CASHFREE_ENV / APP_ID / SECRET_KEY`       | backend           | Cashfree order + webhook HMAC                         |
| `MONGO_URI`                                | backend           | Mongo connection                                      |
| `FRONTEND_URL / BACKEND_PUBLIC_URL / PORT` | backend           | Return/notify URLs, CORS                              |
| `PRICE_*`                                  | backend           | Server-source pricing (client price is never trusted) |

---

## 🧠 How It Works

> Intentionally high-level — the prompts and scoring logic stay private.

1. **Collect context.** PrepareAI’s 3-step form captures geo intent, current reality (studying/working/seeking), and target (role/company/salary/mode) plus calibration (skills, weak areas, hours/day). Resume/LinkedIn forms capture role + assets.
2. **Build a prompt.** A typed prompt builder (`geminiPrompt.ts`) + `locationMeta` turns raw inputs into a hyper-personalized instruction.
3. **Call AI + normalize.** Next route handlers call Gemini (`responseMimeType: application/json`), fall back to Groq on quota/timeout/5xx, and run every response through `jsonrepair` + normalizers that fill missing fields and recompute `structData` nodes/edges.
4. **Persist + gate.** Express controllers save to `Pathway` / `ResumeReview` / `LinkedinReview` only if `chatEntitlement` allows (free 1 → paid credit → premium). Progress (`PUT /:id/progress`) derives `xpEarned` from completed stages/tasks.
5. **Display + iterate.** Dashboards render score, breakdown, keyword match, highlights & next steps with copy buttons; history sidebars let you revisit or (if premium) delete.

---

## 💳 Billing — Cashfree

Cashfree is the **only** payment provider. No client-supplied price is ever trusted (`backend/config/billing.js` is the source).

```
User → CashfreePayButton → POST /api/cashfree/create-order (creates BillingPayment: created)
     → Cashfree JS checkout (_modal) → polling GET /api/cashfree/verify/:orderId
     ↔ webhook POST /api/cashfree/webhook (HMAC SHA256) → same fulfill path
     → fulfillPaidOrder: status→paid, BillingSubscription updated (credits or premium 365d)
     → frontend: toast + flint:billing-updated
```

**Invariants:** create internal payment before Cashfree call · mark `failed` if order creation fails · missing/stale orders → `failed` during `reconcile` (not retried forever) · fulfillment is idempotent · profile API returns `id` explicitly (`toObject()` omits virtual `id`) · Premium cancel requires typing `CANCEL FLINT PREMIUM`, revokes immediately, no refund (prepaid 365d, not a mandate).

| Product     | Price (INR) | What it unlocks        |
| ----------- | ----------- | ---------------------- |
| `prepareAI` | 49          | 1 extra career roadmap |
| `resumeAI`  | 49          | 1 extra ATS scan       |
| `linkedin`  | 29          | 1 extra optimization   |
| `premium`   | 999         | Unlimited for 365 days |

---

## 🔌 API Reference

### Frontend (Next API — server-only)

| Route           | Method                        | Notes                                                                         |
| --------------- | ----------------------------- | ----------------------------------------------------------------------------- |
| `/api/gemini`   | POST `{ promptData }`         | PrepareAI — Gemini primary, Groq fallback, normalized response                |
| `/api/resume`   | POST `FormData{file,role,jd}` | PDF → base64 inlineData → Gemini JSON (+ `jsonrepair` + rawMarkdown fallback) |
| `/api/linkedin` | POST `{ targetRole, ... }`    | LinkedIn — same resilience as `/api/gemini`                                   |

### Backend (Express — `NEXT_PUBLIC_BACKEND`)

| Route                             | Method                          | Notes                                                          |
| --------------------------------- | ------------------------------- | -------------------------------------------------------------- |
| `/api/auth/signup`                | POST                            | Creates `User` + `Pathway` + `BillingSubscription(free)`       |
| `/api/auth/login`                 | POST                            | Plain compare (known debt → migrate to bcrypt next)            |
| `/api/auth/google`                | POST `{ idToken }`              | `verifyIdToken` → upsert `User`                                |
| `/api/auth/me/:id`                | GET                             | Populates `subscriptionRef`, `payments`, returns explicit `id` |
| `/api/pathway/chats/:userId`      | GET                             | List user chats                                                |
| `/api/pathway/chat`               | POST                            | Create chat — checks `chatEntitlement`, consumes credit        |
| `/api/pathway/chat/:id`           | PUT                             | Update Gemini result (title/textual/overview/meta/… )          |
| `/api/pathway/flow/:id`           | PUT                             | Update `flowjson`                                              |
| `/api/pathway/chat/:id/progress`  | PUT/PATCH                       | Stage/task toggle + XP recalc                                  |
| `/api/pathway/chat/:id`           | DELETE                          | Premium-only delete                                            |
| `/api/resumeHistory`              | POST                            | Create review (gated)                                          |
| `/api/resumeHistory/user/:userId` | GET                             | List reviews                                                   |
| `/api/resumeHistory/:id`          | GET / DELETE                    | Single / premium-only delete                                   |
| `/api/linkedinHistory`            | POST/GET/DELETE                 | Same shape as resume                                           |
| `/api/cashfree/create-order`      | POST `{ userId, product }`      | Server-priced order + `payment_session_id`                     |
| `/api/cashfree/verify/:orderId`   | GET                             | Fulfill + return `{ status, product }`                         |
| `/api/cashfree/reconcile`         | POST `{ userId }`               | Retries 5 most recent `created/pending`                        |
| `/api/cashfree/cancel-premium`    | POST `{ userId, confirmation }` | Typed confirmation, immediate revoke                           |
| `/api/cashfree/webhook`           | POST                            | Raw body HMAC verify → fulfill                                 |

---

## 📁 Project Structure

<details>
<summary><strong>Click to expand</strong></summary>

```
src/
├── app/
│   ├── page.tsx, layout.tsx, globals.css, opengraph-image.tsx, sitemap.ts, robots.ts
│   ├── resume-ai/page.tsx, career-roadmap/page.tsx, linkedin-optimizer/page.tsx  # SEO landings
│   ├── prepareAI/, resumeAI/, linkedin/, subscribe/, profile/, hello/, auth/, terms/, user-agreement/
│   ├── api/{gemini, resume, linkedin}/route.*
│   └── lib/{geminiPrompt.ts, ai/groqFallback.ts, locationMeta.ts}
├── components/
│   ├── promptForm.tsx, ResumeForm.tsx, linkedin/LinkedinForm.tsx
│   ├── resume/ResumeDashboard.tsx, linkedin/LinkedinDashboard.tsx, pathway/InteractiveRoadmap.tsx
│   ├── cashfreePayButton.tsx, Navbar.tsx, Footer.tsx, chat-sidebar.tsx
│   └── ui/*  (shadcn: button, card, dialog, slider, sidebar, etc.)
├── context/userContext.tsx  # localStorage + loading flag
├── hooks/{protectedRoute.ts, useUserInfo.tsx}
└── content/{routes.js, countries.json, roles.json}

backend/
├── app.js
├── config/billing.js
├── controllers/{user, pathway, resume, linkedin}Controller.js
├── models/{User, Pathway, ResumeReview, LinkedinReview, BillingPayment, BillingSubscription}.js
├── routes/{userRoutes, pathwayRoutes, resumeHistoryRoutes, linkedinRoutes, cashfreeRoutes}.js
├── services/cashfree.js
└── utils/chatEntitlement.js
```

</details>

---

## 🚀 Deployment

| Piece         | Where                                  | Env to set                                                                                                                                                          |
| ------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**  | Vercel (`next build`)                  | `NEXT_PUBLIC_BACKEND` = prod Express URL, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_CASHFREE_ENV=production`, `GEMINI_API_KEY`, `GROQ_API_KEY`                   |
| **Backend**   | Render / Railway / Fly / VPS (Node 20) | `MONGO_URI`, `PORT`, `FRONTEND_URL` (Vercel URL), `BACKEND_PUBLIC_URL` (public HTTPS for webhooks), `GOOGLE_CLIENT_ID`, `CASHFREE_ENV=production` + keys, `PRICE_*` |
| **Webhooks**  | Cashfree Dashboard                     | `POST https://<backend>/api/cashfree/webhook` (HMAC verified)                                                                                                       |
| **Analytics** | Vercel                                 | Auto — no extra env; dashboard → Analytics                                                                                                                          |
| **SEO**       | Automatic                              | `metadataBase` + `sitemap.xml` + `robots.txt` + `opengraph-image` served by Next                                                                                    |

`next.config.ts` has `typescript.ignoreBuildErrors: true` (TS checked via `npm run lint` separately).

---

## 🗺 Roadmap

- [ ] Migrate password storage to `bcrypt` + JWT/httpOnly session (retire `localStorage` auth)
- [ ] OpenRouter router for AI (cost caps, per-IP rate limit, model pool, PDF-text extraction to cut tokens)
- [ ] Streaming AI responses + prompt caching
- [ ] JD analyzer & cover-letter generator (Phase 2)
- [ ] Mock interview bot + community hub (Phase 3)

---

## 🤝 Contributing

PRs welcome! Quick checklist:

```bash
npm run lint
npm run build
cd backend && node --check app.js
```

- Keep `src/content/routes.js` + `Navbar` in sync.
- Keep `locationMeta.ts` as the single source for geo/currency enums.
- Never trust client price — always use `backend/config/billing.js`.
- Don’t expand the plain-compare password pattern — migrate to hashing.
- Respect `AGENTS.md` billing invariants.

---

## 🙏 Acknowledgements

Flint stands on the shoulders of open source. Huge thanks to every maintainer:

| Dependency                                                                                                                                                                            | What it powers                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [Next.js](https://nextjs.org/) · [React](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/)                                                                          | App framework & language                                   |
| [@google/genai](https://www.npmjs.com/package/@google/genai)                                                                                                                          | Gemini AI calls                                            |
| [Tailwind CSS](https://tailwindcss.com/) · [tw-animate-css](https://www.npmjs.com/package/tw-animate-css) · [shadcn/ui](https://ui.shadcn.com/)                                       | Styling & primitives                                       |
| [@radix-ui/*](https://www.radix-ui.com/)                                                                                                                                              | Accessible primitives (dialog, select, slider, tabs, etc.) |
| [lucide-react](https://lucide.dev/) · [@tabler/icons-react](https://tabler.io/icons)                                                                                                  | Icons                                                      |
| [motion](https://motion.dev/)                                                                                                                                                         | Animations                                                 |
| [reactflow](https://reactflow.dev/)                                                                                                                                                   | Career roadmap graph                                       |
| [three](https://threejs.org/) · [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) · [@shadergradient/react](https://www.shadergradient.co/)                                | Hero 3D shader                                             |
| [@uiw/react-markdown-preview](https://github.com/uiwjs/react-markdown-preview)                                                                                                        | Markdown rendering                                         |
| [axios](https://axios-http.com/)                                                                                                                                                      | HTTP                                                       |
| [react-hook-form](https://react-hook-form.com/) · [zod](https://zod.dev/) · [@hookform/resolvers](https://github.com/react-hook-form/resolvers)                                       | Forms & validation                                         |
| [sonner](https://sonner.emilkowal.ski/)                                                                                                                                               | Toasts                                                     |
| [next-themes](https://github.com/pacocoursey/next-themes)                                                                                                                             | Dark/light theme                                           |
| [react-dropzone](https://react-dropzone.js.org/)                                                                                                                                      | PDF drag & drop                                            |
| [jsonrepair](https://github.com/josdejong/jsonrepair)                                                                                                                                 | Repairing imperfect AI JSON                                |
| [cmdk](https://cmdk.pnpm.io/) · [class-variance-authority](https://cva.style/) · [clsx](https://github.com/lukeed/clsx) · [tailwind-merge](https://github.com/dcastil/tailwind-merge) | UI utilities                                               |
| [@vercel/analytics](https://vercel.com/analytics)                                                                                                                                     | Privacy-friendly analytics                                 |
| [Express](https://expressjs.com/) · [Mongoose](https://mongoosejs.com/) · [cors](https://github.com/expressjs/cors) · [dotenv](https://github.com/motdotla/dotenv)                    | Backend                                                    |
| [google-auth-library](https://github.com/googleapis/google-auth-library-nodejs)                                                                                                       | Google ID token verification                               |
| [@react-oauth/google](https://github.com/MomenSherif/react-oauth)                                                                                                                     | Google login UI                                            |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) · [mongoose](https://mongoosejs.com/)                                                                                            | (Future) secure auth & data                                |

> If we missed you, thank you — open source makes Flint possible.

---

## 📄 License

MIT © [Gautham](https://github.com/friedavocadoes) — see `LICENSE` if present. Use freely, credit kindly.

<div align="center">

**Built with care in the open. If Flint helped you, a ⭐ on [GitHub](https://github.com/friedavocadoes/flint.ai) goes a long way.**

[⬆ Back to top](#flintai--figure-out-your-next-move)

</div>
