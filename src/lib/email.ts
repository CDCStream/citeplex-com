// Transactional email via Resend.
// Configure via env: RESEND_API_KEY, EMAIL_FROM.
// Degrades gracefully — if no key is set, sends are skipped (never throws),
// so auth/signup keep working without email configured.

import { Resend } from "resend";

const API_KEY = process.env.RESEND_API_KEY || "";
const FROM = process.env.EMAIL_FROM || "CitePlex <onboarding@resend.dev>";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

const PLACEHOLDER = /your_|_here|^$/i;

export function isEmailConfigured(): boolean {
  return !!API_KEY && !PLACEHOLDER.test(API_KEY);
}

let client: Resend | null = null;
function getClient(): Resend {
  if (!client) client = new Resend(API_KEY);
  return client;
}

export interface SendResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

interface SendEmailArgs {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailArgs): Promise<SendResult> {
  if (!isEmailConfigured()) return { ok: false, skipped: true };
  try {
    const { error } = await getClient().emails.send({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || stripHtml(html),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "send failed" };
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Shared branded wrapper so every email looks consistent. */
function layout(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1917;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;border:1px solid #e7e5e4;overflow:hidden;">
        <tr><td style="padding:28px 32px 8px;">
          <span style="font-size:20px;font-weight:700;letter-spacing:-0.02em;">CitePlex</span>
        </td></tr>
        <tr><td style="padding:8px 32px 32px;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:20px 32px;background:#fafaf9;border-top:1px solid #e7e5e4;">
          <p style="margin:0;font-size:12px;color:#a8a29e;">
            CitePlex — academic writing tools. You're receiving this because you signed up at
            <a href="${SITE}" style="color:#a8a29e;">${SITE.replace(/^https?:\/\//, "")}</a>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#1c1917;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:9999px;">${label}</a>`;
}

export async function sendWelcomeEmail(to: string, name?: string): Promise<SendResult> {
  const firstName = (name || "").trim().split(/\s+/)[0];
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  const body = `
    <h1 style="margin:16px 0 8px;font-size:22px;font-weight:700;letter-spacing:-0.02em;">Welcome to CitePlex 🎓</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#44403c;">${greeting}</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#44403c;">
      Thanks for joining CitePlex. You can now generate citations in 11 styles, organize them into
      projects, and use our essay &amp; writing tools — all in one place.
    </p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#44403c;">
      Ready to cite your first source?
    </p>
    <p style="margin:0 0 8px;">${button(`${SITE}/generate`, "Create a citation")}</p>
    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#78716c;">
      Need a hand? Just reply to this email.
    </p>`;
  return sendEmail({ to, subject: "Welcome to CitePlex 🎓", html: layout(body) });
}
