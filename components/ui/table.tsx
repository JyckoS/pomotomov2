"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Redesigned based on DESIGN.md:
 * - Borders: 1px solid rgba(0,0,0,0.1) "Whisper Borders"
 * - Typography: Body size (16px) for cells, Nav/Button weight (600) for headers
 * - Colors: Near-black text (rgba(0,0,0,0.95)), Warm Gray 500 (#615d59) for secondary text
 * - Backgrounds: Pure white for table, Warm White (#f6f5f4) for alternating/hover states
 */

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        // Base table uses near-black text and standard body sizing
        className={cn("w-full caption-bottom text-[16px] text-[rgba(0,0,0,0.95)]", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      // Headers use the whisper border division
      className={cn("[&_tr]:border-b [&_tr]:border-[rgba(0,0,0,0.1)]", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      // Footer uses Warm White background and semi-bold text
      className={cn(
        "border-t border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] font-semibold [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      // Rows use whisper borders and Warm White hover states
      className={cn(
        "border-b border-[rgba(0,0,0,0.1)] transition-colors hover:bg-[#f6f5f4] data-[state=selected]:bg-[#f6f5f4]",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      // Header text uses Warm Gray 500 with weight 600
      className={cn(
        "h-10 px-2 text-left align-middle font-semibold whitespace-nowrap text-[#615d59] text-[14px] [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      // Standard cells use 16px weight 400
      className={cn(
        "p-2 align-middle whitespace-nowrap font-normal [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      // Captions use Caption Light style: 14px Warm Gray
      className={cn("mt-4 text-[14px] text-[#a39e98] font-normal", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}