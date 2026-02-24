"use client";

import Link from "next/link";

export default function DailyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="retro-bg flex min-h-dvh items-center justify-center px-4">
      <div className="retro-overlay absolute inset-0" />
      <div className="relative z-10 text-center">
        <h2 className="pixel-text mb-4 text-3xl font-bold text-white">
          Что-то пошло не так!
        </h2>
        <p className="pixel-text mb-8 text-lg text-white">
          {error.message || "Не удалось загрузить дейлик"}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="pixel-btn bg-yellow-400 border-4 border-black px-6 py-3 text-black hover:bg-yellow-300"
          >
            Попробовать снова
          </button>
          <Link
            href="/"
            className="pixel-btn bg-white border-4 border-black px-6 py-3 text-black hover:bg-gray-100"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
