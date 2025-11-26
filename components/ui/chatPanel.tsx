"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

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
            const res = await fetch("api/chat", {
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Allow mouse wheel scroll inside chat without zooming the canvas
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        const el = chatAreaRef.current;
        if (!el) return;

        const atTop = el.scrollTop === 0;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;

        if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
            // Let the scroll happen
            return;
        }

        // Prevent canvas zoom when trying to scroll beyond limits
        e.preventDefault();
    };

    return (
        <div className="flex flex-col h-full">
            {/* Chat history area */}
            <div
                ref={chatAreaRef}
                onWheel={handleWheel}
                className="flex-1 overflow-y-auto p-3 space-y-3 bg-background/50"
            >
                {history.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-2 rounded-lg max-w-[100%] ${msg.role === "user"
                                ? "ml-auto bg-blue-500 text-white"
                                : "mr-auto bg-muted"
                            }`}
                    >
                       <ReactMarkdown>{msg.text}</ReactMarkdown>
                       {/* {msg.text} */}
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
        </div>
    );
}
