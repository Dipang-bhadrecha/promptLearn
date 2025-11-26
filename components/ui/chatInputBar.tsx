"use client";

import React, { useRef, useState, useEffect } from "react";

export function ChatInputBar() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
      el.style.overflowY = el.scrollHeight > 120 ? "auto" : "hidden";
    }
  }, [prompt]);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    // You can lift this state up later to integrate with ChatPanel
    setPrompt("");
  };

 const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
};

  return (
    <div className="p-3 flex gap-2 items-end border-t bg-background">
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="
          flex-1 p-2 border rounded-lg text-sm resize-none
          bg-white dark:bg-neutral-800 dark:border-neutral-700
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
        rows={1}
        style={{ minHeight: "44px", maxHeight: "120px" }}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !prompt.trim()}
        className="
          px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
          disabled:bg-gray-300 disabled:cursor-not-allowed
          min-h-[44px] flex items-center justify-center
        "
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
}
