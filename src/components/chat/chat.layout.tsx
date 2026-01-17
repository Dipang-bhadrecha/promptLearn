import ChatStream from "./chat.stream";
import ChatContext from "./chat.context";
import { useChatUIStore } from "./chat-ui.store";
import { PanelRight } from "lucide-react";

export default function ChatLayout() {
  const { contextCollapsed, toggleContext } = useChatUIStore();

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#0b0b0b] text-white">

      {/* Main Chat */}
      <div className="flex flex-col flex-1 border-r border-neutral-800">

        <div className="flex-1 overflow-y-auto bg-[#111] overscroll-contain">
          <div className="px-6 py-4">
            <ChatStream />
          </div>
        </div>

      </div>
      

      {/* Right Panel */}
     <div
        className={`bg-[#111] border-l border-neutral-800 flex flex-col transition-all duration-300 ease-in-out
        ${contextCollapsed ? "w-[56px]" : "w-[360px]"}`}
      >

         {contextCollapsed && (
          <div className="flex flex-col items-center justify-center h-full">
            <button
              onClick={toggleContext}
              className="p-3 hover:bg-slate-800 rounded-lg"
              title="Open context"
            >
              <PanelRight className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        )} 

        {/* content area */}
        {!contextCollapsed && (
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-4">
              <ChatContext />
            </div>
          </div>
        )}

      </div>

    </div>
  );
}



