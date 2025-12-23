export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div className="text-2xl font-semibold">PromptLearn</div>

      <nav className="flex items-center gap-6 text-sm text-black/70">
        <a href="#">Overview</a>
        <a href="#">Plans</a>
        <button className="rounded-full border px-4 py-2 text-sm font-medium">
          Get started
        </button>
      </nav>
    </header>
  );
}
