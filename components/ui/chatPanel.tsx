

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const newHistory: ChatMessage[] = [
      ...history,
      { role: "user", text: prompt },
    ];
    setHistory(newHistory);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3003/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      let replyText = "";
      if (typeof data.reply === "string") replyText = data.reply;
      else if (data.reply?.parts?.[0]?.text)
        replyText = data.reply.parts[0].text;
      else replyText = "⚠️ No valid response";

      setHistory((h) => [...h, { role: "assistant", text: replyText }]);
    } catch (err) {
      console.error(err);
      setHistory((h) => [
        ...h,
        { role: "assistant", text: "⚠️ Error fetching response" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Submit on Enter, newline on Shift+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Arrow-key scrolling inside chat
  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = chatAreaRef.current;
    if (!el) return;

    const scrollDistance = 50;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();
      el.scrollTop -= scrollDistance;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      el.scrollTop += scrollDistance;
    }
  };

  // Smooth and controlled scroll inside chat
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = chatAreaRef.current;
    if (!el) return;

    const atTop = el.scrollTop <= 0;
    const atBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    const delta = e.deltaY;

    // Chat CAN scroll → allow scroll, block canvas
    if ((delta < 0 && !atTop) || (delta > 0 && !atBottom)) {
      e.stopPropagation(); // prevents canvas pan/zoom
      return;
    }

    // Chat CANNOT scroll → block canvas zoom/pan
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col h-full">

      {/* Chat history area */}
      <div
        ref={chatAreaRef}
        onWheel={handleWheel}
        onKeyDown={handleChatKeyDown}
        onMouseDown={(e) => e.stopPropagation()} // allow selection, block drag-start
        tabIndex={0}
        className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 nowheel select-text pointer-events-auto"
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

      {/* Prompt input */}
      <div className="p-3 flex gap-2 items-end border-t border-t-transparent bg-transparent">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg text-base resize-none
                     bg-transparent border-neutral-700 text-white nowheel"
          rows={1}
          style={{ minHeight: "44px", maxHeight: "120px" }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !prompt.trim()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                     disabled:bg-gray-600 disabled:cursor-not-allowed
                     min-h-[44px] flex items-center justify-center"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
