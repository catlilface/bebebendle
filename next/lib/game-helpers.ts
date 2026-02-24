/**
 * Game helper utilities for daily game logic
 */

import type { DailyData, UserAnswer } from "@/types/daily";

/**
 * Find round data by round number
 */
export function findRoundByNumber(
  data: DailyData,
  roundNumber: number
): DailyData["rounds"][number] | undefined {
  return data.rounds.find((r) => r.roundNumber === roundNumber);
}

/**
 * Determine the correct scran ID based on like percentages
 */
export function determineCorrectScranId(
  scranAId: number,
  percentageA: number,
  scranBId: number,
  percentageB: number
): number {
  return percentageA >= percentageB ? scranAId : scranBId;
}

/**
 * Check if the user's choice was correct
 */
export function isAnswerCorrect(
  chosenScranId: number,
  correctScranId: number
): boolean {
  return chosenScranId === correctScranId;
}

/**
 * Build a UserAnswer object from vote result
 */
export function buildUserAnswer(
  roundNumber: number,
  isCorrect: boolean,
  chosenScranId: number,
  correctScranId: number,
  percentageA: number,
  percentageB: number
): UserAnswer {
  return {
    roundNumber,
    isCorrect,
    chosenScranId,
    correctScranId,
    percentageA,
    percentageB,
  };
}

/**
 * Prefetch images for the next round
 */
export function prefetchRoundImages(
  data: DailyData,
  nextRoundNumber: number
): void {
  if (typeof window === "undefined") return;

  const nextRound = findRoundByNumber(data, nextRoundNumber);
  if (!nextRound) return;

  const imgA = new window.Image();
  const imgB = new window.Image();
  imgA.src = nextRound.scranA.imageUrl;
  imgB.src = nextRound.scranB.imageUrl;
}
