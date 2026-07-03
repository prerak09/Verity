// lib/logger.ts — structured logging (TRD §16).
//
// V1 logs structured JSON to stdout (Vercel captures it). Every error path carries
// a `requestId` so a 500's envelope can be correlated to its stack in the logs.

import { randomUUID } from "node:crypto";

type Level = "debug" | "info" | "warn" | "error";
type Fields = Record<string, unknown>;

const LEVEL_ORDER: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const MIN_LEVEL: Level =
  (process.env.LOG_LEVEL as Level) ??
  (process.env.NODE_ENV === "production" ? "info" : "debug");

function emit(level: Level, message: string, fields?: Fields) {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[MIN_LEVEL]) return;
  const entry = {
    level,
    message,
    time: new Date().toISOString(),
    ...fields,
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (message: string, fields?: Fields) => emit("debug", message, fields),
  info: (message: string, fields?: Fields) => emit("info", message, fields),
  warn: (message: string, fields?: Fields) => emit("warn", message, fields),
  error: (message: string, fields?: Fields) => emit("error", message, fields),
  /** Bind a set of fields (e.g. { requestId, userId }) to every subsequent log. */
  child(bound: Fields) {
    return {
      debug: (m: string, f?: Fields) => emit("debug", m, { ...bound, ...f }),
      info: (m: string, f?: Fields) => emit("info", m, { ...bound, ...f }),
      warn: (m: string, f?: Fields) => emit("warn", m, { ...bound, ...f }),
      error: (m: string, f?: Fields) => emit("error", m, { ...bound, ...f }),
    };
  },
};

/** Correlation id attached to INTERNAL_ERROR envelopes (TRD §9.3). */
export function newRequestId(): string {
  return `req_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

export default logger;
