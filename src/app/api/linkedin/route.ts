import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { linkedinOptimizerPrompt } from "@/app/lib/geminiPrompt";
import { generateGroqJson, shouldFallbackFromGemini } from "@/app/lib/ai/groqFallback";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function normalizeLinkedInResponse(parsed: any, raw = "") {
  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

  if (typeof parsed.overallScore === "number") parsed.overallScore = clamp(parsed.overallScore);
  if (typeof parsed.headlineScore === "number") parsed.headlineScore = clamp(parsed.headlineScore);
  if (typeof parsed.aboutScore === "number") parsed.aboutScore = clamp(parsed.aboutScore);
  if (typeof parsed.experienceScore === "number") parsed.experienceScore = clamp(parsed.experienceScore);

  if (
    Array.isArray(parsed.breakdown) &&
    typeof parsed.overallScore !== "number"
  ) {
    parsed.overallScore = clamp(
      parsed.breakdown.reduce((s: number, b: any) => s + (Number(b.score) || 0), 0),
    );
  }

  if (!parsed.rawMarkdown) parsed.rawMarkdown = raw;
  return {
    ...parsed,
    output: parsed.rawMarkdown ?? raw,
  };
}

async function generateWithGemini(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
    },
  });

  const raw = response.text ?? "";
  if (!raw) throw new Error("No response received from Gemini API");

  try {
    return { parsed: JSON.parse(raw), raw };
  } catch {
    const { jsonrepair } = await import("jsonrepair");
    return { parsed: JSON.parse(jsonrepair(raw)), raw };
  }
}

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

    try {
      const { parsed, raw } = await generateWithGemini(prompt);
      return NextResponse.json(normalizeLinkedInResponse(parsed, raw));
    } catch (geminiError) {
      console.error("Gemini LinkedIn error:", geminiError);

      if (!shouldFallbackFromGemini(geminiError)) {
        throw geminiError;
      }

      console.warn("Gemini unavailable; using Groq emergency fallback for LinkedIn");
      const fallbackData = await generateGroqJson(prompt);
      return NextResponse.json(normalizeLinkedInResponse(fallbackData));
    }
  } catch (err: any) {
    console.error("linkedin API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 },
    );
  }
}
