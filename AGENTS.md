# AGENTS.md — Flint.ai

> Career Pathway Assist — AI-powered career roadmap + resume ATS analyzer + (planned) mock interviews / community.

This file is the canonical onboarding for any AI agent or human contributor working in this repo. Read it before touching code. Keep it updated when you change architecture.

## 1. Project Purpose & Roadmap

Flint.ai is a SaaS that helps users craft a realistic career journey. Current MVP (`README.md:1`): resume upload + ATS scoring, user profile setup, AI career pathway (text + React Flow chart), basic dashboard. Phase 2/3 plan: mock interview bot, JD analyzer, cover-letter generator, community hub, progress analytics.

Brand: `Flint.ai`, theme: dark/light via `next-themes`, shadcn `new-york` / `stone` (`components.json:3`).

## 2. High-Level Architecture

```
flint.ai/
├── src/            # Next.js 16 App Router frontend (React 19, TS, Tailwind 4)
│   ├── app/        # Routes + API routes (Gemini proxy)
│   ├── components/ # shadcn/ui + custom (Navbar, PromptForm, ResumeForm, payButton…)
│   ├── context/    # UserContext (localStorage auth)
│   ├── hooks/      # protectedRoute, useUserInfo, use-mobile
│   ├── content/    # routes.js, roles.json, countries.json
│   └── lib/utils.ts
├── backend/        # Express 5 + Mongoose 8 (ESM) — separate deploy
│   ├── app.js      # CORS + Mongo + route mounting + Razorpay webhook (raw body)
│   ├── models/     # User, Pathway, Payment, Subscription
│   ├── controllers/# userController, pathwayController
│   ├── routes/     # userRoutes, pathwayRoutes, paymentRoutes, testRoutes, subscriptionRoutes
│   ├── webhooks/   # razorpayWebhook (HMAC verify)
│   └── util/writeToFile.js
└── public/thumbs/  # Images for navbar-menu ProductItem
```

**Two deployments, one origin contract:** Frontend expects `process.env.NEXT_PUBLIC_BACKEND` (`src/hooks/useUserInfo.tsx:18`, `src/components/promptForm.tsx:59`, etc.) to point at the Express app (`http://localhost:5000` in `.env:1`). Next API routes (`src/app/api/gemini/route.js:8`, `src/app/api/resume/route.ts:7`) proxy Gemini so the browser key never leaks.

## 3. Frontend — Next.js (src/)

### 3.1 Stack & Tooling
- Next 16.2.7 (`next.config.ts:1`) with `eslint.ignoreDuringBuilds` + `typescript.ignoreBuildErrors` true — builds swallow lint/type errors. Fix before shipping to production.
- Tailwind 4 + `tw-animate-css` (`src/app/globals.css:1`), CSS variables for stone theme, `Outfit` font (`src/app/layout.tsx:11`).
- shadcn aliases `@/* -> ./src/*` (`tsconfig.json:25`, `components.json:13`). `jsx: preserve` (changed from `react-jsx` in uncommitted diff) — needed for Next compiler.
- UI primitives: Radix (dialog, dropdown, tabs, etc.), `lucide-react`, `@tabler/icons-react`, `motion`, `@shadergradient/react` for hero, `reactflow` for career chart, `react-dropzone`, `axios`, `zod + react-hook-form`, `sonner` toasts.

### 3.2 Layout & Shell
- `src/app/layout.tsx:23` — `RootLayout` wraps `<UserProvider>` → `<ThemeProvider>` → `<SidebarProvider>` → `<Navbar />` → `{children}` → `<Footer />` → `<Toaster>`.
- `src/components/Navbar.tsx:35` — center `Tools`/`Support` hover menus, right auth CTA or `UserDropDown`. Mobile drawer is `AppSidebar` from `mobile-sidebar.tsx`. Active route label injected from `src/content/routes.js:1`.
- `src/app/page.tsx:7` — marketing hero with `ShaderGradientCanvas` (z-0) + hero copy (z-10).

