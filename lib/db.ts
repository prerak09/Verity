// lib/db.ts — Prisma client singleton (TRD §3, §10).
// Next.js dev hot-reload re-evaluates modules, which would otherwise spawn a new
// PrismaClient (and a new connection pool) on every reload and exhaust Postgres
// connections. We cache one instance on globalThis in non-production.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export default db;
