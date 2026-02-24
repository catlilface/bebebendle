"use client";

import Link from "next/link";
import { RoundCard } from "@/components/daily/round-card";
import { ResultOverlay } from "@/components/daily/result-overlay";
import { TransitionOverlay } from "@/components/daily/transition-overlay";
import { VsBadge } from "@/components/daily/vs-badge";
import { findRoundByNumber } from "@/lib/game-helpers";
import type { DailyData, UserAnswer } from "@/types/game";

interface GameBoardProps {
  data: DailyData;
  currentRound: number;
  lastAnswer: UserAnswer | null;
  showResult: boolean;
  isTransitioning: boolean;
  isVoting: boolean;
  onVote: (scranId: number) => void;
}

export function GameBoard({
  data,
  currentRound,
  lastAnswer,
  showResult,
  isTransitioning,
  isVoting,
  onVote,
}: GameBoardProps) {
  const currentRoundData = findRoundByNumber(data, currentRound);

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

      <ResultOverlay answer={lastAnswer} isVisible={showResult} />
      <TransitionOverlay isVisible={isTransitioning} />

      <Link
        href="/"
        className="pixel-text absolute left-4 top-4 z-20 text-xl font-bold text-white transition-colors hover:text-yellow-300"
      >
        бебендл
      </Link>

      <div className="pixel-text absolute right-4 top-4 z-20 text-xl font-bold text-white">
        раунд {currentRound}/10
      </div>

      <div className="relative z-10 flex h-full w-full flex-col md:flex-row">
        <RoundCard
          scran={scranA}
          onVote={() => onVote(scranA.id)}
          isVoting={isVoting}
          position="left"
        />
        <RoundCard
          scran={scranB}
          onVote={() => onVote(scranB.id)}
          isVoting={isVoting}
          position="right"
        />
      </div>

      <VsBadge hidden={showResult} />
    </div>
  );
}
