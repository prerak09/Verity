"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { registerCompany } from "@/features/companies/actions";
import type { FieldErrors } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/lib/utils";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Field({
  label,
  htmlFor,
  error,
  helper,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string[];
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-body-sm font-medium text-foreground">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {helper && !error && (
        <p className="mt-1 text-caption text-muted-foreground">{helper}</p>
      )}
      {error && (
        <p role="alert" className="mt-1 text-caption text-error-fg">
          {error[0]}
        </p>
      )}
    </div>
  );
}

const STEPS = ["Company basics", "Tagline & review"] as const;

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState<{ slug: string } | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function goToReview() {
    if (!name.trim() || !websiteUrl.trim()) {
      setFieldErrors({
        ...(name.trim() ? {} : { name: ["Company name is required."] }),
        ...(websiteUrl.trim() ? {} : { websiteUrl: ["Website URL is required."] }),
      });
      return;
    }
    setFieldErrors({});
    setStep(1);
  }

  async function handleSubmit() {
    setPending(true);
    setFieldErrors({});

    // Real Server Action (features/companies/actions.ts) — same
    // graceful-degradation pattern as the rest of Phase 3.
    const result = await registerCompany({ name, slug, websiteUrl, tagline });

    setPending(false);

    if (result.success) {
      setSubmitted({ slug: result.data.slug });
    } else {
      if (result.error.fieldErrors) {
        setFieldErrors(result.error.fieldErrors);
        setStep(0);
      }
      toast.error(result.error.message);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-[4px] border-2 border-success-border bg-success-bg shadow-brutal-sm">
          <CheckCircle2 className="size-7 text-success-fg" strokeWidth={1.75} aria-hidden />
        </div>
        <h2 className="mt-4 font-display font-display text-xl font-bold text-neutral-950">
          Submitted for verification
        </h2>
        <p className="mt-1 max-w-sm text-body-sm text-muted-foreground">
          An Admin will review your domain and details, usually within a
          couple of business days. You can keep building your profile in
          the meantime.
        </p>
        <Button className="mt-6" render={<Link href="/company" />}>
          Go to company dashboard
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full border-2 text-caption font-bold",
                i <= step
                  ? "border-brand-600 bg-tile-lavender text-brand-800"
                  : "border-border text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "hidden text-body-sm sm:block",
                i === step ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="mx-1 h-px w-8 bg-border" aria-hidden />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-5">
        {step === 0 ? (
          <>
            <Field label="Company name" htmlFor="name" error={fieldErrors.name}>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Ledgerly"
              />
            </Field>
            <Field
              label="Profile URL"
              htmlFor="slug"
              error={fieldErrors.slug}
              helper={slug ? `verity.example.com/companies/${slug}` : undefined}
            >
              <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="Website" htmlFor="websiteUrl" error={fieldErrors.websiteUrl}>
              <Input
                id="websiteUrl"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://…"
              />
            </Field>
            <Button onClick={goToReview}>Continue</Button>
          </>
        ) : (
          <>
            <Field label="Tagline" htmlFor="tagline" error={fieldErrors.tagline}>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="One line describing what you do"
                maxLength={160}
              />
            </Field>

            <div className="rounded-lg border-[3px] border-neutral-950 bg-muted p-4">
              <p className="text-overline text-muted-foreground">Review</p>
              <dl className="mt-2 space-y-1 text-body-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd className="text-foreground">{name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Profile URL</dt>
                  <dd className="text-foreground">/companies/{slug}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Website</dt>
                  <dd className="truncate text-foreground">{websiteUrl}</dd>
                </div>
              </dl>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={pending}>
                {pending ? "Submitting…" : "Submit for verification"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
