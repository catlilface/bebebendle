/**
 * Scoring utilities for calculating percentages and scores
 */

export interface LikesData {
  numberOfLikes: number;
  numberOfDislikes: number;
}

/**
 * Calculate the percentage of likes for a scran
 * Returns 50% if there are no votes (neutral ground)
 */
export function getLikesPercentage(data: LikesData): number {
  const total = data.numberOfLikes + data.numberOfDislikes;
  if (total === 0) return 50;
  return Math.round((data.numberOfLikes / total) * 100);
}

/**
 * Calculate score from array of answers
 */
export function calculateScore(answers: { isCorrect: boolean }[]): number {
  return answers.filter((a) => a.isCorrect).length;
}

/**
 * Format share text for social sharing
 */
export function formatShareText(
  answers: { isCorrect: boolean }[],
  score: number
): string {
  const circles = answers.map((answer) => (answer.isCorrect ? "🟢" : "🔴")).join("");
  return `${circles} - ${score}/10\nhttps://bebebendle.ru`;
}
