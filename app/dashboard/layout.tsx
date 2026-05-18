import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ensurePomodoroConfig } from "@/lib/data-access/pomodoro";
import { getUserStatus } from "@/lib/data-access/user-profile";
import { HeartbeatRunner } from "@/components/heartbeat-runner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DEFAULT_USER_STATUS } from "@/lib/user-status";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (!session.user.image) {
    redirect("/profile-picture");
  }

  const pomodoroConfig = await ensurePomodoroConfig(session.user.id);
  const userStatus = await getUserStatus({ userId: session.user.id });

  return (
    <DashboardShell
      userName={session.user.name}
      userEmail={session.user.email}
      userStatus={userStatus || DEFAULT_USER_STATUS}
      avatarSrc="/api/profile/avatar"
      initialTimerTypes={pomodoroConfig.timerTypes}
      initialSettings={pomodoroConfig.settings}
    >
      <HeartbeatRunner />
      {children}
    </DashboardShell>
  );
}
