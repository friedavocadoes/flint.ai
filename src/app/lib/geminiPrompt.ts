type prepareAIPromptDataTypes = {
  // Geo intent (Step 1)
  targetCountry?: string;
  hasTargetCountry?: string;
  // Current reality (Step 2)
  currentResidenceCountry?: string;
  currentStatus?: string; // studying | working | freelance | seeking | break
  fieldOfStudy?: string;
  educationLevel?: string;
  graduationTimeline?: string;
  currentRole?: string;
  yearsInTargetDomain?: string;
  // Target specifics (Step 3)
  role: string; // always filled — exact role or desired field
  roleSpecificity?: string; // exact | field | explore
  desiredField?: string;
  targetCompanies?: string;
  hasTargetCompany?: string;
  companyTypePreference?: string;
  targetSalary?: string;
  salaryCurrency?: string;
  salaryPeriod?: string;
  opportunityType?: string; // internship | job | either (for students)
  workModePreference?: string;
  // Core calibration (kept)
  expertise: string;
  weakAreas: string;
  skillLevel: string;
  timeCommitment: string;
  extraRemarks?: string;
};

type resumeAIPromptType = {
  role: string | FormDataEntryValue | null;
  jd?: string | FormDataEntryValue | null;
};

type linkedinPromptType = {
  targetRole: string;
  targetCompanies?: string;
  currentHeadline?: string;
  currentAbout?: string;
  currentExperience?: string;
  tone?: string;
  keywords?: string;
};

