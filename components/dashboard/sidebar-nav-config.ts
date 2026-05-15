import { type LucideIcon, NotebookPen, Timer } from "lucide-react";

export type SidebarNavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const sidebarNavItems: SidebarNavItem[] = [
  {
    name: "Pomodoro",
    href: "/dashboard/pomodoro",
    icon: Timer,
  },
  {
    name: "Notes",
    href: "/dashboard/notes",
    icon: NotebookPen,
  },
];
