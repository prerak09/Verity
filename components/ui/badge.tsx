import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/components/lib/utils"

// Retro chips: small, hard 2px border, sharp corners, mono uppercase-friendly.
const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 rounded-[3px] border-2 border-neutral-950 px-2 py-0.5 font-mono text-xs font-bold whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-lavender-300 text-neutral-950",
        secondary: "bg-muted text-neutral-950",
        lime: "bg-lime text-neutral-950",
        pink: "bg-tile-pink text-neutral-950",
        yellow: "bg-tile-yellow text-neutral-950",
        blue: "bg-tile-blue text-neutral-950",
        success: "bg-success-bg text-success-fg border-success-border",
        destructive: "bg-error-bg text-error-fg border-error-border",
        outline: "bg-card text-neutral-950",
        ghost: "border-transparent hover:bg-muted",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
