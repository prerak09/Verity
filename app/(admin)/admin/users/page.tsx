import type { Metadata } from "next";

import { UserManagement } from "@/features/admin/components/UserManagement";
import { listUsers } from "@/features/admin/users";
import { MOCK_ADMIN_USERS } from "@/features/admin/mock-users";
import type { AdminUserDTO } from "@/types";

export const metadata: Metadata = {
  title: "Users",
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  let users: AdminUserDTO[] = MOCK_ADMIN_USERS;
  try {
    users = await listUsers();
  } catch {
    // DB unreachable — fall back to mock data rather than a hard 500.
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Users</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Search accounts, change roles, disable/reinstate.
      </p>
      <div className="mt-6">
        <UserManagement initialUsers={users} initialQuery={q ?? ""} />
      </div>
    </div>
  );
}
