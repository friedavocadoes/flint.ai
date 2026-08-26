# AGENTS.md — Flint.ai

> Career Pathway Assist — AI roadmap + ATS + LinkedIn optimizer + (planned) mock interviews / community.

This is the canonical onboarding for any AI/human contributor. Read before touching code. Keep updated when you change contracts. Links use `path:line`.

## 1. Purpose & Roadmap

MVP live: `/prepareAI` 3-step wizard → gamified roadmap (React Flow), `/resumeAI` ATS analyzer (PDF+role → score 0–100 + fixes/keywords) + history, `/linkedin` optimizer (headline/About/experience rewrite + ATS), `/profile` + Google OAuth. Phase 2/3: mock interview bot, JD analyzer, cover-letter, community, analytics. Brand `Flint.ai`, `next-themes` dark/light, shadcn `new-york`/`stone` (`components.json:3`), `Outfit` (`layout.tsx:12`).

`instruct.md:1` tracks AI-provider plan (Gemini 2.5-flash now, OpenRouter/Groq evaluated for cost/rate-limiting).

## 2. Architecture

```
flint.ai/
├── src/ # Next 16 App Router (React 19, TS, Tailwind 4)
│   ├── app/ # routes + api proxy (gemini, resume, linkedin)
│   │   ├── prepareAI/ # 3-step wizard + InteractiveRoadmap
│   │   ├── resumeAI/ # protected + history
│   │   ├── linkedin/ # optimizer + history
│   │   ├── api/gemini|resume|linkedin/route.* # GEMINI_API_KEY server-only
│   │   └── lib/geminiPrompt.ts # prepareAIPrompt, resumeAIPrompt, linkedinPrompt
│   ├── components/ # Navbar, PromptForm, ResumeForm, GoogleLoginButton, pathway/, resume/, linkedin/
│   ├── context/ # UserContext (localStorage)
│   ├── hooks/ # protectedRoute, useUserInfo, use-mobile
│   ├── lib/locationMeta.ts # PRIORITY_COUNTRIES, getPrioritizedCountries, COUNTRY_CURRENCY
│   ├── content/routes.js, roles.json, countries.json
│   └── types/ # user.ts, flow-viewer.ts, file-upload.ts
├── backend/ # Express 5 + Mongoose 8 (ESM)
│   ├── app.js # CORS + raw webhook + Mongo + mounts
│   ├── models/ # User, Pathway (rich), ResumeReview, LinkedinReview, Payment, Subscription
│   ├── controllers/ # user, pathway, resume, linkedin
│   ├── routes/ # user, pathway, resumeHistory, linkedinHistory, payment, test
│   └── webhooks/razorpayWebhook.js
└── public/thumbs/
```

Two deploys, one contract: `NEXT_PUBLIC_BACKEND` (`hooks/useUserInfo.tsx:18`) points at Express (`http://localhost:5000`). Next API routes proxy Gemini.

## 3. Frontend — Next.js

### 3.1 Stack
- Next 16.2.7 `next.config.ts:1` (`typescript.ignoreBuildErrors:true`, `eslint` key removed in 16 — run `npm run lint` separately). `jsx: react-jsx` (auto, not `preserve`).
- Tailwind 4 + `tw-animate-css` (`globals.css:1`), `Outfit`, `stone` theme. Aliases `@/*` (`tsconfig.json:25`).
- Radix, `lucide-react`, `motion`, `@shadergradient/react`, `reactflow`, `react-dropzone`, `axios`, `zod+rhf`, `sonner`, `@react-oauth/google@0.13.5`.

### 3.2 Shell
- `layout.tsx:32` → `GoogleOAuthProvider` (clientId `NEXT_PUBLIC_GOOGLE_CLIENT_ID`) → `UserProvider` → `ThemeProvider` → `SidebarProvider` → `Navbar` → `{children}` → `Footer` → `Toaster`.
- `Navbar.tsx:33` — fixed `h-14 z-[100]`, left logo + `/prepareAI|/resumeAI|/linkedin|/upgrade` breadcrumb, center `Tools` (Resume, Prepare, LinkedIn `thumbs/linkedin.svg`, Discussions) / `Support` `HoveredLink`, right `UserDropDown` or `Sign Up/Log in`, `ModeToggle`. Mobile hamburger `SidebarTrigger hamburger` → `AppSidebar` (`mobile-sidebar.tsx`).
- `page.tsx:7` hero `ShaderGradientCanvas` + CTA.

