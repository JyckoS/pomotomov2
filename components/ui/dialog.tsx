"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "@phosphor-icons/react"

/**
 * Redesigned based on DESIGN.md:
 * - Depth: Level 3 Deep Shadow stack (52px blur)
 * - Border: 1px solid rgba(0,0,0,0.1) "Whisper Border"
 * - Radius: 12px for standard containers
 * - Typography: Near-black text (rgba(0,0,0,0.95))
 * - Palette: Pure White surface with warm gray sub-text
 */

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className={cn(
          // Notion overlay is a very subtle dark tint to maintain warmth
          "fixed inset-0 isolate z-50 bg-black/5 duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 dark:bg-black/45",
          className
        )}
        {...props}
      />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          // Deep elevation stack and whisper border
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-[12px] border border-[rgba(0,0,0,0.1)] bg-white p-8 text-[16px] text-[rgba(0,0,0,0.95)] shadow-[rgba(0,0,0,0.01)_0px_1px_3px,rgba(0,0,0,0.02)_0px_3px_7px,rgba(0,0,0,0.02)_0px_7px_15px,rgba(0,0,0,0.04)_0px_14px_28px,rgba(0,0,0,0.05)_0px_23px_52px] duration-200 outline-none dark:border-[rgba(255,255,255,0.14)] dark:bg-[#171614] dark:text-[rgba(255,255,255,0.95)] sm:max-w-lg data-open:animate-in data-open:fade-in-0 data-open:zoom-in-98 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-98",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-[rgba(0,0,0,0.5)] hover:text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.6)] dark:hover:text-[rgba(255,255,255,0.95)]"
              size="icon-sm"
            >
              <XIcon weight="bold" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      // Generous vertical rhythm
      className={cn("flex flex-col gap-2 text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end mt-2",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      // Sub-heading Large style: 26px, weight 700, tight tracking
      className={cn("text-[26px] font-bold leading-[1.23] tracking-[-0.625px] text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)]", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      // Body style: 16px, weight 400, warm gray
      className={cn(
        "text-[16px] leading-[1.5] text-[#615d59] *:[a]:text-[#0075de] *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-[#005bab]",
        "dark:text-[#bab6b1] dark:*:[a]:text-[#62aef0] dark:*:[a]:hover:text-[#97c8f5]",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
