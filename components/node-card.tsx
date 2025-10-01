
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";


export function ChatNodeCard({
  children,
  history = [],
  loading = false,
  onChatAreaClick,
  onChatWheel,
  chatAreaRef,
  chatEndRef,
}: {
  children: React.ReactNode; // This will be your input area
  history: Array<{ role: "user" | "assistant"; text: string }>;
  loading?: boolean;
  onChatAreaClick?: (e: React.MouseEvent) => void;
  onChatWheel?: (e: React.WheelEvent) => void;
  chatAreaRef?: React.RefObject<HTMLDivElement>;
  chatEndRef?: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      className="bg-white dark:bg-neutral-900 border rounded-xl shadow-md flex flex-col overflow-hidden w-full h-full"
    >
      {/* Chat History - Your Design */}
      <div
        ref={chatAreaRef}
        className="flex-1 p-3 space-y-3 overflow-y-auto custom-scroll"
        onDoubleClick={onChatAreaClick}
        onWheel={onChatWheel}
      >
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg text-xl whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-blue-100 dark:bg-blue-800 self-end text-right"
                : "bg-gray-100 dark:bg-neutral-800 text-left"
            }`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        
        {loading && (
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-neutral-800 text-sm">
            Typing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area - Passed as children */}
      {children}

      
    </div>
  );
}



