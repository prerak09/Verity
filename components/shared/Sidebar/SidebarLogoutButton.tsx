"use client";

import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export function SidebarLogoutButton() {
  const router = useRouter();
  const { signOut } = useClerk();

  return (
    <button
      type="button"
      onClick={() => signOut(() => router.push("/"))}
      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
    >
      <LogOut className="size-4" aria-hidden />
      Log out
    </button>
  );
}
