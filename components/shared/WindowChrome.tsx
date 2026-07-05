import { cn } from "@/components/lib/utils";

/**
 * verity.exe window chrome — the signature retro motif: a titlebar with a
 * filename + minimize/maximize/close controls, wrapping arbitrary content.
 */
export function WindowChrome({
  title = "verity.exe",
  className,
  bodyClassName,
  titlebarClassName,
  children,
}: {
  title?: string;
  className?: string;
  bodyClassName?: string;
  titlebarClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("retro-window", className)}>
      <div className={cn("retro-titlebar", titlebarClassName)}>
        <span className="truncate">{title}</span>
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="retro-winbtn">–</span>
          <span className="retro-winbtn">▢</span>
          <span className="retro-winbtn">✕</span>
        </span>
      </div>
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </div>
  );
}
