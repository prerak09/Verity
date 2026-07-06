// types/index.ts — CONTRACT #1 (Dev A owns; additive-only after Phase 0).
//
// Single source of truth for every shared shape between backend and frontend:
//   • the result envelope every action/route returns
//   • error codes + typed AppError subclasses
//   • all DTOs the UI renders
//   • all input/filter types forms submit
//   • the *signatures* of every queries.ts / actions.ts function
//
// Dev B builds every screen against these types (with mock data) and swaps
// mock → real import the moment Dev A ships the function body. Neither blocks.
// Announce in TEAM/CONTRACTS.md before changing anything non-additively.

import type {
  PlatformRole,
  CompanyMemberRole,
  VerificationStatus,
  FundingStage,
  RemotePolicy,
  JobType,
  InternshipStatus,
  ApplicationStatus,
  BookmarkTargetType,
} from "@prisma/client";

// Re-export the Prisma enums so the frontend never imports @prisma/client directly.
export type {
  PlatformRole,
  CompanyMemberRole,
  VerificationStatus,
  FundingStage,
  RemotePolicy,
  JobType,
  InternshipStatus,
  ApplicationStatus,
  BookmarkTargetType,
};

export type { Permission, PermissionScope } from "@/config/roles";

// ─────────────────────────────────────────────────────────────────────────────
// Result envelope (TRD §9.3 / §21) — CONTRACT #4
// ─────────────────────────────────────────────────────────────────────────────

/** Machine-readable error codes (TRD §9.3). */
export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

/** Per-field validation messages, keyed by form field name (from Zod flatten). */
export type FieldErrors = Record<string, string[]>;

export interface AppErrorShape {
  code: ErrorCode;
  message: string;
  /** Present only for VALIDATION_ERROR. */
  fieldErrors?: FieldErrors;
  /** Correlation id for INTERNAL_ERROR log lookup. */
  requestId?: string;
}

/** The discriminated union every Server Action and Route Handler returns. */
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: AppErrorShape };

/** Convenience constructors used by actions.ts (keeps call sites terse). */
export function ok<T>(data: T): Result<T> {
  return { success: true, data };
}
export function err(error: AppErrorShape): Result<never> {
  return { success: false, error };
}

