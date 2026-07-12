"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";

import { createInternship, updateInternship } from "@/features/internships/actions";
import type { FieldErrors, InternshipDetail, InternshipInput, JobType, RemotePolicy, Season } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const REMOTE_POLICIES: { value: RemotePolicy; label: string }[] = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "Onsite" },
];

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
];

const SEASONS: { value: Season; label: string }[] = [
  { value: "SUMMER", label: "Summer" },
  { value: "FALL", label: "Fall" },
  { value: "SPRING", label: "Spring" },
  { value: "WINTER", label: "Winter" },
  { value: "YEAR_ROUND", label: "Year-round" },
];

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-body-sm font-medium text-foreground">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p role="alert" className="mt-1 text-caption text-error-fg">
          {error[0]}
        </p>
      )}
    </div>
  );
}

/** Empty draft used for both "create" (no `internship`) and "edit" (prefilled). */
function toFormState(internship?: InternshipDetail) {
  return {
    title: internship?.title ?? "",
    description: internship?.description ?? "",
    location: internship?.location ?? "",
    department: internship?.department ?? "",
    jobType: internship?.jobType ?? undefined,
    season: internship?.season ?? undefined,
    remotePolicy: internship?.remotePolicy ?? undefined,
    stipend: internship?.stipend ?? "",
    duration: internship?.duration ?? "",
    applyUrl: internship?.applyUrl ?? "",
  };
}

export function InternshipFormDialog({
  companyId,
  internship,
  onCreated,
  onUpdated,
}: {
  companyId: string;
  /** Present → edit an existing listing; absent → create a new (DRAFT) one. */
  internship?: InternshipDetail;
  onCreated?: (input: InternshipInput, result: { id: string; slug: string }) => void;
  onUpdated?: (result: InternshipDetail) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => toFormState(internship));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  function reset() {
    setForm(toFormState(internship));
    setFieldErrors({});
  }

  async function handleSubmit() {
    setPending(true);
    setFieldErrors({});

    const input: InternshipInput = {
      title: form.title,
      description: form.description,
      location: form.location || undefined,
      department: form.department || undefined,
      jobType: form.jobType,
      // Season only applies to internships; clear it for other job types.
      season: form.jobType === "INTERNSHIP" ? form.season : undefined,
      remotePolicy: form.remotePolicy,
      stipend: form.stipend || undefined,
      duration: form.duration || undefined,
      applyUrl: form.applyUrl,
    };

    const result = internship
      ? await updateInternship(internship.id, input)
      : await createInternship(companyId, input);

    setPending(false);

    if (result.success) {
      toast.success(internship ? "Listing updated." : "Listing created as a draft.");
      if (internship) {
        onUpdated?.(result.data as InternshipDetail);
      } else {
        onCreated?.(input, result.data as { id: string; slug: string });
      }
      setOpen(false);
    } else {
      if (result.error.fieldErrors) setFieldErrors(result.error.fieldErrors);
      toast.error(result.error.message);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button type="button" size={internship ? "icon-sm" : "sm"} variant={internship ? "ghost" : "outline"} />
        }
      >
        {internship ? (
          <>
            <Pencil className="size-4" aria-hidden />
            <span className="sr-only">Edit {internship.title}</span>
          </>
        ) : (
          <>
            <Plus className="size-4" aria-hidden />
            New internship
          </>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{internship ? "Edit internship" : "New internship"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Field label="Title" htmlFor="title" error={fieldErrors.title}>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </Field>
          <Field label="Description" htmlFor="description" error={fieldErrors.description}>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Location" htmlFor="location" error={fieldErrors.location}>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              />
            </Field>
            <Field label="Remote policy" htmlFor="remotePolicy" error={fieldErrors.remotePolicy}>
              <Select
                value={form.remotePolicy}
                onValueChange={(v) => setForm((f) => ({ ...f, remotePolicy: v as RemotePolicy }))}
              >
                <SelectTrigger id="remotePolicy" className="w-full">
                  <SelectValue>
                    {(v: RemotePolicy) =>
                      REMOTE_POLICIES.find((r) => r.value === v)?.label ?? "Select…"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {REMOTE_POLICIES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Department" htmlFor="department" error={fieldErrors.department}>
              <Input
                id="department"
                placeholder="Engineering"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              />
            </Field>
            <Field label="Job type" htmlFor="jobType" error={fieldErrors.jobType}>
              <Select
                value={form.jobType}
                onValueChange={(v) => setForm((f) => ({ ...f, jobType: v as JobType }))}
              >
                <SelectTrigger id="jobType" className="w-full">
                  <SelectValue>
                    {(v: JobType) =>
                      JOB_TYPES.find((j) => j.value === v)?.label ?? "Select…"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((j) => (
                    <SelectItem key={j.value} value={j.value}>
                      {j.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          {form.jobType === "INTERNSHIP" && (
            <Field label="Season" htmlFor="season" error={fieldErrors.season}>
              <Select
                value={form.season}
                onValueChange={(v) => setForm((f) => ({ ...f, season: v as Season }))}
              >
                <SelectTrigger id="season" className="w-full">
                  <SelectValue>
                    {(v: Season) => SEASONS.find((s) => s.value === v)?.label ?? "Select…"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SEASONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Stipend" htmlFor="stipend" error={fieldErrors.stipend}>
              <Input
                id="stipend"
                placeholder="$3,000/mo"
                value={form.stipend}
                onChange={(e) => setForm((f) => ({ ...f, stipend: e.target.value }))}
              />
            </Field>
            <Field label="Duration" htmlFor="duration" error={fieldErrors.duration}>
              <Input
                id="duration"
                placeholder="12 weeks (Summer)"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
              />
            </Field>
          </div>
          <Field label="Apply URL" htmlFor="applyUrl" error={fieldErrors.applyUrl}>
            <Input
              id="applyUrl"
              placeholder="https://example.com/careers/…"
              value={form.applyUrl}
              onChange={(e) => setForm((f) => ({ ...f, applyUrl: e.target.value }))}
            />
          </Field>
        </div>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={pending}>
            {internship ? "Save changes" : "Create draft"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
