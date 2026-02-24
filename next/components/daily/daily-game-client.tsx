"use client";

import { useDailyGame } from "@/hooks/use-daily-game";
import { LoadingState } from "@/components/daily/loading-state";
import { ErrorState } from "@/components/daily/error-state";
import { GameResult } from "@/components/daily/game-result";
import { GameBoard } from "@/components/daily/game-board";
import type { DailyData } from "@/types/game";

interface DailyGameClientProps {
  initialData: DailyData;
}

export function DailyGameClient({ initialData }: DailyGameClientProps) {
  const {
    gameState,
    currentRound,
    userAnswers,
    lastAnswer,
    showResult,
    isTransitioning,
    isVoting,
    handleVote,
  } = useDailyGame({ initialData });

  switch (gameState.type) {
    case "loading":
      return <LoadingState />;

    case "error":
      return <ErrorState message={gameState.message} />;

    case "complete":
      return (
        <GameResult
          userAnswers={userAnswers}
          score={gameState.score}
          averageScore={gameState.averageScore}
        />
      );

    case "playing":
      return (
        <GameBoard
          data={gameState.data}
          currentRound={currentRound}
          lastAnswer={lastAnswer}
          showResult={showResult}
          isTransitioning={isTransitioning}
          isVoting={isVoting}
          onVote={handleVote}
        />
      );

    default:
      return <ErrorState message="Неизвестное состояние" />;
  }
}
