"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type ChatMessage = { role: "user" | "assistant"; text: string };

function ChatMessages({ history, loading }: { history: ChatMessage[]; loading: boolean }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {history.map((msg, i) => (
          <div
            key={i}
            className={`w-fit max-w-[80%] p-3 rounded-lg text-sm leading-relaxed 
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
      </div>
    </div>
  );
}

export default React.memo(ChatMessages);
