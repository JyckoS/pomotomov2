"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { usePreferences } from "@/components/preferences/preferences-provider";

const FRIENDS_TABS = [
  { segment: "list", href: "/dashboard/friends/list" },
  { segment: "search", href: "/dashboard/friends/search" },
  { segment: "requests", href: "/dashboard/friends/requests" },
] as const;

export function FriendsTabs() {
  const activeSegment = useSelectedLayoutSegment() ?? "list";
  const { dictionary: dict } = usePreferences();

  const getTabLabel = (segment: (typeof FRIENDS_TABS)[number]["segment"]) => {
    if (segment === "list") return dict.friendsSection.listTab;
    if (segment === "search") return dict.friendsSection.searchTab;
    return dict.friendsSection.requestsTab;
  };

  return (
    <nav aria-label={dict.friendsSection.navAriaLabel} className="overflow-x-auto">
      <div className="inline-flex min-w-full items-center gap-2 rounded-[12px] border border-[rgba(0,0,0,0.1)] bg-white p-1.5 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] dark:border-[rgba(255,255,255,0.12)] dark:bg-[#171614]">
        {FRIENDS_TABS.map((tab) => {
          const isActive = activeSegment === tab.segment;

          return (
            <Link
              key={tab.segment}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
                className={`inline-flex flex-1 items-center justify-center rounded-[8px] border px-3 py-2 text-sm font-semibold whitespace-nowrap no-underline transition-colors hover:no-underline ${
                  isActive
                    ? "border-[rgba(9,127,232,0.2)] bg-[#f2f9ff] text-[#097fe8] dark:border-[#62aef0]/35 dark:bg-[#14334f] dark:text-[#97c8f5]"
                    : "border-transparent text-[#615d59] hover:border-[rgba(0,0,0,0.1)] hover:bg-[#f6f5f4] hover:text-[rgba(0,0,0,0.95)] dark:text-[#bbb6af] dark:hover:border-[rgba(255,255,255,0.14)] dark:hover:bg-[#23211f] dark:hover:text-[rgba(255,255,255,0.95)]"
                }`}
              >
                {getTabLabel(tab.segment)}
              </Link>
            );
          })}
      </div>
    </nav>
  );
}
