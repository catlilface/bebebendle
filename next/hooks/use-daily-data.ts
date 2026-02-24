"use client";

import { useState } from "react";
import type { DailyData, GameState } from "@/types/game";

interface UseDailyDataReturn {
  dailyData: DailyData | null;
  gameState: GameState;
  setGameState: (state: GameState) => void;
}

export function useDailyData(initialData?: DailyData): UseDailyDataReturn {
  const [dailyData, _setDailyData] = useState<DailyData | null>(initialData || null);
  const [gameState, setGameState] = useState<GameState>(
    initialData ? { type: "playing", data: initialData } : { type: "loading" }
  );

  return {
    dailyData,
    gameState,
    setGameState,
  };
}
