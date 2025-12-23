import Link from "next/link";

export default function Hero() {
    return (
        <section className="flex flex-col items-center text-center px-6 pt-24">
            <h1 className="text-6xl md:text-7xl font-semibold tracking-tight">
                Understand{" "}
                <span className="bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
                    Anything
                </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-black/60">
                PromptLearn is your thinking workspace — ask questions inline,
                connect ideas, and build understanding without losing context.
            </p>

            <div>
                <Link href="/app">
                    <button className="mt-10 rounded-full bg-black px-10 py-5 text-white text-xl font-medium">
                        Try PromptLearn
                    </button>
                </Link> 
            </div>
            
        </section>
    );
}
