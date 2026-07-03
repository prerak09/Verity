import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import localRules from "./eslint-rules/actions-require-rbac.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Custom structural rule (TRD §20): actions.ts using Prisma must import RBAC.
  {
    files: ["features/**/actions.ts"],
    plugins: { local: localRules },
    rules: { "local/actions-require-rbac": "error" },
  },
  // Exception: notification mutations are purely self-scoped (own rows via
  // userId WHERE, Layer 3) with no cross-user permission string, so the RBAC
  // permission-matrix check does not apply.
  {
    files: ["features/notifications/actions.ts"],
    rules: { "local/actions-require-rbac": "off" },
  },
]);

export default eslintConfig;
