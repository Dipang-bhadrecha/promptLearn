import { create } from "zustand";

export type ChatMessage = { role: "user" | "assistant"; text: string; clientId?: string };

export type ChatNote = {
  id: number;
  content: string;
  sourceMessageIndex?: number | null;
  createdAt?: string;
};

type ChatState = {
  currentConversationId: string | null;
  setConversationId: (id: string | null) => void;
  history: ChatMessage[];
  setHistory: (history: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  notes: ChatNote[];
  setNotes: (notes: ChatNote[] | ((prev: ChatNote[]) => ChatNote[])) => void;
  addNote: (note: ChatNote) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  currentConversationId: null,
  setConversationId: (id) => set({ currentConversationId: id }),
  history: [],
  setHistory: (history) => set((state) => ({
    history: typeof history === 'function' ? history(state.history) : history
  })),
  notes: [],
  setNotes: (notes) => set((state) => ({
    notes: typeof notes === 'function' ? notes(state.notes) : notes
  })),
  addNote: (note) => set((state) => ({
    notes: [note, ...state.notes]
  })),
}));
