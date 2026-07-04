"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import {
  updateCompany,
  addCompanyLink,
  addCompanyLocation,
} from "@/features/companies/actions";
import type {
  CompanyDetail,
  FieldErrors,
  FundingStage,
  RemotePolicy,
  TaxonomyRef,
} from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MediaUploadWidget } from "@/features/companies/components/MediaUploadWidget";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/components/lib/utils";

const FUNDING_STAGES: { value: FundingStage; label: string }[] = [
  { value: "BOOTSTRAPPED", label: "Bootstrapped" },
  { value: "PRE_SEED", label: "Pre-seed" },
  { value: "SEED", label: "Seed" },
  { value: "SERIES_A", label: "Series A" },
  { value: "SERIES_B", label: "Series B" },
  { value: "SERIES_C_PLUS", label: "Series C+" },
  { value: "PUBLIC", label: "Public" },
];
const REMOTE_POLICIES: { value: RemotePolicy; label: string }[] = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "Onsite" },
];
const EMPLOYEE_RANGES = ["1-10", "11-50", "51-200", "201-500", "500+"];
const AUTOSAVE_DELAY = 1000;

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

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border-2 border-border bg-card p-5 shadow-brutal-sm">
      <h2 className="text-h4 text-foreground">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

type SaveState = "idle" | "saving" | "saved" | "error";

