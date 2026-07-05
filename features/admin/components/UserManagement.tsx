"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, SearchX } from "lucide-react";

import { changeUserRole, disableUser, reinstateUser } from "@/features/admin/users";
import type { AdminUserRow } from "@/features/admin/mock-users";
import type { PlatformRole } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROLE_LABEL: Record<PlatformRole, string> = {
  STUDENT: "Student",
  COMPANY: "Company",
  ADMIN: "Admin",
};

function UserRow({
  user,
  onRoleChanged,
  onDisabledChanged,
}: {
  user: AdminUserRow;
  onRoleChanged: (id: string, role: PlatformRole) => void;
  onDisabledChanged: (id: string, disabled: boolean) => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleRoleChange(role: PlatformRole) {
    setPending(true);
    const result = await changeUserRole({ userId: user.id, role });
    setPending(false);
    if (result.success) {
      toast.success(`${user.name ?? user.email} is now ${ROLE_LABEL[role]}.`);
      onRoleChanged(user.id, role);
    } else {
      toast.error(result.error.message);
    }
  }

  async function handleDisable() {
    setPending(true);
    const result = await disableUser(user.id);
    setPending(false);
    if (result.success) {
      toast.success(`${user.name ?? user.email} disabled.`);
      onDisabledChanged(user.id, true);
    } else {
      toast.error(result.error.message);
    }
  }

  async function handleReinstate() {
    setPending(true);
    const result = await reinstateUser(user.id);
    setPending(false);
    if (result.success) {
      toast.success(`${user.name ?? user.email} reinstated.`);
      onDisabledChanged(user.id, false);
    } else {
      toast.error(result.error.message);
    }
  }

  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">{user.name ?? "—"}</TableCell>
      <TableCell className="text-muted-foreground">{user.email}</TableCell>
      <TableCell>
        <Select value={user.role} onValueChange={(v) => v && handleRoleChange(v as PlatformRole)}>
          <SelectTrigger size="sm" disabled={pending}>
            <SelectValue>{(v: PlatformRole) => ROLE_LABEL[v]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(ROLE_LABEL) as PlatformRole[]).map((r) => (
              <SelectItem key={r} value={r}>
                {ROLE_LABEL[r]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        {user.disabledAt ? <Badge variant="destructive">Disabled</Badge> : <Badge variant="outline">Active</Badge>}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button type="button" size="icon-sm" variant="ghost" disabled={pending} />}
          >
            <MoreHorizontal className="size-4" aria-hidden />
            <span className="sr-only">Actions for {user.name ?? user.email}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user.disabledAt ? (
              <DropdownMenuItem onClick={handleReinstate}>Reinstate</DropdownMenuItem>
            ) : (
              <DropdownMenuItem variant="destructive" onClick={handleDisable}>
                Disable
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function UserManagement({
  initialUsers,
  initialQuery = "",
}: {
  initialUsers: AdminUserRow[];
  initialQuery?: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || (u.name ?? "").toLowerCase().includes(q),
    );
  }, [users, query]);

  function handleRoleChanged(id: string, role: PlatformRole) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  function handleDisabledChanged(id: string, disabled: boolean) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, disabledAt: disabled ? new Date().toISOString() : null } : u)),
    );
  }

  return (
    <div className="space-y-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or email…"
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <EmptyState
                  icon={SearchX}
                  title="No users match"
                  description="Try a different name or email."
                  compact
                />
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onRoleChanged={handleRoleChanged}
                onDisabledChanged={handleDisabledChanged}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
