export default function Loading() {
  return (
    <main className="relative z-10 flex min-h-svh items-center justify-center px-3 py-3 sm:py-6">
      <div
        role="status"
        aria-label="Loading stats"
        className="w-full max-w-[340px] px-2 sm:max-w-[356px] sm:px-0"
      >
        <div className="card-surface h-[520px] rounded-[1.24rem] border border-black/10 p-5 dark:border-white/10">
          <div className="mx-auto size-16 rounded-2xl bg-black/[0.06] dark:bg-white/[0.08]" />
          <div className="mx-auto mt-4 h-5 w-2/3 rounded bg-black/[0.06] dark:bg-white/[0.08]" />
          <div className="mx-auto mt-2 h-3 w-1/2 rounded bg-black/[0.06] dark:bg-white/[0.08]" />
          <div className="mx-auto mt-5 h-3 w-4/5 rounded bg-black/[0.06] dark:bg-white/[0.08]" />
          <div className="mt-8 grid grid-cols-3 gap-2">
            <div className="h-12 rounded-lg bg-black/[0.06] dark:bg-white/[0.08]" />
            <div className="h-12 rounded-lg bg-black/[0.06] dark:bg-white/[0.08]" />
            <div className="h-12 rounded-lg bg-black/[0.06] dark:bg-white/[0.08]" />
          </div>
          <div className="mt-6 h-8 rounded-lg bg-black/[0.06] dark:bg-white/[0.08]" />
          <div className="mt-4 h-40 rounded-lg bg-black/[0.06] dark:bg-white/[0.08]" />
        </div>
      </div>
    </main>
  );
}
