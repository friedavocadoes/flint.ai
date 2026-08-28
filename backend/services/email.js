import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: required("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: required("SMTP_USER"),
      pass: required("SMTP_PASSWORD"),
    },
  });

  return transporter;
}

export async function sendEmail({ to, subject, html }) {
  return getTransporter().sendMail({
    from: process.env.SMTP_FROM || required("SMTP_USER"),
    to,
    subject,
    html,
  });
}

function emailShell(content) {
  return `<!doctype html><html><body style="margin:0;background:#111;color:#f5f5f5;font-family:Arial,sans-serif"><div style="max-width:560px;margin:40px auto;padding:32px;background:#1b1918;border:1px solid #3a2928;border-radius:18px"><div style="font-size:24px;font-weight:800;margin-bottom:24px">flint<span style="color:#ef5350">.</span>ai</div>${content}<p style="color:#999;font-size:12px;margin-top:28px">If you didn't request this, you can safely ignore this email.</p></div></body></html>`;
}

export async function sendVerificationEmail({ email, name, token }) {
  const url = `${required("FRONTEND_URL")}/verify-email?token=${encodeURIComponent(token)}`;
  const safeName = escapeHtml(name || "there");
  return sendEmail({
    to: email,
    subject: "Verify your Flint account",
    html: emailShell(`
      <h1 style="font-size:28px;margin:0 0 12px">You're almost in.</h1>
      <p style="color:#bbb;line-height:1.6">Hey ${safeName}, verify your email to unlock Flint and get moving.</p>
      <p><a href="${url}" style="display:inline-block;background:#ef5350;color:#fff;text-decoration:none;padding:13px 20px;border-radius:10px;font-weight:700">Verify my email</a></p>
      <p style="color:#888;font-size:13px">This link expires in 24 hours.</p>
    `),
  });
}

export async function sendPasswordResetEmail({ email, name, token }) {
  const url = `${required("FRONTEND_URL")}/reset-password?token=${encodeURIComponent(token)}`;
  const safeName = escapeHtml(name || "there");
  return sendEmail({
    to: email,
    subject: "Reset your Flint password",
    html: emailShell(`
      <h1 style="font-size:28px;margin:0 0 12px">Password reset</h1>
      <p style="color:#bbb;line-height:1.6">Hey ${safeName}, someone requested a new password for your Flint account.</p>
      <p><a href="${url}" style="display:inline-block;background:#ef5350;color:#fff;text-decoration:none;padding:13px 20px;border-radius:10px;font-weight:700">Reset my password</a></p>
      <p style="color:#888;font-size:13px">This link expires in 30 minutes and can only be used once.</p>
    `),
  });
}
