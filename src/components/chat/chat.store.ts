import { create } from "zustand";

type ChatState = {
  currentConversationId: string | null;
  setConversationId: (id: string | null) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  currentConversationId: null,
  setConversationId: (id) => set({ currentConversationId: id }),
}));
