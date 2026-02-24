"use client";

import { useCallback } from "react";
import { prefetchRoundImages } from "@/lib/game-helpers";
import type { DailyData } from "@/types/game";

interface UseImagePreloaderReturn {
  prefetchNextRound: (data: DailyData, nextRoundNumber: number) => void;
}

export function useImagePreloader(): UseImagePreloaderReturn {
  const prefetchNextRound = useCallback(
    (data: DailyData, nextRoundNumber: number) => {
      prefetchRoundImages(data, nextRoundNumber);
    },
    []
  );

  return {
    prefetchNextRound,
  };
}
