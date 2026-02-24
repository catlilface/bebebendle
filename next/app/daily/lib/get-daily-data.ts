"use server";

import { db } from "@/db/schema";
import { dailyScrandles, scrans } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { DailyData } from "@/types/game";

export async function getDailyData(): Promise<DailyData | null> {
  const today = new Date().toISOString().split("T")[0];

  const roundsData = await db
    .select({
      roundNumber: dailyScrandles.roundNumber,
      scranAId: dailyScrandles.scranAId,
      scranBId: dailyScrandles.scranBId,
    })
    .from(dailyScrandles)
    .where(eq(dailyScrandles.date, today))
    .orderBy(dailyScrandles.roundNumber);

  if (roundsData.length === 0) {
    return null;
  }

  const rounds = await Promise.all(
    roundsData.map(async (round) => {
      const [scranAData, scranBData] = await Promise.all([
        db.select().from(scrans).where(eq(scrans.id, round.scranAId)).limit(1),
        db.select().from(scrans).where(eq(scrans.id, round.scranBId)).limit(1),
      ]);

      const scranA = scranAData[0];
      const scranB = scranBData[0];

      return {
        roundNumber: round.roundNumber,
        scrandleId: round.roundNumber,
        scranA: {
          id: scranA.id,
          imageUrl: scranA.imageUrl,
          name: scranA.name,
          description: scranA.description,
          price: scranA.price,
          numberOfLikes: scranA.numberOfLikes,
          numberOfDislikes: scranA.numberOfDislikes,
        },
        scranB: {
          id: scranB.id,
          imageUrl: scranB.imageUrl,
          name: scranB.name,
          description: scranB.description,
          price: scranB.price,
          numberOfLikes: scranB.numberOfLikes,
          numberOfDislikes: scranB.numberOfDislikes,
        },
      };
    })
  );

  return {
    date: today,
    totalRounds: rounds.length,
    rounds,
  };
}
