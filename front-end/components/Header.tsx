"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="relative mb-8">
      <Link
        href="/"
        className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
      >
        ← Back to Home
      </Link>

      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="inline-block bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-200 dark:to-white bg-clip-text text-transparent">
            Study
          </span>
          <span className="inline-block ml-2 text-blue-600 dark:text-blue-400">
            lore
          </span>
        </h1>
        
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 font-medium">
          Focus. Learn. Master.
        </p>
      </div>
    </header>
  );
}
