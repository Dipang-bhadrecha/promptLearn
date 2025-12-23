export default function ChatContext() {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">

      <section className="rounded-lg bg-[#161616] p-4">
        <p className="text-sm text-neutral-300">
          What is a Docker Compose file?
        </p>
      </section>

      <section className="rounded-lg bg-[#161616] p-4">
        <p className="text-sm text-neutral-300">
          so what is the difference between docker and docker compose?
        </p>
      </section>

      <button className="w-full rounded-lg bg-[#222] py-2 text-sm hover:bg-[#333]">
        Generate follow-up
      </button>

    </div>
  );
}
