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
                    <button className="px-4 py-2 rounded-full bg-white text-black font-semibold  hover:bg-white/20 transition">
                        My Workspaces
                    </button>

                </nav>
            </header>

            {/* HERO SECTION */}
            <section className="relative -mt-18 h-[100svh] overflow-hidden">
                {/* <Image
                    src="/background-landingPage.png"
                    alt="PromptLearn background"
                    fill
                    priority
                    className="object-cover"
                    style={{ objectPosition: "center 20%" }}
                /> */}

                {/* Dark gradient overlay so text pops */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />

                {/* Hero content */}
                {/* <div className="relative z-10 flex h-full w-full items-center justify-center"> */}
                <div className="relative z-10 flex h-full w-full items-center justify-center pt-24 md:pt-0">

                    <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
                        <div className="mb-4 rounded-full bg-[#00FFD1]/25 px-4 py-1 
                                        text-s font-medium uppercase tracking-wide 
                                        text-[#EFFFF8]">
                            AI-powered learning workspace
                        </div>


                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:pt-5">
                            Learn Faster with
                        </h1>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                            Zero Scrolling.
                        </h1>
                        <h2 className="font-bold md:text-2xl mb-6">
                            connect to your older chat response with zero scroll
                        </h2>

                        <p className="text-base md:text-lg text-white/80 max-w-2xl mb-8 ">
                            PromptLearn is an AI learning platform designed for people who think by asking questions.
                            Instead of forcing learning into a single scrolling chat, PromptLearn turns your interaction with AI into a visual, structured learning flow.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 md:pt-60">
                             {/* <Link href="/app">
                                <button className="px-8 py-3 rounded-full bg-white text-black font-semibold text-base md:text-lg hover:scale-105 hover:shadow-lg transition">
                                    Guest mode
                                </button>
                            </Link> */}
                            <Link href="/app">
                                <button className="px-8 py-3 rounded-full bg-white text-black font-semibold text-base md:text-lg hover:scale-105 hover:shadow-lg transition">
                                    Start a Learning Space
                                </button>
                            </Link>
                            
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section
                id="how-it-works"
                className="relative bg-[#0B1F1A] border-t border-white/10 py-16 md:py-24 px-6 md:px-12"
            >
                <div className="max-w-5xl mx-auto text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        How PromptLearn works
                    </h2>
                    {/* <p className="text-sm md:text-base text-white/70">
                        Go from raw content to a structured, visual understanding in three simple steps.
                    </p> */}
                </div>

                <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
                        <h3 className="font-semibold mb-2">Create Follow-Up Nodes </h3>
                        <p className="text-sm text-white/70">
                            When a follow-up question arises, open a new linked node instead of replacing or scrolling past the original response — your learning context stays intact. 
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
                        <h3 className="font-semibold mb-2">Non-Linear AI Learning Flow</h3>
                        <p className="text-sm text-white/70">
                            Jump between questions without losing your place in the conversation.
                            Instead of a single chat thread, explore ideas in parallel — like thinking on paper, but powered by AI.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
                        <h3 className="font-semibold mb-2">Visual Learning Mind Map</h3>
                        <p className="text-sm text-white/70">
                            Click any node to instantly revisit that exact question and answer, helping you track how your understanding evolved over time.
                        </p>
                    </div>
                </div>
            </section>


            {/* FOOTER HERO SECTION */}
            <section className="relative w-full overflow-hidden bg-black">
                <div className="relative w-full h-[320px] md:h-[280px] lg:h-[340px]">
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
