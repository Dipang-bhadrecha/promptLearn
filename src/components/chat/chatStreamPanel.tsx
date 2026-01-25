"use client";

import { SidebarTrigger, RightSidebarTrigger } from "../ui/sidebar";
import { useChatStore } from "./chat.store";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { apiRequest } from "@/src/lib/api";

type ChatMessage = { role: "user" | "assistant"; text: string };

export default function ChatStreamPanel() {
  // conversationId now comes from global store
  const conversationId = useChatStore((s) => s.currentConversationId);
  const setConversationId = useChatStore((s) => s.setConversationId);

  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversationId) {
      setHistory([]);
      return;
    }

    async function loadMessages() {
      const data = await apiRequest(`/api/chat/${conversationId}/messages`, {
        method: "GET",
      });

      const formatted = data.map((m: any) => ({
        role: m.role,
        text: m.content,
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
          body: JSON.stringify({ message }),
        });
      }

      setHistory((prev) => [
        ...prev,
        { role: "assistant", text: data.reply },
      ]);
    } catch {
      setHistory((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Error fetching response" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col h-full bg-[#111] text-white">

      {/* Left Sidebar Trigger */}
      <div className="absolute top-3 left-3 z-50">
        <SidebarTrigger />
      </div>

      {/* Right Sidebar Trigger */}
      <div className="absolute top-3 right-3 z-50">
        <RightSidebarTrigger />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
          {history.map((msg, i) => (
            <div
              key={i}
              className={`w-fit max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${msg.role === "user"
                  ? "ml-auto bg-blue-500"
                  : "mr-auto bg-white/10"
                }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          ))}

          {loading && (
            <div className="mr-auto bg-white/10 p-3 rounded-lg">...</div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>


      {/* Input */}
      <div className="p-4">
        <div className="flex gap-3 items-end max-w-3xl mx-auto">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type your message..."
            // className="flex-1 resize-none bg-transparent border border-neutral-700 rounded-lg p-3 text-sm"
            className="flex-1 resize-none bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
          />

          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || loading}
            className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-lg text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