// ─────────────────────────────────────────────────────────────────────────────
// Typed error classes (TRD §21) — thrown internally, caught and mapped to the
// envelope at the action/route boundary.
// ─────────────────────────────────────────────────────────────────────────────

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly fieldErrors?: FieldErrors;
  constructor(
    code: ErrorCode,
    message: string,
    status: number,
    fieldErrors?: FieldErrors,
  ) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed.", fieldErrors?: FieldErrors) {
    super("VALIDATION_ERROR", message, 400, fieldErrors);
  }
}
export class UnauthenticatedError extends AppError {
  constructor(message = "You must be signed in.") {
    super("UNAUTHENTICATED", message, 401);
  }
}
export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to do this.") {
    super("FORBIDDEN", message, 403);
  }
}
export class NotFoundError extends AppError {
  constructor(message = "Not found.") {
    super("NOT_FOUND", message, 404);
  }
}
export class ConflictError extends AppError {
  constructor(message = "That conflicts with an existing record.") {
    super("CONFLICT", message, 409);
  }
}
export class RateLimitedError extends AppError {
  constructor(message = "Too many requests. Please slow down.") {
    super("RATE_LIMITED", message, 429);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination (TRD §9.2) — every list query/endpoint speaks this.
// ─────────────────────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PageMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth / session
// ─────────────────────────────────────────────────────────────────────────────

/** The current authenticated user as resolved server-side (lib/auth.ts). */
export interface CurrentUser {
  id: string; // internal User.id (cuid)
  clerkId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: PlatformRole;
  emailNotificationsEnabled: boolean;
  /** Company memberships (empty for students/admins). */
  memberships: CompanyMembership[];
}

export interface CompanyMembership {
  companyId: string;
  companySlug: string;
  companyName: string;
  role: CompanyMemberRole;
}

/** A row in the company Team Members UI (PRD §14.2). */
export interface TeamMemberDTO {
  id: string; // CompanyMember.id
  userId: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: CompanyMemberRole;
  joinedAt: string; // ISO
}

// ─────────────────────────────────────────────────────────────────────────────
// Company DTOs (PRD §17)
// ─────────────────────────────────────────────────────────────────────────────

/** Compact card for directory/search grids (matches TRD §9.2 list response). */
export interface CompanyCard {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  logoUrl: string | null;
  fundingStage: FundingStage | null;
  remotePolicy: RemotePolicy | null;
  verified: boolean;
  categories: TaxonomyRef[];
  openInternshipCount: number;
  /** "City, Country" of the HQ location — optional, only populated by listCompanies. */
  location?: string | null;
}

export interface TaxonomyRef {
  id: string;
  slug: string;
  name: string;
}

export interface FounderDTO {
  id: string;
  name: string;
  title: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  photoUrl: string | null;
  isHiringManager: boolean;
}

export interface CompanyNewsDTO {
  id: string;
  title: string;
  url: string | null;
  publishedAt: string; // ISO
}

export interface CompanyLinkDTO {
  id: string;
  type: string; // "website" | "twitter" | "linkedin" | "github" | ...
  url: string;
}

export interface CompanyLocationDTO {
  id: string;
  city: string;
  country: string;
  isHQ: boolean;
}

/** Full public profile (PRD §17 modules). */
export interface CompanyDetail {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  about: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  websiteUrl: string | null;
  fundingStage: FundingStage | null;
  remotePolicy: RemotePolicy | null;
  visaSponsorship: boolean;
  employeeCountRange: string | null;
  verified: boolean;
  verificationStatus: VerificationStatus;
  isFeatured: boolean;
  categories: TaxonomyRef[];
  technologies: TaxonomyRef[];
  founders: FounderDTO[];
  news: CompanyNewsDTO[];
  links: CompanyLinkDTO[];
  locations: CompanyLocationDTO[];
  openInternships: InternshipCard[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

/** Profile-completeness signal shown to company owners (PRD §17). */
export interface ProfileCompleteness {
  score: number; // 0–100
  missingRequiredFields: string[];
  canSubmitForVerification: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Internship DTOs (PRD §18)
// ─────────────────────────────────────────────────────────────────────────────

export interface InternshipCard {
  id: string;
  slug: string;
  title: string;
  companyId: string;
  companySlug: string;
  companyName: string;
  companyLogoUrl: string | null;
  location: string | null;
  department: string | null;
  jobType: JobType | null;
  remotePolicy: RemotePolicy | null;
  stipend: string | null;
  status: InternshipStatus;
  publishedAt: string | null; // ISO
  isStale: boolean; // Open + untouched 45d (FR-24)
}

export interface InternshipDetail extends InternshipCard {
  description: string; // sanitized HTML
  duration: string | null;
  applyUrl: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Student DTOs (PRD §14.1)
// ─────────────────────────────────────────────────────────────────────────────

export interface StudentProfileDTO {
  id: string;
  userId: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  college: string | null;
  gradYear: number | null;
  resumeUrl: string | null;
  bio: string | null;
}

export interface BookmarkDTO {
  id: string;
  targetType: BookmarkTargetType;
  createdAt: string;
  company: CompanyCard | null;
  internship: InternshipCard | null;
}

export interface ApplicationDTO {
  id: string;
  internship: InternshipCard;
  status: ApplicationStatus;
  notes: string | null; // PRIVATE — never exposed to company/admin (FR-44, NFR 13.6)
  appliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Search & discovery (PRD §16, TRD §12)
// ─────────────────────────────────────────────────────────────────────────────

/** "EARLY_STAGE"/"WELL_FUNDED" are quick-filter groups; a bare FundingStage is exact. */
export type FundingStageFilter = FundingStage | "EARLY_STAGE" | "WELL_FUNDED";

export interface CompanyFilters extends PaginationParams {
  q?: string;
  category?: string; // slug
  technology?: string; // slug
  location?: string; // country or city, partial match
  fundingStage?: FundingStageFilter;
  remotePolicy?: RemotePolicy;
  visaSponsorship?: boolean;
  hiringNow?: boolean; // has at least one open (PUBLISHED) internship
  sort?: "relevance" | "trending" | "recent" | "name";
}

export interface InternshipFilters extends PaginationParams {
  q?: string;
  category?: string;
  location?: string;
  department?: string;
  jobType?: JobType;
  remotePolicy?: RemotePolicy;
  companySlug?: string;
  sort?: "recent" | "title";
}

export interface SearchResults {
  companies: CompanyCard[];
  internships: InternshipCard[];
  totalCompanies: number;
  totalInternships: number;
}

export interface SearchSuggestion {
  type: "company" | "internship" | "category";
  label: string;
  slug: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Verification / admin / analytics DTOs (PRD §19, §12.6)
// ─────────────────────────────────────────────────────────────────────────────

export interface VerificationQueueItem {
  companyId: string;
  companySlug: string;
  companyName: string;
  logoUrl: string | null;
  submittedAt: string;
  priorRejectionReason: string | null; // PRD §23 resubmission cycle
}

export interface ReportDTO {
  id: string;
  reason: string;
  status: "OPEN" | "RESOLVED" | "DISMISSED";
  reportedByEmail: string;
  targetCompany: { id: string; slug: string; name: string } | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface CompanyAnalytics {
  profileViews: { total: number; last30d: number; last90d: number };
  bookmarkCount: { total: number; last30d: number };
  perInternshipViews: { internshipId: string; title: string; views: number }[];
  profileCompleteness: number;
}

export interface PlatformAnalytics {
  studentCount: number;
  companyCounts: Record<VerificationStatus, number>;
  internshipCounts: Record<InternshipStatus, number>;
  signupsByRole: { role: PlatformRole; count: number }[];
  queueThroughput: { avgTimeToDecisionHours: number; backlogSize: number };
  topSearchTerms: { term: string; count: number }[];
  reportVolume: { open: number; resolved: number; avgResolutionHours: number };
}

// ─────────────────────────────────────────────────────────────────────────────
// Notifications (PRD §20, TRD §25)
// ─────────────────────────────────────────────────────────────────────────────

export type NotificationType =
  | "VERIFICATION_APPROVED"
  | "VERIFICATION_REJECTED"
  | "VERIFICATION_CHANGES_REQUESTED"
  | "TEAM_INVITE"
  | "REPORT_RESOLVED"
  | "BOOKMARKED_COMPANY_NEW_INTERNSHIP"
  | "SYSTEM";

export interface NotificationDTO {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  url: string | null;
  read: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutation INPUT types (what forms submit; validated by features/*/schema.ts)
// ─────────────────────────────────────────────────────────────────────────────

export interface RegisterCompanyInput {
  name: string;
  slug: string;
  websiteUrl: string;
  tagline: string;
}

export interface UpdateCompanyInput {
  name?: string;
  tagline?: string;
  about?: string;
  logoUrl?: string;
  bannerUrl?: string;
  websiteUrl?: string;
  fundingStage?: FundingStage;
  remotePolicy?: RemotePolicy;
  visaSponsorship?: boolean;
  employeeCountRange?: string;
  categoryIds?: string[];
  technologyIds?: string[];
}

export interface FounderInput {
  name: string;
  title?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  photoUrl?: string;
  isHiringManager?: boolean;
}

export interface CompanyNewsInput {
  title: string;
  url?: string;
  publishedAt: string; // ISO
}

export interface CompanyLinkInput {
  type: string;
  url: string;
}

export interface CompanyLocationInput {
  city: string;
  country: string;
  isHQ?: boolean;
}

export interface InternshipInput {
  title: string;
  description: string;
  location?: string;
  department?: string;
  jobType?: JobType;
  remotePolicy?: RemotePolicy;
  stipend?: string;
  duration?: string;
  applyUrl: string;
  categoryIds?: string[];
}

export interface StudentProfileInput {
  name?: string;
  college?: string;
  gradYear?: number;
  resumeUrl?: string;
  bio?: string;
}

export interface CreateBookmarkInput {
  targetType: BookmarkTargetType;
  targetId: string;
}

export interface CreateApplicationInput {
  internshipId: string;
  status?: ApplicationStatus;
  notes?: string;
}

export interface UpdateApplicationInput {
  status?: ApplicationStatus;
  notes?: string;
}

export interface VerificationDecisionInput {
  companyId: string;
  reason?: string; // required for reject / request-changes
}

export interface TaxonomyInput {
  name: string;
  slug: string;
}

export interface InviteMemberInput {
  companyId: string;
  email: string;
  role?: CompanyMemberRole;
}

export interface UpdateMemberRoleInput {
  companyId: string;
  memberId: string;
  role: CompanyMemberRole;
}

export interface TransferOwnershipInput {
  companyId: string;
  toMemberId: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION SIGNATURES — the names/shapes Dev B imports. Bodies land per-phase.
// (Declared as type aliases so the contract is checkable before implementation.)
// ─────────────────────────────────────────────────────────────────────────────

// features/companies/queries.ts
export type GetCompanyBySlug = (slug: string) => Promise<CompanyDetail | null>;
export type ListCompanies = (
  filters: CompanyFilters,
) => Promise<Paginated<CompanyCard>>;
export type ListCompanyLocations = () => Promise<string[]>;
export type ListCategories = () => Promise<TaxonomyRef[]>;
export type GetOpenInternships = (
  companyId: string,
) => Promise<InternshipCard[]>;
export type GetProfileCompleteness = (
  companyId: string,
) => Promise<ProfileCompleteness>;

// features/companies/actions.ts
export type RegisterCompany = (
  input: RegisterCompanyInput,
) => Promise<Result<{ id: string; slug: string }>>;
export type UpdateCompany = (
  companyId: string,
  input: UpdateCompanyInput,
) => Promise<Result<CompanyDetail>>;
export type SubmitForVerification = (
  companyId: string,
) => Promise<Result<{ status: VerificationStatus }>>;

// features/team/queries.ts + actions.ts (PRD §14.2)
export type ListTeamMembers = (companyId: string) => Promise<TeamMemberDTO[]>;
export type InviteMember = (
  input: InviteMemberInput,
) => Promise<Result<{ memberId: string }>>;
export type UpdateMemberRole = (
  input: UpdateMemberRoleInput,
) => Promise<Result<{ role: CompanyMemberRole }>>;
export type RevokeMember = (input: {
  companyId: string;
  memberId: string;
}) => Promise<Result<null>>;
export type TransferOwnership = (
  input: TransferOwnershipInput,
) => Promise<Result<null>>;

// features/internships/queries.ts
export type GetInternshipBySlug = (
  slug: string,
) => Promise<InternshipDetail | null>;
export type ListInternships = (
  filters: InternshipFilters,
) => Promise<Paginated<InternshipCard>>;
export type ListInternshipLocations = () => Promise<string[]>;
export type ListInternshipDepartments = () => Promise<string[]>;

// features/internships/actions.ts
export type CreateInternship = (
  companyId: string,
  input: InternshipInput,
) => Promise<Result<{ id: string; slug: string }>>;
export type UpdateInternship = (
  internshipId: string,
  input: Partial<InternshipInput>,
) => Promise<Result<InternshipDetail>>;
export type PublishInternship = (
  internshipId: string,
) => Promise<Result<{ status: InternshipStatus }>>;
export type ArchiveInternship = (
  internshipId: string,
) => Promise<Result<{ status: InternshipStatus }>>;

// features/students/queries.ts + actions.ts
export type GetStudentProfile = (
  userId: string,
) => Promise<StudentProfileDTO | null>;
export type UpdateStudentProfile = (
  input: StudentProfileInput,
) => Promise<Result<StudentProfileDTO>>;
export type GetRecommendedCompanies = (
  userId: string,
) => Promise<CompanyCard[]>;
export type GetTrendingCompanies = (limit?: number) => Promise<CompanyCard[]>;

// features/bookmarks/queries.ts + actions.ts
export type ListBookmarks = (
  userId: string,
  targetType?: BookmarkTargetType,
) => Promise<BookmarkDTO[]>;
export type CreateBookmark = (
  input: CreateBookmarkInput,
) => Promise<Result<{ id: string }>>;
export type DeleteBookmark = (bookmarkId: string) => Promise<Result<null>>;
export type ToggleBookmark = (
  input: CreateBookmarkInput,
) => Promise<Result<{ bookmarked: boolean; id: string | null }>>;

// features/applications/queries.ts + actions.ts
export type ListApplications = (userId: string) => Promise<ApplicationDTO[]>;
export type CreateApplication = (
  input: CreateApplicationInput,
) => Promise<Result<ApplicationDTO>>;
export type UpdateApplication = (
  applicationId: string,
  input: UpdateApplicationInput,
) => Promise<Result<ApplicationDTO>>;
export type DeleteApplication = (
  applicationId: string,
) => Promise<Result<null>>;

// lib/search.ts
export type SearchAll = (
  q: string,
  opts?: PaginationParams,
) => Promise<SearchResults>;
export type SuggestSearch = (q: string) => Promise<SearchSuggestion[]>;

// features/verification/queries.ts + actions.ts
export type GetVerificationQueue = () => Promise<VerificationQueueItem[]>;
export type ApproveVerification = (
  input: VerificationDecisionInput,
) => Promise<Result<null>>;
export type RejectVerification = (
  input: VerificationDecisionInput,
) => Promise<Result<null>>;
export type RequestVerificationChanges = (
  input: VerificationDecisionInput,
) => Promise<Result<null>>;

// features/analytics/queries.ts
export type GetCompanyAnalytics = (
  companyId: string,
) => Promise<CompanyAnalytics>;
export type GetPlatformAnalytics = () => Promise<PlatformAnalytics>;

// features/notifications
export type ListNotifications = (userId: string) => Promise<NotificationDTO[]>;
export type MarkNotificationRead = (id: string) => Promise<Result<null>>;
export type MarkAllNotificationsRead = (
  userId: string,
) => Promise<Result<null>>;

// features/settings/actions.ts
export type UpdateEmailNotifications = (
  enabled: boolean,
) => Promise<Result<{ emailNotificationsEnabled: boolean }>>;
