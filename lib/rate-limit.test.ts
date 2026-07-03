import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, __resetRateLimitStore } from "./rate-limit";

beforeEach(() => __resetRateLimitStore());

describe("rateLimit", () => {
  it("allows up to the write limit (30/min) then blocks", () => {
    let last;
    for (let i = 0; i < 30; i++) {
      last = rateLimit("authWrite", "user-1");
      expect(last.success).toBe(true);
    }
    expect(last!.remaining).toBe(0);
    const blocked = rateLimit("authWrite", "user-1");
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("isolates identifiers", () => {
    for (let i = 0; i < 30; i++) rateLimit("authWrite", "a");
    expect(rateLimit("authWrite", "a").success).toBe(false);
    expect(rateLimit("authWrite", "b").success).toBe(true);
  });

  it("public scope is 60/min", () => {
    for (let i = 0; i < 60; i++) {
      expect(rateLimit("public", "1.2.3.4").success).toBe(true);
    }
    expect(rateLimit("public", "1.2.3.4").success).toBe(false);
  });

  it("admin scope is never throttled", () => {
    for (let i = 0; i < 10_000; i++) {
      expect(rateLimit("admin", "admin-1").success).toBe(true);
    }
  });
});
