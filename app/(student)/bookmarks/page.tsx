import type { Metadata } from "next";

import { BookmarksList } from "@/features/bookmarks/components/BookmarksList";
import { getCurrentUser } from "@/lib/auth";
import { listBookmarks } from "@/features/bookmarks/queries";
import type { BookmarkDTO } from "@/types";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  let bookmarks: BookmarkDTO[] = [];
  try {
    const user = await getCurrentUser();
    if (user) bookmarks = await listBookmarks(user.id);
  } catch {
    // ignore — render empty
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Bookmarks</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Companies and internships you&apos;ve saved.
      </p>
      <div className="mt-6">
        <BookmarksList bookmarks={bookmarks} />
      </div>
    </div>
  );
}
