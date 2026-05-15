"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { usePomodoro } from "@/components/dashboard/pomodoro/pomodoro-provider";
import { Button } from "@/components/ui/button";
import { sidebarNavItems } from "@/components/dashboard/sidebar-nav-config";
import { authClient } from "@/lib/auth-client";
import { formatTimer } from "@/lib/pomodoro/utils";

export function DashboardSidebar({
  userName,
  userEmail,
  avatarSrc,
}: {
  userName: string;
  userEmail: string;
  avatarSrc: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { phase, isRunning, timeLeftSeconds } = usePomodoro();
  const firstName = userName.trim().split(" ")[0] || "there";
  const normalizedPathname = pathname.replace(/\/+$/, "");

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/sign-in");
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

      <div className="mt-6 flex flex-1 flex-col">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.125px] text-[#a39e98]">WORKSPACE</p>
          {sidebarNavItems.map((item) => {
            const normalizedHref = item.href.replace(/\/+$/, "");
            const isActive =
              normalizedPathname === normalizedHref || normalizedPathname.startsWith(`${normalizedHref}/`);
            const isPomodoroItem = normalizedHref === "/dashboard/pomodoro";

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
