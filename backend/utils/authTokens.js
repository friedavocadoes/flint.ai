import crypto from "crypto";

export function createAuthToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hash };
}

export function hashAuthToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}
