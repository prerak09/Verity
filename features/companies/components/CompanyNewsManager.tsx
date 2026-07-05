"use client";

import { useState } from "react";
import { Plus, Link2 } from "lucide-react";

import { addCompanyNews } from "@/features/companies/actions";
import type { CompanyNewsDTO } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PUBLIC_DISPLAY_CAP = 10;

function toDateInputValue(iso: string) {
  return iso.slice(0, 10);
}

/**
 * The `CompanyNews` model only has title/url/publishedAt (no body) — the PRD's
 * "title, body, optional link" isn't backed by a column yet. Building against
 * the fields the schema actually has; requested the addition via CONTRACTS.md
 * CR-9 rather than inventing an input the backend can't accept.
 */
export function CompanyNewsManager({
  companyId,
  initialNews,
}: {
  companyId: string;
  initialNews: CompanyNewsDTO[];
}) {
  const [news, setNews] = useState(
    [...initialNews].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
  );
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [publishedAt, setPublishedAt] = useState(() => toDateInputValue(new Date().toISOString()));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    if (!title.trim() || !publishedAt) return;
    setPending(true);
    setError(null);

    const isoPublishedAt = new Date(publishedAt).toISOString();
    const result = await addCompanyNews(companyId, {
      title,
      url: url || undefined,
      publishedAt: isoPublishedAt,
    });

    setPending(false);
    if (result.success) {
      setNews((prev) =>
        [{ id: result.data.id, title, url: url || null, publishedAt: isoPublishedAt }, ...prev].sort(
          (a, b) => b.publishedAt.localeCompare(a.publishedAt),
        ),
      );
      setTitle("");
      setUrl("");
      setPublishedAt(toDateInputValue(new Date().toISOString()));
    } else {
      setError(result.error.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[4px] border-[3px] border-neutral-950 bg-card p-5 shadow-brutal-sm">
        <h2 className="text-h4 text-foreground">New update</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-body-sm font-medium text-foreground">Title</label>
              <div className="mt-1.5">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="We raised our Series A"
                />
              </div>
            </div>
            <div>
              <label className="text-body-sm font-medium text-foreground">Link (optional)</label>
              <div className="mt-1.5">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>
            <div>
              <label className="text-body-sm font-medium text-foreground">Published</label>
              <div className="mt-1.5">
                <Input
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-3"
          disabled={pending || !title.trim()}
          onClick={handleAdd}
        >
          <Plus className="size-4" aria-hidden />
          Post update
        </Button>
        {error && <p className="mt-1.5 text-caption text-error-fg">{error}</p>}
      </div>

      {news.length === 0 ? (
        <div className="rounded-[4px] border-2 border-dashed border-border-subtle p-8 text-center text-body-sm text-muted-foreground">
          No updates yet. Post your first one to show up on your public profile.
        </div>
      ) : (
        <div className="rounded-[4px] border-[3px] border-neutral-950 bg-card shadow-brutal-sm">
          <ul className="divide-y divide-border-subtle">
            {news.map((item, index) => (
              <li key={item.id} className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-caption text-muted-foreground">
                    {new Date(item.publishedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {index >= PUBLIC_DISPLAY_CAP && " · not shown on public profile"}
                  </p>
                </div>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label={`Open link for ${item.title}`}
                  >
                    <Link2 className="size-4" aria-hidden />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
