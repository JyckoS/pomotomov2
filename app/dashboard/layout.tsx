import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ensurePomodoroConfig } from "@/lib/data-access/pomodoro";
import { HeartbeatRunner } from "@/components/heartbeat-runner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

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

  return (
    <DashboardShell
      userName={session.user.name}
      userEmail={session.user.email}
      avatarSrc="/api/profile/avatar"
      initialTimerTypes={pomodoroConfig.timerTypes}
      initialSettings={pomodoroConfig.settings}
    >
      <HeartbeatRunner />
      {children}
    </DashboardShell>
  );
}
