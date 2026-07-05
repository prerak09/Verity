"use client";

import { useState } from "react";
import { Plus, X, Link2 } from "lucide-react";

import { addFounder, removeFounder } from "@/features/companies/actions";
import type { FounderDTO } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * PRD §17 groups these as Founders/Co-founders/Hiring Managers/Recruiters,
 * but FounderDTO only has one boolean (isHiringManager) — the schema
 * doesn't distinguish co-founder from founder, or recruiter from hiring
 * manager. Building against the two groups the data actually supports.
 */
export function FoundersEditor({
  companyId,
  initialFounders,
}: {
  companyId: string;
  initialFounders: FounderDTO[];
}) {
  const [founders, setFounders] = useState(initialFounders);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isHiringManager, setIsHiringManager] = useState(false);
  const [pending, setPending] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    if (!name.trim()) return;
    setPending(true);
    setError(null);

    const result = await addFounder(companyId, {
      name,
      title: title || undefined,
      linkedinUrl: linkedinUrl || undefined,
      isHiringManager,
    });

    setPending(false);
    if (result.success) {
      setFounders((prev) => [
        ...prev,
        {
          id: result.data.id,
          name,
          title: title || null,
          linkedinUrl: linkedinUrl || null,
          twitterUrl: null,
          photoUrl: null,
          isHiringManager,
        },
      ]);
      setName("");
      setTitle("");
      setLinkedinUrl("");
      setIsHiringManager(false);
    } else {
      setError(result.error.message);
    }
  }

  async function handleRemove(founderId: string) {
    setRemovingId(founderId);
    setError(null);
    const result = await removeFounder(companyId, founderId);
    setRemovingId(null);

    if (result.success) {
      setFounders((prev) => prev.filter((f) => f.id !== founderId));
    } else {
      setError(result.error.message);
    }
  }

  return (
    <div className="space-y-4">
      {founders.length > 0 && (
        <ul className="space-y-2">
          {founders.map((founder) => (
            <li
              key={founder.id}
              className="flex items-center gap-3 rounded-lg border-[3px] border-neutral-950 bg-card p-3"
            >
              <div
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-md border-[3px] border-neutral-950 bg-muted text-sm font-semibold text-muted-foreground"
              >
                {founder.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-body-sm font-medium text-foreground">
                  {founder.name}
                </p>
                <p className="truncate text-caption text-muted-foreground">
                  {founder.title ?? (founder.isHiringManager ? "Hiring manager" : "Founder")}
                </p>
              </div>
              {founder.linkedinUrl && (
                <Link2 className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={removingId === founder.id}
                onClick={() => handleRemove(founder.id)}
                aria-label={`Remove ${founder.name}`}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-lg border-[3px] border-neutral-950-subtle p-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <label className="text-caption text-muted-foreground">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-caption text-muted-foreground">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Co-founder & CEO"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-caption text-muted-foreground">LinkedIn URL</label>
            <Input
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/…"
            />
          </div>
        </div>
        <label className="mt-2 flex items-center gap-1.5 text-body-sm text-foreground">
          <input
            type="checkbox"
            checked={isHiringManager}
            onChange={(e) => setIsHiringManager(e.target.checked)}
          />
          Hiring manager
        </label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-2"
          onClick={handleAdd}
          disabled={pending}
        >
          <Plus className="size-4" aria-hidden />
          Add
        </Button>
        {error && <p className="mt-1.5 text-caption text-error-fg">{error}</p>}
      </div>
    </div>
  );
}
