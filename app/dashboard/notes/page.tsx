 "use client";

import { usePreferences } from "@/components/preferences/preferences-provider";

export default function NotesPage() {
  const { dictionary: dict } = usePreferences();

  return (
    <div className="rounded-[12px] border border-[rgba(0,0,0,0.1)] bg-white p-4 text-sm text-[#615d59] dark:border-[rgba(255,255,255,0.12)] dark:bg-[#171614] dark:text-[#bbb6af]">
      {dict.notes.placeholder}
    </div>
  );
}
