import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="relative select-none">
          <p
            aria-hidden="true"
            className="font-display text-[110px] font-bold leading-none tracking-[-0.04em] text-neutral-900 opacity-10 sm:text-[150px] dark:text-white"
          >
            404
          </p>
          <p className="absolute inset-0 grid place-items-center font-display text-[110px] font-bold leading-none tracking-[-0.04em] text-neutral-900 sm:text-[150px] dark:text-white">
            404
          </p>
        </div>

        <div className="card-surface relative -mt-6 space-y-5 rounded-2xl border border-black/10 p-7 shadow-xl dark:border-white/10">
          <div className="flex justify-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/10">
              <svg
                className="h-7 w-7 text-neutral-500 dark:text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              Page not found
            </h1>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              This page does not exist or has moved. Head back to the card.
            </p>
          </div>

          <div className="border-t border-black/10 dark:border-white/10" />

          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 font-display text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-white"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              Back to card
            </Link>
            <a
              href="https://themvpguy.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-black/15 font-display text-sm font-medium text-neutral-700 transition-colors hover:bg-black/5 dark:border-white/20 dark:text-neutral-300 dark:hover:bg-white/10"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              Visit portfolio
            </a>
          </div>

          <div className="flex items-center justify-center gap-1.5 font-display text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Still available for work
          </div>
        </div>
      </div>
    </main>
  );
}