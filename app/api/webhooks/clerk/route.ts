// app/api/webhooks/clerk/route.ts — svix-verified Clerk user sync (TRD §6, §14).
//
// Clerk is the identity provider; this webhook keeps our `User` table in sync.
// Every request is HMAC-verified via svix BEFORE any payload is trusted — an
// unverified request is rejected 401 before touching the database (TRD §14).

import { Webhook } from "svix";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { logger, newRequestId } from "@/lib/logger";

export const runtime = "nodejs";

interface ClerkEmail {
  id: string;
  email_address: string;
}
interface ClerkUserData {
  id: string;
  email_addresses?: ClerkEmail[];
  primary_email_address_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
}
interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserData;
}

function primaryEmail(data: ClerkUserData): string | null {
  const emails = data.email_addresses ?? [];
  if (!emails.length) return null;
  const primary = emails.find((e) => e.id === data.primary_email_address_id);
  return (primary ?? emails[0]).email_address ?? null;
}

function fullName(data: ClerkUserData): string | null {
  const name = [data.first_name, data.last_name].filter(Boolean).join(" ");
  return name || null;
}

export async function POST(req: Request) {
  const log = logger.child({ requestId: newRequestId(), webhook: "clerk" });

  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    log.error("CLERK_WEBHOOK_SECRET is not set");
    return new Response("Webhook not configured", { status: 500 });
  }

  const hdrs = await headers();
  const svixId = hdrs.get("svix-id");
  const svixTimestamp = hdrs.get("svix-timestamp");
  const svixSignature = hdrs.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.text();

  let event: ClerkWebhookEvent;
  try {
    event = new Webhook(secret).verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch {
    log.warn("svix verification failed");
    return new Response("Invalid signature", { status: 401 });
  }

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const data = event.data;
        const email = primaryEmail(data);
        if (!email) {
          log.warn("user event with no email", { clerkId: data.id });
          break;
        }
        await db.user.upsert({
          where: { clerkId: data.id },
          create: {
            clerkId: data.id,
            email,
            name: fullName(data),
            avatarUrl: data.image_url ?? null,
            // role defaults to STUDENT (schema default, TRD §6).
          },
          update: {
            email,
            name: fullName(data),
            avatarUrl: data.image_url ?? null,
          },
        });
        log.info("user upserted", { clerkId: data.id, type: event.type });
        break;
      }
      case "user.deleted": {
        // Soft-delete so moderation/audit history is preserved (TRD §10.1).
        await db.user.updateMany({
          where: { clerkId: event.data.id, deletedAt: null },
          data: { deletedAt: new Date() },
        });
        log.info("user soft-deleted", { clerkId: event.data.id });
        break;
      }
      default:
        log.debug("ignored event", { type: event.type });
    }
  } catch (e) {
    log.error("webhook handler error", { error: String(e) });
    return new Response("Handler error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
