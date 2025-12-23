import ChatStream from "./chat.stream";
import ChatInput from "./chat.input";
import ChatContext from "./chat.context";

export default function ChatLayout() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#0b0b0b] text-white">

      {/* Main Chat */}
      <div className="flex flex-col flex-1 border-r border-neutral-800">

        <div className="flex-1 overflow-y-auto bg-[#111] overscroll-contain">
          <div className="px-6 py-4">
            <ChatStream />
          </div>
        </div>

        <div className="border-t border-neutral-800 px-6 py-4 bg-[#111]">
          <ChatInput />
        </div>

      </div>

      {/* Right Panel */}
      <div className="w-[360px] border-l border-neutral-800 bg-[#111] flex flex-col">
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-4">
            <ChatContext />
          </div>
        </div>
      </div>

    </div>
  );
}



