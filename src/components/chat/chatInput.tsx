"use client";
import React from "react";
export default function ChatInput({
  onSend,
  loading,
  value,
  onChange,
  inputRef,
}: {
  onSend: (prompt: string) => void;
  loading: boolean;
  value: string;
  onChange: (next: string) => void;
  inputRef?: React.Ref<HTMLTextAreaElement>;
}) {
  function handleSend() {
    if (loading || !value.trim()) return;
    onSend(value);
    onChange("");
  }

  return (
    <div className="p-4">
      <div className="relative max-w-3xl mx-auto">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className="w-full resize-none bg-neutral-900 border border-neutral-700 rounded-lg p-3 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
        />

        <button
          onClick={handleSend}
          disabled={!value.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
