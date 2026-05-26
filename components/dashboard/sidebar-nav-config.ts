import { ListChecks, type LucideIcon, NotebookPen, SunIcon, Timer, Users } from "lucide-react";

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
  {
    name: "Friends",
    href: "/dashboard/friends",
    icon: Users,
  },
  {
    name: "To Do",
    href: "/dashboard/todo",
    icon: ListChecks,
  },
  {
    name: "Daily List",
    href: "/dashboard/daily",
    icon: SunIcon,
  }
];