export function ProfileEditor({
  company,
  categories,
  technologies,
}: {
  company: CompanyDetail;
  categories: TaxonomyRef[];
  technologies: TaxonomyRef[];
}) {
  const [name, setName] = useState(company.name);
  const [tagline, setTagline] = useState(company.tagline ?? "");
  const [about, setAbout] = useState(company.about ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(company.websiteUrl ?? "");
  const [fundingStage, setFundingStage] = useState<FundingStage | undefined>(
    company.fundingStage ?? undefined,
  );
  const [remotePolicy, setRemotePolicy] = useState<RemotePolicy | undefined>(
    company.remotePolicy ?? undefined,
  );
  const [employeeCountRange, setEmployeeCountRange] = useState(
    company.employeeCountRange ?? "",
  );
  const [visaSponsorship, setVisaSponsorship] = useState(company.visaSponsorship);
  const [categoryIds, setCategoryIds] = useState(company.categories.map((c) => c.id));
  const [technologyIds, setTechnologyIds] = useState(
    company.technologies.map((t) => t.id),
  );

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const firstRender = useRef(true);

  // Autosave: debounce any scalar/taxonomy field change into a single
  // updateCompany call. Skips the mount render so opening the page doesn't
  // immediately "save" the values it just loaded.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setSaveState("saving");
    const timeout = setTimeout(async () => {
      const result = await updateCompany(company.id, {
        name,
        tagline,
        about,
        websiteUrl,
        fundingStage,
        remotePolicy,
        employeeCountRange: employeeCountRange || undefined,
        visaSponsorship,
        categoryIds,
        technologyIds,
      });

      if (result.success) {
        setSaveState("saved");
        setSavedAt(new Date());
        setFieldErrors({});
      } else {
        setSaveState("error");
        setFieldErrors(result.error.fieldErrors ?? {});
        toast.error(result.error.message);
      }
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    name,
    tagline,
    about,
    websiteUrl,
    fundingStage,
    remotePolicy,
    employeeCountRange,
    visaSponsorship,
    categoryIds,
    technologyIds,
  ]);

  function toggleCategory(id: string) {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }
  function toggleTechnology(id: string) {
    setTechnologyIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-20 z-10 -mt-2 flex justify-end">
        <span
          className={cn(
            "rounded-md border-2 border-border bg-popover px-3 py-1 text-caption font-medium shadow-brutal-xs",
            saveState === "error" ? "text-error-fg" : "text-muted-foreground",
          )}
        >
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" &&
            savedAt &&
            `Saved at ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
          {saveState === "error" && "Couldn't save — check the fields above"}
          {saveState === "idle" && "All changes saved"}
        </span>
      </div>

      <SectionCard title="Basics">
        <div className="flex flex-wrap gap-6">
          <MediaUploadWidget
            companyId={company.id}
            field="logoUrl"
            label="Logo"
            currentUrl={company.logoUrl}
            shape="square"
          />
          <MediaUploadWidget
            companyId={company.id}
            field="bannerUrl"
            label="Banner"
            currentUrl={company.bannerUrl}
            shape="wide"
          />
        </div>
        <Field label="Company name" htmlFor="name" error={fieldErrors.name}>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Tagline" htmlFor="tagline" error={fieldErrors.tagline}>
          <Input
            id="tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            maxLength={160}
          />
        </Field>
        <Field label="About" htmlFor="about" error={fieldErrors.about}>
          <Textarea
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={5}
          />
        </Field>
        <Field label="Website" htmlFor="websiteUrl" error={fieldErrors.websiteUrl}>
          <Input
            id="websiteUrl"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Classification">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Funding stage" htmlFor="fundingStage">
            <Select
              value={fundingStage}
              onValueChange={(v) => setFundingStage(v as FundingStage)}
            >
              <SelectTrigger id="fundingStage" className="w-full">
                <SelectValue>
                  {(v: FundingStage) =>
                    FUNDING_STAGES.find((f) => f.value === v)?.label ?? "Select…"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {FUNDING_STAGES.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Remote policy" htmlFor="remotePolicy">
            <Select
              value={remotePolicy}
              onValueChange={(v) => setRemotePolicy(v as RemotePolicy)}
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
          <Field label="Employee count" htmlFor="employeeCountRange">
            <Select
              value={employeeCountRange}
              onValueChange={(v) => setEmployeeCountRange(v ?? "")}
            >
              <SelectTrigger id="employeeCountRange" className="w-full">
                <SelectValue>{(v: string) => v || "Select…"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {EMPLOYEE_RANGES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Visa sponsorship" htmlFor="visaSponsorship">
            <Select
              value={visaSponsorship ? "true" : "false"}
              onValueChange={(v) => setVisaSponsorship(v === "true")}
            >
              <SelectTrigger id="visaSponsorship" className="w-full">
                <SelectValue>
                  {(v: string) => (v === "true" ? "Yes" : "No")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Categories">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCategory(c.id)}
              className={cn(
                "rounded-sm border-2 px-2.5 py-1 text-body-sm font-medium",
                categoryIds.includes(c.id)
                  ? "border-border bg-brand-50 text-brand-800"
                  : "border-transparent bg-muted text-foreground hover:border-border",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Tech stack">
        <div className="flex flex-wrap gap-2">
          {technologies.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleTechnology(t.id)}
              className={cn(
                "rounded-sm border-2 px-2.5 py-1 text-body-sm font-medium",
                technologyIds.includes(t.id)
                  ? "border-border bg-brand-50 text-brand-800"
                  : "border-transparent bg-muted text-foreground hover:border-border",
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      </SectionCard>

      <LinksSection companyId={company.id} initialLinks={company.links} />
      <LocationsSection companyId={company.id} initialLocations={company.locations} />
    </div>
  );
}

function LinksSection({
  companyId,
  initialLinks,
}: {
  companyId: string;
  initialLinks: CompanyDetail["links"];
}) {
  const [links, setLinks] = useState(initialLinks);
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    if (!type.trim() || !url.trim()) return;
    setPending(true);
    setError(null);

    const result = await addCompanyLink(companyId, { type, url });

    setPending(false);
    if (result.success) {
      setLinks((prev) => [...prev, { id: result.data.id, type, url }]);
      setType("");
      setUrl("");
    } else {
      setError(result.error.message);
    }
  }

  return (
    <SectionCard title="Links">
      {links.length > 0 && (
        <ul className="space-y-1.5">
          {links.map((link) => (
            <li key={link.id} className="flex items-center gap-2 text-body-sm">
              <span className="capitalize text-muted-foreground">{link.type}</span>
              <span className="truncate text-foreground">{link.url}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-end gap-2">
        <div className="w-32">
          <label className="text-caption text-muted-foreground">Type</label>
          <Input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="linkedin"
          />
        </div>
        <div className="min-w-0 flex-1">
          <label className="text-caption text-muted-foreground">URL</label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
          />
        </div>
        <Button size="sm" variant="outline" onClick={handleAdd} disabled={pending}>
          <Plus className="size-4" aria-hidden />
          Add
        </Button>
      </div>
      {error && <p className="text-caption text-error-fg">{error}</p>}
    </SectionCard>
  );
}

function LocationsSection({
  companyId,
  initialLocations,
}: {
  companyId: string;
  initialLocations: CompanyDetail["locations"];
}) {
  const [locations, setLocations] = useState(initialLocations);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [isHQ, setIsHQ] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    if (!city.trim() || !country.trim()) return;
    setPending(true);
    setError(null);

    const result = await addCompanyLocation(companyId, { city, country, isHQ });

    setPending(false);
    if (result.success) {
      setLocations((prev) => [...prev, { id: result.data.id, city, country, isHQ }]);
      setCity("");
      setCountry("");
      setIsHQ(false);
    } else {
      setError(result.error.message);
    }
  }

  return (
    <SectionCard title="Locations">
      {locations.length > 0 && (
        <ul className="space-y-1.5">
          {locations.map((loc) => (
            <li key={loc.id} className="text-body-sm text-foreground">
              {loc.city}, {loc.country} {loc.isHQ && <span className="text-caption text-muted-foreground">(HQ)</span>}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-end gap-2">
        <div className="w-40">
          <label className="text-caption text-muted-foreground">City</label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="w-32">
          <label className="text-caption text-muted-foreground">Country</label>
          <Input value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        <label className="flex items-center gap-1.5 pb-2 text-body-sm text-foreground">
          <input
            type="checkbox"
            checked={isHQ}
            onChange={(e) => setIsHQ(e.target.checked)}
          />
          HQ
        </label>
        <Button size="sm" variant="outline" onClick={handleAdd} disabled={pending}>
          <Plus className="size-4" aria-hidden />
          Add
        </Button>
      </div>
      {error && <p className="text-caption text-error-fg">{error}</p>}
    </SectionCard>
  );
}
