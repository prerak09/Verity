// scripts/remove-old-internships.ts — one-off cleanup: permanently delete
// Internship rows published before a cutoff date.
//
// Dry-run by default (prints what would be deleted, changes nothing).
// Pass --confirm to actually delete.
//
// Usage (run against production with DATABASE_URL set):
//   npx tsx scripts/remove-old-internships.ts            # dry run
//   npx tsx scripts/remove-old-internships.ts --confirm   # actually delete
//
// Internships with existing student bookmarks/applications are flagged in
// the dry run. Since Bookmark/Application have a required foreign key to
// Internship, deleting these listings also permanently deletes any student
// bookmark/application data attached to them — there is no way to keep the
// listing gone but the bookmark intact.

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const CUTOFF = new Date("2026-07-15T00:00:00.000Z");
const CONFIRM = process.argv.includes("--confirm");

async function main() {
  const matches = await db.internship.findMany({
    where: { publishedAt: { lt: CUTOFF } },
    select: {
      id: true,
      title: true,
      publishedAt: true,
      company: { select: { name: true } },
      _count: { select: { bookmarks: true, applications: true } },
    },
    orderBy: { publishedAt: "asc" },
  });

  if (matches.length === 0) {
    console.log(`No internships published before ${CUTOFF.toISOString()}. Nothing to do.`);
    return;
  }

  const withDependents = matches.filter(
    (m) => m._count.bookmarks > 0 || m._count.applications > 0,
  );

  console.log(`Found ${matches.length} internship(s) published before ${CUTOFF.toISOString()}:\n`);
  for (const m of matches) {
    const flags: string[] = [];
    if (m._count.bookmarks > 0) flags.push(`${m._count.bookmarks} bookmark(s)`);
    if (m._count.applications > 0) flags.push(`${m._count.applications} application(s)`);
    const date = m.publishedAt ? m.publishedAt.toISOString().slice(0, 10) : "unknown";
    console.log(
      `  - [${date}] ${m.company.name} — ${m.title}${flags.length ? `  ⚠ ${flags.join(", ")}` : ""}`,
    );
  }

  if (withDependents.length > 0) {
    console.log(
      `\n⚠ ${withDependents.length} of these have student bookmarks and/or applications attached.\n` +
        `  Deleting them will also permanently delete that student data — there's no way to\n` +
        `  remove the listing but keep the bookmark, since it references the listing directly.`,
    );
  }

  if (!CONFIRM) {
    console.log(
      `\nDry run only — nothing deleted. Re-run with --confirm to permanently delete these ${matches.length} listing(s).`,
    );
    return;
  }

  const ids = matches.map((m) => m.id);
  const result = await db.$transaction(async (tx) => {
    await tx.application.deleteMany({ where: { internshipId: { in: ids } } });
    await tx.bookmark.deleteMany({ where: { internshipId: { in: ids } } });
    return tx.internship.deleteMany({ where: { id: { in: ids } } });
  });

  console.log(`\nDeleted ${result.count} internship(s) (and any dependent bookmarks/applications).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
