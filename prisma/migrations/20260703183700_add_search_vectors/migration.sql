-- Full-text search: tsvector generated STORED columns + GIN indexes (TRD §10.4).
-- These columns are declared in schema.prisma as Unsupported("tsvector") so the
-- client is schema-aware, but Prisma does not manage their definition — this
-- migration owns it. Weighting A>B>C ranks name matches above buried text.

ALTER TABLE "Company" ADD COLUMN "searchVector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("name", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("tagline", '')), 'B') ||
    setweight(to_tsvector('english', coalesce("about", '')), 'C')
  ) STORED;

CREATE INDEX "company_search_idx" ON "Company" USING GIN ("searchVector");

ALTER TABLE "Internship" ADD COLUMN "searchVector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("description", '')), 'B')
  ) STORED;

CREATE INDEX "internship_search_idx" ON "Internship" USING GIN ("searchVector");