### 3.3 Auth — localStorage + Google OAuth
- **No JWT/cookies yet.** `context/userContext.tsx:39` → `localStorage.setItem("user",JSON.stringify({id,name,email,pro,avatar}))`, hydrates on mount with `loading` flag (`user, loading`).
- `hooks/protectedRoute.ts:7` `useProtectedRoute()` waits for `loading` then `router.replace("/auth")` + `toast.warning`; `useUserExists()` bounces authed users from `/auth` to `/prepareAI` (skips if `pathname==="/hello"`).
- `GoogleLoginButton.tsx:21` → `@react-oauth/google` `GoogleLogin` → `POST ${BACKEND}/api/auth/google {idToken}` → `userController.js:85` `google-auth-library` `verifyIdToken({audience:GOOGLE_CLIENT_ID})` → find/link by `email`/`googleId`, create `User+Pathway` if new, return `{id,name,email,avatar,pro}` → `updateUser` → fetch `GET /api/auth/me/:id` to decide `router.push(routes.prepare)` if profile complete else `routes.auth.hello` (role/nationality/sex/age).
- `Login.tsx:27` / `Signup.tsx:31` still `POST /api/auth/login|signup` (plaintext compare `userController.js:35` — tech debt). `Signup` hardened: duplicate check, `passwordHash` optional for google users. `User.js:7` now `{googleId sparse unique, avatar, authProvider enum local|google}`.
- `types/user.ts:102` `User` includes `avatar, googleId, authProvider`.

### 3.4 Onboarding `/hello`
- `hello/page.tsx:24` collects `nationality, role, age, sex` via `ComboBox` (`countries.json`, `roles.json`), calls `useUserInfo().setMeInfo` → `POST /api/auth/me` → `/profile`.

### 3.5 PrepareAI — 3-step wizard (core)
- **Route** `prepareAI/page.tsx:16` protected, `AppSidebar` (`chat-sidebar.tsx`) + `SidebarTrigger` inside `SidebarInset` header (hover to expand `mt-14 h-[calc(100svh-3.5rem)]`). Mobile `Sheet` History.
- **PromptForm.tsx:14** — 3 steps with `step=1..3`, `currency` from `locationMeta.ts:42` (`getCurrencyForCountry`), `prioritizedCountries` (PRIORITY_COUNTRIES pinned + rest A→Z):
  - Step1 Geo: `hasTargetCountry` yes/no, `targetCountry` via `ComboBox` (prioritized), salary `targetSalary` + `salaryCurrency` + `salaryPeriod`.
  - Step2 Current reality: `currentResidenceCountry`, `currentStatus` (studying|working|freelance|seeking|break) → conditional `fieldOfStudy, educationLevel, graduationTimeline` or `currentRole, yearsInTargetDomain`.
  - Step3 Target+calibration: `role`/`desiredField` + `roleSpecificity`, `hasTargetCompany` → `targetCompanies` or `companyTypePreference` (multi-select `COMPANY_TYPES`), `opportunityType` (if studying), `workModePreference`, `expertise, weakAreas`, `skillLevel` 0-10, `hours` 0-12, `extraRemarks`.
  - On submit `POST /api/gemini {promptData}` → `POST ${BACKEND}/api/pathway/chat {user, chat:{promptData}}` → `PUT /api/pathway/chat/:id` with Gemini JSON.
- **Prompt** `geminiPrompt.ts:16` `prepareAIPrompt()` builds hyper-personalized string (geo, residence, status, salary, company type) and asks for JSON `{chat:{title,summary,overview,textual,meta{chances,verdict,timeline,level,commitmentFit},motivation{streakTip,nextWin},flowjson{pathwayData{stages[5-7 rich],connections}, structData}}}`. Rules: visa task if `targetCountry != residence`, front-load if `graduationTimeline<6mo`, bridge if `fieldOfStudy` mismatch, tailor to `companyTypePreference`, salary sanity-check, `x=index*320`.
- **Model** `Pathway.js:3` — `promptDataSchema` now 22 fields (targetCountry…extraRemarks), `stageSchema` rich (subtitle, description, icon (lucide), type, difficulty, estimatedDuration/Hours, xp, whyItMatters, deliverable, order, tasks[], resources[]), `flowJsonSchema`, `progressSchema {completedStageIds,completedTaskIds,xpEarned}`, `metaSchema {chances,verdict,timeline}`, `chatSchema {title,summary,textual,overview,meta,motivation,flowjson,progress,promptData}`. One `Pathway` per user.
- **Viewer** `pathway/InteractiveRoadmap.tsx` — `PathwayHeader` (chances ring, timeline), `MilestoneCard` (icon, difficulty, tasks checklist, resources), progress via `PUT /api/pathway/chat/:id/progress` (`pathwayController.js:110` handles bulk or `stageId/taskId` toggle, recalc xp). `flow-viewer.tsx` `readOnly` mode for roadmap. `iDisplay.tsx` + `AlertDisplay` per chat.

