"use client";

import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="retro-bg min-h-dvh">
      <div className="retro-overlay absolute inset-0" />
      <div className="relative z-10 flex flex-col items-center justify-center h-dvh px-4 text-center">
        <h2 className="pixel-text mb-4 text-3xl font-bold text-white">
          Something went wrong!
        </h2>
        <p className="pixel-text mb-8 text-lg text-white">
          {error.message || "Failed to load admin panel"}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="pixel-btn bg-yellow-400 border-4 border-black px-6 py-3 text-black hover:bg-yellow-300"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="pixel-btn bg-white border-4 border-black px-6 py-3 text-black hover:bg-gray-100"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
