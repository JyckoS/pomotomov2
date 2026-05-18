"use client";

import { useHeartbeat } from "@/lib/heartbeat/use-heartbeat";

export function HeartbeatRunner() {
  useHeartbeat();
  return null;
}
