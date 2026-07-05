import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/components/lib/utils"

// Retro verity.exe buttons: hard 3px border, hard offset shadow, and a chunky
// "press down" (translate + shadow collapse) on active. Mono, uppercase-friendly.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 font-mono text-sm font-bold whitespace-nowrap outline-none select-none transition-[transform,box-shadow,background-color] duration-100 [box-shadow:3px_3px_0_0_var(--color-neutral-950)] hover:-translate-x-px hover:-translate-y-px hover:[box-shadow:4px_4px_0_0_var(--color-neutral-950)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0_0_0_0_var(--color-neutral-950)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-lime text-neutral-950 hover:bg-[#B9EC2E]",
        primary: "bg-primary text-primary-foreground hover:bg-brand-700",
        outline: "bg-card text-neutral-950 hover:bg-muted",
        secondary: "bg-lavender-400 text-neutral-950 hover:bg-lavender-500",
        ghost:
          "border-transparent shadow-none hover:shadow-none hover:bg-muted active:translate-x-0 active:translate-y-0",
        destructive: "bg-destructive text-white hover:bg-[#D33A3F]",
        link: "border-transparent shadow-none hover:shadow-none active:translate-x-0 active:translate-y-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-4",
        xs: "h-7 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 text-[0.8rem]",
        lg: "h-12 gap-2 px-6 text-base",
        icon: "size-10",
        "icon-xs": "size-7",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      // Base UI's nativeButton defaults to true, which warns whenever `render`
      // swaps in a non-<button> element (e.g. next/link's <a>, the common
      // case here). Default it off whenever `render` is used; callers doing
      // render={<button .../>} can still opt back in explicitly.
      nativeButton={!props.render}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
