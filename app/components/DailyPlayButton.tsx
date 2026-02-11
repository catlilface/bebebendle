"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { hasPlayedToday, getTodayResult } from "../lib/cookies";

function subscribe(callback: () => void) {
  // This is a no-op since cookies don't change in real-time
  return () => {};
}

function getSnapshot() {
  if (typeof window === "undefined") return null;
  return hasPlayedToday();
}

function getServerSnapshot() {
  return null;
}

export function DailyPlayButton() {
  const hasPlayed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  // Get score only if played
  let score: number | null = null;
  if (hasPlayed && typeof window !== "undefined") {
    const result = getTodayResult();
    if (result) {
      score = result.score;
    }
  }

  if (hasPlayed) {
    return (
      <div className="mt-4 sm:mt-6 2xl:mt-8">
        <button
          disabled
          className="pixel-btn inline-block bg-gray-500 border-4 border-black px-6 sm:px-8 py-3 sm:py-4 text-black text-base sm:text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl cursor-not-allowed opacity-70 2xl:px-12 2xl:py-6 4xl:px-16 4xl:py-8"
        >
          Уже сыграно ✓
        </button>
        {score !== null && (
          <p className="pixel-text mt-2 text-lg text-white">
            Ваш результат: {score}/10
          </p>
        )}
        <p className="pixel-text mt-1 text-sm text-zinc-300">
          Следующий дейлик завтра
        </p>
      </div>
    );
  }

  return (
    <Link
      href="/daily"
      className="pixel-btn inline-block bg-yellow-400 border-4 border-black px-6 sm:px-8 py-3 sm:py-4 text-black text-base sm:text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl hover:bg-yellow-300 mt-4 sm:mt-6 2xl:mt-8 2xl:px-12 2xl:py-6 4xl:px-16 4xl:py-8"
    >
      Дейлик!
    </Link>
  );
}
