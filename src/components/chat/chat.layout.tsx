import ChatStreamPanel from "./chatStreamPanel";

export default function ChatLayout() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#0b0b0b] text-white">
      <div className="flex flex-col flex-1 overflow-hidden">
        <ChatStreamPanel />
      </div>
    </div>
  );
}
