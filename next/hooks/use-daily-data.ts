"use client";

import { useState, useCallback } from "react";
import { hasPlayedToday } from "@/lib/cookies";
import type { DailyData, GameState } from "@/types/game";

interface UseDailyDataReturn {
  dailyData: DailyData | null;
  gameState: GameState;
  setGameState: (state: GameState) => void;
}

export function useDailyData(initialData?: DailyData): UseDailyDataReturn {
  const [dailyData, setDailyData] = useState<DailyData | null>(initialData || null);
  const [gameState, setGameState] = useState<GameState>(
    initialData ? { type: "playing", data: initialData } : { type: "loading" }
  );

  return {
    dailyData,
    gameState,
    setGameState,
  };
}
