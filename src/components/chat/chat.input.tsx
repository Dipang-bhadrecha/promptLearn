export default function ChatInput() {
  return (
    <div className="flex gap-3">
      <textarea
        rows={2}
        placeholder="Ask anything..."
        className="flex-1 resize-none rounded-lg bg-[#0f0f0f] border border-neutral-700 p-3 outline-none"
      />
      <button className="rounded-lg bg-white px-4 py-2 text-black font-medium">
        Send
      </button>
    </div>
  );
}
