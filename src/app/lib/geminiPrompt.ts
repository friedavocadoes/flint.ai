type prepareAIPromptDataTypes = {
  role: String;
  targetCompanies: String;
  expertise: String;
  weakAreas: string;
  skillLevel: string;
  timeCommitment: string;
  extraRemarks: string;
};

type resumeAIPromptType = {
  role: String | FormDataEntryValue | null;
  jd?: String | FormDataEntryValue | null;
};

export function prepareAIPrompt(promptData: prepareAIPromptDataTypes) {
  return `You are a career coaching assistant that designs GAMIFIED, INTERACTIVE roadmaps. Given the user profile:

Role aspiration: ${promptData.role}
Target company/ies: ${promptData.targetCompanies}
Expertise: ${promptData.expertise}
Weak areas: ${promptData.weakAreas}
Skill level: ${promptData.skillLevel}
Time commitment: ${promptData.timeCommitment}
Extra remarks: ${promptData.extraRemarks}

Design an ENGAGING career pathway that feels like a quest, not a textbook. Be motivational but brutally honest about chances.

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
- Be detailed but scannable; avoid generic fluff.
- Escape JSON strings properly. Do not use markdown code fences. Ensure numeric chances is integer, xp integer, estimatedHours integer.`;
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
