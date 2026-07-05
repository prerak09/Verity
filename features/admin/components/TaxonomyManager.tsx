"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Check, X } from "lucide-react";

import {
  createCategory,
  renameCategory,
  mergeCategories,
  createTechnology,
  mergeTechnologies,
} from "@/features/admin/taxonomy";
import { slugify } from "@/lib/slug";
import type { TaxonomyRef } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function MergeDialog({
  item,
  others,
  onMerge,
}: {
  item: TaxonomyRef;
  others: TaxonomyRef[];
  onMerge: (sourceId: string, targetId: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | undefined>(others[0]?.id);
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    if (!targetId) return;
    setPending(true);
    await onMerge(item.id, targetId);
    setPending(false);
    setOpen(false);
  }

  const target = others.find((o) => o.id === targetId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" size="sm" variant="outline" />}>Merge</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Merge &ldquo;{item.name}&rdquo; into…</DialogTitle>
          <DialogDescription>
            Every company tagged &ldquo;{item.name}&rdquo; gets the target tag instead, then
            &ldquo;{item.name}&rdquo; is deleted. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Select value={targetId} onValueChange={(v) => setTargetId(v ?? undefined)}>
          <SelectTrigger className="w-full">
            <SelectValue>{() => target?.name ?? "Select…"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {others.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
          <Button type="button" variant="destructive" disabled={pending || !targetId} onClick={handleConfirm}>
            Merge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TaxonomyRow({
  item,
  others,
  canRename,
  onRename,
  onMerge,
}: {
  item: TaxonomyRef;
  others: TaxonomyRef[];
  canRename: boolean;
  onRename?: (id: string, name: string) => Promise<void>;
  onMerge: (sourceId: string, targetId: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [pending, setPending] = useState(false);

  async function handleSaveRename() {
    if (!onRename || !name.trim()) return;
    setPending(true);
    await onRename(item.id, name);
    setPending(false);
    setEditing(false);
  }

  return (
    <li className="flex items-center gap-3 rounded-lg border-[3px] border-neutral-950-subtle p-3">
      {editing ? (
        <>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="flex-1" />
          <Button type="button" size="icon-sm" variant="ghost" disabled={pending} onClick={handleSaveRename}>
            <Check className="size-4" aria-hidden />
          </Button>
          <Button type="button" size="icon-sm" variant="ghost" onClick={() => setEditing(false)}>
            <X className="size-4" aria-hidden />
          </Button>
        </>
      ) : (
        <>
          <span className="flex-1 text-body-sm text-foreground">{item.name}</span>
          {canRename && (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label={`Rename ${item.name}`}
              onClick={() => setEditing(true)}
            >
              <Pencil className="size-4" aria-hidden />
            </Button>
          )}
          {others.length > 0 && <MergeDialog item={item} others={others} onMerge={onMerge} />}
        </>
      )}
    </li>
  );
}

function TaxonomySection({
  title,
  initialItems,
  canRename,
  onCreate,
  onRename,
  onMerge,
}: {
  title: string;
  initialItems: TaxonomyRef[];
  canRename: boolean;
  onCreate: (name: string) => Promise<{ id: string } | null>;
  onRename?: (id: string, name: string) => Promise<null | undefined>;
  onMerge: (sourceId: string, targetId: string) => Promise<null | undefined>;
}) {
  const [items, setItems] = useState(initialItems);
  const [newName, setNewName] = useState("");
  const [pending, setPending] = useState(false);

  async function handleCreate() {
    if (!newName.trim()) return;
    setPending(true);
    const result = await onCreate(newName);
    setPending(false);
    if (result) {
      setItems((prev) => [...prev, { id: result.id, slug: slugify(newName), name: newName }]);
      setNewName("");
    }
  }

  async function handleRename(id: string, name: string) {
    const result = await onRename?.(id, name);
    if (result !== undefined) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, name } : i)));
    }
  }

  async function handleMerge(sourceId: string, targetId: string) {
    const result = await onMerge(sourceId, targetId);
    if (result !== undefined) {
      setItems((prev) => prev.filter((i) => i.id !== sourceId));
    }
  }

  return (
    <div className="rounded-[4px] border-[3px] border-neutral-950 bg-card p-5 shadow-brutal-sm">
      <h2 className="text-h4 text-foreground">{title}</h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <TaxonomyRow
            key={item.id}
            item={item}
            others={items.filter((i) => i.id !== item.id)}
            canRename={canRename}
            onRename={onRename ? handleRename : undefined}
            onMerge={handleMerge}
          />
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={`New ${title.toLowerCase().replace(/ies$/, "y").replace(/s$/, "")}…`}
        />
        <Button type="button" size="sm" variant="outline" disabled={pending} onClick={handleCreate}>
          <Plus className="size-4" aria-hidden />
          Add
        </Button>
      </div>
    </div>
  );
}

export function TaxonomyManager({
  initialCategories,
  initialTechnologies,
}: {
  initialCategories: TaxonomyRef[];
  initialTechnologies: TaxonomyRef[];
}) {
  async function handleCreateCategory(name: string) {
    const result = await createCategory({ name, slug: slugify(name) });
    if (result.success) {
      toast.success(`"${name}" added.`);
      return result.data;
    }
    toast.error(result.error.message);
    return null;
  }

  async function handleRenameCategory(id: string, name: string) {
    const result = await renameCategory(id, name);
    if (result.success) {
      toast.success("Renamed.");
      return result.data;
    }
    toast.error(result.error.message);
    return undefined;
  }

  async function handleMergeCategories(sourceId: string, targetId: string) {
    const result = await mergeCategories(sourceId, targetId);
    if (result.success) {
      toast.success("Categories merged.");
      return result.data;
    }
    toast.error(result.error.message);
    return undefined;
  }

  async function handleCreateTechnology(name: string) {
    const result = await createTechnology({ name, slug: slugify(name) });
    if (result.success) {
      toast.success(`"${name}" added.`);
      return result.data;
    }
    toast.error(result.error.message);
    return null;
  }

  async function handleMergeTechnologies(sourceId: string, targetId: string) {
    const result = await mergeTechnologies(sourceId, targetId);
    if (result.success) {
      toast.success("Technologies merged.");
      return result.data;
    }
    toast.error(result.error.message);
    return undefined;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TaxonomySection
        title="Categories"
        initialItems={initialCategories}
        canRename
        onCreate={handleCreateCategory}
        onRename={handleRenameCategory}
        onMerge={handleMergeCategories}
      />
      <TaxonomySection
        title="Technologies"
        initialItems={initialTechnologies}
        canRename={false}
        onCreate={handleCreateTechnology}
        onMerge={handleMergeTechnologies}
      />
    </div>
  );
}
