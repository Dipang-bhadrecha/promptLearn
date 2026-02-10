"use client";
import React, { useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type ChatMessage = { role: "user" | "assistant"; text: string; clientId?: string };

type ErrorInfo = {
  message: string;
};

type SelectionPayload = {
  text: string;
  rect: DOMRect;
  messageIndex?: number;
};

function ChatMessages({
  history,
  loading,
  onSelectionChange,
  error,
  onRetry,
}: {
  history: ChatMessage[];
  loading: boolean;
  onSelectionChange: (selection: SelectionPayload | null) => void;
  error?: ErrorInfo | null;
  onRetry?: (() => void) | undefined;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      onSelectionChange(null);
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      onSelectionChange(null);
      return;
    }

    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    if (!range) {
      onSelectionChange(null);
      return;
    }

    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      onSelectionChange(null);
      return;
    }

    const container = containerRef.current;
    const anchorNode = selection.anchorNode;
    const focusNode = selection.focusNode;
    if (!container || !anchorNode || !focusNode) {
      onSelectionChange(null);
      return;
    }

    if (!container.contains(anchorNode) || !container.contains(focusNode)) {
      onSelectionChange(null);
      return;
    }

    const anchorElement =
      anchorNode.nodeType === Node.ELEMENT_NODE
        ? (anchorNode as Element)
        : (anchorNode.parentElement as Element | null);

    const messageElement = anchorElement?.closest?.("[data-message-index]");
    const messageIndex = messageElement
      ? Number(messageElement.getAttribute("data-message-index"))
      : undefined;

    onSelectionChange({ text, rect, messageIndex });
  }, [onSelectionChange]);

  return (
    <div
      className="flex-1 min-h-0 h-full overflow-y-auto"
      id="chat-messages-container"
      ref={containerRef}
      onMouseUp={handleSelection}
      onKeyUp={handleSelection}
    >
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {history.map((msg, i) => (
          <div
            key={i}
            id={`message-${i}`}
            data-message-index={i}
            className={`w-fit max-w-[75%] p-3 rounded-lg text-sm leading-relaxed scroll-mt-20
              ${msg.role === "user" ? "ml-auto bg-blue-500" : "mr-auto bg-white/10"}
            `}
          >
            <div className="markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="mr-auto bg-white/10 p-3 rounded-lg">...</div>
        )}

        {error && (
          <div className="mr-auto max-w-[75%] rounded-lg bg-white/10 p-3 text-sm leading-relaxed">
            <div className="flex items-center gap-2">
              <span className="text-white/80">{error.message}</span>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 inline-flex items-center gap-2 rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/20 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(ChatMessages);
