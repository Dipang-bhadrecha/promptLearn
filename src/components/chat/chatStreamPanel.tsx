"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { useChatStore } from "./chat.store";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { apiRequest } from "@/src/lib/api";
import { RightSidebarTrigger } from "../ui/right-sidebar";
import ChatMessages from "./chatMessage";
import ChatInput from "./chatInput";


type ChatMessage = { role: "user" | "assistant"; text: string };

export default function ChatStreamPanel() {
  // conversationId now comes from global store
  const conversationId = useChatStore((s) => s.currentConversationId);
  const setConversationId = useChatStore((s) => s.setConversationId);

  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) {
      setHistory([]);
      return;
    }

    async function loadMessages() {
      setHistory([]);

      const data = await apiRequest(`/api/chat/${conversationId}/messages`);

      const formatted = data.map((m: any) => ({
        role: String(m.role || m.sender || "assistant").toLowerCase() === "user"
          ? "user"
          : "assistant",
        text: m.content || ""
      }));


      setHistory(formatted);
    }

    loadMessages();
  }, [conversationId]);


  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  // Send message
  async function handleSubmit() {
    if (!prompt.trim()) return;

    const message = prompt;
    setPrompt("");
    setHistory((prev) => [...prev, { role: "user", text: message }]);
    setLoading(true);

    try {
      let data;

      // If no conversation → create new
      if (!conversationId) {
        data = await apiRequest("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });

        // backend returns new conversation id
        setConversationId(data.conversationId);
      }
      // Else send to existing
      else {
        data = await apiRequest(`/api/chat/${conversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: message }),
        });
      }

      setHistory((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setHistory((prev) => [...prev, { role: "assistant", text: "⚠️ Error fetching response" },]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col h-full bg-[#0f0f0f] text-white">

      <div className="absolute top-3 left-3 z-50">
        <SidebarTrigger />
      </div>

      <div className="absolute top-3 right-3 z-50">
        <RightSidebarTrigger />
      </div>

      <ChatMessages history={history} loading={loading} />

      <ChatInput
        loading={loading}
        onSend={async (message) => {
          setHistory((prev) => [...prev, { role: "user", text: message }]);
          setLoading(true);

          try {
            let data;
            if (!conversationId) {
              data = await apiRequest("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: message }),
              });
              setConversationId(data.conversationId);
            } else {
              data = await apiRequest(`/api/chat/${conversationId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: message }),
              });
            }

            setHistory((prev) => [...prev, { role: "assistant", text: data.reply }]);
          } catch {
            setHistory((prev) => [...prev, { role: "assistant", text: "⚠️ Error" }]);
          } finally {
            setLoading(false);
          }
        }}
      />

    </div>
  );
}
