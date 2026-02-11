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
      <div className="retro-bg flex min-h-screen items-center justify-center">
        <div className="retro-overlay absolute inset-0" />
        <div className="pixel-text relative z-10 text-2xl font-bold text-white">
          Загрузка...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="retro-bg flex min-h-screen items-center justify-center">
        <div className="retro-overlay absolute inset-0" />
        <div className="relative z-10 text-center">
          <p className="pixel-text mb-4 text-xl text-white">{error}</p>
          <button
            onClick={fetchScrandle}
            className="pixel-btn inline-block bg-yellow-400 border-4 border-black px-6 py-3 text-black text-lg hover:bg-yellow-300"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!scrandleData) {
    return (
      <div className="retro-bg flex min-h-screen items-center justify-center">
        <div className="retro-overlay absolute inset-0" />
        <div className="pixel-text relative z-10 text-xl text-white">
          Нет доступных пар на сегодня
        </div>
      </div>
    );
  }

  const { scranA, scranB } = scrandleData;

  return (
    <div className="retro-bg min-h-screen">
      <div className="retro-overlay absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="pixel-text text-2xl font-bold text-white transition-colors hover:text-yellow-300"
          >
            бебебендл
          </Link>
          <div className="pixel-text text-lg font-medium text-white">
            Раунд {currentRound} из 10
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="pixel-container h-4 w-full overflow-hidden rounded-none bg-zinc-800 p-0">
            <div
              className="h-full bg-yellow-400 transition-all duration-500"
              style={{ width: `${(currentRound / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* VS Header */}
        <div className="mb-8 text-center">
          <h1 className="pixel-text text-4xl font-extrabold text-white sm:text-5xl">
            Что выберешь?
          </h1>
          <p className="pixel-text mt-2 text-lg text-white">
            Выбери то, что нравится людям больше
          </p>
        </div>

        {/* VS Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Scran A */}
          <button
            onClick={() => handleVote(scranA.id)}
            disabled={voting}
            className="pixel-card group relative overflow-hidden rounded-none border-4 border-black bg-white disabled:opacity-50"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={scranA.imageUrl}
                alt={scranA.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h2 className="pixel-text mb-2 text-2xl font-bold text-black">
                {scranA.name}
              </h2>
              <p className="mb-4 text-sm text-zinc-700 line-clamp-2">
                {scranA.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="pixel-text text-xl font-bold text-black">
                  {scranA.price.toFixed(2)} ₽
                </span>
                <span className="pixel-btn rounded-none bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
                  Выбрать
                </span>
              </div>
            </div>
          </button>

          {/* VS Badge */}
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <div className="pixel-btn flex h-20 w-20 items-center justify-center bg-black text-3xl font-black text-white">
              VS
            </div>
          </div>

          {/* Scran B */}
          <button
            onClick={() => handleVote(scranB.id)}
            disabled={voting}
            className="pixel-card group relative overflow-hidden rounded-none border-4 border-black bg-white disabled:opacity-50"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={scranB.imageUrl}
                alt={scranB.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h2 className="pixel-text mb-2 text-2xl font-bold text-black">
                {scranB.name}
              </h2>
              <p className="mb-4 text-sm text-zinc-700 line-clamp-2">
                {scranB.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="pixel-text text-xl font-bold text-black">
                  {scranB.price.toFixed(2)} ₽
                </span>
                <span className="pixel-btn rounded-none bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
                  Выбрать
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Mobile VS Badge */}
        <div className="mt-8 text-center md:hidden">
          <div className="pixel-btn inline-flex h-16 w-16 items-center justify-center bg-black text-2xl font-black text-white">
            VS
          </div>
        </div>
      </div>
    </div>
  );
}
