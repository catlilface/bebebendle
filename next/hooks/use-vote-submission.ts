"use client";

import { useState, useCallback } from "react";
import type { DailyData, UserAnswer } from "@/types/game";

interface UseVoteSubmissionReturn {
  currentRound: number;
  userAnswers: UserAnswer[];
  lastAnswer: UserAnswer | null;
  isVoting: boolean;
  setIsVoting: (value: boolean) => void;
  addAnswer: (answer: UserAnswer) => void;
  incrementRound: () => void;
  getCorrectCount: () => number;
  resetLastAnswer: () => void;
}

export function useVoteSubmission(): UseVoteSubmissionReturn {
  const [currentRound, setCurrentRound] = useState(1);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [lastAnswer, setLastAnswer] = useState<UserAnswer | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const addAnswer = useCallback((answer: UserAnswer) => {
    setLastAnswer(answer);
    setUserAnswers((prev) => [...prev, answer]);
  }, []);

  const incrementRound = useCallback(() => {
    setCurrentRound((prev) => prev + 1);
  }, []);

  const getCorrectCount = useCallback(() => {
    return userAnswers.filter((a) => a.isCorrect).length;
  }, [userAnswers]);

  const resetLastAnswer = useCallback(() => {
    setLastAnswer(null);
  }, []);

  return {
    currentRound,
    userAnswers,
    lastAnswer,
    isVoting,
    setIsVoting,
    addAnswer,
    incrementRound,
    getCorrectCount,
    resetLastAnswer,
  };
}
