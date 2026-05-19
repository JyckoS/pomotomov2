"use client";

import { useEffect, useState } from "react";

import { ConfirmActionDialog } from "@/components/dashboard/friends/confirm-action-dialog";
import { UserAvatar } from "@/components/dashboard/friends/user-avatar";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/preferences/preferences-provider";

type RequestItem = {
  friendshipId: string;
  userId: string;
  name: string;
  avatarSrc: string | null;
  createdAt: string;
};

type RequestsPayload = {
  incoming: RequestItem[];
  outgoing: RequestItem[];
  page: number;
  pageSize: number;
  incomingTotal: number;
  outgoingTotal: number;
};

type PendingAction =
  | { type: "accept"; friendshipId: string; userName: string }
  | { type: "decline"; friendshipId: string; userName: string }
  | { type: "block"; userId: string; userName: string }
  | null;

function formatRequestTime(createdAt: string) {
  const date = new Date(createdAt);
  return date.toLocaleString();
}

export function FriendsRequestsClient() {
  const { dictionary: dict } = usePreferences();
  const [payload, setPayload] = useState<RequestsPayload | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/friends/requests?page=${page}&pageSize=20`, {
        method: "GET",
        cache: "no-store",
      }).catch(() => null);

      if (cancelled) return;

      if (!response || !response.ok) {
        setError(dict.friendsSection.requestsError);
        setLoading(false);
        return;
      }

      const data: RequestsPayload = await response.json();
      setPayload(data);
      setLoading(false);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [page, reloadToken]);

  const runAction = async () => {
    if (!pendingAction) return;

    setSubmittingAction(true);
    setError(null);

    const body =
      pendingAction.type === "accept"
        ? { action: "accept_request", friendshipId: pendingAction.friendshipId }
        : pendingAction.type === "decline"
          ? { action: "decline_request", friendshipId: pendingAction.friendshipId }
          : { action: "block_user", targetUserId: pendingAction.userId };

    const response = await fetch("/api/friends/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);

    if (!response || !response.ok) {
      const data = await response?.json().catch(() => null);
      setError(data?.error ?? dict.friendsSection.requestActionError);
      setSubmittingAction(false);
      return;
    }

    setSubmittingAction(false);
    setPendingAction(null);
    setReloadToken((value) => value + 1);
  };

  const hasNextPage =
    payload !== null &&
    (page * payload.pageSize < payload.incomingTotal || page * payload.pageSize < payload.outgoingTotal);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[22px] leading-[1.27] tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">{dict.friendsSection.requestsTitle}</h3>
        <p className="text-sm text-[#615d59]">{dict.friendsSection.requestsDescription}</p>
      </div>

      {error ? <p className="text-sm text-[#dd5b00]">{error}</p> : null}
      {loading && !payload ? <p className="text-sm text-[#615d59]">{dict.friendsSection.loadingRequests}</p> : null}

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-[rgba(0,0,0,0.95)]">{dict.friendsSection.incoming}</h4>
        {!loading && payload && payload.incoming.length === 0 ? (
          <p className="text-sm text-[#615d59]">{dict.friendsSection.noIncoming}</p>
        ) : null}
        {payload?.incoming.map((request) => (
          <div
            key={request.friendshipId}
            className="flex w-full items-center justify-between rounded-[12px] border border-[rgba(0,0,0,0.1)] bg-white px-3 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <UserAvatar name={request.name} avatarSrc={request.avatarSrc} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[rgba(0,0,0,0.95)]">{request.name}</p>
                <p className="text-xs text-[#615d59]">{dict.friendsSection.requestedAt.replace("{{value}}", formatRequestTime(request.createdAt))}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() =>
                  setPendingAction({
                    type: "accept",
                    friendshipId: request.friendshipId,
                    userName: request.name,
                  })
                }
              >
                {dict.friendsSection.accept}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setPendingAction({
                    type: "decline",
                    friendshipId: request.friendshipId,
                    userName: request.name,
                  })
                }
              >
                {dict.friendsSection.decline}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() =>
                  setPendingAction({
                    type: "block",
                    userId: request.userId,
                    userName: request.name,
                  })
                }
              >
                {dict.friendsSection.block}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-[rgba(0,0,0,0.95)]">{dict.friendsSection.outgoing}</h4>
        {!loading && payload && payload.outgoing.length === 0 ? (
          <p className="text-sm text-[#615d59]">{dict.friendsSection.noOutgoing}</p>
        ) : null}
        {payload?.outgoing.map((request) => (
          <div
            key={request.friendshipId}
            className="flex w-full items-center justify-between rounded-[12px] border border-[rgba(0,0,0,0.1)] bg-white px-3 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <UserAvatar name={request.name} avatarSrc={request.avatarSrc} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[rgba(0,0,0,0.95)]">{request.name}</p>
                <p className="text-xs text-[#615d59]">{dict.friendsSection.sentAt.replace("{{value}}", formatRequestTime(request.createdAt))}</p>
              </div>
            </div>
            <span className="rounded-full bg-[#f6f5f4] px-2 py-1 text-xs font-semibold text-[#615d59]">{dict.friendsSection.pendingBadge}</span>
          </div>
        ))}
      </div>

      {payload ? (
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
            {dict.common.previous}
          </Button>
          <Button type="button" variant="outline" disabled={!hasNextPage} onClick={() => setPage((prev) => prev + 1)}>
            {dict.common.next}
          </Button>
        </div>
      ) : null}

      <ConfirmActionDialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
        loading={submittingAction}
        title={
          pendingAction?.type === "accept"
            ? dict.friendsSection.acceptRequestTitle
            : pendingAction?.type === "decline"
              ? dict.friendsSection.declineRequestTitle
              : dict.friendsSection.blockUserTitle
        }
        description={
          pendingAction?.type === "accept"
            ? dict.friendsSection.acceptRequestDescription.replace("{{name}}", pendingAction.userName)
            : pendingAction?.type === "decline"
              ? dict.friendsSection.declineRequestDescription.replace("{{name}}", pendingAction.userName)
              : pendingAction
                ? dict.friendsSection.blockUserDescription.replace("{{name}}", pendingAction.userName)
                : ""
        }
        confirmLabel={
          pendingAction?.type === "accept"
            ? dict.friendsSection.accept
            : pendingAction?.type === "decline"
              ? dict.friendsSection.decline
              : dict.friendsSection.block
        }
        confirmVariant={pendingAction?.type === "block" ? "destructive" : "default"}
        onConfirm={() => void runAction()}
      />
    </div>
  );
}
