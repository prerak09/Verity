-- CreateEnum
CREATE TYPE "Season" AS ENUM ('SUMMER', 'FALL', 'SPRING', 'WINTER', 'YEAR_ROUND');

-- NOTE: Prisma auto-generated DROP INDEX / ALTER COLUMN "searchVector" DROP DEFAULT
-- lines for the Unsupported tsvector columns; removed by hand so this migration
-- does not touch the generated FTS columns/indexes (owned by add_search_vectors).

-- AlterTable
ALTER TABLE "Internship" ADD COLUMN     "season" "Season";

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "degree" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[];
