"use client";

import { useCallback, useEffect, useRef } from "react";

const HEARTBEAT_INTERVAL_MS = 30_000;
const HEARTBEAT_DEBOUNCE_MS = 5_000;

export function useHeartbeat() {
  const lastSentAtRef = useRef(0);

  const sendHeartbeat = useCallback(
    async ({ preferBeacon = false }: { preferBeacon?: boolean } = {}) => {
      const now = Date.now();
      if (now - lastSentAtRef.current < HEARTBEAT_DEBOUNCE_MS) {
        return;
      }

      if (preferBeacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const wasQueued = navigator.sendBeacon("/api/heartbeat");
        if (wasQueued) {
          lastSentAtRef.current = now;
          return;
        }
      }

      const response = await fetch("/api/heartbeat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source: "dashboard" }),
        keepalive: preferBeacon,
      }).catch(() => null);

      if (!response || !response.ok) {
        return;
      }

      lastSentAtRef.current = now;
    },
    [],
  );

  useEffect(() => {
    void sendHeartbeat();

    const intervalId = window.setInterval(() => {
      if (document.hidden) return;
      void sendHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      void sendHeartbeat();
    };

    const handleFocus = () => {
      void sendHeartbeat();
    };

    const handlePageHide = () => {
      void sendHeartbeat({ preferBeacon: true });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [sendHeartbeat]);
}