export function prepareAIPrompt(promptData: prepareAIPromptDataTypes) {
  const geo =
    promptData.hasTargetCountry === "yes" && promptData.targetCountry
      ? promptData.targetCountry
      : promptData.targetCountry || "Open / Any";
  const residence = promptData.currentResidenceCountry || "Not specified";
  const status = promptData.currentStatus || "Not specified";
  const salary = promptData.targetSalary
    ? `${promptData.targetSalary} ${promptData.salaryCurrency || ""} ${promptData.salaryPeriod || ""}`.trim()
    : "Not specified";
  return `You are a career coaching assistant that designs GAMIFIED, INTERACTIVE roadmaps. Given the rich user profile, be hyper-personalized and brutally honest.

PROFILE — GEO INTENT (Step 1):
- Has specific target country? ${promptData.hasTargetCountry || "not specified"} → Target country: ${geo}
- Current residence: ${residence}

PROFILE — CURRENT REALITY (Step 2):
- Current status: ${status}
- If studying: field=${promptData.fieldOfStudy || "-"}, level=${promptData.educationLevel || "-"}, graduation in=${promptData.graduationTimeline || "-"}
- If working: current role=${promptData.currentRole || "-"}, years in TARGET domain=${promptData.yearsInTargetDomain || "-"}
- Expertise: ${promptData.expertise}
- Weak areas: ${promptData.weakAreas}

PROFILE — TARGET (Step 3):
- Target role: ${promptData.role} (specificity: ${promptData.roleSpecificity || "exact"}, desiredField fallback: ${promptData.desiredField || "-"})
- Has target company? ${promptData.hasTargetCompany || "-"} → Companies: ${promptData.targetCompanies || "-"} | Company type preference if no target: ${promptData.companyTypePreference || "-"}
- Target salary: ${salary}
- For student opportunity type: ${promptData.opportunityType || "-"}
- Work mode pref: ${promptData.workModePreference || "-"}
- Skill self-rating: ${promptData.skillLevel} on 10
- Time commitment: ${promptData.timeCommitment}
- Extra remarks: ${promptData.extraRemarks || "-"}

Design an ENGAGING career pathway that feels like a quest, not a textbook. Be motivational but brutally honest about chances. Tailor visas, salary norms and market realities to targetCountry ${geo} vs residence ${residence}.

Generate JSON with this EXACT shape (no extra keys, no markdown fences):

{
  "chat": {
    "title": "2-5 words, punchy (e.g. 'SDE I → Staff Ladder')",
    "summary": "One compelling hook sentence under 22 words that makes the user click Start",
    "overview": "Markdown overview (150-220 words) with short-term/long-term breakdown, keep concise",
    "textual": "Alias of overview — duplicate overview here for backward compat",
    "meta": {
      "chances": 0-100 integer honest fit score for ${promptData.role} at ${promptData.targetCompanies},
      "verdict": "1-sentence brutal verdict (e.g. 'Direct jump unlikely; SDE-2 bridge in 7 months')",
      "timeline": "realistic total (e.g. '6-9 months', '2.5 years')",
      "level": "Beginner|Intermediate|Advanced",
      "commitmentFit": "e.g. 'Fits 4h/day • intense' or 'Needs 6h/day — stretch'"
    },
    "motivation": {
      "streakTip": "15-word daily habit that keeps momentum",
      "nextWin": "What happens if they start today for 7 days (e.g. 'Finish DSA Sprint → unlock System-Design lab')"
    },
    "flowjson": {
      "pathwayData": {
        "stages": [
          {
            "id": "1",
            "title": "Short stage name (max 28 chars)",
            "subtitle": "Scope + duration (e.g. 'DSA foundations • 2-3 weeks • 20h')",
            "description": "45-60 word what to do, why it unblocks ${promptData.role}",
            "icon": "Lucide icon name (e.g. Code2, Rocket, Library, Users, Target, Brain, Briefcase, Layers)",
            "type": "skill|project|habit|networking|interview|milestone",
            "difficulty": "Beginner|Intermediate|Advanced",
            "estimatedDuration": "e.g. '2-3 weeks'",
            "estimatedHours": 20,
            "xp": 120,
            "whyItMatters": "1 sentence linking to ${promptData.targetCompanies} hiring bar",
            "deliverable": "Tangible proof (e.g. 'GitHub repo + 3 blogs' or '5 mock interviews')",
            "order": 1,
            "tasks": [
              { "id": "1-1", "label": "Specific actionable task with count (e.g. Solve 18 NeetCode arrays)", "type": "practice" },
              { "id": "1-2", "label": "Project task (e.g. Build URL shortener in Go)", "type": "project" },
              { "id": "1-3", "label": "Learn resource (e.g. Watch MIT 6.006 Lecture 3)", "type": "learn" }
            ],
            "resources": [
              { "label": "NeetCode 150 Arrays", "url": "https://neetcode.io/practice", "type": "leetcode" },
              { "label": "Grokking Algorithms Ch 1-2", "url": "https://example.com", "type": "book" }
            ]
          }
        ],
        "connections": [{ "from": "1", "to": "2" }]
      },
      "structData": {
        "nodes": [{ "id": "1", "data": { "label": "Stage title" }, "position": { "x": 0, "y": 100 } }],
        "edges": [{ "source": "1", "target": "2", "animated": true, "id": "reactflow__edge-1-2" }]
      }
    }
  }
}

Rules:
- Create 5-7 stages that ladder realistically; if ${promptData.skillLevel} low and they want unicorn role, add bridge roles (e.g. Junior→Mid→Target).
- Each stage: 3-4 tasks, 2-3 resources with REAL URLs (neetcode, coursera, youtube, github), xp 80-200 scaled by difficulty.
- Position nodes horizontally: x=index*320, y=100.
- Respect timeCommitment ${promptData.timeCommitment}: if low, extend timeline, assign habit tasks.
- Weak areas ${promptData.weakAreas} must appear as explicit tasks.
- GEO: If targetCountry ${geo} !== "Open / Any" vs residence ${residence}, add 1 stage/task about visa / local market / language / networking for that country. If country is UAE/Singapore/Japan/UK/US, include country-specific hiring realities (e.g., UAE golden visa, Singapore EP, Japan JLPT).
- REALITY: If currentStatus is studying and graduationTimeline is <6 months, front-load internship/job-ready stages. If working with yearsInTargetDomain "${promptData.yearsInTargetDomain}", avoid junior fluff for 5+ years, focus on gap-closing leadership/scale tasks. If studying fieldOfStudy mismatch target role, add bridge skill stage.
- TARGET: If roleSpecificity is "field" or "explore", stage 1 must propose 2-3 concrete target roles within ${promptData.desiredField || promptData.role} and let them pick. If hasTargetCompany is "no" and companyTypePreference "${promptData.companyTypePreference}" given, tailor deliverables to that type's bar (Startup→ship fast, FAANG→DSA+System Design). Salary "${salary}" in ${promptData.salaryCurrency} — verdict must comment if unrealistic for ${geo} + level and suggest market band.
- Opportunity: If opportunityType is internship, deliverables should be internship-friendly (1-2 week projects, not 6-month replicas).
- Timeline must be REALISTIC given timeCommitment + skillLevel + yearsInTargetDomain + targetCountry difficulty. Low commitment or cross-border move => extend 30-50%. Include timeline reasoning in overview.
- Be detailed but scannable; avoid generic fluff.
- Escape JSON strings properly. Do not use markdown code fences. Ensure numeric chances is integer, xp integer, estimatedHours integer.`;
}

