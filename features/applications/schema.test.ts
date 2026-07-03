import { describe, it, expect } from "vitest";
import { createApplicationSchema, updateApplicationSchema } from "./schema";
import { createBookmarkSchema } from "@/features/bookmarks/schema";

const cuid = "clx0000000000000000000000";

describe("createApplicationSchema", () => {
  it("accepts a valid minimal payload", () => {
    expect(createApplicationSchema.safeParse({ internshipId: cuid }).success).toBe(true);
  });
  it("accepts a valid status + notes", () => {
    const r = createApplicationSchema.safeParse({
      internshipId: cuid,
      status: "APPLIED",
      notes: "Referred by a friend",
    });
    expect(r.success).toBe(true);
  });
  it("rejects an invalid status", () => {
    expect(
      createApplicationSchema.safeParse({ internshipId: cuid, status: "GHOSTED" }).success,
    ).toBe(false);
  });
  it("rejects a non-cuid internshipId", () => {
    expect(createApplicationSchema.safeParse({ internshipId: "123" }).success).toBe(false);
  });
});

describe("updateApplicationSchema", () => {
  it("is partial", () => {
    expect(updateApplicationSchema.safeParse({}).success).toBe(true);
    expect(updateApplicationSchema.safeParse({ status: "OFFER" }).success).toBe(true);
  });
});

describe("createBookmarkSchema", () => {
  it("accepts COMPANY / INTERNSHIP targets", () => {
    expect(createBookmarkSchema.safeParse({ targetType: "COMPANY", targetId: cuid }).success).toBe(true);
    expect(createBookmarkSchema.safeParse({ targetType: "INTERNSHIP", targetId: cuid }).success).toBe(true);
  });
  it("rejects an unknown target type", () => {
    expect(createBookmarkSchema.safeParse({ targetType: "USER", targetId: cuid }).success).toBe(false);
  });
});
