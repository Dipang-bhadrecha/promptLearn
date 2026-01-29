"use client";
import { useState } from "react";

export default function ChatInput({
  onSend,
  loading,
}: {
  onSend: (prompt: string) => void;
  loading: boolean;
}) {
  const [prompt, setPrompt] = useState("");

  function handleSend() {
    if (!prompt.trim()) return;
    onSend(prompt);
    setPrompt("");
  }

  return (
    <div className="p-4">
      <div className="flex gap-3 items-end max-w-3xl mx-auto">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 resize-none bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
        />

        <button
          onClick={handleSend}
          disabled={!prompt.trim() || loading}
          className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
