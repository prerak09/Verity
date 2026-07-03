-- Admin moderation + featured-window fields.
-- (Prisma auto-generated DROP INDEX / ALTER COLUMN "searchVector" DROP DEFAULT
--  statements for the Unsupported tsvector columns; removed by hand so this
--  migration does not touch the generated FTS columns/indexes — see
--  20260703183700_add_search_vectors.)

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "featuredUntil" TIMESTAMP(3),
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "suspendedAt" TIMESTAMP(3);
