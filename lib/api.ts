// lib/api.ts — Route Handler helpers (TRD §9.2/§9.3/§9.4).
//
// Route handlers return the same JSON envelope as actions, plus HTTP status.
// Public list endpoints are rate-limited per IP (§9.4).

import { NextResponse } from "next/server";
import { AppError, type ErrorCode } from "@/types";
import { rateLimit, rateLimitHeaders, type RateScope } from "@/lib/rate-limit";
import { logger, newRequestId } from "@/lib/logger";

const STATUS_BY_CODE: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function jsonError(
  code: ErrorCode,
  message: string,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json(
    { error: { code, message, ...extra } },
    { status: STATUS_BY_CODE[code] },
  );
}

/** Map a thrown error to the standard error envelope response. */
export function handleRouteError(e: unknown) {
  if (e instanceof AppError) {
    return jsonError(e.code, e.message, e.fieldErrors ? { fieldErrors: e.fieldErrors } : undefined);
  }
  const requestId = newRequestId();
  logger.error("unhandled route error", { requestId, error: String(e) });
  return jsonError("INTERNAL_ERROR", "Something went wrong.", { requestId });
}

/** Client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

/**
 * Enforce a rate limit; returns a 429 response if exceeded, else null.
 * Usage: `const limited = enforceRateLimit(req, "public"); if (limited) return limited;`
 */
export function enforceRateLimit(req: Request, scope: RateScope): NextResponse | null {
  const result = rateLimit(scope, clientIp(req));
  if (!result.success) {
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: "Too many requests." } },
      { status: 429, headers: rateLimitHeaders(result) },
    );
  }
  return null;
}

/** Parse pagination params from a URL's searchParams. */
export function pageParams(url: URL) {
  const page = Number(url.searchParams.get("page")) || 1;
  const pageSize = Number(url.searchParams.get("pageSize")) || 20;
  return { page, pageSize };
}
