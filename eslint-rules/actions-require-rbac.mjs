// Custom ESLint rule (TRD §20, task 5.5):
// Any features/*/actions.ts that imports the Prisma client (@/lib/db or
// @prisma/client) MUST also import from @/lib/rbac — enforcing server-side RBAC
// on every mutation module (NFR 13.4). Fails the build otherwise.

const RBAC_SOURCES = new Set(["@/lib/rbac"]);
const DB_SOURCES = new Set(["@/lib/db", "@prisma/client"]);

/** @type {import("eslint").Rule.RuleModule} */
export const actionsRequireRbac = {
  meta: {
    type: "problem",
    docs: {
      description:
        "features/*/actions.ts importing the Prisma client must import lib/rbac",
    },
    schema: [],
    messages: {
      missingRbac:
        "This actions.ts imports the Prisma client but does not import '@/lib/rbac'. Every mutation module must enforce RBAC (NFR 13.4, TRD §7.4).",
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    const normalized = filename.replaceAll("\\", "/");
    // Only applies to feature action modules.
    if (!/\/features\/[^/]+\/actions\.ts$/.test(normalized)) return {};

    let importsDb = false;
    let importsRbac = false;
    let firstDbNode = null;

    return {
      ImportDeclaration(node) {
        const src = node.source.value;
        if (DB_SOURCES.has(src)) {
          importsDb = true;
          firstDbNode ??= node;
        }
        if (RBAC_SOURCES.has(src)) importsRbac = true;
      },
      "Program:exit"() {
        if (importsDb && !importsRbac) {
          context.report({ node: firstDbNode, messageId: "missingRbac" });
        }
      },
    };
  },
};

const plugin = { rules: { "actions-require-rbac": actionsRequireRbac } };
export default plugin;
