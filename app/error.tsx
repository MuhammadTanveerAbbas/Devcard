"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative z-10 flex min-h-svh items-center justify-center px-3 py-6">
      <div className="card-surface w-full max-w-[340px] rounded-[1.24rem] border border-black/10 p-6 text-center dark:border-white/10">
        <h1 className="font-display text-base font-semibold text-neutral-900 dark:text-neutral-50">
          Stats could not load
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
          The card data is unavailable right now. Check the API keys in .env.local, then try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 h-10 w-full rounded-xl bg-neutral-900 font-display text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/45 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-white dark:focus-visible:ring-white/55"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
