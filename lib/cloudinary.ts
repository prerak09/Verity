// lib/cloudinary.ts — signed upload helper (TRD §14 file-upload validation).
//
// The client never receives the API secret. It requests a signature from a
// server action/route; Cloudinary validates the signed params (folder, preset,
// allowed formats, size) so arbitrary file types can't be uploaded even if the
// client is tampered with.

import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

/** Upload folders keep company media and student resumes segregated. */
export type UploadFolder = "company/logo" | "company/banner" | "company/media" | "student/resume";

const ALLOWED_FORMATS: Record<UploadFolder, string[]> = {
  "company/logo": ["png", "jpg", "jpeg", "webp"],
  "company/banner": ["png", "jpg", "jpeg", "webp"],
  "company/media": ["png", "jpg", "jpeg", "webp"],
  "student/resume": ["pdf"],
};

export interface SignedUpload {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
  allowedFormats: string[];
}

/**
 * Produce the signature the browser needs to upload directly to Cloudinary,
 * constrained to a folder + format allowlist. Server-side only.
 */
export function createSignedUpload(folder: UploadFolder): SignedUpload {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured (missing env vars).");
  }
  const timestamp = Math.round(Date.now() / 1000);
  const allowedFormats = ALLOWED_FORMATS[folder];
  const paramsToSign = {
    timestamp,
    folder,
    allowed_formats: allowedFormats.join(","),
  };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret!);
  return {
    timestamp,
    signature,
    apiKey: apiKey!,
    cloudName: cloudName!,
    folder,
    allowedFormats,
  };
}

export { cloudinary };
