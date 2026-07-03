-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('COMPANY_VIEW', 'INTERNSHIP_VIEW');

-- NOTE: Prisma auto-generated DROP INDEX/ALTER COLUMN statements for the
-- Unsupported("tsvector") searchVector columns here; removed by hand so this
-- migration does not touch the generated FTS columns/indexes (they are owned by
-- migration 20260703183700_add_search_vectors).

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "resolutionNote" TEXT;

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "type" "AnalyticsEventType" NOT NULL,
    "companyId" TEXT,
    "internshipId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrendingSnapshot" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "windowDays" INTEGER NOT NULL DEFAULT 7,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrendingSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchQueryLog" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "resultCount" INTEGER NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchQueryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "url" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalyticsEvent_type_createdAt_idx" ON "AnalyticsEvent"("type", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_companyId_idx" ON "AnalyticsEvent"("companyId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_internshipId_idx" ON "AnalyticsEvent"("internshipId");

-- CreateIndex
CREATE INDEX "TrendingSnapshot_computedAt_rank_idx" ON "TrendingSnapshot"("computedAt", "rank");

-- CreateIndex
CREATE INDEX "TrendingSnapshot_companyId_idx" ON "TrendingSnapshot"("companyId");

-- CreateIndex
CREATE INDEX "SearchQueryLog_createdAt_idx" ON "SearchQueryLog"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId", "read");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
