"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnswerIndicators } from "@/components/answer-indicators";
import { ScoreDisplay } from "@/components/score-display";
import { ShareButton } from "@/components/share-button";
import type { DailyResult } from "@/types/game";

interface AlreadyPlayedProps {
  result: DailyResult;
}

export function AlreadyPlayed({ result }: AlreadyPlayedProps) {
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

        <AnswerIndicators answers={result.userAnswers} delayIncrement={0.05} />
        <ScoreDisplay score={result.score} className="mb-8" />
        <ShareButton userAnswers={result.userAnswers} score={result.score} />

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
