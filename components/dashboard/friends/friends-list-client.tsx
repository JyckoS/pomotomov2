"use client";

import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { UserAvatar } from "@/components/dashboard/friends/user-avatar";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { I18nDictionary } from "@/lib/preferences/i18n";

type FriendListItem = {
  friendshipId: string;
  userId: string;
  name: string;
  status: string;
  avatarSrc: string | null;
  isOnline: boolean;
  lastHeartbeatAt: string | null;
  conversationId: string | null;
  unreadCount: number;
};

type FriendsListPayload = {
  items: FriendListItem[];
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
};

function formatLastOnline(lastHeartbeatAt: string | null, dict: I18nDictionary) {
  if (!lastHeartbeatAt) return dict.friendsSection.lastOnlineNever;
  const diffMs = Date.now() - new Date(lastHeartbeatAt).getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60_000));
  if (diffMinutes < 60) return dict.friendsSection.lastOnlineMinute.replace("{{value}}", String(diffMinutes));
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return dict.friendsSection.lastOnlineHour.replace("{{value}}", String(diffHours));
  const diffDays = Math.floor(diffHours / 24);
  return dict.friendsSection.lastOnlineDay.replace("{{value}}", String(diffDays));
}

export function FriendsListClient() {
  const { dictionary: dict } = usePreferences();
  const router = useRouter();
  const [payload, setPayload] = useState<FriendsListPayload | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chattingWith, setChattingWith] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/friends/list?page=${page}&pageSize=20`, {
        method: "GET",
        cache: "no-store",
      }).catch(() => null);

      if (cancelled) return;

      if (!response || !response.ok) {
        setError(dict.friendsSection.loadFriendsError);
        setLoading(false);
        return;
      }

      const data: FriendsListPayload = await response.json();
      setPayload(data);
      setLoading(false);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [dict.friendsSection.loadFriendsError, page]);

  const handleStartChat = async (friendUserId: string) => {
    setChattingWith(friendUserId);
    const response = await fetch("/api/friends/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendUserId }),
    }).catch(() => null);

    if (!response || !response.ok) {
      setError(dict.friendsSection.actionError);
      setChattingWith(null);
      return;
    }

    const data: { conversationId: string } = await response.json();
    setChattingWith(null);
    router.push(`/dashboard/friends/chat/${data.conversationId}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[22px] leading-[1.27] tracking-[-0.25px] text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)]">{dict.friendsSection.listTitle}</h3>
        <p className="text-sm text-[#615d59] dark:text-[#bbb6af]">{dict.friendsSection.listDescription}</p>
      </div>

      {error ? <p className="text-sm text-[#dd5b00] dark:text-[#ff8f63]">{error}</p> : null}

      <div className="space-y-2">
        {loading && !payload ? <p className="text-sm text-[#615d59] dark:text-[#bbb6af]">{dict.friendsSection.loadingFriends}</p> : null}
        {!loading && payload && payload.items.length === 0 ? (
          <p className="text-sm text-[#615d59] dark:text-[#bbb6af]">{dict.friendsSection.noFriends}</p>
        ) : null}

        {payload?.items.map((friend) => (
          <div
            key={friend.friendshipId}
            className="flex w-full items-center justify-between rounded-[12px] border border-[rgba(0,0,0,0.1)] bg-white px-3 py-3 dark:border-[rgba(255,255,255,0.12)] dark:bg-[#171614]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <UserAvatar name={friend.name} avatarSrc={friend.avatarSrc} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)]">{friend.name}</p>
                <p className="truncate text-xs text-[#a39e98] dark:text-[#9e9993]">{friend.status}</p>
                <p className="text-xs text-[#615d59] dark:text-[#bbb6af]">
                  {friend.isOnline ? dict.friendsSection.onlineNow : formatLastOnline(friend.lastHeartbeatAt, dict)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  aria-label={dict.friendsSection.openChatWith.replace("{{name}}", friend.name)}
                  disabled={chattingWith === friend.userId}
                  onClick={() => void handleStartChat(friend.userId)}
                >
                  <MessageCircle className="size-4" />
                </Button>
                {friend.unreadCount > 0 ? (
                  <span className="absolute -top-1 -right-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#e02424] px-1 text-[10px] font-bold leading-none text-white">
                    {friend.unreadCount > 99 ? "99+" : friend.unreadCount}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {payload ? (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-[#615d59] dark:text-[#bbb6af]">
            {dict.friendsSection.showing} {(payload.page - 1) * payload.pageSize + 1}
            {" - "}
            {Math.min(payload.page * payload.pageSize, payload.total)} {dict.friendsSection.of} {payload.total}
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
              {dict.common.previous}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!payload.hasNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              {dict.common.next}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
