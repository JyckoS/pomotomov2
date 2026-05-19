import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Redesigned based on DESIGN.md:
 * - Radius: 4px for functional interactive elements
 * - Border: Standard whisper border at 1px solid rgba(0,0,0,0.1)
 * - Background: Pure White (#ffffff)
 * - Typography: Body size (16px) with Near-Black (rgba(0,0,0,0.95))
 * - Focus: Focus Blue (#097fe8) ring
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Layout & Base Styles
        "h-8 w-full min-w-0 rounded-[4px] border border-[rgba(0,0,0,0.1)] bg-white px-2 py-[6px] transition-all outline-none dark:border-[rgba(255,255,255,0.14)] dark:bg-[#201f1d]",
        // Typography
        "text-[16px] font-normal leading-[1.5] text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.92)]",
        // Placeholder
        "placeholder:text-[#a39e98] dark:placeholder:text-[#8f8a84]",
        // Interactive States
        "focus-visible:border-[#097fe8] focus-visible:ring-2 focus-visible:ring-[#097fe8]/20",
        // Disabled States
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#f6f5f4] disabled:text-[#a39e98] disabled:opacity-50 dark:disabled:bg-[#23211f]",
        // File Input Styles
        "file:inline-flex file:h-full file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[rgba(0,0,0,0.95)]",
        // Error States
        "aria-invalid:border-[#dd5b00] aria-invalid:ring-1 aria-invalid:ring-[#dd5b00]/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