### 3.6 ResumeAI `/resumeAI` — protected + history
- `resumeAI/page.tsx:32` protected (`isAuthResolving` guard), history `ResumeHistorySidebar` (`resume/ResumeHistorySidebar.tsx`) hover (`onMouseEnter→setOpen(true)`) `mt-14`, `SidebarInset` `pt-14`.
- `ResumeForm.tsx:15` polished card (PDF drop `FileUpload`, role chips, optional JD toggle, validation).
- Next `api/resume/route.ts:22` — `responseMimeType:"application/json"`, `jsonrepair` fallback, normalizes `atsScore` sum, ensures `breakdown`, returns `{atsScore,...,output:rawMarkdown}`.
- Prompt `geminiPrompt.ts:96` `resumeAIPrompt()` asks for strict JSON `{atsScore,verdict,summary,breakdown[5],keyFixes, strengths, keywordMatch{present,missing,suggestions}, highlights[{page,section,issue}], nextSteps, rawMarkdown}`.
- Backend `ResumeReview.js:3` `{user, role, jd, fileName, fileSize, atsScore, verdict, result Mixed, topFix}`, `resumeHistoryRoutes.js` `POST /`, `GET /user/:userId`, `DELETE /:id` mounted at `/api/resumeHistory` (`app.js:35`). Frontend saves after scan via `POST /api/resumeHistory` and reads history. Dashboard `resume/ResumeDashboard.tsx` + `ATSGauge` + `PDFPreview`.

### 3.7 LinkedIn `/linkedin` — NEW
- `linkedin/page.tsx:33` protected, `LinkedinHistorySidebar` (hover, `Past optimizations`), `SidebarInset`.
- `LinkedinForm.tsx` — `targetRole, targetCompanies, currentHeadline, currentAbout, currentExperience, tone, keywords` + validation.
- `api/linkedin/route.ts:22` → `linkedinPrompt` (similar JSON, headline/About rewrite, overallScore, optimized copy) with `responseMimeType json` + `jsonrepair`.
- Backend `LinkedinReview.js:3` `{user, targetRole, targetCompanies, headlineScore, overallScore, tone, inputs{headline,about,experience,keywords}, result Mixed, topTip}`, `linkedinRoutes.js` `POST /`, `GET /user/:userId`, `DELETE /:id` at `/api/linkedinHistory` (`app.js:36`). `LinkedinDashboard.tsx` shows optimized copy + copy buttons.

### 3.8 Profile & Billing
- `profile/page.tsx:16` `useUserInfo()` `GET /api/auth/me/:id` (populate `subscriptionRef,payments`), avatar from `googleId` if present, `PaymentTable`.
- `subscribe/page.tsx:44` still `HolUp` free-for-all gate; `PayPerUseCard`+`PayButton` exist. `payButton.tsx:37` `POST /api/razorpayMain/create-order`.

### 3.9 Routes `content/routes.js:1`
```
sub:/subscribe, profile:/profile, resume:/resumeAI, prepare:/prepareAI, linkedin:/linkedin,
static{contact:github, issue:issues/new/choose, documentation:/documentation},
auth{loginRoute:/auth, signupRoute:/auth?tab=signup, hello:/hello}
```

## 4. Backend — Express

### 4.1 Boot `app.js:15`
`cors()`, `express.raw` for `/api/razorpay` before `json()`, `mongoose.connect(MONGO_URI)`, mounts `/api` test, `/api/pathway`, `/api/auth`, `/api/razorpayMain`, `/api/razorpay` webhook, `/api/resumeHistory`, `/api/linkedinHistory`.

### 4.2 Models
- `User.js:3` `{name,email(unique),passwordHash?,googleId sparse unique,avatar,authProvider,age,role,sex,nationality,pathways ref Pathway,resume String,subscriptionRef,payments[]}`
- `Pathway.js:3` as above (rich).
- `ResumeReview.js:3`, `LinkedinReview.js:3` as above.
- `Payment.js:5` + `post("save")` upsert Subscription; `Subscription.js:4` + post-save.

### 4.3 Controllers
- `userController.js:85` `googleLogin` (verifyIdToken, link/create + Pathway, populate pro), `signup/login/setMeInfo/getMeInfo/getAllUsers`.
- `pathwayController.js:4` `getAllPathways` (amaran body), `getUserChats:17`, `createChat:27` (`$push`), `deleteChat:41`, `updateFlow:61`, `updateChat:81` (now handles `title,overview,summary,meta,motivation,flowjson,progress`), `updateProgress:110` (bulk vs `stageId/taskId` toggle, recalc xp, `$set chats.$.progress`).
- `resumeController.js` `create/getUser/delete`, `linkedinController.js` similar.

