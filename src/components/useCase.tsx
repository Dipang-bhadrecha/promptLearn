import { GraduationCap, Layers, Lightbulb } from "lucide-react";

export default function UseCases() {
    return (
        <section className="mt-48 px-6">
            {/* Section title */}
            <h3 className="text-center text-4xl md:text-5xl font-medium tracking-wide">
                How people use PromptLearn
            </h3>

            {/* Use cases */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-24 max-w-7xl mx-auto text-center">

                <div className="flex flex-col items-center">
                    <GraduationCap className="h-11 w-11 text-blue-500" />

                    <h4 className="mt-8 text-2xl font-medium tracking-wide text-center">
                        Power study
                    </h4>

                    <p className="mt-6 text-lg leading-relaxed text-black/60 text-left max-w-sm mx-auto">
                        Upload interview notes, documentation, or learning material.
                        Ask PromptLearn to explain complex concepts in simple terms,
                        track follow-up questions, and reinforce understanding over time.
                    </p>
                </div>

                {/* Use case 2 */}
                <div className="flex flex-col items-center">
                    <GraduationCap className="h-11 w-11 text-blue-500" />

                    <h4 className="mt-8 text-2xl font-medium tracking-wide text-center">
                        Organize your thinking
                    </h4>

                    <p className="mt-6 text-lg leading-relaxed text-black/60 text-left max-w-sm mx-auto">
                        Upload your source material and let PromptLearn help you
                        structure ideas, connect related concepts, and build a
                        clear mental model with context-aware notes.
                    </p>
                </div>

                {/* Use case 3 */}
                <div className="flex flex-col items-center">
                    <GraduationCap className="h-11 w-11 text-blue-500" />

                    <h4 className="mt-8 text-2xl font-medium tracking-wide text-center">
                        Spark new ideas
                    </h4>

                    <p className="mt-6 text-lg leading-relaxed text-black/60 text-left max-w-sm mx-auto">
                        Explore ideas by asking questions directly on your notes.
                        Discover gaps in understanding, generate new directions,
                        and uncover insights you wouldn’t notice in linear notes.
                    </p>
                </div>

            </div>
        </section>
    );
}