### 3.3 Auth & User State
- **No JWT / cookies.** Auth is `localStorage.setItem("user", JSON.stringify({id,name,email,pro}))` in `src/context/userContext.tsx:39` + `clearUser` on logout. `UserProvider` hydrates from localStorage on mount (`userContext.tsx:24`).
- `src/hooks/protectedRoute.ts:7` — `useProtectedRoute()` redirects to `/auth` with `toast.warning` if `!user`. `useUserExists()` (`protectedRoute.ts:20`) bounces logged-in users from `/auth` to `/prepareAI`.
- `src/components/Login.tsx:27` / `Signup.tsx:31` — POST to `${NEXT_PUBLIC_BACKEND}/api/auth/login|signup`. Signup payload uses `passwordHash: password` field name (`Signup.tsx:34`), login uses `password` (`Login.tsx:29`). Backend compares plaintext (`backend/controllers/userController.js:35` `password === user.passwordHash`) — see §12 Tech Debt.
- On signup success, `updateUser` + push to `/hello` (`Signup.tsx:52`). Login just toasts; redirect is via `useUserExists` or manual nav.

### 3.4 Onboarding — /hello
- `src/app/hello/page.tsx:24` — collects `nationality` (ComboBox from `content/countries.json`), `role` (`content/roles.json`), `age`, `sex` (RadioGroup). Calls `useUserInfo().setMeInfo` (`hooks/useUserInfo.tsx:26`) → POST `/api/auth/me` → push `/profile`. No validation beyond empty check.

### 3.5 Career Pathway — /prepareAI (core feature)
- Protected route (`src/app/prepareAI/page.tsx:18`).
- Left `AppSidebar` (`src/components/chat-sidebar.tsx`) lists past chats (fetched via `GET /api/pathway/chats/:userId` in `prepareAI/page.tsx:42`). `SidebarTrigger` toggles.
- `src/components/promptForm.tsx:14` — `PromptForm` collects: `role`, `targetCompanies`, `expertise`, `weakAreas`, `skillLevel` (slider 0-10), `timeCommitment` (slider 0-24), `extraRemarks`. On submit:
  1. `POST /api/gemini` with `promptData` (`promptForm.tsx:41`).
  2. `POST ${BACKEND}/api/pathway/chat` with `{user, chat:{promptData}}` (`pathwayRoutes.js:20` → `pathwayController.js:27`).
  3. `PUT ${BACKEND}/api/pathway/chat/:chatId` with Gemini JSON (`promptForm.tsx:66`) → expects `{chat:{title,textual,flowjson}}`.
  4. `onChatCreated(chatId)` triggers `refreshChats()` + `setSelectedChatId`.
- Prompt template: `src/app/lib/geminiPrompt.ts:16` `prepareAIPrompt()` — forces JSON `{chat:{title,textual,flowjson:{pathwayData:{stages,connections}, structData:{nodes,edges}}}}` with `x = index*300` layout. `responseMimeType: "application/json"` in `src/app/api/gemini/route.js:25`.
- Viewer: `src/components/ui/flow-viewer.tsx` wraps `reactflow`. Markdown via `src/components/markDownViewer.tsx` (`@uiw/react-markdown-preview`). `PromptDisplay` (`iDisplay.tsx`) + `AlertDisplay` (delete chat `DELETE /api/pathway/chat/:id`) per selected chat. Flow hidden on mobile with amber warning (`prepareAI/page.tsx:104`).

### 3.6 Resume AI — /resumeAI
- `src/app/resumeAI/page.tsx:9` — `file` (PDF) + `role` validation, `POST /api/resume` as `FormData`.
- Next route `src/app/api/resume/route.ts:7` — converts PDF to base64, builds prompt via `resumeAIPrompt()` (`geminiPrompt.ts:96`), calls `gemini-2.5-flash` with `inlineData` PDF part. Returns `{output: response.text}` (Markdown).
- Prompt asks for ATS score `XX/100`, Key Fixes, Strengths, Keyword Match, Verdict — brutally concise.
- UI: `src/components/ResumeForm.tsx:8` with `PlaceholdersAndVanishInput` + `FileUpload` (`src/components/ui/file-upload.tsx`), result rendered by `MarkdownViewer` + `X` clear button. No backend persistence for resumes (`User.resume` is just String stub).

