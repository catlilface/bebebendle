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
      <div className="retro-bg flex min-h-screen items-center justify-center">
        <div className="retro-overlay absolute inset-0" />
        <div className="pixel-text relative z-10 text-2xl font-bold text-white">
          Загрузка результатов...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="retro-bg flex min-h-screen items-center justify-center">
        <div className="retro-overlay absolute inset-0" />
        <div className="relative z-10 text-center">
          <p className="pixel-text mb-6 text-xl text-white">{error}</p>
          <Link
            href="/scrandle"
            className="pixel-btn inline-block bg-yellow-400 border-4 border-black px-8 py-4 text-lg font-bold text-black hover:bg-yellow-300"
          >
            Играть
          </Link>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="retro-bg flex min-h-screen items-center justify-center">
        <div className="retro-overlay absolute inset-0" />
        <div className="pixel-text relative z-10 text-xl text-white">
          Нет результатов
        </div>
      </div>
    );
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 80) return "Отлично! Ты настоящий гурман!";
    if (percentage >= 60) return "Хороший результат!";
    if (percentage >= 40) return "Неплохо, но можно лучше!";
    return "Увы";
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    if (percentage >= 40) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="retro-bg min-h-screen">
      <div className="retro-overlay absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 h-screen overflow-y-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="pixel-text text-2xl font-bold text-white transition-colors hover:text-yellow-300"
          >
            бебебендл
          </Link>
        </div>

        {/* Score Section */}
        <div className="pixel-container mb-12 rounded-none bg-zinc-900/80 p-8 text-center">
          <h1 className="pixel-text mb-4 text-4xl font-extrabold text-white sm:text-5xl">
            Результаты
          </h1>
          <div
            className={`pixel-text mb-4 text-7xl font-black ${getScoreColor(results.percentage)}`}
          >
            {results.score}/{results.totalRounds}
          </div>
          <p
            className={`pixel-text mb-2 text-2xl font-bold ${getScoreColor(results.percentage)}`}
          >
            {results.percentage}%
          </p>
          <p className="pixel-text text-lg text-white">
            {getScoreMessage(results.percentage)}
          </p>
        </div>

        {/* Round Results */}
        <div className="space-y-6">
          <h2 className="pixel-text mb-6 text-2xl font-bold text-white">
            Детали по раундам
          </h2>

          {results.results.map((round) => (
            <div
              key={round.round}
              className={`pixel-container rounded-none border-4 p-6 ${
                round.isCorrect
                  ? "border-green-500 bg-green-900/40"
                  : "border-red-500 bg-red-900/40"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="pixel-text text-lg font-bold text-white">
                  Раунд {round.round}
                </span>
                <span
                  className={`pixel-btn px-4 py-1 text-sm font-bold ${
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
                  className={`pixel-card rounded-none p-4 ${
                    round.correctChoice === round.scranA.id
                      ? "bg-green-100"
                      : "bg-white"
                  } ${round.userChoice === round.scranA.id ? "ring-4 ring-yellow-400" : ""}`}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <img
                      src={round.scranA.imageUrl}
                      alt={round.scranA.name}
                      className="h-16 w-16 rounded-none border-2 border-black object-cover"
                    />
                    <div>
                      <p className="pixel-text font-bold text-white">
                        {round.scranA.name}
                      </p>
                      <p className="pixel-text text-sm text-white">
                        {round.scranA.price.toFixed(2)} ₽
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="pixel-text text-sm text-white">
                      👍 {round.scranA.likesPercentage}%
                    </span>
                    {round.userChoice === round.scranA.id && (
                      <span className="pixel-text text-sm font-bold text-yellow-600">
                        Твой выбор
                      </span>
                    )}
                    {round.correctChoice === round.scranA.id && (
                      <span className="pixel-text text-sm font-bold text-green-600">
                        ✓ Большинство
                      </span>
                    )}
                  </div>
                </div>

                {/* Scran B */}
                <div
                  className={`pixel-card rounded-none p-4 ${
                    round.correctChoice === round.scranB.id
                      ? "bg-green-100"
                      : "bg-white"
                  } ${round.userChoice === round.scranB.id ? "ring-4 ring-yellow-400" : ""}`}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <img
                      src={round.scranB.imageUrl}
                      alt={round.scranB.name}
                      className="h-16 w-16 rounded-none border-2 border-black object-cover"
                    />
                    <div>
                      <p className="pixel-text font-bold text-white">
                        {round.scranB.name}
                      </p>
                      <p className="pixel-text text-sm text-white">
                        {round.scranB.price.toFixed(2)} ₽
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="pixel-text text-sm text-white">
                      👍 {round.scranB.likesPercentage}%
                    </span>
                    {round.userChoice === round.scranB.id && (
                      <span className="pixel-text text-sm font-bold text-yellow-600">
                        Твой выбор
                      </span>
                    )}
                    {round.correctChoice === round.scranB.id && (
                      <span className="pixel-text text-sm font-bold text-green-600">
                        ✓ Большинство
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
