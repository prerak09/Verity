import { test, expect } from "@playwright/test";

/**
 * TRD §20 happy path: sign-up → search → view profile → bookmark → add to
 * tracker → update status.
 *
 * "Sign-up" itself isn't driven here — it's Clerk's own hosted UI, which
 * needs real Clerk credentials to render (a placeholder publishable key
 * 500s on every request, see middleware.ts's MOCK_AUTH comment). This suite
 * runs against MOCK_AUTH=true / MOCK_AUTH_ROLE=STUDENT instead (playwright.
 * config.ts's webServer), which is this repo's own established stand-in for
 * "signed in as a student" everywhere else in local dev — the same
 * substitution every other page in this codebase relies on. Once a real
 * Clerk test instance exists, add a first step that drives the actual
 * sign-up form and drop the MOCK_AUTH env override.
 */
test("search → view internship → bookmark → add to tracker → update status", async ({ page }) => {
  // 1. Search from the global nav, available on the authenticated student
  // portal (PortalShell's NavSearch) — the marketing navbar has no search box.
  await page.goto("/dashboard");
  const searchInput = page.getByRole("combobox", { name: "Search companies" });
  await searchInput.fill("Data Engineering Intern");
  await expect(page.getByRole("option", { name: /Data Engineering Intern/i })).toBeVisible();
  await page.getByRole("option", { name: /Data Engineering Intern/i }).click();

  // 2. Land on the internship's public profile.
  await expect(page.getByRole("heading", { name: "Data Engineering Intern" })).toBeVisible();

  // 3. Bookmark it. Both buttons update optimistically before the Server
  // Action resolves, so wait for its toast (success or revert-with-error)
  // rather than asserting on the transient optimistic state.
  await page.getByRole("button", { name: "Bookmark" }).click();
  await expect(page.locator("[data-sonner-toast]")).toBeVisible();
  await expect(page.getByRole("button", { name: "Remove bookmark" })).toBeVisible();

  // 4. Add it to the personal application tracker (FR-25: Apply itself is
  // an external-only deep link, so this is the separate self-tracking step).
  await page.getByRole("button", { name: "Add to tracker" }).click();
  await expect(page.locator("[data-sonner-toast]")).toBeVisible();
  await expect(page.getByRole("button", { name: "In your tracker" })).toBeVisible();

  // 5. Find it in the tracker and move it from Saved to Applied.
  await page.goto("/applications");
  await page.getByRole("button", { name: "List view" }).click();

  const row = page.locator("div", { hasText: "Data Engineering Intern" }).last();
  await row.getByRole("combobox", { name: "Application status" }).click();
  await page.getByRole("option", { name: "Applied" }).click();
  await expect(row.getByRole("combobox", { name: "Application status" })).toHaveText("Applied");
});