### 3.7 Profile & Billing
- `src/app/profile/page.tsx:16` — `useUserInfo()` pulls `GET /api/auth/me/:id` (populates `subscriptionRef`, `payments`). Renders name/avatar, bio grid, Premium card placeholder, `PaymentTable` (`src/components/paymentTable.tsx`) over `userInfo.payments`.
- `src/app/subscribe/page.tsx:44` — pricing grid (Solo ₹199, Enterprise ₹999, Pay-per-chat ₹99) + comparison table. Currently overridden by `HolUp` (`subscribe/page.tsx:186`) that renders “Free for all” — payment UI is gated but `PayPerUseCard` + `PayButton` exist.
- `src/components/payButton.tsx:22` — loads `checkout.razorpay.com`, `POST /api/razorpayMain/create-order` with `{amount, id:user.id, paymentType}`, opens `window.Razorpay` with `NEXT_PUBLIC_RAZORPAY_KEY_ID`. `onSuccess`/`onFailure` callbacks wired.
- `src/app/payTest/page.tsx:5` — manual test harness for PayButton.

### 3.8 Routing Table (src/content/routes.js:1)
```
sub: /subscribe, profile: /profile, resume: /resumeAI, prepare: /prepareAI,
mockInterviews/discussions: "#",
static: {contact: external github, issue: external github issues/new/choose, documentation: /documentation},
auth: {loginRoute: /auth, signupRoute: /auth?tab=signup, hello: /hello}
```
`Navbar.tsx` maps these to `ProductItem` + `HoveredLink`. Keep this file as single source of truth.

## 4. Backend — Express (backend/)

### 4.1 Boot — backend/app.js:1
- `cors()` default (allow all), `express.raw` only for `/api/razorpay` webhook before `express.json()`.
- Mongo connect via `process.env.MONGO_URI`. Mounts: `/api` → `testRoutes`, `/api/pathway` → `pathwayRoutes`, `/api/auth` → `userRoutes`, `/api/razorpayMain` → `paymentRoutes`, `/api/razorpay` (raw) → `razorpayWebhook`. `PORT` env or 5000.

### 4.2 Models
- `backend/models/User.js:3` — `{name, email(unique), passwordHash, age, role, sex enum Male/Female/Other, nationality, pathways ref Pathway, resume String, subscriptionRef ref Subscription, payments [ref Payment], timestamps}`. Note: `pathways` is singular ObjectId though it holds many chats.
- `backend/models/Pathway.js:3` — `promptDataSchema`, `stageSchema {id,title}`, `connectionSchema {from,to}`, `flowJsonSchema {pathwayData{stages,connections}, structData{nodes,edges:Mixed}}`, `chatSchema {title,textual,flowjson,promptData,chatType enum ppc|sub|free default free, isLocked, timestamps}`, `pathwaySchema {user ref User, chats:[chatSchema], timestamps}`. One Pathway doc per user.
- `backend/models/Payment.js:5` — `{user ref, razorpayOrderId, razorpayPaymentId, status enum created|paid|failed, amount Number (paise), paymentDate, source enum solo|enterprise|ppc|other, payload Object, timestamps}` plus `post("save")` hook (`Payment.js:23`) that `$addToSet` user.payments, then upserts Subscription (ppc increments `activeChatCredits`, solo/enterprise sets `status:active` + 30d endDate).
- `backend/models/Subscription.js:4` — `{user ref, type enum solo|enterprise|ppc|free default free, status active|inactive default inactive, startDate, endDate, activeChatCredits default 1, timestamps}` + `post("save")` to attach to user (`Subscription.js:20` — also contains dead `if (doc.source==="ppc")` check).

### 4.3 Controllers
- `backend/controllers/userController.js:5` `signup` — checks `email` duplicate, creates `User({email,passwordHash,name})`, creates empty `Pathway({user, chats:[]})`, links `User.pathways`. Returns `{id,name,email,pro}`.
- `login` (`userController.js:27`) — finds by email, `populate(subscriptionRef)`, plaintext `password === passwordHash`, returns `pro: subscriptionRef.status==="active"`. **874** Serializing: check existingUser flow if adding oauth.
- `setMeInfo`/`getMeInfo` (`userController.js:53`) — `findByIdAndUpdate` / `findById+populate(subscriptionRef,payments)`.
- `backend/controllers/pathwayController.js:4` `getAllPathways` — admin gate via `req.body.amaran==="i am admin"` (body on GET — brittle). `getUserChats:17` — `User.findById(id).populate("pathways") → user.pathways`. `createChat:27` — `User.findById(body.user).populate`, then `Pathway.findByIdAndUpdate(user.pathways.id, $push:{chats: body.chat})`. `deleteChat:41`, `updateFlow:61` (only flowjson), `updateChat:81` (title/textual/flowjson) — all use `chats._id` positional `$`.

