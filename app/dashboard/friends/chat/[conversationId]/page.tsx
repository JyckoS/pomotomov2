"use client";

import { useParams } from "next/navigation";

import { ConversationClient } from "@/components/dashboard/friends/conversation-client";

export default function ConversationPage() {
  const params = useParams<{ conversationId: string }>();
  const conversationId = params?.conversationId;

  if (!conversationId) {
    return <p className="text-sm text-notion-orange dark:text-[#ff8f63]">Conversation was not found.</p>;
  }

  return <ConversationClient conversationId={conversationId} />;
}
