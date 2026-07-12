"use client";

import { useState } from "react";
import { toast } from "sonner";

import { updateStudentProfile } from "@/features/students/actions";
import type { StudentProfileDTO, FieldErrors } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/shared/TagInput";

const currentYear = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: 10 }, (_, i) => currentYear - 3 + i);

const SKILL_SUGGESTIONS = [
  "React", "TypeScript", "Python", "Node.js", "SQL", "Java", "Go", "Rust",
  "PyTorch", "TensorFlow", "AWS", "Docker", "Figma", "Next.js",
];
const INTEREST_SUGGESTIONS = [
  "Frontend", "Backend", "Full-stack", "AI / ML", "Data Science", "Fintech",
  "DevTools", "Product", "Design", "Cybersecurity", "Web3", "Healthtech",
];

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string[];
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="font-mono text-sm font-bold text-neutral-950">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 font-mono text-xs text-neutral-500">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 font-mono text-xs text-error-fg">
          {error[0]}
        </p>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="retro-card p-6">
      <h2 className="font-display text-lg font-bold text-neutral-950">{title}</h2>
      <div className="mt-4 space-y-5">{children}</div>
    </div>
  );
}

export function ProfileForm({ profile }: { profile: StudentProfileDTO }) {
  const [name, setName] = useState(profile.name ?? "");
  const [headline, setHeadline] = useState(profile.headline ?? "");
  const [location, setLocation] = useState(profile.location ?? "");
  const [college, setCollege] = useState(profile.college ?? "");
  const [degree, setDegree] = useState(profile.degree ?? "");
  const [major, setMajor] = useState(profile.major ?? "");
  const [gradYear, setGradYear] = useState(profile.gradYear ?? currentYear);
  const [skills, setSkills] = useState<string[]>(profile.skills ?? []);
  const [interests, setInterests] = useState<string[]>(profile.interests ?? []);
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl ?? "");
  const [portfolioUrl, setPortfolioUrl] = useState(profile.portfolioUrl ?? "");
  const [resumeUrl, setResumeUrl] = useState(profile.resumeUrl ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setFieldErrors({});

    const result = await updateStudentProfile({
      name,
      headline: headline || undefined,
      location: location || undefined,
      college: college || undefined,
      degree: degree || undefined,
      major: major || undefined,
      gradYear,
      skills,
      interests,
      linkedinUrl: linkedinUrl || undefined,
      githubUrl: githubUrl || undefined,
      portfolioUrl: portfolioUrl || undefined,
      resumeUrl: resumeUrl || undefined,
      bio: bio || undefined,
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
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Basics */}
      <Section title="Basics">
        <Field label="Full name" htmlFor="name" error={fieldErrors.name}>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
        </Field>
        <Field
          label="Headline"
          htmlFor="headline"
          error={fieldErrors.headline}
          hint="A short line describing you."
        >
          <Input
            id="headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. CS undergrad · aspiring ML engineer"
            maxLength={160}
          />
        </Field>
        <Field label="Location" htmlFor="location" error={fieldErrors.location}>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Bengaluru, India"
            maxLength={120}
          />
        </Field>
      </Section>

      {/* Education */}
      <Section title="Education">
        <Field label="College / University" htmlFor="college" error={fieldErrors.college}>
          <Input
            id="college"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            placeholder="e.g. IIT Delhi"
            maxLength={160}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Degree" htmlFor="degree" error={fieldErrors.degree}>
            <Input
              id="degree"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="e.g. B.Tech"
              maxLength={80}
            />
          </Field>
          <Field label="Major" htmlFor="major" error={fieldErrors.major}>
            <Input
              id="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g. Computer Science"
              maxLength={120}
            />
          </Field>
        </div>
        <Field label="Graduation year" htmlFor="gradYear" error={fieldErrors.gradYear}>
          <select
            id="gradYear"
            value={gradYear}
            onChange={(e) => setGradYear(Number(e.target.value))}
            className="h-11 w-full rounded-[3px] border-[3px] border-neutral-950 bg-card px-3 font-mono text-sm text-neutral-950 outline-none"
          >
            {GRAD_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      {/* Skills & interests */}
      <Section title="Skills & interests">
        <Field
          label="Skills"
          error={fieldErrors.skills}
          hint="Type a skill and press Enter, or pick from suggestions."
        >
          <TagInput
            value={skills}
            onChange={setSkills}
            placeholder="e.g. React, Python…"
            suggestions={SKILL_SUGGESTIONS}
          />
        </Field>
        <Field
          label="Interests"
          error={fieldErrors.interests}
          hint="What kinds of roles or domains are you interested in?"
        >
          <TagInput
            value={interests}
            onChange={setInterests}
            placeholder="e.g. AI/ML, Fintech…"
            suggestions={INTEREST_SUGGESTIONS}
          />
        </Field>
      </Section>

      {/* Links */}
      <Section title="Links">
        <Field label="LinkedIn" htmlFor="linkedinUrl" error={fieldErrors.linkedinUrl}>
          <Input
            id="linkedinUrl"
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/you"
          />
        </Field>
        <Field label="GitHub" htmlFor="githubUrl" error={fieldErrors.githubUrl}>
          <Input
            id="githubUrl"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/you"
          />
        </Field>
        <Field label="Portfolio / website" htmlFor="portfolioUrl" error={fieldErrors.portfolioUrl}>
          <Input
            id="portfolioUrl"
            type="url"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            placeholder="https://your-site.com"
          />
        </Field>
        <Field
          label="Resume"
          htmlFor="resumeUrl"
          error={fieldErrors.resumeUrl}
          hint="Paste a link to a hosted PDF (direct upload coming soon)."
        >
          <Input
            id="resumeUrl"
            type="url"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://…"
          />
        </Field>
      </Section>

      {/* About */}
      <Section title="About you">
        <Field label="Bio" htmlFor="bio" error={fieldErrors.bio}>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="A couple of sentences about what you're looking for."
          />
        </Field>
      </Section>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
