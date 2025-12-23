const features = [
  {
    title: "Upload your learning material",
    desc: "Paste notes, documents, or prompts into a single workspace.",
  },
  {
    title: "Ask questions inline",
    desc: "Select any sentence and ask questions directly on the text.",
  },
  {
    title: "See knowledge connected",
    desc: "Every answer stays linked to where it came from.",
  },
  {
    title: "Revisit your thinking later",
    desc: "Hover highlights to remember why you asked something.",
  },
];

export default function FeatureStack() {
  return (
    <section className="mt-40 px-6">
      <h2 className="text-center text-2xl font-medium">
        Your AI-Powered Learning Partner
      </h2>

      <div className="mt-20 max-w-3xl mx-auto space-y-20">
        {features.map((f, i) => (
          <div key={i} className="flex gap-8">
            <div className="text-black/40">{String(i + 1).padStart(2, "0")}</div>
            <div>
              <h3 className="text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-black/60">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
