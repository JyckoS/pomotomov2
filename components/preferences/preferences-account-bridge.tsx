"use client";

import { useEffect, useRef } from "react";

import { usePreferences } from "@/components/preferences/preferences-provider";
import type { UserPreferences } from "@/types/preferences";

export function PreferencesAccountBridge({
  accountPreferences,
}: {
  accountPreferences: UserPreferences;
}) {
  const { connectAuthenticatedPreferences } = usePreferences();
  const hasConnected = useRef(false);

  useEffect(() => {
    if (hasConnected.current) return;

    hasConnected.current = true;
    void connectAuthenticatedPreferences(accountPreferences);
  }, [accountPreferences, connectAuthenticatedPreferences]);

  return null;
}
