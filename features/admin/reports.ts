"use server";

// features/admin/reports.ts — content reports (FR-52/53).
// Create: any authenticated user. Queue/resolve: admin (report:handle).

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { assertCan } from "@/lib/rbac";
import { handleAction, parseInput } from "@/lib/action";
import { suspendCompany } from "./companies";
import { z } from "zod";
import { NotFoundError, type ReportDTO, type Result } from "@/types";

const createReportSchema = z.object({
  targetCompanyId: z.string().cuid(),
  reason: z.string().trim().min(4, "Please describe the issue.").max(2_000),
});

export type ResolveAction = "dismiss" | "warn" | "suspend" | "remove";

/** FR-52 — any user reports a company. */
export async function createReport(input: {
  targetCompanyId: string;
  reason: string;
}): Promise<Result<{ id: string }>> {
  return handleAction(async () => {
    const user = await requireUser(); // any authenticated user
    const data = parseInput(createReportSchema, input);
    const company = await db.company.findFirst({
      where: { id: data.targetCompanyId, deletedAt: null },
      select: { id: true },
    });
    if (!company) throw new NotFoundError("Company not found.");

    const report = await db.report.create({
      data: {
        reportedById: user.id,
        targetCompanyId: data.targetCompanyId,
        reason: data.reason,
        status: "OPEN",
      },
      select: { id: true },
    });
    return { id: report.id };
  });
}

/** FR-53 — admin reports queue with company context. */
export async function getReportsQueue(): Promise<ReportDTO[]> {
  const rows = await db.report.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      reportedBy: { select: { email: true } },
      targetCompany: { select: { id: true, slug: true, name: true } },
    },
    take: 200,
  });
  return rows.map((r) => ({
    id: r.id,
    reason: r.reason,
    status: r.status as ReportDTO["status"],
    reportedByEmail: r.reportedBy.email,
    targetCompany: r.targetCompany
      ? { id: r.targetCompany.id, slug: r.targetCompany.slug, name: r.targetCompany.name }
      : null,
    createdAt: r.createdAt.toISOString(),
    resolvedAt: r.resolvedAt ? r.resolvedAt.toISOString() : null,
  }));
}

/**
 * FR-53 — resolve a report. Action drives side effects:
 *   dismiss → close, no action · warn → close, note kept · suspend → suspend
 *   company · remove → soft-delete company. All record an audit note.
 */
export async function resolveReport(
  reportId: string,
  action: ResolveAction,
  note?: string,
): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "report:handle");
    const report = await db.report.findUnique({
      where: { id: reportId },
      select: { id: true, targetCompanyId: true, status: true },
    });
    if (!report) throw new NotFoundError("Report not found.");

    const auditNote = `[${action}] ${note ?? ""}`.trim();

    if (action === "suspend" && report.targetCompanyId) {
      await suspendCompany(report.targetCompanyId);
    }
    if (action === "remove" && report.targetCompanyId) {
      await db.company.update({
        where: { id: report.targetCompanyId },
        data: { deletedAt: new Date() },
      });
    }

    await db.report.update({
      where: { id: reportId },
      data: {
        status: action === "dismiss" ? "DISMISSED" : "RESOLVED",
        resolutionNote: auditNote,
        resolvedAt: new Date(),
      },
    });
    return null;
  });
}
