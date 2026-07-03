// lib/action.ts — action/route boundary helpers (TRD §9.3, §21).
//
// Every Server Action wraps its body in `handleAction` so thrown AppErrors,
// ZodErrors, and unexpected errors all collapse to the standard Result envelope.
// This keeps each action's happy path clean and guarantees a uniform error shape.

import { ZodError, type ZodType } from "zod";
import {
  AppError,
  ValidationError,
  ok,
  err,
  type Result,
  type FieldErrors,
} from "@/types";
import { logger, newRequestId } from "@/lib/logger";

function zodToFieldErrors(error: ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return fieldErrors;
}

/**
 * Run an action body and map any thrown error to the Result envelope.
 * - ZodError → 400 VALIDATION_ERROR with fieldErrors
 * - AppError (Forbidden/NotFound/Conflict/…) → its code
 * - anything else → 500 INTERNAL_ERROR with a logged requestId
 */
export async function handleAction<T>(
  fn: () => Promise<T>,
): Promise<Result<T>> {
  try {
    return ok(await fn());
  } catch (e) {
    if (e instanceof ZodError) {
      return err({
        code: "VALIDATION_ERROR",
        message: "Validation failed.",
        fieldErrors: zodToFieldErrors(e),
      });
    }
    if (e instanceof AppError) {
      return err({
        code: e.code,
        message: e.message,
        fieldErrors: e.fieldErrors,
      });
    }
    const requestId = newRequestId();
    logger.error("unhandled action error", { requestId, error: String(e) });
    return err({
      code: "INTERNAL_ERROR",
      message: "Something went wrong. Please try again.",
      requestId,
    });
  }
}

/** Parse input with a Zod schema, throwing ValidationError on failure. */
export function parseInput<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Validation failed.", zodToFieldErrors(result.error));
  }
  return result.data;
}
