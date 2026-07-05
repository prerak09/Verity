import type { Metadata } from "next";

import { BookmarksList } from "@/features/bookmarks/components/BookmarksList";
import { MOCK_BOOKMARKS } from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export default function BookmarksPage() {
  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Bookmarks</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Companies and internships you&apos;ve saved.
      </p>
      <div className="mt-6">
        <BookmarksList bookmarks={MOCK_BOOKMARKS} />
      </div>
    </div>
  );
}
