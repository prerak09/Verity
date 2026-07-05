import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config (TRD §20). Boots the dev server against MOCK_AUTH so the suite
 * doesn't need real Clerk credentials — see tests/e2e/README.md for what
 * that does and doesn't cover.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run dev -- -p 3100",
        url: "http://localhost:3100",
        reuseExistingServer: !process.env.CI,
        env: { MOCK_AUTH: "true", MOCK_AUTH_ROLE: "STUDENT" },
        timeout: 60_000,
      },
});
