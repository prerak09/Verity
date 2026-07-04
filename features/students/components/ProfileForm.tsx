"use client";

import { useState } from "react";
import { toast } from "sonner";

import { updateStudentProfile } from "@/features/students/actions";
import type { StudentProfileDTO, FieldErrors } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const currentYear = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: 8 }, (_, i) => currentYear - 2 + i);

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

export function ProfileForm({ profile }: { profile: StudentProfileDTO }) {
  const [name, setName] = useState(profile.name ?? "");
  const [college, setCollege] = useState(profile.college ?? "");
  const [gradYear, setGradYear] = useState(profile.gradYear ?? currentYear);
  const [resumeUrl, setResumeUrl] = useState(profile.resumeUrl ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setFieldErrors({});

    // Real Server Action — features/students/actions.ts, gracefully returns
    // { success: false, error } via handleAction() even if the DB isn't
    // reachable in this dev environment, so this is safe to wire live now.
    const result = await updateStudentProfile({
      name,
      college,
      gradYear,
      resumeUrl: resumeUrl || undefined,
      bio,
    });

    setPending(false);

    if (result.success) {
      toast.success("Profile saved");
    } else {
      setFieldErrors(result.error.fieldErrors ?? {});
      toast.error(result.error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <Field label="Name" htmlFor="name" error={fieldErrors.name}>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
        />
      </Field>

      <Field label="School" htmlFor="college" error={fieldErrors.college}>
        <Input
          id="college"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          placeholder="e.g. University of Michigan"
          maxLength={160}
        />
      </Field>

      <Field label="Graduation year" htmlFor="gradYear" error={fieldErrors.gradYear}>
        <select
          id="gradYear"
          value={gradYear}
          onChange={(e) => setGradYear(Number(e.target.value))}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {GRAD_YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Bio" htmlFor="bio" error={fieldErrors.bio}>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="A sentence or two about what you're looking for."
        />
      </Field>

      <Field label="Resume" htmlFor="resumeUrl" error={fieldErrors.resumeUrl}>
        <Input
          id="resumeUrl"
          type="url"
          value={resumeUrl}
          onChange={(e) => setResumeUrl(e.target.value)}
          placeholder="https://…"
        />
        <p className="mt-1.5 text-caption text-muted-foreground">
          Direct upload isn&apos;t available yet — paste a link to a hosted PDF for now.
        </p>
      </Field>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
