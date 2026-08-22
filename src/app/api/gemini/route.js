import { GoogleGenAI } from "@google/genai";
import { prepareAIPrompt } from "@/app/lib/geminiPrompt";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const promptData = body.promptData;

    if (!promptData) {
      return Response.json({ error: "Missing promptData" }, { status: 400 });
    }

    const prompt = prepareAIPrompt(promptData);

    // Correct SDK invocation for @google/genai
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Upgraded to the latest recommended flash model
      contents: prompt,
      config: {
        // This forces Gemini to return structured JSON automatically
        responseMimeType: "application/json",
      },
    });

    // Handle empty or failed responses safely
    if (!response || !response.text) {
      throw new Error("No response received from Gemini API");
    }

    // Parse with jsonrepair fallback — Gemini occasionally wraps or trails commas
    let data;
    try {
      data = JSON.parse(response.text);
    } catch {
      const { jsonrepair } = await import("jsonrepair");
      const repaired = jsonrepair(response.text);
      data = JSON.parse(repaired);
    }

    // Normalize new rich schema + backward compat: ensure textual alias, overview, meta, motivation, progress defaults
    const chat = data?.chat;
    if (chat) {
      if (!chat.textual && chat.overview) chat.textual = chat.overview;
      if (!chat.overview && chat.textual) chat.overview = chat.textual;
      if (!chat.summary) chat.summary = (chat.overview || "").split(".")[0]?.slice(0, 120) || chat.title || "";
      if (!chat.meta) chat.meta = { chances: 50, verdict: "Keep building", timeline: "6-9 months", level: "Intermediate", commitmentFit: "Fits schedule" };
      if (!chat.motivation) chat.motivation = { streakTip: "25 min daily wins", nextWin: "Complete first quest to unlock next" };
      if (!chat.progress) chat.progress = { completedStageIds: [], completedTaskIds: [], xpEarned: 0 };
      // Ensure each stage has required interactive fields with fallbacks
      const stages = chat?.flowjson?.pathwayData?.stages;
      if (Array.isArray(stages)) {
        chat.flowjson.pathwayData.stages = stages.map((s, i) => ({
          id: s.id ?? String(i + 1),
          title: s.title ?? `Stage ${i + 1}`,
          subtitle: s.subtitle ?? s.estimatedDuration ?? `${s.estimatedHours ?? 12}h • ${s.difficulty ?? "Intermediate"}`,
          description: s.description ?? s.whyItMatters ?? "",
          icon: s.icon ?? (["Rocket","Code2","Library","Target","Brain","Users"][i % 6]),
          type: s.type ?? "skill",
          difficulty: s.difficulty ?? "Intermediate",
          estimatedDuration: s.estimatedDuration ?? `${s.estimatedHours ?? 12}h`,
          estimatedHours: Number.isFinite(s.estimatedHours) ? s.estimatedHours : 12 + i * 4,
          xp: Number.isFinite(s.xp) ? s.xp : 100 + i * 20,
          whyItMatters: s.whyItMatters ?? "",
          deliverable: s.deliverable ?? "Check off tasks to complete",
          order: s.order ?? i + 1,
          tasks: Array.isArray(s.tasks) ? s.tasks : [],
          resources: Array.isArray(s.resources) ? s.resources : [],
        }));
      }
      // Ensure structData.nodes align with stages for ReactFlow
      if (!chat.flowjson?.structData?.nodes && stages) {
        chat.flowjson.structData = {
          nodes: chat.flowjson.pathwayData.stages.map((s, idx) => ({
            id: s.id,
            data: { label: s.title },
            position: { x: idx * 320, y: 100 },
          })),
          edges: chat.flowjson.pathwayData.connections?.map((c) => ({
            source: c.from, target: c.to, animated: true, id: `reactflow__edge-${c.from}-${c.to}`,
          })) || [],
        };
      }
    }

    return Response.json(data);

  } catch (e) {
    console.error("Gemini API Error:", e); // Log this to your server terminal so you can see it
    return Response.json(
      { error: e.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
