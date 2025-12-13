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

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history, loading]);


    const handleSubmit = async () => {
        if (!prompt.trim()) return;

        const newHistory: ChatMessage[] = [...history, { role: "user", text: prompt }];
        setHistory(newHistory);
        setPrompt("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3003/api/chat", { // connecting a local backend server
            // const res = await fetch("/api/chat", { // connecting a online backend server
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

    // Handle prompt input area - submit on Enter, new line on Shift+Enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Handle arrow key scrolling in chat area
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

    return (
        <div className="flex flex-col h-full">
            {/* Chat history area */}
            <div
                ref={chatAreaRef}
                onKeyDown={handleChatKeyDown}
                tabIndex={0}
                className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3"
            >
                {history.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-2 rounded-lg max-w-[100%] ${msg.role === "user"
                                ? "ml-auto bg-blue-500/90 text-white"
                                : "mr-auto bg-white/10 text-white"
                            }`}

                    >
                        <div className="markdown">
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
                    <div className="mr-auto bg-muted p-2 rounded-lg max-w-[80%]">
                        ...
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Prompt input area */}
            <div className="p-3 flex gap-2 items-end border-t border-t-transparent bg-transparent">
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-lg text-base resize-none
                               bg-transparent dark:bg-transparent border-neutral-700 text-white"
                    rows={1}
                    style={{ minHeight: "44px", maxHeight: "120px" }}
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading || !prompt.trim()}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                               disabled:bg-gray-300 disabled:cursor-not-allowed
                               min-h-[44px] flex items-center justify-center"
                >
                    {loading ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
}