### 4.4 Routes
- `userRoutes.js:11` `POST /signup|/login|/google|/me`, `GET /me/:id|/users`
- `pathwayRoutes.js:13` `GET /pathways`, `GET /chats/:id`, `POST /chat`, `DELETE /chat/:id`, `PUT /flow/:id`, `PUT /chat/:id`, `PUT|PATCH /chat/:id/progress`
- `resumeHistoryRoutes.js` + `linkedinRoutes.js` as above
- `paymentRoutes.js:14` + broken `subscriptionRoutes.js:1` (CJS `require` typo, not mounted)
- `webhooks/razorpayWebhook.js:10` HMAC `sha256` → `new Payment`.

## 5. Env

Frontend: `NEXT_PUBLIC_BACKEND=http://localhost:5000`, `GEMINI_API_KEY` (server-only), `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID=720568895708-....apps.googleusercontent.com` (`.env:4`)
Backend: `MONGO_URI, PORT, RAZORPAY_KEY_ID|SECRET|WEBHOOK_SECRET, GOOGLE_CLIENT_ID (+ SECRET optional for code flow)` (`.env:6`).

## 6. Scripts

`npm run dev` (next), `npm run build` (ignores TS via `next.config.ts:9`), `npm run lint`; `cd backend && npm run dev` (nodemon), `node app.js` dry-run; full stack needs `ngrok http 5000` for webhooks.

## 7. Gotchas

- Plaintext `password === passwordHash` (`userController.js:35`) still; `googleId` path bypasses it. Need `bcrypt.hash` + `compare`.
- Auth still `localStorage` (`userContext.tsx:39` now stores `avatar`), `loading` flag prevents flicker (`protectedRoute.ts:12` waits). No JWT/cookie.
- `next.config.ts:9` swallows TS; `eslint` key removed in 16.
- `subscriptionRoutes.js` still broken.
- `getAllPathways` body on GET, `User.pathways` singular, `tsconfig jsx react-jsx`.
- `prepareAI` prompt now 22 fields — backend promptData must stay in sync with `locationMeta.ts:6` (PRIORITY_COUNTRIES, getCurrencyForCountry) and frontend `PromptForm.tsx:120`. Old chats lack new fields → prompt falls back to "Not specified".
- `Sidebar` hover (`onMouseEnter→setOpen(true)`) shares `SidebarProvider` `open` globally; `resumeAI` auto-closes on mount (`setOpen(false)`), affects `prepareAI` if navigating.

## 8. Playbook

- Never commit `.env`, `node_modules`, `.next`. Respect `.gitignore:35`.
- Edit > create. When adding route, update `routes.js:1` + `Navbar.tsx:78` `ProductItem`.
- Keep `@/*` aliases, `sonner` toasts, `locationMeta.ts` for country/currency.
- Gemini change: edit `geminiPrompt.ts:16` + `api/*/route.*`, validate JSON shape vs Mongoose before `PUT /api/pathway/chat/:id`.
- Backend model change: update schema + controller + frontend type (`types/user.ts:102`, `prepareAI/types.ts:76`, `linkedin` types).
- Where to put: page `app/<route>/page.tsx`, ui `components/ui/*`, domain `components/*`, hooks `hooks/*`, Express `routes/* + controllers/*` + mount `app.js:35`.

Verification: `npm run lint`, `npm run build`, `cd backend && node --check app.js`, test `PromptForm (3 steps) → Gemini → Pathway`, `ResumeForm + JD → /api/resume → ResumeReview`, `LinkedinForm → /api/linkedin → LinkedinReview`, `GoogleLoginButton` (needs `GOOGLE_CLIENT_ID`), `payTest` webhook.

## 9. Examples

- **JD Analyzer** → new `linkedin` is the pattern: reuse `api/resume` JSON, new prompt, new form, new history model, add route.
- **Enable checkout** → un-gate `PayButton` in `subscribe/page.tsx:84`, test `paymentRoutes.js:15`, confirm `Payment.postSave`.
- **Fix auth** → add `bcrypt`, JWT httpOnly, replace `userContext` localStorage, protect routes with middleware.
- **Fix subscriptionRoutes** → `import express from "express"; const router=express.Router();`
- **AI provider cost** → see `instruct.md:1` (OpenRouter plan, Gemini/Groq for resume PDF).

## 10. References

`README.md:1`, `backend/what.md:1`, `instruct.md:1` (OpenRouter eval), `framework.value`.
Entry points: `layout.tsx:32`, `backend/app.js:15`, `userContext.tsx:19`, `protectedRoute.ts:7`, `geminiPrompt.ts:16`, `locationMeta.ts:6`.

---
*Keep <400 lines, update contracts, link `path:line`.*
