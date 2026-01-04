export default function ChatInput() {
  return (
    <div className="relative flex items-end w-full max-w-3xl mx-auto bg-[#0f0f0f] border border-neutral-700 rounded-2xl p-2 focus-within:border-neutral-500 transition-colors">
      
      <textarea
        rows={1}
        placeholder="Ask anything..."
        className="flex-1 max-h-60 resize-none bg-transparent p-3 pb-4 outline-none text-white placeholder-neutral-500"
        onInput={(e) => {
          e.currentTarget.style.height = 'auto';
          e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
        }}
      />

      <div className="pb-1 pr-1">
        <button 
          className="flex items-center justify-center cursor-pointer h-10 w-10 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 disabled:bg-neutral-600"
        >
          {/* Using a simple Arrow or Send icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-5 h-5"
          >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}