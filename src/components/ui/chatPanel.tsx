"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type ChatMessage = { role: "user" | "assistant"; text: string };

export function ChatPanel() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const chatAreaRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setHistory((prev) => [...prev, { role: "user", text: prompt }]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3003/api/chat", {
      // const res = await fetch("api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        credentials: "include",
      });

      const data = await res.json();
      const replyText =
        data?.reply?.parts?.[0]?.text ??
        data?.reply ??
        "⚠️ No valid response";

      setHistory((prev) => [...prev, { role: "assistant", text: replyText }]);
    } catch (err) {
      console.error(err);
      setHistory((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Error fetching response" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Submit on Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Arrow-key scroll inside chat
  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = chatAreaRef.current;
    if (!el) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      el.scrollTop -= 50;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      el.scrollTop += 50;
    }
  };

  // Mouse wheel scrolling inside chat ONLY
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = chatAreaRef.current;
    if (!el) return;

    const delta = e.deltaY;
    const atTop = el.scrollTop <= 0;
    const atBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    if ((delta < 0 && !atTop) || (delta > 0 && !atBottom)) {
      e.stopPropagation(); // block canvas scroll
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="flex flex-col h-full nodrag nopan nowheel">
      {/* CHAT HISTORY */}
      <div
        ref={chatAreaRef}
        onWheel={handleWheel}
        onKeyDown={handleChatKeyDown}
        onMouseDown={(e) => {
          if (e.button === 0) e.stopPropagation(); // left-click: block drag
        }}
        tabIndex={0}
        className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 select-text pointer-events-auto"
        style={{ userSelect: "text" }}
      >
        {history.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[100%] ${
              msg.role === "user"
                ? "ml-auto bg-blue-500/90 text-white"
                : "mr-auto bg-white/10 text-white"
            }`}
          >
            <div className="markdown text-sm leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="mr-auto bg-white/10 text-white p-2 rounded-lg max-w-[80%]">
            ...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* PROMPT INPUT */}
      <div className="p-3 flex gap-2 items-end border-t border-t-transparent bg-transparent">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg text-base resize-none bg-transparent border-neutral-700 text-white"
          rows={1}
          style={{ minHeight: "44px", maxHeight: "120px" }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !prompt.trim()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed min-h-[44px]"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
