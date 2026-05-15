"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

function formatSegment(segment: string): string {
  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const dashboardIndex = segments.indexOf("dashboard");
    const dashboardChildren = dashboardIndex >= 0 ? segments.slice(dashboardIndex + 1) : [];

    const actualChildren = dashboardChildren.length > 0 ? dashboardChildren : ["pomodoro"];
    const childCrumbs = actualChildren.map((segment, index) => {
      const href = `/dashboard/${actualChildren.slice(0, index + 1).join("/")}`;
      return {
        label: formatSegment(segment),
        href,
      };
    });

    return [
      { label: "Dashboard", href: "/dashboard" },
      ...childCrumbs,
    ];
  }, [pathname]);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <div key={`${crumb.label}-${index}`} className="flex items-center gap-1">
            {index > 0 ? <ChevronRight className="size-4 text-[#a39e98]" /> : null}
            <Link
              href={crumb.href}
              className={
                isLast
                  ? "font-semibold text-[rgba(0,0,0,0.95)] no-underline hover:no-underline"
                  : "text-[#615d59] no-underline transition-colors hover:text-[rgba(0,0,0,0.95)] hover:no-underline"
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
