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

    // Since responseMimeType is JSON, we can parse it safely without regex cleaning
    const data = JSON.parse(response.text);
    return Response.json(data);

  } catch (e) {
    console.error("Gemini API Error:", e); // Log this to your server terminal so you can see it
    return Response.json(
      { error: e.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
