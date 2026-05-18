"use client";

import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { UserAvatar } from "@/components/dashboard/friends/user-avatar";
import { Button } from "@/components/ui/button";

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

function formatLastOnline(lastHeartbeatAt: string | null) {
  if (!lastHeartbeatAt) return "Last online: never";
  const diffMs = Date.now() - new Date(lastHeartbeatAt).getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60_000));
  if (diffMinutes < 60) return `Last online: ${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Last online: ${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `Last online: ${diffDays}d ago`;
}

export function FriendsListClient() {
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
        setError("Unable to load your friends right now.");
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
  }, [page]);

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
      setError("Unable to open chat right now.");
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
        <h3 className="text-[22px] leading-[1.27] tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">Friends List</h3>
        <p className="text-sm text-[#615d59]">Online friends appear first. Start or continue chat from the right side.</p>
      </div>

      {error ? <p className="text-sm text-[#dd5b00]">{error}</p> : null}

      <div className="space-y-2">
        {loading && !payload ? <p className="text-sm text-[#615d59]">Loading friends...</p> : null}
        {!loading && payload && payload.items.length === 0 ? (
          <p className="text-sm text-[#615d59]">No friends yet.</p>
        ) : null}

        {payload?.items.map((friend) => (
          <div
            key={friend.friendshipId}
            className="flex w-full items-center justify-between rounded-[12px] border border-[rgba(0,0,0,0.1)] bg-white px-3 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <UserAvatar name={friend.name} avatarSrc={friend.avatarSrc} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[rgba(0,0,0,0.95)]">{friend.name}</p>
                <p className="truncate text-xs text-[#a39e98]">{friend.status}</p>
                <p className="text-xs text-[#615d59]">
                  {friend.isOnline ? "Online now" : formatLastOnline(friend.lastHeartbeatAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  aria-label={`Open chat with ${friend.name}`}
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
          <p className="text-xs text-[#615d59]">
            Showing {(payload.page - 1) * payload.pageSize + 1}
            {" - "}
            {Math.min(payload.page * payload.pageSize, payload.total)} of {payload.total}
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!payload.hasNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
