// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
    return (
        <main className="min-h-[100svh] bg-[#020617] text-white">
            {/* NAVBAR */}
            <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-4">
                <div className="flex items-center gap-2 ml-4 mt-2">
                    <span className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight">
                        PromptLearn
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-4 text-sm text-white/70">
                    <a href="#how-it-works" className="hover:text-white">
                        How it works
                    </a>
                    {/* <a href="#templates" className="hover:text-white">
            Templates
          </a> */}
                    <button className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                        My Workspaces
                    </button>
                </nav>
            </header>

            {/* HERO SECTION */}
            <section className="relative -mt-16 h-[100svh] overflow-hidden">
                <Image
                    src="/background-landingPage.png"
                    alt="PromptLearn background"
                    fill
                    priority
                    className="object-cover"
                />

                {/* Dark gradient overlay so text pops */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />

                {/* Hero content */}
                <div className="relative z-10 flex h-full w-full items-center justify-center">
                    <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
                        <div className="mb-4 rounded-full bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-wide">
                            AI-powered learning workspace
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2">
                            Learn Faster with
                        </h1>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                            Visual Thinking.
                        </h1>

                        <p className="text-base md:text-lg text-white/80 max-w-2xl mb-8">
                            PromptLearn turns your notes, questions, and ideas into interactive
                            chat + visual mind maps so you truly understand any topic.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Link href="/app">
                                <button className="px-8 py-3 rounded-full bg-white text-black font-semibold text-base md:text-lg hover:scale-105 hover:shadow-lg transition">
                                    Start a Learning Space
                                </button>
                            </Link>

                            <a
                                href="#how-it-works"
                                className="text-sm text-white/70 hover:text-white underline-offset-4 hover:underline"
                            >
                                See how it works ↓
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section
                id="how-it-works"
                className="relative bg-[#020617] border-t border-white/10 py-16 md:py-24 px-6 md:px-12"
            >
                <div className="max-w-5xl mx-auto text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        How PromptLearn works
                    </h2>
                    <p className="text-sm md:text-base text-white/70">
                        Go from raw content to a structured, visual understanding in three simple steps.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
                        <div className="text-xs font-semibold text-white/60 mb-2">
                            STEP 1
                        </div>
                        <h3 className="font-semibold mb-2">Add what you&apos;re learning</h3>
                        <p className="text-sm text-white/70">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
                        <div className="text-xs font-semibold text-white/60 mb-2">
                            STEP 2
                        </div>
                        <h3 className="font-semibold mb-2">Chat to explore & clarify</h3>
                        <p className="text-sm text-white/70">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
                        <div className="text-xs font-semibold text-white/60 mb-2">
                            STEP 3
                        </div>
                        <h3 className="font-semibold mb-2">See the mind map appear</h3>
                        <p className="text-sm text-white/70">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                    </div>
                </div>
            </section>

            {/* USE CASES & TEMPLATES SECTION */}
            {/* <section
        id="templates"
        className="relative bg-[#020617] py-16 md:py-24 px-6 md:px-12"
      >
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Start from a learning template
          </h2>
          <p className="text-sm md:text-base text-white/70">
            Pick a starting pattern instead of staring at a blank page.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h3 className="font-semibold mb-2">Learn a new topic</h3>
            <p className="text-sm text-white/70 mb-3">
              Great for CS concepts, system design, math, or any new domain.
            </p>
            <p className="text-xs text-white/50">
              Example prompt:
              <br />
              &quot;Teach me the basics of event-driven architecture step by step.&quot;
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h3 className="font-semibold mb-2">Deep dive an article / video</h3>
            <p className="text-sm text-white/70 mb-3">
              Paste content, then break it down, question it, and map key ideas.
            </p>
            <p className="text-xs text-white/50">
              Example prompt:
              <br />
              &quot;Here&apos;s a blog on CQRS. Help me extract the big ideas and tradeoffs.&quot;
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h3 className="font-semibold mb-2">Interview prep workspace</h3>
            <p className="text-sm text-white/70 mb-3">
              Collect questions, sample answers, and concepts into one visual map.
            </p>
            <p className="text-xs text-white/50">
              Example prompt:
              <br />
              &quot;Help me build a mind map for Node.js backend interview prep.&quot;
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-12 text-center">
          <Link href="/app">
            <button className="px-8 py-3 rounded-full bg-white text-black font-semibold text-base md:text-lg hover:scale-105 hover:shadow-lg transition">
              Open PromptLearn and start from a template
            </button>
          </Link>
        </div>
      </section> */}

{/* FOOTER HERO SECTION */}
<section className="relative w-full overflow-hidden bg-black">
  <div className="relative w-full aspect-[21/9] max-h-[520px]">
    <Image
      src="/footer-image.png"
      alt="PromptLearn footer background"
      fill
      className="object-cover"
      priority={false}
    />

    {/* subtle dark gradient so text/icons pop */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

    {/* Center logo on the image like Rocket */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="flex items-center gap-3 mb-8">
        {/* replace with your real logo if you have one */}
        <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center text-black font-bold text-lg">
          PL
        </div>
        <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
          PromptLearn
        </span>
      </div>
    </div>

    {/* Bottom row: icons + links + copyright */}
    <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-2 text-xs text-white/70">
      {/* social / nav icons row (fake icons for now) */}
      <div className="flex items-center gap-4 mb-1">
        <button className="h-7 w-7 rounded-full border border-white/30 bg-black/40 text-[10px] flex items-center justify-center hover:bg-white hover:text-black transition">
          X
        </button>
        <button className="h-7 w-7 rounded-full border border-white/30 bg-black/40 text-[10px] flex items-center justify-center hover:bg-white hover:text-black transition">
          in
        </button>
        <button className="h-7 w-7 rounded-full border border-white/30 bg-black/40 text-[10px] flex items-center justify-center hover:bg-white hover:text-black transition">
          GH
        </button>
      </div>

      <div className="flex items-center gap-4 text-[11px]">
        <button className="hover:text-white underline-offset-4 hover:underline">
          Terms
        </button>
        <button className="hover:text-white underline-offset-4 hover:underline">
          Privacy
        </button>
      </div>

      <div className="text-[10px]">
        © {new Date().getFullYear()} PromptLearn. All rights reserved.
      </div>
    </div>
  </div>
</section>

        </main>
    );
}
