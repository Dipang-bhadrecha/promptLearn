"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/api";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.id as string;

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await apiRequest(`/api/chat/${conversationId}/messages`, {
          method: "GET",
        });
        setMessages(data);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, [conversationId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="chat-window">
      {messages.map((msg) => (
        <div key={msg.id}>
          <b>{msg.role}:</b> {msg.content}
        </div>
      ))}
    </div>
  );
}
