"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { useChatStore, type ChatMessage } from "./chat.store";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiRequest } from "@/src/lib/api";
import { RightSidebarTrigger } from "../ui/right-sidebar";
import ChatMessages from "./chatMessage";
import ChatInput from "./chatInput";

type SelectionState = {
  text: string;
  messageIndex?: number;
  x: number;
  y: number;
};

export default function ChatStreamPanel() {
  // conversationId now comes from global store
  const conversationId = useChatStore((s) => s.currentConversationId);
  const setConversationId = useChatStore((s) => s.setConversationId);
  const history = useChatStore((s) => s.history);
  const setHistory = useChatStore((s) => s.setHistory);
  const setNotes = useChatStore((s) => s.setNotes);
  const addNote = useChatStore((s) => s.addNote);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [followupOpen, setFollowupOpen] = useState(false);
  const [followupPrompt, setFollowupPrompt] = useState("");
  const [followupHistory, setFollowupHistory] = useState<ChatMessage[]>([]);
  const [followupLoading, setFollowupLoading] = useState(false);
  const [mainError, setMainError] = useState<string | null>(null);
  const [followupError, setFollowupError] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [lastFailedFollowup, setLastFailedFollowup] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const followupInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!conversationId) {
      setHistory([]);
      setNotes([]);
      return;
    }

    async function loadMessages() {
      setHistory([]);

      const data = await apiRequest(`/api/chat/${conversationId}/messages`);

      const formatted = data.map((m: any) => ({
        role: String(m.role || m.sender || "assistant").toLowerCase() === "user"
          ? "user"
          : "assistant",
        text: m.content || ""
      }));


      setHistory(formatted);
    }

    loadMessages();

    async function loadNotes() {
      try {
        const noteData = await apiRequest(`/api/chat/${conversationId}/notes`);
        const formattedNotes = noteData.map((note: any) => ({
          id: Number(note.id),
          content: String(note.content || ""),
          sourceMessageIndex:
            note.source_message_index ?? note.sourceMessageIndex ?? null,
          createdAt: note.created_at ?? note.createdAt,
        }));
        setNotes(formattedNotes);
      } catch {
        setNotes([]);
      }
    }

    loadNotes();
  }, [conversationId]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!popupRef.current) {
        setSelection(null);
        return;
      }
      if (popupRef.current.contains(event.target as Node)) return;
      setSelection(null);
    };

    const handleScroll = () => setSelection(null);

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  async function postMessage(message: string) {
    if (!conversationId) {
      const data = await apiRequest("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message }),
      });
      setConversationId(data.conversationId);
      return data.reply as string;
    }

    const data = await apiRequest(`/api/chat/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
    });
    return data.reply as string;
  }

  function removeMessageByClientId(list: ChatMessage[], clientId: string) {
    return list.filter((item) => item.clientId !== clientId);
  }

  function generateClientId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  async function sendMessage(message: string) {
    if (loading) return;
    const clientId = generateClientId();
    setHistory((prev) => [...prev, { role: "user", text: message, clientId }]);
    setLoading(true);
    setMainError(null);
    try {
      const reply = await postMessage(message);
      setHistory((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMainError("Request failed. Please try again.");
      setLastFailedPrompt(message);
      setHistory((prev) => removeMessageByClientId(prev, clientId));
    } finally {
      setLoading(false);
    }
  }

  async function sendFollowup(message: string) {
    if (followupLoading) return;
    const clientId = generateClientId();
    setHistory((prev) => [...prev, { role: "user", text: message, clientId }]);
    setFollowupHistory((prev) => [...prev, { role: "user", text: message, clientId }]);
    setFollowupLoading(true);
    setFollowupError(null);
    try {
      const reply = await postMessage(message);
      setHistory((prev) => [...prev, { role: "assistant", text: reply }]);
      setFollowupHistory((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setFollowupError("Request failed. Please try again.");
      setLastFailedFollowup(message);
      setHistory((prev) => removeMessageByClientId(prev, clientId));
      setFollowupHistory((prev) => removeMessageByClientId(prev, clientId));
    } finally {
      setFollowupLoading(false);
    }
  }

  const handleSelectionChange = useCallback((data: { text: string; rect: DOMRect; messageIndex?: number } | null) => {
    if (!data) {
      setSelection(null);
      return;
    }

    const popupWidth = 240;
    const centerX = data.rect.left + data.rect.width / 2;
    const left = Math.min(
      Math.max(12, centerX - popupWidth / 2),
      window.innerWidth - popupWidth - 12
    );
    const top = Math.max(12, data.rect.top - 44);

    setSelection({
      text: data.text,
      messageIndex: data.messageIndex,
      x: left,
      y: top,
    });
  }, []);

  const handleAskFollowup = () => {
    if (!selection) return;
    setFollowupOpen(true);
    setFollowupPrompt(selection.text);
    setTimeout(() => {
      followupInputRef.current?.focus();
    }, 0);
    sendFollowup(selection.text);
    setFollowupPrompt("");
    setSelection(null);
  };

  const handleSaveNote = async () => {
    if (!selection || !conversationId) {
      setSelection(null);
      return;
    }

    try {
      const note = await apiRequest(`/api/chat/${conversationId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: selection.text,
          sourceMessageIndex: selection.messageIndex ?? null,
        }),
      });

      addNote({
        id: Number(note.id),
        content: String(note.content || selection.text),
        sourceMessageIndex:
          note.source_message_index ?? note.sourceMessageIndex ?? selection.messageIndex ?? null,
        createdAt: note.created_at ?? note.createdAt,
      });
    } catch {
      // no-op
    } finally {
      setSelection(null);
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-[#0f0f0f] text-white">

      <div className="absolute top-3 left-3 z-50">
        <SidebarTrigger />
      </div>

      <div className="absolute top-3 right-3 z-50">
        <RightSidebarTrigger />
      </div>

      <div className="flex-1 min-h-0 px-4">
        {history.length === 0 && !loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-6">
            <h2 className="text-2xl font-semibold text-white/90">Start Learning—One Thought. One Screen. Zero Scroll</h2>
            <div className="w-full max-w-2xl">
              <ChatInput
                loading={loading}
                value={prompt}
                onChange={setPrompt}
                inputRef={inputRef}
                onSend={async (message) => {
                  if (!message.trim()) return;
                  setPrompt("");
                  await sendMessage(message);
                }}
              />
            </div>
          </div>
        ) : (
          <div className={`${followupOpen ? "grid grid-cols-2 gap-4 h-full" : "h-full"}`}>
            <div className="min-h-0 h-full flex flex-col min-w-0">
              <ChatMessages
                history={history}
                loading={loading}
                onSelectionChange={handleSelectionChange}
                error={mainError ? { message: mainError } : null}
                onRetry={
                  lastFailedPrompt
                    ? () => {
                        const retryPrompt = lastFailedPrompt;
                        setMainError(null);
                        setLastFailedPrompt(null);
                        sendMessage(retryPrompt);
                      }
                    : undefined
                }
              />
            </div>

            {followupOpen && (
              <div className="min-h-0 h-full border-l border-white/10 pl-4 flex flex-col min-w-0">
                <div className="flex items-center gap-2 px-2 pt-4">
                  <h3 className="text-sm font-semibold">Follow-up</h3>
                  <button
                    onClick={() => {
                      setFollowupOpen(false);
                      setFollowupHistory([]);
                      setFollowupPrompt("");
                    }}
                    className="text-xs rounded-md bg-white/10 px-2 py-1 hover:bg-white/20 transition-colors"
                  >
                    Close
                  </button>
                </div>

                <div className="flex-1 min-h-0 flex flex-col">
                  <ChatMessages
                    history={followupHistory}
                    loading={followupLoading}
                    onSelectionChange={() => null}
                    error={followupError ? { message: followupError } : null}
                    onRetry={
                      lastFailedFollowup
                        ? () => {
                            const retryPrompt = lastFailedFollowup;
                            setFollowupError(null);
                            setLastFailedFollowup(null);
                            sendFollowup(retryPrompt);
                          }
                        : undefined
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selection && (
        <div
          ref={popupRef}
          style={{ left: selection.x, top: selection.y }}
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          className="fixed z-50 flex items-center gap-2 rounded-lg border border-white/10 bg-neutral-900 px-2 py-1 text-xs shadow-lg"
        >
          <button
            onClick={handleAskFollowup}
            className="rounded-md bg-white/10 px-2 py-1 hover:bg-white/20 transition-colors"
          >
            Ask followup
          </button>
          <button
            onClick={handleSaveNote}
            className="rounded-md bg-white/10 px-2 py-1 hover:bg-white/20 transition-colors"
          >
            Save to note as a /
          </button>
        </div>
      )}

      {history.length > 0 || loading ? (
        <div className="px-4 pb-4">
          <div className={`${followupOpen ? "grid grid-cols-2 gap-4" : ""}`}>
            <div className="min-w-0">
              <ChatInput
                loading={loading}
                value={prompt}
                onChange={setPrompt}
                inputRef={inputRef}
                onSend={async (message) => {
                  if (!message.trim()) return;
                  setPrompt("");
                  await sendMessage(message);
                }}
              />
            </div>

            {followupOpen && (
              <div className="min-w-0">
                <ChatInput
                  loading={followupLoading}
                  value={followupPrompt}
                  onChange={setFollowupPrompt}
                  inputRef={followupInputRef}
                  onSend={async (message) => {
                    if (!message.trim()) return;
                    setFollowupPrompt("");
                    await sendFollowup(message);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ) : null}

    </div>
  );
}
