export default function Footer() {
  return (
    <footer className="mt-48 border-t px-8 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        
        {/* Brand */}
        <div>
          <div className="text-xl font-bold">PromptLearn</div>
          {/* <p className="mt-2 max-w-sm text-sm text-black/50">
            A thinking workspace that helps you learn by asking better questions
            — and remembering why you asked them.
          </p> */}
        </div>
      </div>

      <div className="mt-12 text-center text-xs text-black/40">
        © {new Date().getFullYear()} PromptLearn. All rights reserved.
      </div>
    </footer>
  );
}
