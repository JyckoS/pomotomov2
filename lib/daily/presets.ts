import {
  Archive,
  BadgeCheck,
  Bell,
  BookMarked,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  CircleCheckBig,
  ClipboardList,
  Clock3,
  FileText,
  Flame,
  Flower2,
  FolderOpen,
  Goal,
  Heart,
  Lightbulb,
  ListTodo,
  MessageSquareText,
  MoonStar,
  PencilLine,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  SunMedium,
  Target,
  TreePine,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";

export type DailyColorPreset = {
  name: string;
  value: string;
};

export type DailyIconPreset = {
  name: string;
  icon: LucideIcon;
};

export const DAILY_COLOR_PRESETS: DailyColorPreset[] = [
  { name: "Blue", value: "#0075de" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Cyan", value: "#0891b2" },
  { name: "Teal", value: "#0f766e" },
  { name: "Emerald", value: "#10b981" },
  { name: "Green", value: "#16a34a" },
  { name: "Lime", value: "#65a30d" },
  { name: "Yellow", value: "#ca8a04" },
  { name: "Amber", value: "#d97706" },
  { name: "Orange", value: "#ea580c" },
  { name: "Red", value: "#dc2626" },
  { name: "Rose", value: "#e11d48" },
  { name: "Pink", value: "#db2777" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Slate", value: "#64748b" },
  { name: "Stone", value: "#78716c" },
  { name: "Cocoa", value: "#92400e" },
  { name: "Sand", value: "#b45309" },
  { name: "Graphite", value: "#334155" },
];

export const DAILY_ICON_PRESETS: DailyIconPreset[] = [
  { name: "FileText", icon: FileText },
  { name: "CheckSquare", icon: CheckSquare },
  { name: "CalendarDays", icon: CalendarDays },
  { name: "Clock3", icon: Clock3 },
  { name: "ListTodo", icon: ListTodo },
  { name: "Sparkles", icon: Sparkles },
  { name: "BookMarked", icon: BookMarked },
  { name: "BriefcaseBusiness", icon: BriefcaseBusiness },
  { name: "Brain", icon: Brain },
  { name: "Goal", icon: Goal },
  { name: "Heart", icon: Heart },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "ClipboardList", icon: ClipboardList },
  { name: "Star", icon: Star },
  { name: "SunMedium", icon: SunMedium },
  { name: "MoonStar", icon: MoonStar },
  { name: "ShieldCheck", icon: ShieldCheck },
  { name: "Target", icon: Target },
  { name: "Rocket", icon: Rocket },
  { name: "Flower2", icon: Flower2 },
  { name: "TreePine", icon: TreePine },
  { name: "Flame", icon: Flame },
  { name: "Bell", icon: Bell },
  { name: "MessageSquareText", icon: MessageSquareText },
  { name: "PencilLine", icon: PencilLine },
  { name: "FolderOpen", icon: FolderOpen },
  { name: "Archive", icon: Archive },
  { name: "BadgeCheck", icon: BadgeCheck },
  { name: "CircleCheckBig", icon: CircleCheckBig },
  { name: "WandSparkles", icon: WandSparkles },
];

export const DEFAULT_DAILY_COLOR = DAILY_COLOR_PRESETS[0]?.value ?? "#0075de";
export const DEFAULT_DAILY_ICON = "FileText";
