"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatNodeCard } from "../node-card";
import { Handle, Position, NodeResizer } from "@xyflow/react";

type ChatMessage = { role: "user" | "assistant"; text: string };

export function PromptNode({ id, data, onFocusRequest, setDisableZoom, selected }: any) {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isChatFocused, setIsChatFocused] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null!);
  const chatAreaRef = useRef<HTMLDivElement>(null!);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  // ✅ Auto-resize textarea with smooth animation
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;

      // Reset height to get accurate scrollHeight
      textarea.style.height = 'auto';

      // Calculate ideal height with constraints
      const scrollHeight = textarea.scrollHeight;
      const minHeight = 44; // Single line height
      const maxHeight = 120; // Max before scrolling

      // Set new height within bounds
      const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
      textarea.style.height = `${newHeight}px`;

      // Handle scrolling when content exceeds max height
      if (scrollHeight > maxHeight) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }
  };

  // Adjust height when text changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [prompt]);

  // Handle chat interactions
  const handleChatDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChatFocused(true);
    setDisableZoom?.(true);
    onFocusRequest?.({ id, data, history });
  };

  // 👈 UPDATED: Enable scrolling when node is selected
  const handleChatWheel = (e: React.WheelEvent) => {
    if (selected && chatAreaRef.current) { // 👈 Changed from isChatFocused to selected
      e.stopPropagation();

      const chatArea = chatAreaRef.current;
      const { scrollTop, scrollHeight, clientHeight } = chatArea;

      // Check if we're at the boundaries
      const atTop = scrollTop === 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight;

      // Only prevent default if we can actually scroll in the direction
      if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
        // Let the default scroll behavior happen for the chat area
        return;
      }

      // If we're at a boundary and trying to scroll further, prevent canvas zoom
      e.preventDefault();
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift + Enter = new line (allow default behavior)
        return;
      } else {
        // Enter alone = send message
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const newHistory: ChatMessage[] = [...history, { role: "user", text: prompt }];
    setHistory(newHistory);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("http://ec2-43-204-150-198.ap-south-1.compute.amazonaws.com:3003/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      let replyText = "";
      if (typeof data.reply === "string") replyText = data.reply;
      else if (data.reply?.parts?.[0]?.text) replyText = data.reply.parts[0].text;
      else replyText = "⚠️ No valid response";

      setHistory((h) => [...h, { role: "assistant", text: replyText }]);
    } catch (err) {
      console.error(err);
      setHistory((h) => [...h, { role: "assistant", text: "⚠️ Error fetching response" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Add NodeResizer - it manages the outer container automatically */}
      <NodeResizer 
        minWidth={300} 
        minHeight={300} 
        isVisible={selected} // Only show when node is selected
      />
      
      <div className="w-full h-full flex flex-col">
        <ChatNodeCard
          history={history}
          loading={loading}
          onChatAreaClick={handleChatDoubleClick}
          onChatWheel={handleChatWheel}
          chatAreaRef={chatAreaRef}
          chatEndRef={chatEndRef}
        >
          {/* Your textarea and button code */}
          <div className="p-3 flex gap-2 items-end bg-gray-50 dark:bg-neutral-800">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="
                flex-1 
                p-3 
                border 
                rounded-lg 
                text-xl 
                bg-white 
                dark:bg-neutral-700 
                dark:border-neutral-600
                resize-none 
                overflow-hidden
                leading-5
                transition-all 
                duration-200 
                ease-in-out
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-500 
                focus:border-transparent
                placeholder:text-gray-400
                dark:placeholder:text-gray-500
              "
              rows={1}
              style={{
                minHeight: '44px',
                maxHeight: '120px',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              className="
                px-4 
                py-2 
                bg-blue-500 
                hover:bg-blue-600 
                disabled:bg-gray-300 
                disabled:cursor-not-allowed
                text-white 
                rounded-lg 
                text-sm 
                font-medium
                transition-colors 
                duration-200 
                shrink-0
                min-h-[44px]
                flex
                items-center
                justify-center
              "
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </ChatNodeCard>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </>
  );
}

