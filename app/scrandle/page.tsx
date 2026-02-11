"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Scran = {
  id: number;
  imageUrl: string;
  name: string;
  description: string | null;
  price: number;
  numberOfLikes: number;
  numberOfDislikes: number;
};

type ScrandleData = {
  scrandle: {
    id: number;
    date: string;
    scranAId: number;
    scranBId: number;
    roundNumber: number;
  };
  scranA: Scran;
  scranB: Scran;
};

export default function ScrandlePage() {
  const [currentRound, setCurrentRound] = useState(1);
  const [scrandleData, setScrandleData] = useState<ScrandleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");

  const fetchScrandle = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `/api/scrandle?date=${today}&round=${currentRound}`
      );

      if (response.ok) {
        const data = await response.json();
        setScrandleData(data);
        setError("");
      } else if (response.status === 404) {
        // No more rounds, go to results
        window.location.href = "/scrandle/results";
      } else {
        setError("Failed to load scrandle");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  }, [currentRound]);

  useEffect(() => {
    fetchScrandle();
  }, [fetchScrandle]);

  const handleVote = async (chosenScranId: number) => {
    if (!scrandleData || voting) return;

    try {
      setVoting(true);
      const response = await fetch("/api/scrandle/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dailyScrandleId: scrandleData.scrandle.id,
          chosenScranId,
        }),
      });

      if (response.ok) {
        if (currentRound < 10) {
          setCurrentRound((r) => r + 1);
        } else {
          window.location.href = "/scrandle/results";
        }
      } else {
        setError("Failed to record vote");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Загрузка...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="text-center">
          <p className="mb-4 text-xl text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchScrandle}
            className="rounded-full bg-zinc-900 px-6 py-3 font-bold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!scrandleData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="text-xl text-zinc-600 dark:text-zinc-400">
          Нет доступных пар на сегодня
        </div>
      </div>
    );
  }

  const { scranA, scranB } = scrandleData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-zinc-900 transition-colors hover:text-indigo-600 dark:text-zinc-50 dark:hover:text-indigo-400"
          >
            ← бебебендл
          </Link>
          <div className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
            Раунд {currentRound} из 10
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500 dark:bg-indigo-400"
              style={{ width: `${(currentRound / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* VS Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Что выберешь?
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Выбери то, что нравится людям больше
          </p>
        </div>

        {/* VS Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Scran A */}
          <button
            onClick={() => handleVote(scranA.id)}
            disabled={voting}
            className="group relative overflow-hidden rounded-2xl border-4 border-transparent bg-white shadow-xl transition-all hover:scale-105 hover:border-indigo-500 hover:shadow-2xl disabled:opacity-50 disabled:hover:scale-100 dark:bg-zinc-900"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={scranA.imageUrl}
                alt={scranA.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {scranA.name}
              </h2>
              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                {scranA.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {scranA.price.toFixed(2)} ₽
                </span>
                <span className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  Выбрать
                </span>
              </div>
            </div>
          </button>

          {/* VS Badge */}
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 text-3xl font-black text-white shadow-2xl dark:bg-white dark:text-zinc-900">
              VS
            </div>
          </div>

          {/* Scran B */}
          <button
            onClick={() => handleVote(scranB.id)}
            disabled={voting}
            className="group relative overflow-hidden rounded-2xl border-4 border-transparent bg-white shadow-xl transition-all hover:scale-105 hover:border-purple-500 hover:shadow-2xl disabled:opacity-50 disabled:hover:scale-100 dark:bg-zinc-900"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={scranB.imageUrl}
                alt={scranB.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {scranB.name}
              </h2>
              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                {scranB.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {scranB.price.toFixed(2)} ₽
                </span>
                <span className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  Выбрать
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Mobile VS Badge */}
        <div className="mt-8 text-center md:hidden">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-2xl font-black text-white dark:bg-white dark:text-zinc-900">
            VS
          </div>
        </div>
      </div>
    </div>
  );
}
