"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, UserMinus, Crown } from "lucide-react";

import {
  inviteMember,
  updateMemberRole,
  revokeMember,
  transferOwnership,
} from "@/features/team/actions";
import type { CompanyMemberRole, FieldErrors, TeamMemberDTO } from "@/types";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLE_LABEL: Record<CompanyMemberRole, string> = {
  OWNER: "Owner",
  RECRUITER: "Recruiter",
};

function InviteMemberDialog({
  companyId,
  onInvited,
}: {
  companyId: string;
  onInvited: (member: TeamMemberDTO) => void;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<CompanyMemberRole>("RECRUITER");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  async function handleInvite() {
    setPending(true);
    setFieldErrors({});
    const result = await inviteMember({ companyId, email, role });
    setPending(false);

    if (result.success) {
      toast.success("Team member added.");
      onInvited({
        id: result.data.memberId,
        userId: result.data.memberId,
        name: null,
        email,
        avatarUrl: null,
        role,
        joinedAt: new Date().toISOString(),
      });
      setEmail("");
      setRole("RECRUITER");
      setOpen(false);
    } else {
      if (result.error.fieldErrors) setFieldErrors(result.error.fieldErrors);
      toast.error(result.error.message);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setEmail("");
          setRole("RECRUITER");
          setFieldErrors({});
        }
      }}
    >
      <DialogTrigger render={<Button type="button" size="sm" variant="outline" />}>
        <Plus className="size-4" aria-hidden />
        Invite member
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a team member</DialogTitle>
          <DialogDescription>
            They must already have a Verity account with this email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label htmlFor="invite-email" className="text-body-sm font-medium text-foreground">
              Email
            </label>
            <div className="mt-1.5">
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teammate@company.com"
              />
            </div>
            {fieldErrors.email && (
              <p role="alert" className="mt-1 text-caption text-error-fg">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="invite-role" className="text-body-sm font-medium text-foreground">
              Role
            </label>
            <div className="mt-1.5">
              <Select value={role} onValueChange={(v) => setRole(v as CompanyMemberRole)}>
                <SelectTrigger id="invite-role" className="w-full">
                  <SelectValue>{(v: CompanyMemberRole) => ROLE_LABEL[v]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RECRUITER">Recruiter</SelectItem>
                  <SelectItem value="OWNER">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
          <Button type="button" onClick={handleInvite} disabled={pending || !email.trim()}>
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TransferOwnershipDialog({
  companyId,
  member,
  onTransferred,
}: {
  companyId: string;
  member: TeamMemberDTO;
  onTransferred: (memberId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    const result = await transferOwnership({ companyId, toMemberId: member.id });
    setPending(false);
    if (result.success) {
      toast.success(`Ownership transferred to ${member.name ?? member.email}.`);
      onTransferred(member.id);
      setOpen(false);
    } else {
      toast.error(result.error.message);
    }
  }

  const description = `${member.name ?? member.email} becomes the company owner. You'll be moved to Recruiter. This cannot be undone from here — the new owner would need to transfer it back.`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" size="sm" variant="outline" />}>
        <Crown className="size-4" aria-hidden />
        Make owner
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer ownership?</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
          <Button type="button" variant="destructive" onClick={handleConfirm} disabled={pending}>
            Transfer ownership
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MemberRow({
  companyId,
  member,
  isSelf,
  onRoleChanged,
  onRevoked,
  onTransferred,
}: {
  companyId: string;
  member: TeamMemberDTO;
  isSelf: boolean;
  onRoleChanged: (memberId: string, role: CompanyMemberRole) => void;
  onRevoked: (memberId: string) => void;
  onTransferred: (memberId: string) => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleDemote() {
    setPending(true);
    const result = await updateMemberRole({ companyId, memberId: member.id, role: "RECRUITER" });
    setPending(false);
    if (result.success) {
      onRoleChanged(member.id, result.data.role);
    } else {
      toast.error(result.error.message);
    }
  }

  async function handleRevoke() {
    setPending(true);
    const result = await revokeMember({ companyId, memberId: member.id });
    setPending(false);
    if (result.success) {
      onRevoked(member.id);
    } else {
      toast.error(result.error.message);
    }
  }

  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">
        {member.name ?? member.email}
        {isSelf && <span className="ml-1.5 text-caption text-muted-foreground">(you)</span>}
      </TableCell>
      <TableCell className="text-muted-foreground">{member.email}</TableCell>
      <TableCell>
        <Badge variant={member.role === "OWNER" ? "default" : "outline"}>
          {ROLE_LABEL[member.role]}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1.5">
          {member.role === "RECRUITER" && (
            <TransferOwnershipDialog
              companyId={companyId}
              member={member}
              onTransferred={onTransferred}
            />
          )}
          {member.role === "OWNER" && (
            <Button type="button" size="sm" variant="outline" disabled={pending} onClick={handleDemote}>
              Make recruiter
            </Button>
          )}
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={pending}
            onClick={handleRevoke}
            aria-label={`Remove ${member.name ?? member.email}`}
          >
            <UserMinus className="size-4" aria-hidden />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function TeamMembersManager({
  companyId,
  currentUserId,
  initialMembers,
}: {
  companyId: string;
  currentUserId: string;
  initialMembers: TeamMemberDTO[];
}) {
  const [members, setMembers] = useState(initialMembers);

  function handleInvited(member: TeamMemberDTO) {
    setMembers((prev) => [...prev, member]);
  }

  function handleRoleChanged(memberId: string, role: CompanyMemberRole) {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role } : m)));
  }

  function handleRevoked(memberId: string) {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  function handleTransferred(newOwnerMemberId: string) {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === newOwnerMemberId) return { ...m, role: "OWNER" };
        if (m.userId === currentUserId) return { ...m, role: "RECRUITER" };
        return m;
      }),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-muted-foreground">
          {members.length} member{members.length === 1 ? "" : "s"}
        </p>
        <InviteMemberDialog companyId={companyId} onInvited={handleInvited} />
      </div>

      <div className="rounded-[4px] border-[3px] border-neutral-950 bg-card shadow-brutal-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <MemberRow
                key={member.id}
                companyId={companyId}
                member={member}
                isSelf={member.userId === currentUserId}
                onRoleChanged={handleRoleChanged}
                onRevoked={handleRevoked}
                onTransferred={handleTransferred}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
