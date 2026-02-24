"use client";

const COOKIE_NAME = "daily_bebendle";

type DailyResult = {
  date: string;
  score: number;
  totalRounds: number;
  userAnswers: Array<{
    roundNumber: number;
    isCorrect: boolean;
    chosenScranId: number;
    correctScranId: number;
    percentageA: number;
    percentageB: number;
  }>;
};

export function hasPlayedToday(): boolean {
  if (typeof document === "undefined") return false;

  const result = getTodayResult();
  if (!result) return false;

  const today = new Date().toISOString().split("T")[0];
  return result.date === today;
}

export function saveDailyResult(result: DailyResult): void {
  if (typeof document === "undefined") return;

  const now = new Date();

  // Cookie expires at 00:00 UTC (start of next day)
  const tomorrowUTC = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
    ),
  );

  const expires = tomorrowUTC.toUTCString();
  const cookieValue = encodeURIComponent(JSON.stringify(result));
  document.cookie = `${COOKIE_NAME}=${cookieValue}; expires=${expires}; path=/; SameSite=Strict`;
}

export function getTodayResult(): DailyResult | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  const cookie = cookies.find((c) => c.trim().startsWith(`${COOKIE_NAME}=`));

  if (!cookie) return null;

  try {
    const value = cookie.split("=")[1];
    const result = JSON.parse(decodeURIComponent(value)) as DailyResult;

    const today = new Date().toISOString().split("T")[0];
    if (result.date !== today) return null;

    return result;
  } catch {
    return null;
  }
}
