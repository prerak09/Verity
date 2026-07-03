import { describe, it, expect } from "vitest";
import {
  registerCompanySchema,
  updateCompanySchema,
  companyNewsSchema,
} from "./schema";
import { normalizeDomain, slugify } from "@/lib/slug";

describe("registerCompanySchema", () => {
  const valid = {
    name: "Sarvam AI",
    slug: "sarvam-ai",
    websiteUrl: "https://sarvam.ai",
    tagline: "Building AI for India",
  };

  it("accepts a valid payload", () => {
    expect(registerCompanySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a bad slug", () => {
    const r = registerCompanySchema.safeParse({ ...valid, slug: "Not A Slug!" });
    expect(r.success).toBe(false);
  });

  it("rejects a non-http url", () => {
    const r = registerCompanySchema.safeParse({ ...valid, websiteUrl: "ftp://x.io" });
    expect(r.success).toBe(false);
  });

  it("rejects an empty name", () => {
    expect(registerCompanySchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });
});

describe("updateCompanySchema", () => {
  it("is fully partial", () => {
    expect(updateCompanySchema.safeParse({}).success).toBe(true);
    expect(updateCompanySchema.safeParse({ tagline: "New tagline" }).success).toBe(true);
  });
  it("validates enum values", () => {
    expect(updateCompanySchema.safeParse({ fundingStage: "SEED" }).success).toBe(true);
    expect(updateCompanySchema.safeParse({ fundingStage: "MEGA" }).success).toBe(false);
  });
});

describe("companyNewsSchema", () => {
  it("requires an ISO date", () => {
    expect(
      companyNewsSchema.safeParse({ title: "Raised Series A", publishedAt: "2026-01-01T00:00:00.000Z" }).success,
    ).toBe(true);
    expect(companyNewsSchema.safeParse({ title: "x", publishedAt: "yesterday" }).success).toBe(false);
  });
});

describe("normalizeDomain", () => {
  it("strips protocol, www, and path", () => {
    expect(normalizeDomain("https://www.sarvam.ai/careers")).toBe("sarvam.ai");
    expect(normalizeDomain("sarvam.ai")).toBe("sarvam.ai");
    expect(normalizeDomain("HTTP://Razorpay.com")).toBe("razorpay.com");
  });
  it("returns null for garbage", () => {
    expect(normalizeDomain("not a url at all with spaces")).toBe(null);
  });
});

describe("slugify", () => {
  it("produces url-safe slugs", () => {
    expect(slugify("Sarvam AI!")).toBe("sarvam-ai");
    expect(slugify("  Multiple   Spaces  ")).toBe("multiple-spaces");
  });
});
