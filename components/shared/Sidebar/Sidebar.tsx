import { NavItem, type NavItemDef } from "./NavItem";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/components/lib/utils";

export interface NavSection {
  /** Overline group label, e.g. "ACCOUNT". Omit for the primary ungrouped section. */
  label?: string;
  items: NavItemDef[];
}

interface SidebarProps {
  sections: NavSection[];
  /** Rendered in the footer slot, e.g. a user menu — wired once Clerk lands (0.6). */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Per-portal navigation rail (doc §12.6). Same shell, different `sections`
 * per route group — student/company/admin layouts (0.5) each pass their own
 * item list; this component owns only the chrome.
 */
export function Sidebar({ sections, footer, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r-2 border-border bg-muted",
        className,
      )}
    >
      <div className="flex h-16 shrink-0 items-center border-b-2 border-border px-4">
        <Logo />
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {sections.map((section, i) => (
          <div key={section.label ?? i} className="space-y-1">
            {section.label && (
              <>
                {i > 0 && <div className="my-2 border-t border-border-subtle" />}
                <p className="px-3 text-overline text-muted-foreground">
                  {section.label}
                </p>
              </>
            )}
            {section.items.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
        ))}
      </nav>

      {footer && (
        <div className="shrink-0 border-t-2 border-border p-3">{footer}</div>
      )}
    </aside>
  );
}
