import ChatMessage from "./chat.message";
import { useSidebar } from "../ui/sidebar";
import { PanelLeft } from "lucide-react";
import { ChatPanel } from "../ui/chatPanel";

export default function ChatStream() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="relative min-h-screen">

      {/* Header */}
      <div className="absolute left-0 top-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-slate-800 transition cursor-pointer"
          title="Toggle sidebar"
        >
          <PanelLeft className="w-5 h-5 text-slate-300 hover:text-white" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="mx-auto max-w-3xl space-y-6 pt-16">
        <ChatPanel />
      </div>
    </div>
    
  );
}