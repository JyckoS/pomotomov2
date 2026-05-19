"use client";

import { Settings } from "lucide-react";

import { PreferencesControls } from "@/components/preferences/preferences-controls";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PreferencesDialog() {
  const { dictionary: dict } = usePreferences();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start text-[#615d59] hover:text-[rgba(0,0,0,0.95)] dark:text-[#beb8b1] dark:hover:text-[rgba(255,255,255,0.95)]"
        >
          <Settings className="size-4" />
          {dict.common.preferences}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.common.preferences}</DialogTitle>
          <DialogDescription>{dict.common.preferencesDescription}</DialogDescription>
        </DialogHeader>
        <PreferencesControls />
      </DialogContent>
    </Dialog>
  );
}
