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
  const hasPlayed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

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
          className="block text-center py-3 sm:py-4 text-gray-600 text-xl sm:text-2xl md:text-[2vw] mt-4 sm:mt-6 2xl:mt-8 2xl:px-12 2xl:py-6 4xl:px-16 4xl:py-8 uppercase w-full"
        >
          Уже сыграно
        </button>
        {score !== null && (
          <p className="mt-2 text-xl sm:text-2xl md:text-[2vw] text-white lg:text-black text-center">
            Ваш результат: {score}/10
          </p>
        )}
      </div>
    );
  }

  return (
    <Link
      href="/daily"
      className="block text-center py-3 sm:py-4 lg:text-black hover:text-gray-600 text-xl sm:text-2xl md:text-[2vw] mt-4 sm:mt-6 2xl:mt-8 2xl:px-12 2xl:py-6 4xl:px-16 4xl:py-8 uppercase"
    >
      Дейлик
    </Link>
  );
}
