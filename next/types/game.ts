/**
 * Game-specific types for the daily scrandle game
 */

export interface Scran {
  id: number;
  imageUrl: string;
  name: string;
  description: string | null;
  price: number;
  numberOfLikes: number;
  numberOfDislikes: number;
  approved?: boolean;
}

export interface Round {
  roundNumber: number;
  scrandleId: number;
  scranA: Scran;
  scranB: Scran;
}

export interface DailyData {
  date: string;
  totalRounds: number;
  rounds: Round[];
}

export interface UserAnswer {
  roundNumber: number;
  isCorrect: boolean;
  chosenScranId: number;
  correctScranId: number;
  percentageA: number;
  percentageB: number;
}

export interface DailyResult {
  date: string;
  score: number;
  totalRounds: number;
  userAnswers: UserAnswer[];
}

export type GameState =
  | { type: "loading" }
  | { type: "already-played"; result: DailyResult }
  | { type: "error"; message: string }
  | { type: "playing"; data: DailyData }
  | { type: "complete"; score: number; averageScore: number | null };
