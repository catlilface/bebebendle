"use server";

import { headers } from "next/headers";
import { db, scrans, dailyUserResults } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { checkRateLimit } from "../api/middleware/rateLimit";

async function getClientIpFromHeaders(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

function getLikesPercentage(scran: {
  numberOfLikes: number;
  numberOfDislikes: number;
}): number {
  const total = scran.numberOfLikes + scran.numberOfDislikes;
  if (total === 0) return 50;
  return Math.round((scran.numberOfLikes / total) * 100);
}

export async function submitDailyVote(
  roundNumber: number,
  chosenScranId: number,
  scranAId: number,
  scranBId: number,
  fingerprint: string | null
) {
  const clientIp = await getClientIpFromHeaders();
  
  const rateLimitResult = await checkRateLimit(
    `daily-vote:${clientIp}`,
    2,
    5
  );

  if (!rateLimitResult.allowed) {
    return { error: "Too many requests. Please wait.", status: 429 };
  }

  if (!roundNumber || !chosenScranId || !scranAId || !scranBId) {
    return { error: "Missing required fields", status: 400 };
  }

  const [scranAData, scranBData] = await Promise.all([
    db.select().from(scrans).where(eq(scrans.id, scranAId)).limit(1),
    db.select().from(scrans).where(eq(scrans.id, scranBId)).limit(1),
  ]);

  if (scranAData.length === 0 || scranBData.length === 0) {
    return { error: "Scrans not found", status: 404 };
  }

  const scranA = scranAData[0];
  const scranB = scranBData[0];

  const percentageA = getLikesPercentage(scranA);
  const percentageB = getLikesPercentage(scranB);

  const correctScranId = percentageA >= percentageB ? scranAId : scranBId;
  const isCorrect = chosenScranId === correctScranId;

  return {
    success: true,
    roundNumber,
    isCorrect,
    chosenScranId,
    correctScranId,
    percentageA,
    percentageB,
    fingerprint,
  };
}

export async function submitDailyResult(
  date: string,
  score: number,
  fingerprint: string | null
) {
  const clientIp = await getClientIpFromHeaders();
  
  const rateLimitResult = await checkRateLimit(
    `daily-result:${clientIp}`,
    1,
    10
  );

  if (!rateLimitResult.allowed) {
    return { error: "Too many requests. Please wait.", status: 429 };
  }

  if (!date || typeof score !== "number" || score < 0 || score > 10) {
    return { error: "Invalid date or score", status: 400 };
  }

  const existing = await db
    .select()
    .from(dailyUserResults)
    .where(
      and(
        eq(dailyUserResults.date, date),
        eq(dailyUserResults.sessionId, "temp")
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return {
      message: "Score already recorded",
      score: existing[0].score,
      alreadyPlayed: true,
    };
  }

  return { success: true, score, fingerprint };
}

export async function getDailyAverage(date: string) {
  const results = await db
    .select({
      score: dailyUserResults.score,
    })
    .from(dailyUserResults)
    .where(eq(dailyUserResults.date, date));

  if (results.length === 0) {
    return {
      date,
      totalUsers: 0,
      averageScore: null,
    };
  }

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const averageScore = Math.round((totalScore / results.length) * 10) / 10;

  return {
    date,
    totalUsers: results.length,
    averageScore,
  };
}
