"use client";

import Link from "next/link";
import { LogOut, Pencil } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";

import { usePomodoro } from "@/components/dashboard/pomodoro/pomodoro-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sidebarNavItems } from "@/components/dashboard/sidebar-nav-config";
import { authClient } from "@/lib/auth-client";
import { formatTimer } from "@/lib/pomodoro/utils";
import { DEFAULT_USER_STATUS, MAX_USER_STATUS_LENGTH } from "@/lib/user-status";

export function DashboardSidebar({
  userName,
  userEmail,
  userStatus,
  avatarSrc,
}: {
  userName: string;
  userEmail: string;
  userStatus: string;
  avatarSrc: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { phase, isRunning, timeLeftSeconds } = usePomodoro();
  const firstName = userName.trim().split(" ")[0] || "there";
  const normalizedPathname = pathname.replace(/\/+$/, "");
  const [friendsUnreadTotal, setFriendsUnreadTotal] = useState(0);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusValue, setStatusValue] = useState(userStatus || DEFAULT_USER_STATUS);
  const [statusDraft, setStatusDraft] = useState(userStatus || DEFAULT_USER_STATUS);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const loadFriendsUnreadTotal = useCallback(async () => {
    const response = await fetch("/api/friends/unread", {
      method: "GET",
      cache: "no-store",
    }).catch(() => null);

    if (!response || !response.ok) {
      return;
    }

    const data: { totalUnread: number } = await response.json();
    setFriendsUnreadTotal(data.totalUnread);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadFriendsUnreadTotal();
    }, 0);

    const intervalId = window.setInterval(() => {
      void loadFriendsUnreadTotal();
    }, 5000);

    const handleFocus = () => {
      void loadFriendsUnreadTotal();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadFriendsUnreadTotal]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/sign-in");
    router.refresh();
  };

  const handleStatusSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSavingStatus) return;

    setStatusError(null);
    setIsSavingStatus(true);

    const response = await fetch("/api/profile/status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: statusDraft }),
    }).catch(() => null);

    if (!response || !response.ok) {
      const data = await response?.json().catch(() => null);
      setStatusError(data?.error ?? "Unable to update status.");
      setIsSavingStatus(false);
      return;
    }

    const data: { status: string } = await response.json();
    setStatusValue(data.status);
    setStatusDraft(data.status);
    setIsEditingStatus(false);
    setIsSavingStatus(false);
    router.refresh();
  };

  return (
    <aside className="flex w-full flex-col border-b border-[rgba(0,0,0,0.1)] bg-white px-4 py-4 md:sticky md:top-0 md:h-screen md:w-72 md:border-r md:border-b-0 md:px-5 md:py-6">
      <div className="flex items-center gap-3">
        <Link
          href="/profile-picture"
          aria-label="Update profile picture"
          className="size-12 overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] transition-shadow hover:shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] no-underline hover:no-underline"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarSrc} alt={`${userName} avatar`} className="size-full object-cover" />
        </Link>

        <div className="min-w-0">
          <p className="text-sm text-[#615d59]">Hello, {firstName}</p>
          <p className="truncate text-[15px] font-semibold text-[rgba(0,0,0,0.95)]">{userName}</p>
          <p className="truncate text-xs text-[#a39e98]">{userEmail}</p>
        </div>
      </div>

      <div className="mt-3 rounded-[8px] border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] px-3 py-2">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold tracking-[0.125px] text-[#a39e98]">STATUS</p>
          {!isEditingStatus ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="text-[#615d59] hover:text-[rgba(0,0,0,0.95)]"
              onClick={() => {
                setStatusDraft(statusValue);
                setStatusError(null);
                setIsEditingStatus(true);
              }}
              aria-label="Edit status"
            >
              <Pencil className="size-3.5" />
            </Button>
          ) : null}
        </div>

        {isEditingStatus ? (
          <form className="space-y-2" onSubmit={handleStatusSave}>
            <Input
              value={statusDraft}
              onChange={(event) => setStatusDraft(event.target.value)}
              maxLength={MAX_USER_STATUS_LENGTH}
              className="h-7 text-sm"
              autoFocus
            />
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] text-[#a39e98]">
                {statusDraft.length}/{MAX_USER_STATUS_LENGTH}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    setIsEditingStatus(false);
                    setStatusDraft(statusValue);
                    setStatusError(null);
                  }}
                  disabled={isSavingStatus}
                >
                  Cancel
                </Button>
                <Button type="submit" size="xs" disabled={isSavingStatus}>
                  {isSavingStatus ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <p className="truncate text-xs text-[#615d59]">{statusValue || DEFAULT_USER_STATUS}</p>
        )}

        {statusError ? <p className="mt-1 text-xs text-[#dd5b00]">{statusError}</p> : null}
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.125px] text-[#a39e98]">WORKSPACE</p>
          {sidebarNavItems.map((item) => {
            const normalizedHref = item.href.replace(/\/+$/, "");
            const isActive =
              normalizedPathname === normalizedHref || normalizedPathname.startsWith(`${normalizedHref}/`);
            const isPomodoroItem = normalizedHref === "/dashboard/pomodoro";
            const isFriendsItem = normalizedHref === "/dashboard/friends";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-semibold no-underline transition-colors hover:no-underline ${
                  isActive
                    ? "border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] text-[rgba(0,0,0,0.95)]"
                    : "border-transparent bg-white text-[#615d59] hover:border-[rgba(0,0,0,0.1)] hover:bg-[#f6f5f4] hover:text-[rgba(0,0,0,0.95)]"
                }`}
              >
                <item.icon aria-hidden="true" className="size-4" />
                <div className="min-w-0">
                  <p>{item.name}</p>
                  {isPomodoroItem ? (
                    <p className="truncate text-[11px] font-medium text-[#a39e98]">
                      {phase === "focus" ? "Focus" : "Break"} {formatTimer(timeLeftSeconds)}
                      {isRunning ? " • Running" : " • Paused"}
                    </p>
                  ) : null}
                </div>
                {isFriendsItem && friendsUnreadTotal > 0 ? (
                  <span className="ml-auto inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#e02424] px-1 text-[10px] font-bold leading-none text-white">
                    {friendsUnreadTotal > 99 ? "99+" : friendsUnreadTotal}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 md:mt-auto">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-[#615d59] hover:text-[rgba(0,0,0,0.95)]"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
