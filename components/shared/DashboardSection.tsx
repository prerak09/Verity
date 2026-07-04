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
        <h2 className="text-h3 text-foreground">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-body-sm font-medium text-foreground hover:underline"
          >
            View all
          </Link>
        )}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}
