"use client";

import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { UserAvatar } from "@/components/dashboard/friends/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ConversationMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarSrc: string | null;
  content: string;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
};

type ConversationPayload = {
  conversationId: string;
  currentUserId: string;
  otherParticipant: {
    userId: string;
    name: string;
    avatarSrc: string | null;
  };
  messages: ConversationMessage[];
  hasMore: boolean;
  oldestMessageAt: string | null;
};

function formatMessageTime(createdAt: string) {
  return new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ConversationClient({ conversationId }: { conversationId: string }) {
  const [payload, setPayload] = useState<ConversationPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const loadConversation = useCallback(
    async ({ before, appendOlder }: { before?: string; appendOlder?: boolean } = {}) => {
      const query = new URLSearchParams({
        conversationId,
        pageSize: "30",
      });
      if (before) query.set("before", before);

      const response = await fetch(`/api/conversations/messages?${query.toString()}`, {
        method: "GET",
        cache: "no-store",
      }).catch(() => null);

      if (!response || !response.ok) {
        const data = await response?.json().catch(() => null);
        throw new Error(data?.error ?? "Unable to load conversation.");
      }

      const data: ConversationPayload = await response.json();
      setPayload((current) => {
        if (!current || !appendOlder) {
          return data;
        }
        return {
          ...data,
          messages: [...data.messages, ...current.messages],
        };
      });
    },
    [conversationId],
  );

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        await loadConversation();
      } catch (loadError) {
        if (!cancelled) {
          const message = loadError instanceof Error ? loadError.message : "Unable to load conversation.";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [conversationId, loadConversation]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadConversation();
    }, 4000);

    return () => window.clearInterval(interval);
  }, [conversationId, loadConversation]);

  const currentUserId = payload?.currentUserId ?? "";

  const sortedMessages = useMemo(() => payload?.messages ?? [], [payload?.messages]);

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!messageText.trim()) return;

    setSending(true);
    setError(null);
    const response = await fetch("/api/conversations/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        content: messageText,
      }),
    }).catch(() => null);

    if (!response || !response.ok) {
      const data = await response?.json().catch(() => null);
      setError(data?.error ?? "Unable to send message.");
      setSending(false);
      return;
    }

    setMessageText("");
    setSending(false);
    await loadConversation();
  };

  const handleLoadOlder = async () => {
    if (!payload?.oldestMessageAt) return;

    setLoadingOlder(true);
    try {
      await loadConversation({
        before: payload.oldestMessageAt,
        appendOlder: true,
      });
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Unable to load older messages.";
      setError(message);
    } finally {
      setLoadingOlder(false);
    }
  };

  return (
    <div className="space-y-4">
      {loading && !payload ? <p className="text-sm text-[#615d59]">Loading conversation...</p> : null}
      {error ? <p className="text-sm text-[#dd5b00]">{error}</p> : null}

      {payload ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-[rgba(0,0,0,0.1)] pb-3">
            <UserAvatar name={payload.otherParticipant.name} avatarSrc={payload.otherParticipant.avatarSrc} />
            <div>
              <p className="text-sm font-semibold text-[rgba(0,0,0,0.95)]">{payload.otherParticipant.name}</p>
              <p className="text-xs text-[#615d59]">Direct conversation</p>
            </div>
          </div>

          <div className="h-[55vh] space-y-3 overflow-y-auto rounded-[12px] border border-[rgba(0,0,0,0.1)] bg-[#f8f9fb] p-3">
            {payload.hasMore ? (
              <div className="flex justify-center">
                <Button type="button" variant="outline" size="sm" onClick={() => void handleLoadOlder()} disabled={loadingOlder}>
                  {loadingOlder ? "Loading..." : "Load older"}
                </Button>
              </div>
            ) : null}

            {sortedMessages.length === 0 ? (
              <p className="text-center text-sm text-[#615d59]">No messages yet. Start the conversation.</p>
            ) : null}

            {sortedMessages.map((message) => {
              const isCurrentUser = message.senderId === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex w-full items-end gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  {!isCurrentUser ? (
                    <UserAvatar name={message.senderName} avatarSrc={message.senderAvatarSrc} sizeClassName="size-8" />
                  ) : null}
                  <div
                    className={`max-w-[70%] rounded-[18px] px-3 py-2 text-sm ${
                      isCurrentUser
                        ? "rounded-br-[6px] bg-[#097fe8] text-white"
                        : "rounded-bl-[6px] border border-[rgba(0,0,0,0.1)] bg-white text-[rgba(0,0,0,0.95)]"
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <p className={`mt-1 text-[10px] ${isCurrentUser ? "text-white/80" : "text-[#615d59]"}`}>
                      {formatMessageTime(message.createdAt)}
                    </p>
                  </div>
                  {isCurrentUser ? (
                    <UserAvatar name={message.senderName} avatarSrc={message.senderAvatarSrc} sizeClassName="size-8" />
                  ) : null}
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <Input
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Type a message..."
              maxLength={2000}
            />
            <Button type="submit" disabled={sending || !messageText.trim()}>
              {sending ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
