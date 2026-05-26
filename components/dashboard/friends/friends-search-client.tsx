"use client";

import { type FormEvent, useEffect, useState } from "react";

import { UserAvatar } from "@/components/dashboard/friends/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/components/preferences/preferences-provider";

type SearchItem = {
  userId: string;
  name: string;
  avatarSrc: string | null;
  relationshipState:
    | "none"
    | "friend"
    | "outgoing_pending"
    | "incoming_pending"
    | "blocked_by_you"
    | "blocked_by_them";
};

type SearchPayload = {
  items: SearchItem[];
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
};

export function FriendsSearchClient() {
  const { dictionary: dict } = usePreferences();
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [payload, setPayload] = useState<SearchPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actingUserId, setActingUserId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/friends/search?query=${encodeURIComponent(query)}&page=${page}&pageSize=20`,
        {
          method: "GET",
          cache: "no-store",
        },
      ).catch(() => null);

      if (cancelled) return;

      if (!response || !response.ok) {
        setError(dict.friendsSection.searchError);
        setPayload(null);
        setLoading(false);
        return;
      }

      const data: SearchPayload = await response.json();
      setPayload(data);
      setLoading(false);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [page, query, reloadToken]);

  const performAction = async (body: unknown) => {
    const response = await fetch("/api/friends/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);

    if (!response || !response.ok) {
      const data = await response?.json().catch(() => null);
      throw new Error(data?.error ?? dict.friendsSection.actionError);
    }
  };

  const handlePrimaryAction = async (item: SearchItem) => {
    setActingUserId(item.userId);
    setError(null);

    try {
      if (item.relationshipState === "none") {
        await performAction({ action: "send_request", targetUserId: item.userId });
      } else if (item.relationshipState === "blocked_by_you") {
        await performAction({ action: "unblock_user", targetUserId: item.userId });
      } else {
        setActingUserId(null);
        return;
      }

      setReloadToken((value) => value + 1);
    } catch (actionError) {
      const message = actionError instanceof Error ? actionError.message : dict.friendsSection.actionError;
      setError(message);
    } finally {
      setActingUserId(null);
    }
  };

  const handleBlock = async (userId: string) => {
    setActingUserId(userId);
    setError(null);

    try {
      await performAction({ action: "block_user", targetUserId: userId });
      setReloadToken((value) => value + 1);
    } catch (actionError) {
      const message = actionError instanceof Error ? actionError.message : dict.friendsSection.blockError;
      setError(message);
    } finally {
      setActingUserId(null);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setPayload(null);
    setError(null);
    setQuery(queryInput.trim());
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[22px] leading-[1.27] tracking-[-0.25px] text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)]">{dict.friendsSection.searchTitle}</h3>
        <p className="text-sm text-[#615d59] dark:text-[#bbb6af]">{dict.friendsSection.searchDescription}</p>
      </div>

      <form className="flex gap-2" onSubmit={onSubmit}>
        <Input
          value={queryInput}
          onChange={(event) => setQueryInput(event.target.value)}
          placeholder={dict.friendsSection.searchPlaceholder}
          aria-label={dict.friendsSection.searchAria}
        />
        <Button type="submit">{dict.friendsSection.searchTitle}</Button>
      </form>

      {error ? <p className="text-sm text-[#dd5b00] dark:text-[#ff8f63]">{error}</p> : null}
      {loading && !payload ? <p className="text-sm text-[#615d59] dark:text-[#bbb6af]">{dict.friendsSection.searching}</p> : null}
      {!loading && query && payload && payload.items.length === 0 ? (
        <p className="text-sm text-[#615d59] dark:text-[#bbb6af]">{dict.friendsSection.noSearchResults.replace("{{query}}", query)}</p>
      ) : null}

      <div className="space-y-2">
        {payload?.items.map((item) => {
          const primaryLabel =
            item.relationshipState === "blocked_by_you"
              ? dict.friendsSection.unblock
              : item.relationshipState === "none"
                ? dict.friendsSection.sendRequest
                : item.relationshipState === "blocked_by_them"
                  ? dict.friendsSection.blockedYou
                  : item.relationshipState === "friend"
                    ? dict.friendsSection.friend
                    : item.relationshipState === "outgoing_pending"
                      ? dict.friendsSection.requested
                      : dict.friendsSection.pending;

          const primaryDisabled =
            actingUserId === item.userId ||
            item.relationshipState === "blocked_by_them" ||
            item.relationshipState === "friend" ||
            item.relationshipState === "outgoing_pending" ||
            item.relationshipState === "incoming_pending";

          return (
            <div
              key={item.userId}
              className="flex w-full items-center justify-between rounded-[12px] border border-[rgba(0,0,0,0.1)] bg-white px-3 py-3 dark:border-[rgba(255,255,255,0.12)] dark:bg-[#171614]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <UserAvatar name={item.name} avatarSrc={item.avatarSrc} />
                <p className="truncate text-sm font-semibold text-[rgba(0,0,0,0.95)] dark:text-[rgba(255,255,255,0.95)]">{item.name}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={primaryDisabled}
                  onClick={() => void handlePrimaryAction(item)}
                >
                  {primaryLabel}
                </Button>
                {item.relationshipState !== "blocked_by_you" && item.relationshipState !== "blocked_by_them" ? (
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={actingUserId === item.userId}
                    onClick={() => void handleBlock(item.userId)}
                  >
                    {dict.friendsSection.block}
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {payload ? (
        <div className="flex items-center justify-end gap-2">
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
      ) : null}
    </div>
  );
}