### 4.4 Routes
- `backend/routes/userRoutes.js:11` — `POST /signup|/login|/me`, `GET /me/:id`, `GET /users` (admin, no auth).
- `backend/routes/pathwayRoutes.js:13` — `GET /pathways` (admin), `GET /chats/:id`, `POST /chat`, `DELETE /chat/:id`, `PUT /flow/:id`, `PUT /chat/:id`.
- `backend/routes/paymentRoutes.js:14` — `POST /create-order` (Razorpay SDK `orders.create` with `notes:{id,paymentType}`), `GET /payments`.
- `backend/routes/subscriptionRoutes.js:1` — **BROKEN**: `require` syntax in ESM project, `express.router()` lowercase, incomplete. Do not mount until fixed.
- `backend/routes/testRoutes.js` — trivial health check (not detailed here).
- `backend/webhooks/razorpayWebhook.js:10` — `POST /webhook`, raw body HMAC `sha256(secret).update(req.body).digest(hex)` vs `x-razorpay-signature`, parses `req.body`, if `payload.order` then `new Payment({...})` from `payment.entity.notes.{id,paymentType}` + order fields, `await payment.save()` (triggers Payment post-save). Writes 200 or 400/500. Needs `ngrok http 5000` + Razorpay dashboard webhook setup (`backend/what.md:1`).

## 5. Environment Variables

Frontend (`src/app/api/*` reads server, `NEXT_PUBLIC_*` is client-bundled):
```
NEXT_PUBLIC_BACKEND=http://localhost:5000   # .env:1 (and backend/.env)
GEMINI_API_KEY=...                          # .env:2 — used only in Next server routes
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...   # .env:3
```
Backend (`backend/.env` — not checked in, but required):
```
MONGO_URI=mongodb+srv://...
PORT=5000
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```
Keep `.env*` gitignored (`.gitignore:35`). Never commit secrets. For local dev provide `backend/.env.example`.

## 6. Scripts & Running

Frontend:
```bash
npm run dev     # next dev
npm run build   # next build (ignores eslint/ts errors — fix before prod)
npm run lint    # eslint .
```
Backend:
```bash
cd backend
npm run dev     # nodemon app.js (package.json:9)
npm test        # node app.js
```
Full local stack: `mongod` or Atlas → `backend npm run dev` → `npm run dev` (root) → webhook: `ngrok http 5000` → paste public URL into Razorpay dashboard webhook `https://<ngrok>/api/razorpay/webhook`.

## 7. Critical Gotchas & Tech Debt (read before PR)

- **Plaintext passwords** — `userController.js:35` compares raw strings; `Signup` sends `passwordHash` field that is actually plaintext. Must add `bcrypt.hash` on signup + `bcrypt.compare` on login (backend already depends on `bcrypt@6`).
- **Auth is localStorage only** — no httpOnly cookie / JWT / session. `protectedRoute` can be bypassed. Any migration must add server session and keep `UserContext` in sync.
- **Build ignores errors** — `next.config.ts:5-10` swallows ESLint + TS. CI should enforce `next build` without these flags or run `tsc --noEmit`.
- **Subscription routes broken** — `backend/routes/subscriptionRoutes.js:1` uses CJS `require` + `express.router()` typo; not mounted in `app.js`. Fix to ESM before using.
- **`getAllPathways` admin check** — body on GET (`pathwayController.js:6`) will be empty with most clients; move to header/query + proper auth middleware.
- **Razorpay webhook mount** — `app.js:16` mounts at `/api/razorpay` with `express.raw`, webhook expects POST to `/webhook` → full path `/api/razorpay/webhook`. Ensure `MONGO_URI` etc. set or `mongoose.connect` will throw.
- **Subscribe page disabled** — `SubscribePage` is defined but default export is `HolUp` (`subscribe/page.tsx:186`) showing “Free for all”. Re-enable when payments ready.
- **Type laxity** — `eslint.config.mjs:13` disables `@typescript-eslint/no-explicit-any`, many `any` in `geminiPrompt.ts`, `payButton`, `promptForm`.
- **`tsconfig jsx preserve`** — uncommitted diff changes `react-jsx→preserve`; Next expects `preserve`. Don’t flip back without testing `next build`.
- **`User.pathways` naming** — singular field holding `Pathway` doc with `chats[]`; don’t confuse with `Pathways` TypeScript interface (`src/types/user.ts:96` has `user:number` typo).
- **Ngrok required for webhooks** locally — see `backend/what.md:3`.

