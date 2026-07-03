// lib/email.ts — transactional email via Resend (TRD §25, FR-63).
// No-op-safe when RESEND_API_KEY is unset (local dev / CI).

import { Resend } from "resend";
import { logger } from "@/lib/logger";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM_EMAIL ?? "Verity <noreply@verity.app>";

const resend = apiKey ? new Resend(apiKey) : null;

export function isEmailConfigured(): boolean {
  return resend !== null;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/** Send a transactional email. Returns false (logged) if not configured or on error. */
export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  if (!resend) {
    logger.debug("email skipped (no RESEND_API_KEY)", { subject: input.subject });
    return false;
  }
  try {
    const { error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
    if (error) {
      logger.error("resend error", { error: String(error) });
      return false;
    }
    return true;
  } catch (e) {
    logger.error("sendEmail failed", { error: String(e) });
    return false;
  }
}

/** Minimal branded HTML wrapper for notification emails. */
export function notificationEmailHtml(title: string, body: string, url?: string): string {
  const cta = url
    ? `<p style="margin-top:24px"><a href="${url}" style="background:#111;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">View on Verity</a></p>`
    : "";
  return `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px">
    <h2 style="margin:0 0 8px">${title}</h2>
    <p style="color:#444;line-height:1.5">${body}</p>
    ${cta}
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
    <p style="color:#999;font-size:12px">Verity — Career Intelligence Platform</p>
  </div>`;
}
