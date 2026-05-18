"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

const FRIENDS_TABS = [
  { segment: "list", label: "Friends List", href: "/dashboard/friends/list" },
  { segment: "search", label: "Search", href: "/dashboard/friends/search" },
  { segment: "requests", label: "Requests", href: "/dashboard/friends/requests" },
] as const;

export function FriendsTabs() {
  const activeSegment = useSelectedLayoutSegment() ?? "list";

  return (
    <nav aria-label="Friends sections" className="overflow-x-auto">
      <div className="inline-flex min-w-full items-center gap-2 rounded-[12px] border border-[rgba(0,0,0,0.1)] bg-white p-1.5 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px]">
        {FRIENDS_TABS.map((tab) => {
          const isActive = activeSegment === tab.segment;

          return (
            <Link
              key={tab.segment}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex flex-1 items-center justify-center rounded-[8px] border px-3 py-2 text-sm font-semibold whitespace-nowrap no-underline transition-colors hover:no-underline ${
                isActive
                  ? "border-[rgba(9,127,232,0.2)] bg-[#f2f9ff] text-[#097fe8]"
                  : "border-transparent text-[#615d59] hover:border-[rgba(0,0,0,0.1)] hover:bg-[#f6f5f4] hover:text-[rgba(0,0,0,0.95)]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
