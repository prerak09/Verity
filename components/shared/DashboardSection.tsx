import Link from "next/link";

/** Repeats across every dashboard module (student/company/admin) — title + optional "View all". */
export function DashboardSection({
  title,
  viewAllHref,
  children,
}: {
  title: string;
  viewAllHref?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-neutral-950">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="font-mono text-sm font-bold text-primary hover:underline underline-offset-4"
          >
            View all →
          </Link>
        )}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}
