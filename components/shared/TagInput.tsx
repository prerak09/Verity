"use client";

import { useState } from "react";
import { X } from "lucide-react";

/**
 * Tag input for skills / interests. Type + Enter (or comma) adds a tag; click ×
 * or Backspace removes. Optional `suggestions` render as quick-add chips.
 */
export function TagInput({
  value,
  onChange,
  placeholder,
  suggestions = [],
  max = 30,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  max?: number;
}) {
  const [draft, setDraft] = useState("");

  function add(tag: string) {
    const t = tag.trim();
    if (!t) return;
    if (value.length >= max) return;
    if (value.some((v) => v.toLowerCase() === t.toLowerCase())) return;
    onChange([...value, t]);
    setDraft("");
  }

  function remove(tag: string) {
    onChange(value.filter((v) => v !== tag));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      remove(value[value.length - 1]);
    }
  }

  const available = suggestions.filter(
    (s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-[3px] border-[3px] border-neutral-950 bg-card p-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-[3px] border-2 border-neutral-950 bg-tile-lavender px-2 py-0.5 font-mono text-xs font-bold text-neutral-950"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => remove(tag)}
              className="text-neutral-700 hover:text-neutral-950"
            >
              <X className="size-3" strokeWidth={3} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(draft)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-[8ch] flex-1 bg-transparent font-mono text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
        />
      </div>
      {available.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {available.slice(0, 12).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="rounded-[3px] border-2 border-neutral-400 bg-card px-2 py-0.5 font-mono text-xs text-neutral-700 hover:border-neutral-950 hover:text-neutral-950"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
