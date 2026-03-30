import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-svh flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="w-full max-w-sm mx-auto text-center space-y-8">

        {/* Glitchy 404 number */}
        <div className="relative select-none">
          <p
            className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter text-black dark:text-white opacity-5"
            aria-hidden="true"
          >
            404
          </p>
          <p className="absolute inset-0 flex items-center justify-center text-[120px] sm:text-[160px] font-black leading-none tracking-tighter text-black dark:text-white">
            404
          </p>
        </div>

        {/* Card  matches profile card style */}
        <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-xl p-8 space-y-5 -mt-8">

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/10 border border-black/8 dark:border-white/10 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-black/40 dark:text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-black dark:text-white tracking-tight">
              Page not found
            </h1>
            <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed">
              This page doesn't exist or was moved. Head back to the card.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-black/8 dark:border-white/8" />

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 h-9 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-black/90 dark:hover:bg-white/90 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back to card
            </Link>
            <a
              href="https://themvpguy.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 h-9 rounded-xl border border-black/20 dark:border-white/20 text-black/70 dark:text-white/70 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Visit portfolio
            </a>
          </div>

          {/* Status badge */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Still available for work
          </div>
        </div>

      </div>
    </main>
  )
}
