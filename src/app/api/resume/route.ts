import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { resumeAIPrompt } from "@/app/lib/geminiPrompt";

// export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const role = await form.get("role");
    const jd = await form.get("jd");
    const text = resumeAIPrompt({ role, jd });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text },
            { inlineData: { data: base64, mimeType: "application/pdf" } },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const raw = response.text ?? "";
    let parsed: any = null;
    let output: string | null = null;
    try {
      parsed = JSON.parse(raw);
      // Normalize: ensure atsScore equals breakdown sum if provided, clamp 0-100
      if (parsed?.atsScore == null && parsed?.breakdown) {
        parsed.atsScore = parsed.breakdown.reduce((s: number, b: any) => s + (Number(b.score) || 0), 0);
      }
      if (typeof parsed.atsScore === "number") {
        parsed.atsScore = Math.max(0, Math.min(100, Math.round(parsed.atsScore)));
      }
    } catch {
      // fallback: try repair, else return raw markdown as output
      try {
        const { jsonrepair } = await import("jsonrepair");
        const repaired = jsonrepair(raw);
        parsed = JSON.parse(repaired);
      } catch {
        output = raw;
      }
    }

    if (parsed) {
      // keep both structured + raw markdown for legacy viewers
      if (!parsed.rawMarkdown && !parsed.output) parsed.rawMarkdown = raw;
      return NextResponse.json({ ...parsed, output: parsed.rawMarkdown ?? output ?? raw });
    }
    return NextResponse.json({ output: output ?? raw });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