export function linkedinOptimizerPrompt(promptData: linkedinPromptType) {
  return `You are a LinkedIn profile optimizer and hiring-manager ghostwriter for target role "${promptData.targetRole}" ${promptData.targetCompanies ? `at ${promptData.targetCompanies}` : ""}. Tone: ${promptData.tone || "professional + punchy"}.

Inputs:
- Current Headline: ${promptData.currentHeadline || "(none provided)"}
- Current About: ${promptData.currentAbout || "(none provided)"}
- Current Experience bullets: ${promptData.currentExperience || "(none provided)"}
- Extra keywords to weave: ${promptData.keywords || "(infer from target role)"}

Goal: Transform these into a recruiter-magnetic profile that ranks in LinkedIn search + ATS and converts profile views to DMs.

Return STRICT JSON only (no markdown fences) with shape:

{
  "overallScore": 0-100 integer (weighted avg of headline/about/experience),
  "headlineScore": 0-100,
  "aboutScore": 0-100,
  "experienceScore": 0-100,
  "verdict": "2-3 sentence brutally honest verdict — where they stand and fastest win",
  "summary": "≤18 word hook (e.g. 'From invisible to inbound-ready in 30 minutes')",
  "breakdown": [
    { "label": "Headline & Searchability", "score": 0-25, "max": 25, "feedback": "15w blunt" },
    { "label": "About & Story", "score": 0-30, "max": 30, "feedback": "..." },
    { "label": "Experience & Impact", "score": 0-25, "max": 25, "feedback": "..." },
    { "label": "Keywords & Credibility", "score": 0-20, "max": 20, "feedback": "..." }
  ],
  "optimized": {
    "headline": "180-220 chars. Pattern: Role | Core stack (3-4) | Outcome/Proof | Open to X. No emojis unless tone asks.",
    "about": "3-4 short paragraphs (850-1100 chars total). Para1 hook + identity, Para2 what you ship + stack + proof, Para3 what you want next + CTA. First person, tight, no filler. Sprinkle target keywords naturally.",
    "experienceBullets": ["• STAR bullet with metric (e.g. Built X → Y% impact using Z)", "… 4-6 bullets total, each 18-26 words, result-first, verbs: Built/Shipped/Led/Scaled/Cut"],
    "bannerSuggestion": "One line describing cover image concept (e.g. 'Dark grid with code + metrics + YourName tagline')"
  },
  "keywordMatch": {
    "present": ["React","TypeScript"],
    "missing": ["GraphQL","Testing"],
    "suggestions": ["Add GraphQL to headline + one About line: 'Shipping GraphQL APIs at scale'"]
  },
  "improvements": [
    { "section": "Headline|About|Experience", "before": "8-12 word snippet", "after": "rewritten snippet", "why": "12-18w reason (search rank / clarity / impact)" }
  ],
  "highlights": [
    { "section": "Headline | About P1 | Experience bullet 2", "issue": "Vague • no proof — add 2 numbers" }
  ],
  "nextSteps": ["Swap headline today — copy/paste", "Replace top 3 experience bullets", "Add 5 keywords to Skills + Featured"],
  "rawMarkdown": "# LinkedIn Score: XX/100\\n## Optimized Headline\\n... full markdown copy of same content for fallback"
}

Rules:
- overallScore = headlineScore weighted + aboutScore + experienceScore blend; be harsh: empty profile 20-30, decent 55-68, strong 78+.
- breakdown sum = overallScore (25+30+25+20=100).
- headline MUST contain target role "${promptData.targetRole}" + 3-4 hard skills + value prop. Keep 200 chars ideal, 220 max.
- about MUST be copy-paste ready, no bracket placeholders like [Your Company]. Use concrete inferred details from inputs or generic but believable.
- experienceBullets 4-6, if no input experience given invent plausible junior/mid bullets that user can edit — mark as draft but make them strong.
- keywordMatch 5-8 each, infer stack for "${promptData.targetRole}" at "${promptData.targetCompanies || "top companies"}".
- improvements 3-4, highlights 2-3.
- nextSteps 3 immediate 15-min actions.
- Escape JSON strings, no fences.`;
}

