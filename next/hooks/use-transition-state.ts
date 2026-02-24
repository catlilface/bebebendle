"use client";

import { useState, useCallback } from "react";

interface UseTransitionStateReturn {
  showResult: boolean;
  isTransitioning: boolean;
  setShowResult: (value: boolean) => void;
  setIsTransitioning: (value: boolean) => void;
  startTransition: (callback: () => void) => void;
}

const RESULT_DELAY_MS = 1000;
const TRANSITION_DELAY_MS = 2000;

export function useTransitionState(): UseTransitionStateReturn {
  const [showResult, setShowResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback((callback: () => void) => {
    setTimeout(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        callback();
        setShowResult(false);
        setIsTransitioning(false);
      }, TRANSITION_DELAY_MS);
    }, RESULT_DELAY_MS);
  }, []);

  return {
    showResult,
    isTransitioning,
    setShowResult,
    setIsTransitioning,
    startTransition,
  };
}
