"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useChatStore } from "@/src/components/chat/chat.store";
import ChatStreamPanel from "@/src/components/chat/chatStreamPanel";

export default function ChatConversationPage() {
  const params = useParams();
  const setConversationId = useChatStore((s) => s.setConversationId);

  useEffect(() => {
    setConversationId(params.id as string);
  }, [params.id]);

  return <ChatStreamPanel />;
}
