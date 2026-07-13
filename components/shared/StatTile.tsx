import { cn } from "@/components/lib/utils";

type TileColor = "pink" | "yellow" | "lavender" | "blue" | "lime" | "mint" | "card";

const TILE_BG: Record<TileColor, string> = {
  pink: "bg-tile-pink",
  yellow: "bg-tile-yellow",
  lavender: "bg-tile-lavender",
  blue: "bg-tile-blue",
  lime: "bg-tile-lime",
  mint: "bg-tile-mint",
  card: "bg-card",
};

/**
 * Pastel stat tile — the pink/yellow/lavender/blue squares from the hero &
 * footer stat rows. Big value + small label, hard border + shadow.
 */
export function StatTile({
  value,
  label,
  color = "lavender",
  icon,
  /** Small caption under the label, e.g. "↑ 18 this week" or "5 in progress". */
  delta,
  className,
}: {
  value: string;
  label: string;
  color?: TileColor;
  icon?: React.ReactNode;
  delta?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "retro-tile retro-hover flex items-start gap-3",
        TILE_BG[color],
        className,
      )}
    >
      {icon ? (
        <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-[3px] border-2 border-neutral-950 bg-card [&_svg]:size-4">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <div className="font-display text-2xl font-bold leading-none text-neutral-950 tabular">
          {value}
        </div>
        <div className="mt-1 font-mono text-xs font-medium text-neutral-800">
          {label}
        </div>
        {delta && (
          <div className="mt-0.5 font-mono text-[0.6875rem] font-semibold text-neutral-600">
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}
