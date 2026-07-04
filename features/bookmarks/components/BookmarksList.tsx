"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CompanyCard } from "@/components/shared/CompanyCard";
import { InternshipCard } from "@/components/shared/InternshipCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookmarkButton } from "@/features/bookmarks/components/BookmarkButton";
import type { BookmarkDTO } from "@/types";

export function BookmarksList({ bookmarks }: { bookmarks: BookmarkDTO[] }) {
  const [items, setItems] = useState(bookmarks);

  function remove(id: string) {
    setItems((prev) => prev.filter((b) => b.id !== id));
  }

  const companies = items.filter((b) => b.targetType === "COMPANY" && b.company);
  const internships = items.filter((b) => b.targetType === "INTERNSHIP" && b.internship);

  return (
    <Tabs defaultValue="companies">
      <TabsList>
        <TabsTrigger value="companies">Companies ({companies.length})</TabsTrigger>
        <TabsTrigger value="internships">Internships ({internships.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="companies" className="mt-4">
        {companies.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="Nothing saved yet"
            description="Save companies worth remembering — they'll show up here."
            action={{ label: "Browse companies", href: "/companies" }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((b) => (
              <CompanyCard
                key={b.id}
                company={b.company!}
                bookmarkSlot={
                  <BookmarkButton
                    targetType="COMPANY"
                    targetId={b.company!.id}
                    initialBookmarked
                    onToggle={(bookmarked) => !bookmarked && remove(b.id)}
                  />
                }
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="internships" className="mt-4">
        {internships.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="Nothing saved yet"
            description="Save internships you're considering — they'll show up here."
            action={{ label: "Browse internships", href: "/internships" }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {internships.map((b) => (
              <InternshipCard
                key={b.id}
                internship={b.internship!}
                bookmarkSlot={
                  <BookmarkButton
                    targetType="INTERNSHIP"
                    targetId={b.internship!.id}
                    initialBookmarked
                    onToggle={(bookmarked) => !bookmarked && remove(b.id)}
                  />
                }
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
