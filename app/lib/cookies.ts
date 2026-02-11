"use client";

import Cookies from "js-cookie";

export interface DailyGameResult {
  date: string;
  score: number;
  totalRounds: number;
  userAnswers: {
    roundNumber: number;
    isCorrect: boolean;
    chosenScranId: number;
    correctScranId: number;
    percentageA: number;
    percentageB: number;
  }[];
  playedAt: string;
}

const DAILY_GAME_COOKIE = "daily_game_result";
const COOKIE_EXPIRES = 1; // 1 day

export function hasPlayedToday(): boolean {
  const result = getTodayResult();
  if (!result) return false;
  
  const today = new Date().toISOString().split("T")[0];
  return result.date === today;
}

export function getTodayResult(): DailyGameResult | null {
  try {
    const cookieValue = Cookies.get(DAILY_GAME_COOKIE);
    if (!cookieValue) return null;
    
    const result: DailyGameResult = JSON.parse(cookieValue);
    const today = new Date().toISOString().split("T")[0];
    
    // Check if the result is from today
    if (result.date === today) {
      return result;
    }
    
    // Clear old cookie if it's from a different day
    Cookies.remove(DAILY_GAME_COOKIE);
    return null;
  } catch {
    return null;
  }
}

export function saveDailyResult(result: Omit<DailyGameResult, "playedAt">): void {
  const data: DailyGameResult = {
    ...result,
    playedAt: new Date().toISOString(),
  };
  
  // Set cookie to expire at end of day
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const expiresInHours = (tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  Cookies.set(DAILY_GAME_COOKIE, JSON.stringify(data), {
    expires: expiresInHours / 24, // Convert hours to days for js-cookie
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearDailyResult(): void {
  Cookies.remove(DAILY_GAME_COOKIE);
}
