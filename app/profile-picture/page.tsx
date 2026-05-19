import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AvatarEditor } from "@/components/profile/avatar-editor";
import { auth } from "@/lib/auth";

export default async function ProfilePicturePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f5f4] px-4 py-10 dark:bg-[#12110f]">
      <AvatarEditor initialImageUrl={session.user.image ? "/api/profile/avatar" : null} />
    </main>
  );
}
