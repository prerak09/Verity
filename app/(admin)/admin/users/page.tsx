import type { Metadata } from "next";

import { UserManagement } from "@/features/admin/components/UserManagement";
import { MOCK_ADMIN_USERS } from "@/features/admin/mock-users";

export const metadata: Metadata = {
  title: "Users",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Users</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Search accounts, change roles, disable/reinstate.
      </p>
      <div className="mt-6">
        <UserManagement initialUsers={MOCK_ADMIN_USERS} initialQuery={q ?? ""} />
      </div>
    </div>
  );
}
