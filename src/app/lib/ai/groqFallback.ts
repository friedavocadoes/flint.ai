const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";
const DEFAULT_TIMEOUT_MS = 30_000;

type GroqJsonOptions = {
  model?: string;
  timeoutMs?: number;
};

/**
 * Emergency-only Groq fallback for AI features that can tolerate a less capable
 * model. This intentionally uses the native fetch API so Flint does not need
 * another SDK dependency just for the fallback provider.
 */
export async function generateGroqJson(
  prompt: string,
  options: GroqJsonOptions = {},
) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options.model || process.env.GROQ_FALLBACK_MODEL || DEFAULT_GROQ_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are Flint.ai's emergency fallback career AI. Follow the user's instructions exactly. Return ONLY a valid JSON object. Do not use markdown fences, commentary, or extra text. Preserve every required field and type requested by the prompt.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        reasoning_effort: "medium",
      }),
      signal: controller.signal,
    });

    const body = await response.text();
    let payload: any = null;

    try {
      payload = body ? JSON.parse(body) : null;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const message = payload?.error?.message || `Groq request failed (${response.status})`;
      const error: any = new Error(message);
      error.status = response.status;
      error.provider = "groq";
      throw error;
    }

    const content = payload?.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("Groq returned an empty response");
    }

    try {
      return JSON.parse(content);
    } catch {
      const { jsonrepair } = await import("jsonrepair");
      return JSON.parse(jsonrepair(content));
    }
  } catch (error: any) {
    if (error?.name === "AbortError") {
      const timeoutError: any = new Error("Groq fallback timed out");
      timeoutError.code = "GROQ_TIMEOUT";
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Only quota/transient/provider failures should activate the fallback.
 * Client/request errors such as malformed input should remain real errors.
 */
export function shouldFallbackFromGemini(error: any) {
  const status = Number(error?.status ?? error?.response?.status);
  const code = String(error?.code || "").toUpperCase();
  const message = String(error?.message || "").toLowerCase();

  if ([408, 429, 500, 502, 503, 504].includes(status)) return true;
  if (["RESOURCE_EXHAUSTED", "DEADLINE_EXCEEDED", "UNAVAILABLE", "TIMEOUT", "ETIMEDOUT", "ECONNRESET"].includes(code)) return true;

  return (
    message.includes("resource exhausted") ||
    message.includes("rate limit") ||
    message.includes("quota") ||
    message.includes("timed out") ||
    message.includes("timeout") ||
    message.includes("temporarily unavailable") ||
    message.includes("no response received") ||
    message.includes("json")
  );
}
