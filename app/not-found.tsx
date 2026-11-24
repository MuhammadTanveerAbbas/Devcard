import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="card-surface relative space-y-5 rounded-2xl border border-black/10 p-7 shadow-xl dark:border-white/10">
          <div className="flex justify-center">
            <p className="font-display text-4xl font-bold leading-none tracking-[-0.04em] text-neutral-900 dark:text-white">
              404
            </p>
          </div>

          <div className="space-y-2 text-center">
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
              href="https://muhammadtanveerabbas.vercel.app/"
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
        </div>
      </div>
    </main>
  );
}
