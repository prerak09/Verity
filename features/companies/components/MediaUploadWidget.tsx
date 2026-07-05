"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import { updateCompany } from "@/features/companies/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";

/**
 * Simulates the signed-upload round trip (CONTRACTS.md CR-8 — no Server
 * Action exists yet to request a Cloudinary signature). Persisting the
 * resulting URL uses the real updateCompany action; only the upload
 * itself is mocked.
 */
function simulateCloudinaryUpload(file: File): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(URL.createObjectURL(file)), 1200);
  });
}

const ACCEPTED = "image/png,image/jpeg,image/webp";

export function MediaUploadWidget({
  companyId,
  field,
  label,
  currentUrl,
  shape = "square",
}: {
  companyId: string;
  field: "logoUrl" | "bannerUrl";
  label: string;
  currentUrl: string | null;
  shape?: "square" | "wide";
}) {
  const [previewUrl, setPreviewUrl] = useState(currentUrl);
  const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    const uploadedUrl = await simulateCloudinaryUpload(file);
    setPreviewUrl(uploadedUrl);

    setStatus("saving");
    // Real Server Action — the actual persistence isn't mocked, only the
    // upload above is (see CR-8).
    const result = await updateCompany(companyId, { [field]: uploadedUrl });
    setStatus("idle");

    if (!result.success) {
      toast.error(result.error.message);
    }
  }

  return (
    <div>
      <p className="text-body-sm font-medium text-foreground">{label}</p>
      <div className="mt-1.5 flex items-center gap-4">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center overflow-hidden rounded-lg border-[3px] border-neutral-950 bg-muted",
            shape === "square" ? "size-20" : "h-20 w-40",
          )}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt=""
              width={shape === "square" ? 80 : 160}
              height={80}
              className="size-full object-cover"
              unoptimized={previewUrl.startsWith("blob:")}
            />
          ) : (
            <Upload className="size-6 text-muted-foreground" strokeWidth={1.5} aria-hidden />
          )}
        </div>

        <div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={status !== "idle"}
            onClick={() => inputRef.current?.click()}
          >
            {status === "uploading"
              ? "Uploading…"
              : status === "saving"
                ? "Saving…"
                : previewUrl
                  ? "Replace"
                  : "Upload"}
          </Button>
          <p className="mt-1.5 text-caption text-muted-foreground">
            PNG, JPG, or WebP
          </p>
        </div>
      </div>
    </div>
  );
}
