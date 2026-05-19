"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { I18nDictionary } from "@/lib/preferences/i18n";

function formatSegment(segment: string): string {
  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function translateSegment(segment: string, dict: I18nDictionary) {
  const normalized = segment.toLowerCase();
  if (normalized === "pomodoro") return dict.common.pomodoro;
  if (normalized === "friends") return dict.common.friends;
  if (normalized === "requests") return dict.friendsSection.requestsTitle;
  if (normalized === "search") return dict.friendsSection.searchTitle;
  if (normalized === "list") return dict.friendsSection.listTitle;
  if (normalized === "notes") return dict.common.notes;
  return formatSegment(segment);
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const { dictionary: dict } = usePreferences();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const dashboardIndex = segments.indexOf("dashboard");
    const dashboardChildren = dashboardIndex >= 0 ? segments.slice(dashboardIndex + 1) : [];

    const actualChildren = dashboardChildren.length > 0 ? dashboardChildren : ["pomodoro"];
    const childCrumbs = actualChildren.map((segment, index) => {
        const href = `/dashboard/${actualChildren.slice(0, index + 1).join("/")}`;
        return {
          label: translateSegment(segment, dict),
          href,
        };
      });

    return [
      { label: dict.common.dashboard, href: "/dashboard" },
      ...childCrumbs,
    ];
  }, [pathname, dict.common.dashboard]);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <div key={`${crumb.label}-${index}`} className="flex items-center gap-1">
            {index > 0 ? <ChevronRight className="size-4 text-[#a39e98] dark:text-[#9a948d]" /> : null}
            <Link
              href={crumb.href}
              className={
                isLast
                  ? "font-semibold text-[rgba(0,0,0,0.95)] no-underline hover:no-underline dark:text-[rgba(255,255,255,0.95)]"
                  : "text-[#615d59] no-underline transition-colors hover:text-[rgba(0,0,0,0.95)] hover:no-underline dark:text-[#bab6b1] dark:hover:text-[rgba(255,255,255,0.95)]"
              }
            >
              {crumb.label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
