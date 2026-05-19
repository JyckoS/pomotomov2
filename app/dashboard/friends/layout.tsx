import type { ReactNode } from "react";

import { FriendsTabs } from "../../../components/dashboard/friends/friends-tabs";

export default function FriendsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="sticky top-16 z-10 -mx-4 border-b border-[rgba(0,0,0,0.1)] bg-[#f6f5f4]/95 px-4 py-3 backdrop-blur-sm dark:border-[rgba(255,255,255,0.12)] dark:bg-[#12110f]/95 sm:-mx-6 sm:top-[72px] sm:px-6">
        <FriendsTabs />
      </div>

      <section className="rounded-[16px] border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] dark:border-[rgba(255,255,255,0.12)] dark:bg-[#171614] sm:p-6">
        {children}
      </section>
    </div>
  );
}
