"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { Navbar } from "@/components/shared/Navbar";
import { Sidebar, type NavSection } from "@/components/shared/Sidebar/Sidebar";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

interface PortalShellProps {
  sections: NavSection[];
  children: React.ReactNode;
}

/**
 * Composes Navbar + Sidebar for the three authenticated route groups
 * (student/company/admin — doc §12.6/§12.7). Desktop keeps the rail
 * visible; `< md` collapses it behind the hamburger into a slide-over.
 */
export function PortalShell({ sections, children }: PortalShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer on navigation. Adjusted during render (not an
  // effect) per React's "storing information from previous renders" pattern
  // — avoids the extra commit an effect-based reset would cost.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileNavOpen(false);
  }

  return (
    <div className="flex min-h-full flex-col">
      <Navbar onMobileMenuToggle={() => setMobileNavOpen(true)} />
      <div className="flex flex-1">
        <Sidebar sections={sections} className="hidden md:flex" />

        <Dialog open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Popup
              data-slot="mobile-nav-content"
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r-2 border-border bg-muted shadow-brutal-xl outline-none duration-150 data-open:animate-in data-open:slide-in-from-left data-closed:animate-out data-closed:slide-out-to-left"
            >
              <Sidebar sections={sections} className="h-full w-full" />
            </DialogPrimitive.Popup>
          </DialogPortal>
        </Dialog>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
