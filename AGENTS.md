# AGENTS.md — Flint.ai

> Career Pathway Assist — AI roadmap + ATS + LinkedIn optimizer.

This is the canonical onboarding for contributors. Keep it aligned with the current contracts.

## 1. Architecture

```text
flint.ai/
├── src/                         # Next 16 App Router / React 19 / TypeScript
│   ├── app/                     # prepareAI, resumeAI, linkedin, profile, subscribe
│   ├── components/              # shared UI + Cashfree checkout
│   ├── context/                 # UserContext / localStorage auth state
│   ├── hooks/                   # protectedRoute, useUserInfo
│   └── types/                   # shared TypeScript types
└── backend/                    # Express 5 / Mongoose 8 / ESM
    ├── app.js
    ├── controllers/
    ├── models/                 # User, Pathway, BillingPayment, BillingSubscription, reviews
    ├── routes/                 # auth, pathway, history, Cashfree
    ├── services/               # Cashfree integration
    └── utils/
```

Frontend talks to Express through `NEXT_PUBLIC_BACKEND`. Authentication currently uses the client-side `UserContext`; there is no JWT/cookie session yet.

## 2. AI products

- `/prepareAI` — career pathway generation and progress tracking.
- `/resumeAI` — ATS analysis and resume history.
- `/linkedin` — LinkedIn optimization and history.
- `/profile` — account, membership, and payment history.
- `/subscribe` — individual generations and annual Premium.

## 3. Billing — Cashfree only

Cashfree is the sole payment provider.

Frontend checkout:
- `src/components/cashfreePayButton.tsx`
- Creates an order through `POST /api/cashfree/create-order`.
- Opens Cashfree JS checkout with the returned payment session.
- Verifies the order through `GET /api/cashfree/verify/:orderId`.
- Dispatches `flint:billing-updated` after successful fulfillment.

Backend billing:
- `backend/services/cashfree.js` owns Cashfree API calls and webhook signature verification.
- `backend/routes/cashfreeRoutes.js` owns order creation, verification, reconciliation, fulfillment, and Premium cancellation.
- `BillingPayment.provider` is Cashfree-only.
- `BillingSubscription.provider` is Cashfree or manual.
- Premium is a prepaid 365-day purchase, not an auto-renewing mandate. Cancellation immediately revokes access and issues no refund.

Important billing invariants:
1. Never trust a client-supplied price; use `backend/config/billing.js`.
2. Create an internal `BillingPayment` record before calling Cashfree so webhooks can be matched safely.
3. If Cashfree order creation fails, mark the internal payment `failed` instead of leaving a permanently `created` payment.
4. Missing/stale Cashfree orders are marked failed during reconciliation instead of being retried and logged forever.
5. Fulfillment is idempotent: an already-paid payment must never credit the user twice.
6. The profile API explicitly returns `id` because Mongoose's `toObject()` does not include its virtual `id` by default.

## 4. Backend routes

- `/api/auth` — signup, login, Google login, profile data.
- `/api/pathway` — pathway CRUD and progress.
- `/api/resumeHistory` — ResumeAI history.
- `/api/linkedinHistory` — LinkedIn history.
- `/api/cashfree` — billing and Cashfree webhook.

## 5. Environment

Frontend requires the backend URL, Google client ID, and AI configuration as appropriate.

Backend billing variables:

```text
MONGO_URI
PORT
FRONTEND_URL
BACKEND_PUBLIC_URL
GOOGLE_CLIENT_ID
CASHFREE_ENV
CASHFREE_APP_ID
CASHFREE_SECRET_KEY
PRICE_PREPARE_AI_CHAT
PRICE_RESUME_AI_CHAT
PRICE_LINKEDIN_CHAT
PRICE_PREMIUM_YEAR
```

## 6. Development

Frontend:
- `npm run dev`
- `npm run build`
- `npm run lint`

Backend:
- `cd backend && npm run dev`
- `cd backend && npm test`

For local webhook testing, expose the backend over HTTPS with your preferred tunnel and point the Cashfree webhook configuration at `/api/cashfree/webhook`.

## 7. Known auth debt

Local password authentication currently compares the stored password value directly. Do not expand this pattern; migrate to proper password hashing/comparison when auth is next refactored.

Entry points: `layout.tsx`, `backend/app.js`, `userContext.tsx`, `protectedRoute.ts`, `geminiPrompt.ts`, `locationMeta.ts`.
