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
  return `You are a career coaching assistant. Given the following user profile:

Role aspiration: ${promptData.role}

Target company/ies: ${promptData.targetCompanies}

Expertise: ${promptData.expertise}

Weak areas: ${promptData.weakAreas}

Skill level: ${promptData.skillLevel}

Time commitment: ${promptData.timeCommitment}

Extra remarks: ${promptData.extraRemarks}

Generate a JSON response containing:

1. A title for the career pathway (max 5 words).
2. A textual description (formatted in markdown) giving the user realistic, step-by-step advice on what they should focus on to eventually become a what they have asked for, considering their current skillset and weaknesses. Include:

Required skill improvements.

Short-term and long-term goals.

Recommended resources (specific LeetCode question sets, specific tools, books, platforms, networking advice, leadership courses, etc.).

Realistic milestones: if direct jump isn't possible, explain the ladder (e.g., engineering → team lead → director → VP → CEO).

3. A flowjson object with:

A list of stages (id + title).

A list of connections between stages.

For each stage, include realistic x/y coordinates to lay them out cleanly in ReactFlow, spaced horizontally (e.g., x = stage_index * 300, y = 100).

Make sure the JSON is structured as:

{
    "chat": {
        "title": "...",
        "textual": "...",
        "flowjson": {
            "pathwayData": {
                "stages": [
                    { "id": "1", "title": "..." },
                    { "id": "2", "title": "..." }
                ],
                "connections": [
                    { "from": "1", "to": "2" }
                ]
            },
            "structData": {
                "nodes": [
                    {
                        "id": "1",
                        "data": { "label": "..." },
                        "position": { "x": 0, "y": 100 }
                    }
                ],
                "edges": [
                    {
                        "source": "1",
                        "target": "2",
                        "animated": true,
                        "id": "reactflow__edge-1-2"
                    }
                ]
            }
        }
    }
}
    Be honest in the advice: tell them if it's unrealistic to jump directly to ${promptData.role}, suggest the best path, and break it down. Be detailed and practical and tell them the chances(in numbers) of actually getting in, not just motivational fluff.
    Make sure:
    - All string values are valid JSON strings (escape quotes, newlines, etc.).
    - Do not include Markdown code fences (\`\`\`)`;
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