export function resumeAIPrompt(promptData: resumeAIPromptType) {
  return `You are an ATS + hiring-manager resume reviewer for role ${promptData.role} ${promptData.jd ? `with JD: ${promptData.jd}` : ""}. You get a PDF resume.

Return STRICT JSON only (no markdown fences) with shape:

{
  "atsScore": 0-100 integer (sum of breakdown),
  "verdict": "2-3 sentence brutally honest chance summary",
  "summary": "≤18 word hook",
  "breakdown": [
    { "label": "Impact & Metrics", "score": 0-20, "max": 20, "feedback": "15w blunt feedback" },
    { "label": "Keywords & Skills", "score": 0-25, "max": 25, "feedback": "..." },
    { "label": "Structure & Formatting", "score": 0-20, "max": 20, "feedback": "..." },
    { "label": "Relevance & Brevity", "score": 0-20, "max": 20, "feedback": "..." },
    { "label": "Language & Clarity", "score": 0-15, "max": 15, "feedback": "..." }
  ],
  "keyFixes": [
    { "title": "≤8w fix title", "desc": "20-28w actionable before→after example", "priority": "high|medium|low", "where": "Top|Experience|Skills|Formatting" }
  ],
  "strengths": [
    { "title": "Strength title", "desc": "12-18w evidence" }
  ],
  "keywordMatch": {
    "present": ["React","TypeScript"],
    "missing": ["GraphQL","Testing"],
    "suggestions": ["Add GraphQL via Apollo snippet in Projects"]
  },
  "highlights": [
    { "page": 1, "section": "Experience • Intern @XYZ", "issue": "No metrics — add 2 numbers" }
  ],
  "nextSteps": ["Rewrite bullets STAR+numbers","Add 5 target keywords to Skills","Quantify edu projects"],
  "rawMarkdown": "# ATS Score (for ${promptData.role}): XX/100\\n## Key Fixes ... full markdown fallback with same content (for legacy)"
}

Rules:
- atsScore = sum(breakdown.score). Be harsh: intern avg 45-60, strong 75+.
- keyFixes 3-5 ordered high→low, role ${promptData.role} specific, blunt.
- strengths 3-4 evidence-based.
- keywordMatch 4-8 each, infer stack for ${promptData.role}.
- highlights 2-3 granular section pointers like "Page 1, Header" or "Skills block".
- nextSteps 3 immediate 30-min actions.
- rawMarkdown must also contain markdown with # ATS Score XX/100 and same sections.
- Escape JSON strings, no fences.`;
}
