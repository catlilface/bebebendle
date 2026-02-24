"use client";

import Link from "next/link";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="retro-bg flex min-h-dvh items-center justify-center">
      <div className="retro-overlay absolute inset-0" />
      <div className="relative z-10 text-center">
        <p className="pixel-text mb-6 text-xl text-white">{message}</p>
        <Link
          href="/"
          className="pixel-btn inline-block bg-yellow-400 border-4 border-black px-6 py-3 text-black text-lg hover:bg-yellow-300"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
