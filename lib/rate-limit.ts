// lib/rate-limit.ts — sliding-window rate limiting (TRD §9.4, §15).
//
// V1 uses an in-process sliding-window counter (fine for a single Vercel region
// at launch scale). The interface is deliberately Upstash/Redis-shaped so it can
// be swapped for a distributed store without touching call sites.
//
// Limits (TRD §9.4):
//   public unauthenticated → 60/min per IP
//   authenticated read     → 300/min per user
//   authenticated write    → 30/min per user
//   admin                  → unthrottled

export type RateScope = "public" | "authRead" | "authWrite" | "admin";

interface Window {
  count: number;
  resetAt: number;
}

const LIMITS: Record<RateScope, { limit: number; windowMs: number }> = {
  public: { limit: 60, windowMs: 60_000 },
  authRead: { limit: 300, windowMs: 60_000 },
  authWrite: { limit: 30, windowMs: 60_000 },
  admin: { limit: Number.POSITIVE_INFINITY, windowMs: 60_000 },
};

// Persist the store across dev hot-reloads (same reasoning as the Prisma singleton).
const globalForRl = globalThis as unknown as {
  __rlStore?: Map<string, Window>;
};
const store = (globalForRl.__rlStore ??= new Map<string, Window>());

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number; // epoch ms
}

/**
 * Consume one token for `identifier` (IP or userId) under `scope`.
 * Returns success=false when the window is exhausted.
 */
export function rateLimit(scope: RateScope, identifier: string): RateLimitResult {
  const { limit, windowMs } = LIMITS[scope];
  const now = Date.now();

  if (limit === Number.POSITIVE_INFINITY) {
    return { success: true, limit, remaining: limit, resetAt: now + windowMs };
  }

  const key = `${scope}:${identifier}`;
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, limit, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { success: false, limit, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/** Standard headers to attach to a rate-limited response. */
export function rateLimitHeaders(r: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(r.limit),
    "X-RateLimit-Remaining": String(r.remaining),
    "X-RateLimit-Reset": String(Math.ceil(r.resetAt / 1000)),
  };
}

/** Test/maintenance helper — clears all windows. */
export function __resetRateLimitStore() {
  store.clear();
}
