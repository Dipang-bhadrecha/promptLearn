"use client";

import {
  RightSidebar,
} from "./ui/right-sidebar";
import { useChatStore } from "./chat/chat.store";

export function AppRightSidebar() {
  const history = useChatStore((s) => s.history);
  const notes = useChatStore((s) => s.notes);

  // Filter only user messages
  const userPrompts = history
    .map((msg, index) => ({ msg, index }))
    .filter(({ msg }) => msg.role === "user");

  const scrollToMessage = (index: number) => {
    const element = document.getElementById(`message-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add a highlight effect
      element.classList.add("ring-2", "ring-blue-400", "ring-offset-2", "ring-offset-black");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-blue-400", "ring-offset-2", "ring-offset-black");
      }, 2000);
    }
  };

  return (
    <RightSidebar>
      <div className="p-4 h-full flex flex-col">
        <h2 className="text-sm font-semibold mb-3">
          Prompts list
        </h2>

        {userPrompts.length === 0 ? (
          <div className="text-sm text-sidebar-foreground/60 italic">
            No prompts yet. Start a conversation!
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2 text-sm pr-4">
              {userPrompts.map(({ msg, index }) => (
                <button
                  key={index}
                  onClick={() => scrollToMessage(index)}
                  className="w-full text-left rounded-md bg-sidebar-accent p-2 hover:bg-sidebar-accent/80 transition-colors cursor-pointer"
                >
                  <div className="line-clamp-2">
                    {msg.text}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3">Notes</h3>
          {notes.length === 0 ? (
            <div className="text-sm text-sidebar-foreground/60 italic">
              No notes saved yet.
            </div>
          ) : (
            <div className="space-y-2 text-sm pr-4">
              {notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => {
                    if (note.sourceMessageIndex !== undefined && note.sourceMessageIndex !== null) {
                      scrollToMessage(note.sourceMessageIndex);
                    }
                  }}
                  className="w-full text-left rounded-md bg-sidebar-accent p-2 hover:bg-sidebar-accent/80 transition-colors cursor-pointer"
                >
                  <div className="line-clamp-3">
                    {note.content}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </RightSidebar>
  );
}
