import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[4px] border border-transparent bg-clip-padding text-[15px] font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-[#097fe8] focus-visible:ring-offset-1 active:scale-[0.95] disabled:pointer-events-none disabled:opacity-40 disabled:grayscale aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Notion Blue primary CTA
        default: 
          "bg-[#0075de] text-white hover:bg-[#005bab] shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
        // Whisper-weight border (1px solid rgba(0,0,0,0.1))
        outline:
          "border-[rgba(0,0,0,0.1)] bg-white text-[rgba(0,0,0,0.95)] hover:bg-[#f6f5f4] shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-[rgba(255,255,255,0.14)] dark:bg-[#201f1d] dark:text-[rgba(255,255,255,0.95)] dark:hover:bg-[#2a2826]",
        // Translucent warm gray
        secondary:
          "bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.95)] hover:bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.08)] dark:text-[rgba(255,255,255,0.95)] dark:hover:bg-[rgba(255,255,255,0.14)]",
        // Near-black text ghost button
        ghost:
          "text-[rgba(0,0,0,0.95)] hover:bg-[rgba(0,0,0,0.05)] dark:text-[rgba(255,255,255,0.95)] dark:hover:bg-[rgba(255,255,255,0.08)]",
        // Semantic accent colors
        destructive:
          "bg-[#ff64c8]/10 text-[#dd5b00] border border-[#dd5b00]/20 hover:bg-[#ff64c8]/20",
        // Primary Link Blue
        link: 
          "text-[#0075de] underline-offset-4 hover:underline dark:text-[#62aef0]",
      },
      size: {
        // 8px base spacing unit
        default:
          "h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-2.5 text-[14px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-2 px-4 text-[16px] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
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
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
