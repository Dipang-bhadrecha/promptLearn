"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Handle, Position } from "@xyflow/react";

type ChatMessage = { role: "user" | "assistant"; text: string };

export function PromptNode({ id, data, onFocusRequest, setDisableZoom }: any) {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNodeFocused, setIsNodeFocused] = useState(false);
  const [isChatFocused, setIsChatFocused] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  // Handle node click - disable zoom when clicking on the node
  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isNodeFocused) {
      setIsNodeFocused(true);
      setDisableZoom?.(true);
    }
  };

  // Handle double-click on chat area - enable local scroll only
  const handleChatDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChatFocused(true);
    setDisableZoom?.(true);
    onFocusRequest?.({ id, data, history });
  };

  // Handle wheel events for chat area when focused
  const handleChatWheel = (e: React.WheelEvent) => {
    if (isChatFocused && chatAreaRef.current) {
      // Allow scrolling within the chat area
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

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const newHistory: ChatMessage[] = [...history, { role: "user", text: prompt }];
    setHistory(newHistory);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      let replyText = "";
      if (typeof data.reply === "string") {
        replyText = data.reply;
      } else if (data.reply?.parts?.[0]?.text) {
        replyText = data.reply.parts[0].text;
      } else {
        replyText = "⚠️ No valid response";
      }

      setHistory((h) => [...h, { role: "assistant", text: replyText }]);
    } catch (err) {
      console.error(err);
      setHistory((h) => [...h, { role: "assistant", text: "⚠️ Error fetching response" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={nodeRef}
      className={`bg-white dark:bg-neutral-900 border rounded-xl shadow-md flex flex-col overflow-hidden w-[400px] h-[600px] ${isNodeFocused ? 'ring-2 ring-blue-300' : ''
        }`}
      onClick={handleNodeClick}
    >
      {/* Chat History */}
      <div
        ref={chatAreaRef}
        className={`flex-1 p-3 space-y-3 overflow-y-auto custom-scroll ${isChatFocused ? 'ring-2 ring-blue-300 rounded' : ''
          }`}
        onDoubleClick={handleChatDoubleClick}
        onWheel={handleChatWheel}
      >
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg text-sm whitespace-pre-wrap ${msg.role === "user"
              ? "bg-blue-100 dark:bg-blue-800 self-end text-right"
              : "bg-gray-100 dark:bg-neutral-800 text-left"
              }`}
          >

            {/* format prompt response with markdown */}
            <ReactMarkdown>
              {msg.text}
            </ReactMarkdown>

 
             {/* response formatting attempt v2 like chatgpt working and fix later go with nomrmal one this causing a sligh hang on select and node and move freely into canvas */}
            {/* <div className="max-w-none prose prose-neutral dark:prose-invert font-system">
              <ReactMarkdown

                components={{
                  // Main paragraphs - ChatGPT standard 16px
                  p({ children }) {
                    return (
                      <p className="text-base leading-relaxed mb-4 text-gray-900 dark:text-gray-100 font-normal">
                        {children}
                      </p>
                    );
                  },

                  // Headers with proper hierarchy
                  h1({ children }) {
                    return (
                      <h1 className="text-2xl font-semibold mb-6 mt-8 text-gray-900 dark:text-gray-100 leading-tight">
                        {children}
                      </h1>
                    );
                  },

                  h2({ children }) {
                    return (
                      <h2 className="text-xl font-semibold mb-4 mt-6 text-gray-900 dark:text-gray-100 leading-tight">
                        {children}
                      </h2>
                    );
                  },

                  h3({ children }) {
                    return (
                      <h3 className="text-lg font-medium mb-3 mt-5 text-gray-900 dark:text-gray-100 leading-snug">
                        {children}
                      </h3>
                    );
                  },

                  // Enhanced code component with proper desktop sizing
                    code(props) {
                    const { children, className, node, style, ref, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;

                    if (isInline) {
                      return (
                        <code
                          className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-1.5 py-0.5 rounded font-mono border border-gray-200 dark:border-gray-700"
                          style={{ fontSize: '14px' }}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }

                    return match ? (
                      <div className="my-6">
                        <SyntaxHighlighter
                          style={oneDark as any}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                          customStyle={{
                            fontSize: '14px',
                            lineHeight: '1.43',
                            fontFamily: 'Victor Mono, Consolas, Monaco, Courier New, monospace',
                            margin: 0,
                            padding: '16px',
                            background: '#1e1e1e',
                          }}
                          showLineNumbers={false}
                          wrapLines={true}
                          {...rest}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-x-auto my-6 font-mono">
                        <code
                          className="text-gray-900 dark:text-gray-100"
                          style={{ fontSize: '14px', lineHeight: '1.43' }}
                          {...props}
                        >
                          {children}
                        </code>
                      </pre>
                    );
                  },

                  // Lists with proper spacing
                  ul({ children }) {
                    return (
                      <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-base text-gray-900 dark:text-gray-100">
                        {children}
                      </ul>
                    );
                  },

                  ol({ children }) {
                    return (
                      <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-base text-gray-900 dark:text-gray-100">
                        {children}
                      </ol>
                    );
                  },

                  // List items
                  li({ children }) {
                    return (
                      <li className="leading-relaxed">
                        {children}
                      </li>
                    );
                  },

                  // Blockquotes
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 pl-6 pr-4 py-4 my-6 italic text-base text-gray-700 dark:text-gray-300 rounded-r-lg">
                        {children}
                      </blockquote>
                    );
                  },

                  // Enhanced tables
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
                          {children}
                        </table>
                      </div>
                    );
                  },

                  th({ children }) {
                    return (
                      <th className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {children}
                      </th>
                    );
                  },

                  td({ children }) {
                    return (
                      <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-base text-gray-900 dark:text-gray-100">
                        {children}
                      </td>
                    );
                  },

                  // Strong and emphasis
                  strong({ children }) {
                    return (
                      <strong className="font-semibold text-gray-900 dark:text-gray-100">
                        {children}
                      </strong>
                    );
                  },

                  em({ children }) {
                    return (
                      <em className="italic text-gray-900 dark:text-gray-100">
                        {children}
                      </em>
                    );
                  },

                  // Links
                  a({ children, href, ...props }) {
                    return (
                      <a
                        href={href}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-1 underline-offset-2 transition-colors"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div> */}



          </div>
        ))}
        {loading && (
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-neutral-800 text-sm">
            Typing..
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input + Submit */}
      <div className="border-t p-2 flex gap-2 items-center">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt..."
          className="flex-1 p-2 border rounded-md text-sm bg-transparent"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>

      {/* Flow handles */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
}

