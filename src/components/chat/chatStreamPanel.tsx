"use client";

import { RightSidebarTrigger, SidebarTrigger } from "../ui/sidebar";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { apiRequest } from "@/src/lib/api";

type ChatMessage = { role: "user" | "assistant"; text: string };

export default function ChatStreamPanel({ conversationId }: { conversationId: string }) {
    const [prompt, setPrompt] = useState("");
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const chatAreaRef = useRef<HTMLDivElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history, loading]);

    //   async function handleSubmit() {
    //     if (!prompt.trim()) return;
    //     const userMessage = prompt;
    //     setHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    //     setPrompt("");
    //     setLoading(true);

    //     try {
    //     //   const data = await apiRequest(`/api/chat/`, {
    //       const data = await fetch("http://localhost:3003/api/chat", {

    //         method: "POST",
    //         body: JSON.stringify({ message: userMessage }),
    //       });

    //       setHistory((prev) => [...prev, { role: "assistant", text: data.reply }]);
    //     } catch {
    //       setHistory((prev) => [
    //         ...prev,
    //         { role: "assistant", text: "⚠️ Error fetching response" },
    //       ]);
    //     } finally {
    //       setLoading(false);
    //     }
    //   }
    const handleSubmit = async () => {
        if (!prompt.trim()) return;

        setHistory((prev) => [...prev, { role: "user", text: prompt }]);
        setPrompt("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3003/api/chat", {
                //   const res = await fetch("api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
                credentials: "include",
            });

            const data = await res.json();
            const replyText =
                data?.reply?.parts?.[0]?.text ??
                data?.reply ??
                "⚠️ No valid response";

            setHistory((prev) => [...prev, { role: "assistant", text: replyText }]);
        } catch (err) {
            console.error(err);
            setHistory((prev) => [
                ...prev,
                { role: "assistant", text: "⚠️ Error fetching response" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col h-full bg-[#111] text-white">

            {/* LEFT sidebar trigger */}
            <div className="absolute top-3 left-3 z-50">
                <SidebarTrigger />
            </div>

            {/* RIGHT sidebar trigger - floating top-right */}
            <div className="absolute top-3 right-3 z-50">
                <RightSidebarTrigger />
            </div>

            {/* Messages */}
            <div
                ref={chatAreaRef}
                className="flex-1 overflow-y-auto px-20 py-10 space-y-4"
            >
                {history.map((msg, i) => (
                    <div
                        key={i}
                        className={`max-w-[60%] p-2 rounded-lg ${msg.role === "user"
                                ? "ml-auto bg-blue-500"
                                : "mr-auto bg-white/10"
                            }`}
                    >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                        >
                            {msg.text}
                        </ReactMarkdown>
                    </div>
                ))}

                {loading && (
                    <div className="mr-auto bg-white/10 p-3 rounded-lg">...</div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4">
                <div className="flex gap-3 items-end max-w-3xl mx-auto">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 resize-none bg-transparent border border-neutral-700 rounded-lg p-3 text-sm"
                        rows={1}
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={!prompt.trim() || loading}
                        className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-lg text-sm font-medium"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
