"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnswerIndicators } from "@/components/answer-indicators";
import { ScoreDisplay } from "@/components/score-display";
import { AverageScoreDisplay } from "@/components/average-score-display";
import { ShareButton } from "@/components/share-button";
import type { UserAnswer } from "@/types/game";

interface GameResultProps {
  userAnswers: UserAnswer[];
  score: number;
  averageScore: number | null;
}

export function GameResult({ userAnswers, score, averageScore }: GameResultProps) {
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

        <AnswerIndicators answers={userAnswers} delayIncrement={0.1} />

        <div className="mb-8 space-y-4">
          <ScoreDisplay score={score} />
          <AverageScoreDisplay averageScore={averageScore !== null ? averageScore : score} />
        </div>

        <ShareButton userAnswers={userAnswers} score={score} />

        <Link
          href="/"
          className="pixel-btn mt-4 inline-block border-4 border-black bg-yellow-400 px-8 py-4 text-lg text-black hover:bg-yellow-300"
        >
          На главную
        </Link>
      </motion.div>
    </div>
  );
}
