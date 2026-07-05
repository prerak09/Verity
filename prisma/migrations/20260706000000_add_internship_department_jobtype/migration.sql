-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');

-- AlterTable
ALTER TABLE "Internship" ADD COLUMN     "department" TEXT,
ADD COLUMN     "jobType" "JobType";
