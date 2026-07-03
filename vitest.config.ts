import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    globals: true,
    include: [
      "features/**/*.test.ts",
      "lib/**/*.test.ts",
      "config/**/*.test.ts",
      "tests/**/*.test.ts",
    ],
  },
});
