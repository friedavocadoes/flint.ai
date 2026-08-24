import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { linkedinOptimizerPrompt } from "@/app/lib/geminiPrompt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      targetRole,
      targetCompanies,
      currentHeadline,
      currentAbout,
      currentExperience,
      tone,
      keywords,
    } = body;

    if (
      !targetRole ||
      typeof targetRole !== "string" ||
      targetRole.trim().length < 2
    ) {
      return NextResponse.json(
        { error: "targetRole is required" },
        { status: 400 },
      );
    }

    const prompt = linkedinOptimizerPrompt({
      targetRole: targetRole.trim(),
      targetCompanies: targetCompanies?.trim(),
      currentHeadline: currentHeadline?.trim(),
      currentAbout: currentAbout?.trim(),
      currentExperience: currentExperience?.trim(),
      tone: tone?.trim() || "professional",
      keywords: keywords?.trim(),
    });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const raw = response.text ?? "";
    let parsed: any = null;
    let output: string | null = null;

    try {
      parsed = JSON.parse(raw);
    } catch {
      try {
        const { jsonrepair } = await import("jsonrepair");
        const repaired = jsonrepair(raw);
        parsed = JSON.parse(repaired);
      } catch {
        output = raw;
      }
    }

    if (parsed) {
      // normalize scores 0-100 and breakdown sum
      const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
      if (typeof parsed.overallScore === "number")
        parsed.overallScore = clamp(parsed.overallScore);
      if (typeof parsed.headlineScore === "number")
        parsed.headlineScore = clamp(parsed.headlineScore);
      if (typeof parsed.aboutScore === "number")
        parsed.aboutScore = clamp(parsed.aboutScore);
      if (typeof parsed.experienceScore === "number")
        parsed.experienceScore = clamp(parsed.experienceScore);

      // breakdown sum fallback
      if (
        parsed.breakdown &&
        Array.isArray(parsed.breakdown) &&
        typeof parsed.overallScore !== "number"
      ) {
        const sum = parsed.breakdown.reduce(
          (s: number, b: any) => s + (Number(b.score) || 0),
          0,
        );
        parsed.overallScore = clamp(sum);
      }

      // ensure headlineScore etc derived if missing
      if (
        parsed.overallScore != null &&
        parsed.breakdown &&
        !parsed.breakdown.length
      ) {
        // leave
      }

      if (!parsed.rawMarkdown) parsed.rawMarkdown = raw;
      // expose both parsed and output for legacy
      return NextResponse.json({
        ...parsed,
        output: parsed.rawMarkdown ?? output ?? raw,
      });
    }

    return NextResponse.json({ output: output ?? raw });
  } catch (err: any) {
    console.error("linkedin API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 },
    );
  }
}
