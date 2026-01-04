import { create } from "zustand";

type ChatUIState = {
  contextCollapsed: boolean;
  toggleContext: () => void;
};

export const useChatUIStore = create<ChatUIState>((set) => ({
  contextCollapsed: false,
  toggleContext: () =>
    set((s) => ({ contextCollapsed: !s.contextCollapsed })),
}));
