"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Scran = {
  id: number;
  imageUrl: string;
  name: string;
  description: string | null;
  price: number;
  numberOfLikes: number;
  numberOfDislikes: number;
};

type Round = {
  roundNumber: number;
  scrandleId: number;
  scranA: Scran;
  scranB: Scran;
};

type DailyData = {
  date: string;
  totalRounds: number;
  rounds: Round[];
};

type UserAnswer = {
  roundNumber: number;
  isCorrect: boolean;
  chosenScranId: number;
  correctScranId: number;
  percentageA: number;
  percentageB: number;
};

export default function DailyPage() {
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentRound, setCurrentRound] = useState(1);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<UserAnswer | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [submittingScore, setSubmittingScore] = useState(false);

  const fetchDaily = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(`/api/daily?date=${today}`);

      if (response.ok) {
        const data = await response.json();
        setDailyData(data);
        setError("");
      } else if (response.status === 404) {
        setError("На сегодня нет дейлика");
      } else {
        setError("Не удалось загрузить дейлик");
      }
    } catch {
      setError("Произошла ошибка");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDaily();
  }, [fetchDaily]);

  const handleVote = async (chosenScranId: number) => {
    if (!dailyData || isVoting) return;

    const currentRoundData = dailyData.rounds.find(
      (r) => r.roundNumber === currentRound
    );
    if (!currentRoundData) return;

    try {
      setIsVoting(true);
      const response = await fetch("/api/daily/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roundNumber: currentRound,
          chosenScranId,
          scranAId: currentRoundData.scranA.id,
          scranBId: currentRoundData.scranB.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const answer: UserAnswer = {
          roundNumber: currentRound,
          isCorrect: data.isCorrect,
          chosenScranId: data.chosenScranId,
          correctScranId: data.correctScranId,
          percentageA: data.percentageA,
          percentageB: data.percentageB,
        };

        setUserAnswers((prev) => [...prev, answer]);
        setLastAnswer(answer);
        setShowResult(true);

        // Wait 5 seconds then transition
        setTimeout(() => {
          setIsTransitioning(true);
          
          // Fade out for 2 seconds
          setTimeout(() => {
            setShowResult(false);
            setLastAnswer(null);
            
            if (currentRound < 10) {
              setCurrentRound((prev) => prev + 1);
              setIsTransitioning(false);
            } else {
              // Game complete
              const correctCount = [...userAnswers, answer].filter(
                (a) => a.isCorrect
              ).length;
              setUserScore(correctCount);
              setGameComplete(true);
              submitScore(correctCount);
            }
            setIsVoting(false);
          }, 2000);
        }, 5000);
      } else {
        setError("Не удалось обработать голос");
        setIsVoting(false);
      }
    } catch {
      setError("Произошла ошибка");
      setIsVoting(false);
    }
  };

  const submitScore = async (score: number) => {
    if (!dailyData) return;

    try {
      setSubmittingScore(true);
      await fetch("/api/daily/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dailyData.date,
          score,
        }),
      });

      // Fetch average score
      const avgResponse = await fetch(`/api/daily/results?date=${dailyData.date}`);
      if (avgResponse.ok) {
        const avgData = await avgResponse.json();
        setAverageScore(avgData.averageScore);
      }
    } catch (error) {
      console.error("Error submitting score:", error);
    } finally {
      setSubmittingScore(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-2xl font-bold text-zinc-50">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="mb-4 text-xl text-zinc-400">{error}</p>
          <Link
            href="/"
            className="rounded-full bg-white px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            ← На главную
          </Link>
        </div>
      </div>
    );
  }

  if (!dailyData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="mb-4 text-xl text-zinc-400">Нет доступных блюд</p>
          <Link
            href="/"
            className="rounded-full bg-white px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            ← На главную
          </Link>
        </div>
      </div>
    );
  }

  // Results screen
  if (gameComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="mb-8 text-4xl font-bold text-white sm:text-5xl">
            Результаты
          </h1>

          {/* Circles showing answers */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {userAnswers.map((answer, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold sm:h-14 sm:w-14 ${
                  answer.isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {answer.isCorrect ? "✓" : "✗"}
              </motion.div>
            ))}
          </div>

          {/* Scores */}
          <div className="mb-8 space-y-4">
            <div className="rounded-2xl bg-zinc-900 p-6">
              <p className="mb-2 text-lg text-zinc-400">Ваш результат</p>
              <p className="text-5xl font-black text-white sm:text-6xl">
                {userScore}/10
              </p>
            </div>

            {averageScore !== null && (
              <div className="rounded-2xl bg-zinc-900 p-6">
                <p className="mb-2 text-lg text-zinc-400">
                  Средний результат всех игроков
                </p>
                <p className="text-5xl font-black text-zinc-300 sm:text-6xl">
                  {averageScore}/10
                </p>
              </div>
            )}

            {submittingScore && (
              <p className="text-zinc-500">Сохранение результатов...</p>
            )}
          </div>

          <Link
            href="/"
            className="inline-block rounded-full bg-white px-8 py-4 font-bold text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            ← На главную
          </Link>
        </motion.div>
      </div>
    );
  }

  const currentRoundData = dailyData.rounds.find(
    (r) => r.roundNumber === currentRound
  );

  if (!currentRoundData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-xl text-zinc-400">Раунд не найден</div>
      </div>
    );
  }

  const { scranA, scranB } = currentRoundData;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-zinc-950">
      {/* Result Overlay */}
      <AnimatePresence>
        {showResult && lastAnswer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-30 pointer-events-none ${
              lastAnswer.isCorrect
                ? "shadow-[inset_0_0_150px_80px_rgba(34,197,94,0.6)]"
                : "shadow-[inset_0_0_150px_80px_rgba(239,68,68,0.6)]"
            }`}
            style={{
              boxShadow: lastAnswer.isCorrect
                ? "inset 0 0 150px 80px rgba(34,197,94,0.6), inset 0 0 300px 150px rgba(34,197,94,0.3)"
                : "inset 0 0 150px 80px rgba(239,68,68,0.6), inset 0 0 300px 150px rgba(239,68,68,0.3)",
            }}
          >
            <div className="flex h-full items-center justify-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-8 sm:gap-16">
                  <div className="text-center">
                    <p className="text-5xl font-black text-white sm:text-7xl">
                      {lastAnswer.percentageA}%
                    </p>
                  </div>
                  <div className="text-4xl font-black text-white sm:text-6xl">
                    VS
                  </div>
                  <div className="text-center">
                    <p className="text-5xl font-black text-white sm:text-7xl">
                      {lastAnswer.percentageB}%
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="fixed inset-0 z-40 bg-black"
          />
        )}
      </AnimatePresence>

      {/* Back link */}
      <Link
        href="/"
        className="absolute left-4 top-4 z-20 text-xl font-bold text-white transition-colors hover:text-zinc-300"
      >
        ← бебендл
      </Link>

      {/* Round indicator */}
      <div className="absolute right-4 top-4 z-20 text-xl font-bold text-white">
        Раунд {currentRound}/10
      </div>

      {/* Two columns */}
      <div className="flex h-full w-full">
        {/* Scran A */}
        <button
          onClick={() => handleVote(scranA.id)}
          disabled={isVoting}
          className="group relative h-full w-1/2 overflow-hidden border-r border-zinc-800 disabled:cursor-default"
        >
          {/* Image */}
          <img
            src={scranA.imageUrl}
            alt={scranA.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Info at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <h2 className="mb-1 text-lg font-bold text-white sm:text-xl">
              {scranA.name}
            </h2>
            {scranA.description && (
              <p className="mb-2 line-clamp-2 text-xs text-zinc-300 sm:text-sm">
                {scranA.description}
              </p>
            )}
            <p className="text-sm font-semibold text-white sm:text-base">
              {scranA.price.toFixed(2)} ₽
            </p>
          </div>
        </button>

        {/* Scran B */}
        <button
          onClick={() => handleVote(scranB.id)}
          disabled={isVoting}
          className="group relative h-full w-1/2 overflow-hidden disabled:cursor-default"
        >
          {/* Image */}
          <img
            src={scranB.imageUrl}
            alt={scranB.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Info at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <h2 className="mb-1 text-lg font-bold text-white sm:text-xl">
              {scranB.name}
            </h2>
            {scranB.description && (
              <p className="mb-2 line-clamp-2 text-xs text-zinc-300 sm:text-sm">
                {scranB.description}
              </p>
            )}
            <p className="text-sm font-semibold text-white sm:text-base">
              {scranB.price.toFixed(2)} ₽
            </p>
          </div>
        </button>
      </div>

      {/* VS Badge */}
      {!showResult && (
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-black text-zinc-900 shadow-2xl sm:h-20 sm:w-20 sm:text-2xl">
            VS
          </div>
        </div>
      )}
    </div>
  );
}
