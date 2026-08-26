FLINT.AI AI PROVIDER MIGRATION — TEST PHASE
Branch: feat/change-ai

## GOAL

Keep Gemini 2.5 Flash as Flint's primary AI provider during the public
testing phase. Add Groq GPT-OSS 20B as a completely free emergency
fallback for PrepareAI and LinkedIn only.

ResumeAI MUST remain Gemini-only because resume analysis is a higher
trust feature and currently sends PDF data directly to Gemini.

## ENVIRONMENT VARIABLES

Required:
GEMINI_API_KEY
GROQ_API_KEY

Optional:
GROQ_FALLBACK_MODEL

Default fallback model:
openai/gpt-oss-20b

Never expose either API key to client-side code.

## CURRENT ARCHITECTURE

PrepareAI:
POST /api/gemini
↓
prepareAIPrompt()
↓
Gemini 2.5 Flash
↓
success → normalize → return
↓
transient/quota/provider failure
↓
Groq GPT-OSS 20B
↓
JSON parse/repair
↓
normalize → return

LinkedIn:
POST /api/linkedin
↓
linkedinOptimizerPrompt()
↓
Gemini 2.5 Flash
↓
success → normalize → return
↓
transient/quota/provider failure
↓
Groq GPT-OSS 20B
↓
JSON parse/repair
↓
normalize → return

ResumeAI:
POST /api/resume
↓
Gemini 2.5 Flash
↓
success → existing response
↓
failure → return error
NO GROQ FALLBACK

## FALLBACK CONDITIONS

Fallback ONLY for:

- HTTP 408
- HTTP 429
- HTTP 500
- HTTP 502
- HTTP 503
- HTTP 504
- RESOURCE_EXHAUSTED
- DEADLINE_EXCEEDED
- UNAVAILABLE
- TIMEOUT
- ETIMEDOUT
- ECONNRESET
- quota errors
- rate-limit errors
- Gemini timeout
- empty Gemini response
- malformed Gemini JSON response

Do NOT fallback for ordinary client/input errors such as:

- HTTP 400
- invalid request payload
- missing required user input
- application validation errors

Reason:
A bad user request should not silently become an AI-provider fallback.

## GROQ FALLBACK IMPLEMENTATION

File:
src/app/lib/ai/groqFallback.ts

Responsibilities:

1. Read GROQ_API_KEY server-side.
2. Call:
   https://api.groq.com/openai/v1/chat/completions
3. Use GPT-OSS 20B by default.
4. Force JSON object response.
5. Use a 30-second AbortController timeout.
6. Parse returned JSON.
7. Attempt jsonrepair if needed.
8. Throw clean errors if Groq fails.
9. Provide shouldFallbackFromGemini() to determine whether Gemini
   failures are appropriate for fallback.

## PREPAREAI REQUIREMENTS

Preserve the existing prepareAIPrompt().

Preserve existing response normalization:

- textual/overview aliases
- summary
- meta
- motivation
- progress
- stage defaults
- task/resource arrays
- ReactFlow structData generation

Do NOT redesign the PrepareAI schema during this provider fallback task.

Groq receives the same PrepareAI prompt because it already contains the
required JSON structure and instructions.

If Groq output quality becomes insufficient, create a separate compact
fallback prompt in a future task rather than modifying the existing
Gemini prompt.

## LINKEDIN REQUIREMENTS

Preserve linkedinOptimizerPrompt().

Preserve:

- score normalization
- breakdown handling
- rawMarkdown
- output compatibility

Gemini and Groq must return the same external response shape.

## RESUMEAI REQUIREMENTS

Do not modify ResumeAI provider behavior.

Do not add Groq fallback.

Reason:
ResumeAI is a higher-trust feature and requires PDF understanding.
Returning a low-quality emergency analysis is worse than returning
"temporarily unavailable".

## NO USER QUOTA LOGIC

DO NOT implement:

- one-chat-per-user
- daily user limits
- subscription limits
- database AI usage tracking

Those will be implemented separately later.

This branch only handles provider/fallback logic.

## NO SEARCH LAYER YET

Do NOT add:

- Brave
- Tavily
- Exa
- web search
- search caching
- market intelligence pipeline

Those are future improvements.

The current objective is ONLY:
Gemini primary + Groq emergency fallback.

## NO CIRCUIT BREAKER YET

Do not add a global Gemini degraded state yet.

Current behavior:
Each request tries Gemini independently.

Future improvement:
If Gemini starts returning repeated 429/503 errors:
Gemini → DEGRADED
temporarily route eligible requests directly to Groq
periodically probe Gemini again

Only implement this after real testing demonstrates that it is useful.

## TESTING CHECKLIST

Local environment:

1. Set GEMINI_API_KEY.
2. Set GROQ_API_KEY.
3. Run npm install.
4. Run npm run lint.
5. Run npm run build.
6. Test PrepareAI normally.
7. Test LinkedIn normally.
8. Test ResumeAI normally.

Fallback testing:

1. Temporarily make Gemini unavailable.
2. Call PrepareAI.
3. Verify Groq produces a response.
4. Verify response shape matches existing PrepareAI UI expectations.
5. Call LinkedIn.
6. Verify Groq produces a response.
7. Verify LinkedIn UI accepts the response.
8. Verify ResumeAI does NOT call Groq.
9. Remove/disable GROQ_API_KEY.
10. Verify PrepareAI/LinkedIn return a clean provider error instead
    of crashing.

Important:
Do not deliberately exhaust production Gemini quota just to test this.
Use a local invalid/controlled Gemini configuration or mocked provider
behavior for failure-path testing.

## ROLLBACK

The AI fallback work consists of these commits on feat/change-ai:

7300aae25db9ebbcfc23261e92ad3ebb64564a06
Add emergency Groq fallback gateway

cc809a0e46be1ab8824480b68627832356227b00
Add Gemini to Groq fallback for PrepareAI

a3a32e7e9f5e7022f93f60303a4b85261349225f
Add Gemini to Groq fallback for LinkedIn

To revert ONLY this work:

git checkout feat/change-ai
git pull
git revert --no-commit 7300aae25db9ebbcfc23261e92ad3ebb64564a06^..a3a32e7e9f5e7022f93f60303a4b85261349225f
git commit -m "Revert Gemini Groq fallback"
git push origin feat/change-ai

Do NOT use git reset --hard unless you have verified the branch history
and specifically want to discard later work.

## FUTURE PHASE

Once Flint has real users:

Phase 2:

- per-user AI quota
- IP abuse protection
- request size limits
- token limits
- provider usage tracking

Phase 3:

- circuit breaker
- provider health state
- retry/backoff
- caching

Phase 4:

- web search layer
- current job-market retrieval
- source validation
- search caching

Phase 5:

- centralized Career Profile
- resume context
- PrepareAI context
- LinkedIn context
- selective context retrieval

Phase 6:

- proper provider router
- Gemini
- Groq
- Mistral
- additional emergency provider

DO NOT prematurely implement all of Phase 2-6 while the product is still
being tested. Keep the current architecture intentionally small.
