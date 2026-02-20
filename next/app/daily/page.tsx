"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  hasPlayedToday,
  saveDailyResult,
  getTodayResult,
} from "../lib/cookies";
import { getFingerprint } from "../lib/fingerprint";
import { submitDailyVote, submitDailyResult, getDailyAverage } from "../actions/daily";
import { ShareButton } from "../components/ShareButton";

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
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [storedResult, setStoredResult] =
    useState<ReturnType<typeof getTodayResult>>(null);

  // Check if already played today
  useEffect(() => {
    getFingerprint();
    
    const played = hasPlayedToday();
    if (played) {
      const result = getTodayResult();
      setAlreadyPlayed(true);
      setStoredResult(result);
      setLoading(false);
    }
  }, []);

  const fetchDaily = useCallback(async () => {
    if (hasPlayedToday()) {
      return;
    }

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
    if (!alreadyPlayed) {
      fetchDaily();
    }
  }, [fetchDaily, alreadyPlayed]);

  const handleVote = async (chosenScranId: number) => {
    if (!dailyData || isVoting) return;

    const currentRoundData = dailyData.rounds.find(
      (r) => r.roundNumber === currentRound,
    );
    if (!currentRoundData) return;

    try {
      setIsVoting(true);
      const fingerprint = await getFingerprint();
      const result = await submitDailyVote(
        currentRound,
        chosenScranId,
        currentRoundData.scranA.id,
        currentRoundData.scranB.id,
        fingerprint
      );

      if ("error" in result) {
        setError(result.error || "Unknown error");
        setIsVoting(false);
        return;
      }

      if (result.success) {
        const answer: UserAnswer = {
          roundNumber: currentRound,
          isCorrect: result.isCorrect,
          chosenScranId: result.chosenScranId,
          correctScranId: result.correctScranId,
          percentageA: result.percentageA,
          percentageB: result.percentageB,
        };

        setUserAnswers((prev) => [...prev, answer]);
        setLastAnswer(answer);
        setShowResult(true);

        // Prefetch next round images immediately after successful vote
        if (currentRound < 10) {
          const nextRoundData = dailyData.rounds.find(
            (r) => r.roundNumber === currentRound + 1,
          );
          if (nextRoundData) {
            const imgA = new window.Image();
            const imgB = new window.Image();
            imgA.src = nextRoundData.scranA.imageUrl;
            imgB.src = nextRoundData.scranB.imageUrl;
          }
        }

        setTimeout(() => {
          setIsTransitioning(true);

          setTimeout(() => {
            setShowResult(false);
            setLastAnswer(null);

            if (currentRound < 10) {
              setCurrentRound((prev) => prev + 1);
              setIsTransitioning(false);
            } else {
              const correctCount = [...userAnswers, answer].filter(
                (a) => a.isCorrect,
              ).length;
              setUserScore(correctCount);
              setGameComplete(true);
              submitScore(correctCount);
            }
            setIsVoting(false);
          }, 2000);
        }, 1000);
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
      const fingerprint = await getFingerprint();
      await submitDailyResult(dailyData.date, score, fingerprint);

      const avgData = await getDailyAverage(dailyData.date);
      if (avgData.averageScore !== null) {
        setAverageScore(avgData.averageScore);
      }

      // Save to cookie
      saveDailyResult({
        date: dailyData.date,
        score,
        totalRounds: 10,
        userAnswers: [
          ...userAnswers,
          {
            roundNumber: currentRound,
            isCorrect: score > userScore, // This will be the last answer
            chosenScranId:
              userAnswers[userAnswers.length - 1]?.chosenScranId || 0,
            correctScranId:
              userAnswers[userAnswers.length - 1]?.correctScranId || 0,
            percentageA: userAnswers[userAnswers.length - 1]?.percentageA || 0,
            percentageB: userAnswers[userAnswers.length - 1]?.percentageB || 0,
          },
        ],
      });
    } catch (error) {
      console.error("Error submitting score:", error);
    } finally {
      setSubmittingScore(false);
    }
  };

  // Save results to cookie when game completes
  useEffect(() => {
    if (gameComplete && dailyData) {
      saveDailyResult({
        date: dailyData.date,
        score: userScore,
        totalRounds: 10,
        userAnswers,
      });
    }
  }, [gameComplete, dailyData, userScore, userAnswers]);

  if (loading) {
    return (
      <div className="retro-bg flex min-h-dvh items-center justify-center">
        <div className="retro-overlay absolute inset-0" />
        <div className="pixel-text relative z-10 text-2xl font-bold text-white">
          Загрузка...
        </div>
      </div>
    );
  }

  // Show already played screen
  if (alreadyPlayed && storedResult) {
    return (
      <div className="retro-bg flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="retro-overlay absolute inset-0" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-4xl text-center"
        >
          <h1 className="pixel-text mb-4 text-4xl font-bold text-white sm:text-5xl">
            Вы уже играли сегодня!
          </h1>

          <p className="pixel-text mb-8 text-xl text-white">
            Следующий дейлик будет доступен завтра
          </p>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {storedResult.userAnswers.map((answer, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={`pixel-btn flex h-12 w-12 items-center justify-center text-lg font-bold sm:h-14 sm:w-14 ${
                  answer.isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {answer.isCorrect ? "✓" : "✗"}
              </motion.div>
            ))}
          </div>

          <div className="mb-8 space-y-4">
            <div className="pixel-container rounded-2xl bg-zinc-900/80 p-6">
              <p className="pixel-text mb-2 text-lg text-white">
                Ваш результат
              </p>
              <p className="pixel-text text-5xl font-black text-white sm:text-6xl">
                {storedResult.score}/10
              </p>
            </div>
          </div>

          <ShareButton
            userAnswers={storedResult.userAnswers}
            score={storedResult.score}
          />

          <Link
            href="/"
            className="pixel-btn inline-block bg-yellow-400 border-4 border-black px-8 py-4 text-black text-lg hover:bg-yellow-300 mt-4"
          >
            На главную
          </Link>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="retro-bg flex min-h-dvh items-center justify-center">
        <div className="retro-overlay absolute inset-0" />
        <div className="relative z-10 text-center">
          <p className="pixel-text mb-6 text-xl text-white">{error}</p>
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

  if (!dailyData) {
    return (
      <div className="retro-bg flex min-h-dvh items-center justify-center">
        <div className="retro-overlay absolute inset-0" />
        <div className="relative z-10 text-center">
          <p className="pixel-text mb-6 text-xl text-white">
            Нет доступных блюд
          </p>
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

  if (gameComplete) {
    return (
      <div className="retro-bg flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="retro-overlay absolute inset-0" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-4xl text-center"
        >
          <h1 className="pixel-text mb-8 text-4xl font-bold text-white sm:text-5xl">
            Результаты
          </h1>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {userAnswers.map((answer, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`pixel-btn flex h-12 w-12 items-center justify-center text-lg font-bold sm:h-14 sm:w-14 ${
                  answer.isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {answer.isCorrect ? "✓" : "✗"}
              </motion.div>
            ))}
          </div>

          <div className="mb-8 space-y-4">
            <div className="pixel-container rounded-2xl bg-zinc-900/80 p-6">
              <p className="pixel-text mb-2 text-lg text-white">
                Ваш результат
              </p>
              <p className="pixel-text text-5xl font-black text-white sm:text-6xl">
                {userScore}/10
              </p>
            </div>

            {averageScore !== null && (
              <div className="pixel-container rounded-2xl bg-zinc-900/80 p-6">
                <p className="pixel-text mb-2 text-lg text-white">
                  Средний результат всех игроков
                </p>
                <p className="pixel-text text-5xl font-black text-zinc-300 sm:text-6xl">
                  {averageScore}/10
                </p>
              </div>
            )}

            {submittingScore && (
              <p className="pixel-text text-white">Сохранение результатов...</p>
            )}
          </div>

          <ShareButton userAnswers={userAnswers} score={userScore} />

          <Link
            href="/"
            className="pixel-btn inline-block bg-yellow-400 border-4 border-black px-8 py-4 text-black text-lg hover:bg-yellow-300 mt-4"
          >
            На главную
          </Link>
        </motion.div>
      </div>
    );
  }

  const currentRoundData = dailyData.rounds.find(
    (r) => r.roundNumber === currentRound,
  );

  if (!currentRoundData) {
    return (
      <div className="retro-bg flex min-h-dvh items-center justify-center">
        <div className="retro-overlay absolute inset-0" />
        <div className="pixel-text relative z-10 text-xl text-white">
          Раунд не найден
        </div>
      </div>
    );
  }

  const { scranA, scranB } = currentRoundData;

  return (
    <div className="retro-bg relative h-dvh w-full overflow-hidden">
      <div className="retro-overlay absolute inset-0" />

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
                    <p className="pixel-text text-5xl font-black text-white sm:text-7xl">
                      {lastAnswer.percentageA}%
                    </p>
                  </div>
                  <div className="pixel-text text-4xl font-black text-white sm:text-6xl">
                    VS
                  </div>
                  <div className="text-center">
                    <p className="pixel-text text-5xl font-black text-white sm:text-7xl">
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
        className="pixel-text absolute left-4 top-4 z-20 text-xl font-bold text-white transition-colors hover:text-yellow-300"
      >
        бебендл
      </Link>

      {/* Round indicator */}
      <div className="pixel-text absolute right-4 top-4 z-20 text-xl font-bold text-white">
        раунд {currentRound}/10
      </div>

      {/* Two columns - stacked on mobile, side by side on desktop */}
      <div className="relative z-10 flex h-full w-full flex-col md:flex-row">
        {/* Scran A */}
        <button
          onClick={() => handleVote(scranA.id)}
          disabled={isVoting}
          className="group relative h-1/2 w-full overflow-hidden border-b-4 border-black disabled:cursor-default md:h-full md:w-1/2 md:border-b-0 md:border-r-4"
        >
          <img
            src={scranA.imageUrl}
            alt={scranA.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <h2 className="pixel-text mb-1 text-lg font-bold text-white sm:text-xl">
              {scranA.name}
            </h2>
            {scranA.description && (
              <p className="pixel-text mb-2 line-clamp-2 text-xs text-zinc-300 sm:text-sm">
                {scranA.description}
              </p>
            )}
            <p className="pixel-text text-sm font-semibold text-white sm:text-base">
              {scranA.price.toFixed(2)} ₽
            </p>
          </div>
        </button>

        {/* Scran B */}
        <button
          onClick={() => handleVote(scranB.id)}
          disabled={isVoting}
          className="group relative h-1/2 w-full overflow-hidden disabled:cursor-default md:h-full md:w-1/2"
        >
          <img
            src={scranB.imageUrl}
            alt={scranB.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <h2 className="pixel-text mb-1 text-lg font-bold text-white sm:text-xl">
              {scranB.name}
            </h2>
            {scranB.description && (
              <p className="pixel-text mb-2 line-clamp-2 text-xs text-zinc-300 sm:text-sm">
                {scranB.description}
              </p>
            )}
            <p className="pixel-text text-sm font-semibold text-white sm:text-base">
              {scranB.price.toFixed(2)} ₽
            </p>
          </div>
        </button>
      </div>

      {/* VS Badge */}
      {!showResult && (
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="pixel-btn flex h-12 w-12 items-center justify-center bg-white text-lg font-black text-black md:h-16 md:w-16 md:text-xl lg:h-20 lg:w-20 lg:text-2xl">
            VS
          </div>
        </div>
      )}
    </div>
  );
}
