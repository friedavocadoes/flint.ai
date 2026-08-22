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
  return `You are an **ATS (Applicant Tracking System) Resume Evaluator**.

The candidate is applying for the role of **${promptData.role}**.  
${promptData.jd && `Job Description (for context): ${promptData.jd}`}

You will receive the candidate's resume as a **PDF**.

### Your Output (in Markdown):
# **ATS Score (for ${promptData.role}): XX/100**

Provide ONLY the following sections, each brutally concise and critical:

## 🔑 Key Fixes (Top Priorities)
- List the **3-5 most urgent changes** needed to beat ATS and recruiters (missing keywords, weak phrasing, format issues, metrics, etc.).  
- Be blunt and actionable—no generic advice.

## ✅ Strengths
- 3-5 specific points where the resume performs well (structure, impact, role alignment, quantifiable results, etc.).

## ⚡ Keyword Match
- **Present:** Important keywords/skills from the job description already in the resume.  
- **Missing:** High-value keywords/skills that are absent or weak.

## 🏁 Verdict
- A **2-3 sentence** direct summary of the resume's chances (e.g., “Likely rejected without X,” or “Strong ATS pass but weak recruiter appeal”).

### Rules
- Be **role-aware**.  
- Avoid fluff or explanations—**only critical insights**.  
- Use **Markdown headings and bullet points** for clarity.
`;
}
