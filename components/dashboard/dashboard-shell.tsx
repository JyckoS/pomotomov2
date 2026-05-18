import { DashboardBreadcrumbs } from "@/components/dashboard/dashboard-breadcrumbs";
import { PomodoroProvider } from "@/components/dashboard/pomodoro/pomodoro-provider";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import type { PomodoroSettings, TimerType } from "@/types/pomodoro";

export function DashboardShell({
  userName,
  userEmail,
  userStatus,
  avatarSrc,
  initialTimerTypes,
  initialSettings,
  children,
}: {
  userName: string;
  userEmail: string;
  userStatus: string;
  avatarSrc: string;
  initialTimerTypes: TimerType[];
  initialSettings: PomodoroSettings;
  children: React.ReactNode;
}) {
  return (
    <PomodoroProvider initialTimerTypes={initialTimerTypes} initialSettings={initialSettings}>
      <main className="min-h-screen bg-[#f6f5f4]">
        <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col md:flex-row">
          <DashboardSidebar
            userName={userName}
            userEmail={userEmail}
            userStatus={userStatus}
            avatarSrc={avatarSrc}
          />

          <div className="flex min-h-screen min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-20 border-b border-[rgba(0,0,0,0.1)] bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6">
              <DashboardBreadcrumbs />
            </header>

            <div className="flex-1 px-4 py-5 sm:px-6 sm:py-6">{children}</div>
          </div>
        </div>
      </main>
    </PomodoroProvider>
  );
}
