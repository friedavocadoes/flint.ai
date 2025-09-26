import { GoogleGenAI } from "@google/genai";
import { jsonrepair } from "jsonrepair";
import { prepareAIPrompt } from "@/app/lib/geminiPrompt";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  const body = await req.json();
  const promptData = body.promptData;

  const prompt = prepareAIPrompt(promptData);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const cleanResponse = response.text
      .replace(/```json/, "")
      .replace(/```/, "")
      .trim();

    const fixed = jsonrepair(cleanResponse);
    // console.log(fixed);

    return Response.json(JSON.parse(fixed));
  } catch (e) {
    return Response.json({ error: e });
  }
}
