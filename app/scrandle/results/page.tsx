"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type ScranResult = {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  numberOfLikes: number;
  numberOfDislikes: number;
  likesPercentage: number;
};

type RoundResult = {
  round: number;
  scranA: ScranResult;
  scranB: ScranResult;
  userChoice: number | null;
  correctChoice: number;
  isCorrect: boolean;
};

type GameResults = {
  date: string;
  score: number;
  totalRounds: number;
  percentage: number;
  results: RoundResult[];
};

export default function ScrandleResults() {
  const [results, setResults] = useState<GameResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const response = await fetch(`/api/scrandle/results?date=${today}`);

        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else if (response.status === 404) {
          setError("Сначала сыграй в игру!");
        } else {
          setError("Не удалось загрузить результаты");
        }
      } catch {
        setError("Произошла ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Загрузка результатов...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="text-center">
          <p className="mb-6 text-xl text-zinc-600 dark:text-zinc-400">
            {error}
          </p>
          <Link
            href="/scrandle"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Играть
          </Link>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="text-xl text-zinc-600 dark:text-zinc-400">
          Нет результатов
        </div>
      </div>
    );
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 80) return "Отлично! Ты настоящий гурман! 🎉";
    if (percentage >= 60) return "Хороший результат! 👍";
    if (percentage >= 40) return "Неплохо, но можно лучше! 😊";
    return "Попробуй еще раз! 🍽️";
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-indigo-600 dark:text-indigo-400";
    if (percentage >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-zinc-900 transition-colors hover:text-indigo-600 dark:text-zinc-50 dark:hover:text-indigo-400"
          >
            ← бебебендл
          </Link>
        </div>

        {/* Score Section */}
        <div className="mb-12 rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-zinc-900">
          <h1 className="mb-4 text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Результаты
          </h1>
          <div className={`mb-4 text-7xl font-black ${getScoreColor(results.percentage)}`}>
            {results.score}/{results.totalRounds}
          </div>
          <p className={`mb-2 text-2xl font-bold ${getScoreColor(results.percentage)}`}>
            {results.percentage}%
          </p>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {getScoreMessage(results.percentage)}
          </p>
        </div>

        {/* Round Results */}
        <div className="space-y-6">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Детали по раундам
          </h2>

          {results.results.map((round) => (
            <div
              key={round.round}
              className={`rounded-xl border-2 p-6 ${
                round.isCorrect
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-red-500 bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Раунд {round.round}
                </span>
                <span
                  className={`rounded-full px-4 py-1 text-sm font-bold ${
                    round.isCorrect
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {round.isCorrect ? "✓ Правильно" : "✗ Неправильно"}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Scran A */}
                <div
                  className={`rounded-lg p-4 ${
                    round.correctChoice === round.scranA.id
                      ? "bg-green-100 dark:bg-green-900/40"
                      : "bg-zinc-100 dark:bg-zinc-800"
                  } ${round.userChoice === round.scranA.id ? "ring-2 ring-indigo-500" : ""}`}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <img
                      src={round.scranA.imageUrl}
                      alt={round.scranA.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-50">
                        {round.scranA.name}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {round.scranA.price.toFixed(2)} ₽
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      👍 {round.scranA.likesPercentage}%
                    </span>
                    {round.userChoice === round.scranA.id && (
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        Твой выбор
                      </span>
                    )}
                    {round.correctChoice === round.scranA.id && (
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        ✓ Большинство
                      </span>
                    )}
                  </div>
                </div>

                {/* Scran B */}
                <div
                  className={`rounded-lg p-4 ${
                    round.correctChoice === round.scranB.id
                      ? "bg-green-100 dark:bg-green-900/40"
                      : "bg-zinc-100 dark:bg-zinc-800"
                  } ${round.userChoice === round.scranB.id ? "ring-2 ring-indigo-500" : ""}`}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <img
                      src={round.scranB.imageUrl}
                      alt={round.scranB.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-50">
                        {round.scranB.name}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {round.scranB.price.toFixed(2)} ₽
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      👍 {round.scranB.likesPercentage}%
                    </span>
                    {round.userChoice === round.scranB.id && (
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        Твой выбор
                      </span>
                    )}
                    {round.correctChoice === round.scranB.id && (
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        ✓ Большинство
+                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Play Again Button */}
        <div className="mt-12 text-center">
          <Link
            href="/scrandle"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Играть снова
          </Link>
        </div>
      </div>
    </div>
  );
}
