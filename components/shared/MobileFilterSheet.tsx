"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

/**
 * Collapses a full filter sidebar into a "Filters" trigger + Dialog on
 * screens below `lg`. The caller renders the same filter content twice —
 * once inline (hidden below `lg`) and once as this component's children —
 * since each instance independently reads the same URL search params.
 */
export function MobileFilterSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="size-4" aria-hidden />
        Filters
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-[3px] border-neutral-950 shadow-brutal-md">
          {children}
        </DialogContent>
      </Dialog>
    </div>
  );
}