## 8. Agent Playbook — How to Work In This Repo

### General Rules
- Never commit `node_modules`, `.next`, `.env`, `.vercel`, `*.pem`. Respect `.gitignore:1`.
- Prefer editing over creating files. When adding a route, update `src/content/routes.js:1` + `Navbar.tsx:42` menu.
- Keep shadcn aliases (`@/components`, `@/lib/utils`, etc.) —`components.json:13`.
- Use `sonner` toasts for user feedback, not `alert`.
- For any Gemini change, edit `src/app/lib/geminiPrompt.ts:1` + corresponding `src/app/api/*/route.*`. Validate JSON shape against `Pathway.flowjson` before `PUT /api/pathway/chat/:id`.
- For backend model changes, update Mongoose schema + controller + frontend type (`src/types/user.ts:1`, `src/app/prepareAI/types.ts:1`).

### Where to Put What
- New UI page → `src/app/<route>/page.tsx` + `layout.tsx` if needed (see `resumeAI/layout.tsx`).
- Reusable UI → `src/components/ui/*` (shadcn) or `src/components/*` (domain).
- Hooks → `src/hooks/*`, context → `src/context/*`.
- Express endpoint → `backend/routes/<domain>Routes.js` + `backend/controllers/<domain>Controller.js` + mount in `backend/app.js:29`.

### Verification Before PR
- `npm run lint` — fix real errors (ignore the disabled rules above only if intentional).
- `npm run build` locally; if you changed backend, `cd backend && node app.js` dry-run.
- For AI flows: test `PromptForm → Gemini → Pathway save` and `ResumeForm → /api/resume` with a real PDF + role.
- For payments: `payTest/page.tsx:5` + Razorpay test card, verify webhook creates `Payment` + `Subscription` docs in Mongo.

## 9. Example Tasks & Pointers

- **Implement JD Analyzer (Phase 2)** → reuse `src/app/api/resume/route.ts:7` pattern, new prompt in `geminiPrompt.ts:96`, new form similar to `ResumeForm.tsx:8`, add route to `content/routes.js:1`.
- **Enable Solo/Enterprise checkout** → un-gate `PayButton` in `subscribe/page.tsx:84`, test `paymentRoutes.js:15` order creation, confirm `razorpayWebhook.js:10` → `Payment` post-save → `Subscription` lifecycle.
- **Fix auth** → `backend/controllers/userController.js:5` add `bcrypt.hash`, issue httpOnly cookie/JWT, replace `userContext.tsx:24` localStorage with cookie read, protect `userRoutes`/`pathwayRoutes` with middleware.
- **Add progress tracking** → extend `Pathway.chatSchema` with `progress/milestones`, new `PUT /api/pathway/chat/:id/progress`.
- **Fix subscriptionRoutes** → rewrite to `import express from "express"; const router = express.Router();` + implement `GET /current/:id`.

## 10. References
- `README.md:1` roadmap, `backend/what.md:1` ngrok notes, `framework.value` (empty).
- Key entry points: `src/app/layout.tsx:23`, `backend/app.js:1`, `src/context/userContext.tsx:19`, `src/hooks/protectedRoute.ts:7`, `src/app/lib/geminiPrompt.ts:16`.

---
*Agents: keep this file < 400 lines, update it when you change contracts, and link code with `path:line` so reviewers can jump.*
